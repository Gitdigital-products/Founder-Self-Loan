1. High‑level architecture

Core idea:  
A small service that:

- Listens for events (KYCAPPROVED, M1APPROVED, etc.)
- Consults the workflow config
- Updates the ledger
- Calls the KYC validator when needed
- Emits the next event (or disbursement task)

Main components:

- WorkflowEngine — state machine runner
- LedgerService — reads/writes loan/milestone/disbursement records
- KycAdapter — wraps your existing KYC validator
- DisbursementOrchestrator — creates “to be paid” records (you can keep payment manual)
- EventBus — simple in‑process pub/sub or message queue

---

2. Core types (TypeScript)

`ts
// src/types/events.ts
export type WorkflowEventType =
  | 'KYC_SUBMITTED'
  | 'KYC_APPROVED'
  | 'KYC_REJECTED'
  | 'M1DOCSSUBMITTED'
  | 'M1_APPROVED'
  | 'M1_REJECTED'
  | 'M2BANKDOCS_SUBMITTED'
  | 'M2_APPROVED'
  | 'M2_REJECTED'
  | 'LOAN_ISSUED'
  | 'LOANAGEREACHED12MONTHS'
  | 'GOVERNANCEDECISIONKEEPZEROINTEREST'
  | 'GOVERNANCEDECISIONSETNEWTERMS'
  | 'GOVERNANCEDECISIONFORGIVE_LOAN'
  | 'LOANPAIDOFF'
  | 'CANCELLEDBYGOVERNANCE';

export interface WorkflowEvent {
  type: WorkflowEventType;
  loanId: string;
  founderId: string;
  payload?: Record<string, unknown>;
  occurredAt: string;
}
`

---

3. Workflow engine skeleton

`ts
// src/workflow/WorkflowEngine.ts
import { WorkflowEvent } from '../types/events';
import { LedgerService } from '../ledger/LedgerService';
import { KycAdapter } from '../kyc/KycAdapter';
import { DisbursementOrchestrator } from '../payments/DisbursementOrchestrator';
import workflowConfig from '../../config/workflows/founderloanv1.json';

export class WorkflowEngine {
  constructor(
    private ledger: LedgerService,
    private kyc: KycAdapter,
    private disbursements: DisbursementOrchestrator
  ) {}

  async handleEvent(event: WorkflowEvent): Promise<void> {
    const loan = await this.ledger.getLoan(event.loanId);
    const currentState = loan.statusstate; // e.g. "LOANACTIVE"

    const stateConfig = workflowConfig.states.find(
      (s) => s.id === currentState
    );
    if (!stateConfig) throw new Error(Unknown state: ${currentState});

    const transition = stateConfig.transitions?.find(
      (t: any) => t.on === event.type
    );
    if (!transition) {
      // no transition for this event in this state; log and exit
      await this.ledger.appendLog(loan.loan_id, {
        timestamp: new Date().toISOString(),
        actor: 'system',
        event: IGNOREDEVENT${event.type},
        details: No transition from state ${currentState}
      });
      return;
    }

    // handle any actions (e.g. trigger disbursement)
    if (transition.actions) {
      for (const action of transition.actions) {
        await this.handleAction(action, loan, event);
      }
    }

    // move to next state
    await this.ledger.updateState(loan.loan_id, transition.to);
  }

  private async handleAction(
    action: any,
    loan: any,
    event: WorkflowEvent
  ): Promise<void> {
    switch (action.trigger) {
      case 'DISBURSEMENT_1':
        await this.disbursements.createDisbursement(
          loan.loan_id,
          'D1FILINGFEE'
        );
        break;
      case 'DISBURSEMENT_2':
        await this.disbursements.createDisbursement(
          loan.loan_id,
          'D2REMAININGFUNDS'
        );
        break;
      default:
        await this.ledger.appendLog(loan.loan_id, {
          timestamp: new Date().toISOString(),
          actor: 'system',
          event: UNKNOWNACTION${action.trigger},
          details: ''
        });
    }
  }
}
`

---

4. KYC adapter wiring

`ts
// src/kyc/KycAdapter.ts
import { KycValidator, MilestoneSubmission } from './validatorTypes';
import { WorkflowEngine } from '../workflow/WorkflowEngine';

export class KycAdapter {
  constructor(
    private validator: KycValidator,
    private workflow: WorkflowEngine
  ) {}

  async handleKycSubmission(founderId: string, loanId: string) {
    const result = await this.validator.verifyKyc(founderId);

    await this.workflow.handleEvent({
      type: result.success ? 'KYCAPPROVED' : 'KYCREJECTED',
      founderId,
      loanId,
      occurredAt: new Date().toISOString(),
      payload: result.metadata
    });
  }

  async handleMilestoneSubmission(submission: MilestoneSubmission) {
    const result = await this.validator.verifyMilestone(submission);

    const eventType =
      submission.milestoneId === 'M1FORMATIONDOCS'
        ? result.approved
          ? 'M1_APPROVED'
          : 'M1_REJECTED'
        : result.approved
        ? 'M2_APPROVED'
        : 'M2_REJECTED';

    await this.workflow.handleEvent({
      type: eventType,
      founderId: submission.context.founderId,
      loanId: submission.context.loanId,
      occurredAt: new Date().toISOString(),
      payload: result.metadata
    });
  }
}
`

---

5. Disbursement orchestrator (off‑chain, manual‑friendly)

`ts
// src/payments/DisbursementOrchestrator.ts
import { LedgerService } from '../ledger/LedgerService';

export class DisbursementOrchestrator {
  constructor(private ledger: LedgerService) {}

  async createDisbursement(loanId: string, disbursementId: 'D1FILINGFEE' | 'D2REMAININGFUNDS') {
    const loan = await this.ledger.getLoan(loanId);

    // compute amount
    const amount =
      disbursementId === 'D1FILINGFEE'
        ? 50
        : loan.principal_amount - 50;

    await this.ledger.createDisbursementRecord({
      disbursement_id: disbursementId,
      loan_id: loanId,
      founderid: loan.founderid,
      amount,
      status: 'NOT_PAID',
      pay_to:
        disbursementId === 'D1FILINGFEE'
          ? 'founder'
          : 'business_account'
    });

    // you can also emit a Slack notification here
  }
}
`

---

6. How this plays out in reality

- Founder submits KYC → KycAdapter.handleKycSubmission → KYCAPPROVED → engine moves loan to ELIGIBLEFOR_LOAN.
- You issue the loan → LOANISSUED → state becomes LOANACTIVE.
- Founder uploads formation docs → handleMilestoneSubmission(M1) → M1APPROVED → engine triggers DISBURSEMENT1 → disbursement record created.
- Same for M2 → remaining funds disbursement.
- After 12 months, a cron job emits LOANAGEREACHED12MONTHS → engine moves to INTERESTREVIEWWINDOW → waits for governance decision.

All off‑chain. All logged. Zero user error if the UI is clean.

---


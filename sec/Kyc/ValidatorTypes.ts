export type MilestoneId = 'M1_FORMATION_DOCS' | 'M2_BUSINESS_BANK_ACCOUNT';

export interface KycContext {
  founderId: string;
  loanId: string;
}

export interface KycResult {
  success: boolean;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface MilestoneSubmission {
  milestoneId: MilestoneId;
  context: KycContext;
  payload: {
    articlesOfOrganizationUrl?: string;
    stateFilingReceiptUrl?: string;
    bankLetterUrl?: string;
    bankAccountMetadata?: Record<string, unknown>;
  };
}

export interface KycValidator {
  verifyKyc(founderId: string): Promise<KycResult>; // emits KYC_APPROVED / KYC_REJECTED
  verifyMilestone(submission: MilestoneSubmission): Promise<{
    approved: boolean;
    reason?: string;
    metadata?: Record<string, unknown>;
    event:
      | 'M1_APPROVED'
      | 'M1_REJECTED'
      | 'M2_APPROVED'
      | 'M2_REJECTED';
  }>;
}

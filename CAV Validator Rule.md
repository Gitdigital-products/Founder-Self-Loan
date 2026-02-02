# CAV Validator Rule Sheet

Compliance • Auditability • Validation

This rule sheet defines the full set of validation requirements for the Loan Ledger CAV Validator.  
Every ledger entry must pass these rules before being accepted into the authoritative ledger.

---

## 1. Column Validation Rules

Each row must contain all required columns:

| Column | Rule |
|--------|------|
| Date | Must be ISO‑8601 (YYYY‑MM‑DD). Cannot be in the future. |
| Type | Must be one of: disbursement, repayment, forgiveness, correction. |
| Amount | Must be a positive decimal. No negative values. |
| Category | Must match allowed categories for the given Type. |
| Purpose/Notes | Required. Minimum 5 characters. |
| Source of Funds | Required for disbursement & repayment. Must be personal-card, personal-bank, company-bank, or N/A for forgiveness. |
| Receipt/Evidence Link | Required for disbursement & repayment. Optional for forgiveness. Must be a valid URL or N/A. |
| Running Balance | Must be correct based on previous row. |
| Reviewer | Required. Must match founder initials. |
| Attachments | Optional. If present, must be valid URLs or comma‑separated list. |

---

## 2. Type‑Specific Rules

### 2.1 Disbursement Rules
- Amount increases the running balance.
- Source of Funds must be a personal payment method.
- Receipt/Evidence Link must be present.
- Category must be one of:
  - hardware
  - software
  - services
  - operations
  - infrastructure

### 2.2 Repayment Rules
- Amount decreases the running balance.
- Source of Funds must be company-bank.
- Receipt/Evidence Link must be present.
- Category must be repayment.

### 2.3 Forgiveness Rules
- Amount decreases the running balance.
- Source of Funds must be N/A.
- Receipt/Evidence Link must be N/A.
- Category must be forgiveness.
- Purpose/Notes must include a milestone, justification, or resolution reference.

## 2.4 Correction Rules
- Must reference the corrected row in Purpose/Notes.
- Must not modify historical rows.
- Must adjust running balance accordingly.

---

## 3. Running Balance Rules

The validator enforces:

### 3.1 Deterministic Balance
`
newbalance = previousbalance 
              + disbursement_amount 
              - repayment_amount 
              - forgiveness_amount
`

### 3.2 No Negative Balances
Running balance must never drop below zero.

### 3.3 No Jumps or Gaps
- Every row must reference the previous row’s balance.
- No missing rows.
- No duplicate dates + amounts + types.

---

## 4. Evidence & Traceability Rules

### 4.1 Receipts
- Must match the Amount.
- Must be legible.
- Must include vendor, date, and item/service.

### 4.2 Payment Method Verification
- Personal card/bank must match founder identity.
- Company bank must match business account.

### 4.3 URL Validation
- Must be HTTPS.
- Must not be empty.
- Must not be placeholder text.

---

## 5. Governance Rules

## 5.1 Reviewer Requirement
- Every row must be reviewed by the Founder (RK or configured initials).
- Reviewer initials must match the configured governance matrix.

### 5.2 Forgiveness Governance
- Forgiveness entries must:
  - Include justification
  - Optionally reference a Founder Resolution
  - Pass milestone validation if linked

### 5.3 Amendment Rules
- Any change to ledger structure requires a governance amendment.
- Validator must reject entries using deprecated columns.

---

## 6. Temporal Rules

### 6.1 Chronological Order
- Dates must be strictly non‑decreasing.
- No future dates.

### 6.2 Logging Window
- Disbursements must be logged within 7 days.
- Repayments must be logged within 3 days.
- Forgiveness events must be logged within 14 days.

---

## 7. Anti‑Fraud Rules

### 7.1 Duplicate Detection
Reject if:
- Same amount + same date + same category + same source.

### 7.2 Impossible Patterns
Reject if:
- Repayment exceeds current balance.
- Forgiveness exceeds current balance.
- Disbursement with N/A receipt.

### 7.3 Tampering Detection
Reject if:
- Historical rows modified.
- Running balance mismatch.
- Reviewer initials missing.

---

## 8. Required Metadata

The validator must check for:

- Ledger version (ledger_version: 1.0.0)
- Governance version (governance_version: 1.0.0)
- Last validated timestamp
- Hash of last authoritative ledger

---

## 9. Validator Output Format

The validator must output:

Decision
- valid
- invalid
- needs_review

Rationale
Human‑readable explanation.

Checklist
List of passed/failed rules.

Next Action
Clear instruction for fixing or approving.

---


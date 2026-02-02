# Loan Ledger Guide — Founder Working‑Capital Loan

```markdown

Loan Ledger Guide

The Loan Ledger is the authoritative operational record for the Founder Working‑Capital Loan.  
It tracks every disbursement, repayment, and forgiveness event with full transparency and auditability.

This guide defines the required columns, validation rules, workflows, and examples.

---

## 1. Ledger Purpose

The ledger exists to:

- Maintain strict separation between personal and business finances  
- Provide a clean, traceable record for taxes, audits, and future partners  
- Protect co‑founder trust through transparent documentation  
- Support optional credit reporting or financial summaries  
- Serve as the single source of truth for the loan balance  

---

## 2. Required Columns

Every row in the ledger must include the following fields:

| Column | Description |
|-------|-------------|
| Date | The date the transaction occurred (not the date logged). |
| Type | disbursement, repayment, or forgiveness. |
| Amount | Positive number representing the transaction amount. |
| Category | Hardware, software, services, operations, repayment, forgiveness. |
| Purpose / Notes | Clear explanation of what the transaction was for. |
| Source of Funds | Payment method used (e.g., personal card, bank transfer). |
| Receipt / Evidence Link | URL or file reference to receipt, invoice, or statement. |
| Running Balance | Updated principal balance after this entry. |
| Reviewer | Founder initials confirming the entry is correct. |
| Attachments | Optional: GitHub issue, milestone, roadmap link. |

---

## 3. Transaction Types

### 3.1 Disbursement
A disbursement is when the Founder pays for a business expense personally.

Rules:
- Must include a receipt or invoice  
- Must be business‑related  
- Must be logged within 7 days  
- Must update the running balance  

### 3.2 Repayment
A repayment is when the Company pays the Founder back.

Rules:
- Only allowed when the Company is financially healthy  
- Must include bank transfer confirmation  
- Must reduce the running balance  

### 3.3 Forgiveness
A forgiveness event reduces the principal without repayment.

Rules:
- Founder‑initiated only  
- Must include a reason or milestone  
- Optional: Founder Resolution amendment  
- Must reduce the running balance  

---

## 4. Validation Rules

To maintain audit‑grade integrity:

### 4.1 Every entry must be traceable
- Receipts must match amounts  
- Dates must align with statements  
- Payment methods must be identifiable  

### 4.2 No mixed transactions
Each row represents one transaction only.

### 4.3 No negative amounts
Amounts are always positive; the Type determines direction.

### 4.4 Running balance must always be correct
- Disbursement → increases balance  
- Repayment → decreases balance  
- Forgiveness → decreases balance  

### 4.5 No retroactive edits without annotation
If a correction is needed:
- Add a new row labeled correction  
- Do not modify historical entries  

---

## 5. Ledger Workflow

### 5.1 Adding a Disbursement
1. Founder pays for a business expense.  
2. Company logs the entry with all required fields.  
3. Founder reviews and approves.  
4. Ledger becomes authoritative.

### 5.2 Adding a Repayment
1. Company confirms repayment will not impair operations.  
2. Company transfers funds to Founder.  
3. Entry is logged with confirmation.  
4. Founder reviews and approves.

### 5.3 Adding Forgiveness
1. Founder decides to forgive principal.  
2. Entry is logged with reason.  
3. Optional: Resolution amendment.  
4. Founder approves.

---

## 6. Example Entries

Example: Disbursement
| Date | Type | Amount | Category | Purpose | Source | Receipt | Balance | Reviewer |
|------|------|--------|----------|---------|--------|---------|---------|----------|
| 2026‑01‑12 | disbursement | 1299.00 | hardware | MacBook Air for development | Personal Visa | link | 1299.00 | RK |

Example: Repayment
| Date | Type | Amount | Category | Purpose | Source | Receipt | Balance | Reviewer |
|------|------|--------|----------|---------|--------|---------|---------|----------|
| 2026‑04‑03 | repayment | 300.00 | repayment | Partial repayment | Company Bank | link | 999.00 | RK |

Example: Forgiveness
| Date | Type | Amount | Category | Purpose | Source | Receipt | Balance | Reviewer |
|------|------|--------|----------|---------|--------|---------|---------|----------|
| 2026‑06‑01 | forgiveness | 500.00 | forgiveness | Milestone: v1.0 launch | N/A | N/A | 499.00 | RK |

---

## 7. Quarterly Review

Every quarter, the Company should:

- Reconcile ledger with receipts  
- Verify running balance  
- Export a snapshot for records  
- Review for potential repayments  
- Review for potential forgiveness events  

---

## 8. Annual Summary

At year‑end, generate:

- Total disbursements  
- Total repayments  
- Total forgiveness  
- Ending balance  
- Notes on major milestones  

This summary may be shared with partners or used for taxes.

---

## 9. Ledger Storage & Backups

The ledger must be:

- Stored in Git  
- Version‑controlled  
- Backed up automatically  
- Linked from the documentation site  
- Exportable to CSV or PDF for audits  

---

## 10. Canonical Location

The canonical ledger file lives at:

`
/ledger/loan-ledger.csv
`

All documentation must reference this file as the single source of truth.
`

---

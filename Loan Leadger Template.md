Loan Ledger Template (Clean, Deterministic, Audit‑Ready)

`
GITDIGITAL PRODUCTS LLC  
FOUNDER LOAN LEDGER

Loan Name: Founder Working‑Capital Loan  
Lender: Richard Duane Kindler  
Borrower: GitDigital Products LLC  
Start Date:   
Status: Active

COLUMNS:
-----------------------------------------------------------------------------------------
| Date | Type | Amount | Running Balance | Source of Funds | Notes / Milestone Links   |
-----------------------------------------------------------------------------------------

TYPE VALUES:
• DISBURSEMENT — Founder contributes capital to the LLC  
• REPAYMENT — LLC repays Founder  
• FORGIVENESS — Founder forgives part of the balance  
• ADJUSTMENT — Administrative correction (rare)

RUNNING BALANCE LOGIC:
• Start at $0  
• Add DISBURSEMENT amounts  
• Subtract REPAYMENT amounts  
• Subtract FORGIVENESS amounts  

EXAMPLE ENTRIES:
-----------------------------------------------------------------------------------------
| 2026‑02‑01 | DISBURSEMENT | $350 | $350 | Credit Card | Laptop RAM upgrade          |
| 2026‑02‑10 | DISBURSEMENT | $120 | $470 | Credit Card | Domain + hosting            |
| 2026‑03‑05 | FORGIVENESS  | $100 | $370 | N/A         | Milestone: OGS prototype    |
-----------------------------------------------------------------------------------------

NOTES:
• Ledger must be updated immediately after each transaction.  
• Ledger is the authoritative record for credit reporting and governance.  
• Ledger supports audits, taxes, and future financing.  

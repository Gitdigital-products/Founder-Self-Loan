# CSV Error Code Catalog

Deterministic • Machine‑Readable • Human‑Auditable

This catalog defines every error the CSV validator may emit when validating the loan-ledger.csv file.  
Each error includes:

- Code — stable identifier for CI/CD  
- Severity — error, warning, or blocker  
- Description — human‑readable explanation  
- Fix — what the contributor must do  

---

# 1. File‑Level Errors

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| CSV001 | blocker | Missing header row | Add the required header row in exact order |
| CSV002 | blocker | Unexpected column count | Ensure exactly 10 columns |
| CSV003 | error | Extra or unknown columns | Remove any columns not in the spec |
| CSV004 | error | Empty file | Add header row and at least one entry |
| CSV005 | error | Non‑UTF‑8 encoding | Save file as UTF‑8 |
| CSV006 | error | Trailing commas detected | Remove trailing commas from rows |
| CSV007 | error | Blank rows detected | Remove empty lines |

---

# 2. Column‑Level Errors

## Date Column

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| DATE001 | error | Invalid date format | Use YYYY-MM-DD |
| DATE002 | error | Date in the future | Correct the date |
| DATE003 | error | Non‑chronological date | Ensure dates are non‑decreasing |

## Type Column

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| TYPE001 | error | Invalid type | Use allowed values only |
| TYPE002 | error | Type/category mismatch | Fix category to match type |

## Amount Column

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| AMT001 | error | Amount is zero or negative | Use positive decimal |
| AMT002 | error | Invalid decimal format | Use 123.45 format |
| AMT003 | error | Currency symbol detected | Remove $ or other symbols |

## Category Column

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| CAT001 | error | Invalid category | Use allowed categories only |
| CAT002 | error | Category not allowed for type | Correct category |

## Purpose/Notes Column

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| NOTE001 | error | Missing purpose | Add a description |
| NOTE002 | warning | Purpose too short | Add more detail |

## Source of Funds Column

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| SRC001 | error | Invalid source | Use allowed values |
| SRC002 | error | Source not allowed for type | Fix source (e.g., forgiveness must be N/A) |

## Receipt/Evidence Link Column

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| REC001 | error | Missing receipt for disbursement/repayment | Add URL |
| REC002 | error | Invalid URL | Fix URL format |
| REC003 | error | Receipt present for forgiveness | Set to N/A |

## Running Balance Column

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| BAL001 | blocker | Running balance mismatch | Correct balance calculation |
| BAL002 | error | Negative balance | Fix amounts or order |
| BAL003 | error | Non‑numeric balance | Use decimal only |

## Reviewer Column

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| REV001 | error | Missing reviewer | Add founder initials |
| REV002 | error | Reviewer not authorized | Use configured initials |

## Attachments Column

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| ATT001 | warning | Invalid attachment format | Use URLs or GitHub refs |

---

# 3. Row‑Level Errors

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| ROW001 | error | Duplicate transaction | Remove or annotate |
| ROW002 | error | Missing required fields | Fill all required columns |
| ROW003 | error | Correction row missing reference | Add reference in notes |
| ROW004 | error | Repayment exceeds balance | Correct amount |
| ROW005 | error | Forgiveness exceeds balance | Correct amount |

---

# 4. Anti‑Fraud Errors

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| FRAUD001 | blocker | Historical row modified | Revert change; use correction row |
| FRAUD002 | blocker | Duplicate receipt detected | Provide unique evidence |
| FRAUD003 | blocker | Impossible pattern detected | Review amounts and types |
| FRAUD004 | blocker | Missing evidence for required transaction | Add receipt or proof |

---

# 5. Metadata Errors

| Code | Severity | Description | Fix |
|------|----------|-------------|-----|
| META001 | warning | Missing ledger version | Add metadata header |
| META002 | warning | Missing governance version | Add metadata header |
| META003 | warning | Missing last validated timestamp | Add metadata header |

---

# 6. Validator Output Structure

The validator must output:

`
{
  "status": "valid | invalid | needs_review",
  "errors": [
    {
      "code": "AMT001",
      "severity": "error",
      "message": "Amount must be a positive decimal",
      "row": 12,
      "column": "Amount"
    }
  ],
  "summary": {
    "rows_checked": 42,
    "errors": 3,
    "warnings": 1
  }
}
`

---

# CSV Validator Rule Sheet — Founder Working‑Capital Loan Ledger

This rule sheet defines the exact structure and validation requirements for the
`loan-ledger.csv` file.  
All entries must conform to these rules before being accepted into the
authoritative ledger.

---

## 1. File Format Rules

- File must be a **CSV** with UTF‑8 encoding.
- First row must contain **column headers** exactly as defined.
- No extra columns allowed.
- No empty rows.
- No trailing commas.
- No merged cells (for spreadsheet users).
- Decimal values must use a period (`.`), not a comma.

---

## 2. Required Columns (Exact Order)

1. `Date`
2. `Type`
3. `Amount`
4. `Category`
5. `Purpose/Notes`
6. `Source of Funds`
7. `Receipt/Evidence Link`
8. `Running Balance`
9. `Reviewer`
10. `Attachments`

Any deviation from this order is invalid.

---

## 3. Column‑Level Validation

### 3.1 `Date`
- Format: `YYYY-MM-DD`
- Cannot be in the future
- Must be chronological (non‑decreasing)

### 3.2 `Type`
Allowed values:
- `disbursement`
- `repayment`
- `forgiveness`
- `correction`

### 3.3 `Amount`
- Positive decimal
- No negative values
- No currency symbols

### 3.4 `Category`
Allowed values by type:

**Disbursement**
- `hardware`
- `software`
- `services`
- `operations`
- `infrastructure`

**Repayment**
- `repayment`

**Forgiveness**
- `forgiveness`

**Correction**
- `correction`

### 3.5 `Purpose/Notes`
- Required
- Minimum 5 characters
- Must describe the transaction clearly

### 3.6 `Source of Funds`
Allowed values:
- `personal-card`
- `personal-bank`
- `company-bank`
- `N/A` (for forgiveness only)

### 3.7 `Receipt/Evidence Link`
- Required for disbursement & repayment
- Must be a valid URL or `N/A`
- Must not be empty

### 3.8 `Running Balance`
- Must be a valid decimal
- Must match computed balance from previous row
- Must never be negative

### 3.9 `Reviewer`
- Required
- Must match founder initials (e.g., `RK`)

### 3.10 `Attachments`
- Optional
- If present: comma‑separated URLs or GitHub references

---

## 4. Row‑Level Validation

### 4.1 Disbursement
- Increases running balance
- Requires receipt
- Requires personal payment method

### 4.2 Repayment
- Decreases running balance
- Requires company payment method
- Requires receipt

### 4.3 Forgiveness
- Decreases running balance
- `Source of Funds` must be `N/A`
- Receipt must be `N/A`
- Purpose must include milestone or justification

### 4.4 Correction
- Must reference corrected row in `Purpose/Notes`
- Must adjust running balance accordingly

---

## 5. Running Balance Logic

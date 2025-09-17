# YFP Credit Evaluation

A full-stack credit evaluation platform by Yulon Finance Philippines with a Python FastAPI backend and React (Vite) frontend. Includes PostgreSQL, WebSockets, and AI-powered analysis.

## Features

- **Python FastAPI Backend**: Modern, fast web framework for building APIs
- **React (Vite) Frontend**: Blazing fast frontend tooling
- **PostgreSQL Database**: Robust relational database with SQLAlchemy ORM
- **WebSocket Support**: Real-time communication (SignalR-like functionality)
- **AI Integration**: OpenAI and LangChain integration
- **Flutter API Support**: API endpoints for Flutter mobile clients
- **Authentication**: JWT-based authentication system
- **Entity Framework-like ORM**: SQLAlchemy with clean models and schemas

## Running the Project

### Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL

### Backend Setup

1. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory with:
   ```
   POSTGRES_SERVER=localhost
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=app_db
   POSTGRES_PORT=5432
   SECRET_KEY=your-secret-key
   OPENAI_API_KEY=your-openai-api-key  # Optional
   ```

4. Run the backend:
   ```
   cd backend
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Run the frontend:
   ```
   npm run dev
   ```

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   ├── api.py
│   │   │   └── websocket.py
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   └── schemas/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md

├── docs/
│   ├── specification.md        # Functional, section-by-section spec
│   └── ARCHITECTURE.md         # System architecture & implementation notes
```

## Deployment Options

### Raspberry Pi Deployment

For Raspberry Pi deployment, follow the setup instructions and set up a systemd service:

```
[Unit]
Description=My Web App
After=network.target

[Service]
User=pi
WorkingDirectory=/path/to/app/backend
ExecStart=/path/to/app/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

### CI/CD Options

#### GitHub Actions for Raspberry Pi

```yaml
name: Deploy to Raspberry Pi

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
          
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
          
      - name: Deploy to Raspberry Pi
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.RPI_HOST }}
          username: ${{ secrets.RPI_USERNAME }}
          key: ${{ secrets.RPI_SSH_KEY }}
          script: |
            cd /path/to/project
            git pull
            source venv/bin/activate
            pip install -r requirements.txt
            systemctl restart myapp
```

#### Azure DevOps for Web Deployment

```yaml
# azure-pipelines.yml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

stages:
- stage: Build
  jobs:
  - job: BuildBackend
    steps:
    - task: UsePythonVersion@0
      inputs:
        versionSpec: '3.10'
    - script: |
        python -m pip install --upgrade pip
        pip install -r backend/requirements.txt
      displayName: 'Install backend dependencies'

  - job: BuildFrontend
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '16.x'
    - script: |
        cd frontend
        npm install
        npm run build
      displayName: 'Build frontend'

- stage: Deploy
  jobs:
  - job: DeployApp
    steps:
    - task: AzureWebApp@1
      inputs:
        azureSubscription: '$(AZURE_SUBSCRIPTION)'
        appName: '$(WEB_APP_NAME)'
        package: '$(System.DefaultWorkingDirectory)'
```

## License

This project is licensed under the MIT License.


## Credit Evaluation System Blueprint (based on sample PDF)

This repository implements an end-to-end workflow to produce a bank-grade Credit Evaluation (CE) report for equipment financing. The system design is derived from the attached sample report and its structured breakdown:

- Sample: `.samples/Draft - CE - Sparkle and Glow Beauty Innovations Corp.pdf`
- Reference (Chinese structure-to-requirements mapping): https://gist.github.com/w9wen/03c5598e765b7648c51b92a03af5dc83

### What the document is for

The PDF is a formal Credit Evaluation report for a medical/aesthetic equipment financing case. It consolidates all information required for credit review and approval: the request terms, background and KYC, financial analysis, key risks and mitigants, and the final credit recommendation with sign-off. The CE report is the canonical artifact used by credit committees to decide limits, sub-limits, drawdown cadence, conditions precedent, and prohibited actions.

### Personas and responsibilities

- Account Officer / Relationship Manager (AO/RM): Case intake, seller liaison, field visits, gather docs.
- Sales Manager: Sales recommendation and deal rationale.
- Credit Analyst: Financial analysis, ratio computations, risk assessment, recommendation draft.
- Compliance/KYC Officer: KYC checks (BAP/CMAP/Loandex), TRADE/BANK checking, adverse media.
- Risk Manager: Policy alignment, conditions and mitigants design.
- Approver / Credit Committee: Approval authority and sign-off.
- Auditor: Traceability of documents, actions, and AI extraction versions.
- Client (Borrower/Guarantor): Provides corporate, financial, and identity documents.

### Report sections (mapped to system inputs/outputs)

1. Request Summary (REQUEST)
  - Inputs: Borrower, facility type (lease/loan), equipment list, tenor, installment, IRR/EY, limits, disbursement plan, payment terms, use of proceeds.
  - Sources: AO/RM, seller proposal/quotation, equipment spec sheets, PDC plan, insurance needs.
  - Output: Structured “Case” + “Facility” records with sub-limits and cashflow preview.

2. Sales Recommendation (SALES RECOMMENDATION)
  - Inputs: Competitive comparison, seller strength, historical hit-rate, strategic fit.
  - Sources: Sales team/AO.
  - Output: Narrative section with supporting attachments.

3. Background Information (BACKGROUND)
  - Inputs: Company profile, business scope, ownership/management, guarantors (JSS), KYC results, trade and bank checking.
  - Sources: Company registry/GIS, board/shareholder resolutions, IDs and proofs, BAP/CMAP/Loandex, vendor/customer calls, bank confirmations.
  - Output: Structured “Borrower”, “Shareholding/Officers”, “Guarantor”, “KYCReport”, “TradeCheck”, “BankCheck”.

4. Financial Performance (FINANCIAL PERFORMANCE)
  - Inputs: Last 3 years FS (audited preferred), bank statements, AR/AP aging, inventory, fixed assets details, tax filings.
  - Output: Parsed statements, computed ratios (liquidity, leverage, coverage), cashflow narrative.

5. Risks & Mitigants (RISKS & MITIGANTS)
  - Inputs: Identified risk items (e.g., liquidity strain, weak JSS, inventory obsolescence, fund diversion).
  - Output: Linked mitigants (higher equity/down payment, step disbursement, mandatory insurance, beneficiary clauses, deposits, covenants).

6. Credit Recommendation/Justification
  - Output: Final facility limits and sub-limits, drawdown cadence, conditions precedent (CP), prohibited actions, and rationale.

7. Sign-off & Authority
  - Output: Drafting/reviewing/approving parties and timestamps; attachments of internal approval forms or e-sign artifacts.

8. Appendix A: Credit Grading Parameters
  - Output: Score breakdowns for management/operations, financial metrics, conduct; aggregate grade.

9. Appendix B: Client Visit Photos
  - Output: Geotagged/time-stamped photos evidencing site/equipment/operations.

### Systemized capabilities derived from the report

1. Upload & Capture
  - File types: PDF, images (JPEG/PNG/HEIC), Excel/CSV, Word, email forwards.
  - Mobile capture: On-device photo upload with auto time/location metadata; barcode/QR to bind uploads to a case.

2. AI-Aided Document Intelligence
  - Auto-classify: Company registry, resolutions, IDs, FS, bank statements, quotes/invoices/receipts/DOs, insurance, contracts, KYC reports (BAP/CMAP/Loandex), trade/bank checking, photos, internal approvals.
  - Auto-extract: Borrower basics, facility terms, equipment items, financial statements/ratios, KYC conclusions, trade terms, insurance beneficiaries, PDC details.
  - OCR and structuring: Robust OCR + table extraction; normalize to the data model with confidence scores and provenance.

3. Core Data Model (high level)
  - Case: id, status, createdBy, createdAt, borrowerId, referenceNo.
  - Borrower: legalName, registrationNo, businessScope, addresses, officers, shareholders.
  - Guarantor (JSS): identity, relationship, assets/liabilities.
  - Facility: type, totalLimit, tenor, rate/IRR/EY, paymentTerms; children: SubLimit[].
  - SubLimit: purpose, amount, schedule, drawdownPlan.
  - EquipmentItem: brand, model, serialNo, condition, price, supplier.
  - KYCReport: adverse media, BAP/CMAP/Loandex references, overall conclusion.
  - TradeCheck/BankCheck: counterparties, findings, evidence.
  - FinancialStatement: period, FS type (BS/IS/CF), lineItems[]; Ratios: DSCR, current, quick, leverage, margins, turnover.
  - Risk & Mitigant: description, severity, linkedConditions.
  - Recommendation: narrative, finalLimits, CP list, prohibitedActions.
  - Approval: drafter/reviewer/approver, timestamps, notes.
  - Attachment: fileId, type, source, linkedEntityId, extractedFields, confidence.

4. Workflow (happy path)
  - Intake: Create case -> upload or capture docs -> auto-classify/extract.
  - Review: Analyst validates AI fields, edits narratives, requests missing docs.
  - Analysis: Financial ratios computed; risks and mitigants curated.
  - Recommendation: Compile terms, CPs, and prohibited actions.
  - Approval: Route for endorsements/approval; log authority chain.
  - Output: Generate CE report (Markdown/Docx/PDF) with attachment cross-links.

5. Permissions & Audit
  - Role-based access control for AO/Sales/Credit/Compliance/Approver/Auditor.
  - Full audit trail: file operations, extraction versions, human edits, approvals.

### API and module outline (this repo)

Backend (FastAPI):
- Endpoints
  - POST `/api/v1/cases` create case; GET `/api/v1/cases/:id` retrieve; PATCH to update status/fields.
  - POST `/api/v1/cases/:id/uploads` upload files; GET to list attachments.
  - POST `/api/v1/ai/extract` run classification/extraction; returns fields + confidence + provenance.
  - GET `/api/v1/reports/:id` generate/download report (md/pdf/docx).
  - GET `/api/v1/kyc/:id` fetch KYC summary; POST to record checks.
  - GET `/api/v1/financials/:caseId/ratios` compute and return ratios.
  - Auth: JWT-protected routes; roles via claims.
- WebSocket: `/ws/cases/:id` for real-time collaboration, task updates, and reviewer chat.
- AI: Pluggable providers (OpenAI/LangChain). OCR/table extraction pipeline with provenance.

Frontend (React/Vite):
- Pages
  - Dashboard (cases list, statuses, tasks)
  - Case Intake (borrower/facility details)
  - Document Uploader (drag-and-drop, mobile QR intake)
  - Review & Annotate (AI suggestions, confidence, accept/fix)
  - Financials (statements, ratios, charts)
  - Risks & Recommendation builder
  - Report Preview & Export

### AI extraction pipeline (concept)

1) Ingest -> 2) Classify -> 3) OCR/Table parse -> 4) Field extraction -> 5) Normalize -> 6) Human review -> 7) Persist + Version -> 8) Generate report

- Each extracted field carries: { value, confidence, sourceFileId, page/coords, extractorVersion }.
- Review UI supports accept/edit/flag; all changes are versioned for audit.

### Report generation

- Compose a markdown CE report from the data model, then render to PDF/Docx.
- Provide an auditor version with extraction sources and confidence inline.
- Attachment mapping: each section references the source document(s) with deep-links.

### Minimal Viable Product (MVP) checklist

- Case intake with borrower + facility basics
- Uploads (PDF/images) with attachment listing
- AI: classification + a few key fields (borrower basics, equipment items, tenor/payment, basic FS totals)
- Financial ratio computation (current ratio, leverage, DSCR) from minimal inputs
- Risks & mitigants capture
- Recommendation summary
- Report generation (Markdown -> PDF)
- Role-based access (AO, Analyst, Approver) and basic audit log

### Mapping to current code

- Backend
  - `backend/app/api/` add routes for cases, uploads, ai, reports, kyc, financials.
  - `backend/app/models/` define Case, Borrower, Facility, EquipmentItem, Attachment, KYCReport, FinancialStatement, Ratio, Risk, Recommendation, Approval.
  - `backend/app/ai/` implement classification/extraction pipeline and provider adapters.
  - `backend/app/schemas/` Pydantic models matching the entities above.
- Frontend
  - `frontend/src/pages/` wire Dashboard, Case Intake, Uploader, Review, Financials, Risks, Report.
  - `frontend/src/api/` request wrappers for the endpoints.
  - `frontend/src/contexts/AuthContext.*` utilize JWT and roles.

### References

- PDF sample: `.samples/Draft - CE - Sparkle and Glow Beauty Innovations Corp.pdf`
- Structure mapping (CN): https://gist.github.com/w9wen/03c5598e765b7648c51b92a03af5dc83
- Running guide: `RUNNING.md`
 - Full English specification: `docs/specification.md`
 - Architecture & implementation notes: `docs/ARCHITECTURE.md`

### Next steps

- Define database models and migrations for core entities.
- Implement upload storage and attachment metadata (with page/coords where possible).
- Integrate OCR/table parsing and minimal extraction (scoped to MVP fields).
- Build the review UI with accept/edit/versioning.
- Implement report composer and exporter.
- Add role-based authorization and audit logging.

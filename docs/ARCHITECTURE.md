---
title: Architecture & Implementation
layout: default
---

<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
	if (window.mermaid) {
		mermaid.initialize({ startOnLoad: false, theme: 'default' });
		document.querySelectorAll('pre > code.language-mermaid').forEach(code => {
			const pre = code.parentElement;
			const div = document.createElement('div');
			div.className = 'mermaid';
			div.textContent = code.textContent;
			pre.replaceWith(div);
		});
		mermaid.init();
	}
});
</script>

<meta name="robots" content="noindex,nofollow">

<div style="font-size: 16px; line-height: 1.6">

# Credit Evaluation System — Architecture & Implementation Notes 🛠️

This document captures system-level architecture and implementation notes. The user/developer-facing functional spec lives in `specification.md`.

## 1. Key Workflows 🔄

```mermaid
%%{init: {'theme': 'default', 'themeVariables': { 'fontSize': '16px', 'fontFamily': 'Inter, -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}}%%
flowchart LR
	classDef node fill:#e3f2fd,stroke:#42a5f5,stroke-width:1px,color:#0d47a1;
	A[📥 Intake Case]:::node --> B[☁️ Upload/Scan Docs]:::node
	B --> C[🤖 AI Classify & Extract]:::node
	C --> D[🧑‍💼 Human Review & Fix]:::node
	D --> E[📊 Financial Analysis & Ratios]:::node
	E --> F[⚠️ Risks & Mitigants]:::node
	F --> G[📝 Recommendation Draft]:::node
	G --> H[🧭 Approval Routing]:::node
	H --> I[🧾 Generate CE Report]:::node
	I --> J[🗄️ Archive & Audit]:::node

	%% Thicken all flow lines
	linkStyle 0 stroke-width:3px
	linkStyle 1 stroke-width:3px
	linkStyle 2 stroke-width:3px
	linkStyle 3 stroke-width:3px
	linkStyle 4 stroke-width:3px
	linkStyle 5 stroke-width:3px
	linkStyle 6 stroke-width:3px
	linkStyle 7 stroke-width:3px
	linkStyle 8 stroke-width:3px
```

```mermaid
%%{init: {'theme': 'default', 'themeVariables': { 'fontSize': '16px', 'fontFamily': 'Inter, -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}}%%
sequenceDiagram
	participant AO as 👤 AO/RM
	participant FE as 🖥️ Frontend
	participant API as 🔧 FastAPI Backend
	participant AI as 🤖 AI Extractor
	participant DB as 🗄️ DB/Storage

	AO->>FE: Upload PDFs/Images/Excel/Word
	FE->>API: POST /cases/{id}/uploads (file)
	API->>DB: Store file + metadata (source, pages)
	API->>AI: Classify + OCR + Table parse + Extract fields
	AI-->>API: Entities + fields + confidence + provenance
	API->>DB: Persist Attachment + Extracted Fields (versioned)
	FE->>API: GET /cases/{id}/attachments
	FE-->>AO: Show extraction + confidence for review
```

```mermaid
%%{init: {'theme': 'default', 'themeVariables': { 'fontSize': '16px', 'fontFamily': 'Inter, -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}}%%
flowchart TD
	classDef step fill:#ede7f6,stroke:#7e57c2,stroke-width:1px,color:#311b92;
	D1[📝 Draft by Analyst]:::step --> R1[🛡️ Review by Risk]:::step
	R1 --> R2[🔍 Review by Compliance]:::step
	R2 --> A1[🧑‍⚖️ Approver/Committee]:::step
	A1 -->|Approve| OUT[📤 Publish Report]:::step
	A1 -->|Reject/Revise| D1

	%% Thicken all flow lines
	linkStyle 0 stroke-width:3px
	linkStyle 1 stroke-width:3px
	linkStyle 2 stroke-width:3px
	linkStyle 3 stroke-width:3px
	linkStyle 4 stroke-width:3px
```

## 2. Data Model (High Level)

```mermaid
%%{init: {'theme': 'default', 'themeVariables': { 'fontSize': '16px', 'fontFamily': 'Inter, -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}}%%
classDiagram
	class Case {
		uuid id
		string status
		datetime createdAt
		string createdBy
		uuid borrowerId
		string referenceNo
	}
	class Borrower {
		uuid id
		string legalName
		string registrationNo
		string businessScope
		string address
		Officer officers*
		Shareholder shareholders*
	}
	class Guarantor {
		uuid id
		string name
		string idNo
		string address
		string assetsLiabilities
	}
	class Facility {
		uuid id
		uuid caseId
		string type
		decimal totalLimit
		int tenorMonths
		decimal irr
		string paymentTerms
	}
	class SubLimit {
		uuid id
		uuid facilityId
		string purpose
		decimal amount
		string drawdownPlan
	}
	class EquipmentItem {
		uuid id
		uuid caseId
		string brand
		string model
		string serialNo
		string condition
		decimal price
		string supplier
	}
	class KYCReport {
		uuid id
		uuid caseId
		string adverseMedia
		string bapRef
		string cmapRef
		string loandexRef
		string conclusion
	}
	class TradeCheck {
		uuid id
		uuid caseId
		string counterparty
		string findings
	}
	class BankCheck {
		uuid id
		uuid caseId
		string bank
		string adb
		string ob
		string confirmation
	}
	class FinancialStatement {
		uuid id
		uuid caseId
		date periodEnd
		string type // BS, IS, CF
		LineItem lineItems*
	}
	class RatioSet {
		uuid id
		uuid caseId
		decimal currentRatio
		decimal quickRatio
		decimal leverage
		decimal dscr
		decimal grossMargin
		decimal netMargin
		decimal inventoryTurnover
		decimal receivableDays
	}
	class RiskItem {
		uuid id
		uuid caseId
		string description
		string severity
	}
	class Mitigant {
		uuid id
		uuid riskId
		string action
	}
	class Recommendation {
		uuid id
		uuid caseId
		string narrative
		string conditionsPrecedent
		string prohibitedActions
	}
	class Approval {
		uuid id
		uuid caseId
		string drafter
		string reviewer
		string approver
		datetime draftAt
		datetime reviewedAt
		datetime approvedAt
	}
	class Attachment {
		uuid id
		uuid caseId
		string fileName
		string fileType
		string source
		string pageRefs
		string extractedFieldsJson
		float confidence
		string extractorVersion
	}
	class Officer { string name; string title }
	class Shareholder { string name; float percent }
	class LineItem { string name; decimal amount }

	Case --> Borrower
	Case --> Facility
	Case --> EquipmentItem
	Case --> KYCReport
	Case --> TradeCheck
	Case --> BankCheck
	Case --> FinancialStatement
	Case --> RatioSet
	Case --> RiskItem
	RiskItem --> Mitigant
	Case --> Recommendation
	Case --> Approval
	Case --> Attachment
```

## 3. AI Extraction Pipeline

```mermaid
%%{init: {'theme': 'default', 'themeVariables': { 'fontSize': '16px', 'fontFamily': 'Inter, -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}}%%
flowchart LR
	classDef stage fill:#f1f8e9,stroke:#7cb342,stroke-width:1px,color:#33691e;
	I[📥 Ingest]:::stage --> C[🗂️ Classify]:::stage
	C --> O[🧾 OCR + Table Parse]:::stage
	O --> E[🔎 Field Extract]:::stage
	E --> N[🧱 Normalize to Data Model]:::stage
	N --> H[🧑‍💼 Human Review]:::stage
	H --> P[💾 Persist + Version]:::stage
	P --> G[🧾 Report Generate]:::stage

	%% Thicken all flow lines
	linkStyle 0 stroke-width:3px
	linkStyle 1 stroke-width:3px
	linkStyle 2 stroke-width:3px
	linkStyle 3 stroke-width:3px
	linkStyle 4 stroke-width:3px
	linkStyle 5 stroke-width:3px
	linkStyle 6 stroke-width:3px
```

<!-- Removed placeholder sections to keep this document focused on actionable architecture content. -->

<!-- end font wrapper -->
</div>


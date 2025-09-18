---
title: Functional Specification
layout: default
---

<link rel="stylesheet" href="./assets/css/custom.css">

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

<!-- Typography handled by theme; avoid HTML wrappers that can interfere with Markdown parsing -->
# Credit Evaluation System — Functional Specification (Section-by-Section) ✨

This document is the user/developer communication spec. System architecture and implementation notes were moved to `ARCHITECTURE.md`.

Source inspirations
- Sample report: `.samples/Draft - CE - Sparkle and Glow Beauty Innovations Corp.pdf`
- Chinese structure-to-requirements mapping: https://gist.github.com/w9wen/03c5598e765b7648c51b92a03af5dc83

## Section-by-Section (English mirror of Chinese structure)

The following mirrors the Chinese structure exactly, with English terminology and added implementation detail. Each section includes Purpose, Key Fields (where applicable), Information Providers, and Required Uploads.

### I. Request Summary (REQUEST) 📝

#### Purpose

Consolidate the core terms and structure of the credit application as the index for review and approval.
#### Key Fields

<table>
	<thead>
		<tr>
			<th>Category</th>
			<th>Fields</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>Borrower &amp; Channel</td><td>Borrower name; intake channel (RM/AO)</td></tr>
		<tr><td>Facility Instrument</td><td>Finance lease; short-/mid-term loan; currency</td></tr>
		<tr><td>Asset/Equipment</td><td>Type; brand; model; condition (new/used); qty; unit price; serial no.; supplier</td></tr>
		<tr><td>Facility Economics</td><td>Total limit; sub-limit allocation; tenor (months); repayment frequency; amortization type; grace period; monthly installment</td></tr>
		<tr><td>Pricing &amp; Fees</td><td>IRR/EY; nominal rate basis; AOR; arrangement/origination fees; DST; other charges</td></tr>
		<tr><td>Payment Terms</td><td>Method; PDC plan (count, dates, amounts); auto-debit instructions</td></tr>
		<tr><td>Protections/CPs</td><td>Insurance (coverage, beneficiary); notarization; JSS; collateral/retention; delivery/acceptance preconditions</td></tr>
		<tr><td>Use of Proceeds</td><td>Description and timelines</td></tr>
	</tbody>
	</table>
#### Information Providers

<table>
	<thead>
		<tr>
			<th>Role</th>
			<th>Responsibility</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>AO/RM</td><td>Case ownership, collect terms</td></tr>
		<tr><td>Sales</td><td>Commercial terms, supplier coordination</td></tr>
		<tr><td>Borrower</td><td>Management inputs, approvals</td></tr>
		<tr><td>Supplier</td><td>Quotation, equipment details</td></tr>
	</tbody>
</table>
#### Required Uploads

<table>
	<thead>
		<tr>
			<th>Document</th>
			<th>Purpose</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>Sales proposal/quotation</td><td>Terms and pricing</td></tr>
		<tr><td>Equipment list (w/ serials)</td><td>Asset details and identification</td></tr>
		<tr><td>Payment terms</td><td>Repayment structure</td></tr>
		<tr><td>Delivery/acceptance notes</td><td>Disbursement precondition evidence</td></tr>
		<tr><td>PDC schedule</td><td>Payment method proof</td></tr>
		<tr><td>Use-of-proceeds statement</td><td>Purpose justification</td></tr>
		<tr><td>Authorization docs/seal</td><td>Signing authority</td></tr>
		<tr><td>Insurance clauses/quotes</td><td>Beneficiary and coverage</td></tr>
	</tbody>
</table>
#### Key Owner/Manager

<table>
	<thead>
		<tr>
			<th>Owner</th>
			<th>Notes</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>AO/RM</td><td>Case owner</td></tr>
		<tr><td>Sales</td><td>Co-owner for commercial terms</td></tr>
	</tbody>
</table>

#### Validation & Rules

<table>
	<thead>
		<tr>
			<th>Rule</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>Currency must be ISO-4217; tenor 1–84 months; repayment frequency in {monthly, quarterly}</td></tr>
		<tr><td>Equipment requires supplier and indicative price; serial numbers before disbursement</td></tr>
		<tr><td>IRR/EY from cashflow schedule; disclose fees; DST compliant</td></tr>
		<tr><td>PDC schedule reconciles to amortization; insurance beneficiary = lender; JSS per policy</td></tr>
		<tr><td>Disbursement only after delivery/acceptance and insurance in force; exceptions justified</td></tr>
	</tbody>
</table>

#### Calculations / Derived Fields

<table>
	<thead>
		<tr>
			<th>Calculation</th>
			<th>Notes</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>Monthly installment</td><td>Derived from principal, tenor, rate</td></tr>
		<tr><td>EY</td><td>From full cashflow incl. fees/DST</td></tr>
		<tr><td>Sub-limit utilization</td><td>Forecast by drawdown plan</td></tr>
		<tr><td>Advance rate</td><td>Effective vs. equipment value</td></tr>
	</tbody>
</table>

#### Edge Cases & Red Flags

<table>
	<thead>
		<tr>
			<th>Red flag</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>Incomplete equipment specs</td></tr>
		<tr><td>Large used-equipment component without valuation</td></tr>
		<tr><td>PDC dates misaligned with cashflow</td></tr>
		<tr><td>High fees relative to principal</td></tr>
		<tr><td>Missing insurance beneficiary</td></tr>
		<tr><td>Absent JSS despite weak borrower profile</td></tr>
	</tbody>
</table>

#### Example — this case

<table>
	<thead>
		<tr>
			<th>Field</th>
			<th>Value</th>
			<th>Source</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>Borrower</td><td>Sparkle and Glow Beauty Innovations Corp.</td><td>p.1</td></tr>
		<tr><td>Intake/Source</td><td>BDO – E. Ching</td><td>p.1</td></tr>
		<tr><td>Instrument</td><td>Credit Line via Finance Lease and Medium-term Loan (1st availment)</td><td>p.1</td></tr>
		<tr><td>Asset</td><td>Aesthetic/Medical Equipment; Brand: BTL; Condition: Brand New</td><td>p.1</td></tr>
		<tr><td>Sub-limit 1 (Leasing)</td><td>PHP 20,000,000; 36 mos; Monthly PHP 713,055; EY ~17%; IRR ~17%; AOR ~28.35%</td><td>p.1</td></tr>
		<tr><td>Sub-limit 2 (MTL A)</td><td>PHP 10,000,000; 24 mos; Monthly PHP 494,423; IRR 18.04%; AOR 18.66%</td><td>p.1</td></tr>
		<tr><td>Sub-limit 3 (MTL B)</td><td>PHP 10,000,000; 36 mos; Monthly PHP 356,528; IRR 18.07%; AOR 28.35%</td><td>p.1</td></tr>
		<tr><td>Payment method</td><td>Post Dated Checks (PDC)</td><td>p.1</td></tr>
		<tr><td>Indicative CPs</td><td>EEI insurance naming YFP as Assured/Loss Payee; notarization; upfront fee 1% per availment</td><td>p.2</td></tr>
        <tr><td>Purpose</td><td>Not fully visible in excerpt</td><td>p.1</td></tr>
        <tr><td>Supplier</td><td>Tritan Ventures Inc. (BTL distributor)</td><td>p.1</td></tr>
	</tbody>
</table>


### II. Sales Recommendation (SALES RECOMMENDATION) 💼

#### Purpose

Sales’ rationale for the transaction’s advantages and the proposed credit structure.
#### Key Fields

<table>
	<thead>
		<tr>
			<th>Category</th>
			<th>Fields</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>Rationale &amp; Fit</td><td>Strategic rationale; relationship context; expected share of wallet</td></tr>
		<tr><td>Market &amp; Supplier</td><td>Competitive landscape; supplier evaluation; hit-rate</td></tr>
		<tr><td>Terms vs. Market</td><td>Pricing/tenor/structure; exceptions</td></tr>
		<tr><td>Upside</td><td>Cross-sell/upsell; pipeline</td></tr>
	</tbody>
</table>
#### Information Providers

<table>
	<thead>
		<tr>
			<th>Role</th>
			<th>Responsibility</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>AO</td><td>Origination context</td></tr>
		<tr><td>Sales Manager</td><td>Recommendation and market view</td></tr>
	</tbody>
</table>
#### Required Uploads

<table>
	<thead>
		<tr>
			<th>Document</th>
			<th>Purpose</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>Sales recommendation memo</td><td>Deal rationale</td></tr>
		<tr><td>Competitor/supplier comparison</td><td>Market context</td></tr>
		<tr><td>Relationship &amp; hit-rate</td><td>Historical performance</td></tr>
	</tbody>
</table>
#### Key Owner/Manager

<table>
	<thead>
		<tr>
			<th>Owner</th>
			<th>Notes</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>Sales Manager</td><td>Lead author</td></tr>
		<tr><td>AO</td><td>Supports</td></tr>
	</tbody>
</table>

#### Validation & Rules

<table>
	<thead>
		<tr>
			<th>Rule</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>State deviations from policy and justify</td></tr>
		<tr><td>Include competitor benchmark when relevant</td></tr>
		<tr><td>Document supplier due diligence</td></tr>
	</tbody>
</table>

#### Edge Cases & Red Flags

<table>
	<thead>
		<tr><th>Red flag</th></tr>
	</thead>
	<tbody>
		<tr><td>Rationale without financial support</td></tr>
		<tr><td>Supplier concentration risk ignored</td></tr>
	</tbody>
</table>

#### Example — this case

<table>
	<thead>
		<tr>
			<th>Topic</th>
			<th>Detail</th>
			<th>Source</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>Highlights</td><td>~6 years in operation; Net Income uptrend 2021→2023; 2024 service income ~PHP 3.3M–7.3M; strong supplier/customer relationships</td><td>p.2</td></tr>
		<tr><td>Conditions/fees</td><td>EEI insurance; Notarial fee PHP 3,000</td><td>p.2</td></tr>
		<tr><td>MTL documents</td><td>Quotation/invoice; PN+Addendum; S&P with Installment; Upfront fee 1% per availment</td><td>p.2</td></tr>
				<tr><td>Hit-rate/relationship</td><td>Strong relationships with major aesthetic suppliers/customers; historical hit-rate indicated</td><td>p.2</td></tr>
	</tbody>
</table>


### III. Background Information (BACKGROUND INFORMATION) 🏢

#### Purpose

Present company fundamentals, operating scale, ownership and guarantor backgrounds, KYC and external credit checks.
#### Key Fields

<table>
	<thead>
		<tr>
			<th>Category</th>
			<th>Fields</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>Company profile</td><td>Legal name; registration number; incorporation date; business scope/industry code; principal place</td></tr>
		<tr><td>Ownership &amp; mgmt.</td><td>Shareholders (names, %); board/officers (names, titles); org chart</td></tr>
		<tr><td>Guarantors (JSS)</td><td>Identity info; relationship; assets/liabilities; address</td></tr>
		<tr><td>KYC</td><td>Adverse media; BAP/CMAP/Loandex refs; conclusion</td></tr>
		<tr><td>Trade checking</td><td>Counterparties; remarks; outcome</td></tr>
		<tr><td>Bank checking</td><td>Banks; ADB/OB; confirmations</td></tr>
	</tbody>
</table>
#### Subsections and Sources

<table>
	<thead>
		<tr>
			<th>Subsection</th>
			<th>Source</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>Company profile &amp; scope</td><td>Company docs; AO interview notes</td></tr>
		<tr><td>Industry/Business type</td><td>Registration; interview</td></tr>
		<tr><td>Shareholding &amp; officers</td><td>GIS; shareholder registry; charter</td></tr>
		<tr><td>Guarantors background</td><td>Declarations; asset lists; address proofs</td></tr>
		<tr><td>KYC &amp; credit checks</td><td>Adverse media; BAP-NFIS; CMAP; Loandex</td></tr>
		<tr><td>Trade checking</td><td>Vendor/customer records</td></tr>
		<tr><td>Bank checking</td><td>Bank confirmations; letters</td></tr>
	</tbody>
</table>
#### Required Uploads

<table>
	<thead>
		<tr>
			<th>Document</th>
			<th>Purpose</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>GIS; registration docs</td><td>Corporate identity</td></tr>
		<tr><td>Board/shareholder resolutions</td><td>Signing authority</td></tr>
		<tr><td>Guarantor IDs &amp; signatures</td><td>KYC and JSS</td></tr>
		<tr><td>Assets/liabilities list</td><td>JSS coverage</td></tr>
		<tr><td>Address proofs</td><td>Residence verification</td></tr>
		<tr><td>BAP/CMAP/Loandex</td><td>External credit checks</td></tr>
		<tr><td>Trade/bank checking</td><td>Conduct verification</td></tr>
		<tr><td>Tax documents</td><td>Financial corroboration</td></tr>
	</tbody>
</table>
#### Key Owner/Manager

<table>
	<thead>
		<tr>
			<th>Owner</th>
			<th>Notes</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>Compliance/KYC</td><td>KYC checks</td></tr>
		<tr><td>AO</td><td>Background &amp; interviews</td></tr>
		<tr><td>Legal</td><td>Resolutions/authorizations</td></tr>
	</tbody>
</table>

#### Validation & Rules

<table>
	<thead>
		<tr><th>Rule</th></tr>
	</thead>
	<tbody>
		<tr><td>Names/IDs consistent across GIS, resolutions, IDs</td></tr>
		<tr><td>KYC status recorded (Pass/Pass w/ conditions/Review/Fail) with evidence</td></tr>
		<tr><td>Guarantor coverage adequate relative to exposure; addresses validated</td></tr>
	</tbody>
	</table>

#### Edge Cases & Red Flags

<table>
	<thead>
		<tr><th>Red flag</th></tr>
	</thead>
	<tbody>
		<tr><td>Opaque UBOs</td></tr>
		<tr><td>Registry vs. representation inconsistencies</td></tr>
		<tr><td>Negative KYC hits</td></tr>
		<tr><td>Volatile OB/ADB or unfavorable bank checking</td></tr>
		<tr><td>Trade disputes indicated</td></tr>
	</tbody>
</table>

#### Example — this case

<table>
	<thead>
		<tr>
			<th>Topic</th>
			<th>Detail</th>
			<th>Source</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>JSS snapshot</td><td>Camille Padilla: assets ~PHP 4.80M; liabilities ~PHP 7.63M; net negative; co-surety assets list missing; one surety has minor child</td><td>p.3, p.7</td></tr>
		<tr><td>Bank checking</td><td>BDO CA (2018; OB/ADB 6 digits; no bounced checks; active). BPI CA (2019; ADB PHP 42,748.69; active; OB not allowed)</td><td>p.4</td></tr>
        <tr><td>Existing exposure</td><td>Existing facilities for borrower ~PHP 33.24M referenced in notes</td><td>p.3</td></tr>
        <tr><td>Bank details</td><td>BDO (Rockwell Center - Makati); BPI (38th St BGC); contacts listed; dates confirmed</td><td>p.4</td></tr>
	</tbody>
</table>


### IV. Financial Performance (FINANCIAL PERFORMANCE) 📊

#### Purpose

Present recent financials, ratios/coverage, and cashflows; explain material changes.
#### Content Structure

<table>
	<thead>
		<tr><th>Section</th><th>Contents</th></tr>
	</thead>
	<tbody>
		<tr><td>Financial highlights</td><td>BS, IS, key ratios, operating cycle, cashflow</td></tr>
		<tr><td>Narrative analysis</td><td>Profitability; liquidity/leverage; cashflow drivers</td></tr>
	</tbody>
</table>

#### Key Fields

- Income Statement: revenue, COGS, gross profit, operating expenses, EBITDA, interest expense, net income.
- Balance Sheet: cash, receivables (with aging), inventory (by type), fixed assets (net), payables (with aging), short/long-term debt, equity.
- Cashflow: operating cashflow, investing and financing flows; reconciliation to bank statements (spot checks).
- Ratios: current, quick, leverage (debt/equity), DSCR, margins (gross/net), turnover (inventory, receivables days), coverage metrics.
- Trends and explanations for year-over-year movements and seasonality.
#### Information Providers

<table>
	<thead>
		<tr><th>Role</th><th>Responsibility</th></tr>
	</thead>
	<tbody>
		<tr><td>Client</td><td>Provide FS (audited preferred; else management FS)</td></tr>
		<tr><td>AO/Credit Analyst</td><td>Compute ratios and narrative</td></tr>
		<tr><td>Banks</td><td>Provide corroboration (statements/letters)</td></tr>
	</tbody>
</table>
#### Required Uploads

<table>
	<thead>
		<tr><th>Document</th><th>Purpose</th></tr>
	</thead>
	<tbody>
		<tr><td>3-year FS</td><td>Primary financials</td></tr>
		<tr><td>Bank statements</td><td>Cash corroboration</td></tr>
		<tr><td>Inventory details</td><td>Working capital analysis</td></tr>
		<tr><td>AR/AP aging</td><td>Ties to BS and cycle</td></tr>
		<tr><td>FA register</td><td>PP&E reconciliation</td></tr>
		<tr><td>Tax filings</td><td>External corroboration</td></tr>
		<tr><td>Equipment invoices &amp; acceptance</td><td>Capex evidence</td></tr>
	</tbody>
</table>
#### Key Owner/Manager

<table>
	<thead>
		<tr><th>Owner</th><th>Notes</th></tr>
	</thead>
	<tbody>
		<tr><td>Credit Analyst</td><td>Prepares analysis</td></tr>
		<tr><td>AO</td><td>Facilitates data</td></tr>
	</tbody>
</table>

#### Validation & Rules

<table>
	<thead>
		<tr><th>Rule</th></tr>
	</thead>
	<tbody>
		<tr><td>Prefer audited FS; corroborate management accounts with bank statements and tax filings</td></tr>
		<tr><td>Tie AR/AP aging and inventory to BS totals; reconcile FA register to net PP&E</td></tr>
		<tr><td>Compute ratios consistently; DSCR uses normalized EBITDA and scheduled debt service</td></tr>
	</tbody>
</table>

#### Calculations / Ratio Formulas (indicative)

<table>
	<thead>
		<tr><th>Metric</th><th>Formula</th></tr>
	</thead>
	<tbody>
		<tr><td>Current Ratio</td><td>Current Assets / Current Liabilities</td></tr>
		<tr><td>Quick Ratio</td><td>(Cash + AR) / Current Liabilities</td></tr>
		<tr><td>Leverage</td><td>Total Debt / Equity</td></tr>
		<tr><td>DSCR</td><td>EBITDA / (Interest + Current Maturity of LT Debt)</td></tr>
		<tr><td>Inventory Turnover</td><td>COGS / Avg Inventory</td></tr>
		<tr><td>Receivable Days</td><td>(AR / Revenue) * 365</td></tr>
	</tbody>
</table>

#### Edge Cases & Red Flags

<table>
	<thead><tr><th>Red flag</th></tr></thead>
	<tbody>
		<tr><td>Significant related-party transactions</td></tr>
		<tr><td>Aggressive revenue growth without cash support</td></tr>
		<tr><td>Rising inventory/receivables days</td></tr>
		<tr><td>Negative operating cashflow or sustained losses</td></tr>
		<tr><td>Overreliance on short-term funding</td></tr>
	</tbody>
</table>

#### Example — this case

<table>
	<thead>
		<tr><th>Topic</th><th>Detail</th><th>Source</th></tr>
	</thead>
	<tbody>
		<tr><td>Profitability</td><td>Net income PHP 1.393M (2021) → 7.209M (2022) → 11.534M (2023); net margin 13.74% → 26.38% → 28.15%; EBITDA ~PHP 17.28M (2023) vs. 11.91M (2022)</td><td>p.5–6</td></tr>
		<tr><td>Growth &amp; margins</td><td>Sales growth 169.54% (2021→2022), 49.91% (2022→2023); GP 67.62% → 72.92% → 65.95%; Op margin 19.62% → 35.17% → 35.19%</td><td>p.5</td></tr>
		<tr><td>Working capital</td><td>AR 8 → 0 → 0 days; Inventory 904 → 382 → 90 days; AP 519 → 405 → 350 days; Funding gap 393 → -24 → -260</td><td>p.5</td></tr>
		<tr><td>Liquidity &amp; leverage</td><td>Current 1.91 → 1.19 → 0.59; Quick 0.11 → 0.16 → 0.18; D/E -40.51x → 7.49x → 2.33x</td><td>p.5</td></tr>
	<tr><td>Shareholder advances</td><td>Non-interest-bearing; used to support operations during pandemic; decreasing from PHP 44.56M (2021) to PHP 27.45M (2023)</td><td>p.6</td></tr>
	<tr><td>Debt service</td><td>No historical debt service noted 2021–2023; EBITDA improved in 2023</td><td>p.6</td></tr>
	</tbody>
</table>


### V. Risks & Mitigants (RISKS & MITIGANTS) ⚠️

#### Purpose

Identify principal risks (e.g., liquidity, fund diversion, weak JSS, inventory obsolescence) and specific mitigants.
#### Key Fields

<table>
	<thead><tr><th>Category</th><th>Fields</th></tr></thead>
	<tbody>
		<tr><td>Risk register</td><td>id; category; description</td></tr>
		<tr><td>Ratings</td><td>Likelihood; impact; inherent/residual</td></tr>
		<tr><td>Mitigants</td><td>Action; owner; due date; expected effect; monitoring plan</td></tr>
	</tbody>
</table>
#### Information Providers

<table>
	<thead><tr><th>Role</th><th>Responsibility</th></tr></thead>
	<tbody>
		<tr><td>Credit Risk</td><td>Risk register ownership</td></tr>
		<tr><td>AO</td><td>Operational context</td></tr>
		<tr><td>Compliance/Legal</td><td>Policy/Legal inputs</td></tr>
	</tbody>
</table>
#### Required Uploads

<table>
	<thead><tr><th>Document</th><th>Purpose</th></tr></thead>
	<tbody>
		<tr><td>Conditions evidence</td><td>Support for mitigants (insurance, deposits, staged disbursement, etc.)</td></tr>
	</tbody>
</table>
#### Key Owner/Manager

<table>
	<thead><tr><th>Owner</th><th>Notes</th></tr></thead>
	<tbody>
		<tr><td>Credit Risk</td><td>Owns risk register</td></tr>
		<tr><td>Compliance/Legal</td><td>Co-owners for mitigants</td></tr>
	</tbody>
</table>

#### Validation & Rules

<table>
	<thead><tr><th>Rule</th></tr></thead>
	<tbody>
		<tr><td>High/critical risks must have at least one concrete mitigant or explicit acceptance</td></tr>
		<tr><td>Link mitigants to policy clauses (insurance beneficiary, staged disbursement CPs)</td></tr>
	</tbody>
</table>

#### Edge Cases & Red Flags

<table>
	<thead><tr><th>Red flag</th></tr></thead>
	<tbody>
		<tr><td>Generic/non-actionable mitigants</td></tr>
		<tr><td>No owner/timeline</td></tr>
		<tr><td>Infeasible dependencies</td></tr>
	</tbody>
</table>

#### Example — this case

<table>
	<thead><tr><th>Topic</th><th>Detail</th><th>Source</th></tr></thead>
	<tbody>
		<tr><td>Key risks</td><td>Liquidity strain (current ratio 0.59); weak JSS coverage; high inventory days (improving); exposure vs. guarantor capacity</td><td>p.5–7</td></tr>
		<tr><td>Candidate mitigants</td><td>EEI insurance beneficiary; staged disbursement; higher equity/deposit; complete co-surety assets; monitor ADB/OB; align PDC to amortization</td><td>p.2, p.5–7</td></tr>
		<tr><td>JSS concern</td><td>Surety personal assets (~PHP 4.80M) less than liabilities (~PHP 7.63M); co-surety assets list missing; one surety has a minor child</td><td>p.7</td></tr>
		<tr><td>Monitoring plan</td><td>Track bank ADB/OB trends; verify insurance is in force; ensure PDC schedule matches amortization</td><td>p.2, p.4–5</td></tr>
	</tbody>
</table>

### VI. Credit Recommendation/Justification (CREDIT RECOMMENDATION/JUSTIFICATION) ✅

#### Purpose

After weighing risks and mitigants, specify facility limit(s), sub-limits, drawdown cadence, conditions precedent (CP), and prohibited actions.
#### Key Fields

<table>
	<thead><tr><th>Category</th><th>Fields</th></tr></thead>
	<tbody>
		<tr><td>Final facility terms</td><td>Total limit; sub-limits (purpose, amount); tenor; amortization; pricing (IRR/EY); fees</td></tr>
		<tr><td>Disbursement plan</td><td>Stages/milestones; documentation triggers (delivery/acceptance/insurance)</td></tr>
		<tr><td>CPs &amp; Covenants</td><td>Conditions precedent; ongoing covenants; prohibited actions; exceptions</td></tr>
		<tr><td>Residual risk</td><td>Statement; justification; monitoring cadence</td></tr>
	</tbody>
</table>
#### Information Providers

<table>
	<thead><tr><th>Role</th><th>Responsibility</th></tr></thead>
	<tbody>
		<tr><td>Credit review team</td><td>Draft recommendation and rationale</td></tr>
	</tbody>
</table>
#### Required Uploads

<table>
	<thead><tr><th>Document</th><th>Purpose</th></tr></thead>
	<tbody>
		<tr><td>Meeting minutes</td><td>Decision evidence</td></tr>
		<tr><td>Conditions checklist</td><td>CP tracking</td></tr>
		<tr><td>Annexes/amendments</td><td>Contractual terms</td></tr>
	</tbody>
</table>
#### Key Owner/Manager

<table>
	<thead><tr><th>Owner</th><th>Notes</th></tr></thead>
	<tbody>
		<tr><td>Credit Review Lead</td><td>Drafting</td></tr>
		<tr><td>Approver/Committee</td><td>Decision authority</td></tr>
	</tbody>
</table>

#### Validation & Rules

<table>
	<thead><tr><th>Rule</th></tr></thead>
	<tbody>
		<tr><td>CPs must be measurable/verifiable</td></tr>
		<tr><td>Disbursement matches delivery/acceptance; prohibited actions align to policy</td></tr>
		<tr><td>Exceptions stated and approved; monitoring cadence and reporting obligations defined</td></tr>
	</tbody>
</table>

#### Edge Cases & Red Flags

<table>
	<thead><tr><th>Red flag</th></tr></thead>
	<tbody>
		<tr><td>Ambiguous CPs</td></tr>
		<tr><td>Drawdown plan not tied to documentary evidence</td></tr>
		<tr><td>Missing prohibited action list</td></tr>
	</tbody>
</table>

#### Example — this case

<table>
	<thead><tr><th>Topic</th><th>Detail</th><th>Source</th></tr></thead>
	<tbody>
		<tr><td>Indicative terms</td><td>Refer to Request: Lease + two MTL sub-limits with tenors/payments and IRR/EY/AOR</td><td>p.1</td></tr>
		<tr><td>CPs &amp; covenants</td><td>Insurance beneficiary; complete docs (quotation/invoice, PN+Addendum, S&amp;P Installment); PDCs; disbursement on delivery &amp; acceptance; consider JSS strengthening</td><td>p.1–2</td></tr>
		<tr><td>Assumptions</td><td>Recommendation terms interleaved with request/financial sections; rely on Request and Risks tables for specifics</td><td>p.1–2, p.5–7</td></tr>
	</tbody>
</table>


### Sign-off & Authority (Credit Recommending/Endorsing/Approval Authority) ✍️

#### Purpose

Summarize drafter, reviewer(s), co-signees, approver(s), and dates.
#### Required Uploads

<table>
	<thead><tr><th>Document</th><th>Purpose</th></tr></thead>
	<tbody>
		<tr><td>Sign-off form; e-approval screenshots</td><td>Approval evidence</td></tr>
	</tbody>
</table>
#### Key Fields

<table>
	<thead><tr><th>Field</th><th>Notes</th></tr></thead>
	<tbody>
		<tr><td>Drafter; reviewers; endorsers; approver(s)</td><td>Roles and names</td></tr>
		<tr><td>Dates; authority references</td><td>Timeline and authority level</td></tr>
		<tr><td>Comments</td><td>Approval remarks</td></tr>
	</tbody>
</table>
#### Key Owner/Manager

<table>
	<thead><tr><th>Owner</th><th>Notes</th></tr></thead>
	<tbody>
		<tr><td>Credit Administration/PMO</td><td>Workflow integrity</td></tr>
		<tr><td>Approver(s)</td><td>Final sign-off</td></tr>
	</tbody>
</table>

#### Validation & Rules

<table>
	<thead><tr><th>Rule</th></tr></thead>
	<tbody>
		<tr><td>Authority level matches exposure</td></tr>
		<tr><td>Approvals dated/sequenced; conditional approvals captured</td></tr>
		<tr><td>Immutable audit trail linked to report version</td></tr>
	</tbody>
</table>

#### Edge Cases & Red Flags

<table>
	<thead><tr><th>Red flag</th></tr></thead>
	<tbody>
		<tr><td>Missing reviewer stage</td></tr>
		<tr><td>Approver outside authority</td></tr>
		<tr><td>Unsigned or missing artifacts</td></tr>
	</tbody>
</table>

#### Example — this case

<table>
	<thead><tr><th>Topic</th><th>Detail</th><th>Source</th></tr></thead>
	<tbody>
		<tr><td>Approval artifacts</td><td>Not visible in provided pages; weak JSS implies heightened scrutiny/CPs</td><td>p.7</td></tr>
	</tbody>
</table>

### Appendix A: Credit Grading Parameter 🧮

#### Purpose

Quantify management/operations, financials, and conduct; aggregate to a grade.
#### Required Uploads

<table>
	<thead><tr><th>Document</th><th>Purpose</th></tr></thead>
	<tbody>
		<tr><td>Scorecard; calculation details; screenshots</td><td>Grading evidence</td></tr>
	</tbody>
</table>
#### Key Fields

<table>
	<thead><tr><th>Field</th><th>Notes</th></tr></thead>
	<tbody>
		<tr><td>Criteria and weights</td><td>As per scorecard</td></tr>
		<tr><td>Component scores</td><td>Management/operations; financial; conduct</td></tr>
		<tr><td>Total score</td><td>Aggregate result</td></tr>
		<tr><td>Grade &amp; threshold</td><td>Mapped grade</td></tr>
	</tbody>
</table>
#### Key Owner/Manager

<table>
	<thead><tr><th>Owner</th><th>Notes</th></tr></thead>
	<tbody>
		<tr><td>Credit Risk</td><td>Model owner</td></tr>
		<tr><td>Analyst</td><td>Inputs to score</td></tr>
	</tbody>
</table>

#### Validation & Rules

<table>
	<thead><tr><th>Rule</th></tr></thead>
	<tbody>
		<tr><td>Versioned scorecard template</td></tr>
		<tr><td>Thresholds approved by policy</td></tr>
		<tr><td>Overrides documented and approved</td></tr>
	</tbody>
</table>

#### Edge Cases & Red Flags

<table>
	<thead><tr><th>Red flag</th></tr></thead>
	<tbody>
		<tr><td>Missing evidence for component scores</td></tr>
		<tr><td>Grade inconsistent with financial risk and conduct</td></tr>
	</tbody>
</table>

#### Example — this case

<table>
	<thead><tr><th>Topic</th><th>Detail</th><th>Source</th></tr></thead>
	<tbody>
		<tr><td>Credit grading</td><td>Section indicated; detailed fields not legible</td><td>p.8</td></tr>
	</tbody>
</table>

### Appendix B: Client Visit Pictures 📸

#### Purpose

On-site evidence of equipment, footfall, storefront, and operating conditions.
#### Required Uploads

<table>
	<thead><tr><th>Document</th><th>Purpose</th></tr></thead>
	<tbody>
		<tr><td>Photos/videos (geotagged/time-stamped)</td><td>Site evidence</td></tr>
	</tbody>
</table>
#### Key Fields

<table>
	<thead><tr><th>Field</th><th>Notes</th></tr></thead>
	<tbody>
		<tr><td>Photo/video list</td><td>Catalog of evidence</td></tr>
		<tr><td>Timestamps &amp; geolocation</td><td>Integrity and provenance</td></tr>
		<tr><td>Annotations</td><td>Brief descriptions</td></tr>
		<tr><td>Linkages</td><td>Map to equipment items/areas</td></tr>
	</tbody>
</table>
#### Key Owner/Manager

<table>
	<thead><tr><th>Owner</th><th>Notes</th></tr></thead>
	<tbody>
		<tr><td>AO/RM</td><td>Capture</td></tr>
		<tr><td>Operations/Audit</td><td>Validation</td></tr>
	</tbody>
</table>

#### Validation & Rules

<table>
	<thead><tr><th>Rule</th></tr></thead>
	<tbody>
		<tr><td>Photos geotagged/time-stamped; no alteration</td></tr>
		<tr><td>Link each photo to equipment/location; align with delivery/acceptance docs</td></tr>
	</tbody>
</table>

#### Edge Cases & Red Flags

<table>
	<thead><tr><th>Red flag</th></tr></thead>
	<tbody>
		<tr><td>Photos not from claimed site</td></tr>
		<tr><td>Mismatched timestamps</td></tr>
		<tr><td>Missing required angles or serial labels</td></tr>
	</tbody>
</table>

#### Example — this case

<table>
	<thead><tr><th>Topic</th><th>Detail</th><th>Source</th></tr></thead>
	<tbody>
		<tr><td>Visit pictures</td><td>Placeholder present; specific images not visible in text extraction</td><td>p.8</td></tr>
	</tbody>
</table>

#### Section-to-Module Overview
```mermaid
%%{init: {
	'theme': 'default',
	'flowchart': { 'htmlLabels': true },
	'themeVariables': {
		'fontSize': '16px',
		'fontFamily': 'Inter, -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
	}
}}%%
graph TD
	classDef req fill:#e3f2fd,stroke:#42a5f5,stroke-width:1px,color:#0d47a1;
	classDef sales fill:#fff3e0,stroke:#fb8c00,stroke-width:1px,color:#e65100;
	classDef bg fill:#ede7f6,stroke:#8e24aa,stroke-width:1px,color:#4a148c;
	classDef fin fill:#e8f5e9,stroke:#43a047,stroke-width:1px,color:#1b5e20;
	classDef risk fill:#ffebee,stroke:#e53935,stroke-width:1px,color:#b71c1c;
	classDef rec fill:#e0f7fa,stroke:#00acc1,stroke-width:1px,color:#004d40;
	classDef misc fill:#f3e5f5,stroke:#7e57c2,stroke-width:1px,color:#311b92;

	REQUEST[📝 Request]:::req --> CASE[📁 Case]:::misc
	SALES[💼 Sales]:::sales --> NARR[🧾 Narratives]:::misc
	BACKGROUND[🏢 Background & KYC]:::bg --> KYC[🔎 KYC & Checks]:::misc
	FIN[📊 Financials]:::fin --> RATIOS[📈 Ratios]:::misc
	RISKS[⚠️ Risks]:::risk --> REC[✅ Recommendation]:::rec
	REC --> APPROVAL[✍️ Approval]:::misc
	VISIT[📸 Visit Photos]:::misc --> ATT[📎 Attachments]:::misc
	CASE --> REPORT[🧾 CE Report]:::misc
	RATIOS --> REPORT
	KYC --> REPORT
	ATT --> REPORT

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
	linkStyle 9 stroke-width:3px
	linkStyle 10 stroke-width:3px
```


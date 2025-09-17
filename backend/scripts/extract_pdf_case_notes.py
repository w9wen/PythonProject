import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

import pdfplumber


SECTION_PATTERNS: List[Tuple[str, re.Pattern]] = [
    ("REQUEST", re.compile(r"\b(Request|申請摘要|REQUEST)\b", re.I)),
    ("SALES_RECOMMENDATION", re.compile(r"\b(Sales\s*Recommendation|業務建議)\b", re.I)),
    ("BACKGROUND", re.compile(r"\b(Background\s*Information|背景資訊)\b", re.I)),
    ("FINANCIAL_PERFORMANCE", re.compile(r"\b(Financial\s*Performance|財務表現)\b", re.I)),
    ("RISKS_MITIGANTS", re.compile(r"\b(Risks?\s*&?\s*Mitigants?|風險.*因應)\b", re.I)),
    ("RECOMMENDATION", re.compile(r"\b(Credit\s*Recommendation|授信建議)\b", re.I)),
    ("SIGN_OFF", re.compile(r"\b(Approval|簽核|權限)\b", re.I)),
    ("APPENDIX_A", re.compile(r"\b(Credit\s*Grading|評等)\b", re.I)),
    ("APPENDIX_B", re.compile(r"\b(Visit|照片|Pictures)\b", re.I)),
]


def extract_text_with_pages(pdf_path: Path) -> List[Tuple[int, str]]:
    texts: List[Tuple[int, str]] = []
    with pdfplumber.open(str(pdf_path)) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            try:
                text = page.extract_text() or ""
            except Exception:
                text = ""
            texts.append((i, text))
    return texts


def split_into_sections(pages: List[Tuple[int, str]]) -> Dict[str, List[Dict[str, str]]]:
    # Heuristic: assign each page to the most likely section by keyword hit
    section_notes: Dict[str, List[Dict[str, str]]] = {k: [] for k, _ in SECTION_PATTERNS}
    for page_num, text in pages:
        lowered = text.lower()
        matched: str = ""
        score_max = 0
        for key, pattern in SECTION_PATTERNS:
            hits = len(pattern.findall(text))
            # also look for roman numerals headers like "I.", "II." etc.
            if hits > score_max:
                score_max = hits
                matched = key
        if not matched:
            # fallback simple rules by common tokens
            if any(w in lowered for w in ["irr", "ey", "installment", "equipment", "pdc"]):
                matched = "REQUEST"
            elif any(w in lowered for w in ["kyc", "cmap", "loandex", "bap", "shareholder", "guarantor"]):
                matched = "BACKGROUND"
            elif any(w in lowered for w in ["balance sheet", "income statement", "cash flow", "ratio"]):
                matched = "FINANCIAL_PERFORMANCE"
            elif any(w in lowered for w in ["risk", "mitigant", "condition precedent", "cp "]):
                matched = "RISKS_MITIGANTS"
            elif any(w in lowered for w in ["recommendation", "limit", "sub-limit", "prohibited"]):
                matched = "RECOMMENDATION"
            elif any(w in lowered for w in ["approval", "endorse", "sign-off"]):
                matched = "SIGN_OFF"
            else:
                matched = "REQUEST"  # default bucket
        snippet = " ".join(text.split())
        if snippet:
            section_notes[matched].append({"page": page_num, "text": snippet[:3500]})
    return section_notes


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Extract case notes from CE sample PDF")
    parser.add_argument("pdf", type=str, help="Path to the CE PDF")
    parser.add_argument("--out", type=str, default="case_notes.json", help="Output JSON file")
    args = parser.parse_args()

    pdf_path = Path(args.pdf)
    out_path = Path(args.out)

    pages = extract_text_with_pages(pdf_path)
    sections = split_into_sections(pages)

    # Summarize per section a short top snippet
    summary = {}
    for sec, items in sections.items():
        summary[sec] = [{"page": it["page"], "excerpt": it["text"][:800]} for it in items[:6]]

    out = {"pdf": str(pdf_path), "notes": summary}
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2))
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()

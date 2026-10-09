#!/usr/bin/env python3
"""ATS keyword check: how well does a resume (and letter) cover a job posting?

Usage:
  python3 ats_check.py posting.txt Resume.pdf [Letter.pdf]

Prints coverage %, matched keywords and missing keywords.
Missing keywords are only added to a resume if Abdel truly has that skill or experience.
Target: 85 to 90%+ coverage of the posting's must-have terms.
"""
import re, sys
from collections import Counter

LEXICON = """python java javascript typescript sql c++ c# bash go react angular node node.js express rest api apis
mongodb postgresql mysql git linux windows azure aws gcp docker kubernetes pytorch tensorflow scikit-learn numpy pandas
machine learning ai llm rag agents automation uipath rpa power bi excel tableau data analysis reporting dashboards
agile scrum kanban jira testing unit tests ci/cd troubleshooting help desk service desk active directory office 365
microsoft 365 networking hardware software installation ticketing itil customer service customer success onboarding
crm salesforce hubspot prospecting cold calling pipeline quota b2b saas lead generation account management negotiation
closing sales targets retail inventory merchandising scheduling budgeting cost control p&l kpis coaching training
leadership supervision team lead project management stakeholder communication documentation problem solving bilingual
arabic french driver's licence logistics dispatch operations compliance safety guest service hospitality analytics
""".split("\n")

STOP = set("""a an the and or of to in for with on at by from as is are be will you your our we this that it its
their they them who what which can may must should able ability strong excellent good great experience years year
work working role team job position candidate ideal including such other all any more new plus well using use""".split())

def lexicon_terms():
    terms = set()
    for line in LEXICON:
        for t in re.split(r"\s{1,}", line.strip()):
            if t: terms.add(t.lower())
    # multi-word phrases
    terms |= {"machine learning", "customer service", "customer success", "help desk", "service desk", "active directory",
              "office 365", "microsoft 365", "unit tests", "power bi", "data analysis", "lead generation", "account management",
              "cold calling", "sales targets", "cost control", "project management", "problem solving", "guest service",
              "team lead", "rest api"}
    return terms

def read(path):
    if path.lower().endswith(".pdf"):
        from pypdf import PdfReader
        return "\n".join(p.extract_text() or "" for p in PdfReader(path).pages)
    return open(path, encoding="utf-8", errors="ignore").read()

def norm(s):
    return re.sub(r"[^a-z0-9+#./' ]", " ", s.lower())

def posting_keywords(text):
    t = norm(text)
    found = {k for k in lexicon_terms() if re.search(r"(?<![a-z])" + re.escape(k) + r"(?![a-z])", t)}
    # frequent non-stopword bigrams in requirement-ish lines catch domain terms the lexicon misses
    req = "\n".join(l for l in text.splitlines() if re.search(r"(require|qualif|must|experience with|knowledge of|skills|asset|you have|you bring)", l, re.I)) or text
    words = [w for w in norm(req).split() if w not in STOP and len(w) > 2]
    bigrams = Counter(zip(words, words[1:]))
    found |= {" ".join(b) for b, c in bigrams.items() if c >= 2}
    return sorted(found)

def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    posting = read(sys.argv[1])
    resume = norm(" ".join(read(p) for p in sys.argv[2:]))
    kws = posting_keywords(posting)
    hit = [k for k in kws if k in resume]
    miss = [k for k in kws if k not in resume]
    cov = 100 * len(hit) / max(1, len(kws))
    print(f"Coverage: {cov:.0f}% ({len(hit)}/{len(kws)})  target 85-90%+ (aim high with true terms only; a lower score never stops an application)")
    print("Matched:", ", ".join(hit))
    print("Missing:", ", ".join(miss))
    print("Rule: add a missing term only if it is true for Abdel. Otherwise address it honestly in the letter.")

if __name__ == "__main__":
    main()

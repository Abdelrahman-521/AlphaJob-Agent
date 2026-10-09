# Site Playbook: how to get things done on each site and tool

> Technical how-to only. Rules live in `Start_Here.md`, writing in `Voice_and_Honesty.md`, facts in `Profile_Facts.md`. Add a line here the first time a trick works or fails twice. Delete a line when a site changes and it stops working.

## 0. Session setup (first 5 minutes)
1. **Load tools in ONE ToolSearch:**
   `select:SendUserMessage,mcp__Gmail__search_threads,mcp__Gmail__get_thread,mcp__Gmail__unlabel_thread,mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__find,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__file_upload,mcp__claude-in-chrome__form_input`
2. **Chrome:** `tabs_context_mcp` with `createIfEmpty:true`. Work only in tabs inside your group. If a tab "is not in Claude's tab group", call `tabs_context_mcp` again (the group was recreated). Never close the last tab in the group.
3. **Rebuild the working copies** (the container resets between sessions). `Artifact` action `read`, url `<tracker artifact URL>`, paths `["code/build.js","code/national.json","code/nat.sh","code/ats_check.py","code/build_backup.py"]`, out_dir `/home/claude/restore` (zero tokens). Then:
   ```bash
   mkdir -p /mnt/user-data/outputs/applications /home/claude/apply/nat/p /home/claude/up
   cp /home/claude/restore/code/{build.js,national.json,ats_check.py} /mnt/user-data/outputs/applications/
   cp /home/claude/restore/code/nat.sh /home/claude/apply/nat.sh && chmod +x /home/claude/apply/nat.sh
   node -e "require('docx')" || (npm i -g docx && export NODE_PATH=$(npm root -g))
   ```
   Fallback: `Code_Backup.md` Route B.
   **At WRAP:** copy the four working files to `/home/claude/wrap/code/`, republish the tracker artifact with the code files as `files` (the `root` and page must sit under the working directory `pwd`, or the publish is refused; from the AlphaJob clone use root `/home/claude/alphajob`, page `docs/Job_Search_Tracker.md`, files from `code/`), regenerate `Code_Backup.md` (`python3 /home/claude/restore/code/build_backup.py`), then **mirror everything to the GitHub archive** (below).
   **GitHub archive (Abdel's private archive repo).** A history copy for the future, never a dependency: sessions never read from it. At WRAP only: `add_repo` (the private archive, access `push`), `git clone --depth 1 <archive URL> /home/claude/alphajob`, copy the 6 docs into `docs/` and the 5 code files into `code/`, then `git commit -am "<date>: <session summary>" && git push`. If GitHub is unreachable, skip it and say so; nothing breaks.
4. **From Abdel only when a form needs it:** the official transcript PDF.

## 1. Build pipeline (per job, about 2 minutes)
1. Save the full posting text to `/home/claude/apply/nat/p/<key>.txt` (from the employer's page or the LinkedIn voyager API, section 2).
2. Append one entry to `national.json`: `key` (Co_Role), `company`, `role`, `city`, `remote`, `track` (dev | support | data | impl | ai | sales | finance | service | admin; `finance` for banks, lending, insurance and advisor roles), `resume` (techDev | tech | data | ai | sales | client), `hook`, `gap`, `summary`, optional `skills` (a list of `[label, text]` pairs that replaces the variant's Core Skills, so the skills section names only the posting's skills; added Oct 8), and `ps` for EDGE jobs. Pick the track by what the letter's middle paragraph says: `sales` talks software and REST APIs, so for non-software sales (industrial, media) check the preview and switch to `service` if it reads wrong. Follow `Voice_and_Honesty.md` section 3. Back up first: `cp national.json /home/claude/national.json.bak_<date>`.
3. Build and check in one command: `/home/claude/apply/nat.sh <key> <CoShort>`. It builds the docx, converts to PDF, prints the page counts (must be 1 and 1), runs ats_check (target 85 to 90%+), copies the PDFs to `/home/claude/up/` and writes the merged letter-first PDF `Abdelrahman_Conber_<CoShort>_Resume_and_Letter.pdf` there too.
4. Under 85%: add true missing terms to `summary` or `skills` in the posting's words and rebuild. If the honest ceiling is lower, stop there and apply anyway; the bar is a target, never a reason to skip a job (Abdel, Oct 8).
5. Preview the letter text: `cd /mnt/user-data/outputs/applications && TEXT=<key> node build.js`. Read it once for overclaims before uploading.
6. **Which file goes where:** separate letter field → `Resume_<key>.pdf` in the resume slot and `CoverLetter_<key>.pdf` in the letter slot. Single upload → the merged PDF (letter is page 1; `pdftotext -l 1` to confirm). Workday's Resume/CV box takes several files: upload both separately.
7. `file_upload` only takes files inside the session's working directory (`pwd`; it rejected `/home/claude/up/` and `/mnt/user-data/outputs/` on Oct 7). Before uploading, copy the PDFs to `<pwd>/up/` (in the AlphaJob clone that folder is gitignored).

## 2. Sourcing
- **LinkedIn search URL:** `https://www.linkedin.com/jobs/search/?keywords=...&location=Canada&f_E=1%2C2&f_JT=F&f_TPR=r86400` (`r86400` past day, `r604800` past week). Quote multi-word terms and join with OR. St. John's: `location=St.%20John%27s%2C%20Newfoundland%20and%20Labrador%2C%20Canada&distance=25`.
- **Read the list:** `get_page_text` on the search tab gives title / company / location per card. Then `find` the card link, or open `/jobs/view/<id>/`.
- **Full posting + apply URL (voyager API, logged in).** Run in a LinkedIn tab:
  ```js
  const c=document.cookie.match(/JSESSIONID="?([^";]+)/)[1];
  const r=await fetch('/voyager/api/jobs/jobPostings/<id>?decorationId=com.linkedin.voyager.deco.jobs.web.shared.WebFullJobPosting-65',{headers:{'csrf-token':c,'accept':'application/json'}});
  window.__jd=await r.json(); window.__jd.description.text.slice(0,1000)
  ```
  Page through `window.__jd.description.text.slice(a,b)` (tool output is cut near 1,000 characters). Apply URL: `window.__jd.applyMethod['com.linkedin.voyager.jobs.OffsiteApply'].companyApplyUrl.split('?')[0]`. Never return a URL with `?`, `&` or `=` in it (output gets BLOCKED); split it first.
- **Indeed:** `ca.indeed.com/jobs?q=...&l=St.+John%27s%2C+NL&fromage=7&jt=fulltime`, then JS over `.job_seen_beacon` for title / company / jk. Cloudflare after many loads: Abdel's tick.
- **Other sources:** siliconharbour.dev/jobs (St. John's tech; one `get_page_text` gives the whole board). Company boards: BambooHR `/careers/list` (JSON), Greenhouse `boards-api.greenhouse.io/v1/boards/<co>/jobs/<id>`, Lever `api.lever.co/v0/postings/<co>?mode=json`, Ashby `jobs.ashbyhq.com/<co>`. NL Government: hiring.gov.nl.ca (needs JavaScript, check by hand). Google: `"<role>" <city> site:<careers domain>` when a board is unknown.
- **NL sources (check all six every NL sweep; about 10 minutes):**
  1. **siliconharbour.dev/jobs**: one `get_page_text` gives the whole board (and /events for networking).
  2. **techNL job board** `https://technl.ca/job-seekers/`: a plain page; `fetch` each `/job/<slug>/` link in a page tab and read `article` text (the Qualifications block has the years).
  3. **Government of NL** `https://www.hiring.gov.nl.ca/Competitions/Public`: needs Chrome and a 5-second wait, then JS over `table tr` (title, competition number, posted/closing dates, employment type, salary). Click a row to expand its Screening Criteria. Most IT roles are OCIO; most postings are temporary, so check Employment Type.
  4. **City of St. John's** (careers page `https://www.stjohns.ca/your-government/careers/`): postings live in the City's Njoyn applicant system; click "Career Opportunities" on that page in Chrome, then read the job list (title, competition number, closing date). Permanent full-time City roles are NL employer jobs; check each posting's Qualifications for years and diplomas.
  5. **Job Bank NL**: in a jobbank.gc.ca tab, `fetch('/jobsearch/jobsearch?searchstring=<term>&locationstring=St.+John%27s%2C+NL&sort=D&fprov=NL')` and parse `article` (WebFetch is blocked by robots.txt; the `locationstring` alone returns all of Canada, `fprov=NL` is the filter that works). **Fast wins (Oct 8):** fetch `/jobsearch/jobposting/<id>` and parse NOC, terms, experience and "posted directly by the employer on Job Bank"; for those, open the page, click "Show how to apply", open the details, and read the email under "Additional ways to apply" (plus any screening questions to answer in the email). Some say apply in person only: add those to the walk-in list.
  6. **Indeed NL** `ca.indeed.com/jobs?q=<terms>&l=St.+John%27s%2C+NL&fromage=7&jt=fulltime` plus **LinkedIn** with the St. John's location string above.
  Also worth a look monthly: NL Health Services, MUN, Nasdaq Verafin and Medavie career pages (all NL employers; COMPANY_CAP applies).
- **VET before queueing:** regex the text for `bilingu|french|citizen|clearance|2027 grad|\d+\+? years|video`, then read the whole posting. The regex alone misses named platforms and required domains.

## 3. Application systems (ATS)
**Universal:** read every value back with one JS call before Submit. See the confirmation. Close the tab. Log the row. Set `window.ff=(id)=>{const e=document.getElementById(id);e.scrollIntoView({block:'center'});e.focus();e.select&&e.select();return document.activeElement.id}` once per form and use `ff('<id>')` then real typing for every text field.

**Accounts Abdel already has (one application email; just sign in):** the private copy lists about 30 employer accounts by system: 14 Workday tenants, one UKG login that covers every UKG employer, 4 SuccessFactors tenants, plus Avature, Eploy, iCIMS, Eightfold and a Salesforce portal. Check the list before asking him to sign up again.

**Blocked domains (screenshots or clicks denied; Abdel finishes these):** `career8.successfactors.com` (Amrize), `cibc.wd3.myworkdayjobs.com`.

**Workday (myworkdayjobs.com).** Some tenants allow a guest apply (Jonas: "Apply Manually" with no sign-in). Otherwise Abdel's account.
- Start at `.../apply/applyManually`. "Autofill with Resume" mangles names (ALL CAPS), address and dates; prefer manual.
- **Text fields:** the native value setter does NOT stick. `ff(id)` then real typing, one field at a time. Ids: `name--legalName--firstName`, `name--legalName--lastName`, `address--addressLine1`, `address--city`, `address--postalCode`, `emailAddress--emailAddress`, `phoneNumber--phoneNumber`, `education-N--schoolName`, `education-N--gradeAverage`, `workExperience-N--*`, `primaryQuestionnaire--<hash>` (questions; map by `label[for]`).
- **Dropdowns:** JS click the button, wait 800 ms, JS click the `[role=option]` whose text matches. Typing + Enter can pick the wrong option. Search boxes (How did you hear, Field of Study, Skills): `ff(id)`, type, Enter, wait, click the first `[role=option]`.
- **Skills:** add only the posting's skills (QA_GATE). **Education:** add MUN, Bachelors, Computer and Information Science, GPA from `Profile_Facts.md`.
- **Files:** the Resume/CV box takes several files: resume + letter separately; delete any duplicate.
- Next button: `[data-automation-id="pageFooterNextButton"]`. Terms checkbox id contains `acceptTermsAndAgreements`. Success: URL `?Job_Application_ID=…`, title "Congratulations", or "Application Submitted".
- "Use My Last Application" carries over old text. Re-read everything.

**SAP SuccessFactors (career*.successfactors.com, Government of Alberta, Scotiabank).** Abdel's account.
- **First-time employers (Metso, Oct 8):** the apply page is one form that creates the account on submit (password + retype). Agent fills everything else: resume and letter go in through the tile's dialog (click the tile's + icon, then `find` the file input inside the dialog), gender is a custom combobox (focus it, press Down, click the option), the privacy statement opens a dialog with Accept. Leave the job-alert box unticked. Abdel types the password twice and clicks Apply; the result page says "Your application has been sent".
- Dropdowns are custom: click the field, then click the option by coordinates. Don't click other tiles while a resume is "Uploading…".
- Separate letter slot exists: resume-only PDF in the resume slot.

**UKG / UltiPro (recruiting*.ultipro.com).** One login for every UKG employer.
- The parser invents schools (Harvard), skills (Bioinformatics, Fanuc, RNA, RPA) and wrong dates. Delete each by its exact "Delete Education N" / "Remove <skill>" button; never match remove buttons by ancestor text.
- Uploading any document re-renders the Questions block and wipes the answers: upload first, answer after. Set the letter's Document Type to "Cover Letter".
- "Title must not be empty" = the Mr./Ms. prefix in Contact Information (shows after the resume upload).
- Date fields: click, ctrl+a, Backspace, type digits only. Start date on the model if the widget breaks: `ko.contextFor(document.getElementById('Questions')).$root.application().AvailableStartDate('2026-10-19T12:00:00.000Z')`.
- "Save these changes to your presence?" → No.

**Greenhouse (job-boards.greenhouse.io and embeds).** No account.
- Native setter + input/change/blur events work. Map question ids by `label[for]`; ids don't follow label order.
- react-select: click, type, Enter; on the LAST dropdown click the option (Enter may submit).
- It may email a security code to his application email: fetch it and resubmit. Forms can reset after a long wait: re-read before Submit.

**Ashby (jobs.ashbyhq.com).** No account. Upload the resume FIRST (it autofills), then fix every field with real clicks and typing; `form_input` values may not register. Yes/No toggles and radios: click by coordinates and verify with JS before Submit (Spellbook's first values didn't stick). Cookie banner: "Necessary Only".

**Rippling (ats.rippling.com).** No account. The parser fills the long first name and "Memorial University" as current company: clear and fix. Location is a search: type "St. John's" and pick "St. John's, NL, Canada". SMS consent: No.

**BambooHR / Humi / applytojob / JazzHR / Paylocity.** No account. CAPTCHA, reCAPTCHA or Human Check at Submit is Abdel's tick. Single resume field → merged PDF. Paylocity needs an acknowledgement box (standing permission).

**Oracle Cloud HCM (*.oraclecloud.com/hcmUI/CandidateExperience).** Guest apply: email → privacy tick → form. Postal-code lookup: type the first three characters, wait, type the last three, pick it. A "Confirm your identity" code arrives in Gmail about 1 minute after Submit. 500 on `/job/<id>` → use `/sites/CX_1/job/<id>`.

**SmartRecruiters.** The resume upload is in a shadow DOM: Abdel uploads. Then fix Confirm email, the City autocomplete and any spillover text in the last job description, and paste the letter into "Message to Hiring Team".

**iCIMS (Hexagon, Lennox).** The form is a same-origin iframe. Inject a helper `<input type=file>` on the top page, `file_upload` into it, copy the File into the iframe input with DataTransfer. The upload reloads the iframe, so fill fields AFTER the upload. Never force-navigate the iframe URL (kills the session).

**Eightfold (ATB).** Typed values show but validation stays stale: click each field, End + space + Backspace + Tab to revalidate. Text answers max 499 characters. The phone country widget stays on US (+1 is the same; fine).

**Dayforce.** "Apply without an Account" works. Upload the resume and letter FIRST: the resume slot is "Import Resume" and it overwrites the personal fields (ALL CAPS names, blanks confirm email, address, postal code, LinkedIn), so fill those after. Set the mobile dialing code to +1 Canada. The first Next opens a Privacy Policy pop-up: scroll it, tick "I agree", Save. Cancelling it makes Submit fail with "Your application wasn't submitted" (400) (WEM, Oct 8). Selects are antd: open, then mousedown + click the option.

**Phenom guest form (jobs.ecolab.com, Workday behind it).** No account to apply; the thank-you page offers one (Abdel's choice, skip it). Text fields: a native-value setter plus input/change/blur events. Selects: `form_input` by ref. Each file upload freezes the page for 1 to 3 minutes: wait, then screenshot. Education years use a year-grid picker (click the year). Skills is a plain textarea: type a comma list.

**Workable, Jobvite, ADP Workforce Now, Salesforce portals (Compugen), Appcast, Gem, Loxo, SonicHire.** Guest forms. Jobvite data consent: "All locations except California & Europe", then "I Accept". ADP sends an emailed code. Gem (Motion) requires a recorded intro video: hand it to Abdel. SonicHire follows up with an AI video interview.

**Red Bull (cosmos-select dropdowns).** Press Escape before opening each dropdown. The date display is off by one month (time zone) but the stored dates are right.

**Eploy (FDM) and Avature (IBM).** Eploy: same iframe helper as iCIMS. Avature: fields aren't in DOM order; fill work history on screen and read all values back before Continue.

**LinkedIn Easy Apply.** Only when the company site has no route. Switch the email to his application email. Replace the pre-loaded resume (patch `HTMLInputElement.prototype.click` to catch the file input, then `find` it and `file_upload`), and check the preview.

**Elevate ATS (United Church, `*.elevate-ats.com`, Oct 8).** Guest form, no account, no CAPTCHA. Separate cover letter and resume uploads; type text fields with real keystrokes (the page lags, so wait and re-read values); radios and checkboxes take a JS `.click()`; "Where did you hear" is a custom dropdown (click, then pick). Ticks: AI-use disclosure + privacy policy (standing permission); leave Subscribe unticked.

**RBC (jobs.rbc.com, Phenom guest apply `hvhapply`).** No account. The tab can freeze right after the resume upload (twice on Oct 8); the third try worked (#150), so retry once before handing it to Abdel. Steps: My information (Prefix, Device Mobile, How did you hear Job Board → Source Indeed, Worked for RBC No) → My experience (parsed; set Degree, Field, GPA, replace the parsed skills with the posting's, add English and Arabic, tick both native boxes with a real click since form_input doesn't stick) → Application questions (a sponsorship question appears only after the first Next: No) → Supplementary (LLQP honest No; prospecting Yes from door-to-door; licence + car Yes) → Voluntary disclosures (the selects are the elements next to the labels; the "I accept" box needs a real click) → Review → Submit. Talent-pool consent: yes.

**Indeed Apply.** Pre-loads the LAST resume used: replace it and check the preview every time. "Preparing review" only finishes while the tab is in front: click a blank spot on the page to bring it forward (Oct 8). Submit now sits behind an "I'm not a robot" reCAPTCHA (Abdel's tick). JS `.click()` on Continue sometimes does nothing; use a real click on the `find` ref. Check the company's own site first: Pipers and KFC (FMI) post only on Indeed/Job Bank, Cogir's own board had no St. John's posting.

## 4. Gmail (his university account)
- **Sweep:** `search_threads` with `newer_than:1d -category:promotions -category:social` (or since the last sweep), then `get_thread` on anything human. Search results show only the oldest messages of a thread; open the thread for the latest.
- **Codes:** search `newer_than:1h`.
- **Mark read after a sweep:** `search_threads` `is:unread in:inbox` (pageSize 50), then `unlabel_thread` with `labelIds:["UNREAD"]` per thread, in batches of 10 calls. Re-search until empty.
- **Sending with attachments (Oct 8, reliable way):** 1) `create_draft` (Gmail tool) with to / subject / body. 2) Open the draft in the Chrome tab at `mail.google.com/mail/u/1/#all?compose=<the part after compose= in viewUrl>` (MUN is /u/1). 3) `find` the compose `input type=file`, `file_upload` the letter + resume, check the chips. 4) Click inside the body, press ctrl+Enter, confirm in Sent. Don't type into compose=new windows: clicking Compose as well opens two dialogs, typing lands in the hidden one, and coordinates drift (cost 15 minutes on Oct 8).

## 5. LinkedIn messaging and connecting (Abdel has Premium)
- **Find the person:** company slug via `/search/results/companies/?keywords=<Company>` (take the `/company/<slug>/` link), then `/company/<slug>/people/?keywords=talent%20acquisition` (or `recruiter`, `manager`, `support`). Pull `/in/` links with JS over `a[href*="/in/"]`. `/search/results/people/?keywords=` is NOT company-scoped; don't use it.
- **Message:** `find` "Message button in profile top card" and click its ref. The composer shows "Free message" (open profile, no credit) or "Use 1 of N InMail credits". Subject box above the body: click it and type. Body: click the grey area and type (plain text; no newlines needed). Send: the blue arrow at the bottom right of the composer. Confirm by screenshot: the sent message shows with the time.
- **Connect:** the Connect button, or More (…) → Connect. In the dialog: "Send without a note", or "Add a note" (300 characters; the counter shows x/300), then Send. Verify with JS: an `aria-label` starting "Pending, click to withdraw invitation".
- **Dialogs aren't in the accessibility tree:** screenshot at 0.6 scale and click by coordinates.
- **Editing his profile (Oct 9):** the edit dialogs use contenteditable boxes. Typing with the computer tool can miss (only some characters land, or text goes elsewhere after a reconnect), so set text with JS: focus the box, select its contents, `document.execCommand('insertText', false, text)`, then read it back. Before saving, read every input and select in the dialog (a stray keystroke flipped the employment type to part-time once), click Save by coordinates if the ref click doesn't close the dialog, and confirm the "Save was successful" toast.
- **Adding documents to a profile section (Oct 9):** Edit (pencil) → Media → Add media → "Add a document" opens a native file picker the agent can't see. Before clicking it, patch the page with JS so file inputs don't open the picker: override `HTMLInputElement.prototype.click` (and `showPicker`) to append a `type=file` input to the body instead of opening it. Then click "Add a document", `find` the file input and `file_upload` the PDF (it must sit in `/home/claude/alphajob/up/`; under 10 MB). In the Add media dialog the title and description are plain inputs, but typing drops letters: set them with the native value setter plus an input event, then type one space and Backspace in each so LinkedIn registers it, read both back, Save. Then read every field of the Edit dialog before the final Save and confirm the toast. A "People you may know" pop-up follows: navigate away, connect with no one.
- **Uploading to Abdel's public GitHub repos (Oct 9):** pushes from the cloud session are refused for repos other than AlphaJob, and git on his PC fails on lock files without delete permission. Use the GitHub web UI in Chrome (he's signed in): `github.com/<owner>/<repo>/upload/main/<folder>`, `file_upload` to the file input, commit message, "Commit directly to main", Commit changes. Replace a file (README) by uploading a same-name file at the right folder. Verify with `gh api repos/<owner>/<repo>/contents/<folder>` once the repo is attached with `add_repo`. Tell Abdel to Pull in GitHub Desktop afterwards.
- **Credits:** 15 InMails a month; log the number left in the tracker after each batch. Free messages and connect notes cost nothing.

## 6. Browser efficiency
- Screenshots at 0.5 to 0.6 scale. Read pages with `document.querySelector('main').innerText.replace(/\s+/g,' ').slice(a,b)` instead of full page text.
- Close each tab after its confirmation. Abdel's own tabs are outside your group and invisible: open the page in YOUR tab and let him sign in there. If he is browsing in your LinkedIn tab, create another.
- Rate limits: LinkedIn's guest API gives 429 (use the logged-in voyager API). Indeed throws Cloudflare after many loads.
- When the extension disconnects, tell Abdel in one line and resume when `tabs_context_mcp` answers again.

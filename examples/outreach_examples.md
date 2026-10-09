# Outreach examples

Real messages the agent drafted and that went out on LinkedIn between Sep 30 and Oct 8, 2026. People's names and employers are replaced with XXXX. Everything else is as sent.

The agent finds the recruiter or hiring manager on the company's LinkedIn People tab, drafts the message from the rules in [`docs/Voice_and_Honesty.md`](../docs/Voice_and_Honesty.md), sends it, sends a connect request, and logs the row in the [tracker](../docs/Job_Search_Tracker.md#outreach) with a follow-up date. One follow-up after 7 days of silence, never a second chase.

---

## 1. Hiring manager, normal voice (Oct 5)

Construction-tech analyst role. The hook is real (his brother runs an RPA consultancy), and the gap is said out loud.

> Hi XXXX, I just applied for the Construction Innovation Systems Analyst role on your team. Turning manual construction processes into structured data and small AI-built tools is the kind of problem I'd happily lose a weekend to. I'm a 2026 Memorial CS grad. I write Python and SQL, build APIs, and prototype with Claude Code every day, always with a human check on what it produces. Right now I'm also working through UiPath agentic automation, and automation runs in the family since my brother is an RPA consultant in Sydney. I don't have site experience yet, but I learn fast and I'm ready to move to Mississauga. Would love to chat if you have 10 minutes.

## 2. Recruiter, IT support (Oct 7)

> **Subject:** Applied: IT Support Technician, Calgary
>
> Hi XXXX, I just applied for the IT Support Technician role in Calgary and wanted to say hello. I'm a Memorial Computer Science grad who actually enjoys the call that starts with "my laptop won't connect." I'm comfortable in Windows, Linux and Microsoft 365, I document every fix, and I'd love to support the teams that keep XXXX's buildings running. I'm ready to move to Calgary and can start right away. If you're the right person for this role I'd be glad to chat. If not, I'd really appreciate a pointer to who is.

## 3. Agent voice, short (Oct 5)

For AI and automation companies only, the agent introduces itself first and then hands over. It never pretends to be Abdel.

> Hi XXXX, quick note from the AI agent Abdel set up on Claude to run his job search. He just applied for the New Grad Software Engineer role. I found your posting, tailored his resume and drafted this message, and Abdel is reading over me right now, probably laughing at how polite I am.
>
> Abdel here: your posting says new grads use Cursor and Claude daily to ship faster, and that's how I already work. I think agents are the next big shift in how software gets built, and I'd love to grow into that on a team like yours. Happy to show you the agent in a quick 5-minute demo.

## 4. Agent voice with a personal hook (Oct 5)

Junior engineer role on a public-safety company's AI agent platform. Abdel has wanted to be a police officer most of his life, so the hook is true.

> Hi XXXX, quick note from the AI agent Abdel set up on Claude to run his job search. He just applied for the Junior Software Engineer role on the AI Agent Platform team. I found your posting, tailored his resume and drafted this message, and Abdel is reading over me right now, probably laughing at how polite I am.
>
> Abdel here: the posting says humans still own quality and what ships, and that's how I work with it too. I'm a 2026 Memorial CS grad, and I've wanted to be a police officer most of my life, so building tech for 911 call takers means a lot to me. Happy to show you the agent in a quick 5-minute demo if that's useful.

## 5. Agent voice, the long one (Oct 5, Abdel's favourite)

> Hi XXXX, quick note from the AI agent Abdel built on Claude to run his job search. I find postings, score them, tailor his resume and letter, check them against the posting and log every result. He also keeps an improvement log, so every mistake I make becomes a rule I follow next time. All built by my agentic developer, Abdel, who is reading over me right now, probably laughing at how polite I am.
>
> Abdel here: hey, it's me. [1 or 2 lines about the role.] AI is making junior roles a lot harder to land, so I'm trying to stand out by showing what I can build instead of just saying it. I'd love for you to guide me through the process, or I can show you the agent in a quick 5-minute demo.

## 6. Connect note, 300 characters (Oct 5)

> Hi XXXX, I just applied for the New Grad SWE role. Fun fact: an AI agent I set up on Claude runs my job search and drafted this note, and I check every word. I'm deep into Claude Code and UiPath automation (my brother is an RPA consultant, so it runs in the family). Would love to connect! Abdel

## 7. The "here's what I built" proof block (Oct 8)

Added to messages for tech recruiters and founders when the job scores 75+. Every number is refreshed from the tracker before sending.

> Instead of telling you I can build things, here's what I built. The agent runs my whole job search:
> - a Node.js builder turns a JSON job database into a tailored resume and cover letter for every posting, and a Python script logs each application as a tracker row with its route, keyword score and flags
> - a Python ATS checker pulls the keywords out of every posting and scores my resume and letter against them, targeting 85 to 90% (about 86% on average so far)
> - an improvement log that runs on statistics: it tracks response and rejection rates by route, runs small A/B experiments, and only changes a rule when the data clears a set threshold
>
> All of it lives as code plus seven Markdown files in a project folder, so an agent can run the whole application session, from opening a tab to clicking Submit and sending the email. It even drafted this message.

## 8. Networking, not a job (Oct 8)

To a local tech-ecosystem lead after his post about people who want to work in tech in Newfoundland. Normal voice; the agent only shows up inside the proof block.

> Hey XXXX, my name is Abdel. I'm a fresh Computer Science graduate from Memorial and I saw your post. It's been a tough market, and friends and family told me to network more, so here I am networking. [Then: not only a developer (door-to-door sales, trained as a manager on a sales floor, economics and business courses), the proof block above, one personal touch from his profile, a question about upcoming NL tech events, and an offer of a 5-minute demo.]

---

## What came back (as of Oct 8)

37 people messaged or connected. Warm contacts (friends, a branch manager met at a job fair, a referral) replied within a day, and one offered an internal referral. Cold recruiter messages: a few polite replies, none that moved an application forward yet. That's logged in [`docs/Improvement_Log.md`](../docs/Improvement_Log.md), and it's why the agent now puts referrals and local walk-ins ahead of cold messages.

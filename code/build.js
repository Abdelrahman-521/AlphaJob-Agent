const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat, BorderStyle, TabStopType, ExternalHyperlink,
} = require('docx');

const FONT = 'Calibri';
const W = 12240, H = 15840, M = 792; // 0.55in margins
const TEXT_W = W - 2 * M;
const DATE = new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'America/St_Johns'});
// Contact line. Set CONTACT in the environment; the placeholder keeps personal details out of the repo.
const CONTACT = process.env.CONTACT || "City, Province  |  (XXX) XXX-XXXX  |  you@example.com  |  linkedin.com/in/XXXX  |  github.com/Abdelrahman-521";

const numbering = { config: [{ reference: 'b', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 300, hanging: 200 } } } }] }] };
const run = (t, o = {}) => new TextRun({ text: t, font: FONT, size: o.size || 20, bold: o.bold, italics: o.italics, color: o.color });

function header() {
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [run('ABDELRAHMAN CONBER', { size: 34, bold: true })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [run(CONTACT, { size: 19 })] }),
  ];
}
function section(title) {
  return new Paragraph({
    spacing: { before: 130, after: 50 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '222222', space: 1 } },
    children: [run(title.toUpperCase(), { size: 21, bold: true })],
  });
}
function line(left, right, sub) {
  const kids = [run(left, { bold: true })];
  if (sub) kids.push(run('  |  ' + sub, { italics: true }));
  if (right) kids.push(new TextRun({ text: '\t' + right, font: FONT, size: 20 }));
  return new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TEXT_W }], spacing: { before: 60, after: 10 }, children: kids });
}
const bullet = (t) => new Paragraph({ numbering: { reference: 'b', level: 0 }, spacing: { after: 10 }, children: [run(t)] });
function labeled(label, text) {
  return new Paragraph({ spacing: { after: 20 }, children: [run(label + ': ', { bold: true }), run(text)] });
}
const para = (t, o = {}) => new Paragraph({ spacing: { after: o.after ?? 40 }, children: [run(t, o)] });

function resume(r) {
  const kids = [...header(), section('Summary'), para(r.summary)];
  kids.push(section(r.skillsTitle || 'Technical Skills'));
  r.skills.forEach(([l, t]) => kids.push(labeled(l, t)));
  r.order.forEach((sec) => {
    kids.push(section(sec.title));
    sec.items.forEach((it) => {
      if (it.text) { kids.push(para(it.text)); return; }
      kids.push(line(it.left, it.right, it.sub));
      (it.bullets || []).forEach((b) => kids.push(bullet(b)));
    });
  });
  return new Document({ numbering, sections: [{ properties: { page: { size: { width: W, height: H }, margin: { top: M, bottom: M, left: M, right: M } } }, children: kids }] });
}

function letter(l) {
  const p = (t) => new Paragraph({ spacing: { after: 160, line: 276 }, children: [run(t, { size: 22 })] });
  const kids = [
    ...header(),
    new Paragraph({ spacing: { before: 200, after: 200 }, children: [run(DATE, { size: 22 })] }),
    ...l.to.map((t, i) => new Paragraph({ spacing: { after: i === l.to.length - 1 ? 200 : 0 }, children: [run(t, { size: 22 })] })),
    new Paragraph({ spacing: { after: 160 }, children: [run('Re: ' + l.role, { size: 22, bold: true })] }),
    p(l.greeting),
    ...l.body.map(p),
    new Paragraph({ spacing: { after: 0 }, children: [run('Thanks for your time,', { size: 22 })] }),
    new Paragraph({ spacing: { before: 240 }, children: [run('Abdelrahman Conber', { size: 22, bold: true })] }),
  ];
  return new Document({ sections: [{ properties: { page: { size: { width: W, height: H }, margin: { top: 1080, bottom: 1080, left: 1260, right: 1260 } } }, children: kids }] });
}

// ---------- shared blocks ----------
const EDU = { left: 'BSc Computer Science, Memorial University of Newfoundland', right: 'August 2026' };
const CERTS = 'Deep Learning Specialization (DeepLearning.AI)  |  CS50: Introduction to Computer Science (Harvard)  |  CS50: Introduction to AI with Python (Harvard)';

// ---------- TECH RESUME ----------
const tech = {
  summary: "Computer Science graduate (Memorial University, 2026) who builds working software end to end: PyTorch models, Python data pipelines and REST APIs, shipped in Agile teams with tests and code review. Uses AI-assisted development tools including Claude Code and is completing UiPath automation certifications. Learns new systems fast and ramps up quickly. Based in St. John's, NL.",
  skills: [
    ['Languages', 'Python, JavaScript, SQL, C, C++, Java, Bash'],
    ['AI / ML', 'PyTorch, NumPy, scikit-learn, neural networks, imitation learning (behavior cloning), model predictive control'],
    ['Web & Backend', 'Node.js, Express, React, REST APIs, Bottle (WSGI), MongoDB, HTTP'],
    ['Tools & Practice', 'Git, Linux, Nextflow, Unreal Engine, unit testing, pull-request code review, Agile/Scrum, Kanban, UML, AI-assisted development (Claude Code), UiPath RPA (in progress)'],
  ],
  order: [
    { title: 'Projects', items: [
      { left: 'Behavior Cloning Autonomous Driving Agent', sub: 'Python, PyTorch', right: 'Autonomous Robotics, MUN', bullets: [
        'Implemented the PyTorch training loop (Adam optimizer, MSE loss, 100 epochs) that taught a neural network to steer a simulated robot around a track by imitating an expert controller (behavior cloning).',
        'Captured 500 lidar training samples in the course simulator, trained the model and tested the learned policy on two tracks.',
      ]},
      { left: 'Multiplayer Game Server and REST API', sub: 'Python, Bottle, HTTP', right: '5-person Agile team, MUN', bullets: [
        'Owned the server API end to end: HTTP routing for registration, login, game state and move handling.',
        'Delivered in sprints with UML architecture docs, unit tests, pull-request code reviews and Kanban tracking.',
      ]},
      { left: 'Automated Viral Phylogenetics Data Pipeline', sub: 'Python, BioPython, Bash, Nextflow', right: 'Bioinformatics, MUN', bullets: [
        'Built a multi-stage pipeline that downloads, cleans and aligns 38 viral RNA polymerase sequences from NCBI.',
        'Wrote error-recovery logic that detects failed downloads and re-fetches from the correct database automatically; ran ClustalW and T-Coffee in parallel to cross-validate results.',
      ]},
    ]},
    { title: 'Education', items: [
      EDU,
      { text: 'Relevant coursework: Algorithms & AI, Autonomous Robotics, Software Engineering, Operating Systems, Data Structures, Bioinformatics' },
      { text: 'Online courses (in progress): ' + CERTS },
    ]},
    { title: 'Experience', items: [
      { left: 'Sales Associate, Footwear', sub: 'Sport Chek, St. John\'s', right: 'May 2025 – Sep 2026', bullets: [
        'Sold footwear on a close-knit sales team at a store working hard to hit its daily targets; led the store in loyalty program sign-ups.',
      ]},
      { left: 'Interpreter & Translator (Arabic ↔ English)', sub: 'Association for New Canadians', right: 'Mar 2023 – Apr 2024', bullets: [
        'Translated legal documents and interpreted for Arabic-speaking newcomers with English-speaking staff.',
      ]},
      { left: 'Research Assistant', sub: 'Memorial University of Newfoundland', right: 'Winter 2023', bullets: [
        'Built interview frameworks, coordinated participants and wrote up findings for a physician-led qualitative study.',
      ]},
      { left: 'OMNI Customer Fulfillment Associate', sub: 'Walmart, St. John\'s', right: 'May – Aug 2022', bullets: [
        'Learned the full fulfillment system in under two weeks, then trained new hires; owned inventory accuracy through live tracking, cycle counts and discrepancy resolution.',
      ]},
    ]},
    { title: 'Additional', items: [
      { text: 'Languages: English (native), Arabic (native)  |  MUN Sea-Hawks varsity mid-distance runner, two seasons  |  Two-time 50K ultramarathon finisher (Joy Run, Steep Ultra)' },
    ]},
  ],
};

// ---------- CLIENT / INSURANCE RESUME ----------
const client = {
  summary: "Sales associate and Computer Science graduate who builds trust with customers fast. Spent a year and a half on a close-knit sales team at Sport Chek, pushing hard to hit targets at a store that had to fight for every sale. Bilingual in English and Arabic, calm in high-stakes conversations and quick to learn new systems.",
  skillsTitle: 'Core Skills',
  skills: [
    ['Client & Sales', 'Needs assessment, consultative selling, client retention, account development, new business, loyalty programs, conflict resolution, customer service'],
    ['Analytical', 'Attention to detail, data analysis, Excel and Google Sheets, inventory reconciliation, Python and SQL'],
    ['Systems', 'Microsoft Office (Word, Excel, Outlook), POS and inventory systems; learns new platforms in under two weeks'],
    ['Languages', 'English (native), Arabic (native)'],
  ],
  order: [
    { title: 'Experience', items: [
      { left: 'Sales Associate, Footwear', sub: 'Sport Chek, St. John\'s', right: 'May 2025 – Sep 2026', bullets: [
        'Sold footwear on a close-knit sales team at a store working hard every day to hit its targets; focused on active selling and finding customers the right fit.',
        'Moved from passive retail to active selling by approaching customers and asking questions.',
        'Led the store in loyalty program sign-ups.',
        'Managed inventory replenishment and floor standards alongside sales targets.',
      ]},
      { left: 'Interpreter & Translator (Arabic ↔ English)', sub: 'Association for New Canadians', right: 'Mar 2023 – Apr 2024', bullets: [
        'Interpreted in stressful, high-stakes appointments for Arabic-speaking newcomers, keeping clients informed and supported.',
        'Translated legal documents and forms where every detail had to be exact.',
      ]},
      { left: 'Sales Associate', sub: 'Charm Diamond Centres, St. John\'s', right: 'Aug – Nov 2022', bullets: [
        'Advised customers on high-value purchases, resolved customer issues and supported the manager with scheduling and planning.',
      ]},
      { left: 'OMNI Customer Fulfillment Associate', sub: 'Walmart, St. John\'s', right: 'May – Aug 2022', bullets: [
        'Resolved escalated customer calls and order issues by coordinating in real time across floor, grocery and pickup teams.',
        'Owned inventory accuracy through live tracking, cycle counts and discrepancy resolution; learned the system in under two weeks and trained new hires.',
      ]},
      { left: 'Research Assistant', sub: 'Memorial University of Newfoundland', right: 'Winter 2023', bullets: [
        'Built interview frameworks, coordinated participants and summarized findings for a physician-led study.',
      ]},
    ]},
    { title: 'Education', items: [
      EDU,
      { text: 'Certifications: Effective Leadership and Strategic Planning (HP)  |  Communication and Interpersonal Skills (University of Leeds)  |  Deep Learning Specialization (DeepLearning.AI, in progress)' },
    ]},
    { title: 'Leadership & Additional', items: [
      { left: 'Event Coordinator', sub: 'Muslim Student Association, MUN', right: '2022 – 2026', bullets: [
        'Planned and ran campus events, coordinating vendors, volunteers and university partners.',
      ]},
      { text: 'MUN Sea-Hawks varsity mid-distance runner, two seasons  |  Two-time 50K ultramarathon finisher (Joy Run, Steep Ultra)' },
    ]},
  ],
};

const mgmt = {
  summary: "Retail leader and Computer Science graduate with about a year of leadership built across several stores. Trained new hires at Walmart, supported the manager with scheduling and planning at Charm Diamond Centres and was on track for manager training at Sport Chek. Leads by example on the floor, coaches people through the why, and keeps standards and inventory tight. Bilingual in English and Arabic.",
  skillsTitle: 'Core Skills',
  skills: [
    ['Leadership', 'Training and onboarding new hires, coaching on the floor, scheduling and planning support, leading by example, conflict resolution'],
    ['Sales & Service', 'Working toward daily sales targets, loyalty programs, clienteling, active selling, handling escalated customers'],
    ['Operations', 'Inventory accuracy, cycle counts, discrepancy resolution, replenishment, visual and floor standards, POS systems'],
    ['Systems & Languages', 'Microsoft Office, Excel and Google Sheets, learns new store systems in under two weeks  |  English and Arabic (native)'],
  ],
  order: [
    { title: 'Experience', items: [
      { left: 'Sales Associate, Footwear', sub: 'Sport Chek, St. John\'s', right: 'May 2025 – Sep 2026', bullets: [
        'Sold footwear on a close-knit sales team at a store working hard every day to hit its targets; focused on active selling and finding customers the right fit.',
        'Led the store in loyalty program sign-ups.',
        'Owned inventory replenishment and floor standards alongside sales targets.',
        'Was being trained as a manager: reviewed customer survey metrics and ran cycle counts with the store managers, took an active part in hiring, and interviewed for management roles including Footwear Manager.',
      ]},
      { left: 'Sales Associate', sub: 'Charm Diamond Centres, St. John\'s', right: 'Aug – Nov 2022', bullets: [
        'Supported the store manager with scheduling and planning.',
        'Advised customers on high-value purchases and resolved customer issues.',
      ]},
      { left: 'OMNI Customer Fulfillment Associate', sub: 'Walmart, St. John\'s', right: 'May – Aug 2022', bullets: [
        'Learned the full fulfillment system in under two weeks, then trained the new hires on it.',
        'Owned inventory accuracy through live tracking, cycle counts and discrepancy resolution.',
        'Coordinated in real time across floor, grocery and pickup teams to resolve escalated customer issues.',
      ]},
      { left: 'Interpreter & Translator (Arabic ↔ English)', sub: 'Association for New Canadians', right: 'Mar 2023 – Apr 2024', bullets: [
        'Interpreted in stressful appointments for Arabic-speaking newcomers and translated legal documents where every detail mattered.',
      ]},
    ]},
    { title: 'Education', items: [ EDU ]},
    { title: 'Leadership & Additional', items: [
      { left: 'Event Coordinator', sub: 'Muslim Student Association, MUN', right: '2022 – 2026', bullets: [
        'Planned and ran campus events, coordinating vendors, volunteers and university partners.',
      ]},
      { text: 'MUN Sea-Hawks varsity mid-distance runner, two seasons  |  Two-time 50K ultramarathon finisher (Joy Run, Steep Ultra)  |  Full driver\'s licence' },
    ]},
  ],
};

// ---------- SALES RESUME (SDR / BDR / inside sales) ----------
const salesR = {
  summary: "Computer Science graduate (Memorial, 2026) with a year and a half of front-line sales experience. A year and a half on a close-knit footwear sales team at Sport Chek, working hard to hit targets at a store that had to fight for every sale. Comfortable starting conversations with strangers, following up and closing. Technical enough to learn an AI-powered SaaS product properly and explain it in plain language. Bilingual in English and Arabic.",
  skillsTitle: 'Core Skills',
  skills: [
    ['Sales & Outreach', 'Prospecting and starting conversations, needs discovery, objection handling, follow-up, closing, loyalty and retention programs'],
    ['Tech Fluency', 'Python, SQL, REST APIs, AI and machine learning (PyTorch), AI-assisted tools (Claude Code), learns new software fast'],
    ['Tools', 'Microsoft Office, Excel and Google Sheets, LinkedIn, POS and inventory systems, Git'],
    ['Languages', 'English (native), Arabic (native)'],
  ],
  order: [
    { title: 'Experience', items: [
      { left: 'Sales Associate, Footwear', sub: 'Sport Chek, St. John\'s', right: 'May 2025 – Sep 2026', bullets: [
        'Sold footwear on a close-knit sales team at a store working hard every day to hit its targets; focused on active selling and finding customers the right fit.',
        'Turned a passive role into active selling by approaching customers, asking questions and matching them to the right product.',
        'Led the store in loyalty program sign-ups.',
        'Was on track for manager training.',
      ]},
      { left: 'Sales Associate', sub: 'Charm Diamond Centres, St. John\'s', right: 'Aug – Nov 2022', bullets: [
        'Advised customers on high-value, personal purchases and supported the manager with scheduling and planning.',
      ]},
      { left: 'Interpreter & Translator (Arabic ↔ English)', sub: 'Association for New Canadians', right: 'Mar 2023 – Apr 2024', bullets: [
        'Interpreted in high-stakes appointments and translated legal documents where every detail had to be exact.',
      ]},
      { left: 'OMNI Customer Fulfillment Associate', sub: 'Walmart, St. John\'s', right: 'May – Aug 2022', bullets: [
        'Learned the full fulfillment system in under two weeks, trained new hires and resolved escalated customer order issues.',
      ]},
    ]},
    { title: 'Technical Projects', items: [
      { left: 'Multiplayer Game Server and REST API', sub: 'Python, Bottle', right: '5-person Agile team, MUN', bullets: [
        'Owned the server API end to end (registration, login, game state) and shipped in sprints with code review.',
      ]},
      { left: 'Behavior Cloning Driving Agent', sub: 'Python, PyTorch', right: 'Autonomous Robotics, MUN', bullets: [
        'Implemented the PyTorch training loop that taught a neural network to steer a simulated robot by imitating an expert controller.',
      ]},
    ]},
    { title: 'Education', items: [ EDU ]},
    { title: 'Additional', items: [
      { left: 'Event Coordinator', sub: 'Muslim Student Association, MUN', right: '2022 – 2026', bullets: [
        'Planned and ran campus events, coordinating vendors, volunteers and university partners.',
      ]},
      { text: 'MUN Sea-Hawks varsity mid-distance runner, two seasons  |  Two-time 50K ultramarathon finisher (Joy Run, Steep Ultra)' },
    ]},
  ],
};

// ---------- AI and DATA variants (tech resume with a different summary) ----------
const aiR = Object.assign({}, tech, {
  summary: "Computer Science graduate (Memorial University, 2026) who likes building AI that has to work for real people, not just in a notebook. Trained a PyTorch behavior cloning model for a simulated robot, worked on a fault-tolerant bioinformatics pipeline and owned a REST API on an Agile team. Uses AI-assisted development (Claude Code) every day. Also spent years in customer-facing work: a year and a half on a sales floor and a year interpreting in high-stakes appointments, so asking good questions and explaining technical things plainly comes naturally. Based in St. John's, NL.",
});

// Tech resume for developer / AI roles: drop the 2022 Walmart retail line (keep it for IT support, ops and systems roles).
const techDev = (() => { const r = structuredClone(tech); r.order.forEach(sec => { if (sec.title === 'Experience') sec.items = sec.items.filter(i => !/Walmart/.test(i.sub || '')); }); return r; })();

const dataR = Object.assign({}, tech, { summary: "Computer Science graduate (Memorial University, 2026) who cares about getting data exactly right. Worked on a team bioinformatics pipeline that cleans, repairs and validates 38 NCBI sequences, owned inventory accuracy and discrepancy resolution at Walmart, and translated legal documents where one wrong detail mattered. Python, SQL and Excel fluent, and uses AI-assisted tooling (Claude Code) carefully, with a human check on every output." });

// ---------- COVER LETTERS ----------
// The private version also holds hand-written letters for the first ~20 applications.
// They named real people and companies, so they are not in the public copy. Every
// later letter is generated from national.json by natLetter() below.
const letters = {};

// ---------- national track (Express Entry / PNP), generated from national.json ----------
// One entry per tailored application. The real file (150+ entries) stays private; the sample shows the shape.
const NAT_FILE = ['/national.json', '/national.sample.json'].map(f => __dirname + f).find(f => fs.existsSync(f));
const NAT = NAT_FILE ? JSON.parse(fs.readFileSync(NAT_FILE, 'utf8')) : [];
const NATP = {
  sales: "I'm a CS grad who genuinely likes selling. I learned the fundamentals of door-to-door selling from Sales Superstar and took economics and business courses alongside my degree, and I understand software well enough to explain it simply. Door to door taught me that a no is just information. I research before I reach out, I follow up without being pushy, and I care more about whether the customer actually needs it than about closing at any cost.",
  finance: "Money conversations need trust, and that's where I'm strongest. I took economics and business courses alongside my Computer Science degree, so I'm comfortable with numbers and I can explain them in plain language. I learned the fundamentals of door-to-door selling from Sales Superstar, and they taught me to listen first, earn trust quickly and only recommend what actually fits. I follow up without being pushy, and I care more about the customer's goals than about closing at any cost.",
  dev: "At Memorial I owned the REST API for a five-person Agile team building a multiplayer game server, with unit tests, code reviews and sprints. I implemented the PyTorch training loop for a behavior cloning driving agent and tested it in a robot simulator, and I built a Python pipeline that catches its own failed downloads and recovers without anyone touching it. My code is at github.com/Abdelrahman-521.",
  support: "Troubleshooting is the part of tech I enjoy most. At Memorial I owned the REST API for a five-person Agile team's game server and debugged it end to end, and I'm comfortable in Python, SQL, Linux and Git. I've also spent years with customers, so I can take a frustrated person through a technical fix in plain language and stay calm doing it.",
  data: "Data work is where my CS degree and my love of getting details right meet. I built a Python pipeline at Memorial that downloads, cleans and aligns 38 sequences from NCBI and recovers from its own failed downloads, and I'm comfortable in SQL and Python. At Walmart I owned inventory accuracy through live tracking, cycle counts and discrepancy fixes, so I know how much bad data costs a business.",
  impl: "Implementation sits where my two backgrounds meet. I understand how software is configured and integrated, from REST APIs to SQL databases, and I've spent years with customers, so I can turn what a client says into clear requirements and then explain the result back in plain language. I learn new platforms fast and I like keeping several projects moving at once.",
  admin: "I'm organized by nature and I like being the person who keeps things moving. I'm at home in Microsoft 365, from Outlook and Teams to Word, Excel and PowerPoint, and I pick up new software fast. With a Computer Science degree, I can sort out a printer connection or a meeting-room screen without a call to IT. I write clearly, I keep track of the details and I follow up so nothing gets lost.",
  service: "Helping people is what I'm best at. The part of any job I love most is a customer coming in with a problem and walking out with it solved. I'm comfortable with simple sales conversations because I only suggest what actually helps, I explain complicated things simply, and as a Computer Science grad I can walk anyone through an app or a new system until they're confident using it on their own.",
  ai: "AI is what I'm most excited about. At Memorial I implemented the PyTorch training loop for a behavior cloning agent that learned to steer a simulated robot by imitating an expert controller. I use Claude Code in my own workflow every day and I'm working through UiPath automation courses, because agents and automation are where I want to build my career. My code is at github.com/Abdelrahman-521.",
};
const NATP3 = "I also bring things a lot of new grads don't. I sold door to door and spent a year and a half on a sales team at Sport Chek, where I was being trained as a manager and helped with hiring. At Walmart I learned a full fulfillment system in under two weeks and then trained the new hires on it. I learn fast, I own problems and I'm comfortable explaining technical things to people who aren't technical.";
function natLetter(j) {
  const where = j.local ? "I live in St. John's and can start right away." : j.remote ? "I can work remotely from St. John's and I'm happy to relocate if the team ever needs it." : `I'm ready to relocate to ${j.city} as soon as there's an offer, and I can be on site from day one.`;
  return { to: ['Hiring Team', j.company, j.city], role: j.role, greeting: `Hi ${j.company} team,`, body: [
    `I'm applying for the ${j.role} role${j.remote ? '' : ' in ' + j.city}. ${j.hook}`,
    NATP[j.track],
    NATP3,
    `I'm a new grad, so ${j.gap || "I haven't shipped production software at scale yet"}. I'm a fighter though. I ran varsity track for the Sea-Hawks and have finished two 50K ultramarathons, and I bring that same stubbornness to a hard problem. ${where} I'd love to talk.`,
  ].concat(j.ps ? [j.ps] : [])};
}
for (const j of NAT) letters['CoverLetter_' + j.key] = natLetter(j);
if (process.env.TEXT) { const l = letters['CoverLetter_' + process.env.TEXT] || letters[process.env.TEXT]; console.log([l.greeting, ...l.body, 'Thanks for your time,', 'Abdelrahman Conber'].join('\n\n')); process.exit(0); }
const NATBASE = { techDev: () => techDev, tech: () => tech, data: () => dataR, ai: () => aiR, sales: () => salesR, client: () => client, mgmt: () => mgmt };
(async () => {
  const out = [
    ['Abdelrahman_Conber_Resume_Tech', resume(tech)],
    ['Abdelrahman_Conber_Resume_ClientAdvisor', resume(client)],
    ['Abdelrahman_Conber_Resume_RetailManagement', resume(mgmt)],
    ...NAT.map(j => { const r = structuredClone(NATBASE[j.resume]()); if (j.summary) r.summary = j.summary; if (j.skills) r.skills = j.skills; if (['sales','client','mgmt'].includes(j.resume) || ['sales','finance'].includes(j.track)) { const ed = (r.order || []).find(x => x.title === 'Education'); if (ed) ed.items = ed.items.map((it, i) => i === 0 ? Object.assign({}, it, { bullets: [...(it.bullets || []), 'Coursework in economics and business alongside the degree.'] }) : it); } return ['Abdelrahman_Conber_Resume_' + j.key, resume(r)]; }),
    ...Object.entries(letters).map(([k, v]) => ['Abdelrahman_Conber_' + k, letter(v)]),
  ];
  const ONLY = process.env.ONLY ? new RegExp(process.env.ONLY) : null;
  for (const [name, doc] of out) { if (ONLY && !ONLY.test(name)) continue; fs.writeFileSync(name + '.docx', await Packer.toBuffer(doc)); }
  console.log('built', out.length);
})();

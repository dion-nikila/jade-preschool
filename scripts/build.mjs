import { mkdir, rm, cp, writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";
import { programmes, faqs, leadership } from "./content.mjs";
import { butterfly, garden } from "./garden.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dist");
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(path.join(root, "assets"), path.join(out, "assets"), {
  recursive: true,
});
// Fingerprinted paths keep returning visitors from mixing releases.
const versioned = {};
for (const name of [
  "styles.css",
  "fonts.css",
  "main.js",
  "favicon.svg",
  "garden.css",
  "garden.js",
]) {
  const contents = await readFile(path.join(root, "assets", name));
  const hash = createHash("sha256").update(contents).digest("hex").slice(0, 12);
  const ext = path.extname(name);
  const filename = `${path.basename(name, ext)}.${hash}${ext}`;
  await writeFile(path.join(out, "assets", filename), contents);
  versioned[name] = filename;
}
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="square"/></svg>';
const northeast =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.4"/></svg>';
const nav = [
  ["The school", "our-approach"],
  ["Programmes", "programmes"],
  ["Life at Jade", "life-at-jade"],
];
function link(base, slug = "", suffix = "") {
  return base + (slug ? slug + "/" : "") + suffix;
}
function img(base, n, alt, cl = "", eager = false) {
  return `<img class="${cl}" src="${base}assets/images/jade-${n}.jpg" alt="${alt}" width="800" height="1000" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
function button(href, label, cl = "button") {
  return `<a class="${cl}" href="${href}"><span>${label}</span>${arrow}</a>`;
}
function logo(b) {
  return `<span class="logo-window"><img src="${b}assets/images/school-logo.png" alt="Jade Preschool and Day Care" width="600" height="600"></span>`;
}
function shell(slug, title, description, body, override) {
  const b = override ?? (slug ? "../" : "./");
  return `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#ffffff"><meta name="robots" content="noindex,follow"><title>${title} | Jade Preschool & Day Care</title><meta name="description" content="${description}"><meta property="og:title" content="${title} | Jade Preschool & Day Care"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta property="og:image" content="https://dion-nikila.github.io/jade-preschool/assets/images/jade-7.jpg"><link rel="icon" href="${b}assets/${versioned["favicon.svg"]}" type="image/svg+xml"><link rel="stylesheet" href="${b}assets/${versioned["fonts.css"]}"><link rel="stylesheet" href="${b}assets/${versioned["styles.css"]}"><link rel="stylesheet" href="${b}assets/${versioned["garden.css"]}"><script src="${b}assets/${versioned["main.js"]}" defer></script><script src="${b}assets/${versioned["garden.js"]}" defer></script></head>
<body class="page-${slug || "home"}"><a class="skip-link" href="#main">Skip to content</a>
<header class="header"><div class="nav-wrap"><a class="brand" href="${b}" aria-label="Jade Preschool and Day Care home">${logo(b)}</a><button class="menu-toggle" aria-expanded="false" aria-controls="navigation" aria-label="Open menu"><span></span><span></span></button><nav id="navigation" aria-label="Main navigation">${nav.map(([n, s]) => `<a href="${link(b, s)}" ${s === slug ? 'aria-current="page"' : ""}>${n}</a>`).join("")}<a class="nav-visit" href="${link(b, "visit")}" ${slug === "visit" ? 'aria-current="page"' : ""}>Arrange a visit ${northeast}</a></nav></div></header>
<main id="main">${body(b)}</main>${footer(b)}
<dialog class="lightbox" aria-label="Photo viewer"><button class="lightbox-close" aria-label="Close photo viewer">Close ${'<span aria-hidden="true">×</span>'}</button><img alt=""><p></p></dialog></body></html>`;
}
function footer(b) {
  return `<footer class="footer"><div class="footer-invitation"><div class="section-wrap footer-invitation-grid"><div><p class="eyebrow">VISITING & ADMISSIONS</p><h2>Come and see<br>the school.</h2>${button(link(b, "visit"), "Arrange your visit", "text-link")}</div><div class="footer-address"><span class="eyebrow">JADE PRESCHOOL & DAY CARE</span><address>30, Asoka Gardens<br>Colombo 04, Sri Lanka</address><a href="tel:+94773954321">+94 77 395 4321</a><a href="https://www.google.com/maps/search/?api=1&query=Jade+Preschool+30+Asoka+Gardens+Colombo+04" target="_blank" rel="noopener">Directions ${northeast}</a><p>Visits by arrangement.</p></div></div></div><div class="footer-garden-wrap section-wrap">${garden("footer-garden", 3)}</div><div class="footer-base section-wrap"><a class="footer-school" href="${b}">Jade Preschool & Day Care</a><div class="footer-links"><a href="https://www.instagram.com/jade.preschool.daycare/" target="_blank" rel="noopener">Instagram</a><a href="https://www.facebook.com/jadepreschool/" target="_blank" rel="noopener">Facebook</a><a href="${link(b, "privacy")}">Privacy & credits</a></div><p>Independent website concept</p></div></footer>`;
}
function faqList(items = faqs) {
  return `<div class="faq-list">${items.map(([q, a]) => `<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`).join("")}</div>`;
}
function intro(label, title, description) {
  return `<section class="page-intro section-wrap"><p class="eyebrow">${label}</p><h1>${title}</h1>${description ? `<p class="page-description">${description}</p>` : ""}</section>`;
}
function caption(left, right = "") {
  return `<figcaption class="caption-line"><span>${left}</span><span>${right}</span></figcaption>`;
}
const home = (b) => `
<section class="playful-hero">
 <div class="section-wrap playful-hero-grid">
  <div class="playful-copy"><p class="eyebrow">JADE PRESCHOOL & DAY CARE · COLOMBO</p><h1><span class="hero-line">A school day</span><span class="hero-line">to get <em>excited</em></span><span class="hero-line">about.</span></h1><p class="playful-description">Paint, play, new friends and something to tell you on the way home. Discover preschool and day care at Jade.</p><div class="playful-actions">${button(link(b, "visit"), "Come and meet us")}${button(link(b, "programmes"), "Our programmes", "text-link")}</div></div>
  <div class="playful-art"><div class="garden-sky" aria-hidden="true"><span class="sky-cloud cloud-one"></span><span class="sky-cloud cloud-two"></span><span class="garden-sun"></span></div><figure class="play-photo play-photo-main">${img(b, 7, "A teacher and children painting together at Jade", "", true)}<figcaption>A little paint. A lot happening.</figcaption></figure><figure class="play-photo play-photo-small">${img(b, 3, "Children enjoying the outdoor play area at Jade", "", true)}<figcaption>Better with friends.</figcaption></figure>${butterfly("blue", "hero-butterfly-one")}${butterfly("pink", "hero-butterfly-two")}${butterfly("orange", "hero-butterfly-three")}${garden("hero-garden")}</div>
 </div><button class="motion-toggle" type="button" aria-pressed="false" hidden><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5v10M13 5v10" stroke="currentColor" stroke-width="2"/></svg><span>Pause animations</span></button><svg class="hero-ground" viewBox="0 0 1440 50" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30C160 0 290 50 460 30S740 6 940 28s310 20 500-7V50H0Z" fill="white"/></svg>
</section>
<section class="school-introduction section-wrap"><div><p class="eyebrow">OUR SCHOOL</p><h2>Welcome<br>to Jade.</h2></div><div class="introduction-body"><p class="large-copy">A preschool and day care in Colombo, where children learn through play, get to know one another, and begin to find their own feet.</p><div class="introduction-detail"><p>Stories, painting, music and hands-on activities form part of Jade’s approach to early learning. Teachers guide children as they build language, confidence and independence.</p>${button(link(b, "our-approach"), "Get to know the school", "text-link")}</div></div></section>
${garden("garden-meadow section-wrap", 5)}
<section class="home-programmes section-wrap"><div class="section-heading"><p class="eyebrow">LEARNING AT JADE</p><h2>Where will they begin?</h2></div><div class="programme-overview"><figure class="programme-overview-image">${img(b, 4, "A child at Jade drawing at a wooden table")}${caption("Concentration, at their own pace.")}</figure><div class="programme-list">${programmes.map((p, i) => `<a class="programme-row" href="${link(b, "programmes", "#" + p.slug)}"><span class="row-number">0${i + 1}</span><div><h3>${p.name}</h3><p>${p.description}</p></div>${northeast}</a>`).join("")}<p class="programme-advice">Not sure which programme? <a href="${link(b, "visit")}">Speak to the school.</a></p></div></div></section>
<section class="home-observation"><div class="section-wrap observation-grid"><figure>${img(b, 1, "A child painting bright handprints at Jade")}${caption("Painting at Jade")}</figure><div class="observation-copy"><p class="eyebrow">A LOOK INSIDE</p><h2>What learning<br>looks like here.</h2><p>There is a lot happening at the painting table. Choosing a colour. Holding a brush. Asking for a turn. Talking about what they have made.</p><p>See the children, teachers and everyday activities that make up life at Jade.</p>${button(link(b, "life-at-jade"), "See life at Jade", "text-link")}</div></div></section>
<div class="section-wrap garden-after-play">${garden("garden-patch", 3)}</div>
<section class="home-practical section-wrap"><p class="eyebrow">BEFORE YOU VISIT</p><div><h2>A few practical questions.</h2>${faqList(faqs.slice(0, 3))}</div></section>`;
const approach = (b) => `
${intro("THE SCHOOL", "Learning<br>through play.", "Jade’s approach brings social, emotional, physical and intellectual development into the same school day.")}
<figure class="approach-lead section-wrap">${img(b, 7, "A Jade teacher painting with a small group of children", "", true)}${caption("A shared activity, with a teacher close by.", "JADE PRESCHOOL & DAY CARE")}</figure>
<section class="approach-article section-wrap"><aside><p class="eyebrow">OUR APPROACH</p><h2>How children<br>learn at Jade.</h2></aside><div class="article-sections"><article><h3>Through doing.</h3><p>Art, music, storytelling and hands-on exploration give children ways to develop early language, number and problem-solving skills. They take part in learning through materials and activities they can engage with.</p></article><article><h3>With other people.</h3><p>Sharing materials, listening to a story and joining a game are part of learning to be in a group. Teachers guide children as they communicate, build friendships and become more independent.</p></article><article><h3>As individuals.</h3><p>Children bring different interests and experiences to school. Jade’s approach considers the whole child. Conversations with families help the team understand the child beyond the classroom.</p></article></div></section>
<section class="school-spaces"><div class="section-wrap spaces-grid"><div><p class="eyebrow">THE LEARNING ENVIRONMENT</p><h2>Space to make.<br>Space to move.</h2><p>Jade’s published facilities include classrooms and learning corners, indoor and outdoor play areas, a reading and activity room, and space for rest.</p><p>A visit is the best opportunity to see how the spaces are used and ask about your child’s programme.</p>${button(link(b, "visit"), "Arrange a school visit", "text-link")}</div><figure>${img(b, 3, "Children together in Jade’s outdoor play space")}${caption("The outdoor play area")}</figure></div></section>
<section class="leadership section-wrap"><div><p class="eyebrow">SCHOOL LEADERSHIP</p><h2>The people<br>behind Jade.</h2></div><div class="leadership-list">${leadership.map(([name, role]) => `<article><h3>${name}</h3><p>${role}</p></article>`).join("")}<p class="source-note">Leadership roles as listed on Jade’s <a href="https://jadepreschool.com/about-us" target="_blank" rel="noopener">school website</a>.</p></div></section>`;
const programmePage = (b) => `
${intro("PROGRAMMES", "Programmes<br>at Jade.", "Playgroup, Nursery, Lower and Upper Kindergarten, and Day Care. Explore the programmes, then speak with the school about your child.")}
<nav class="programme-tabs" aria-label="Programme sections"><div class="section-wrap">${programmes.map((p, i) => `<a href="#${p.slug}"><span>0${i + 1}</span>${p.name}${arrow}</a>`).join("")}</div></nav>
<div class="programme-chapters">${programmes.map((p, i) => `<section id="${p.slug}" class="programme-detail section-wrap"><div class="programme-detail-heading"><span class="chapter-number">0${i + 1}</span><h2>${p.name}</h2><p>${p.label}</p></div><figure>${img(b, p.image, p.alt, "", i === 0)}${caption(p.note)}</figure><div class="programme-detail-copy"><p>${p.detail}</p><h3>Part of the programme</h3><ul>${p.activities.map((x) => `<li>${x}</li>`).join("")}</ul>${button(link(b, "visit", "?programme=" + p.slug), "Enquire about " + p.name, "text-link")}</div></section>`).join("")}</div>
<section class="programme-information section-wrap"><p class="eyebrow">CHOOSING A PROGRAMME</p><div><h2>Start with your child.</h2><p>Age is a starting point. Tell the team about your child’s previous experience, preferred start date and the care you need. They can advise on entry requirements, fees and available sessions.</p>${button(link(b, "visit"), "Contact admissions", "text-link")}</div></section>`;
const photos = [
  {
    n: 7,
    title: "At the painting table",
    alt: "A teacher painting with children in a small group at Jade",
  },
  {
    n: 3,
    title: "Outside with friends",
    alt: "A group of children in Jade’s outdoor play area",
  },
  {
    n: 1,
    title: "Working with colour",
    alt: "A Jade child making bright handprints with paint",
  },
  {
    n: 4,
    title: "Drawing and making",
    alt: "A child concentrating on a drawing at a wooden table",
  },
  {
    n: 5,
    title: "Time to move",
    alt: "A young child stepping through colourful hoops during a group activity",
  },
  {
    n: 6,
    title: "A reassuring hand",
    alt: "A young child holding an adult’s hand",
  },
];
const life = (b) => `
${intro("LIFE AT JADE", "A look around<br>the school.", "Children, teachers and everyday activities. Photographs from Jade’s own school website.")}
<section class="gallery section-wrap" aria-label="Photographs of Jade">${photos.map((x, i) => `<figure class="gallery-item gallery-item-${i}"><button class="gallery-open" data-caption="${x.title}" aria-label="Enlarge photo: ${x.alt}">${img(b, x.n, x.alt, "", i < 2)}<span class="gallery-expand" aria-hidden="true">${northeast}</span></button>${caption(`${String(i + 1).padStart(2, "0")} / ${x.title}`, "JADE")}</figure>`).join("")}</section>
<section class="photo-afterword section-wrap"><p class="eyebrow">SEE IT IN PERSON</p><p class="large-copy">A photograph can give you an impression. A visit gives you time to look around, meet the team and ask the questions that matter to your family.</p></section>`;
const visit = (b) => `
${intro("VISITING & ADMISSIONS", "Visit Jade Preschool.", "See the school and meet the team before deciding. Get in touch to discuss a visit, programme options or care arrangements.")}
<section class="visit-layout section-wrap"><aside class="visit-details"><p class="eyebrow">FIND US</p><address>30, Asoka Gardens<br>Colombo 04, Sri Lanka</address>${button("https://www.google.com/maps/search/?api=1&query=Jade+Preschool+30+Asoka+Gardens+Colombo+04", "Get directions", "text-link")}<div class="visit-contact"><p class="eyebrow">CALL THE SCHOOL</p><a href="tel:+94773954321">+94 77 395 4321</a></div><p class="small-print">Visits by arrangement. Please confirm the location and time with the school.</p><div class="admissions-steps"><p class="eyebrow">ADMISSIONS</p><ol><li>Contact the school.</li><li>Arrange a visit.</li><li>Discuss the programme, fees and next steps.</li></ol></div></aside>
<div class="enquiry-panel"><div class="enquiry-heading"><h2>Arrange a visit</h2><p>Prepare an enquiry to send to Jade on WhatsApp.</p></div><form id="visit-form"><div class="field"><label for="parent-name">Parent or guardian’s name <span>(required)</span></label><input id="parent-name" name="name" autocomplete="name" required maxlength="80" placeholder="Your name"></div><div class="form-row"><div class="field"><label for="child-age">Child’s age <span>(required)</span></label><select id="child-age" name="age" required><option value="">Please choose</option><option>Under 2 years</option><option>2 years</option><option>3 years</option><option>4 years</option><option>5 years</option><option>6 years or older</option></select></div><div class="field"><label for="programme">Programme</label><select id="programme" name="programme"><option value="unsure">Help me choose</option><option value="playgroup">Playgroup</option><option value="nursery">Nursery</option><option value="kindergarten">Kindergarten</option><option value="daycare">Day Care</option></select></div></div><div class="field"><label for="visit-date">Preferred visit date <span>(optional)</span></label><input id="visit-date" type="date" name="date"><span class="field-help">The school will confirm a time with you.</span></div><div class="field"><label for="message">Questions or care requirements <span>(optional)</span></label><textarea id="message" name="message" rows="3" maxlength="1000" placeholder="What would you like to ask?"></textarea></div><div class="form-bottom"><p class="form-privacy">Nothing is sent until you review and send your message in WhatsApp. <a href="${link(b, "privacy")}">Privacy</a></p><button class="button" type="submit">Review enquiry ${arrow}</button></div></form><div class="enquiry-review" id="enquiry-review" hidden aria-live="polite" tabindex="-1"><h3>Your enquiry</h3><p>Nothing has been sent yet.</p><pre id="message-preview"></pre><a class="button" id="whatsapp-link" target="_blank" rel="noopener">Continue to WhatsApp ${arrow}</a><button class="edit-enquiry" type="button">Edit enquiry</button><p class="small-print">Send the message in WhatsApp. The school will confirm your arrangements directly.</p></div></div></section>
<section class="visit-faq section-wrap"><div><p class="eyebrow">ADMISSIONS QUESTIONS</p><h2>Before you visit.</h2></div>${faqList()}</section>`;
const privacy = (b) => `
${intro("INFORMATION", "Privacy & credits.", "About this independent prototype and the information used to create it.")}
<section class="prose section-wrap"><h2>About the prototype</h2><p>This is an independent website concept for Jade Preschool and Daycare, not the official school website or an official admissions service. Programme information and public contact details were researched on 27 October 2026. Confirm current arrangements with the school at <a href="https://jadepreschool.com/">jadepreschool.com</a> or +94 77 395 4321.</p><h2>Visit enquiries</h2><p>The form runs in your browser. It does not send information to a server, store your entries in a database or book an appointment. It prepares a WhatsApp message for you to review. Continuing to WhatsApp transfers the prepared text to that service; you then choose whether to send it. WhatsApp has its own privacy practices. Avoid including medical or other sensitive information in an initial enquiry.</p><h2>Cookies and external services</h2><p>This prototype has no analytics, advertising cookies or tracking scripts. Fonts and images are served with the site. The hosting provider may process standard access logs. External links to maps, social media and WhatsApp take you to services with their own policies.</p><h2>School photography and logo</h2><p>The photographs and original school logo come from Jade’s public website and are used to present this design concept. Rights remain with their original owners; no licence for reuse by third parties is granted. School approval and confirmation of image permissions are required before an official commercial launch.</p><p>Newsreader and DM Sans are distributed under the SIL Open Font License. Licences and image sources are included in the source repository.</p><h2>School information</h2><p>The homepage lists 30, Asoka Gardens, Colombo 04. Some older school pages list 543/3 Galle Road, Colombo 06. Confirm your meeting location when arranging a visit. Programme age cutoffs, complete fees, operational hours, availability and settling-in arrangements should be confirmed directly with the school. Leadership roles are taken from the school’s published About Us page.</p></section>`;
const pages = [
  [
    "",
    "Preschool & Day Care in Colombo",
    "Preschool and day care in Colombo. Explore Jade’s school, programmes, photography and visit enquiries.",
    home,
  ],
  [
    "our-approach",
    "The school",
    "Meet Jade Preschool: learning through play, the school environment and leadership.",
    approach,
  ],
  [
    "programmes",
    "Programmes",
    "Explore Playgroup, Nursery, Kindergarten and Day Care at Jade Preschool in Colombo.",
    programmePage,
  ],
  [
    "life-at-jade",
    "Life at Jade",
    "A photographic look at children, teachers and everyday activities at Jade Preschool.",
    life,
  ],
  [
    "visit",
    "Visit the school",
    "Contact Jade Preschool in Colombo and prepare a school visit enquiry.",
    visit,
  ],
  [
    "privacy",
    "Privacy & credits",
    "Privacy, photography credits and information about this independent Jade website concept.",
    privacy,
  ],
];
for (const [slug, title, description, body] of pages) {
  const dir = path.join(out, slug);
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, "index.html"),
    shell(slug, title, description, body).replaceAll("<br>", "<br> "),
  );
}
await writeFile(path.join(out, ".nojekyll"), "");
await writeFile(
  path.join(out, "404.html"),
  shell(
    "",
    "Page not found",
    "Return to Jade Preschool.",
    (b) =>
      `${intro("404", "Page not found.", "This address does not lead to a page on the Jade prototype.")}<div class="section-wrap not-found">${button(b, "Return to the school")}</div>`,
    "https://dion-nikila.github.io/jade-preschool/",
  ),
);
console.log(`Built ${pages.length} pages + 404 in ${out}`);

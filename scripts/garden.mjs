// Decorative artwork is code-native, so it stays crisp and lightweight.
export function butterfly(variant, className = "") {
  const wing = `<path d="M59 51C46 9 13 1 8 23 2 47 29 59 56 60 33 55 13 66 22 82 33 101 54 81 59 62Z" fill="var(--wing)" stroke="var(--wing-edge)" stroke-width="1.1"/><path d="M52 48C38 20 22 15 18 25M53 59C35 65 29 73 30 79" fill="none" stroke="var(--wing-edge)" stroke-width="1.3" opacity=".5"/><ellipse cx="24" cy="30" rx="6" ry="10" fill="var(--wing-mark)" transform="rotate(-35 24 30)"/><ellipse cx="35" cy="76" rx="5" ry="7" fill="var(--wing-mark)" transform="rotate(35 35 76)"/>`;
  return `<span class="butterfly-flight butterfly-${variant} ${className}" aria-hidden="true"><svg class="butterfly" viewBox="0 0 120 104" fill="none"><g class="butterfly-wing wing-left">${wing}</g><g transform="translate(120 0) scale(-1 1)"><g class="butterfly-wing wing-right">${wing}</g></g><path d="M59 45C56 32 49 28 47 32M61 45C64 32 71 28 73 32" stroke="#334b3a" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="60" cy="59" rx="3.5" ry="18" fill="#334b3a"/><circle cx="60" cy="43" r="4" fill="#334b3a"/></svg></span>`;
}
function flower(kind, index) {
  const petalCount = kind === "daisy" ? 10 : kind === "poppy" ? 6 : 8;
  const petals = Array.from(
    { length: petalCount },
    (_, p) =>
      `<g transform="rotate(${(360 * p) / petalCount} 110 98)"><ellipse class="flower-petal" style="--petal:${p}" cx="110" cy="64" rx="${kind === "daisy" ? 12 : 21}" ry="${kind === "daisy" ? 32 : 30}" fill="var(--petal-color)"/></g>`,
  ).join("");
  return `<svg class="bloom bloom-${kind} bloom-${index}" viewBox="0 0 220 300" fill="none" aria-hidden="true"><g class="flower-sway"><g class="flower-stem"><path d="M109 289C104 244 122 201 110 105" stroke="#4b825b" stroke-width="4.5" stroke-linecap="round"/><path d="M110 220C82 219 61 198 60 181 87 178 108 197 110 220Z" fill="#6ba572"/><path d="M114 184C117 151 142 144 160 146 161 168 140 186 114 184Z" fill="#4b825b"/><path d="m69 189 36 26m14-39 31-23" stroke="#c3d6a4" stroke-width="1.5" stroke-linecap="round"/></g><g class="flower-head-lift"><g class="flower-petals">${petals}</g><g class="flower-centre"><circle cx="110" cy="98" r="${kind === "daisy" ? 18 : 15}" fill="var(--flower-centre)"/><circle cx="105" cy="94" r="2" fill="#614d2a" opacity=".5"/><circle cx="115" cy="101" r="2" fill="#614d2a" opacity=".5"/><circle cx="106" cy="105" r="1.5" fill="#614d2a" opacity=".5"/></g></g></g></svg>`;
}
export function garden(className = "", count = 3) {
  const kinds = ["poppy", "daisy", "cornflower", "daisy", "poppy"];
  return `<div class="bloom-garden ${className}" aria-hidden="true">${Array.from({ length: count }, (_, i) => flower(kinds[i % kinds.length], i)).join("")}</div>`;
}

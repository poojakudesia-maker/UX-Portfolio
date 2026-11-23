# UX Portfolio: Pooja Kudesia

Static, responsive portfolio site. Plain HTML/CSS with one small progressive-enhancement script. No build step.

## Structure

```
.
├── .claude/skills/executive-ux-portfolio/SKILL.md   # Claude Code skill (portfolio builder + hiring-committee audit)
├── claude.md                                        # Candidate background the skill reads
├── scripts/protect.mjs                              # Builds the password-protected dist/
├── site-password.txt                                # YOU create this; gitignored
├── src/
│   ├── index.html               # Homepage: positioning, metrics, dual-track proof, case cards, credentials
│   ├── about.html               # Leadership approach, scale, career timeline, target roles
│   ├── case-aristocrat.html     # Flagship 1: legacy modernisation + design system + AI design-to-code
│   ├── case-tata-1mg.html       # Flagship 2: consumer growth + 0-to-1 B2B
│   ├── case-deutsche-bank.html  # Flagship 3: regulated BFSI + public sector
│   ├── contact.html             # Email copy, résumé, LinkedIn, NDA access request
│   └── assets/
│       ├── styles.css           # Design tokens (light + dark), all components
│       └── main.js              # Copy-email, NDA dialog, case-study section tracking
└── README.md
```

## Preview

```bash
cd src && python3 -m http.server 8000
```

Then open http://localhost:8000. To publish on GitHub Pages, serve from the `src/` folder (or move its contents to the repo root or `docs/`).

## Password protection

The published site is encrypted with a password. Visitors see a login screen and enter the password once per browser tab.

1. Create `site-password.txt` in the repo root and write your password on one line (10+ characters). The file is gitignored, so it never reaches GitHub.
2. Build the protected copy:

   ```bash
   node scripts/protect.mjs
   ```

3. Publish the `dist/` folder it creates. Don't publish `src/`.

To change the password, edit the file and run the build again. The old password stops working once the new `dist/` is live. Needs Node 18 or newer.

Each page is encrypted with AES-256-GCM (key derived with PBKDF2-SHA256, 600,000 iterations), so viewing the page source shows only scrambled text. Two limits:

- **This repo is public**, so the readable pages in `src/` are visible to anyone on GitHub. Make the repo private if the content itself is confidential.
- Files in `assets/` (CSS, JS, and the résumé PDF) are copied unencrypted. Anyone with the direct URL can open them.

## Before going live

1. Replace `your.name@example.com` in every page under `src/` with your real email.
2. Add your résumé PDF at `src/assets/Pooja-Kudesia-Resume.pdf`.
3. Fill every highlighted **TO CONFIRM** marker. Search the HTML for `class="todo"`. These are facts not in `claude.md` (team sizes, research findings, iterations, reflections) and were left blank rather than invented.
4. Replace each striped image slot (`class="slot"`) with a real or recreated screen. WebP/AVIF, under 200 KB, and update the `aria-label` to describe the image.

## Accessibility

All six pages pass axe-core WCAG 2.1 A/AA checks in light and dark mode, with no horizontal scroll at 375px. Includes skip link, semantic landmarks, visible focus rings, 44px touch targets, reduced-motion support, and colour pairs documented with contrast ratios in `styles.css`.

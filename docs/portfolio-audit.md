# Portfolio audit: Mode 3 (hiring committee review)

Audited: `src/` at commit after df63213 · 2026-11-23
Reviewer lens: VP Design + executive recruiter hiring AVP / Director / Head of UX at Tier-1 enterprise and GCCs.

**Score: 5 pass · 7 partial · 4 fail (out of 16).** Every fail comes from missing content, not from the site's structure or code. Fill the TO CONFIRM markers and the score moves to about 14/16.

## Scorecard

| # | Check | Result | Why |
|---|-------|--------|-----|
| 1 | Role & seniority clarity | Pass | Hero names seniority, 20 years and domains in one screen. |
| 2 | Scannable project cards | Partial | One-line outcome on every card. Thumbnails are abstract diagrams, not real UI. |
| 3 | Technical hygiene | **Fail** | Résumé link 404s; placeholder email on 6 pages; TO CONFIRM markers visible. Page weight is tiny (≈14 KB HTML + 23 KB assets) and axe passes. |
| 4 | Real problem & stakes | Partial | Stakes framed; "cost of doing nothing" missing in all three. |
| 5 | Personal ownership | Partial | Owned-vs-team split written for each; team size missing for Aristocrat and 1mg. |
| 6 | End-to-end arc | Pass | All three follow Context → Problem → Research → Architecture → Solution → Impact. |
| 7 | Actionable research | **Fail** | All six findings are placeholders. |
| 8 | Proof of iteration | **Fail** | All three iteration callouts are placeholders. |
| 9 | Defensible outcome | Partial | Headline metrics are real. Reflections empty. 1mg download attribution will be questioned. |
| 10 | Visual craft | Partial | Layout, type and spacing are consistent. No real images yet. |
| 11 | Executive readability | Pass | Short sections; jargon reduced (card title no longer leads with "WinForms"). |
| 12 | Purposeful, annotated visuals | Partial | Every slot has a caption and 3 notes, but notes are suggestions until checked against real screens. |
| 13 | Accessibility proof | Partial | The site itself passes WCAG 2.1 AA (axe, light + dark). Per-case accessibility claims need confirming. |
| 14 | Curation over volume | Pass | Three deep case studies. |
| 15 | Human & strategic About | Partial | Philosophy, scale, targets present. Missing team size and the personal paragraph. |
| 16 | Clear conversion path | **Fail** | No résumé PDF, no real email. |

## What's working

- The 10-second read lands: "I design and govern enterprise platforms where one wrong workflow costs real money" plus four numbers above the fold.
- Leadership and hands-on work get equal weight on the homepage, as `claude.md` requires.
- Metrics are concrete and attributed to a named employer every time.
- The NDA request flow tells reviewers there is more depth behind the public pages.
- Fast, accessible, works on a 375px phone, and supports dark mode.

## What's hurting the candidacy

1. **The third flagship is 15+ years old.** Deutsche Bank / UK Police ran 2006–2011, and the role title shown is "Team Leader". For an AVP search, a VP will read that as "nothing recent in BFSI". Options, in order of preference:
   - Merge it with the HCL Deutsche Bank advisory work (2011–2013) into one "BFSI track record" study, and shorten it to a strong one-pager.
   - Replace it with Bechtel (2015–2019) as the team-scaling and governance story, and keep BFSI as homepage proof. This needs Bechtel metrics.
   - Replace it with the Tata 1mg B2B warehouse product as a 0-to-1 story, and move 1mg consumer growth to a single strong study.
2. **Tata 1mg mixes two stories.** Consumer growth and 0-to-1 B2B WMS in one case dilutes both. Pick one, or make WMS its own study (see above).
3. **"+55% downloads via onboarding redesign" invites a hard question.** Onboarding happens after download. Say what moved downloads (store rating, referrals, web-to-app) or reword the claim.
4. **Patents are your rarest credential and they're one line.** Add numbers or subjects, and link them from the Aristocrat study if they came from that work.
5. **G2E Las Vegas talk has no title or link.** It's external validation that a recruiter can verify; make it clickable.

## Fixed during this audit

- Removed copy I'd written that stated facts not in `claude.md`:
  - "millions of Indian users"
  - "Staff trained on one module had to relearn another"
  - "Handoff, not design, was where the time went"
  - "The prescription step was the real drop-off point"
  - "Users were installing, then dropping before their first order"
  - "Observing users at their desks…"
  - "Fewer screens, validation at the point of entry"
  - "A guided workflow with errors caught before submission"
  - "usually reply within one working day"
  - "formatted for ATS"

  Replaced them with neutral headings or TO CONFIRM prompts.
- Patents metric changed from "6 patents" to "3 granted, plus 3 more filed". Counting filed applications in the headline number reads as inflation to anyone who checks.
- Aristocrat outcome tiles: removed "Achievers Award" (not confirmed as tied to this project) and replaced the output-style tile with a placeholder for a real outcome metric.
- Card 1 retitled from "WinForms to Angular" to "Modernising a casino management platform". Card 3 badge now leads with "Directed 20 engineers in London" instead of the junior-sounding title.
- Every annotated image and accessibility list now carries a marker saying the notes are suggestions to verify.

## Still to do (in priority order)

1. Real email in all pages; résumé PDF at `src/assets/Pooja-Kudesia-Resume.pdf`.
2. Decide the third flagship (see "hurting" #1).
3. Research findings + one iteration per case (checks 7 and 8 are the biggest gaps a panel will probe).
4. Team sizes for Aristocrat and 1mg.
5. Real or recreated screens for each image slot.
6. Reflections and the About "outside the work" paragraph.
7. Patent numbers and G2E talk link.

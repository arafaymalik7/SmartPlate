# Screen capture evidence for final report (manual procedure)

No browser screenshots are included because the managed Chromium instance in the build environment blocks all URL navigation. Screenshots must be taken from a real functioning local installation (preferably on the candidate's laptop).

1. Run `python run.py`. Open `http://127.0.0.1:8000` in Chrome, Edge, Firefox or Safari.
2. Capture (and label) homepage desktop at approximately 1440 × 900 pixels.
3. Capture Explore page with restaurant and category controls visible.
4. Open a dish and capture its nutrition details, source label, and allergy warning.
5. Capture a recommendation result and its score/explanations after selecting 550 kcal and high-protein.
6. Capture the strict allergen empty state by excluding `peanut`; explain why an unverified demo cannot certify safety.
7. Capture the comparison table with two dishes.
8. Create an administrator with the CLI. Capture its menu management screen **without passwords or session tokens**.
9. Repeat on a phone-sized viewport; confirm no horizontal clipping and accessible navigation.
10. Add genuine evidence into Chapter 5 and update `docs/TEST_RESULTS.md` with browser name, date and observations.

**Do not paste simulated screenshots or AI illustrations into a section titled “testing evidence.”** Include only observed browser output.

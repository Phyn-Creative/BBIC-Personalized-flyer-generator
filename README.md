# Reusable Church Event Flyer Generator

A static, mobile-friendly web app that lets attendees create a personalised event flyer using their own photo, name and location.

## Current event
- Programme: Covenant Summit 2026
- Theme: Time to Gather
- Date: 14th–20th December 2026
- Venue: Beauty & Bands International Church Auditorium
- Address: Car-Wash Junction, Iwo Road – Agbowo Expressway, Agbowo, Ibadan

## How to reuse it for another event
Edit `event-config.js`. Change the church/programme name, theme, date, venue, address and colour palette. The generator code in `app.js` can stay the same for ordinary text and colour changes.

## Run locally
Open `index.html` in a modern browser. For best results, use a local static server or deploy to Cloudflare.

## Deploy with GitHub + Cloudflare Workers
1. Keep the app files in the repository root.
2. In Cloudflare, open Workers & Pages and select the existing `bbic-personalized-flyer-generator` Worker.
3. Under Settings → Builds, connect this repository and select the `main` production branch.
4. Push a commit to `main` to trigger a build and deployment. Check the Worker’s Deployments tab for the build result.

No database, login, paid API or server-side photo storage is required. Photos are processed locally in the attendee's browser.

## Notes
- The flyer is exported as a 1080 × 1350 PNG.
- The share action uses the browser's native file-sharing support when available; download is the fallback.
- This first version uses a typographic church identity. Add the official church logo when supplied.
- Event details are currently fixed to the supplied December 2026 information.

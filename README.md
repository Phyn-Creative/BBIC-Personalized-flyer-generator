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
Open `index.html` in a modern browser. For best results, use a local static server or deploy to Cloudflare Pages.

## Deploy free with GitHub + Cloudflare Pages
1. Upload all files in this folder to the repository root.
2. In Cloudflare, open Workers & Pages → Create → Pages → Connect to Git.
3. Select this repository.
4. Framework preset: None. Build command: leave blank. Build output directory: `/` (or `.` if requested by the dashboard).
5. Deploy.

No database, login, paid API or server-side photo storage is required. Photos are processed locally in the attendee's browser.

## Notes
- The flyer is exported as a 1080 × 1350 PNG.
- The share action uses the browser's native file-sharing support when available; download is the fallback.
- This first version uses a typographic church identity. Add the official church logo when supplied.
- Event details are currently fixed to the supplied December 2026 information.
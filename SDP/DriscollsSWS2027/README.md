# Sweetness Worth Sharing (Concept Demo)

Clickable concept demo of a consumer referral program, prepared by SDP (Secure Digital Promotions) for a Driscoll's pitch.
Static site: plain HTML, CSS and JavaScript. No build step, no framework, no backend. Nothing typed into the demo leaves the browser.

## Structure

```
index.html              Page markup (consumer site and program insights views)
css/styles.css          All styles, mobile first breakpoints at 900px and 560px
js/app.js               Demo logic: registration, berry spin, sharing, referral credit, insights
images/                 Deck photography, Driscoll's and SDP logos, app icons
manifest.webmanifest    Add to home screen support
vercel.json             Clean URLs, noindex header, light caching
robots.txt              Keeps the demo out of search engines
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```
npx serve .
```

## Deploy to Vercel through GitHub

1. Create a private GitHub repo and push this folder to the main branch.
2. In Vercel: Add New, Project, import the repo.
3. Framework Preset: Other. Build Command: leave empty. Output Directory: leave empty (root).
4. Deploy. Each push to main redeploys automatically.

## Custom domain

1. In the Vercel project: Settings, Domains, add e.g. `driscolls-demo.yourdomain.com`.
2. At your DNS provider (Cloudflare, for example) add the CNAME record Vercel shows (usually `cname.vercel-dns.com`). On Cloudflare set the record to DNS only (grey cloud) so Vercel can issue the SSL certificate.

## Before sharing with the client

* The Driscoll's logo files (`images/logo.png` and `images/logowhite.png` for the dark footer) were cut from the pitch deck and are low resolution. Replace them with the official high resolution or SVG logo files using the same names.
* Consider Vercel Deployment Protection (password or Vercel auth) since the page uses client branding.
* Prize, entry limit and legal copy are placeholders pending the Official Rules.

## Guided tour

The yellow "Take the tour" button in the top bar (also offered in a small prompt on first load) opens two options:

* Consumer journey: 9 steps covering sign up, berry spin, sharing and a friend's referral.
* Full pitch tour: 16 steps that add prizes, incentives and the Program insights reporting view.

The tour clicks through the demo for you, spotlighting each element with an arrow callout. Use Next and Back, the arrow keys, or Esc to exit. Starting a tour resets the demo. The tour steps live in the `STEPS` array in `js/app.js` if you want to edit the wording or order.

## Demo controls (top bar, or the "Demo controls" button on phones)

* Consumer site or Program insights view
* Viewing as: switch between registered participants or a new visitor
* Spin outcome: always win, no prize, or random odds
* Reset demo

---
draft: true
title: TODO
description: TODO
summary: TODO
date: 2019-01-01
---

## Top Prio

- Text on /nl/ must be more friendly: Want to get serious with making your website fast? I can help !
- Sitemap.xml contains /blog/tags/navAscending/ and this should not be there
- Add logos: Replacedirect, Saleduck, Humbird (Beslist always is bottom one)

### Blog

#### CDN Finder
Workers KV and what I'm using as the key (https://scotthelme.co.uk/
hacking-table-storage-to-do-order-by-on-timestamp/)

#### Workers stuff

- add (security) headers to Workers Sites (Staging!)
- add redirects to Workers Sites, easy!
- controling/optimizing caching on Workers Sites (html vs static, add/edit headers, versioning)

#### Making CDN Planet Fast and Secure

Old: Static + HW CDN
New: Static + Workers Sites (Brotli, HTTP prioritization)

- SVGOMG: https://www.webpagetest.org/result/200604_D6_6cce28d93cd51aa7948f99c3771aba3c/

- Fonts: load async: https://www.webpagetest.org/result/200605_1Q_8c30a22e1027d45774021a0c084333f1/
- Fonts: switched from 3x Roboto to 2x Inter self-hosted: https://www.webpagetest.org/result/200606_4P_a4439b15303e6ae13f89538a03ff9ac0/
- Fonts: preload, subset: https://www.webpagetest.org/result/200608_59_63ae3ece020aa7c3506613904c4f44c0/ : not good, FCP, LCP and SI increase by ~0.3 seconds
- Fonts: don't do the preload: https://www.webpagetest.org/result/200608_9R_de3a1bb5642e826c92487353e3179f08/ : minus 160 KB and text rendered a bit sooner in custom font

- Security headers: https://www.webpagetest.org/result/200606_4P_a4439b15303e6ae13f89538a03ff9ac0/


- Add articles: CRuX API, repost Chrome image lazy load native, 
- Add hollandsnieuwe articles: see email to Ewout
- New article ideas: Filmstrip FTW, Binkies perf review, CDN/Cloud Debugging with Curl
- Update articles: iframe performance (testpages, run in modern browser, new techniques)
- Responsive images: 11ty plugin
- Auto create images: convert ...

- Article: Web Perf Metrics can be wrong
FCP doc = https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint
Google: "First Contentful Paint (FCP) measures the time from navigation to the time when the browser renders the first bit of content from the DOM"
Paint Timing API definition: https://w3c.github.io/paint-timing/#first-contentful-paint
WPT: "FCP ... The point in time when the first image or text is rendered to the screen (something other than background colors)"

https://www.webpagetest.org/video/compare.php?tests=200415_KP_ffe5fdbd31eb04e9be7bc0a8268a1b34-r%3A1-c%3A0&thumbSize=200&ival=100&end=visual
WPT says FCP = 3.2 seconds and that is correct as per the spec, but it takes a full 2.1 seconds longer for anything useful/meaningful to appear.


#### Blog about Eleventy work

- DOCUMENTATION.md and todo.md
- drafts should be in either _drafts (probably best) or use `draft: false` in front matter
- Collections!
- Custom filters!
- Macros!

CDN Planet
- Social images: puppeteer (needed to manually install correct version for some packages), generate helper data files that live outside 11ty, ...
- Imageoptim (Saved 8,5 MB out of 12,9 MB. 65,6% per file on average (up to 66,7%) - took 80 minutes for 286 images). Too slow, so: only do for new/updated content and with imagemin, like so:
- 

## Performance

- Offline
--- Contact form: on load, if offline, disable form + say something [example](https://bug336359.bmoattachments.org/attachment.cgi?id=220609)
- PWA: 
--- https://okitavera.me/article/turn-your-eleventy-into-offline-first-pwa/
--- replace my SW with this
- Static assets
--- Versioning
--- Caching, max-age=365d (/.jpg|png|css|js|woff2)
- DNS: use Netlify?
- https://instant.page/ ?


## Legal


## SEO

- Structured Data
- add properties in sitemap.xml? https://www.sitemaps.org/protocol.html#xmlTagDefinitions
- robots.txt 
- link rel nofollow: https://github.com/11ty/eleventy/issues/563


## Design

- Webfonts: 
--- Inter (self-hosted)
--- Variable fonts (Sia's or Inter), but https://bugs.chromium.org/p/chromium/issues/list?can=2&q=variable+component%3ABlink%3EFonts
- Links: cool underline

## CSS

- BEM or a variant
- font-size in rem or em, not px
- A11y ?
- 


## Security

- CSP


---

Content:


## Hire me 

### Data & Insights ⏱ 📈


Your goal: always have a good view on how fast your site is and the impact on your business.

- Metrics definition
- Data collection
- 

- Define your metrics: what do I want to measure? Not the same for every site
- Collect the data: select the right monitoring tool(s)
- Derive insights: data viz, tie to business metrics

Strong passion for data visualization and years of experience in defining metrics and transforming data into actionable insights.

The Google view (PageSpeed and CRuX).
Monitoring: GA, WebPageTest, Firebase, Catchpoint, SpeedCurve, Pingdom 


### Knowledge Transfer
Knowledge - Expertise 💬 🧠

Level-up the knowledge and expertise of your team


### Get Fast 🔧 💯

Make it fast


### Stay Fast 📌 💰

Ensure it stays fast. Make it stick.
High probability perf will regress if you do not embed web performance in your business goals, way of working and tooling.

- Culture: Empower, Incentivize, Empower.
- Process: Way of Working
- Tools: e.g. 
- Perf budgets.

---

#### Background & Expertise 

- Founder of Multi-CDN provider [TurboBytes](https://www.turbobytes.com)
- Founder of CDN information & comparison site [CDN Planet](https://www.cdnplanet.com)
- Speaker at [Velocity conference](https://conferences.oreilly.com/velocity/) and webperf meetups 


5. Google and site speed

See: pitch slide in recent WPO Leads deck 


### Frontend

I've been building websites since 1995, worked 'on the Internet' since , passion for technology.

Everything, from HTML and CSS to images and webfonts, and of course JavaScript.
Very good understanding of how browsers work (networking, rendering, JavaScript parse/compile/execute)
SSR, hydration, ...

### Backend and Networking

DNS, HTTP, CDN
Quickly understand your architecture
Up to speed with modern (cloud) technologies like Serverless and Functions, including hands-on experience with Cloudflare Workers, Azure Functions and Table Storage

### Tools and processes

WoW:
Build and deploy: 
.



## /nl

Keywords: laadtijd, optimalisatie, websitesnelheid, web performance

1. Waarom webperf, wat levert het op?
2. Hoe kan Aaron u helpen? Monitoring, analyse, problemen oplossen (techniek!) en training.
2. Kort: ervaring van Aaron (expertise, klanten), met link naar 'About' page

Pitch:
8+ jaar ervaring als web perf consultant
Frontend, CDN, DNS, load balancing
Performance analytics en performance koppelen aan business metrics.

Hollandsnieuwe, Kruidvat en Beslist.nl

Oprichter van TurboBytes en CDN Planet.

Analyse, advies en hands-on optimalisatie.
Consultancy, optimalisatie en training. Ruim 10 jaar ervaring.


## Homepage

- Laatste/beste 2 blog artikelen 
- Quote Ewout Kalkman

- Quote Peter Geurts: 
Referentie
"Aaron heeft ons geholpen bij de laadtijd optimalisatie van Telefoonboek.nl. Zijn diepgaande expertise en praktische begeleiding heeft geresulteerd in een verhoging van de conversie, lagere hostingkosten en een site die ruim 30% sneller is.
Bij dit integrale project heeft Aaron zijn waarde meer dan bewezen."
Peter Geurts, Portal Manager Telefoonboek.nl

Betere user experience
Bezoekers komen vaker terug en doen meer op de website.

Meer omzet
Het aantal bannervertoningen/kliks, inschrijvingen en verkopen stijgt.

Minder kosten
U heeft minder servercapaciteit en bandbreedte nodig.

Meer verkeer uit Google
Hogere posities, meer pagina's geïndexeerd en lagere Adwords CPC's

Beter bestand tegen pieken in verkeer
Kleinere kans dat uw website plat gaat of erg traag wordt.
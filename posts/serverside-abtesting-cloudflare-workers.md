---
draft: true
title: Server-Side A/B Testing in Angular SPA
description: TODO ... Full-Page ... Cloudflare Workers 
summary: TODO
date: 2019-01-01
keyword: Server-side Full-Page A/B testing Cloudflare Workers SPA Angular
---

## Background / the problem

Optimizely ... client-side, big impact on speed performance (delays start render).
Optimizely has 'integration' with Cloudflare Workers, but that is not ready for SPA websites.

Could have optimized the Optimizely implementation (they have stuff like ..., ..., ...), but hn decided to explore the possibility of using Cloudflare Workers ... maybe good fit, maybe not.

... **repeat the title here**
It was a journey with many, many learnings and awesome results.

## Business Requirements for A/B Testing

1. A/B and multi-variate testing
2. Full-page and single page element(s)
3. No Flash of Original Content (FOOC)
4. Include/exclude traffic based on segmentation (mobile, paid search, ...)
5. Track and compare performance in Google Analytics, using event tags
6. CRO specialist (not a technical person) can run experiments pretty much autonomously, without requiring help of people outside the scrum team
7. Does not slow down loading of the page / Low or no negative impact on speed performance

Later extended with:
8. Visitors always see the same test variant (should-have for crawlers like Googlebot)
9. In case Cloudflare is down and move traffic to origin (DNS change), the pages work just fine but experiment stops

New PDP, complete redesign of the page ... so do a POC with **server-side _full-page_ A/B testing with Cloudflare Workers**.

Requirement 4 out of scope, but keep in mind.

POC:
- full-page, two variants
- two products, each having a new design for the PDP
- x weeks test duration
- ..

## Technical Implementation of Server-Side Full-Page A/B Testing in Angular

Starting point was this [#](Worker script) in the Gallery.

In all approaches:
- Check cookie in request
--- cookie: serve the response
--- no cookie: flip a coin, serve the response with a cookie

hn has two Zones in Cf, so we can develop first in the sandbox and later port to preview and production.


### Worker Serves Prerendered HTML
Angular builds a prerendered HTML for each page variant. 
These are static files on the origin server.
Worker script decides which variant to send, fetch from the HTML and send to client.
Meh, because one of two variants mismatches with what SPA expects

### 301 Redirects
Acceptable to the business, but redirects just felt wrong and after experiment ends users may navigate to pages that no longer exist, so we need to handle that (with redirects).

### Prerendered HTML + Logic in SPA + Worker Script
Quite the effort, but this is what we ended up with.

#### The Cloudflare Workers Script

#### What we did in Angular


#### Tracking in GA


## Go Live Strategy
--- A/A test first, to have 100% confidence all works well incl. the tracking in GA + see the ratio is ~50/50 on the relevant pages
--- few days later, switch to A/B (change Worker script + some code in the SPA) 

## Results

... 

### Sample Ratio Mismatch

[docs](https://lukasvermeer.nl/srm/docs/faq/)

"When this value is very small, we reject the idea that the data are indeed a good fit, and conclude that a Sample Ratio Mismatch has occurred"

So, Aa low p-value is bad, but what is low?

"The SRM Checker Chrome Extension currently uses a threshold value of 0.0001. If the computed p-value is lower than that, an SRM is flagged."

Hmm, dit lijkt erg laag ...


## Learnings

- No FOOC, but a short FOWU (Flash Of Wrong URL) ... not a biggie
- Routes: too broad, add some to disable the script for e.g. /assets/* and /rest/*
- We did not handle POST requests well ... ugh ... but fixed
- Awesome to be able to implement changes instantly with Workers (instant propagation)


## Future Work

Segmentation (biz req #4)
Use Workers KV to store the 'pages in scope' config and have script use that, vs hardcoded
Make the script handle POST requests well
Error logging in Sentry

## Take-aways

- It starts with business requirements
- SPA makes it more challenging to do server-side full-page A/B testing
--- requires prerendering/SSR
--- client-side rehydration happens, so need something extra to not have that fuck it up
- Statistical relevance matters!
- Test, test, test!


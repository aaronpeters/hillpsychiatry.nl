---
draft: true
title: Server-Side A/B Testing in Angular SPA
description: TODO ... Full-Page ... Cloudflare Workers 
summary: TODO
date: 2019-01-01
keyword: Server-side Full-Page A/B testing Cloudflare Workers SPA Angular
---

... **repeat the title here**
It was a journey with many, many learnings and awesome results.

## Business Requirements
Thom's ...

## Approaches to Server-Side Full-Page A/B Testing in Angular

Starting point was this [#](Worker script) in the Gallery.

In all approaches:
- Check cookie in request
--- cookie: serve the response
--- no cookie: flip a coin, serve the response with a cookie

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

## Learnings

## Take-aways

- It starts with business requirements
- SPA makes it more challenging to do server-side full-page A/B testing
--- requires prerendering/SSR
--- client-side rehydration happens, so need something extra to not have that fuck it up
- Statistical relevance matters!
- Test, test, test!


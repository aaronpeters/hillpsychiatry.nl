---
draft: true
title: Cloudflare Polish something
description: TODO
summary: TODO
date: 2019-01-01
tags:
  - webperf
  - Cloudflare
  - Polish
  - CDN
---

Note: the Title is the H1, so make it awesome !

First paragraph, like a TL;DR / Summary and super important for SEO

Keyword = Cloudflare Polish


Contents
- What is Cloudflare Polish
- Goals = Optimize PNGs and JPGs losslessly + Convert PNG/JPG lossless to WebP
- Convert to WebP: did not work because Origin sends Vary header (link to Cloudflare support doc)
- Solution: tried using a Worker but meh, so two options now: 1) Origin does not send Vary header, or 2) Image Resizing

## H2


## Take aways

- Take your time to carefully test every feature of your CDN
- Read the documentation !
- Push the support team to go the extra mile (tips: ..., ...)
- You're not done until you have documented your findings and shared with the team; Transfer knowledge within Document your findings (incl. goals and approach) 
- Doesn't work? It may very well be your Origin


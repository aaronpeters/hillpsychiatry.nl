---
draft: true
title: Lazy Loading Images in Chrome is Bonkers
title1: Chrome's Image Lazy Loading is Poor
description: TODO
summary: TODO
date: 2019-01-01
xtags:
  - webperf
  - images
  - lazyloading
  - chrome
keyword: chrome image lazyloading
---


TL;DR

- Lazy loading images is good for performance
- Has been around for a while, JS based
- Chrome is first browser to provide a native way
- It works, but the big problem is: it's too eager, so images are loaded too early
- I filed a bug report with Chromium
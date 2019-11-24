---
draft: true
title: How to measure initcwnd over HTTPS
description: TODO
summary: TODO
date: 2019-01-01
tags:
  - webperf
  - initcwnd
  - how-to
---

Keyword = initcwnd https



---

First paragraph, like a TL;DR / Summary and super important for SEO

TL;DR

- Initcwnd = initial congestion window and this is a server setting that determines # packets to send out in first round trip over a new connection
- Initcwnd matters a lot for performance: determines # bytes in first round trip (= how much of the HTML is delivered) && (todo: show two graphs, 10 vs )
- Linux default is 10, some CDNs have a higher value
- No easy way to measure initcwnd over HTTPS
- WebPageTest.org to the rescue, sortof


## What is initcwnd and why does it matter for web performance?

## Measuring initcwnd over HTTPS is not easy

- can't see it in Chrome Dev Tools
- can't use CDN Planet's tool (HTTP only)


## Using WebPageTest to measure initcwnd over HTTPS, sortof



## Take-aways


- Smashing Mag, 14 KB
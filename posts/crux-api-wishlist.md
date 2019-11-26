---
draft: true
title: Google CRuX API - 10 Ingredients for Awesome
description: TODO
summary: TODO
date: 2019-01-01
tags:
  - webperf
  - monitoring
  - google
  - crux
  - rum
---

TODO: first paragraph, like a TL;DR / Summary and super important for SEO

Keyword = CRuX API

TL;DR



## 1. Data delay

1 day rolling window


## 2. Granularity: Geo, Network connection


Platform: mobile/desktop
Geo: all, <XX>
Connection: 4g, 3g, ...

Device?


## 3. More Metrics

Currently: FCP, FID
In dataset, not exposed: TTFB
Per the Pagespeed v6 changes: LCP, TBT, CLS


## 4. Percentiles
50, 75, 90 and 95 (10 and 25 are nice to have)


## 5. Count / confidence

Number of measurements


## 6. Stable versions

Don't change the P90 to P75 just like that !
Change log + Announcements


## 7. API Reliability
Tood often the PSI API returns an error ... sure hope the CRuX API does not suffer from this.


## 8. Opt-out for site owners

Site owner can disable beaconing to CRuX
Chrome user can disable it, but a site owner can not.
I may want others not to be able to easily fetch data about how fast my site loads for the users.
Response header or - better - a meta element ( name="google-crux" content="disable" )

## 9. Documentation

Rate limiting = none


## 10. Error handling

Something about ease of use of the API, e.g. the output formats



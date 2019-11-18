---
draft: true
title: CRuX API, my wishlist
description: TODO
summary: TODO
date: 2019-12-01
tags:
  - webperf
  - monitoring
  - google
  - crux
  - rum
---

TODO: first paragraph, like a TL;DR / Summary and super important for SEO
Keyword = CRuX API


## Data delay

1 day rolling window


## Granularity: Geo, Network connection


Platform: mobile/desktop
Geo: all, <XX>
Connection: 4g, 3g, ...

Device?


## More Metrics

Currently: FCP, FID
In dataset, not exposed: TTFB
Per the Pagespeed v6 changes: LCP, TBT, CLS


## Percentiles
50, 75, 90 and 95 (10 and 25 are nice to have)


## Count / confidence

Number of measurements


## Stability and Versioning

Don't change the P90 to P75 just like that !
Change log + Announcements


## API Reliability
Tood often the PSI API returns an error ... sure hope the CRuX API does not suffer from this.


## Site owner can disable beaconing to CRuX

Chrome user can disable it, but a site owner can not.
I may want others not to be able to easily fetch data about how fast my site loads for the users.
Response header or - better - a meta element ( name="google-crux" content="disable" )

## Number 9

Rate limiting = none


## Number 10

Something about ease of use of the API, e.g. the output formats



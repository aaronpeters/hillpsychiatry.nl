---
draft: true
title: Google CRuX API - 10 Ingredients for Awesome
title1: Google CRuX API - 10 Must-Have Ingredients
title2: My Wishlist for the Google CRuX API
description: TODO
summary: TODO
date: 2019-01-01
xtags:
  - webperf
  - monitoring
  - google
  - crux
  - rum
---

Keyword = CRuX API

TL;DR
- Chrome Dev Summit, Paul Irish and X talked about Lighthouse, PageSpeed and CruX
- I followed up with Paul on Twitter and he mentioned they are thinking about a CRuX API (vs CRuX data via PSI API)
- Hey Paul, want my input? Yes, please
- Here it is, with key items: more metrics, percentiles, granularity, stable version and API reliability


## 1. More Metrics

Currently, the PSI API exposes two metrics that are in the CRuX data set: First Contentful Paint (FCP) and First Input Delay (FID).

In dataset, but not exposed: TTFB

Per the Pagespeed v6 changes: LCP, TBT, CLS

## 2. Percentiles

The buckets are nice and we get one percentile per metric, currently p75 for FCP and p95 for FID.
`sample PSI API response code`

I want, for each metric: 50, 75, 90 and 95


## 3. Granularity: Geo, Network connection

Platform: mobile/desktop
Geo: all, <XX>
Connection: 4g, 3g, ...

Device?


## 4. One Day Rolling Window

Current 30 day window has the problem that CRuX is not useful for seeing impact of changes to the site.


## 5. Count

Number of measurements
Not likely to be exposed because this makes data public about # pageviews and I assume Google does not want to do that.


## 6. Stable Versions

Don't change the P90 to P75 just like that (Nov 2 2019)
Change log + Announcements


## 7. API Reliability
Tood often the PSI API returns an error ... sure hope the CRuX API does not suffer from this.


## 8. Error handling

Something about ease of use of the API, e.g. the output formats


## 9. Documentation

E.g. 
- Sampling / Rate limiting 
- 


## 10. Sample Code

Always nice to see sample code for popular programming languages.
Lowers the threshold for (junior) devs to use the API.
Should include code for 
- fetching data for multiple URLs/Origins with one API call, or with parallel requests
- presenting the data ?


## 11. Opt-out for Site Owners

Site owner can disable beaconing to CRuX.
Chrome user can disable it, but a site owner can not.
I may want others not to be able to easily fetch data about how fast my site loads for the users.
Response header or - better - a meta element ( name="google-crux" content="disable" )






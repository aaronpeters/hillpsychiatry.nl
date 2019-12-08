---
draft: true
title: Google CRuX API - 10 Ingredients for Awesome
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
keyword: CRuX API
---

Google's CRuX is ... [Chrome User Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report/).
Google CRuX is awesome: free insights into how fast your web pages loaded for the actual visitors of your site.
Now also visible in Google Search Console [link](#).

At the 2019 Chrome Dev Summit, Paul Irish and Elizabeth Sweeny gave a talk about Lighthouse, PageSpeed and CruX ([Speed tooling evolutions: 2019 and beyond](https://www.youtube.com/watch?v=iaWLXf1FgI0)).
The next day, [Paul and I had a conversation on Twitter](https://twitter.com/aaronpeters/status/1193984213432836101) and he mentioned **Google is thinking about a dedicated CRuX API**. That gets me excited and I promised Paul to provide my ideas. I've been pulling in CRuX data via the PSI API for 50+ domains for 6 months now, all automated using Google Apps Script + Google Sheets. Based on my experiences with this ...

My wishlist for the CRuX API includes more metrics, more percentiles, improved granularity, stable versions and API reliability.


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



## Start Using CRuX Today !

Don't wait for the CRuX API to launch ...

- Recipes for extracting insights from CRuX: [CrUX Cookbook](https://github.com/GoogleChrome/CrUX/blob/master/sql)
- [CRuX on Github](https://github.com/GoogleChrome/CrUX), the place to share queries, ideas, or issues and managed by [Rick Viscomi](https://twitter.com/rick_viscomi)
- [Using the CrUX Dashboard on Data Studio](https://web.dev/chrome-ux-report-data-studio-dashboard/)


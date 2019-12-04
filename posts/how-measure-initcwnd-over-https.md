---
draft: true
title: How to Measure Initcwnd Over HTTPS
description: TODO
summary: TODO
date: 2019-01-01
xtags:
  - webperf
  - initcwnd
  - https
  - how-to
---

Keyword = measure initcwnd https



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

- why it is not so easy: packets are encrypted, so the tool needs to expose the # packets received at what point in time
- can't see it in Dev Tools of Chrome, Firefox or any other browser
- can't see it in curl
- can't use CDN Planet's tool (HTTP only)


## Using WebPageTest to measure initcwnd over HTTPS, sortof

### How do it

- URL for a single, large object (100 KB)
- Connection is high latency, high bandwidth
- bonus points if you also capture a tcpdump

### Test results

- Tested a few domains, on different CDNs ... show in a table 
- 160 KB - hn/Cloudflare - https://www.hollandsnieuwe.nl/assets/img/phones/samsung_galaxy_a70_zwart/samsung_galaxy_a70_zwart_front_medium.png , https://webpagetest.org/result/191204_C7_b5241e4cb86790ac6a3db8a5932458cf/
- 242 KB - Tele2 - https://www.tele2.nl/wp-content/themes/t2responsive/js/dist/dsl-flow-2018.js , https://webpagetest.org/result/191204_0K_50e8e08ce5589b47f40e5294d8e484a7/
- 271 KB - T-Mobile - https://www.t-mobile.nl/Consumer/media/images/_thuis/home/header-2019.png
- 212 KB - Vodafone - https://www.vodafone.nl/_packages/fonts/helvetica-neue/HelveticaNeue.woff
- 121 KB - KPN - https://www.kpn.com/public/css/screen.css

- 67 KB - Google Tag Manager - https://www.googletagmanager.com/gtm.js?id=GTM-NJS4DQZ
- 85 KB - FB - https://connect.facebook.net/signals/config/509467595869597?v=2.9.14&r=stable
- 

## Further reading

- CDN Planet
- Smashing Mag, 14 KB
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

- URL for a single, large object (>100 KB)
- Connection is high latency, high bandwidth
- bonus points if you also capture a tcpdump

### Test results

Tested a few domains, on different CDNs ... show in a table 
TODO: find objects of ~ equal file size, easier for reader to compare
Mention the protocol (H/2 or not) is irrelevant

hollandsnieuwe (Cloudflare) - 160 KB - 3 roundtrips
[PNG](https://www.hollandsnieuwe.nl/assets/img/phones/samsung_galaxy_a70_zwart/samsung_galaxy_a70_zwart_front_medium.png) , [WPT](https://webpagetest.org/result/191204_C7_b5241e4cb86790ac6a3db8a5932458cf/)

Tele2 - 242 KB - 8 roundtrips
[JS](https://www.tele2.nl/wp-content/themes/t2responsive/js/dist/dsl-flow-2018.js) , [WPT](https://webpagetest.org/result/191204_0K_50e8e08ce5589b47f40e5294d8e484a7/)

T-Mobile - 271 KB - 8 roundtrips
[PNG](https://www.t-mobile.nl/Consumer/media/images/_thuis/home/header-2019.png) , [WPT](https://webpagetest.org/result/191204_SK_854629ad49349d15db8e1e74e76a9235/)

Vodafone - 212 KB - ? roundtrips (run more tests!)
[WOFF](https://www.vodafone.nl/_packages/fonts/helvetica-neue/HelveticaNeue.woff) , [WPT](https://webpagetest.org/result/191204_X2_40bd90ceca94c1ba008d253ad8a8fe08/)

Ben - 369 KB - 9 roundtrips
[PNG](https://www.ben.nl/sites/default/files/bean/Studenten-homepage-nieuw_fixed_1.png) [WPT](https://webpagetest.org/result/191204_RH_3bc98f0bcc94ac8ca333403f9b7e150d/) , [PCAP](https://packettotal.com/app/queue?id=63de124fc8084793b7ede696df6de132) - 6431,6840,23256,32832,50616,67032,61560,53352,90762 

Google Tag Manager - 67 KB
https://www.googletagmanager.com/gtm.js?id=GTM-NJS4DQZ

FB - 85 KB
https://connect.facebook.net/signals/config/509467595869597?v=2.9.14&r=stable
 

## Further reading

- CDN Planet
- Smashing Mag, 14 KB
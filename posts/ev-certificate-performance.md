---
draft: true
title: EV Certificates are a Performance Killer
description: TODO
summary: TODO
date: 2019-01-01
xtags:
  - webperf
  - tls
  - certificates
keyword: EV Certificate Performance
---

EV certificates make your website slower and less robust for Chrome users: the time to secure the connection is increased and - more importantly - the reliability of your web site/app depends on the quality of service of your Certificate Authority. 

TL;DR
- EV certificates are much more expensive than 'regular' certificates, but don't provide better security
- Browsers don't show the 'green bar' anymore for sites with EV certificates, so there no longer is that proclaimed benefit of an enhanced perception of trust by site visitors
- EV certificates force Chrome to check the revocation status of the certificate _every time_ (a connection is established), and this is a blocking request to the Certificate Authority's server
- In case the Certificate Authority's server is very slow or down, your user's experience is bad, your brand is damaged and you missed out on revenue/sign ups/etc

In this article I focus on the performance aspect of EV certificates.
If you want to learn more about the security aspect and when/why browsers have changed their UI for EV certificates, read [Extended Validation Certificates are (Really, Really) Dead](https://www.troyhunt.com/extended-validation-certificates-are-really-really-dead/) and its predecessor [Extended Validation Certificates are Dead](https://www.troyhunt.com/extended-validation-certificates-are-dead/) by Troy Hunt.

Globalsign sells EV certs today at $599/yr and still states "ExtendedSSL activates the green address bar and displays your organization name in the browser interface"


## HTTPS and (EV) Certificates
The HTTP Archive shows a [steady adoption of HTTPS](https://almanac.httparchive.org/en/2019/security) in the past years. Per today, more than 80% of all requests are prefixed with `https`.

Websites on HTTPS need a certificate and certificates are obtained from Certificate Authorities.
- what is a cert
- certs used to be expensive, but costs have gone down since LE (YYYY). Not so much though for EV certs 

### What is an EV Certificate?

Extended Validation
You can't get an EV cert unless ...

## Why EV Certificates are Bad for Performance

Chrome behaviour.
Other browsers.

### EV Certificates Cause Slowness

[https://www.kpn.com/](https://www.kpn.com/)
EV cert on www, api and omsc

WPT tests, incl. Repeat View

- [WPT - Chrome - LTE - S7](https://webpagetest.org/result/191206_G5_df7b2dbab22821f12ee60d6b39dc8528/)
- why Chrome no show request to digicert for omsc, while FF does show this request

- [WPT - Firefox - Cable - Desktop (FF on mobile = nonsense)](https://webpagetest.org/result/191206_SQ_f15420633de4930f52101d8a717de426/)
- see the requests for http://ocsp2.globalsign.com/gsextendvalsha2g3r3

- [WPT iPhone 8+](https://webpagetest.org/result/191206_KR_7de3efd6f4d72d27b0a910ed323e2f98/)
- WPT don't show the cert validation requests

- [WPT - IE11](https://webpagetest.org/result/191206_KW_2f83d93760db081d6bf140259da65c70/)
- WPT don't show the cert validation requests

### EV Certificates are a Reliability Risk

Using the "Block Domains (full host names)..." field in the Block tab in the WPT.org ui does not work.
https://webpagetest.org/result/191206_G5_df7b2dbab22821f12ee60d6b39dc8528/

Does the "Block Requests Containing (URL substrings)..." field there work? Nope.
https://webpagetest.org/result/191206_YW_ad8b2b620857cf02ac2ff2969857b25b/

Script to the rescue!

``` js
blockDomains	ocsp2.globalsign.com
navigate	https://www.kpn.com/
```

https://webpagetest.org/result/191206_NR_01c89b8ecc15fe51dbd59f4871dc21a8/
Hmm, yes, requests to, but the browser now sends requests to `crl.globalsign.com`.
Did the browser detect the requests to `ocsp2.globalsign.com` failed?

Add that other domain to the script:

``` js
blockDomains	ocsp2.globalsign.com crl.globalsign.com
navigate	https://www.kpn.com/
```

https://webpagetest.org/result/191206_4K_9e57a652dfb2266bb77c8e6254cd5d8a/1/

Hmm, wait a minute. Do these tests (WPT blocking the requests in the browser) make any sense?
Well, yes, we see the browser 'simply' continuing even though the cert check did not happen.
But that does not show what happens when the CA's server is down.

Blackhole, FTW!
Simply enter the hostnames in the SPOF tab
https://webpagetest.org/result/191206_CW_4a1a6997d7032c14bd0f0bf2e83812fb/
Ok, works, but Pat, what is that http://www.gstatic.com/generate_204 ?

What if we blackhole just one of the two cert check domains?
https://webpagetest.org/result/191206_3P_04903e028f2a522232ee4fdb1fbcd0f6/


Can also do the blackhole thing with a script:
``` js
setDns	ocsp2.globalsign.com	71.114.67.58
setDns	crl.globalsign.com	71.114.67.58
navigate	https://www.kpn.com/
```


- Relay42
- they provide an dynamic script to insert in head, so async loading, so won't break entire site but e.g. cookie wall may not load, social tags, ..
- most 3PC no have EV and that makes sense

## Take-aways

**EV certificates hurt web performance**, provide no added value and are more expensive than regular certificates. Don't use EV certificates if you care about how reliable and fast your website is!

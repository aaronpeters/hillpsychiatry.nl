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

Extended Validation (EV) certificates make websites slower and less robust. The EV certificate delays the time to secure the connection and more importantly: the reliability of your website depends on speed and availability your Certificate Authority's infrastructure.

**TL;DR**
- EV certificates are much more expensive than 'regular' certificates, but don't provide better security
- Browsers don't show the 'green bar' anymore for sites with EV certificates, so there no longer is that proclaimed benefit of an enhanced perception of trust by site visitors
- EV certificates force Chrome and Firefox to check the revocation status of the certificate _every time_ (a connection is established), and this is a blocking request to the Certificate Authority's server
- In case the Certificate Authority's server is very slow or down, your user's experience is bad, your brand is damaged and you missed out on revenue/sign ups/etc

In this article I focus on the performance aspect of EV certificates.
If you want to learn more about the security aspect and when/why browsers have changed their UI for EV certificates, read [Extended Validation Certificates are (Really, Really) Dead](https://www.troyhunt.com/extended-validation-certificates-are-really-really-dead/) and its predecessor [Extended Validation Certificates are Dead](https://www.troyhunt.com/extended-validation-certificates-are-dead/) by Troy Hunt.

Globalsign sells EV certs today at $599/yr and still states "ExtendedSSL activates the green address bar and displays your organization name in the browser interface"


## HTTPS and (EV) Certificates
The HTTP Archive shows a [steady adoption of HTTPS](https://httparchive.org/reports/state-of-the-web#pctHttps) in the past years. Per today, more than 80% of all requests are prefixed with `https`.

<img loading="lazy" class="responsive-ugh" src="/static/img/https-adoption-2017-2019.png" width="550" height="365" alt="HTTPS Adoption 2017-2019">


Websites on HTTPS need a certificate and certificates are obtained from Certificate Authorities.
- what is a cert
- certs used to be expensive, but costs have gone down since LE (YYYY). Not so much though for EV certs 

### What is an EV Certificate?

Extended Validation
You can't get an EV cert unless ...

## Why EV Certificates are Bad for Performance

Chrome behaviour.
Firefox behaviour.


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

What happens when the CA's server is down?

WebPageTest makes it very easy to test this.
Simply enter the hostname you want to fail in the SPOF tab:

<img loading="lazy" class="responsive-ugh" src="/static/img/webpagetest-spof-example.png" width="540" height="241" alt="WebPageTest SPOF Example">

WebPageTest will run a normal test and a test with those hostname(s) blackholed with a max run time of 30 seconds, to then show a video comparison.
Of course, you can also see the waterfall charts etc for the each test.

I'm not showing the comparison videos here, because those are boring and the waterfall charts of the SPOF tests alone make it very clear how much of performance killer EV certificates are in case the CA's server is down:

**Chrome** 

<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-fail-chrome-waterfall-small.png" width="550" height="97" alt="EV Certificate Fail Chrome - Waterfall Chart">

Surprisingly, this 'waterfall' chart does _not_ show the DNS lookup, TCP connect and start of the TLS handshake for `www.kpn.com` but surely Chrome took those steps. Next, Chrome started the EV certificate check and so it did the DNS lookup for `ocsp2.globalsign.com`, initiated the TCP connect and then patiently waited for the server to respond. Chrome is _very_ patient and waits 30 seconds.

I have no idea why WPT shows the `http://www.gstatic.com/generate_204` and neither does the creator of WebPageTest, [Pat Meenan](https://twitter.com/patmeenan) ;-)

[WPT test results page](https://webpagetest.org/result/191206_3P_04903e028f2a522232ee4fdb1fbcd0f6/).
[Chrome Canary v80 is same](https://webpagetest.org/result/191209_9Z_833ebd3d6db53af3502dd8582607d859/).

But wait.
This is actually surprising behaviour by Chrome, because [Chrome does not use OCSP at all since 2012](https://www.computerworld.com/article/2501274/google-chrome-will-no-longer-check-for-revoked-ssl-certificates-online.html).

Chrome uses its own [CRLsets](https://dev.chromium.org/Home/chromium-security/crlsets), which is a list of revoked intermediate certs and the browser will 'frequently' pull in a fresh list.

"Online (i.e. OCSP and CRL) checks are not, generally, performed by Chrome. They can be enabled by policy and, in some cases, the underlying system certificate library always performs these checks no matter what Chromium does."

Can it be that Chrome _will_ do OCSP for EV certificates (Pat: yes) but not for 'regular certificates'? And do that in a hard-fail way?
Yoav Weiss:
- What is Chrome's current behaviour as to cert revocation status checking? Is this still correct: https://dev.chromium.org/Home/chromium-security/crlsets ?
- How often is the CRLsets updated by the browser? Or: what is max time the revoked cert is not considered revoked?
- Are EV certs in CRLsets?
- Does Chrome do OCSP for EV cert?
- Can haz a 'updated date' in chrome://components/ please?
- What is 'Certificate Error Assistant' in chrome://components/

So, does Chrome on WPT have a specific policy enabled? Does Chrome on WPT not use CRLSets?
I asked Pat about this: ...

[Regular cert - why gap between HTML and next requests?](https://webpagetest.org/result/191209_W7_ddbb59d9fc6f481b121206ad33bd01b8/)
[Regular cert T-mobile.nl](https://webpagetest.org/result/191209_5J_abe11450c6aa3f8cde10ec3596cc9329/)
[Regular cert T-mobile.nl - both](https://webpagetest.org/result/191209_DW_f16726be9370d0843dac5411381d6ef3/)

**Firefox**

<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-fail-firefox-waterfall-small.png" width="550" height="199" alt="EV Certificate Fail Firefox - Waterfall Chart">

Firefox is less patient than Chrome: after waiting for ~ 12 seconds for the CA's server to respond, Firefox moved on and loaded the page. 
This means Firefox is more forgiving than Chrome and does _not_ abort a HTTPS request if the EV certificate check times out.

[WPT test results page](https://webpagetest.org/result/191206_1E_bad633b761679334fb8a2a27c428e5ad/).
[Regular cert](https://webpagetest.org/result/191209_5J_abe11450c6aa3f8cde10ec3596cc9329/)

**Other Browsers**

[Safari on iPad 2017 iOS 12 - not sure setDnsName works ](https://webpagetest.org/result/191209_A7_735cbe9c631cdcaacffa63f4802b7003/1/details/#waterfall_view_step1)
[Edge Dev (Chromium) - not sure setDnsName works ](https://webpagetest.org/result/191209_GM_0a2fa5f68112b88777540dd7cd33bd9e/)
[IE11 - not sure setDnsName works ](https://webpagetest.org/result/191209_7X_5c8afa72bc43bb36b4a38394292a9325/)

### OCSP Stapling 

If OCSP Stapling is 'active' and the website has recently been visited in the browser (~ in the past 7 days), the browser does not need to check revocation status with the CA because the cert is sent with a staple.

KPN's EV certificate does not have the staple: KPN's server does not do OCSP Stapling.
https://www.ssllabs.com/ssltest/analyze.html?d=www.kpn.com&hideResults=on


So, in conclusion:
- from the first normal test in Chrome you can see it's all about `ocsp2.globalsign.com`
- if `ocsp2.globalsign.com` is unreachable, your site is completely broken 
- easy to see that in action with WPT, using the SPOF tab


- Relay42
- they provide an dynamic script to insert in head, so async loading, so won't break entire site but e.g. cookie wall may not load, social tags, ..
- most 3PC no have EV and that makes sense

## Take-aways

**EV certificates hurt web performance**, provide no added value and are more expensive than regular certificates. Don't use EV certificates if you care about how reliable and fast your website is!


## Reading

- https://blog.cloudflare.com/high-reliability-ocsp-stapling/

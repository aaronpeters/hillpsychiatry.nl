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

Extended Validation certificates make websites slower and less robust, much more so than 'normal' DV certificates.
The EV certificate easily delays the time to secure the connection by 100 ms, and often much longer, and this adds up to the time users stare at blank screen.
More importantly, with EV certs the reliability of your website depends on the speed and availability of your Certificate Authority's infrastructure.
Oh, and OCSP stapling does not help at all with EV certs.

Want to see one WPT waterfall chart to know EV certs are performance killers?
Chrome - `www.vodafone.nl` - has OCSP staple - CA is down

Want to know more about DV/EV certs and how browsers behave in wide range of cases? Read on.

If you're interested in understanding better how browsers behave when they receive a DV cert or EV cert, with or without an OCSP staple and in case the CA's server responds quickly or not at all ... grab a coffee and read on.

Let me take you on a journey filled with waterfall charts to help you understand how browsers behave in a wide range of cases:

| Browser | Cert type | OCSP staple | CA's server |
| --------| --------- | ----------- | --- |
| Chrome 	| DV | No | Fast response | 
| Chrome 	| DV | No | No response | 
| Chrome 	| DV | Yes | Fast response | 
| Chrome 	| DV | Yes | No response | 
| Chrome 	| EV | No | Fast response | 
| Chrome 	| EV | No | No response | 
| Chrome 	| EV | Yes | Fast response | 
| Chrome 	| EV | Yes | No response | 

| Firefox 	| DV | No | Fast response | 
| Firefox	| DV | No | No response | 
| Firefox	| DV | Yes | Fast response | 
| Firefox	| DV | Yes | No response | 
| Firefox	| EV | No | Fast response | 
| Firefox	| EV | No | No response | 
| Firefox	| EV | Yes | Fast response | 
| Firefox	| EV | Yes | No response | 


## DV certs

Summary:

- some browsers don't even check revocation status (Chrome) 
- other browser do (Safari, Firefox) and although they use a soft-fail strategy, the revocation check does increase Start Render time; OCSP stapling gets rid of that extra time, so there is a solution

---

### T-mobile - OSCP staple = No

Most sites have this.

#### Chrome 

[normal](https://webpagetest.org/result/191219_HW_db9ae2f9ad244e74a5aa0dbd5d49f272/)
[normal - repeat view](#)
[OCSP blocked](https://webpagetest.org/result/191219_AW_a5ff3267dfe0deb1a969204f74f976f1/)
[OCSP blocked - repeat view](#)

Expected: no OCSP check requests to see
Observed: same!

#### Firefox

[normal](https://webpagetest.org/result/191209_7J_1668a3bd5c0cb854968a58772b2d263c/1/details/#waterfall_view_step1)
[normal - repeat view](https://webpagetest.org/result/191209_7J_1668a3bd5c0cb854968a58772b2d263c/1/details/cached/#waterfall_view_step1)
[OCSP blocked](https://webpagetest.org/result/191209_5J_abe11450c6aa3f8cde10ec3596cc9329/1/details/#waterfall_view_step1)
[OCSP blocked - repeat view](https://webpagetest.org/result/191209_5J_abe11450c6aa3f8cde10ec3596cc9329/1/details/cached/#waterfall_view_step1)

Expected: OCSP check happens on first view (not on repeat view?) and if CA is down FF will soft-fail after 2 seconds.
Observed: same!

---

### KLM - OSCP staple = Yes

All sites should have this, but few do.

#### Chrome

setDnsName	ocsp.comodoca.com	blackhole.webpagetest.org
setTimeout	240
navigate	https://www.klm.com/

[normal](https://webpagetest.org/result/191219_71_d23633b48674c26903fdd11d319905aa/1/details/#waterfall_view_step1)
[normal - repeat view](https://webpagetest.org/result/191219_71_d23633b48674c26903fdd11d319905aa/1/details/cached/#waterfall_view_step1)
[OCSP blocked](https://webpagetest.org/result/191219_HN_313cba153200351001cc416b22b70549/)
[OCSP blocked - repeat view](#)

Expected: no OCSP check requests to see ... yes, repeat view has one at top of waterfall but that is for the cert for `tdn.r42tag.com`
Observed: same!


#### Firefox

[normal](https://webpagetest.org/result/191219_BQ_103ebb11682b469806f8c19d171ad6b6/1/details/#waterfall_view_step1)
[normal - repeat view](https://webpagetest.org/result/191219_BQ_103ebb11682b469806f8c19d171ad6b6/1/details/cached/#waterfall_view_step1)
[OCSP blocked](https://webpagetest.org/result/191219_QN_a67245fd3081ae7c18624325c1d1be43/1/details/#waterfall_view_step1)
[OCSP blocked - repeat view](https://webpagetest.org/result/191219_QN_a67245fd3081ae7c18624325c1d1be43/1/details/cached/#waterfall_view_step1)

Expected: no OCSP check requests to see
Observed: same!

Side note: in Firefox, browser and server (Akamai) at first do HTTP/1.1 and later on, at request ~ 70, they switch to H/2. Huh?
And yes, KLM needs some webperf help, especially if they want to service Firefox users better (caching not working, wtf)


## EV certs

Do Chrome and Firefox behave differently when processing EV vs DV certs?
For example, will Chrome do the revocation status check?
How long will the browser wait for the CA to respond and if no response comes arrives on time, what happens?
Let's find out.

Summary

- Chrome and FF always check revocation status (every new connection) with the CA ... OCSP stapling does not prevent this
- Chrome patiently waits for the CA's response for up to 30 sec, while Firefox stops waiting after 10 seconds
- Firefox has the same soft-fail policy as for DV certificates, while Chrome is less forgiving and applies a hard-fail policy and presents the user an error page


### KPN - OSCP staple = No

The worst you can have.

#### Chrome 

[normal](https://webpagetest.org/result/191206_G5_df7b2dbab22821f12ee60d6b39dc8528/2/details/#waterfall_view_step1)
[normal - repeat view](https://webpagetest.org/result/191206_SQ_f15420633de4930f52101d8a717de426/2/details/cached/#waterfall_view_step1)
[OCSP blocked](#)
[OCSP blocked - repeat view](#)

Normal, check the revocation status of the intermediate certificate, then status of domain cert ... these add 300 ms to start render time
Normal, Repeat view ... Chrome does not re-use the revocation check responses from cache

Firefox

[normal](https://webpagetest.org/result/191206_SQ_f15420633de4930f52101d8a717de426/2/details/#waterfall_view_step1)
[normal - repeat view](https://webpagetest.org/result/191206_SQ_f15420633de4930f52101d8a717de426/2/details/cached/#waterfall_view_step1)
[OCSP blocked]()
[OCSP blocked - repeat view](#)

Normal, First view ... same as Chrome
Normal, Repeat view ... same as Chrome, no re-use from cache, but why 3x the requests? Browser knows from previous visit to establish multiple connections to `www.kpn.com` ?


### Vodafone - OSCP staple = Yes

OCSP stapling helps you not at all.



| Browser | Cert type | OCSP staple | Revocation status check? | What if CA is down? |
| --------| --------- | ----------- | --- | --- |
| Chrome 	| DV | No | No | n/a |
| Firefox	| DV | No | Yes, so 100+ ms TLS time | Soft-fail after 2 sec |
| Chrome 	| DV | Yes | No | n/a |
| Firefox	| DV | Yes | KLM? | KLM? |
| Chrome 	| EV | No | 
| Chrome 	| EV | Yes |



Revocation status check

| Browser | Behaviour | DV | EV |
| --------| --------- | --- | --- |
| Chrome 	| Blocking | No | Yes |
| Chrome 	| Hard fail | No | Yes |
| Chrome 	| Time-out threshold | ? | 30 sec |
| Chrome 	| Cached certs too | No | Yes |
| Firefox | Blocking | No | Yes |
| Firefox	| Hard fail | No | Yes |
| Firefox	| Time-out threshold | 2 sec | 10 sec |
| Firefox | Cached certs too | No | Yes |


WPT tests for Chrome and Firefox:

| Browser | View | DV | EV |
| --------| --------- | --- | --- |
| Chrome 	| First | No | Yes |





- Chrome: does not check revocation status for DV certs


- EV certificates are worse for performance than DV certs 
- Chrome checks revoke status _every time_ for EV, not for DV

- DV certs ... if (OCSP staple) { if not expired: load the page; else: do  } else {  }
- browsers have a soft-fail strategy for checking recovation status of uncached certs 
because browser send a blocking revocation status request to the CA's server _every time_ a new connection is established
- Chrome and Firefox to check the revocation status of the certificate _every time_ a new connection is established, and this is a blocking request to the Certificate Authority's server
- In case the Certificate Authority's server is very slow or down, your website visitors suffer, your brand is damaged and you missed out on revenue/sign ups/etc.


---


## Why EV Certificates are Bad for Performance

On the topic of revocation status check ...

Browser gets a new cert ... is it revoked?

0. Check local cache: cert is present, not expired?
1. Check OCSP staple: is it present and not expired?
2. Check CRL: 
3. Check with OCSP responder: wait a bit ... if response arrives, use it, if not just continue (= soft-fail strategy) *and store in local cache*

If the browser has a cert in cache and not expired
1. Check OCSP staple: if present: if not expired, continue; if expired, check with OCSP responder
2. Check CRL



- Check in CRL: Browsers have a built-in, frequently updated list of revoked certs (OneCRL by Firefox and CRLSets by Chrome), but only high-impact certificates are included in this list, so not your cert
- Certs can contain an OCSP staple (= digitally signed stamp the web server received from the CA and put in the cert) and if present and not expired, browsers don't do revocation status check !
- Browsers cache certificates and if the cert has an OCSP staple, the revocation status check does not occur again until the staple has expired
- Browsers have a soft-fail strategy for revocation status checks: "If the revocation information is available, they rely on it, and otherwise they assume the certificate is not revoked and display the page without any errors" .. not great for security and the check does delay page load


Chrome behaviour.
Firefox behaviour.



### EV Certificates Cause Slowness

[https://www.kpn.com/](https://www.kpn.com/)
EV cert, no OSCP response stapled in the certificate.

In short: the longer the EV cert check takes, the longer your site visitors stare at a blank screen.

#### Chrome

[First view](https://webpagetest.org/result/191206_G5_df7b2dbab22821f12ee60d6b39dc8528/2/details/#waterfall_view_step1)

<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-ok-chrome-waterfall-small.png" width="550" height="199" alt="EV Certificate Chrome OK - Waterfall Chart">

Chrome first checks the revocation status of the intermediate certificate. 
This is the request to `http://ocsp2.globalsig...BgkrBgEFBQcwAQE%3D`
Next, Chrome performs a check with the same purpose for the EV cert: see the request to `http://ocsp2.globalsig...0wCwYJKwYBBQUHMAEB`

These two requests add a whopping ~ 300 ms to the time it takes to secure the connection for `www.kpn.com` !

What happens when Chrome visits the same site again, after a short period of time?
Does the browser re-use the revocation check responses from cache? 
No.

[Repeat View](https://webpagetest.org/result/191206_G5_df7b2dbab22821f12ee60d6b39dc8528/2/details/cached/#waterfall_view_step1)

<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-ok-chrome-repeatview-waterfall-small.png" width="550" height="199" alt="EV Certificate Chrome OK Repeat View - Waterfall Chart">



#### Firefox

[First View)](https://webpagetest.org/result/191206_SQ_f15420633de4930f52101d8a717de426/2/details/#waterfall_view_step1)

<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-ok-firefox-waterfall-small.png" width="550" height="199" alt="EV Certificate Firefox OK - Waterfall Chart">

[Repeat View](https://webpagetest.org/result/191206_SQ_f15420633de4930f52101d8a717de426/2/details/cached/#waterfall_view_step1)

<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-ok-firefox-repeatview-waterfall-small.png" width="550" height="199" alt="EV Certificate Firefox OK Repeat View - Waterfall Chart">

- see the requests for http://ocsp2.globalsign.com/gsextendvalsha2g3r3

#### Other browsers

- [WPT iPhone 8+](https://webpagetest.org/result/191206_KR_7de3efd6f4d72d27b0a910ed323e2f98/)
- WPT don't show the cert validation requests ... because SLEEVI SAYS: ... 

- [WPT - IE11](https://webpagetest.org/result/191206_KW_2f83d93760db081d6bf140259da65c70/)
- WPT don't show the cert validation requests: THIS IS A WPT THING?


### EV Certificates are a Reliability Risk

What happens when the CA's server is down?

WebPageTest makes it very easy to test this.
Simply enter the hostname you want to fail in the SPOF tab:

<img loading="lazy" class="responsive-ugh" src="/static/img/webpagetest-spof-example.png" width="540" height="241" alt="WebPageTest SPOF Example">

WebPageTest will run a normal test and a test with those hostname(s) blackholed with a max run time of 30 seconds, to then show a video comparison.
Of course, you can also see the waterfall charts etc for the each test.

I'm not showing the comparison videos here, because those are boring and the waterfall charts of the SPOF tests alone make it very clear how much of performance killer EV certificates are in case the CA's server is down:

**Chrome** 

Let's first see what happens in Chrome when the browser loads `https://www.kpn.com/` :

<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-chrome-waterfall-small.png" width="550" height="97" alt="EV Certificate Chrome - Waterfall Chart">

... bla bla ... actually two requests to the CA ...
[WPT](https://webpagetest.org/result/191206_M1_80fc6dc849d68e3b112bfd043cfb7d0b/)


<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-fail-chrome-waterfall-small.png" width="550" height="97" alt="EV Certificate Fail Chrome - Waterfall Chart">

The waterfall chart shows Chrome did the DNS lookup and TCP connect for `www.kpn.com` and then it's 'nothing' until ~ 30 seconds later.
Surely, like we saw before in the normal test, Chrome here also initiated the EV certificate check and after patiently waiting for ~ 30 seconds, the browser aborted the page load.


and so it did the DNS lookup for `ocsp2.globalsign.com`, initiated the TCP connect and then patiently waited for the server to respond. Chrome is _very_ patient and waits 30 seconds.

I have no idea why WPT shows the `http://www.gstatic.com/generate_204` and neither does the creator of WebPageTest, [Pat Meenan](https://twitter.com/patmeenan) ;-)

[WPT test results page](https://webpagetest.org/result/191206_3P_04903e028f2a522232ee4fdb1fbcd0f6/2/details/#waterfall_view_step1).
[Chrome Canary v80 is same](https://webpagetest.org/result/191209_9Z_833ebd3d6db53af3502dd8582607d859/).

But wait.
This is actually surprising behaviour by Chrome, because [Chrome does not use OCSP at all since 2012](https://www.computerworld.com/article/2501274/google-chrome-will-no-longer-check-for-revoked-ssl-certificates-online.html).

Chrome uses its own [CRLsets](https://dev.chromium.org/Home/chromium-security/crlsets), which is a list of revoked intermediate certs and the browser will 'frequently' pull in a fresh list.

"Online (i.e. OCSP and CRL) checks are not, generally, performed by Chrome. They can be enabled by policy and, in some cases, the underlying system certificate library always performs these checks no matter what Chromium does."

Can it be that Chrome _will_ do OCSP for EV certificates (Pat: yes) but not for 'regular certificates'? And do that in a hard-fail way?
Yoav Weiss:
- What is Chrome's current behaviour as to cert revocation status checking? Is this still correct: https://dev.chromium.org/Home/chromium-security/crlsets ? Yes, but ...
- How often is the CRLsets updated by the browser? Or: what is max time the revoked cert is not considered revoked?
- Are EV certs in CRLsets? No
- Does Chrome do OCSP for EV cert? Yes

So, does Chrome on WPT have a specific policy enabled? Does Chrome on WPT not use CRLSets?
I asked Pat about this: ...

[Regular cert](#)
[Regular cert T-mobile.nl - OCSP blocked](#)
[Regular cert T-mobile.nl - both blocked](#)

**Firefox**

<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-fail-firefox-waterfall-small.png" width="550" height="199" alt="EV Certificate Fail Firefox - Waterfall Chart">

Firefox is less patient than Chrome: after waiting for ~ 12 seconds for the CA's server to respond, Firefox moved on and loaded the page. 
This means Firefox is more forgiving than Chrome and does _not_ abort a HTTPS request if the EV certificate check times out.

[WPT test results page](https://webpagetest.org/result/191206_1E_bad633b761679334fb8a2a27c428e5ad/).

[Regular cert](https://webpagetest.org/result/191209_7J_1668a3bd5c0cb854968a58772b2d263c/)
[Regular cert T-mobile.nl - OCSP blocked](https://webpagetest.org/result/191209_5J_abe11450c6aa3f8cde10ec3596cc9329/)
[Regular cert T-mobile.nl - OCSP and Root blocked](https://webpagetest.org/result/191209_DW_f16726be9370d0843dac5411381d6ef3/)

**Other Browsers**

[Safari on iPad 2017 iOS 12 - not sure setDnsName works ](https://webpagetest.org/result/191209_A7_735cbe9c631cdcaacffa63f4802b7003/1/details/#waterfall_view_step1)
[Edge Dev (Chromium) - not sure setDnsName works ](https://webpagetest.org/result/191209_GM_0a2fa5f68112b88777540dd7cd33bd9e/)
[IE11 - not sure setDnsName works ](https://webpagetest.org/result/191209_7X_5c8afa72bc43bb36b4a38394292a9325/)


### OCSP Stapling 

If OCSP Stapling is in play and the website has recently been visited in the browser (~ in the past 7 days), the browser does not need to check revocation status with the CA because the cert is sent with a staple and that staple has been cached by system (at OS level???) NOT SURE ABOUT THIS !

KPN's EV certificate does not have the staple: KPN's server does not do OCSP Stapling.
https://www.ssllabs.com/ssltest/analyze.html?d=www.kpn.com&hideResults=on


So, in conclusion:
- from the first normal test in Chrome you can see it's all about `ocsp2.globalsign.com`
- if `ocsp2.globalsign.com` is unreachable, your site is completely broken 
- easy to see that in action with WPT, using the SPOF tab
- can also experience it self on local machine by adding an entry to the hosts file: <blackhole IP>	ocsp2.globalsign.com


# TL;DR

Behaviour for revocation status (when does it happen, is it blocking, soft/hard fail ...) depends on browser/OS.

For EV certs, not for DV certs :

- Browsers check the revocation status of the cert _every time a new connection is established_
- Cert has a valid, non-expired OCSP staple? Browser will still check with the CA's OCSP responder
- The request to the CA blocks page load
- Chrome is very patient and has hard-fail strategy for EV (not for DV)
- Firefox waits ~ 10 seconds and then continues, so soft-fail



## Take-aways

**EV certificates hurt web performance**, provide no added value and are more expensive than regular certificates. Don't use EV certificates if you care about how reliable and fast your website is!


## Reading

- https://blog.cloudflare.com/high-reliability-ocsp-stapling/


**TL;DR**

- Don't use an EV certificate if you care about the speed and reliability of your site
- OCSP stapling to the rescue? No, that does not help at all with EV certs

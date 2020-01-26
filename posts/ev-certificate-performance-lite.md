---
draft: true
title: EV Certificates Make The Web Slow and Unreliable
title1: EV Certificates are Performance Killers
title2: The Performance Impact of EV Certificates
title3: HTTPS Certificates, OCSP Stapling
description: TODO
summary: TODO
date: 2019-01-01
xtags:
  - webperf
  - tls
  - certificates
keyword: EV Certificate Performance
---

Extended Validation (EV) certificates make websites slower and less robust, much more so than Domain Validation (DV) and Organization Validation (OV) certificates.
The EV certificate significantly increases TLS handshake time and therefore extends how long users stare at a blank screen, waiting for the page to start rendering.
Perhaps more importantly, using an EV cert means the reliability of your website depends on your Certificate Authority's infrastructure: if the CA's server is down, your site is down.

Want to see just one image to know EV certs are bad for performance?

<img loading="lazy" class="responsive-ugh" src="/static/img/ev-cert-oscp-stapled-chrome-fail.jpg" width="423" height="600" alt="EV Certificate with OCSP Staple - Recovation Check Fail in Chrome">

That is what Chrome users see when visiting a website that uses an OCSP stapled EV certificate and the Certificate Authority's server (the OCSP responder) is down. That's right, **[OCSP stapling](https://en.wikipedia.org/wiki/OCSP_stapling) does not help at all with EV certs**.

<div class="notice-msg info">
  OCSP stapling allows the presenter of the certificate (the server) to check with the CA if the certificate has been revoked and then add ("staple") this information to the certificate. Consequently, the browser can simply skip the revocation status check.<br>
</div>

Let's dive into the world of DV/OV and EV certificates, revocation status checks and OCSP stapling and find out how Chrome and Firefox behave in case the CA's server responds quickly, or not at all.

But first: WebPageTest.

## Testing Certificate Revocation Checks in WebPageTest

Most of the data for this 'research' was collected using [WebPageTest](https://www.webpagetest.org/). WebPageTest in general is great for web performance analysis, but an especially good fit here because it exposes the revocation status checks (Firefox/Chome Dev Tools do not!) and you can easily simulate the failure of OCSP responders. Read the next section to learn what I did in WebPageTest, or skip to [DV Certificates and Performance](#dv-cert-perf).


WebPageTest makes it easy to see how the loading of a webpage is impacted by a failing (third party) domain.
Here, that failing domain is the CA's OCSP responder, so let's get this first.

### Get the Domain of Your Certiticate's OCSP Responder
In Chrome, navigate to the site you want to test, for example [www.cloudflare.com](https://www.cloudflare.com/). 
Click the lock icon in the address bar and then click Certificate. 
In the new modal window, scroll down until you see Online Certificate Status Protocol.
The value of the URI, without the `http://` is the domain of the CA's OCSP responder.
In the screenshot below, the domain is `ocsp.digicert.com`.

<img loading="lazy" class="responsive-ugh" src="/static/img/chrome-see-cert-ocsp-responder.png" width="540" height="437" alt="See OCSP Responder Domain in Chrome">

### Run SPOF test on WebPageTest

On the [WebPageTest](https://www.webpagetest.org/) homepage, first enter the URL you want to test and select a test location and browser.

Before you start the test, open the SPOF tab and enter the domain of the OCSP responder:

<img loading="lazy" class="responsive-ugh" src="/static/img/webpagetest-spof-example.png" width="476" height="240" alt="WebPageTest SPOF Example">

WebPageTest will now run a normal test _and_ a test with the domain(s) blackholed, to then show a video comparison.
You can also access the waterfall chart and all details for each test.

### Does the Certificate Have an OCSP Staple?

Before interpreting the WebPageTest results, you will want to know if the website's certificate contains a stapled OCSP response. You can't see this in the browser, but it's trivial with OpenSSL:

`echo QUIT | openssl s_client -servername www.cloudflare.com -connect www.cloudflare.com:443 -status 2> /dev/null | grep -A 17 'OCSP response:' | grep -B 17 'Next Update'`

If the certificate is _not_ stapled, the command will show _no_ output.


## <a name="dv-cert-perf"></a>DV Certificates and Performance

The [2019 Web Almanac](https://almanac.httparchive.org/en/2019/) provides a list of the [top ten Certificate Authorities](https://almanac.httparchive.org/en/2019/security#certificate-authorities). 
All of these CAs are issuers for DV certificates, meaning most websites use a [Domain Validation](https://en.wikipedia.org/wiki/Domain-validated_certificate) certificate.

Based on my data, **using an OCSP stapled DV certificate is a great choice for web performance** :
<!-- : no extra TLS handshake time and no risk of your site not loading in case the CA's server is down. -->
<!-- 
Is a DV certificate a good choice from a web performance perspective?
Yes, if the cert is OCSP stapled.

My short and simple answer is "Yes, if the cert is OCSP stapled". -->

<!-- Do DV certs slow down page loading?
Does it matter if the cert is OCSP stapled?
Any significant differences between browsers? -->

<!-- Do Chrome and Firefox send a revocation status check request to the CA when receiving a DV certificate?
Does that depend on the certificate being OCSP stapled or not?
What happens in these browsers when the CA's server can't be reached or does not respond? -->

<!-- The story about DV certificates and revocation status checks in browsers boils down to this: -->
- Chrome _never_ checks the revocation status with the CA for _any_ DV certificate
- Firefox _always_ checks a DV certificate's revocation status with the CA, unless the certificate is OCSP stapled (then it _never_ checks with the CA)

With the TL;DR out of the way, let's take a closer look at Chrome and Firefox behaviour, starting with websites that serve a certificate that has _not_ been stapled.

### No OCSP staple

[T-mobile.nl](https://www-t-mobile.nl/) uses a non-OCSP stapled DV cert, so browsers can't know _just_ from the certificate whether or not the cert has been revoked.

#### Chrome 

Below are two (truncated) WebPageTest waterfall charts. 

If Chrome checks revocation status online, the very first request in the WebPageTest waterfall chart will be for `ocsp2.globalsign.com`.

Let's first look at a normal test run:

<a href="https://webpagetest.org/result/191219_HW_db9ae2f9ad244e74a5aa0dbd5d49f272/2/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/dv-cert-no-ocsp-staple-chrome-waterfall-small.png" width="530" height="199" alt="DV Certificate Without OCSP Staple - Chrome - Waterfall Chart">
</a>

<small>Click the image to navigate to the full WebPageTest results</small>

Chrome did not send a request to the OCSP responder.
To confirm Chrome's behaviour, I ran tests that blackhole the OCSP responder domain.

<a href="https://webpagetest.org/result/191219_AW_a5ff3267dfe0deb1a969204f74f976f1/2/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/dv-cert-no-ocsp-staple-blocked-chrome-waterfall-small.png" width="530" height="199" alt="DV Certificate Without OCSP Staple - Responder blocked - Chrome - Waterfall Chart">
</a>

<small>Click the image to navigate to the full WebPageTest results</small>

Again, no request to `ocsp2.globalsign.com`.

Apparently, when Chrome is presented a DV certificate without an OCSP staple, it simply assumes the certificate has not been revoked and does not check online with the CA. This is great for performance but not so great from a security point of view.

### Firefox

Firefox checks revocation status of DV certificates and this slows down the loading of the page.
OCSP stapling is an effective solution to get rid of that extra time.

No OCSP staple in the DV cert:
[T-mobile.nl](https://webpagetest.org/result/191209_7J_1668a3bd5c0cb854968a58772b2d263c/1/details/#waterfall_view_step1)

KLM's OCSP stapled certificate:

---

#### Chrome 

Chrome doesn't bother to check the revocation status of the DV certificate:

[normal](https://webpagetest.org/result/191219_HW_db9ae2f9ad244e74a5aa0dbd5d49f272/)
[OCSP blocked](https://webpagetest.org/result/191219_AW_a5ff3267dfe0deb1a969204f74f976f1/)

#### Firefox

Firefox checks revocation status of DV certificates and this slows down the loading of the page.
OCSP stapling is an effective solution to get rid of that extra time.

[normal](https://webpagetest.org/result/191209_7J_1668a3bd5c0cb854968a58772b2d263c/1/details/#waterfall_view_step1)
[normal - repeat view](https://webpagetest.org/result/191209_7J_1668a3bd5c0cb854968a58772b2d263c/1/details/cached/#waterfall_view_step1)
[OCSP blocked](https://webpagetest.org/result/191209_5J_abe11450c6aa3f8cde10ec3596cc9329/1/details/#waterfall_view_step1)
[OCSP blocked - repeat view](https://webpagetest.org/result/191209_5J_abe11450c6aa3f8cde10ec3596cc9329/1/details/cached/#waterfall_view_step1)

Something interesting in repeat view? If not, leave it out.
OCSP check happens on first view (not on repeat view?) and if CA is down FF will soft-fail after 2 seconds.

---

### OCSP staple in the DV cert

This is the best option from a performance perspective.
All sites should use a DV cert and do OCSP stapling, but few do.
Example: https://www.klm.com/

#### Chrome

setDnsName	ocsp.comodoca.com	blackhole.webpagetest.org
setTimeout	240
navigate	https://www.klm.com/

[normal](https://webpagetest.org/result/191219_71_d23633b48674c26903fdd11d319905aa/1/details/#waterfall_view_step1)
[OCSP blocked](https://webpagetest.org/result/191219_HN_313cba153200351001cc416b22b70549/)

As expected, No OCSP check requests to see, and this is expected because Chrome doesn't check 


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

Do Chrome and Firefox behave differently when processing EV vs DV/OV certs?
For example, will Chrome do the revocation status check?
How long will the browser wait for the CA to respond and if no response arrives in time, what happens?
Let's find out.

Summary

- Chrome and FF always check revocation status with the CA ... OCSP stapling does not prevent this
- Chrome patiently waits for the CA's response for up to 30 sec, while Firefox stops waiting after 10 seconds
- Firefox has the same soft-fail policy as for DV/OV certificates, while Chrome is less forgiving and applies a hard-fail policy and presents the user an error page


### KPN - OCSP staple = No

The worst setup you can have.

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
[OCSP blocked](#)
[OCSP blocked - repeat view](#)

Normal, First view ... same as Chrome
Normal, Repeat view ... same as Chrome, no re-use from cache, but why 3x the requests? Browser knows from previous visit to establish multiple connections to `www.kpn.com` ?


### Vodafone - OCSP staple = Yes

`echo QUIT | openssl s_client -connect www.vodafone.nl:443 -status 2> /dev/null | grep -A 17 'OCSP response:' | grep -B 17 'Next Update'`

OCSP stapling helps you not at all.

setDnsName	ocsp.digicert.com	blackhole.webpagetest.org
setTimeout	240
navigate	https://www.vodafone.nl/

#### Chrome

[normal](https://webpagetest.org/result/191221_60_998bb5849721be8e2dd1f76fe2f44ed5/)
[normal - repeat view]()
[OCSP blocked](https://webpagetest.org/result/191221_5M_eb417fb68f2c4aa428cc6eb06375f2f1/)
[OCSP blocked - repeat view](#)


#### Firefox

[normal](https://webpagetest.org/result/191221_Y6_c0ec54f331942e07eb7fedee1cad9dca/)
[normal - repeat view]()
[OCSP blocked](https://webpagetest.org/result/191221_2F_f2b20f71fc722a1ca75003638775a4a4/2/details/#waterfall_view_step1)
[OCSP blocked - repeat view](https://webpagetest.org/result/191221_2F_f2b20f71fc722a1ca75003638775a4a4/2/details/cached/#waterfall_view_step1)



---

| Browser | Cert type | OCSP staple | Revocation status check? | What if CA's server is down? |
| --------| --------- | ----------- | --- | --- |
| Chrome 	| DV | No | No | n/a |
| Firefox	| DV | No | Yes | Soft-fail after 2 sec |
| Chrome 	| DV | Yes | No | n/a |
| Firefox	| DV | Yes | KLM? | KLM? |
| Chrome 	| EV | No | Yes | Hard-fail after 30 sec. |
| Firefox	| EV | No | Yes | Soft-fail after 10 sec. |
| Chrome 	| EV | Yes | Yes | Hard-fail after 30 sec. |
| Firefox	| EV | Yes | Yes | Soft-fail after 10 sec. |



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
EV cert, no OCSP response stapled in the certificate.

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

Are you a 3PC and using an EV cert? 
Please don't, especially if you serving content that is very important to the business (e.g. tag manager).


## Reading

- https://blog.cloudflare.com/high-reliability-ocsp-stapling/


**TL;DR**

- Don't use an EV certificate if you care about the speed and reliability of your site
- OCSP stapling to the rescue? No, that does not help at all with EV certs


<!-- Let me take you on a journey filled with waterfall charts to help you understand how browsers behave in a wide range of cases:

- Chrome or Firefox
- DV or EV certificate
- OCSP staple or not
- CA's server responds quickly, or not at all

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
| Firefox	| EV | Yes | No response |  -->

<!-- This article aims to provide you with a better understanding of how browsers behave when they receive a DV/OV cert or an EV cert, in case the CA's server responds quickly or not at all. -->

<!-- 
Does Chrome also hard-fail for DV and OV certificates when the revocation status check fails?
Is OCSP stapling effective in improving performance 
Does Firefox behave the same as Chrome?

Let's dive into the world of certificates and OCSP stapling and find out how Chrome and Firefox behave when the CA's server responds to the revocation status check quickly, or not at all.  

Let's dive into the world of DV/OV and EV certificates, revocation status checks and OCSP stapling and find out how Chrome and Firefox behave in case the CA's server responds fast or not at all  
-->

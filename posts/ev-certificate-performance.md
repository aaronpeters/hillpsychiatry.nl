---
title: EV Certificates Make The Web Slow and Unreliable
title1: EV Certificates are Performance Killers
title2: The Performance Impact of EV Certificates
title3: HTTPS Certificates, OCSP Stapling
description: Learn why EV certificates are a bad choice for site speed and reliability. Lots of data about browsers, revocation status checks and OCSP stapling.
summary: Learn why EV certificates are a bad choice for site speed and reliability. Dive into the world of DV and EV certificates, browsers, online revocation status checks, OCSP stapling and performance. Lots of data!
twitterImage: "/static/img/s/"
date: 2020-01-28
duration: 15
highlight: true
tags:
  - webperf
  - tls
  - certificates
  - ocsp
  - research
keyword: EV Certificate Performance
---

Extended Validation (EV) certificates are a bad choice for web performance. 
They have a much bigger negative impact on website speed and reliability than Domain Validation (DV) certificates.
The EV certificate significantly increases the time it takes to secure the connection between browser and server and therefore extends how long users stare at a blank screen, waiting for the page to start rendering.
Perhaps more importantly, using an EV certificate means the reliability of your website depends on your Certificate Authority's infrastructure: if the CA's server is down, your site is down.

Want to see just one image to know EV certificates are bad for performance?

<img loading="lazy" class="responsive-ugh" src="/static/img/ev-cert-oscp-stapled-chrome-fail.jpg" width="423" height="600" alt="EV Certificate with OCSP Staple - Recovation Check Fail in Chrome">

That is what Chrome users see when visiting a website that uses an OCSP stapled EV certificate and the Certificate Authority's server (the OCSP responder) is down. That's right, **OCSP stapling is pretty much useless with EV certificates**.

<div class="notice-msg info">
  <a href="https://en.wikipedia.org/wiki/OCSP_stapling">OCSP stapling</a> allows the presenter of the certificate (the server) to check with the CA if the certificate has been revoked and then add ("staple") this information to the certificate. Consequently, the browser may skip the revocation status check.
</div>

Let's dive deep into the world of DV and EV certificates, online revocation status checks and OCSP stapling and find out how Chrome and Firefox behave in case the CA's server responds quickly, or not at all. 

Table of contents:

- [Testing Online Revocation Status Checks in WebPageTest](#wpt)
- [DV Certificates and Web Performance](#dv-cert-perf)
- [EV Certificates and Web Performance](#ev-cert-perf)
- [Key Insights](#take-aways)
- [Closing Remarks](#closing)

<!-- I present the test [results and insight for DV certificates](#dv-cert-perf) first because that provides good context for the data showing [EV certificates are very bad for web performance](#ev-cert-perf). 

In a hurry? Skip all and fast forward to [key take-aways](#take-aways). -->

<!-- <div class="notice-msg info">
  Throughout this article, when I use the word 'certificate' I refer to the server/leaf certificate. This certificate has the website owners' domain(s) listed in the certificate.
</div> -->

## <a name="wpt"></a>Testing Online Revocation Status Checks in WebPageTest

Most of the data for this 'research' was collected using [WebPageTest](https://www.webpagetest.org/). WebPageTest in general is great for web performance analysis, but an especially good fit here because it exposes the online revocation status checks (Firefox/Chome Dev Tools do not!) and you can easily simulate the failure of OCSP responders. Read the next section to learn what I did in WebPageTest, or skip to [DV Certificates and Web Performance](#dv-cert-perf).

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

WebPageTest will now run a normal test _and_ a test with the domain(s) blackholed, to then show a video comparison. You can also access the waterfall chart and all details for each test.

In WebPageTest, blackholing means the browser tries to connect to an IP address and never gets a response. Browsers are very patient at this stage and will typically wait ~60 seconds for response from the server.

### Does the Certificate Have an OCSP Staple?

Before interpreting the WebPageTest results, you will want to know if the website's certificate contains a stapled OCSP response. You can't see this in the browser, but it's trivial to spot with OpenSSL:

`echo QUIT | openssl s_client -servername www.cloudflare.com -connect www.cloudflare.com:443 -status 2> /dev/null | grep -A 17 'OCSP response:' | grep -B 17 'Next Update'`

If the certificate is _not_ stapled, the command will show _no_ output.


## <a name="dv-cert-perf"></a>DV Certificates and Web Performance

The [2019 Web Almanac](https://almanac.httparchive.org/en/2019/) provides a list of the [top ten Certificate Authorities](https://almanac.httparchive.org/en/2019/security#certificate-authorities). 
All of these CAs are issuers for DV certificates, meaning most websites use a [Domain Validation](https://en.wikipedia.org/wiki/Domain-validated_certificate) certificate.

Based on my data, **using an OCSP stapled DV certificate is a great choice for web performance** :

- Chrome _never_ checks the revocation status with the CA for _any_ DV certificate
- Firefox _always_ checks a DV certificate's revocation status with the CA, unless the certificate is OCSP stapled (then it _never_ checks with the CA)

With the TL;DR out of the way, let's take a closer look at Chrome and Firefox behaviour, starting with websites that serve a certificate that has _not_ been stapled.

### DV Certificate - No OCSP Staple

[T-mobile.nl](https://www-t-mobile.nl/) uses a non-OCSP stapled DV certificate, so browsers can't know _just_ from the certificate whether or not the certificate has been revoked.

#### Chrome 

Below are two (truncated) WebPageTest waterfall charts. 

If Chrome checks the revocation status of T-mobile's certificate online, the very first request in the WebPageTest waterfall chart will be for `ocsp2.globalsign.com`.

Let's first look at a normal test run (load the URL in new browser instance with empty cache):

<a href="https://www.webpagetest.org/result/191219_HW_db9ae2f9ad244e74a5aa0dbd5d49f272/2/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/dv-cert-no-ocsp-staple-chrome-waterfall-small.png" width="530" height="199" alt="DV Certificate Without OCSP Staple - Chrome - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

Chrome did not send a request to the OCSP responder.
To confirm Chrome's behaviour, I ran tests that blackhole `ocsp2.globalsign.com`.

<a href="https://www.webpagetest.org/result/191219_AW_a5ff3267dfe0deb1a969204f74f976f1/2/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/dv-cert-no-ocsp-staple-blocked-chrome-waterfall-small.png" width="530" height="199" alt="DV Certificate Without OCSP Staple - Responder Blackholed - Chrome - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

Again, no request to `ocsp2.globalsign.com`.

Apparently, when Chrome is presented a DV certificate without an OCSP staple, it simply assumes the certificate has not been revoked and does not check online with the CA. This is great for performance.

#### Firefox

The same tests give very different results in Firefox.

Result for the normal test:

<a href="https://www.webpagetest.org/result/191209_7J_1668a3bd5c0cb854968a58772b2d263c/1/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/dv-cert-no-ocsp-staple-firefox-waterfall-small.png" width="530" height="199" alt="DV Certificate Without OCSP Staple - Firefox - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

Aha! Firefox sends a request for `http://ocsp2.globalsign.com/gsorganizationvalsha2g2`.  This is the browser checking revocation status of the certificate with GlobalSign. 

_FYI, WebPageTest renders this as the top request in the waterfall chart but it's actually the second request because - obviously - the browser first needs to receive the certificate from the `www.t-mobile.nl` server_.

The fetch from `ocsp2.globalsign.com` took 106 ms incl. DNS lookup. 
That's a good, low number but still: this request makes the T-mobile page load 0.1 second slower.

The request to GlobalSign's OCSP responder is handled by Fastly CDN (could also have been Cloudflare, as GlobalSign uses multiple CDNs).

Inspecting the Fastly response headers provides an interesting insight:

``` html
X-Served-By: cache-sin18045-SIN, cache-ams21035-AMS
X-Cache: MISS, HIT
X-Cache-Hits: 0, 4
```

[Fastly docs](https://docs.fastly.com/en/guides/understanding-cache-hit-and-miss-headers-with-shielded-services) help interpret these headers: 

- the response was a cache hit served from an edge server in Amsterdam
- if Amsterdam would not have the response in cache, that edge server would first fetch it from the Fastly datacenter in Singapore and then send to the browser

Amsterdam &lt;=&gt; Singapore is probably ~100 ms, so let's hope Fastly has a very high cache hit rate at the edge for OCSP responses.

Now, what will happen in Firefox after re-opening the browser _without_ emptying the cache and then loading the same page? 

<a href="https://www.webpagetest.org/result/191209_7J_1668a3bd5c0cb854968a58772b2d263c/1/details/cached/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/dv-cert-no-ocsp-staple-firefox-repeatview-waterfall-small.png" width="530" height="199" alt="DV Certificate Without OCSP Staple - Firefox - Repeat View - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

Hooray! The request to `ocsp2.globalsign.com` did not go out.
Apparently Firefox cached the OCSP response for T-mobile's certificate and used that.

To my surprise, Firefox again sends OCSP requests for `http://ocsp.pki.goog/gts1o1` and  `http://status.geotrust.com/`. This is odd because just earlier Firefox received OCSP responses with explicit 'do cache' headers: `Cache-Control: public, max-age=86400` and `Cache-Control: max-age=128876` respectively. I don't have an explanation for this, so let's move on.

The next question to answer is: what happens if GlobalSign's OCSP responder does not respond at all?

<a href="https://www.webpagetest.org/result/191209_5J_abe11450c6aa3f8cde10ec3596cc9329/1/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/dv-cert-no-ocsp-staple-blocked-firefox-waterfall-small.png" width="530" height="199" alt="DV Certificate Without OCSP Staple - Responder Blackholed - Firefox - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

Two things stand out in this Firefox waterfall chart:

1. there is no request to `ocsp2.globalsign.com` 🤔
2. the first request to `https://www-t-mobile.nl/` has a TLS handshake time of 2 seconds 😦

I don't know why WebPageTest does not show the request to `ocsp2.globalsign.com`, but I'm 100% sure the request did go out because of the big increase in TLS handshake time for `https://www-t-mobile.nl/` and the awesome [Ryan Sleevi](https://twitter.com/sleevi_) confirming to me Firefox has a soft-fail-after-2-seconds policy for online revocation status checks for non-EV certificates.

Knowing Firefox did not receive anything from the CA's OCSP responder, will the browser behave the same when re-visiting the page after a short time?

<a href="https://www.webpagetest.org/result/191209_5J_abe11450c6aa3f8cde10ec3596cc9329/1/details/cached/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/dv-cert-no-ocsp-staple-blocked-firefox-repeatview-waterfall-small.png" width="530" height="199" alt="DV Certificate Without OCSP Staple - Responder Blackholed - Firefox - Repeat View - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

How about that? TLS handshake time is low and no request to `ocsp2.globalsign.com`.

Ryan Sleevi explained to me Firefox will store the certificate in local cache even if the revocation status check was aborted after 2 seconds _and_ Firefox will then use that cached certificate until expired _without_ checking again with the CA.


### DV Certificate With OCSP Staple

We already know that Chrome doesn't bother checking the revocation status online for DV certificates that do _not_ have an OCSP staple. Surely the browser does also _not_ do that check for DV certs _with_ the staple, right? That would make no sense at all, but always good to verify.

And Firefox ... does stapling the certificate effectively get rid of the slowness introduced by that online revocation status check?

I tested with the KLM website - `https://www.klm.com/` - and got all the answers.

#### Chrome 

As expected, Chrome doesn't bother to check the revocation status of the OCSP-stapled DV certificate. Below is the waterfall chart for a test run with the OCSP responder blackholed:

<a href="https://www.webpagetest.org/result/191219_HN_313cba153200351001cc416b22b70549/1/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/dv-cert-with-ocsp-staple-blocked-chrome-waterfall-small.png" width="530" height="199" alt="DV Certificate With OCSP Staple - Responder Blackholed - Chrome - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

#### Firefox

I'm only showing the waterfall charts for the tests with `ocsp.comodoca.com` blackholed because that's enough to know **Firefox does not check revocation status online for OCSP stapled DV certificates** 😃 !

<a href="https://www.webpagetest.org/result/191219_QN_a67245fd3081ae7c18624325c1d1be43/1/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/dv-cert-with-ocsp-staple-blocked-firefox-waterfall-small.png" width="530" height="199" alt="DV Certificate With OCSP Staple - Responder Blackholed - Firefox - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

Close browser, open browser and load `https://www.klm.com/` again:

<a href="https://www.webpagetest.org/result/191219_QN_a67245fd3081ae7c18624325c1d1be43/1/details/cached/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/dv-cert-with-ocsp-staple-blocked-firefox-repeatview-waterfall-small.png" width="530" height="199" alt="DV Certificate With OCSP Staple - Responder Blackholed - Firefox - Repeat View - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

Again no OCSP request goes out for KLM's certificate and this is expected.

_If someone at Akamai or KLM is reading this: do take a close look at the full WebPageTest results because weird things are happening. Browser and server first do HTTP/1.1 and later switch to H/2 (in the first run, first view, the switch happens after request 81). Also, why does Firefox load all those images from network in the repeat view instead of from cache?_


## <a name="ev-cert-perf"></a>EV Certificates and Web Performance

Read all of the above? OK, you now have a good view on how browsers behave when being presented with a DV certificate, but what about EV certificates? 

Do Chrome and Firefox behave differently when processing EV vs DV/OV certificates?
For example, will Chrome check revocation status online?
How long will these browsers wait for the CA to respond and if no response arrives in time, what happens?

TL;DR

- Chrome _always_ checks revocation status with the CA regardless of the EV certificate being OCSP stapled or not and regardless of Chrome having the certificate and/or a "not revoked" OCSP response in its local cache
- Firefox also performs the online status check for EV certificates even if it has the staple, _with one exception_: Firefox will re-use a "not revoked" OCSP response from its local cache, but only if the certificate contains a "not revoked" OCSP response (weird!)
- Chrome patiently waits for the CA's response until the request times out (30+ seconds) and unless it receives a "not revoked" response in time, Chrome will hard-fail and present the user an error page
- Firefox is more forgiving but less patient: the browser _only_ aborts securing the connection and loading the page if the CA sent an explicit "not revoked" response within 10 seconds; in all other scenarios Firefox happily continues

Let's look at the data that backs all this up, starting with non-stapled EV certificates.

### EV Certificate - No OCSP Staple

KPN, the #2 telecom provider in The Netherlands, uses an EV certificate on their main website `https://www.kpn.com` and it's not stapled.

#### Chrome

<!-- [First view - Edge](https://www.webpagetest.org/result/200127_H9_cf8fc6a2d7553d19aba6a09c8609396b/) -->

<a href="https://www.webpagetest.org/result/191206_G5_df7b2dbab22821f12ee60d6b39dc8528/2/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-no-ocsp-staple-chrome-waterfall-small.png" width="530" height="199" alt="EV Certificate Without OCSP Staple - Chrome - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

Chrome checks the revocation status not only of the server/leaf certificate but also (and first) of the intermediate certificate. 
One DNS lookup, one TCP connect and two sequential HTTP requests later, these two requests have added a big 0.3 seconds to the time the user is waiting for something to appear on the screen. 
Ugh.

What happens when Chrome navigates to the same site again after a short while? Sadly, the same as before: two blocking OCSP requests:

<a href="https://www.webpagetest.org/result/191206_G5_df7b2dbab22821f12ee60d6b39dc8528/2/details/cached/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-no-ocsp-staple-chrome-repeatview-waterfall-small.png" width="530" height="199" alt="EV Certificate Without OCSP Staple - Chrome - Repeat View - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

Chrome does not re-use revocation check responses from cache for EV certificates. 😮

<!-- [Repeat view - Edge](https://www.webpagetest.org/result/200127_H9_cf8fc6a2d7553d19aba6a09c8609396b/) -->

The next scenario I tested is the blackholed OCSP responder:

<a href="https://www.webpagetest.org/result/191206_3P_04903e028f2a522232ee4fdb1fbcd0f6/2/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-no-ocsp-staple-blocked-chrome-waterfall-small.png" width="530" height="199" alt="EV Certificate Without OCSP Staple - Responder Blackholed - Chrome - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

What is going on here?

Ryan Sleevi was so kind to explain:

- this definitely is failure due to the online revocation status check
- Chrome waited for the OCSP response until Chrome's connection timeout threshold was hit (30 seconds on Windows, 60s on Linux/ChromeOS), and then aborted the page load process
- the request to `http://www.gstatic.com/generate_204` is the "captive portal check chrome does on startup"

**Chrome aborts the connection to a domain that serves an EV certificate in case the online revocation status check fails (the CA's OCSP responder is down or super slow).**

The repeat view paints the same picture so I'm not showing the same waterfall chart twice.

#### Firefox

Launch a fresh Firefox instance and navigate to `https://www.kpn.com`:

<a href="https://www.webpagetest.org/result/191206_SQ_f15420633de4930f52101d8a717de426/2/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-no-ocsp-staple-firefox-waterfall-small.png" width="530" height="199" alt="EV Certificate With OCSP Staple - Firefox - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

Firefox shows the same behaviour as Chrome: check status of the server/leaf certificate _and_ of the intermediate certificate.

Close and re-open the browser and load `https://www.kpn.com/` again:

<a href="https://www.webpagetest.org/result/191206_SQ_f15420633de4930f52101d8a717de426/2/details/cached/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-no-ocsp-staple-firefox-repeatview-waterfall-small.png" width="530" height="199" alt="EV Certificate With OCSP Staple - Firefox - Repeat View - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

Why does Firefox do the two OCSP requests three times? I have no clue.

Next test is the blackholed OCSP responder:

<a href="https://www.webpagetest.org/result/191206_1E_bad633b761679334fb8a2a27c428e5ad/1/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-no-ocsp-staple-blocked-firefox-waterfall-small.png" width="530" height="199" alt="EV Certificate With OCSP Staple - Responder Blackholed - Firefox - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

Firefox is less patient than Chrome: after waiting for ~ 12 seconds for the CA's server to respond, Firefox moved on and loaded the page. 
This means Firefox is more forgiving than Chrome when it comes to checking revocation status of EV certificates online.

Close browser, open browser and load `https://www.kpn.com/` again:

<a href="https://www.webpagetest.org/result/191206_1E_bad633b761679334fb8a2a27c428e5ad/1/details/cached/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-no-ocsp-staple-blocked-firefox-repeatview-waterfall-small.png" width="530" height="199" alt="EV Certificate With OCSP Staple - Responder Blackholed - Firefox - Repeat View - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

If the certificate status check failed before, Firefox will try again. Makes sense.


### EV Certificate - With OCSP Staple

Vodafone is one of the bigger mobile ISPs in The Netherlands and active in the premium consumer and business market segments.
The `https://www.vodafone.nl/` uses an EV certificate that contains a stapled OCSP response.

I repeated all the same tests with the objective to answer the following question: 

**Does OCSP stapling help mitigate the web performance problems for EV certificates?**

This can also be phrased as: 

Does stapling the OCSP response to an EV certificate have a positive impact on website speed and reliability?

Let's first take a look at Chrome.

#### Chrome

<a href="https://www.webpagetest.org/result/191221_60_998bb5849721be8e2dd1f76fe2f44ed5/2/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-with-ocsp-staple-chrome-waterfall-small.png" width="530" height="199" alt="EV Certificate With OCSP Staple - Chrome - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

The EV certificate is stapled, but Chrome still checks the revocation status of the server/leaf certificate online. 

Interestingly, the status of the intermediate certificate is not checked online. I expected the browser to send an OCSP request to the root CA (here: DigiCert High Assurance EV Root CA) but it did not. Maybe the root certificate is in the local machine's trust store and Chrome got a positive response from that.  

The repeat view waterfall looks the same so it's clear Chrome does re-use revocation check responses from cache for stapled EV certificates:

<a href="https://www.webpagetest.org/result/191221_60_998bb5849721be8e2dd1f76fe2f44ed5/2/details/cached/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-with-ocsp-staple-chrome-repeatview-waterfall-small.png" width="530" height="199" alt="EV Certificate With OCSP Staple - Chrome - Repeat View - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

The next scenario I tested is the blackholed OCSP responder:

<a href="https://www.webpagetest.org/result/191221_5M_eb417fb68f2c4aa428cc6eb06375f2f1/" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-with-ocsp-staple-blocked-chrome-waterfall-small.png" width="530" height="199" alt="EV Certificate With OCSP Staple - Responder Blackholed - Chrome - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

This looks familiar 😞

Overall, Chrome behaves the same for stapled and non-stapled EV certificates.

Let's move on and find out if Firefox has different behaviour for EV certificates.

#### Firefox

New browser instance with empty cache:

<a href="https://www.webpagetest.org/result/191221_Y6_c0ec54f331942e07eb7fedee1cad9dca/2/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-with-ocsp-staple-firefox-waterfall-small.png" width="530" height="199" alt="EV Certificate With OCSP Staple - Firefox - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

This looks the same as the waterfall chart for Chrome.

But things get more interesting when we examine the repeat view test results:

<a href="https://www.webpagetest.org/result/191221_Y6_c0ec54f331942e07eb7fedee1cad9dca/2/details/cached/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-with-ocsp-staple-firefox-repeatview-waterfall-small.png" width="530" height="199" alt="EV Certificate With OCSP Staple - Firefox - Repeat View - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

No OCSP request!
Apparently, Firefox _does_ store "not revoked" OCSP responses in a local cache and re-uses these for some time.
That's good for performance, so +1 for Firefox.

Now let's see what happens in Firefox when we blackhole the OCSP responder:

<a href="https://www.webpagetest.org/result/191221_2F_f2b20f71fc722a1ca75003638775a4a4/2/details/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-with-ocsp-staple-blocked-firefox-waterfall-small.png" width="530" height="199" alt="EV Certificate With OCSP Staple - Responder Blocked - Firefox - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

This is the same behaviour as when the certificate does _not_ have the OCSP staple.

Repeat view:

<a href="https://www.webpagetest.org/result/191221_2F_f2b20f71fc722a1ca75003638775a4a4/2/details/cached/#waterfall_view_step1" class="no-styling">
	<img loading="lazy" class="responsive-ugh" src="/static/img/waterfall-charts/ev-cert-with-ocsp-staple-blocked-firefox-repeatview-waterfall-small.png" width="530" height="199" alt="EV Certificate With OCSP Staple - Responder Blocked - Firefox - Repeat View - Waterfall Chart">
</a>

<small class="graymedium">Click the image to navigate to the full WebPageTest results</small>

Here too Firefox behaves the same as for EV certificates _sans_ OCSP staple.


## <a name="take-aways"></a>Key Insights

Do you want your website to be fast and reliable? Don't use an EV certificate.

Even if the certificate has an OCSP staple ... Chrome _always_ sends a blocking request to the Certificate Authority's server when connecting to a website that uses an EV certificate and this request can take hundreds of milliseconds. 
To make things worse, if the CA's server is down, your users see an error page instead of your website.

Firefox also sends that blocking request every time the browser is establishing a new connection to your server, except when your EV certificate has a valid OCSP staple _and_ the browser has recently checked the cert's revocation status online with the CA _self_ (this is a bit weird). In other words: some returning visitors will benefit from the OCSP staple in your EV certificate but not new visitors for whom your site is slower and less reliable than it can be.

**For optimal web performance, serve an OCSP stapled DV certificate**: 
Chrome _never_ checks the revocation status with the CA for any DV certificate and Firefox won't either if the certificate is stapled.

Besides the performance benefits, DV certificates are also much cheaper than EV certificates and less hassle to acquire, so why even consider an EV certificate? 

Better security because site visitors have more trust in a website with an EV certificate? That argument is no longer valid as browsers don't show that 'green bar' anymore for EV certificates. 

## <a name="closing"></a>Closing Remarks

A big thanks to Ryan Sleevi for taking the time to provide me with a wealth of information about certificates, OCSP and performance. You rock!

For those interested in reading another lengthy article about SSL/TLS, OCSP and performance: [Matt Hobbs](https://twitter.com/TheRealNooshu) published an awesome article yesterday with the title "[The impact of SSL certificate revocation on web performance](https://nooshu.github.io/blog/2020/01/26/the-impact-of-ssl-certificate-revocation-on-web-performance/)". I highly recommend reading it. It's complementary to my article and provides a lot of information about topics like Chain of Trust and Certificate Revocation List.

<!-- "Hey Aaron, what about other browsers?"

Yes, valid question.

- The new Edge behaves the same as Chrome, as expected.
- There is a lot to say about Safari on iOS and I will add that to this article soon
- Internet Explorer: did not and will not spend my time on this
 -->

<!-- - Certificate size and initcwnd

You can also experience it self on local machine by adding an entry to the hosts file: <blackhole IP>	ocsp2.globalsign.com

- https://blog.cloudflare.com/high-reliability-ocsp-stapling/

---

- [WPT iPhone 8+](https://www.webpagetest.org/result/191206_KR_7de3efd6f4d72d27b0a910ed323e2f98/)
- WPT don't show the cert validation requests ... because SLEEVI SAYS: ... 

- [WPT - IE11](https://www.webpagetest.org/result/191206_KW_2f83d93760db081d6bf140259da65c70/)
- WPT don't show the cert validation requests: THIS IS A WPT THING?

[Safari on iPad 2017 iOS 12 - not sure setDnsName works ](https://www.webpagetest.org/result/191209_A7_735cbe9c631cdcaacffa63f4802b7003/1/details/#waterfall_view_step1)
[Edge Dev (Chromium) - not sure setDnsName works ](https://www.webpagetest.org/result/191209_GM_0a2fa5f68112b88777540dd7cd33bd9e/)
[IE11 - not sure setDnsName works ](https://www.webpagetest.org/result/191209_7X_5c8afa72bc43bb36b4a38394292a9325/) -->


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

-->

<!-- ---

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

 -->
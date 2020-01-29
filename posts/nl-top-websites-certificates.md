---
draft: true
permalink: /blog/state-of-ssl-tls-certificates-in-nl/index.html
title: The Sorry State of SSL/TLS Certificates in NL
description: The speed and reliability of most high-traffic/premium brand websites in NL suffers from their choice for the wrong type of SSL/TLS certiticate or server configuration.
title0: The Sorry State of SSL/TLS Certificates in NL.
title2: State of Web Performance in NL - Certificates
description1: Many high-traffic/premium brand websites in NL deliver a suboptimal user experience because 
description2: Analysis of 500 high-traffic/premium brand websites in NL. 62% are serving an SSL/TLS certificate that hurts the user experience.
summary: TODO
date: 2020-01-01
duration: 15
xhighlight: true
xtags:
  - webperf
  - ssl
  - tls
  - certificates
  - ocsp
  - research
  - nl
keyword: SSL/TLS Certificates NL Performance
---

During the past three months, I've researched the impact of the  _type_ of SSL/TLS certificate on website speed and reliability and the effectiveness of OCSP stapling. 

Two days ago, I published my research in the article [EV Certificates Make The Web Slow and Unreliable](https://www.aaronpeters.nl/blog/ev-certificates-make-the-web-slow-and-unreliable/), with the key take-aways being:

<!-- Two days ago, I published [EV Certificates Make The Web Slow and Unreliable](https://www.aaronpeters.nl/blog/ev-certificates-make-the-web-slow-and-unreliable/). The article describes my research into the impact of the  _type_ of SSL/TLS certificate on web performance and the effectiveness of OCSP stapling. The key take-aways  are: -->

<!-- - EV certificates are a _very_ bad choice from a web performance perspective
- Your best option is a DV certificate, served with a valid OCSP staple -->

<!-- - If you care about web performance, do not use an EV certificate
- Your best option is a DV certificate, served with a valid OCSP staple -->

- Do not use an EV certificate
- For optimal performance, serve a DV or OV certificate with a valid OCSP staple

<!-- Knowing the _type_ of certificate and OCSP stapling are important, I wanted to know what the big websites in NL are serving today. Are EV certificates popular?  -->

Having analyzed only a handful of Dutch websites in scope of my research, I was hungry for a bigger and better view on the state of SSL/TLS certificates in The Netherlands.

<!-- Still hungry for more data and insights, 
In scope of my research I analyzed a few NL websites and I was left hungry for more data and insights. I was especially interested in having a good view on the state of SSL/TLS certificates in The Netherlands. -->
<!-- Are EV certificates popular in NL? Do many NL sites serve their DV certificate with a stapled OCSP response? -->

I carefully created a list of 500 high-traffic/premium brand NL websites, wrote a script that collects data for each domain and took that data to Google Sheet for analysis and charting.

The spreadsheet made me sad 😢

**62% of the top NL websites serve a SSL/TLS certificate that hurts web performance**

Let's walk through the data.

<!-- ## <a name="a"></a>How collected the data

Bash script
For each website, run a few OpenSSL commands, store results in a local file 
Google Sheet

Has OCSP staple?

`echo QUIT | openssl s_client -servername www.cloudflare.com -connect www.cloudflare.com:443 -status 2> /dev/null | grep -A 17 'OCSP response:' | grep -B 17 'Next Update'`

If the certificate is _not_ stapled, the command will show _no_ output. -->


## Sadly, EV Certificates Are Quite Popular

Extended Validation certificates are relatively expensive, a hassle to acquire, don't make your site more secure _and_ since all modern browsers stopped showing the 'green bar' they also no longer provide users that 'enhanced perception of trust' (which is a myth anyway).

However, [EV certs _do_ make your website slower and less robust](/blog/ev-certificates-make-the-web-slow-and-unreliable/#ev-cert-perf), much more so than DV and OV certificates.

I expected maybe 10% of the big NL sites to serve an EV certificate, but unfortunately it's more than 2x that: 
<!-- **One out of four top NL websites uses an EV certificate**. -->

<img loading="lazy" class="responsive-ugh" src="/static/img/24percent-of-websites-have-an-ev-certificate.svg" width="548" height="339" alt="24 percent of top NL websites have an EV certificate">

Bol.com, Coolblue and HEMA are just a few of the big brands that serve the slow EV certificate.

## Stapling DV/OV Certificates is Not Very Common

The 76% of NL websites that don't use an EV certificate have made the right decision. 
[DV/OV certificates are the better choice from a web performance perspective](/blog/ev-certificates-make-the-web-slow-and-unreliable/#ev-cert-perf), even if the certificate does not have a stapled "not revoked" OCSP response.

That said, OCSP stapling _does_ add real value because in Firefox this effectively gets rid of a blocking request to the Certificate Authority's server very early in the page load process. This request easily takes 100 ms and for some visitors probably much longer.

Unless you're using a CDN that will do it for you, OCSP stapling doesn't just magically happen.
Activation/implementation requires time and effort.
Perhaps this is why **only half of the 381 websites that serve a DV or OV certificate have it stapled**.

<img loading="lazy" class="responsive-ugh" src="/static/img/50percent-of-dv-or-ov-certificates-are-not-ocsp-stapled.svg" width="548" height="339" alt="50% of top NL websites have an DV/OV certificate without OCSP staple">

Example websites that should put OCSP stapling on their to-do list are Wetransfer, Funda and TUI.

## Most of Top NL Websites Should Serve a Better Certificate

EV certificates are bad for web performance and so are non-OCSP stapled DV/OV certificates.

A simple calculation of (119 + 194)/500 shows **62% of the high-traffic/premium brand websites in NL have a 'bad performance' SSL/TLS certificate** !

<img loading="lazy" class="responsive-ugh" src="/static/img/62percent-of-websites-have-a-bad-performance-certificate.svg" width="548" height="339" alt="62 percent of top NL websites have a Bad Performance certificate">

<!-- ((313*25000)*0,1)/(60*60*24) -->

## Certificate Authorities Used By Top NL Websites

<img loading="lazy" class="responsive-ugh" src="/static/img/71percent-of-ev-certs-authored-by-sectigo-digicert-comodo.svg" width="548" height="339" alt="">

## <a name="closing"></a>Closing Remarks

---
draft: true
permalink: /blog/test/index.html
title: Analysis of HTTPS Certificates of Top NL Sites 
description: More than 50% of the top 500 high traffic/premium brand websites in NL have a 'bad performance' SSL/TLS certiticate. 
title0: NL Sites Suffer From Bad Performance Certificates
title1: The Sorry State of HTTPS Certificates in NL
title2: Most Top Websites in NL Have a Bad Performance Certificate
title3: State of Web Performance in NL - Certificates
title5: HTTPS Certificates in NL
description1: Analysis of 500 high traffic/premium brand websites in NL. How many have a 'bad performance' certiticate?
summary: TODO
twitterImage: "/static/img/s/"
date: 2020-01-29
duration: 15
xhighlight: true
xtags:
  - webperf
  - tls
  - certificates
  - ocsp
  - research
  - NL
keyword: HTTPS Certificates NL Performance
---

During the past three months, I've researched the impact of the  _type_ of SSL/TLS certificate on website speed and reliability and the effectiveness of OCSP stapling. 

Two days ago, I published my research in the article [EV Certificates Make The Web Slow and Unreliable](https://www.aaronpeters.nl/blog/ev-certificates-make-the-web-slow-and-unreliable/), with the key take-aways being:

<!-- Two days ago, I published [EV Certificates Make The Web Slow and Unreliable](https://www.aaronpeters.nl/blog/ev-certificates-make-the-web-slow-and-unreliable/). The article describes my research into the impact of the  _type_ of SSL/TLS certificate on web performance and the effectiveness of OCSP stapling. The key take-aways  are: -->

<!-- - EV certificates are a _very_ bad choice from a web performance perspective
- Your best option is a DV certificate, served with a valid OCSP staple -->

<!-- - If you care about web performance, do not use an EV certificate
- Your best option is a DV certificate, served with a valid OCSP staple -->

- Do not use an EV certificate
- For optimal performance, serve a DV certificate with a valid OCSP staple

<!-- Knowing the _type_ of certificate and OCSP stapling are important, I wanted to know what the big websites in NL are serving today. Are EV certificates popular?  -->

The research left me wondering what types of certificate the big websites in NL are serving today. 
Are EV certificates popular? Do many sites serve their DV certificate with a stapled OCSP response?

I carefully created a list of 500 high-traffic/premium brand NL domains and wrote a simple Bash shell script that stores the results of two OpenSSL commands in a tab-delimited file. Copy & paste into a Google Sheet, filter, sort, create charts ...

Let's look at the data!

<!-- ## <a name="a"></a>How collected the data

Bash script
For each website, run a few OpenSSL commands, store results in a local file 
Google Sheet

Has OCSP staple?

`echo QUIT | openssl s_client -servername www.cloudflare.com -connect www.cloudflare.com:443 -status 2> /dev/null | grep -A 17 'OCSP response:' | grep -B 17 'Next Update'`

If the certificate is _not_ stapled, the command will show _no_ output. -->


## Many NL Websites Use an EV Certificate

<img loading="lazy" class="responsive-ugh" src="/static/img/24percent-of-websites-have-an-ev-certificate.svg" width="548" height="339" alt="">

### 50% of DV/OV Certificates Are Not OCSP Stapled

<img loading="lazy" class="responsive-ugh" src="/static/img/50percent-of-dv-or-ov-certificates-are-not-ocsp-stapled.svg" width="548" height="339" alt="">

### 62% of Top NL Websites Have a 'Bad Performance' Certificate

<img loading="lazy" class="responsive-ugh" src="/static/img/62percent-of-websites-have-a-bad-performance-certificate.svg" width="548" height="339" alt="">

## <a name="c"></a>Certificate Authorities Used By Top NL Websites

<img loading="lazy" class="responsive-ugh" src="/static/img/71percent-of-ev-certs-authored-by-sectigo-digicert-comodo.svg" width="548" height="339" alt="">

## <a name="closing"></a>Closing Remarks

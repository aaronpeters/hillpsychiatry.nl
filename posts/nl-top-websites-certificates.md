---
draft: true
title: SSL/TLS Certificates of Top 500 NL Websites
title1: HTTPS Certificates of Top 500 NL Websites
description: Analysis of the SSL/TLS certificates of 500 high traffic / premium brand sites in The Netherlands. How many have a 'bad performance' certiticate?
summary: TODO
twitterImage: "/static/img/s/"
date: 2020-01-28
duration: 15
xhighlight: true
xtags:
  - webperf
  - tls
  - certificates
  - ocsp
  - research
  - NL
keyword: HTTPS Certificates NL
---

SEO optimized intro.

<div class="notice-msg info">
  Foo
</div>

Table of contents:

- [A](#a)
- [B](#b)

## <a name="a"></a>How collected the data

...

### Does the Certificate Have an OCSP Staple?

Before interpreting the WebPageTest results, you will want to know if the website's certificate contains a stapled OCSP response. You can't see this in the browser, but it's trivial to spot with OpenSSL:

`echo QUIT | openssl s_client -servername www.cloudflare.com -connect www.cloudflare.com:443 -status 2> /dev/null | grep -A 17 'OCSP response:' | grep -B 17 'Next Update'`

If the certificate is _not_ stapled, the command will show _no_ output.


## <a name="b"></a>EV Certificates Versus DV Certificates


### 24% of Top NL Websites Use an EV Certificate


### 50% of DV/OV Certificates Are Not OCSP Stapled


### 62% of Top NL Websites Have a 'Bad Performance' Certificate


## <a name="c"></a>Certificate Authorities Used By Top NL Websites


## <a name="closing"></a>Closing Remarks

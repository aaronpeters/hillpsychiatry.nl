---
draft: true
title: Analysis of HTTPS Certificates of Top NL Sites 
description: More than 50% of the top 500 high traffic/premium brand websites in NL have a 'bad performance' SSL/TLS certiticate. 
title0: NL Sites Suffer From Bad Performance Certificates
title1: The Sorry State of HTTPS Certificates in NL
title2: Most Top Websites in NL Have a Bad Performance Certificate
title3: "HTTPS Certificates in NL: "
description1: Analysis of 500 high traffic/premium brand websites in NL. How many have a 'bad performance' certiticate?
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
Make a few statements, link to the big EV cert perf article.

## <a name="a"></a>How collected the data

Bash script
For each website, run a few OpenSSL commands, store results in a local file 
Google Sheet

Has OCSP staple?

`echo QUIT | openssl s_client -servername www.cloudflare.com -connect www.cloudflare.com:443 -status 2> /dev/null | grep -A 17 'OCSP response:' | grep -B 17 'Next Update'`

If the certificate is _not_ stapled, the command will show _no_ output.


## Many NL Websites Use an EV Certificate

<img loading="lazy" class="responsive-ugh" src="/static/img/24percent-of-websites-have-an-ev-certificate.svg" width="548" height="339" alt="">

### 50% of DV/OV Certificates Are Not OCSP Stapled

<img loading="lazy" class="responsive-ugh" src="/static/img/50percent-of-dv-or-ov-certificates-are-not-ocsp-stapled.svg" width="548" height="339" alt="">

### 62% of Top NL Websites Have a 'Bad Performance' Certificate

<img loading="lazy" class="responsive-ugh" src="/static/img/62percent-of-websites-have-a-bad-performance-certificate.svg" width="548" height="339" alt="">

## <a name="c"></a>Certificate Authorities Used By Top NL Websites

<img loading="lazy" class="responsive-ugh" src="/static/img/71percent-of-ev-certs-authored-by-sectigo-digicert-comodo.svg" width="548" height="339" alt="">

## <a name="closing"></a>Closing Remarks

---
draft: true
title: EV Certificates are a Performance Killer
description: TODO
summary: TODO
date: 2019-01-01
xtags:
  - webperf
  - tls
  - certificate
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

- Relay42

### EV Certificates are a Reliability Risk

- https://www.kpn.com/



## Take-aways

**EV certificates hurt web performance**, provide no added value and are more expensive than regular certificates. Don't use EV certificates if you care about how reliable and fast your website is!

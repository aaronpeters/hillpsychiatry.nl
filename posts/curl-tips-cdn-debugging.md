---
draft: true
title: 10 Tips for CDN Debugging with Curl
description: TODO
summary: TODO
date: 2019-01-01
xtags:
  - webperf
  - tips
  - cdn
  - curl
---

Ideas:
- One short blog post for each tip, then create overview post
- See what tips the CDNs give, mention those too?

Keyword = 


Contents
1. do not use -I, but -svo /dev/null
2. 
3. follow redirects -L
4. set specific TLS version --tlsv1.3
5. save headers to local file --dump-header headers.txt
6. set request header(s) -H (user agent, host header)
7. send request to specific IP -H 'Host: <FQDN>' https://<IP> 
8. send request for compressed version of file --compressed or -H 'Accept-Encoding:gzip,deflate,br'
9. ?bypass the CDN
10. copy as cURL from Chrome Dev Tools 

https://www.cdnplanet.com/blog/cdn-debugging-tips-part-1/

## H2


## Take aways



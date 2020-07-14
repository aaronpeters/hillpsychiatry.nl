---
draft: true
title: Security Headers in Cloudflare Workers Sites
description: Simplicity. Ease of maintainance. Read how I implemented redirects in Cloudflare Workers Sites for CDN Planet (code included!).
summary: Recently, while rebuilding CDN Planet from scratch, I needed to figure out how to handle page redirects in Cloudflare Workers Sites. Read how I did it and view the code I have running in production.
date: 2020-07-15
duration: 3
highlight: true
tags:
  - webperf
  - cloudflare
  - workers
  - csp
  - headers
  - security
keyword: Cloudflare Workers Sites
XtweetId: '1277959553364094980'
---

[Cloudflare Workers Sites](https://workers.cloudflare.com/sites)
The worker script is in the `workers-site` folder, name `index.js`
All requests go through this script.

How to add security headers, including CSP, to HTML responses?
No need to add to stylesheets, images, scripts and other subresources.

## Approach to Generating Your CSP

- Read up on CSP, starting with the [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) documentation on MDN
- Browse through your site with Network panel in Dev Tools open to find out which domains are serving scripts, images, fonts, etc
- Create your content security policy (tip: use the tool at [Report URI](https://report-uri.com/home/generate))
- 
## Cloudflare Workers Sites Security Headers Code

``` js
// See the Workers Sites template for more info
// https://github.com/cloudflare/worker-sites-template/blob/master/workers-site/index.js
let response = await getAssetFromKV(event, options)

const request = event.request
if(request.headers.get('Accept').includes('text/html')){

  // Add new headers (CSP, Report-To, ...)
  newResponse = new Response(newResponse.body, newResponse) // TODO: fix this

  const userAgent = request.headers.get('User-Agent') || '' // TODO: remove, only needed for report-to
  const newHeaders = createNewHeaders(CSP, userAgent)

  Object.entries(newHeaders).forEach(([headerName, headerValue]) => {
    newResponse.headers.set(headerName, headerValue)
  })

  return newResponse
}

```

Bla bla explain the code above


``` js
function createNewHeaders(CSP, userAgent){
  // all security headers except CSP
  let newHeaders = {
    'strict-transport-security': 'max-age=31536000; includeSubDomains',
    'x-frame-options': 'SAMEORIGIN',
    'x-xss-protection': '1; mode=block',
    'x-content-type-options': 'nosniff'
  }
  
  // build the CSP header
  let cspHeaderValue = ""

  Object.entries(CSP).forEach(([directiveName, directiveValue]) => {
    cspHeaderValue += `${directiveName} ${directiveValue}; `
  })
  cspHeaderValue = cspHeaderValue.slice(0, -2) // remove last two characters

  // add the CSP header to the headers object
  newHeaders['content-security-policy'] = cspHeaderValue

  return newHeaders
}

const CSP = {
  "upgrade-insecure-requests": "",
  "default-src": "'self'",
  "style-src": "'self' 'unsafe-inline' https://platform.twitter.com https://ton.twimg.com",
  "font-src": "'self'",
  "script-src": "data: 'self' 'unsafe-inline' https://www.google-analytics.com https://platform.twitter.com https://syndication.twitter.com https://cdn.syndication.twimg.com",
  "connect-src": "'self' api.cdnplanet.com https://www.google-analytics.com",
  "img-src": "data: 'self' https://www.google-analytics.com https://platform.twitter.com https://syndication.twitter.com *.twimg.com",
  "frame-src": "https://platform.twitter.com https://syndication.twitter.com",
  "media-src": "*",
  "object-src": "'none'"
}

```

Explain code above

See it in action at www.cdnplanet.com

Screenshot of Dev Tools

## Use a Workers Sites Staging Environment

Deploy to staging, browse the site, spot errors in console, update your CSP, repeat.
Staging is easy with Workers Sites!

---

About a month ago, I rebuilt the entire [CDN Planet](https://www.cdnplanet.com/) website from scratch and decided to use Cloudflare Workers Sites (together with Eleventy of course, my favorite static site generator). 

[Cloudflare Workers Sites](https://workers.cloudflare.com/sites) is a great solution for anyone who needs to host a static site on a global CDN. The developer experience is great with [Wrangler CLI](https://developers.cloudflare.com/workers/tooling/wrangler) and starting at $5/month, Cloudflare Workers Sites is very affordable.

The old CDN Planet site lived in Google Cloud Platform and the Nginx server config had several rules to handle redirects. Most redirects existed because a CDN changed its name (Bitgravity &gt; Tata Communications) or got acquired (Highwinds &gt; StackPath).

All redirects needed stay in place, so the question was: **how best implement redirects in Cloudflare Worker Sites?**

After putting a little bit of thought into it, the actual implementation was easy and works like a charm.

## Keep It Simple

My list of requirements for handling website redirects:

- Easy to see which redirects are currently active
- Easy to add/edit/remove redirects
- Easy to read and understand the code

Cloudflare has a template gallery with example code for Workers. 
The gallery has two snippets for redirects, being [Redirect](https://developers.cloudflare.com/workers/templates/pages/redirect/) and [Bulk Redirects](https://developers.cloudflare.com/workers/templates/pages/bulk_redirects/). 
Neither satisfied my needs, so I wrote my own:

## Cloudflare Workers Sites Redirects Code

``` js
async function handleEvent(event) {
  const url = new URL(event.request.url)

  // Redirects
  const redirects = {
    'bitgravity': 'tata-communications',
    'highwinds': 'stackpath',
    'maxcdn': 'stackpath',
    'netdna': 'stackpath',
    'level3': 'centurylink',
    '/blog/feed/': '/blog/feed.xml',
    '/blogdef/': '/social/blog/',
    '/geodef/': '/social/geo/',
    '/guidedef/': '/social/guides/',
    '/blog/akamai-down/': '/blog/'
  }

  for (const source in redirects) {
    if (url.pathname.includes(source)) {
      const target = new URL(url.href.replace(source, redirects[source]))
      return Response.redirect(target, 301)
    }
  }
  
  // Rest of the code to handle all other requests
}
```

Every request that Cloudflare receives for anything on `https://www.cdnplanet.com` goes through the function `handleEvent`, even requests for static assets. That's the way Cloudflare Workers Sites works.

The function `handleEvent` takes the incoming fetch event and defines a new variable `url` from the event's `request` property. Next, the Worker iterates over the properties of the `redirects` object. 
If a property is found in the path of the incoming request URL, a new target URL is constructed using the [replace method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) and a 301 redirect response is served to the browser.

This works great for URLs that need a _single_ find & replace, but fails for URLs that need multiple string replacements. Maybe, just maybe, other sites link to very old 'compare' pages on CDN Planet, like `https://www.cdnplanet.com/compare/level3/highwinds/`. We'd like to redirect the user to `https://www.cdnplanet.com/compare/centurylink/stackpath/`. 

A few changes to the code are sufficient to handle these cases well too:

## Improved Code for Cloudflare Workers Sites Redirects

``` js
async function handleEvent(event) {
  const url = new URL(event.request.url)

  // Redirects
  const redirects = {
    'bitgravity': 'tata-communications',
    'highwinds': 'stackpath',
    'maxcdn': 'stackpath',
    'netdna': 'stackpath',
    'level3': 'centurylink',
    '/blog/feed/': '/blog/feed.xml',
    '/blogdef/': '/social/blog/',
    '/geodef/': '/social/geo/',
    '/guidedef/': '/social/guides/',
    '/blog/akamai-down/': '/blog/'
  }

  let target = null
  
  for (const source in redirects) {
    if (url.pathname.includes(source)) {
      if(target == null){
        target = new URL(url.href)
      }
      target = new URL(target.href.replace(source, redirects[source]))
    }
  }

  if (target != null){
    return Response.redirect(target, 301)
  }
  
  // Rest of the code to handle all other requests
}
```

Instead of serving the 301 redirect after finding a first match in the `redirects` object, the Worker now iterates over _every_ property and updates the `target` every time the property is found in the URL.

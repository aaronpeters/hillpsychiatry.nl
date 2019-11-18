---
title: Optimized JS snippet for Firebase Performance Monitoring
description: Learn about the problems with the default code snippet for Firebase Performance Monitoring for Web and grab your copy of the optimized version.
summary: Find out why the default code snippet for Firebase Performance Monitoring for Web is suboptimal for performance, and grab your copy of the optimized snippet.
date: 2019-07-15
tags:
  - webperf
  - monitoring
  - rum
  - 3pc
  - google
  - firebase
  - javascript
  - async
  - defer
---

At Google I/O 2019, Google announced the beta release of Firebase Performance Monitoring for Web, a free service that helps you gain insight into the performance characteristics of your website / web app.

Firebase Performance Monitoring for Web collects performance data from within the browser, so you have to add a small JS snippet to your app / pages.

Although the snippet provided by Google works as intended, it is not as good as it can and should be.

In this article I'll outline the problems with Google's snippet and present the optimized JS snippet for Firebase Performance Monitoring for Web.


## The default Firebase JS snippet

The [Get started with Performance Monitoring for web](https://firebase.google.com/docs/perf-mon/get-started-web) page outlines the steps to take to get up & running with Firebase Performance Monitoring for Web. If you're not using other Firebase products in your app you'll need to grab the JS snippet that loads the standalone SDK.

Here's that snippet:

<pre>
<code class="language-html">&lt;script&gt;</code><code class="language-javascript">
(function(sa, fbc) {
  function load(f, c) {
    var a = document.createElement('script');
    a.async = 1;
    a.src = f;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(a, s);
  }
  load(sa);
  window.onload = function() {
    firebase.initializeApp(fbc).performance();
  };
})(performance_standalone, firebaseConfig);
</code><code class="language-html">&lt;/script&gt;</code>
</pre>

where 
* performance_standalone is the URL of the standalone SDK (the JS file), currently `https://www.gstatic.com/firebasejs/6.3.0/firebase-performance-standalone.js`
* firebaseConfig is your app's [Firebase config object](https://firebase.google.com/docs/web/setup#config-object)

The Firebase documentation states "Add the following script to the header of your index file".
<!-- <div class="notice-msg info">
	Using other Firebase products in your app? Use the standard SDK instead of the standalone SDK in this snippet. More info is [here](https://firebase.google.com/docs/perf-mon/get-started-web#add-sdks_initialize)
</div> -->


### Problems with this snippet

#### SDK loads in browsers where it will do nothing

The SDK for Firebase Performance Monitoring for Web uses the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), a modern replacement for XMLHttpRequest.

[Fetch is not in Internet Explorer](https://caniuse.com/#search=fetch), so it's pointless to load the SDK in IE.

#### Download of the SDK starts too soon

The browsers starts downloading the SDK as soon as it executes the snippet: the browser evaluates <code>load(sa)</code> and the download starts right away.

By placing the default snippet high up in the HTML (in the <code>&lt;head&gt;</code>), the SDK download starts early in the page load process and consumes some of the available bandwidth, leaving less bandwidth to download other, more important content and scripts.

Consequently, those other more important content and scripts will finish downloading later and this delays the loading and rendering of the page.

My advice is to defer the downloading of third party scripts until after the page has completely loaded (the load event has fired).

#### Poor man's hook into the 'page is done loading' event
TODO
or: Risk of monitoring not starting when snippet injected into page with a tag manager
what if the snippet is injectect with a tag manager and executes after onload? The SDK will be fetched, but the monitoring will not initialize (because that is triggered by window.onload).



## Optimized Firebase JS snippet

The optimized snippet below fixes all the problems mentioned in the previous section:

- do nothing in unsupported browsers
- don't load the JS file before the page has finished loading: even though it loads async, it is best to delay it's loading until after onload because a) browser can use available bandwidth to load more important resources, b) async loaded scripts delay the load event
- ensure the snippet works in case it executes before or after the page has finished loading (load event)
- pass window and document into function to prevent the snippet from looking it up in the DOM more than once
- improve code readability: remove trailing semicolons, declare variables in the function call instead of inside the function


<pre>
<code class="language-html">&lt;script&gt;</code><code class="language-javascript">
&lt;script&gt;
(function(win, doc, sa, fbc) {

  if(!win.fetch){ // do nothing if browser does not support the Fetch API
    return;
  }

  function load(f, c, a, s) {
    a = doc.createElement('script');
    a.async = 1;
    a.src = f;
    a.addEventListener('load', (function(){ 
      firebase.initializeApp(fbc).performance();
    }))
    s = doc.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(a, s);
  }

  if (doc.readyState !== 'complete') { // page has not finished loading yet, so add a listener for the 'load' event
    win.addEventListener('load', (function(){
      load(sa);
    }), false)
  } else { // page finished loading, so fetch the script immediately
    load(sa);
  }

})(window, document, performance_standalone, firebaseConfig)
</code><code class="language-html">&lt;/script&gt;</code>
</pre>

where 
* performance_standalone is `https://www.gstatic.com/firebasejs/6.3.0/firebase-performance-standalone.js`
* firebaseConfig is your app's [Firebase config object](https://firebase.google.com/docs/web/setup#config-object)


## Place the snippet in the top of the HEAD

Where to best place the Firebase JS snippet in your HTML? 

Unfortunately, Firebase does not give specific instructions. The documentation simply states "Add the following script to the header of your index file".

From a performance perspective, it matters greatly _where_ in the <code>&lt;head&gt;</code> you place the JS snippet.
Inline JS in the <code>&lt;head&gt;</code> that comes _after_ CSS (inline or external) blocks parsing of the document until all the CSS has been downloaded and processed.

So, put the Firebase JS snippet _before_ any inline or external CSS.


## Takeaways

* Do not assume a snippet provided by a third party is optimized for performance
* Defer the loading of third party scripts until after the load event (even if loaded async)
* Inline JS should go in the top of <code>&lt;head&gt;</code> (before CSS)
* Ensure your snippet always references the latest version of the standalone SDK: check the Firebase Performance Monitoring web site regularly



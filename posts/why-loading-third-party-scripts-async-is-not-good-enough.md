---
title: Why loading third party scripts async is not good enough
description: Defer loading third party (async) scripts until after onload, for better, more meaningful page load time data
summary: Loading third party scripts async is key for having high performance web pages, but those scripts still block onload. Take the time to analyze your web performance data and understand if and how those not-so-important content/widgets/ads/tracking codes impact page load times. Maybe you should do what we did on CDN Planet → defer their loading until after onload.
date: 2011-11-23
tags:
  - webperf
  - javascript
  - async
  - 3pc
---

<div class="notice-msg info">
	This article is quite old but the key message still stands: try to load your third party scripts late.
</div>

Loading third party scripts async is key for having high performance web pages, but those scripts still block onload. Take the time to analyze your web performance data and understand if and how those not-so-important content/widgets/ads/tracking codes impact page load times. Maybe you should do what we did on CDN Planet: defer their loading until after onload.

Let me start with two statements I feel strong about:

1. Measuring page load times is useful because it gives you insight in an important dimension of the user experience
2. In order to gain useful, actionable insight from your web performance data, you need a very good understanding of how the data is collected and what exactly is measured

In other words: if you don't know what your page load time data actually means, the data is useless and you have no idea how site speed impacts your users.

This article is about loading third party async scripts after onload, yes, but the key message really is: make sure you truly understand your web performance data.

## Case: CDN Planet, async scripts and New Relic

On October 3 2011, [Sajal Kayan](https://www.sajalkayan.com/) and I launched [CDN Planet](https://www.cdnplanet.com/), a new site packed with information about Content Delivery Networks. Our mission: help people select the right CDN.

Being WPO consultants we of course made a big effort to make CDN Planet fast. Our goal: the average page page load time must be &lt;2 seconds for 95% of all page views.<br>
Before we launched we did some tests on Webpagetest.org and we believed we could reach that goal. After launch, we continued to run ad hoc tests on Webpagetest.org, usually when we published a new blog post or changed something on a page. But to be honest, we had not been closely monitoring page load times. Shame on us.

To get a grip on CDN Planet performance, we recently started using New Relic, a performance monitoring service we heard great stories about. Our objective was to have easy access to high quality, actionable performance data for our website.<br>
We got a free, 14 day Pro account and set up the monitoring: Application, End-User and Server monitoring. We were immediately happy campers: the average response time for our web server was ~20ms. Yeah!<br>
But then the first weekly report came in via email and I saw this:

<img src="/static/img/new-relic-cdnplanet-weekly-report.png" width="247" height="148" alt="New Relic weekly report screenshot">

3.8 seconds average page load time? 11.5% of page views took between 7 and 28 seconds to load and 1.8% was slower than 28 seconds? For us, this is Code Red.

I logged in to the online reports and looked at lots of data in New Relic.
What caught my eye was the data in the new Browser traces reports, which give insight in individual page views.

<img src="/static/img/new-relic-cdnplanet-browser-traces.png" width="559" height="370" alt="New Relic browser traces">

Obviously, this data shocked me. An occassional 10 second page load time is to be expected, but 100 seconds is ridiculous. How is this possible?<br>
The CDN Planet server runs on EC2 (US East region) and CDN Planet uses NetDNA now as a CDN for static assets, which are very few per page. We believe it is unlikely the requests to EC2 or NetDNA are causing these extremely high load times. And so, we digged deeper by looking at individual browser traces, for example:

<img class="img-a" src="/static/img/new-relic-cdnplanet-browser-trace-blogpost.png" width="562" height="243" alt="New Relic browser trace">

Uhh ... 90 seconds for Page Rendering? The HTML is small and the CSS file too. Rendering time should be quite low. All JS in the page is third party and loads async. Can that cause the high rendering time as measured by New Relic? Yes, it can. While the browser is executing the JavaScript and this happens before onload, this time is too counted as Page Rendering.

Conclusion: the loading, parsing and executing of the async third party scripts are quite often very slow and this messes up our End User performance stats in New Relic.

Read the next two sections to better understand how async scripts impact <code class="language-javascript">window.onload</code>.

## Old situation: load third party scripts async

On all pages on CDN Planet, the following third party scripts are loaded:

* Facebook Like button
* Google Plus button
* Twitter Share &amp; Follow button (they require the same JS file)
* Twitter Tweet Box
* Google Analytics

The Tweet Box always started loading after onload, so that is out of scope in this article. Google Analytics is loaded using the asynchronous tracker and placed high up in the HEAD section of the HTML. The GA script does not load other files and therefore has minimal risk of delaying onload. For optimal performance, the other 3 scripts are loaded using Stoyan Stefanov's hyper-optimized <a href="http://www.phpied.com/social-button-bffs/">Social button BFFs</a> code, placed at the bottom of the BODY of the HTML:

<pre>
<code class="language-html">&lt;script&gt;</code><code class="language-javascript">
(function(d, s) {
  var js, fjs = d.getElementsByTagName(s)[0], load = function(url, id) {
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.src = url; js.id = id;
    fjs.parentNode.insertBefore(js, fjs);
  };
  load('//connect.facebook.net/en_US/all.js#appId=272697932759946&xfbml=1', 'fbjssdk');
  load('https://apis.google.com/js/plusone.js', 'gplus1js');
  load('//platform.twitter.com/widgets.js', 'tweetjs');
}(document, 'script'));
</code><code class="language-html">&lt;/script&gt;</code>
</pre>

On CDN Planet blog post pages an extra third party script is loaded, asynchronously,  to enable reading and posting comments, powered by Disqus.

Now, let's take a look at how these scripts impact page load times.

We ran several tests for the <a href="https://www.cdnplanet.com/">CDN Planet homepage</a> on Webpagetest.org: IE9, New York, DSL, empty cache. 
The waterfall chart below is the median of 10 runs. Requests 10 - 43 are not shown to keep the chart image small.

<img class="img-a" src="/static/img/waterfall-IE8-cdnplanet-3rdparty-scripts-async-before-onload.png" width="660" height="308" alt="Third party scripts async NOT after onload - IE8 empty cache - waterfall chart" title="Third party scripts async NOT after onload - IE8 empty cache - waterfall chart"><br>
<a href="https://www.webpagetest.org/result/111121_RP_b8b9a13ca2b55f3abf5f7dc252e3dfe2/5/details/">View full test results on Webpagetest.org</a>

The page finished loading at 3.6 seconds, as indicated by the vertical blue bar. Either the sprite.png (Google Plus) or xd_proxy.php object (FB Like button) needed to finish first before the load event fired. That may surprise you, because the initial JS files are loaded async, right!? Yes, but script-inserted scripts that are inserted into the DOM by <code class="language-javascript">appendChild</code> or <code class="language-javascript">insertBefore</code> do delay <code class="language-javascript">window.onload</code>. And that is not all. If that initial script-inserted, async loaded script loads another file then that other file delays onload too. The FB Like button needs 8 files, the Google Plus button needs 7 files and the Twitter Share &amp; Follow buttons need 6 files (all when the visitor is not signed in to the social network). Yes, some of these files load in parallel, but definitely not all. As you will find out in the next section, <strong>these async buttons delay onload a lot</strong>.

## New situation: load third party scripts async, after onload

We changed Stoyan's code a bit to make the social sharing buttons start loading after onload:

<pre>
<code class="language-html">&lt;script&gt;</code><code class="language-javascript">
(function(w, d, s) {
  function go(){
    var js, fjs = d.getElementsByTagName(s)[0], load = function(url, id) {
	  if (d.getElementById(id)) {return;}
	  js = d.createElement(s); js.src = url; js.id = id;
	  fjs.parentNode.insertBefore(js, fjs);
	};
    load('//connect.facebook.net/en_US/all.js#appId=272697932759946&xfbml=1', 'fbjssdk');
    load('https://apis.google.com/js/plusone.js', 'gplus1js');
    load('//platform.twitter.com/widgets.js', 'tweetjs');
  }
  if (w.addEventListener) { w.addEventListener("load", go, false); }
  else if (w.attachEvent) { w.attachEvent("onload",go); }
}(window, document, 'script'));
</code><code class="language-html">&lt;/script&gt;</code>
</pre>

Here's the new waterfall chart for the CDN Planet homepage, again using IE9 from New York on a DSL connection and empty browser cache:

<img class="img-a" src="/static/img/waterfall-IE8-cdnplanet-3rdparty-scripts-async-after-onload.png" width="660" height="274" alt="Third party scripts async after onload - IE8 empty cache - waterfall chart" title="Third party scripts async after onload - IE8 empty cache - waterfall chart"><br>
<a href="https://www.webpagetest.org/result/111121_1V_7b77cefeaf978767b2aed6de20590145/10/details/">View full test results on Webpagetest.org</a>

Time to First Byte and Start Render are of course not impacted, but the total page load time sure is: <strong>Doc Complete dropped from 3.63 seconds to 1.14 seconds (-68%)</strong>.<br>
The question is: does this 1.14 seconds better reflect the user experience? In our opinion, yes. At that 1.14 second mark, all content has finished loading and is displayed on screen. The only stuff that comes after that are the aforementioned social sharing buttons and the Twitter Tweet Box (and on a blog post page, the Disqus comments would also come in late). We believe it is fine those buttons load and display some time after onload, because most likely, our site visitors will not want to use the buttons until after using/reading the actual content. 

We are happy with the change we made. We now have better, more useful web performance stats in New Relic. The data is no longer impacted by the (fluctuating) performance of third party widgets that are at best considered secondary content/functionality.

## Takeaways

* Zoom in on your web performance data. Averages hide a lot of information. You need to look closely and think hard, for true insight
* Async scripts block onload and may have a big impact on your page load time data
* Load (some of) those scripts after onload to increase the usefullness of your web performance data
* New Relic is great: good data and an easy to use UI



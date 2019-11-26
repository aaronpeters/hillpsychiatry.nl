---
title: Iframe Loading Techniques and Performance
description: Overview of different ways to use an iframe for loading content, ads & widgets. How does each technique affect performance?
summary: Overview of different ways to use an iframe for loading content, ads & widgets. Which technique is best for performance?
date: 2010-12-20
tags:
  - iframe
  - tips
---

<div class="notice-msg warning">
	This article is 9+ years old. Do not assume any recommendations are still valid today. And my old test pages are broken (404).
</div>

<div class="notice-msg info">
Iframe setTimeout() does not work in IE9.<br>
Chad Barnsdale of <a href="https://www.unfinishedman.com/">Unfinishedman.com</a> mentioned to me on May 25 that the Iframe setTimeout() technique does not work in IE9. And he was right. 
The file that gets loaded into the iframe simply does not load. Nothing happens. I will dive into this sometime soon. It's probably something small with the JavaScript code.
</div>

Iframes are often used to load third party content, ads and widgets.
The main reason to use the iframe technique is that the iframe content can load in parallel with the main page: it doesn't block the main page.
Loading content in an iframe does however have two downsides, as Steve Souders outlines in his blog post [Using Iframes Sparignly](http://www.stevesouders.com/blog/2009/06/03/using-iframes-sparingly/)
- Iframes block onload of the main page
- The main page and iframe share the same connection pool

The onload blocking is the biggest problem of the two and hurts performance the most.
You really want the load event to fire as soon as possible, for optimal user experience of course but also because of how Google measures your site speed: Google Toolbar in IE and FF browsers of site visitors measures time to onload.

## How can you load an iframe without blocking onload and as a result improve page performance?

This article shows 4 ways to load an iframe in a web page: [Normal Iframe](#normal), [Iframe After Onload](#onload), [Iframe setTimeout()](#settimeout) [Dynamic Asynch Iframe](#dynamic). For each the behaviour related to the load event is described and shown by way of IE8 waterfall charts.
I recommend to look closely at the Dynamic Asynch Iframe technique because this one is great for performance.
Oh, and as a bonus, I throw in the [Friendly Iframe technique](#fif). It doesn't really qualify as an iframe <i>loading</i> technique, but it has to do with iframes, ads and (non)-blocking.

## <a name="normal"></a>Normal Iframe

You all know this one. It's the default way to load an iframe and works in all browsers:

<pre>
<code class="language-html">
&lt;iframe src="/path/to/file" frameborder="0" width="728" height="90" scrolling="auto"&gt;
&lt;/iframe&gt;
</code>
</pre>

Using the Normal Iframe technique will result in the following behaviour in all browsers:

- Iframe starts loading <i>before</i> onload of main page
- Onload of the iframe fires after all iframe content is done loading
- Onload of main page fires *after* the iframe's onload fires: the iframe blocks the main page onload !
- While the iframe is loading, one or more browser busy indicators show something is loading

I created a simple test page and ran it through Webpagetest.org (IE7 and IE8).
The waterfall chart below clearly shows how the Normal Iframe blocks the main page onload.

<a class="no-styling" href="/static/img/waterfalls-charts/normal-iframe-IE8-waterfall-big.png">
	<img class="responsive-ugh" src="/static/img/waterfalls-charts/normal-iframe-IE8-waterfall-small.png" width="660" height="121" alt="Normal Iframe - Performance - IE8 waterfall chart" title="Normal Iframe - Performance - IE8 waterfall chart">
</a>

<small>Click image for a bigger version</small>

My advice: be aware of the onload blocking. It's not a big problem if the iframe content takes a short time to load (and execute), and the iframe in itself is good to use because it loads in parallel with the main page. 
But if it takes long for the iframe to finish, the user experience is damaged.
Test it on your page(s) and run it through Webpagetest.org a few times, look at the impact on onload (Doc Complete time) and decide if you need a better technique.

## <a name="onload"></a> Iframe After Onload

Imagine you want to load something in an iframe, but it's not really important for the page. 
Or the content of the iframe is not immediately visible to the user because it's way down below the fold or hidden behind a link/tab. 
Consider deferring the loading of the iframe until after the main page is done.

<pre>
<code class="language-javascript">
&lt;script&gt;
//doesn't block the load event
function createIframe(){
  var i = document.createElement("iframe");
  i.src = "path/to/file";
  i.scrolling = "auto";
  i.frameborder = "0";
  i.width = "200px";
  i.height = "100px";
  document.getElementById("div-that-holds-the-iframe").appendChild(i);
};
	
// Check for browser support of event handling capability
if (window.addEventListener)
window.addEventListener("load", createIframe, false);
else if (window.attachEvent)
window.attachEvent("onload", createIframe);
else window.onload = createIframe;
&lt;/script&gt;</code>
</pre>

The Iframe After Onload technique will consistently show the following behaviour in all browsers:

- Iframe starts loading <i>after</i> onload of main page
- Onload of main page fires without interference of the iframe: the iframe does *not* block the main page onload !
- While the iframe is loading, one or more browser busy indicators show something is loading

I ran some tests with my Iframe After Onload test page on Webpagetest.org (IE7 and IE8): as expected, onload is not blocked:

<a class="no-styling" href="/static/img/waterfalls-charts/iframe-after-onload-IE8-waterfall-big.png">
	<img class="responsive-ugh" src="/static/img/waterfalls-charts/iframe-after-onload-IE8-waterfall-small.png" width="660" height="121" alt="Iframe After Onload - Performance - IE8 waterfall chart">
</a>

<small>Click image for a bigger version</small>

What do you gain by this versus the Normal Iframe?
The load event of the main page fires sooner, and this has 2 benefits:

- Other code waiting for the load event can load/execute sooner
- Google Toolbar measures a much lower Time to Onload, which helps improve Google's perception of your site speed

Unfortunately, your site visitors will still see browser busy indicator(s) while the iframe is loading and that means that they will see those indicators for a longer period of time (versus Normal Iframe). 
Another downside of loading the iframe after onload is that there is a bigger chance the user leaves the page before the iframe has finished loading. In some cases this may be a real problem, e.g. you have a deal with a ad/widget provider that is based on # impressions.

## <a name="settimeout"></a> Iframe setTimeout()

The objective is to load the iframe without blocking onload. 
Steve Souders (him again) published a <a href="http://stevesouders.com/efws/iframe-onload-nonblocking.php">demo page</a> for this 'trick' some time ago.
He writes:

_"the SRC is set dynamically in a function called via setTimeout. This technique avoids the blocking behavior of iframes in all browsers"_.

And that is not 100% true. I did several tests with his demo page in many browsers and found out that <a href="http://www.webpagetest.org/result/100915_50EA/">in IE8</a> - but <a href="http://www.webpagetest.org/result/101217_NJ_3955cfb454bdbc99d1128aedb68bd0b6/">not in IE7</a> (!?) - the main page onload *is* blocked on first visit (empty cache), but not on subsequent visits (primed cache). I saw the same results on my own little test page. Conclusion: this technique will often _not_ have the desired effect in IE8, a popular browser. Too bad!

<pre>
<code class="language-html">&lt;iframe id="iframe1" src="" width="200" height="100" border="2"&gt;&lt;/iframe&gt;</code>
<code class="language-javascript">&lt;script&gt;
function setIframeSrc() {
  var s = "path/to/file";
  var iframe1 = document.getElementById('iframe1');
  if ( -1 == navigator.userAgent.indexOf("MSIE") ) {
    iframe1.src = s;
  }
  else {
    iframe1.location = s;
  }
}
setTimeout(setIframeSrc, 5);
&lt;/script&gt;</code>
</pre>

In all browsers but IE8, the Iframe setTimeout() technique will consistently show the following behaviour:

Iframe starts loading <i>before</i> onload of main page
- Onload of the iframe fires after all iframe content done loading
- Onload of main page fires soon: the iframe does *not* delay the 
main page onload (note: except in IE8 with empty cache)
- Why does the iframe not block main page onload in all-but-IE8 browsers? Because of the <code>setTimeout()</code>
- While the iframe is loading, one or more browser busy indicators show something is loading

I ran tests on Webpagetest.org (IE7 and IE8) with [Iframe After Onload test page A](/static/testpages/iframe-settimeout.htm) and [Iframe After Onload test page B](/static/testpages/iframe-non-blocking.htm): all is fine in IE7, onload is blocked on first view in IE8.

<a class="no-styling" href="/static/img/waterfalls-charts/iframe-settimeout-IE8-waterfall-big.png">
	<img class="responsive-ugh" src="/static/img/waterfalls-charts/iframe-settimeout-IE8-waterfall-small.png" width="660" height="257" alt="Iframe setTimeout - Performance - IE8 waterfall chart" title="Iframe setTimeout - Performance - IE8 waterfall chart">
</a>

<small>IE8 first view. Click image for a bigger version</small>

<a class="no-styling" href="/static/img/waterfalls-charts/iframe-settimeout-IE8-repeat-waterfall-big.png">
	<img class="responsive-ugh" src="/static/img/waterfalls-charts/iframe-settimeout-IE8-repeat-waterfall-small.png" width="660" height="70" alt="Iframe setTimeout - Performance - IE8 Repeat View waterfall chart" title="Iframe setTimeout - Performance - IE8 Repeat View waterfall chart">
</a>

<small>IE8 repeat view (note: my HTML is cached for 10 minutes, so only iframe content is reloaded). Click image for a bigger version</small>

Because of the IE8 issue I believe this technique is not usable in production for many sites. If more than 10% of your visitors have IE8, 1 in 10 will get a lesser experience. You could argue that it's only worse compared to the Normal Iframe technique which isn't a really bad for performance anyway. And onload firing later for 10% of your users ... ah well. You decide, but not after you read below about the ultra awesome Dynamic Asynch Iframe-technique. 

## <a name="dynamic"></a> Dynamic Asynch Iframe

When I was at the [Velocity 2010 web performance conference](https://conferences.oreilly.com/velocity/velocity2010), two Meebo engineers [@marcuswestin](http://twitter.com/marcuswestin) and [Martin Hunt](http://www.linkedin.com/pub/martin-hunt/4/542/472)) gave a [presentation](https://conferences.oreilly.com/velocity/velocity2010/public/schedule/detail/13070) about the new Meebo Bar and how they improved this widget's performance. They came up with a truly non-blocking, instantly loading technique for including their widget in a page, using an iframe. For many web developers, their 'dynamic asynch iframe' approach was new. And it's awesome. Double awesome. For some reason, this technique has not gotten the attention it deserves. I hope this blog post can help spread the word.

<pre>
<code class="language-javascript">
&lt;script&gt;
(function(d){
  var iframe = d.body.appendChild(d.createElement('iframe')),
  doc = iframe.contentWindow.document;

  // style the iframe with some CSS
  iframe.style.cssText = "position:absolute;width:200px;height:100px;left:0px;";
  
  doc.open().write('&lt;body onload="' + 
  'var d = document;d.getElementsByTagName(\'head\')[0].' + 
  'appendChild(d.createElement(\'script\')).src' + 
  '=\'\/path\/to\/file\'"&gt;');
  
  doc.close(); //iframe onload event happens

  })(document);
&lt;/script&gt;
</code>
</pre>

The magic is in the <code>&lt;body onload=""&gt;</code>: the iframe has no content initially, so onload of the iframe fires instantly. Then, you create a new script element, set its source to the JS file that loads the content/ad/widget, append the script to the HEAD and voila: the iframe content loads without blocking the main page onload!

You should see the following behaviour of the Dynamic Asynch Iframe technique consistently in all browsers:
- Iframe starts loading <i>before</i> onload of main page
- Onload of the iframe fires instantly, because the iframe content is loaded after onload (yeah!)
- Onload of main page fires without interference of the iframe: the iframe does *not* block the main page onload !
- Why does the iframe not block main page onload? Well, that is because of the <code>&lt;body onload=""&gt;</code>
- If you would *not* use the onload handler in the iframe, the iframe loading would delay the main page onload
- While the iframe is loading, *no* browser busy indicators are active (yeah!)

My [Dynamic Asynch Iframe test page](http://www.aaronpeters.nl/blog/testpages/iframe-dynamic-asynch.htm) gave this result on Webpagetest.org (IE8):

<a class="no-styling" href="/static/img/waterfalls-charts/iframe-dynamic-asynch-IE8-waterfall-big.png">
	<img class="responsive-ugh" src="/static/img/waterfalls-charts/iframe-dynamic-asynch-IE8-waterfall-small.png" width="660" height="121" alt="Iframe Dynamic Asynch - Performance - IE8 waterfall chart" title="Iframe Dynamic Asynch - Performance - IE8 waterfall chart">
</a>

<small>Click image for a bigger version</small>

Espacing characters makes it more difficult to read and error prone, but in my opinion these are minor cons.
Do give this technique a try and post a comment if it works, or doesn't.

## <a name="fif"></a> Friendly Iframe

This technique is for ads. It's not really an iframe loading technique, but more of a way to use an iframe to hold ads. The magic is not in how the iframe is loaded, but in how the main page, the iframe and ad codes work together. It works like this:

- Create an iframe. Set the source to a small static html page from the same domain
- Inside the iframe, set the JavaScript variable inDapIF = true to tell the ad it is loaded inside a friendly iframe
- Inside the iframe, create an script element with the ad url as the source. Load the ad just like a normal JavaScript ad
- When the ad has finished loading, resize the iframe to fit the dimensions of the ad.

The Friendly Iframe works in all browsers.

The Ad Ops Council of the IAB has been recommending this technique since October 2008 as per their [Best Practices for Rich Media Ads in Asynchronous Ad Environments](http://www.iab.net/media/file/rich_media_ajax_best_practices.pdf) (PDF). 
AOL uses this technique and Dave Artz of AOL describes it in his Velocity 2009 presentation: [download PDF](http://assets.en.oreilly.com/1/event/29/The%20Secret%20Weapons%20of%20the%20AOL%20Optimization%20Team%20Presentation.pdf).
Wanna see code? Dave has a [Friendly Iframe test page](http://www.artzstudio.com/files/fif-demo/) on his blog.
Aftonbladet - a large publisher in Sweden - had good results with the Friendly Iframe: on their Homepage, load time went down by 30%, visits/week went up by 7% and click-throughs to the Latest News section increased by 35%! I recommend watching the Aftonbladet presentation [High Performance Web Sites, With Ads: Don't let third parties make you slow](https://www.slideshare.net/jarlund/hign-performance-web-sites-with-ads-dont-let-third-parties-make-you-slow)

I've not created a test page for the Friendly Iframe, so I don't have any hands-on experience with it.
From what I've read so far, and by reviewing and using Dave Artz' test page, this is my view on the Friendly Iframe:

- It is not useful if you simply want to load a single iframe on a page with a fixed src
- It's a good technique for loading one or more ads on a web page, in a flexible way: load any ad, update the iframe with another ad, ...
- The DOMContentLoaded event of the main page is not blocked and neither is page rendering: yeah!
- However, the load event of the main page *is* blocked

## Iframe Performance Links

- [Using Iframes Sparingly](http://www.stevesouders.com/blog/2009/06/03/using-iframes-sparingly/)
- [Fast Ads with HTML5](https://calendar.perfplanet.com/2010/fast-ads-with-html5/)

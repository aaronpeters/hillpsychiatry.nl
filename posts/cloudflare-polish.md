---
draft: true
title: Debugging Cloudflare Polish
title1: Get Cloudflare Polish to work with Workers
title2: A Story about Cloudflare Polish and Workers
description: TODO
summary: TODO
date: 2019-01-01
keyword: Cloudflare Polish
---

What is Cloudflare Polish ... service to optimize images for the Web.
Lossless of lossy ... PNG, JPG crunching and automagically convert to WebP if that makes sense.
Sure, you can do this self too, at build time, but why implement that if Cf can do it?

Article outlines what we did with Polish, why convert to WebP did not work and the two possible solutions.

## Getting started with Cloudflare Polish

Easy to turn on: dropdown + tick a box //screenshot
Images on Origin were already a somewhat optimized, but Polish showed that even with lossless there was a lot of room for improvement //examples

## Convert to WebP did not work

Foo bar

## Can Workers make Polish behave as desired?

I tried using a Worker but meh because of where Workers live in the request/response pipeline

## Two ways to solve the WebP problem with Polish

Two options now: 
1. Origin does not send Vary header
2. Image Resizing

## Take-aways

- Take your time to carefully test every feature of your CDN
- Read the documentation !
- Push the support team to go the extra mile (tips: ..., ...)
- You're not done until you have documented your findings and shared with the team; Transfer knowledge
- Doesn't work? It may very well be your Origin


---
title: "Requirements"
permalink: /requirements/
excerpt: "Things you need for executing GNSS-SDR."
modified: 2016-04-13T15:54:02-04:00
header:
  teaser: "https://www.gluu.org/blog/wp-content/uploads/2014/07/POC-checklist-blog.png"
sidebar:
  nav: "start"
---

{% include toc %}

In order to execute GNSS-SDR, you will need:


 1. A computing platform with some software dependencies installed.
 2. A GNSS signal source:
   - can be a file storing GNSS signal samples,
   - or a suitable radio frequency front-end, if you want to operate in real-time.


## The computing platform

### Operating Systems

### Software dependencies

* [GNU Radio](http://gnuradio.org/){:target="_blank"}, a free and open source toolkit for software radio.
* [Armadillo](http://arma.sourceforge.net/){:target="_blank"}, a C++ linear algebra library.
* [glog](https://github.com/google/glog){:target="_blank"}, a C++ implementation of the Google logging module.
* [gflags](https://github.com/gflags/gflags){:target="_blank"}, a C++ library that implements commandline flags processing.
* A library implementing some basic SSL functions, such as [OpenSSL](https://www.openssl.org/){:target="_blank"}, [GnuTLS](http://www.gnutls.org/){:target="_blank"} or [LibreSSL](http://www.libressl.org/){:target="_blank"}.

## GNSS Signal Sources

### Files

### Radio frequency Front-ends



-----

If everything is ready, now you can jump into [building and installing GNSS-SDR]({{ site.url }}{{ site.baseurl }}/build-and-install/) in your own computer.

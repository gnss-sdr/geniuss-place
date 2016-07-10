---
title: "Overview"
permalink: /docs/overview/
excerpt: "Overview"
modified: 2016-04-13T15:54:02-04:00
---

{% include base_path %}


![What is GNSS-SDR]({{ site.url }}{{ site.baseurl }}/images/what-is-gnss-sdr.jpg)
{: style="text-align: center;"}

GNSS-SDR is an open source project that implements a global navigation satellite system software defined receiver in C++. With GNSS-SDR, users can build a GNSS software receiver by creating a graph where the nodes are signal processing blocks and the lines represent the data flow between them. The software provides an interface to different suitable RF front-ends and implements all the receiver’s chain up to the navigation solution. Its design allows any kind of customization, including interchangeability of signal sources, signal processing algorithms, interoperability with other systems, output formats, and offers interfaces to all the intermediate signals, parameters and variables.

The goal is to provide efficient and truly reusable code, easy to read and maintain, with fewer bugs, and producing highly optimized executables in a variety of hardware platforms and operating systems. In that sense, the challenge consists of defining a gentle balance between level of abstraction and performance, addressing

 * Concurrency (take advantage of multicore processors).
 * Efficiency (take advantage of the specific processor architecture).
 * Performance (and how to measure it!).
 * Portability (should live in a complex, dynamic ecosystem of operating systems and processor architectures).
 * Ability to run in real-time or in post-processing (real-time is only for the chosen ones).
 * Extendibility (easy addition and test of new algorithms and implementations).

The proposed software receiver runs in a common personal computer and provides interfaces through USB and Ethernet buses to a variety of either commercially available or custom-made RF front-ends, adapting the processing algorithms to different sampling frequencies, intermediate frequencies and sample resolutions. It also can process raw data samples stored in a file. The software performs signal acquisition and tracking of the available satellite signals, decodes the navigation message and computes the observables needed by positioning algorithms, which ultimately compute the navigation solution. It is designed to facilitate the inclusion of new signal processing techniques, offering an easy way to measure their impact in the overall receiver performance. Testing of all the processes is conducted both by the systematic functional validation of every single software block and by experimental validation of the complete receiver using both real and synthetic signals. The processing output can be stored in Receiver Independent Exchange Format ([RINEX](https://en.wikipedia.org/wiki/RINEX){:target="_blank"}), used by most geodetic processing software for GNSS, or transmitted as RTCM 3.2 messages through a TCP/IP server in real-time. Navigation results are stored in [KML](http://www.opengeospatial.org/standards/kml){:target="_blank"} and [GeoJSON](http://geojson.org/){:target="_blank"} formats.


![](https://raw.githubusercontent.com/gnss-sdr/gnss-sdr/master/docs/doxygen/images/GeneralBlockDiagram.png)
{: style="text-align: center;"}

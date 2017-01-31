---
layout: archive
title: "Signal Processing Blocks"
permalink: /docs/sp-blocks/
excerpt: "Documentation on GNSS-SDR Signal Processing Blocks: implementations and their configuration."
header:
  teaser: /assets/images/caf-th.png
modified: 2016-04-13T15:54:02-04:00
---

In GNSS-SDR, each configuration file defines a receiver. This page documents the available implementations for each of the _GNSS processing blocks_, represented as blue boxes in the figure below, and their parameters.

![General Block Diagram](https://raw.githubusercontent.com/gnss-sdr/gnss-sdr/master/docs/doxygen/images/GeneralBlockDiagram.png)
{: style="text-align: center;"}

<html> <body> <table> <tr> <td id="forcetable">  
{% for post in site.sp-blocks %}
  {% include archive-single.html %}
{% endfor %}
</td> </tr> </table> </body> </html>

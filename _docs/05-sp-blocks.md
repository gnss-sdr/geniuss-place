---
layout: archive
title: "Signal Processing Blocks"
permalink: /docs/sp-blocks/
excerpt: "Documentation on GNSS-SDR Signal Processing Blocks: implementations and their configuration."
header:
  teaser: /assets/images/caf-th.png
last_modified_at: 2016-04-13T15:54:02-04:00
---

In GNSS-SDR, each configuration file defines a receiver. This page documents the available implementations for each of the _GNSS processing blocks_, represented as blue boxes in the figure below, and their parameters.

<img src="https://raw.githubusercontent.com/gnss-sdr/gnss-sdr/master/docs/doxygen/images/GeneralBlockDiagram.png" alt="General Block Diagram" usemap="#sp-map">
{: style="text-align: center; width: 800px;"}


<map name="sp-map" id="Diagram-sp-map">
 <area alt="Signal source" title="Signal source" href="{{ "/docs/sp-blocks/signal-source/" | absolute_url }}" shape="rect" coords="140,146,190,179" style="outline:none;" target="_self" />
 <area alt="Signal Conditioner" title="Signal Conditioner" href="{{ "/docs/sp-blocks/signal-conditioner/" | absolute_url }}" shape="rect" coords="200,149,278,177" style="outline:none;" target="_self" />
 <area alt="Acquisition" title="Acquisition" href="{{ "/docs/sp-blocks/acquisition/" | absolute_url }}" shape="rect" coords="316,112,386,142" style="outline:none;" target="_self" />
 <area alt="Tracking" title="Tracking" href="{{ "/docs/sp-blocks/tracking/" | absolute_url }}" shape="rect" coords="314,186,385,216" style="outline:none;" target="_self" />
 <area alt="Telemetry Decoder" title="Telemetry Decoder" href="{{ "/docs/sp-blocks/telemetry-decoder/" | absolute_url }}" shape="rect" coords="403,186,471,216" style="outline:none;" target="_self" />
 <area alt="Channels" title="Channels" href="{{ "/docs/sp-blocks/channels/" | absolute_url }}" shape="rect" coords="282,55,362,100" style="outline:none;" target="_self" />
 <area alt="Observables" title="Observables" href="{{ "/docs/sp-blocks/observables/" | absolute_url }}" shape="rect" coords="527,135,602,164" style="outline:none;" target="_self" />
 <area alt="PVT" title="PVT" href="{{ "/docs/sp-blocks/pvt/" | absolute_url }}" shape="rect" coords="618,134,667,163" style="outline:none;" target="_self" />
 <area shape="rect" coords="798,495,800,497" alt="Block Diagram" style="outline:none;" title="Image Map" href="{{ "/docs/sp-blocks/" | absolute_url }}" />
</map>



<html> <body> <table> <tr> <td id="forcetable">  
{% for post in site.sp-blocks %}
  {% include archive-single.html %}
{% endfor %}
</td> </tr> </table> </body> </html>


<link rel="prerender" href="{{ "/docs/sp-blocks/signal-source/" | absolute_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/signal-conditioner/" | absolute_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/channels/" | absolute_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/acquisition/" | absolute_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/tracking/" | absolute_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/telemetry-decoder/" | absolute_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/observables/" | absolute_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/pvt/" | absolute_url }}">

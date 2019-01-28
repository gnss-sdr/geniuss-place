---
layout: archive
title: "Signal Processing Blocks"
permalink: /docs/sp-blocks/
excerpt: "Documentation on GNSS-SDR Signal Processing Blocks: implementations and their configuration."
header:
  teaser: /assets/images/caf-th.png
last_modified_at: 2019-01-28T14:54:02+01:00
---

In GNSS-SDR, each configuration file defines a receiver. This page documents the available implementations for each of the _GNSS processing blocks_, represented as blue boxes in the figure below, and their parameters.

<img src="https://raw.githubusercontent.com/gnss-sdr/gnss-sdr/next/docs/doxygen/images/GeneralBlockDiagram.png" alt="General Block Diagram" usemap="#sp-map">
{: style="text-align: center; width: 800px;"}

<map name="sp-map" id="Diagram-sp-map">
 <area alt="Signal source" title="Signal Source" href="{{ "/docs/sp-blocks/signal-source/" | relative_url }}" shape="rect" coords="142,165,186,192" style="outline:none;" target="_self" />
 <area alt="Signal Conditioner" title="Signal Conditioner" href="{{ "/docs/sp-blocks/signal-conditioner/" | relative_url }}" shape="rect" coords="226,165,283,192" style="outline:none;" target="_self" />
 <area alt="Acquisition" title="Acquisition" href="{{ "/docs/sp-blocks/acquisition/" | relative_url }}" shape="rect" coords="325,127,391,158" style="outline:none;" target="_self" />
 <area alt="Tracking" title="Tracking" href="{{ "/docs/sp-blocks/tracking/" | relative_url }}" shape="rect" coords="326,202,392,232" style="outline:none;" target="_self" />
 <area alt="Telemetry Decoder" title="Telemetry Decoder" href="{{ "/docs/sp-blocks/telemetry-decoder/" | relative_url }}" shape="rect" coords="411,202,473,233" style="outline:none;" target="_self" />
 <area alt="Channels" title="Channels" href="{{ "/docs/sp-blocks/channels/" | relative_url }}" shape="rect" coords="292,62,378,113" style="outline:none;" target="_self" />
 <area alt="Observables" title="Observables" href="{{ "/docs/sp-blocks/observables/" | relative_url }}" shape="rect" coords="534,151,604,183" style="outline:none;" target="_self" />
 <area alt="PVT" title="PVT" href="{{ "/docs/sp-blocks/pvt/" | relative_url }}" shape="rect" coords="623,151,663,180" style="outline:none;" target="_self" />
 <area alt="Monitor" title="Monitor" href="{{ "/docs/sp-blocks/monitor/" | relative_url }}" shape="rect" coords="618,57,666,87" style="outline:none;" target="_self" />
 <area shape="rect" coords="798,495,800,497" alt="Block Diagram" style="outline:none;" title="Image Map" href="{{ "/docs/sp-blocks/" | relative_url }}" />
</map>



<html> <body> <table> <tr> <td id="forcetable">  
{% for post in site.sp-blocks %}
  {% include archive-single.html %}
{% endfor %}
</td> </tr> </table> </body> </html>


<link rel="prerender" href="{{ "/docs/sp-blocks/signal-source/" | relative_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/signal-conditioner/" | relative_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/channels/" | relative_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/acquisition/" | relative_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/tracking/" | relative_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/telemetry-decoder/" | relative_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/observables/" | relative_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/pvt/" | relative_url }}">

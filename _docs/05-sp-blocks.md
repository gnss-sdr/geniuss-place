---
layout: archive
title: "Signal Processing Blocks"
permalink: /docs/sp-blocks/
excerpt: "Documentation on GNSS-SDR Signal Processing Blocks: implementations and their configuration."
comments: false
header:
  teaser: /assets/images/caf-th.png
last_modified_at: 2019-01-28T14:54:02+01:00
---

In GNSS-SDR, each configuration file defines a receiver. This page documents the available implementations for each of the _GNSS processing blocks_, represented as blue boxes in the figure below, and their parameters.

<img src="https://raw.githubusercontent.com/gnss-sdr/gnss-sdr/next/docs/doxygen/images/GeneralBlockDiagram.png" alt="General Block Diagram" usemap="#sp-map">
{: style="text-align: center; width: 800px;"}


<map name="sp-map" id="Diagram-sp-map">
 <area alt="Signal source" title="Signal Source" href="{{ "/docs/sp-blocks/signal-source/" | relative_url }}" shape="rect" coords="145,170,190,198" style="outline:none;" target="_self" />
 <area alt="Signal Conditioner" title="Signal Conditioner" href="{{ "/docs/sp-blocks/signal-conditioner/" | relative_url }}" shape="rect" coords="230,171,291,199" style="outline:none;" target="_self" />
 <area alt="Acquisition" title="Acquisition" href="{{ "/docs/sp-blocks/acquisition/" | relative_url }}" shape="rect" coords="332,134,398,161" style="outline:none;" target="_self" />
 <area alt="Tracking" title="Tracking" href="{{ "/docs/sp-blocks/tracking/" | relative_url }}" shape="rect" coords="333,207,400,236" style="outline:none;" target="_self" />
 <area alt="Telemetry Decoder" title="Telemetry Decoder" href="{{ "/docs/sp-blocks/telemetry-decoder/" | relative_url }}" shape="rect" coords="419,208,485,235" style="outline:none;" target="_self" />
 <area alt="Channels" title="Channels" href="{{ "/docs/sp-blocks/channels/" | relative_url }}" shape="rect" coords="300,64,387,114" style="outline:none;" target="_self" />
 <area alt="Observables" title="Observables" href="{{ "/docs/sp-blocks/observables/" | relative_url }}" shape="rect" coords="543,157,615,185" style="outline:none;" target="_self" />
 <area alt="PVT" title="PVT" href="{{ "/docs/sp-blocks/pvt/" | relative_url }}" shape="rect" coords="635,154,675,184" style="outline:none;" target="_self" />
 <area alt="Monitor" title="Monitor" href="{{ "/docs/sp-blocks/monitor/" | relative_url }}" shape="rect" coords="597,59,649,89" style="outline:none;" target="_self" />
 <area alt="Assisted GNSS" title="Assisted GNSS" href="{{ "/docs/sp-blocks/global-parameters/#assisted-gnss" | relative_url }}" shape="rect" coords="231,349,319,388" style="outline:none;" target="_self" />
 <area alt="Telecommand" title="Telecommand" href="{{ "/docs/sp-blocks/global-parameters/#telecommand-via-tcpip" | relative_url }}" shape="rect" coords="333,349,422,388" style="outline:none;" target="_self" />
 <area alt="Gnss_Synchro" title="Gnss_Synchro" href="https://github.com/gnss-sdr/gnss-sdr/blob/next/src/core/system_parameters/gnss_synchro.h" shape="rect" coords="557,118,614,131" style="outline:none;" target="_self" />
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

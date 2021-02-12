---
layout: archive
title: "Signal Processing Blocks"
permalink: /docs/sp-blocks/
excerpt:
  "Documentation on GNSS-SDR Signal Processing Blocks: implementations and their
  configuration."
comments: false
header:
  teaser: /assets/images/caf-th.png
  invert-colors: true
last_modified_at: 2020-08-03T08:54:02+02:00
---

In GNSS-SDR, each configuration file defines a receiver. This page documents the
available implementations for each of the _GNSS processing blocks_, represented
as blue boxes in the figure below, and their parameters.

<span class="invert-colors"><img src="https://raw.githubusercontent.com/gnss-sdr/gnss-sdr/next/docs/doxygen/images/GeneralBlockDiagram.png" alt="General Block Diagram" usemap="#sp-map"></span>
{: style="text-align: center; width: 800px;"}


<map name="sp-map" id="Diagram-sp-map">
 <area alt="Signal source" title="Signal Source" href="{{ "/docs/sp-blocks/signal-source/" | relative_url }}" shape="rect" coords="138,160,185,193" style="outline:none;" target="_self" />
 <area alt="Signal Conditioner" title="Signal Conditioner" href="{{ "/docs/sp-blocks/signal-conditioner/" | relative_url }}" shape="rect" coords="225,160,287,193" style="outline:none;" target="_self" />
 <area alt="Acquisition" title="Acquisition" href="{{ "/docs/sp-blocks/acquisition/" | relative_url }}" shape="rect" coords="327,124,400,156" style="outline:none;" target="_self" />
 <area alt="Tracking" title="Tracking" href="{{ "/docs/sp-blocks/tracking/" | relative_url }}" shape="rect" coords="327,202,400,231" style="outline:none;" target="_self" />
 <area alt="Telemetry Decoder" title="Telemetry Decoder" href="{{ "/docs/sp-blocks/telemetry-decoder/" | relative_url }}" shape="rect" coords="414,202,485,231" style="outline:none;" target="_self" />
 <area alt="Channels" title="Channels" href="{{ "/docs/sp-blocks/channels/" | relative_url }}" shape="rect" coords="295,55,387,109" style="outline:none;" target="_self" />
 <area alt="Observables" title="Observables" href="{{ "/docs/sp-blocks/observables/" | relative_url }}" shape="rect" coords="543,147,620,180" style="outline:none;" target="_self" />
 <area alt="PVT" title="PVT" href="{{ "/docs/sp-blocks/pvt/" | relative_url }}" shape="rect" coords="640,147,680,180" style="outline:none;" target="_self" />
 <area alt="Monitor" title="Monitor" href="{{ "/docs/sp-blocks/monitor/" | relative_url }}" shape="rect" coords="597,52,654,82" style="outline:none;" target="_self" />
 <area alt="Assisted GNSS" title="Assisted GNSS" href="{{ "/docs/sp-blocks/global-parameters/#assisted-gnss" | relative_url }}" shape="rect" coords="226,349,314,384" style="outline:none;" target="_self" />
 <area alt="Telecommand" title="Telecommand" href="{{ "/docs/sp-blocks/global-parameters/#telecommand-via-tcpip" | relative_url }}" shape="rect" coords="329,349,417,384" style="outline:none;" target="_self" />
 <area alt="Gnss_Synchro" title="Gnss_Synchro" href="https://github.com/gnss-sdr/gnss-sdr/blob/next/src/core/system_parameters/gnss_synchro.h" shape="rect" coords="557,98,619,111" style="outline:none;" target="_self" />
</map>



<table> <tr> <td id="forcetable">
{% for post in site.sp-blocks %}
  {% include archive-single.html %}
{% endfor %}
</td> </tr> </table>


<link rel="prerender" href="{{ "/docs/sp-blocks/signal-source/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/sp-blocks/signal-conditioner/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/sp-blocks/data-type-adapter/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/sp-blocks/input-filter/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/sp-blocks/resampler/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/sp-blocks/channels/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/sp-blocks/acquisition/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/sp-blocks/tracking/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/sp-blocks/telemetry-decoder/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/sp-blocks/observables/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/sp-blocks/pvt/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/sp-blocks/monitor/" | relative_url }}" />

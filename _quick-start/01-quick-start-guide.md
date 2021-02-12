---
layout: archive
title: "Quick-Start Guide"
permalink: /quick-start-guide/
excerpt: "Start here to get a general idea on what is all about."
last_modified_at: 2016-06-24T15:54:02-04:00
header:
  teaser: "/assets/images/geniuss.png"
sidebar:
  nav: "start"
---

Welcome to GNSS-SDR.

The name is not a bragging display of creativity:

- **GNSS:** **G**lobal **N**avigation **S**atellite **S**ystems. The acronym
  encompasses those systems that allow users to compute their position based on
  signals transmitted by satellites, world-wide. The obvious example is
  [GPS](https://www.gps.gov/), but this term also includes other systems such as
  [GLONASS](https://www.glonass-iac.ru/en/),
  [Galileo](https://ec.europa.eu/growth/sectors/space/galileo/), and
  [BeiDou](http://en.beidou.gov.cn/).

- **SDR:** **S**oftware **D**efined **R**eceiver. We play a little trick here,
  since SDR is usually an acronym that stands for Software-Defined _Radio_. In
  both cases, it refers to systems in which components that have been typically
  implemented in hardware (_e.g._, mixers, filters, demodulators, detectors,
  etc.) are instead implemented by means of software executing on a personal
  computer or embedded system.

![What is GNSS-SDR]({{ "/assets/images/what-is-gnss-sdr.png" | relative_url }}){: .align-center .invert-colors}
{: style="text-align: center;"}

Today's technology still does not allow processing signals digitally at the
frequencies that satellites transmit (about 1.5 GHz, more details in the [GNSS
Signals]({{ "/docs/tutorials/gnss-signals/" | relative_url }}) tutorial), so we
still need a radio frequency front-end that down-converts signals to a lower
frequency, making some filtering and amplification in the process, and sampling
them at a certain rate, delivering a stream of quantized, digital raw samples to
the computing platform (via USB, Ethernet, etc.).

Then, GNSS-SDR takes care of all the digital signal processing, performing
signal acquisition and tracking of the available satellite signals, decoding the
navigation message, and computing the observables needed by positioning
algorithms, which ultimately compute the navigation solution. The software is
designed to facilitate the inclusion of new signal processing techniques,
offering an easy way to measure their impact on the overall receiver
performance. Testing of all the processes is conducted both by the systematic
functional validation of every single software block and by experimental
validation of the complete receiver using either real-time signals received by
the radio frequency front-end or a file containing those raw signal samples.

![General Block Diagram](https://raw.githubusercontent.com/gnss-sdr/gnss-sdr/next/docs/doxygen/images/GeneralBlockDiagram.png)
{: .align-center .invert-colors}

All the intermediate signals are observable, and the _products_ of the GNSS
signal processing (that is, the measurements known in this context as
[observables](https://gssc.esa.int/navipedia//index.php/GNSS_Basic_Observables)
and the data transmitted by the satellites in their navigation message) are
delivered in standard formats.

GNSS-SDR is
[free and open-source software](https://en.unesco.org/freeandopensourcesoftware)
released under the
[General Public License v3](https://www.gnu.org/licenses/gpl-3.0.html). This
means you have:

- the freedom to use the software for any purpose,
- the freedom to change the software to suit your needs,
- the freedom to share the software with your friends and neighbors, and
- the freedom to share the changes you make.

In particular, you have the freedom to install and use GNSS-SDR right now on
your own computer. This is what the Quick-Start Guide is about.

Here you will find:

<table> <tr> <td class="gridtable">
<div class="grid__wrapper">
  {% for post in site.quick-start %}
    {% if post.title == "Quick-Start Guide" %} {% else %}
      {% include archive-single.html type="grid" %}
    {% endif %}
  {% endfor %}
</div>
</td></tr></table>

---

<link rel="prerender" href="{{ "/requirements/" | relative_url }}" />
<link rel="prerender" href="{{ "/build-and-install/" | relative_url }}" />
<link rel="prerender" href="{{ "/my-first-fix/" | relative_url }}" />

{::comment}
![Introducing GeNiuSS]({{ "/assets/images/geniuss.jpg" | relative_url }}){:height="250px" width="250px"}{: style="text-align: center;"} This is GeNiuSS. You will see him here and there.
{:/comment}

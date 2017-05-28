---
title: "Quick-Start Guide"
permalink: /quick-start-guide/
excerpt: "Start here to get a general idea on what is all about."
last_modified_at: 2016-06-24T15:54:02-04:00
header:
  teaser: "/assets/images/geniuss.jpg"
sidebar:
  nav: "start"
---


{% capture fig_img1 %}
  ![What is GNSS-SDR]({{ "/assets/images/what-is-gnss-sdr.jpg" | absolute_url }})
{% endcapture %}

{% capture fig_img2 %}
  ![General block diagram](https://raw.githubusercontent.com/gnss-sdr/gnss-sdr/master/docs/doxygen/images/GeneralBlockDiagram.png)
{% endcapture %}

{% capture fig_img3 %}
  ![Introducing GeNiuSS]({{ "/assets/images/geniuss.jpg" | absolute_url }})
{% endcapture %}


Welcome to GNSS-SDR.

The name is not a bragging display of creativity:

 * GNSS: **G**lobal **N**avitation **S**atellite **S**ystems. The acronym that encompasses those systems that allow users to compute their position based on signals transmitted by satellites, world-wide. The obvious example is [GPS](http://www.gps.gov/){:target="_blank"}, but this term also includes other systems such as [GLONASS](https://www.glonass-iac.ru/en/){:target="_blank"}, [Galileo](http://www.esa.int/Our_Activities/Navigation/Galileo/What_is_Galileo){:target="_blank"} and [BeiDou](http://en.beidou.gov.cn/){:target="_blank"}.

 * SDR: **S**oftware **D**efined **R**eceiver. We play a little trick here, since SDR is usually an acronym that stands for Software Defined _Radio_. In both cases, it refers to systems in which components that have been typically implemented in hardware (e.g. mixers, filters, demodulators, detectors, etc.) are instead implemented by means of software executing on a personal computer or embedded system.

![What is GNSS-SDR]({{ "/assets/images/what-is-gnss-sdr.jpg" | absolute_url }})
{: style="text-align: center;"}

Today's technology still does not allow processing signals digitally at the frequencies that satellites transmit (about 1.5 GHz), so we still need a radio frequency front-end that down-convert signals to a lower frequency, making some filtering and amplification in the process, and sampling them at a certain rate, delivering a stream of quantized, digital raw samples to the computing platform (via USB, Ethernet, etc.).

Then, GNSS-SDR takes care of all the digital signal processing, performing signal acquisition and tracking of the available satellite signals, decoding the navigation message and computing the observables needed by positioning algorithms, which ultimately compute the navigation solution. The software is designed to facilitate the inclusion of new signal processing techniques, offering an easy way to measure their impact in the overall receiver performance. Testing of all the processes is conducted both by the systematic functional validation of every single software block and by experimental validation of the complete receiver using either real-time signals receiver by the radio frequency front-end or a file containing those raw signal samples.


![General Block Diagram](https://raw.githubusercontent.com/gnss-sdr/gnss-sdr/master/docs/doxygen/images/GeneralBlockDiagram.png)
{: style="text-align: center;"}

All the intermediate signals are observable, and the _products_ of the GNSS signal processing (that is, the measurements known in this context as [observables](http://www.navipedia.net/index.php/GNSS_Basic_Observables){:target="_blank"} and the data trasmitted by the satellites in their navigation message) are delivered in standard formats.

GNSS-SDR is [free and open source software](http://www.unesco.org/new/en/communication-and-information/access-to-knowledge/free-and-open-source-software-foss/){:target="_blank"} released under the [General Public License v3](https://www.gnu.org/licenses/gpl-3.0.html){:target="_blank"}. This means you have:

 * the freedom to use the software for any purpose,
 * the freedom to change the software to suit your needs,
 * the freedom to share the software with your friends and neighbors, and
 * the freedom to share the changes you make.

In particular, you have the freedom to install and use GNSS-SDR right now in your own computer. This is what the Quick-Start Guide is about.

Here you will find:


<html> <body > <table> <tr> <td id="gridtable">
<div class="grid__wrapper">
  {% for post in site.quick-start %}
    {% if post.title == "Quick-Start Guide" %} {% else %}
      {% include archive-single.html type="grid" %}
    {% endif %}
  {% endfor %}
</div>
</td></tr></table></body></html>


---

<link rel="prerender" href="{{ "/requirements/" | absolute_url }}">
<link rel="prerender" href="{{ "/build-and-install/" | absolute_url }}">
<link rel="prerender" href="{{ "/my-first-fix/" | absolute_url }}">

{::comment}
![Introducing GeNiuSS]({{ "/assets/images/geniuss.jpg" | absolute_url }}){:height="250px" width="250x"}{: style="text-align: center;"}
This is GeNiuSS. You will see him here and there.
{:/comment}

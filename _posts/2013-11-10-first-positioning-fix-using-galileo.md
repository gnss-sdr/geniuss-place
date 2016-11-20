---
title: "First positioning fix using Galileo"
excerpt: "Report of the first positioning fix exclusively using Galileo satellites."
author_profile: false
header:
  teaser: /assets/images/ESA-ack.jpg
sidebar:
  nav: "news"
tags:
  - news
  - Galileo
redirect_from:
  - /node/54
---

{% include base_path %}

{% capture fig_img1 %}
  ![First GNSS-SDR Galileo standalone position fix]({{ '/assets/images/Galileo_fix_run2.jpg' | absolute_url }})
{% endcapture %}

{% capture fig_img2 %}
  ![Predicted positions of Galileo IOV satellites]({{ '/assets/images/ScrSav001.jpg' | absolute_url }})
{% endcapture %}

{% capture fig_img3 %}
  ![2D ENU coordinates precision]({{ '/assets/images/Galileo_first_PVT_fix_precision_2D.jpg' | absolute_url }})
{% endcapture %}

{% capture fig_img4 %}
  ![GNSS-SDR 3D ENU coordinates precision for the Galileo position fix]({{ '/assets/images/Galileo_first_PVT_fix_precision_3D.jpg' | absolute_url }})
{% endcapture %}


The GNSS-SDR developer team is happy to announce that the software is able to obtain Galileo-only, real-time position fixes with the available signals of the four Galileo satellites already in orbit.

The hardware setup was composed of a GNSS active antenna located at the rooftop of the CTTC headquarters building, connected to a USRP1 + DBSRX2 daughterboard front-end. The GNSS-SDR software was executed in an Intel Core 2 Quad CPU PC running Ubuntu 12.04 LTS 32 bits. Since four satellites are not enough for providing global coverage, we waited until the four satellites were visible at the same time from our location to perform the experiment.

If you wish to try, obtain an executable built from the latest revision of the source code repository, go to the install folder, and type:

```
$ gnss-sdr --config_file=../conf/gnss-sdr_Galileo_E1.conf
```

to post-process a raw data file (there is a sample file [here](https://sourceforge.net/projects/gnss-sdr/files/data/){:target="_blank"}), or configure the `.conf` file to process data from your RF front-end if you want to obtain PVT fixes in real-time.

The results of the processing are shown below. Fig. 1 shows a Google Earth snapshot of the obtained KML file, after processing 100 seconds of signal. Some details of the processing output log are listed as follows:

```
CH 0: Satellite Galileo PRN 20 (Block IOV), CN0 = 41.391 [dB-Hz]
CH 2: Satellite Galileo PRN 11 (Block IOV), CN0 = 35.6473 [dB-Hz]
CH 1: Satellite Galileo PRN 12 (Block IOV), CN0 = 40.639 [dB-Hz]
CH 3: Satellite Galileo PRN 19 (Block IOV), CN0 = 41.3673 [dB-Hz]
Position at 2013-Nov-10 03:52:14 is Lat = 41.27473002206516 [deg],
Long = 1.987675232634192 [deg], Height= 62.46116237901151 [m]
Dilution of Precision at 2013-Nov-10 15:52:14 is HDOP = 3.58641436755431
 VDOP = 4.151352135926544 TDOP = 4.650305636312183
 GDOP = 5.485990573475482
```

The maximum available Carrier-to-Noise density ratio (CN0) was 41 dB-Hz, associated to high elevation satellites (such as Galileo FM3), as predicted by the orbital model. In contrast, Galileo PFM (PRN ID 11) is visible with a low elevation, and thus the received CN0 was 35 dB-Hz. Next figure shows a capture of the predicted satellite positions and the skyplot.

<figure>
  {{ fig_img2 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>Predicted positions of Galileo IOV satellites.</figcaption>
</figure>


We evaluated the receiver performance in this experiment using standard positioning precision measurements, represented with position scatter plots and their corresponding statistic confidence regions. Two of the most commonly used confidence measurements for positioning are the Distance Root Mean Square (DRMS) and the Circular Error Probability (CEP), for 2D positioning, and the Mean Radial Spherical Error (MRSE) when measures are expressed in 3D. GNSS-SDR exhibits a CEP precision of 1.9 m and a DRMS precision of 2.5 m, shown below:

<figure>
  {{ fig_img3 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>GNSS-SDR 2D ENU coordinates precision for the Galileo position fix.</figcaption>
</figure>


The 3D analysis reveals a precision MRSE of 3.4 m, results shown below:

<figure>
  {{ fig_img4 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>GNSS-SDR 3D ENU coordinates precision for the Galileo position fix.</figcaption>
</figure>

The minimal available Galileo constellation of four satellites provided a Dilution of Precision (DOP) with horizontal and vertical values of 3.6 and 4.2, respectively. The precision performance obtained by GNSS-SDR, which computed the PVT solution by a simple least squares algorithm and without any sort of external help, has clearly passed the first test!

<figure>
  {{ fig_img1 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>First GNSS-SDR Galileo standalone position fix using the four available satellites (Position obtained at the CTTC headquarters on 2013-Nov-10 15:52:14 UTC).</figcaption>
</figure>


If you are interested in replicating the experiments and playing with the software receiver, we suggest the use of a tool such as [GPredict](http://gpredict.oz9aec.net/){:target="_blank"} for predicting the time window in which the four satellites will be visible from your location. Happy satellite hunting!


---------



**Update:** This position fix was acknowledged by the [European Space Agency](http://www.esa.int/){:target="_blank"} as one of the first 50 users of the Galileo system:

![ESA Certificate]({{ '/assets/images/ESA-ack.jpg' | absolute_url }}){: width="500px"}
{: style="text-align: center;"}
{: .notice--primary}

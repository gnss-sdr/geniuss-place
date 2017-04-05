---
permalink: /acks/
layout: single
title: "Acknowledgements"
excerpt: "List of public and private organizations that have helped in the development of GNSS-SDR."
sidebar:
    nav: "about"
last_modified_at: 2016-07-28T18:38:52+00:00
---

This project has been mainly developed on a volunteer basis, for education and research purposes. The main [Developer Team]({{ "/team/" | absolute_url }}){:target="_blank"} is a group of researchers at CTTC, a non-profit research institution, and they use to be quite busy developing amazing new concepts and practical developments for advanced wireless communication systems and serving the industry in actually deploying them. Only some selected students  got a stipend (through their participation in Google Summer of Code and ESA Summer of Code In Space programs) for their direct work on GNSS-SDR.  

According to [Open HUB](https://www.openhub.net/p/gnss-sdr){:target="_blank"}, the development of GNSS-SDR from its [first commit](https://github.com/gnss-sdr/gnss-sdr/commit/228fa3b797dba7d0192f751e7e25a7b8348f9326){:target="_blank"} to a Git repository (in October, 2011, after a happy childhoold living in a Subversion repository) up to now has taken 35 years of effort, as estimated by the Constructive Cost Model ([COCOMO](https://en.wikipedia.org/wiki/COCOMO){:target="_blank"}).
{: .notice--info}

Slowly but steadily baked, the source code evolved and demonstrated its feasibility as an open and free framework for software-defined GNSS receiver development, attracting the interest of more researchers, students, skilled hobbyists and the industry.


The Authors are proud to be supported by the following public institutions, private companies and spontaneous, enthusiastic volunteers that contribute in maintaining and expanding the capabilities and field of applications of a free and open source GNSS sofware-defined receiver:



## Public Research Funds


* **[AUDITOR](http://www.auditor-project.eu/index.html){:target="_blank"} - Advanced Multi-Constellation EGNSS Augmentation and Monitoring Network and its Application in Precision Agriculture** is a project developing a multi-band, multi-constellation receiver based on GNSS-SDR and targeted to Precision Agriculture applications, targeting Galileo and GPS civil signals in the L1, L2 and L5 bands.

  [![AUDITOR logo]({{ "/assets/images/logo-auditor.png" | absolute_url }}){:height="250px" width="250x"}](http://www.auditor-project.eu/index.html){:target="_blank"}
  {: style="text-align: center;"}

  This project has received funding from the [**European GNSS Agency**](http://www.gsa.europa.eu/){:target="_blank"} under the European Union's Horizon 2020 research and innovation programme under grant agreement no. [687367](http://cordis.europa.eu/project/rcn/199301_en.html){:target="_blank"}.
  {: .notice--success}



* Support of Research Groups by the Government of Catalonia (Grant 2014--SGR--1567).

  **The Government of Catalonia**, through Grant 2014--SGR--1567, provides partial support for registrations and travel expenses to well-established scientific conferences.
  {: .notice--success}

* Research networks

  - **COST Action CA15104 - Inclusive Radio Communication Networks for 5G and beyond ([IRACON](http://www.iracon.org){:target="_blank"})**, which aims to achieve scientific breakthroughs by introducing novel design and analysis methods for the 5th-generation (5G) and beyond-5G radio communication networks.

  [![IRACON logo](http://www.iracon.org/wp-content/uploads/2016/03/iracon-logo-big.jpg){:height="250px" width="250x"}](http://www.iracon.org){:target="_blank"}
  {: style="text-align: center;"}

   **IRACON** offers Short Term Scientific Missions grants for exchange visits aimed at supporting individual mobility, strengthening existing networks and fostering collaboration between researchers. Check out the [application procedure](http://www.iracon.org/stsm/){:target="_blank"}.
   {: .notice--success}


## Education programs funded by private entities

* **Google Summer of Code (GSoC)**

    [![GSoC logo]({{ "/assets/images/logo-gsoc.png" | absolute_url }}){:height="100px" width="100x"}](https://developers.google.com/open-source/gsoc/){:target="_blank"}
    {: style="text-align: center;"}

     * [2016](https://summerofcode.withgoogle.com/organizations/?sp-search=gnss-sdr){:target="_blank"}
          - In [GNSS-SDR port to android](https://summerofcode.withgoogle.com/projects/?sp-page=2#4871316700135424){:target="_blank"}, Eric Wild worked on porting GNSS-SDR to Android.
          - In [Implementation of the BeiDou signal tracking block for the GNSS-SDR Project](https://summerofcode.withgoogle.com/projects/?sp-page=2#5537250955755520){:target="_blank"}, Enric Juan developed part of the Beidou B1 receiver.
          - In [Project Frisbee : An Antenna Array Receiver Testbed for GNSS-SDR](https://summerofcode.withgoogle.com/projects/?sp-page=2#4771132842442752){:target="_blank"}, Ajith Peter explored advanced front-end architectures and evolved his open design.

     * [2015](https://www.google-melange.com/archive/gsoc/2015/orgs/gnss_sdr){:target="_blank"}
          - In [BeiDou signal generation and acquisition](https://www.google-melange.com/archive/gsoc/2015/orgs/gnss_sdr/projects/giorgio.html), Giorgio Savastano explored acquisition methods for the Beidou B1 receiver.
          - In [Development of a Low Cost Multi-Constellation GNSS Sampler](https://www.google-melange.com/archive/gsoc/2015/orgs/gnss_sdr/projects/ajithpeter.html), Ajith Peter implemented the first version of a low-cost radiofrequency front-end, achieving a working prototype.
          - In [Embedding GNSS-SDR in a System on Chip](https://www.google-melange.com/archive/gsoc/2015/orgs/gnss_sdr/projects/cris_proteinlab.html), Cristian Becerra worked in adapting GNSS-SDR to embedded devices.
          - In [GNSSSDR Metadata Standard Implementation - Automatic Receiver Configuration](https://www.google-melange.com/archive/gsoc/2015/orgs/gnss_sdr/projects/sumitgautamjbp.html), Sumit Gautam explored novel interfaces and APIs to describe signal inputs.
          - In [Run-time partitioning of functions at an embedded SDR framework](https://www.google-melange.com/archive/gsoc/2015/orgs/gnss_sdr/projects/scaelles.html), Sergi Caelles worked in adapting GNSS-SDR to embedded devices.
          - In [Run-time partitioning of SDR functions featuring hardware accelerators](https://www.google-melange.com/archive/gsoc/2015/orgs/gnss_sdr/projects/paul_jsd.html), Paul Harbanau worked on run-time partitioning strategies in FPGA devices.

     * [2014](https://www.google-melange.com/archive/gsoc/2014/orgs/gnss_sdr){:target="_blank"}
          - In [Development of a GNSS Sampler using the MAX2769 Universal GPS Receiver](https://www.google-melange.com/archive/gsoc/2014/orgs/gnss_sdr/projects/ajithpeter.html){:target="_blank"}, Ajith Peter worked on the design of a low-cost radiofrequency front-end for GNSS-SDR.
          - In [Expanding the receiver to Galileo E5a](https://www.google-melange.com/archive/gsoc/2014/orgs/gnss_sdr/projects/marc_sales.html){:target="_blank"}, Marc Sales pioneered the developemewnt of blocks for the Galileo E5a receiver.
          - In [Faster GNSS Signal Acquisition using the Sparse Fourier Transform](https://www.google-melange.com/archive/gsoc/2014/orgs/gnss_sdr/projects/dmiralles2009.html){:target="_blank"}, Damian Miralles explored the QuickSync algortihm for signal acquiaition.
          - In [New blocks for BeiDou B1 in GNSS-SDR: toward a multi-constellation receiver](https://www.google-melange.com/archive/gsoc/2014/orgs/gnss_sdr/projects/marabra87.html), Mara Branzanti started working on the Beidou B1 receiver.

     * [2013](https://www.google-melange.com/archive/gsoc/2013/orgs/gnss_sdr){:target="_blank"}
          - In [Development of new blocks for Galileo E1 in GNSS-SDR: From telemetry to PVT solutions](https://www.google-melange.com/archive/gsoc/2013/orgs/gnss_sdr/projects/marabra87.html){:target="_blank"}, Mara Branzanti worked on the Galileo E1 receiver.
          - In [GNSS-SDR goes SBAS](https://www.google-melange.com/archive/gsoc/2013/orgs/gnss_sdr/projects/fehrdan.html){:target="_blank"}, Daniel Fehr set the basis for the EGNOS receiver.
          - In [Improve the acquisition sensitivity of a GNSS receiver](https://www.google-melange.com/archive/gsoc/2013/orgs/gnss_sdr/projects/marcmolina.html){:target="_blank"}, Marc Molina improved the performance of acquisition algorithms.

     * [2012](https://www.google-melange.com/archive/gsoc/2012/orgs/gnu){:target="_blank"}, under the kind umbrella of GNU Radio and the GNU Project.
          - In [GNSS Receiver on GNU Radio](https://www.google-melange.com/archive/gsoc/2012/orgs/gnu/projects/lesteve.html){:target="_blank"}, Luis Esteve implemented an acquisition algorithm for GPS L1 C/A.

          **Google**, through the GSoC program, offers students a stipend for contributing to open source projects.
          {: .notice--success}


* **ESA Summer Of Code In Space (SOCIS)**

     * [2015](http://sophia.estec.esa.int/socis2015/?q=node/13){:target="_blank"}
          - In _Direct Position Estimation_, Luis Esteve explored the DPE algorithm and proposed receiver architectures.

     * [2014](http://sophia.estec.esa.int/socis2014/?q=node/13){:target="_blank"}
          - In _GNSS-SDR. Acceleration with VOLK_, Andr&eacute;s Cecilia created a new VOLK module with kernels for GNSS signal processing, the inception of the current [VOLK_GNSSSDR](https://github.com/gnss-sdr/gnss-sdr/tree/master/src/algorithms/libs/volk_gnsssdr_module/volk_gnsssdr){:target="_blank"}.

     * [2013](http://sophia.estec.esa.int/socis2013/?q=node/13){:target="_blank"}
          - In _Real-time positioning solution for GNSS-SDR_, Vladimir Avrov started working on the generation of RTCM messages.

          **The European Space Agency**, through the SOCIS program, offers students a stipend for contributing to open source projects.
          {: .notice--success}


## Sponsors

[![NSL logo]({{ "/assets/images/logo-nsl.jpg" | absolute_url }}){:height="250px" width="250x"}](http://www.nsl.eu.com/){:target="_blank"}
{: style="text-align: center;"}

* [NSL](http://www.nsl.eu.com/){:target="_blank"}, a leading company specialising in satellite navigation, actively supports GNSS-SDR. Based in Nottingham, UK, NSL deliver reliable and robust Global Navigation Satellite System technologies for a variety of applications, such as those that require highest accuracies, impact safety, or are critical in terms of business, finance and security. NSL also produce radiofrequency front-ends and associated products, for example the dual channel [Stereo](http://www.nsl.eu.com/primo.html){:target="_blank"} system that is being used with GNSS-SDR development.

[**NSL**](http://www.nsl.eu.com/){:target="_blank"} kindly provides equipment and technical support to the development of dual-band software architectures.
{: .notice--success}

-----


[![Xilinx logo](https://silica.avnet.com/wps/wcm/connect/88131948-b40f-4223-89fd-137f3e8b3473/1/Xilinx-logo_web.png?MOD=AJPERES&CACHEID=ROOTWORKSPACE-88131948-b40f-4223-89fd-137f3e8b3473/1-lid08oQ){:height="250px" width="250x"}](http://www.xilinx.com){:target="_blank"}
{: style="text-align: center;"}

* [Xilinx](http://www.xilinx.com){:target="_blank"} is a worldwide renowned supplier of programmable logic devices. It is known for inventing the field-programmable gate array (FPGA) and as the first semiconductor company with a fabless manufacturing model.

Through their [**Xilinx University Program (XUP)**](https://www.xilinx.com/support/university.html){:target="_blank"}, Xilinx is supporting GNSS-SDR with the donation of four Zedboard development kits and a full license of the Vivado Design Suite, a software tool for synthesis and analysis of HDL designs.
{: .notice--success}


-------

[![JetBrains logo](http://resources.jetbrains.com/assets/media/open-graph/jetbrains_250x250.png){:height="250px" width="250x"}](https://www.jetbrains.com){:target="_blank"}
{: style="text-align: center;"}

* [JetBrains](https://www.jetbrains.com){:target="_blank"} is a technology-leading software vendor specializing in the creation of intelligent development tools.

[**JetBrains**](https://www.jetbrains.com){:target="_blank"} is supporting the development of GNSS-SDR by providing free licenses for their products as long their are used for open source projects. We specially like [CLion](https://www.jetbrains.com/clion/){:target="_blank"}, a smart cross-platform IDE for C and C++.
{: .notice--success}

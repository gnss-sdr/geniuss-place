---
title: "Open Design of RF front-ends for GNSS receivers"
excerpt: "Build your own radio frequency front-end."
permalink: "/rf-frontends/"
header:
  image: /assets/images/frontend-gsoc-header.jpg
  teaser: /assets/images/frontend-gsoc-header.jpg
  image_description: "Radio Frequency front-end prototype"
sidebar:
  nav: "geniuss-place"
---

In spite of its name, software-defined radio applications still need a portion
of hardware. Although GNSS-SDR is free and open-source software and it can be
used on its own as a simulation and development environment without the need of
any hardware (it can work with raw signal samples stored in files), practical
systems require physical components such as antennas and radio frequency
front-ends that are not implementable by software. It is what could be called
the _air-to-computer interface_, that is, the physical device that translates
the radio waves broadcast by GNSS satellites and received by a suitable antenna
at a given location and time into a sequence of 0s and 1s tractable by a
computer program.

![Front-end]({{ "/assets/images/frontend.png" | relative_url }}){: .align-center .invert-colors}

  _Simplified diagram of a radio frequency front-end delivering raw signal samples through a serial communication bus._
  {: style="text-align: center;"}

There are many commercial solutions out there of such _air-to-computer
interfaces_ for general software-defined radio applications. Those devices are
equipped with wideband, programmable transceivers, and an Ethernet or USB
interface, so they can operate in a wide range of frequencies and for many
different [physical-layer](https://en.wikipedia.org/wiki/Physical_layer)
protocols. Some of them even share the schematics, bill of materials, printed
circuit board layout data, and everything that is necessary for its manufacture,
provided the access to the required fabrication tools, materials, and
components. Notable examples are the
[HackRF](https://greatscottgadgets.com/hackrf/) board by Great Scott Gadgets,
which design is freely available in a [git
repository](https://github.com/greatscottgadgets/hackrf/tree/master/hardware/hackrf-one),
and the [BladeRF](https://www.nuand.com/) board by Nuand, which design is also
[freely available](https://github.com/Nuand/bladeRF). Such physical artifacts
are usually referred to as [_open-source
hardware_](https://en.wikipedia.org/wiki/Open-source_hardware), and belong to a
broader paradigm known as Open Design.

> Open Design is a design artifact project whose source documentation is made
publicly available so that anyone can study, modify, distribute, make, prototype
and sell the artifact based on that design. The artifact's source, the design
documentation from which it is made, is available in the preferred format for
making modifications to it.
> <cite><a
href="https://github.com/OpenDesign-WorkingGroup/Open-Design-Definition" >Open
Design Working Group</a></cite>

Ideally (but not exclusively necessary), Open Design uses readily-available
components and materials, standard processes, open infrastructure, unrestricted
content, and open-source design tools to maximize the ability of individuals to
make and use hardware. Moreover, openly sharing ideas, cooperating in
problem-solving and idea development among other people, regardless of
geographic location, creates a sense of community, a social code of conduct that
is similar in many ways to Open Source development practices.

> Open design promotes the unprecedented sharing of knowledge between the
professional and amateur designer, breaking down unnecessary barriers.
> <cite><a href="https://opendesignnow.org/index.html%3Fp=399.html" >Paul
Atkinson</a></cite>

> Open design is a specific approach to design in which a group of intrinsically
motivated people from various backgrounds develop design opportunities and
solutions together in an open community, based on respect for each other's
skills and expertise.
> <cite><a href="https://opendesignnow.org/index.html%3Fp=425.html" >Carolien
Hummels</a></cite>

The aim is to offer an unbiased creative scenario for GNSS front-end receiver
design, where ideas can be freely expressed, and production, in small or large
numbers, is a key outcome of the design process.


![Coming soon]({{ "/assets/images/coming-soon.jpg" | relative_url }}){: .align-center}


![GeNiuSS-One prototype]({{ "/assets/images/GeNiuSS-One-prototype.png" | relative_url }}){: width="400px" .align-center}

  _Prototype of a GNSS radio frequency front-end with USB interface._
  {: style="text-align: center;"}

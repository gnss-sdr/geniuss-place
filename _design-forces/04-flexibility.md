---
title: "4.- Flexibility"
permalink: /design-forces/flexibility/
excerpt: "The ability of a system to respond to potential internal or external changes affecting its value delivery, in a timely and cost-effective manner."
header:
  teaser: /assets/images/design-force-teaser.png
last_modified_at: 2016-07-29T15:54:02-04:00
---

In the context of engineering design, _flexibility_ refers to the ability of a system to respond to potential internal or external changes affecting its value delivery, in a timely and cost-effective manner.


## Indicators of Flexibility

It follows a list of possible flexibility indicators for a software-defined GNSS receiver:

* Possibility to either use synthetically generated or real-life GNSS signals.
+ Possibility to process signals either in real time or in post-processing time (only limited by the computational capacity of the processing platform executing the software receiver).
* Possibility to use interchangeable RF front-ends.
+ Possibility to define custom receiver architectures.
* Possibility to easily define / interchange implementations and parameters for each processing block.
* Possibility to change parameters while the software is executing.
* Possibility to be executed in different processing platforms (mainframes,personal computers, embedded systems, etc).
* Availability of a versatile configuration mechanism.
* Availability of _operation modes_, as combinations of:
  - Single / multiple frequency bands.
  - Single / multiple constellations.
  - Stand-alone / assisted / differential GNSS.

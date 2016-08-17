---
title: "3.- Efficiency"
permalink: /design-forces/efficiency/
excerpt: "How fast the software receiver can process the incoming signal, and in particular how many channels it can sustain in parallel."
modified: 2016-07-29T15:54:02-04:00
---

In this context, _efficiency_ refers to optimizing the speed and memory requirements of the software receiver. Specifically, we are interested on how fast the software receiver can process the incoming signal, and in particular if signal processing up to the position fix can be done in real-time using a RF front-end (and how many channels it can sustain in parallel). Efficiency can also refer to the optimization of power consumption required by the processor running the software receiver.


## Indicators of Efficiency

It follows a list of possible efficiency indicators for a software-defined GNSS receiver:

* Number  of  parallel  channels  that  the  software  receiver  can  sustain  in  real time, given the targeted signal(s) (GPS L1 C/A, Galileo E1B, etc.) of each channel, the sampling rate, the sample data format and the computational resources available for signal processing.
* Power consumption (in watts) for a given computing platform executing the software receiver and a given computational load in terms of number of signals and channels to be processed. Power consumption sometimes in given as current (in mA) for a given fixed voltage (in volts).
* Availability of profiling tools and performance tests for identifying processing bottlenecks and measuring computational performance in the supported processing environments (processor architecture, operating system, etc.).

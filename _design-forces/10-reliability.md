---
title: "10.- Reliability"
permalink: /design-forces/reliability/
excerpt: "The ability of a system or component to function under stated conditions for a specified period of time."
header:
  teaser: /assets/images/design-force-teaser.png
last_modified_at: 2017-08-13T21:54:02+02:00
---

_Reliability_ describes the ability of a system or component to function under stated conditions for a specified period of time. Reliability refers to the consistency of the results provided by a system; internal and external reliability are, respectively, the ability to detect gross errors and the effect of an undetected blunder on the solution.

Reliability is about the overall consistency of a measure. It is a concept that encompasses service continuity, and thus it is related to satellite availability, to those indicators described at [availability]({{ "/design-forces/availability/" | absolute_url }}), [accuracy]({{ "/design-forces/accuracy/" | absolute_url }}) and [repeatability]({{ "/design-forces/repeatability/" | absolute_url }}), and to _integrity_. The latter requires the definition, for each measurement of interest, of:

* an **_alert limit_**, defined as the error tolerance not to be exceeded without issuing an alert,
* a **_time to alert_**, defined as the maximum allowable time elapsed from the onset of the navigation system being out of tolerance until the equipment enunciates the alert,
* the corresponding **_integrity risk_**, defined as the probability that, at any moment, the position error exceeds the alert limit, and
* a **_protection level_**, defined as the statistical bound error computed so as to guarantee that the probability of the absolute position error exceeding said number is smaller than or equal to the target integrity risk.


Specifically, software reliability is also related to the usage of the programming language. Certain coding practices are considered unsafe, in the sense that they an lead to _undefined_ or _unspecified_ behaviors under certain conditions, which is an undesirable feature.

For instance, the software industry has created several specifications for the C++ language, banning the usage of a set of libraries and functions from the standard library, as well as defining a list of coding rules. Examples:

* _SEI CERT C++ Coding Standard: Rules for Developing Safe, Reliable, and Secure Systems in C++ [(2016 Edition)](http://cert.org/secure-coding/products-services/secure-coding-cpp-download-2016.cfm){:target="_blank"}_, based on the [ISO/IEC 14882-2014](https://www.iso.org/standard/64029.html){:target="_blank"} standard.

* _High Integrity C++ Coding Standard [Version 4.0](http://www.codingstandard.com){:target="_blank"}_, released on 3 October 2013. It is based on the [ISO/IEC 14882:2011](https://www.iso.org/standard/50372.html){:target="_blank"} standard.

* _[MISRA C++](https://www.misra.org.uk/Activities/MISRAC/tabid/171/Default.aspx){:target="_blank"} Guidelines for the use of the C++ language in critical systems_, published and officially launched on 5 June 2008. It is based on the [ISO/IEC 14882:2003](https://www.iso.org/standard/38110.html){:target="_blank"} standard.


## Indicators of Reliability

It follows a list of possible reliability indicators for a software-defined GNSS receiver:

* Percentage of false and missed alerts.
* Availability of receiver autonomous integrity monitoring (RAIM) mechanisms:
  - Fault detection (requires $$ \geq 5 $$ in-view satellites).
  - Fault detection and exclusion (requires $$ \geq 6 $$ in-view satellites).
  - RAIM prediction tools.

* Horizontal / Vertical Protection Limits (HPL / VPL):  radius of circles which are centered on the GNSS position solution and are guaranteed to contain the true position of the receiver to within the specifications of the RAIM scheme (_i.e._, which meets specified false alarm and  missed detection probabilities).

* Availability of mechanisms providing robustness against RF interferences and multipath:
  - Out-of-band rejection of RF interferences (see [ETSI EN 303 413 Standard](https://portal.etsi.org/webapp/WorkProgram/Report_WorkItem.asp?WKI_ID=48239){:target="_blank"}).
  - In-band rejection techniques for continuous wave, pulsed, and wideband interferences.
  - Countermeasures against spoofing, meaconing, and fake assisted and differential data.
  - Spatial diversity: Fixed / Controlled Reception Pattern Antennas[^Fernandez16].

* Deployment of network security and data integrity mechanisms.
* Availability of GNSS signal authentication mechanisms.
  - Probability of failure.
  - Time to authentication.

* Safety-critical software certifications (_e.g._, [DO--178B](https://en.wikipedia.org/wiki/DO-178B){:target="_blank"}).

* Observation of coding standards.
  - Availability of coding standard checker tools.

-----


## References

[^Fernandez16]: C. Fern&aacute;ndez-Prades, J. Arribas and P. Closas, [_Robust GNSS Receivers by Array Signal Processing: Theory and Implementation_](http://ieeexplore.ieee.org/xpl/articleDetails.jsp?arnumber=7444116){:target="_blank"}, Proceedings of the IEEE, Vol. 104, No. 6, pp. 1207 - 1220, June 2016.

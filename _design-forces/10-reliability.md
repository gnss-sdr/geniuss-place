---
title: "10.- Reliability"
permalink: /design-forces/reliability/
excerpt: "The ability of a system or component to function under stated conditions for a specified period of time."
header:
  teaser: /assets/images/design-force-teaser.png
last_modified_at: 2017-08-14T14:54:02+02:00
---

_Reliability_ describes the ability of a system or component to function under stated conditions for a specified period of time. Reliability refers to the consistency of the results provided by a system; internal and external reliability are, respectively, the ability to detect gross errors and the effect of an undetected blunder on the solution.

Reliability is about the overall consistency of a measure. It is a concept that encompasses service continuity, and thus it is related to satellite availability, to those indicators described at [availability]({{ "/design-forces/availability/" | relative_url }}), [accuracy]({{ "/design-forces/accuracy/" | relative_url }}), [portability]({{ "/design-forces/portability/" | relative_url }}) and [repeatability]({{ "/design-forces/repeatability/" | relative_url }}), in addition to _integrity_. The latter requires the definition, for each measurement of interest, of:

* an **_alert limit_**, defined as the error tolerance not to be exceeded without issuing an alert,
* a **_time to alert_**, defined as the maximum allowable time elapsed from the onset of the navigation system being out of tolerance until the equipment enunciates the alert,
* the corresponding **_integrity risk_**, defined as the probability that, at any moment, the position error exceeds the alert limit, and
* a **_protection level_**, defined as the statistical bound error computed so as to guarantee that the probability of the absolute position error exceeding said number is smaller than or equal to the target integrity risk.


Specifically, software reliability is also related to the usage of the programming language. Certain coding practices are considered unsafe, in the sense that they can lead to _undefined_,  _unspecified_ or _implementation-defined_ behaviors under certain conditions, which is an undesirable feature (see definitions below).

As examples of programming languages for high-reliability systems, we can mention [Ada](https://en.wikipedia.org/wiki/Ada_(programming_language)) and [SPARK](https://en.wikipedia.org/wiki/SPARK_(programming_language)) (which is an Ada dialect with some hooks for static verification), which are used in aerospace circles for building high reliability software such as avionics systems, and [Erlang](http://www.erlang.org), which was designed from the ground up for writing high-reliability telecommunications code. Functional languages such as [Haskell](https://wiki.haskell.org/Haskell) can be subjected to formal proofs by automated systems due to the declarative nature of the language. However, these languages are garbage collected, and garbage collection is not normally predictable enough for hard real-time applications, although there is a body of ongoing research in time bounded incremental garbage collectors.

Although C and C++ were not specifically designed for this type of application, they are widely used for embedded and safety-critical software for several reasons. The main properties of note are control over memory management (which allows you to avoid having to garbage collect, for example), simple, well debugged core run-time libraries and mature tool support. A lot of the embedded development tool chains in use today were first developed in the 1980s and 1990s when this was current technology and come from the Unix culture that was prevalent at that time, so these tools remain popular for this sort of work. While manual memory management code must be carefully checked to avoid errors, it allows a degree of control over application response times that is not available with languages that depend on garbage collection. The core run time libraries of C and C++ languages are relatively simple, mature and well understood, so they are amongst the most stable platforms available[^StackOverflow].

In the case of the C++ language, the software industry has created several specifications for enhanced reliability, banning the usage of a set of libraries and functions from the standard library, as well as defining a list of coding rules. Examples:

* _SEI CERT C++ Coding Standard: Rules for Developing Safe, Reliable, and Secure Systems in C++ [(2016 Edition)](https://resources.sei.cmu.edu/library/asset-view.cfm?assetID=494932)_, based on the [ISO/IEC 14882-2014](https://www.iso.org/standard/64029.html) standard.

* _High Integrity C++ Coding Standard [Version 4.0](http://www.codingstandard.com)_, released on 3 October 2013. It is based on the [ISO/IEC 14882:2011](https://www.iso.org/standard/50372.html) standard.

* _[MISRA C++](https://www.misra.org.uk/Activities/MISRAC/tabid/171/Default.aspx) Guidelines for the use of the C++ language in critical systems_, published and officially launched on 5 June 2008. It is based on the [ISO/IEC 14882:2003](https://www.iso.org/standard/38110.html) standard.

The ultimate objective of those coding standards is to prevent from the undesired behaviors described below:

{% capture bad-behaviors %}
* **Undefined behavior** is behavior, such as might arise upon use of an erroneous program construct or erroneous data, for which the C++ Standard imposes no requirements. Undefined behavior may also be expected when the C++ Standard omits the description of any explicit definition of behavior or defines the behavior to be ill-formed, with no diagnostic required.
* **Unspecified behavior** is behavior, for a well-formed program construct and correct data, that depends on the implementation. The implementation is not required to document which behavior occurs.
* **Implementation-defined behavior** is behavior, for a well-formed program construct and correct data, that depends on the implementation and that each implementation documents.
{% endcapture %}

<div class="notice--danger">
  <h4>Definitions from the ISO/IEC 14882-2014 standard</h4>
  {{ bad-behaviors | markdownify }}
</div>

_Unspecified_ and _implementation-defined behaviors_ are issues also related to [portability]({{ "/design-forces/portability/" | relative_url }}).

## Indicators of Reliability

It follows a list of possible reliability indicators for a software-defined GNSS receiver:

* Percentage of false and missed alerts.
* Availability of receiver autonomous integrity monitoring (RAIM) mechanisms:
  - Fault detection (requires $$ \geq 5 $$ in-view satellites).
  - Fault detection and exclusion (requires $$ \geq 6 $$ in-view satellites).
  - RAIM prediction tools.

* Horizontal / Vertical Protection Limits (HPL / VPL):  radius of circles which are centered on the GNSS position solution and are guaranteed to contain the true position of the receiver to within the specifications of the RAIM scheme (_i.e._, which meets specified false alarm and  missed detection probabilities).

* Availability of mechanisms providing robustness against RF interferences and multipath:
  - Out-of-band rejection of RF interferences (see [ETSI EN 303 413 Standard](https://portal.etsi.org/webapp/WorkProgram/Report_WorkItem.asp?WKI_ID=48239)).
  - In-band rejection techniques for continuous wave, pulsed, and wideband interferences.
  - Countermeasures against spoofing, meaconing, and fake assisted and differential data.
  - Spatial diversity: Fixed / Controlled Reception Pattern Antennas[^Fernandez16].

* Deployment of network security and data integrity mechanisms.
* Availability of GNSS signal authentication mechanisms.
  - Probability of failure.
  - Time to authentication.

* Safety-critical software certifications (_e.g._, [DO--178B](https://en.wikipedia.org/wiki/DO-178B)).

* If the programming language is C++: Coding Standard certifications (_e.g._, [SEI CERT C++ Coding Standard](https://resources.sei.cmu.edu/library/asset-view.cfm?assetID=494932), [High Integrity C++](http://www.programmingresearch.com/coding-standards/high-integrity-cpp/), MISRA C++:2008, others)

* Observation of coding standards.
  - Use of static checking tools to enforce compliance with the allowed language subset.

-----


## References

[^StackOverflow]: Stack Overflow, [Which languages are used for safety-critical software?]( https://stackoverflow.com/questions/243387/which-languages-are-used-for-safety-critical-software/243573#243573)

[^Fernandez16]: C. Fern&aacute;ndez-Prades, J. Arribas and P. Closas, [_Robust GNSS Receivers by Array Signal Processing: Theory and Implementation_](https://ieeexplore.ieee.org/document/7444116/), Proceedings of the IEEE, Vol. 104, No. 6, pp. 1207 - 1220, June 2016.

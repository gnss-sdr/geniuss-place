---
title: "10.- Reliability"
permalink: /design-forces/reliability/
excerpt: "The ability of a system or component to function under stated conditions for a specified period of time."
modified: 2016-07-29T15:54:02-04:00
---

_Reliability_ describes the ability of a system or component to function under stated conditions for a specified period of time. Reliability refers to the consistency of the results provided by a system; internal and external reliability are, respectively, the ability to detect gross errors and the effect of an undetected blunder on the solution.


Reliability is a concept that encompasses service continuity, and thus it is related to satellite availability and those indicators described at [Availability]({{ site.url }}{{ site.baseurl }}/design-forces/availability/), [Accuracy]({{ site.url }}{{ site.baseurl }}/design-forces/({{ site.url }}{{ site.baseurl }}/design-forces/accuracy/)/), and integrity. The latter requires the definition, for each measurement of interest, of:

* an **_alert limit_**, defined as the error tolerance not to be exceeded without issuing an alert,
* a **_time to alert_**, defined as the maximum allowable time elapsed from the onset of the navigation system being out of tolerance until the equipment enunciates the alert,
* the corresponding **_integrity risk_**, defined as the probability that, at any moment, the position error exceeds the alert limit, and
* a **_protection level_**, defined as the statistical bound error computed so as to guarantee that the probability of the absolute position error exceeding said number is smaller than or equal to the target integrity risk.


## Indicators of Reliability

* Percentage of false and missed alerts.
* Availability of receiver autonomous integrity monitoring (RAIM) mechanisms:
  - Fault detection (requires $$ \geq 5 $$ in-view satellites).
  - Fault detection and exclusion (requires $$ \geq 6 $$ in-view satellites).
  - RAIM prediction tools.

* Horizontal / Vertical Protection Limits (HPL / VPL):  radius of circles which are centered on the GNSS position solution and are guaranteed to contain the true position of the receiver to within the specifications of the RAIM scheme (_i.e._, which meets specified false alarm and  missed detection probabilities).

* Availability of mechanisms providing robustness against RF interferences and multipath:
  - Out-of-band rejection of RF interferences.
  - In-band rejection techniques for continuous wave, pulsed, and wideband interferences.
  - Countermeasures against spoofing, meaconing, and fake assisted and differential data.
  - Spatial diversity: Fixed / Controlled Reception Pattern Antennas.

* Deployment of network security and data integrity mechanisms.
* Availability of GNSS signal authentication mechanisms.
  - Probability of failure.
  - Time to authentication.

* Safety-critical software certifications (_e.g._, [DO--178B](https://en.wikipedia.org/wiki/DO-178B){:target="_blank"}).

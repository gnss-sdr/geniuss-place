---
title: "2.- Availability"
permalink: /design-forces/availability/
excerpt: "The degree to which a system, subsystem or equipment is in a specified operable and committable state at the (random) start of a mission."
modified: 2016-07-29T15:54:02-04:00
---
{% include toc %}

{% capture cold-start %}
**Cold start**, defined with the following assumptions:

* Time is unknown.
* Current almanac and ephemeris unknown.
* Position unknown.
{% endcapture %}

{% capture warm-start %}
**Warm start**, defined with the following assumptions:

* Time is known.
* Current almanac is known.
* No ephemeris (or the data is more than four hours old).
* Position within $$ 100 $$ km of last fix.
{% endcapture %}

{% capture hot-start %}
**Hot start**, defined with the following assumptions:

* Time is known.
* Current almanac is known.
* Current ephemeris are known.
* Position within $$ 100 $$ km of last fix.
{% endcapture %}

_Availability_ refers to the degree to which a system, subsystem or equipment is in a specified operable and committable state at the start of a mission, when the mission is called for at an unknown, random time. Simply put, availability is the proportion of time the software receiver is in a functioning condition.







## Time-To-First-Fix (TTFF)


<div class="notice--info">
  {{ cold-start | markdownify }}
</div>

<div class="notice--warning">
  {{ warm-start | markdownify }}
</div>

<div class="notice--danger">
  {{ hot-start | markdownify }}
</div>

The TTFF samples are then analyzed to determine the mean, minimum, and maximum  values. The standard deviation of the sample set is computed as follows, where $$ L $$ is the sample size:

$$ \sigma_{TTFF} = \sqrt{\frac{1}{L-1}\sum_{i=1}^L \left( TTFF_i - \frac{1}{L}\sum_{j=1}^L TTFF_j \right)^2 } $$


|----------
|  **Mean TTFF**  |  **Max TTFF** | **Min TTFF** | **Sample Dev / Size** | Signal | Nav. mode | Avail. Accy. | DGPS |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|--------------
| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|--------------


## Reacquisition Time

Reacquisition time characterizes the performance of the receiver in a scenario where the signal is greatly reduced or interrupted for some short period of time and is then restored. An example of this would be a vehicle going through a tunnel or under some heavy tree cover. In this case the receiver is briefly unable to track most or all of the satellites, but must re-acquire (track) the signal when "visibility" is restored.

The test measurement system must be configured to record the time at which signals are removed from the receiver ($$ t_1 $$) and the time at which signals are reapplied to the receiver ($$ t_2 $$). All navigation data produced by the receiver shall be recorded for subsequent data analysis.

A total of at least 50 valid REAQ samples should be produced for use in data analysis and the total sample size recorded as $ L $$.


The standard deviation of the sample set is computed as follows, where $$ L $$ is the sample size:

$$ \sigma_{REAQ} = \sqrt{\frac{1}{L-1}\sum_{i=1}^L \left( REAQ_i - \frac{1}{L}\sum_{j=1}^L REAQ_j \right)^2 } $$


## Acquisition sensitivity

Acquisition sensitivity determines the minimum signal power threshold that allows the receiver to successfully perform a cold start TTFF within a specified time frame. The generation of testing inputs is as follows: fixing the number of visible satellites to one, the power level of the received signal is set such that the GNSS software receiver under test can detect the single GNSS satellite signal within a given probability of detection. The power level of the GPS satellite signal is then decreased until the GNSS receiver is not able to acquire that satellite signal.


## Tracking sensitivity

Tracking sensitivity refers to the minimum signal level that allows the receiver to maintain a location fix within some specified degree of accuracy. The generation of testing inputs is as follows: fixing the number of visible satellites to one, the power level of the received signal is set such that the GNSS software receiver under test can identify the single GNSS satellite signal. The power level of the GNSS satellite signal is then decreased until the GNSS receiver loses tracking of the single satellite.


## Indicators of Availability

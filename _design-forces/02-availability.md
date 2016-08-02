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


The TTFF indicator provides a measurement of the time required for a static receiver to provide a valid position fix after the receiver is started. A _valid_ position fix is required to have a 3D accuracy below a given threshold (for instance, 600 m for GPS L1 C/A signals). The value includes the time to recover ephemeris data from all satellites used in the navigation estimation process.




<div class="notice--info">
  {{ cold-start | markdownify }}
</div>

<div class="notice--warning">
  {{ warm-start | markdownify }}
</div>

<div class="notice--danger">
  {{ hot-start | markdownify }}
</div>

Before taking each TTFF measurement, the receiver must be set in the states defined above, referred to as _cold_, _warm_ and _hot_ starts.

Each TTFF sample should be computed as the time interval starting with the invocation of the receiver's executable and ending with the first valid navigation data point derived from live or simulated satellite signals. The start times of the test samples should not be synchronized to any UTC time boundary and should be randomly spread within the 24 hour UTC day and within the GNSS data collection interval (_e.g._, 30 s for GPS L1 C/A signals).

A total of at least 20 valid TTFF samples shall be produced for use in data analysis and the total sample size recorded as $$ L $$. Provisions must be made between samples to ensure that current ephemeris does not remain in the receiver. In order to make the measurement as independent as possible of the satellite geometry, measurements should be spread in an interval of 8 hours.

In addition, this test makes provisions for anomalous behavior by allowing the tester to reject samples which exceed 10 times the value of MEAN determined for the valid sample size. Such samples are considered non-tests for purposes of statistical analysis, but the total number of such occurrences is recorded and presented with the test results.

The TTFF samples are then analyzed to determine the mean, standard deviation, minimum, and maximum  values.

TTFF test results should be reported as:

|----------
|  **Reported parameter**  |  **Description** |
|:-:|:--|
|--------------
|  **Mean TTFF**  | Average of the obtained measurements, computed as $$  \frac{1}{L}\sum_{j=1}^L TTFF_j $$. Units: seconds. |
|  **Max TTFF**  | Maximum of the obtained valid measurements. Units: seconds |
|  **Min TTFF**  | Minimum of the obtained valid measurements. Units: seconds |
|  **Sample Dev / Size** |  The standard deviation of the sample set is computed as $$ \sigma_{TTFF} = \sqrt{\frac{1}{L-1}\sum_{i=1}^L \left( TTFF_i - \frac{1}{L}\sum_{j=1}^L TTFF_j \right)^2 } $$, in seconds. / Number of valid measurements (L) over the total number of measurements (M), expressed as (L of M). |
|  **Signal**  | Targeted GNSS signal(s).  |
|  **Source**  | [`Live`, `Sim`]: `Live` for GNSS signals from space, `Sim` for or simulated GNSS signals |
| **Init. status** | [`cold`, `warm`, `hot`]: Initial receiver status, as defined above.  |
| **Nav. mode** | [`2D`, `3D`]: `3D` Navigation mode in which at least four satellite signals are received and are used to compute positioning data containing as a minimum: time tagged latitude, longitude, and altitude referenced to a given coordinate system.  /  `2D` Navigation mode in which no fewer than three satellite signals and fixed altitude are received and used to compute positioning data containing as a minimum: time tagged latitude, longitude, and fixed altitude referenced to a given system.    |
|  **DGNSS**  | [`Y`, `N`]: `Y` if an external system is providing ephemeris data, `N` if the receiver is not receiving external information. |
|--------------

**Example of report**: For a receiver with a mean TTFF of 90 seconds, minimum measured value of 75 seconds, maximum measured value of 110 seconds, valid sample size of 20 with no invalid samples, sample deviation of 8 seconds, using GPS L1 C/A signals in 3D mode, and assuming a cold start with no external source of information, the results would be presented as:

|----------
|  **Mean TTFF**  |  **Max TTFF** | **Min TTFF** | **Sample Dev / Size** | Signal | Source | Init. status | Nav. Mode | DGNSS |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|--------------
| 90 | 110 | 75 | 8 (20 of 20) | Live | 1C | cold | 3D | N |
|--------------


## Reacquisition Time

Reacquisition time characterizes the performance of the receiver in a scenario where the signal is greatly reduced or interrupted for some short period of time and is then restored. An example of this would be a vehicle going through a tunnel or under some heavy tree cover. In this case the receiver is briefly unable to track most or all of the satellites, but must re-acquire (track) the signal when "visibility" is restored.

The test measurement system must be configured to record the time at which signals are removed from the receiver ($$ t_1 $$) and the time at which signals are reapplied to the receiver ($$ t_2 $$). All navigation data produced by the receiver should be recorded for subsequent data analysis. Each REAQ sample is computed as the time interval beginning at $$ t_2 $$ and ending with the first valid navigation data point derived from live or simulated satellite signals which is within the accuracy limits specified for the targeted signal(s).


A total of at least 50 valid REAQ samples should be produced for use in data analysis.

Reacquisition Time test results should be reported as:

|----------
|  **Reported parameter**  |  **Description** |
|:-:|:--|
|--------------
|  **Mean REAQ**  | Average of the obtained measurements, computed as $$ \frac{1}{L}\sum_{j=1}^L REAQ_j $$. Units: seconds. |
|  **Blockage Time**  | The value of the time interval from $$ t_1 $$ to $$ t_2 $$, as defined above. Units: seconds|
|  **Min REAQ**  | Minimum of the obtained valid measurements. Units: seconds |
|  **Max REAQ**  | Maximum of the obtained valid measurements. Units: seconds |
|  **Sample Dev / Size** |  The standard deviation of the sample set is computed as $$ \sigma_{REAQ} = \sqrt{\frac{1}{L-1}\sum_{i=1}^L \left( REAQ_i - \frac{1}{L}\sum_{j=1}^L REAQ_j \right)^2 } $$, in seconds. / Number of valid measurements (L) over the total number of measurements (M), expressed as (L of M). |
|  **Signal**  | Targeted GNSS signal(s).  |
|  **Source**  | [`Live`, `Sim`]: `Live` for GNSS signals from space, `Sim` for or simulated GNSS signals |
| **Nav. mode** | [`2D`, `3D`]: `3D` Navigation mode in which at least four satellite signals are received and are used to compute positioning data containing as a minimum: time tagged latitude, longitude, and altitude referenced to a given coordinate system.  /  `2D` Navigation mode in which no fewer than three satellite signals and fixed altitude are received and used to compute positioning data containing as a minimum: time tagged latitude, longitude, and fixed altitude referenced to a given system.    |
|  **DGNSS**  | [`Y`, `N`]: `Y` if an external system is providing ephemeris data, `N` if the receiver is not receiving external information. |
|--------------


**Example of report**: For a receiver with a mean REAQ of 5 seconds for 30 second blockage, a valid sample size of 50 plus 2 invalid samples, minimum measured value of 2 seconds, maximum measured value of 35 seconds, sample deviation of 1 second, using 30 navigation mode and simulated Galileo E1 open signals, the results would be presented as:


|----------
|  **Mean REAQ**  |  **Blockage Time** |**Max REAQ** | **Min REAQ** | **Sample Dev / Size** | Signal | Source | Nav. Mode | DGNSS |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|--------------
| 5 | 30 | 2 | 35 | 1 (50 of 52) | Sim | 1B | 3D | N |
|--------------

## Acquisition sensitivity

Acquisition sensitivity determines the minimum signal power threshold that allows the receiver to successfully perform a cold start TTFF within a specified time frame. The generation of testing inputs is as follows: fixing the number of visible satellites to one, the power level of the received signal is set such that the GNSS software receiver under test can detect the single GNSS satellite signal within a given probability of detection. The power level of the GPS satellite signal is then decreased until the GNSS receiver is not able to acquire that satellite signal.

Sensitivity is one of the most important measurements of a GNSS receiver's capability. In fact, for many commercial-grade GNSS receivers, it is often the only RF measurement performed in production test of the final product.
{: .notice--info}

A receiver's sensitivity is highly dependent on the noise figure of the RF front-end. This relation can be written as:

$$ \text{Sensitivity} =  N_{\text{dBm}} + {C/N_0}_{\text{min}} + NF_{\text{Rx}} $$

where:

  * $$  N_{\text{dBm}} = 10 \cdot log_{10}(k \times T_0  \times 1000) $$ is the noise power, in dBm, where $$ k = 1.38 \cdot 10^{-23} $$  Joules per Kelvin is the Boltzmann's constant and $$ T_0 $$ is the temperature of the receiver system in Kelvin. Assuming that the physical temperature of the system is 290 Kelvin, $$ N_{\text{dBm}} = -174 $$ dBm.
  * $$ {C/N_0}_{\text{min}} $$ is the minimum $$ C/N_0 $$ required for position tracking, in dB-Hz.
  * $$ NF_{\text{Rx}} $$ is the receiver's noise figure, in dB.

When performing  sensitivity measurements, RF power-level accuracy is one of the most important
characteristics of the signal generator. Because receivers report $$ C/N_0 $$ to within $$ 0 $$ digits of precision (for instance: $$ 34 $$ dB-Hz), sensitivity measurements in production test are made within $$ \pm 0.5 $$ dB of power accuracy.

Thus, it is important to ensure that your instrumentation has equal or better performance. Because general-purpose RF instrumentation is specified for operation across a broad range of power levels, frequency ranges, and temperature conditions, you can often achieve measurement repeatability that is much better than the specified instrument performance by implementing a basic system calibration.

The generation of testing inputs is as follows: fixing the number of visible satellites to one, the power level of the received signal is set such that the GNSS software receiver under test can detect the single GNSS satellite signal within a given probability of detection. The power level of the GPS satellite signal is then decreased until the GNSS receiver is not able to acquire that satellite signal. This power level and the corresponding GNSS software receiver under test reported carrier-to-noise density ratio ($$ C/N_0 $$) should be collected as data. The received power level at the beginning of this scenario is $$ -140 $$ dBm, and it is decreased by $$ 1 $$ dB in each acquisition procedure.

|----------
|  **Reported parameter**  |  **Description** |
|:-:|:--|
|--------------
|  **Acquisition sensitivity**  | Minimum signal power level, in dBm, for which the receiver is able to acquire it, for a given probability of detection. |
|  **$$ C/N_0 $$**  | $$ C/N_0 $$ value, in dB-Hz, reported by the receiver when the input signal is set to the acquisition sensitivity power level. |
| **Signal** | ... |
|--------------


## Tracking sensitivity

Tracking sensitivity refers to the minimum signal level that allows the receiver to maintain a location fix within some specified degree of accuracy. The generation of testing inputs is as follows: fixing the number of visible satellites to one, the power level of the received signal is set such that the GNSS software receiver under test can identify the single GNSS satellite signal. The power level of the GNSS satellite signal is then decreased until the GNSS receiver loses tracking of the single satellite. This power level and the corresponding GNSS software receiver under test reported carrier-to-noise density ratio ($$ C/N_0 $$) should be collected as data.


## Indicators of Availability

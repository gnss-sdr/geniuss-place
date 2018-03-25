---
title: "2.- Availability"
permalink: /design-forces/availability/
excerpt: "The degree to which a system, subsystem or equipment is in a specified operable and committable state at the (random) start of a mission."
header:
  teaser: /assets/images/design-force-teaser.png
toc: true
last_modified_at: 2016-07-29T15:54:02-04:00
---

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


## Maximum observed running time

A software application can _apparently_ run as expected for a period of time, and then suddenly crash without previous notice. A common source of such a problem are _memory leakages_: due to a deficient programming, some parts of the system memory are blocked and never released when they are no longer used. The leakage can be slow, and the system memory huge, but this situation will eventually end up in a crash.

Another common source of such problems are _concurrency deadlocks_. Software applications that exploit task parallelism are exposed to be caught in unexpected scenarios that can cause a deadlock, blocking the application to further deliver position fixes. However, the application itself can implement a _watchdog_, an independent _thread_ monitoring this kind of situations and resetting the receiver to a known, working state. In such a case, the maximum expected response time of such process should be reported.

Such software defects are hard to identify and to fix. Even well-known, massively used commercial software applications are not free from this kind of problems. It is then required to report the _maximum_ period of time in which the software receiver has been observed to be in a functioning condition in order to provide an objective measurement.

Failures due to GNSS space and control segment failures, announced / reported service discontinuities, or general Operating System failures not directly ascribable to the software receiver should be discarded and not reported, unless constituting a performance hallmark and being reported as the interrupting cause.

Such a test should be reported as:

|----------
|  **Reported parameter**  |  **Description** |
|:-:|:--|
|--------------
| **Maximum observed execution time** | Maximum period of time in which the software-defined receiver has been observed to continually deliver position fixes in a clear-sky, working GNSS conditions. Units: preferably days. |
| **Interrupting cause**  | [Voluntary, Report, Unknown, N/A]: report the cause from which the observation time ended (for instance, with the terminal dump and logged info). N/A in case of not ended. |
| **Watchdog**  | [nominal watchdog response time, N/A]: If a _watchdog_ system is present, report of the expected maximum time between the presence of a problem and a receiver reset. |
| **Signal** | Targeted GNSS signal(s) during the test. |
| **Source** | [`Live`, `Sim`, `File`]: `Live` for GNSS signals from space, `Sim` for or simulated GNSS signals generated at RF, `File` for a pre-defined set of signal inputs, stored in files. |
| **Processing platform**  | Brand and model of the processing platform performing the test. |
| **Operating system**  | Brand and release of the operating system in which the software receiver undergoing the test was executed. |
| **Source code unique ID** | Software release version, D.O.I., Git hash, or any other unique identifier. |
|----------

**Example of report**: For a software-defined receiver being observed to successfully deliver position fixes over a week using live signals, when executing version X.Y.Z of the software receiver in a Brand B, Model M machine under GNU/Linux Ubuntu 15.04 64 bits, with no watch dog, the results would be presented as:


|----------
|  **Max. observed exec. time**  |  **Interrupting cause** | **Watchdog** | **Signal** | **Source** | **Processing platform** | **Operating system** |  **Source code unique ID**  |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|--------------
| 7 days | N/A | N/A | 1C | Live | Brand B, Model M | Ubuntu 15.04 (64 bits) | X.Y.Z |
|--------------

## Time-To-First-Fix (TTFF)

The TTFF indicator provides a measurement of the time required for a static receiver to provide a valid position fix after the receiver is started. A _valid_ position fix is required to have a 3D accuracy below a given threshold (for instance, 600 m for GPS L1 C/A signals). The value includes the time to recover ephemeris data from all satellites used in the navigation estimation process.

When a software receiver starts its execution, it can retrieve some previously stored information in order to accelerate certain processes. Depending on the kind of stored information, and its validity, three starting receiver's state scenarios are defined:

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

A total of at least 20 valid TTFF samples shall be produced for use in data analysis[^ION101] and the total sample size recorded as $$ L $$. Provisions must be made between samples to ensure that current ephemeris does not remain in the receiver. In order to make the measurement as independent as possible of the satellite geometry, measurements should be spread in an interval of 8 hours.

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
| **Init. status** | [`cold`, `warm`, `hot`]: Initial receiver status, as defined above.  |
| **Nav. mode** | [`2D`, `3D`]: `3D` Navigation mode in which at least four satellite signals are received and are used to compute positioning data containing as a minimum: time tagged latitude, longitude, and altitude referenced to a given coordinate system.  / `2D` Navigation mode in which no fewer than three satellite signals and fixed altitude are received and used to compute positioning data containing as a minimum: time tagged latitude, longitude, and fixed altitude referenced to a given system.    |
|  **DGNSS**  | [`Y`, `N`]: `Y` if an external system is providing ephemeris data, `N` if the receiver is not receiving external information. |
| **Signal** | Targeted GNSS signal(s) during the test. |
| **Source** | [`Live`, `Sim`, `File`]: `Live` for GNSS signals from space, `Sim` for or simulated GNSS signals generated at RF, `File` for a pre-defined set of signal inputs, stored in files. |
| **Processing platform**  | Brand and model of the processing platform performing the test. |
| **Operating system**  | Brand and release of the operating system in which the software receiver undergoing the test was executed. |
| **Source code unique ID** | Software release version, D.O.I., Git hash, or any other unique identifier. |
|--------------

**Example of report**: For a receiver with a mean TTFF of 90 seconds, minimum measured value of 75 seconds, maximum measured value of 110 seconds, valid sample size of 20 with no invalid samples, sample deviation of 8 seconds, using GPS L1 C/A signals in 3D mode, and assuming a cold start with no external source of information, when executing version X.Y.Z of the software receiver in a Brand B, Model M machine under GNU/Linux Ubuntu 15.04 64 bits, the results would be presented as:

|----------
|  **Mean TTFF**  |  **Max TTFF** | **Min TTFF** | **Sample Dev / Size** | **Init. status** | **Nav. Mode** | **DGNSS** |  **Signal** | **Source** | **Processing platform** | **Operating system** |  **Source code unique ID**  |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|--------------
| 90 | 110 | 75 | 8 (20 of 20) | cold | 3D | N | 1C | Live | Brand B, Model M | Ubuntu 16.04 (64 bits) | X.Y.Z |
|--------------


## Reacquisition Time

Reacquisition time characterizes the performance of the receiver in a scenario where the signal is greatly reduced or interrupted for some short period of time and is then restored. An example of this would be a vehicle going through a tunnel or under some heavy tree cover. In this case the receiver is briefly unable to track most or all of the satellites, but must re-acquire (track) the signal when "visibility" is restored.

The test measurement system must be configured to record the time at which signals are removed from the receiver ($$ t_1 $$) and the time at which signals are reapplied to the receiver ($$ t_2 $$). All navigation data produced by the receiver should be recorded for subsequent data analysis. Each REAQ sample is computed as the time interval beginning at $$ t_2 $$ and ending with the first valid navigation data point derived from live or simulated satellite signals which is within the accuracy limits specified for the targeted signal(s).


A total of at least 50 valid REAQ samples should be produced for use in data analysis[^ION101].

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
| **Nav. mode** | [`2D`, `3D`]: `3D` Navigation mode in which at least four satellite signals are received and are used to compute positioning data containing as a minimum: time tagged latitude, longitude, and altitude referenced to a given coordinate system.  /  `2D` Navigation mode in which no fewer than three satellite signals and fixed altitude are received and used to compute positioning data containing as a minimum: time tagged latitude, longitude, and fixed altitude referenced to a given system.    |
|  **DGNSS**  | [`Y`, `N`]: `Y` if an external system is providing data, `N` if the receiver is not receiving external information. |
| **Signal** | Targeted GNSS signal(s) during the test. |
| **Source** | [`Live`, `Sim`, `File`]: `Live` for GNSS signals from space, `Sim` for or simulated GNSS signals generated at RF, `File` for a pre-defined set of signal inputs, stored in files. |
| **Processing platform**  | Brand and model of the processing platform performing the test. |
| **Operating system**  | Brand and release of the operating system in which the software receiver undergoing the test was executed. |
| **Source code unique ID** | Software release version, D.O.I., Git hash, or any other unique identifier. |
|--------------


**Example of report**: For version X.Y.Z of the software receiver executed in a Brand B, Model M machine under GNU/Linux Ubuntu 15.04 64 bits, obtaining a mean REAQ of 5 seconds for 30 second blockage, with a valid sample size of 50 plus 2 invalid samples, minimum measured value of 2 seconds, maximum measured value of 35 seconds, sample deviation of 1 second, using 30 navigation mode and simulated Galileo E1 open signals, the results would be presented as:


|----------
|  **Mean REAQ**  |  **Blockage Time** |**Max REAQ** | **Min REAQ** | **Sample Dev / Size** | **Nav. Mode** | **DGNSS** | **Signal** | **Source** | **Processing platform** | **Operating system** |  **Source code unique ID**  |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|--------------
| 5 | 30 | 2 | 35 | 1 (50 of 52) | 3D | N | 1B | Sim | Brand B, Model M | Ubuntu 16.04 (64 bits) | X.Y.Z |
|--------------

## Acquisition sensitivity

Acquisition sensitivity determines the minimum signal power threshold that allows the receiver to successfully perform a cold start TTFF within a specified time frame. The generation of testing inputs is as follows: fixing the number of visible satellites to one, the power level of the received signal is set such that the GNSS software receiver under test can detect the single GNSS satellite signal within a given probability of detection. The power level of the GPS satellite signal is then decreased until the GNSS receiver is not able to acquire that satellite signal.

Sensitivity is one of the most important measurements of a GNSS receiver's capability. In fact, for many commercial-grade GNSS receivers, it is often the only RF measurement performed in production test of the final product.
{: .notice--info}

A receiver's sensitivity is highly dependent on the noise figure of the RF front-end. This relation can be written as:

$$ \begin{equation} \text{Sensitivity} =  N_{\text{dBm}} + {C/N_0}_{\text{min}} + \text{NF}_{\text{Rx}} \end{equation} $$

where:

  * $$  N_{\text{dBm}} = 10 \cdot log_{10}(k \times T_0  \times 1000) $$ is the noise power, in dBm, where $$ k = 1.38 \cdot 10^{-23} $$  Joules per Kelvin is the Boltzmann's constant and $$ T_0 $$ is the temperature of the receiver system in Kelvin. Assuming that the physical temperature of the system is 290 Kelvin, $$ N_{\text{dBm}} = -174 $$ dBm.
  * $$ {C/N_0}_{\text{min}} $$ is the minimum $$ C/N_0 $$ required for signal acquisition, in dB-Hz.
  * $$ \text{NF}_{\text{Rx}} $$ is the receiver's noise figure, in dB.

When performing  sensitivity measurements, RF power-level accuracy is one of the most important characteristics of the signal generator. Because receivers report $$ C/N_0 $$ to within $$ 0 $$ digits of precision (for instance: $$ 34 $$ dB-Hz), sensitivity measurements in production test are made within $$ \pm 0.5 $$ dB of power accuracy.

Thus, it is important to ensure that your instrumentation  for RF signal generation has equal or better performance. Because general-purpose RF instrumentation is specified for operation across a broad range of power levels, frequency ranges, and temperature conditions, you can often achieve measurement repeatability that is much better than the specified instrument performance by implementing a basic system calibration.

Hence, only the $$ {C/N_0}_{\text{min}} $$ term is responsibility of the software receiver, whereas the noise figure is related to the hardware implementation of the RF front-end. From a digital signal processing perspective, the usual approach for improving acquisition sensitivity is the extension of the coherent integration time $$ T_{\text{int}} $$. However, there are several limitations to this method:

  * **The presence of data-bit transitions modulating the ranging code**. Each transition introduces a sign reversal in successive correlation blocks, such that their coherent accumulation leads to the potential loss of the correlation peak. Therefore, the availability of an external-aiding source is crucial to extend $$ T_{\text{int}} $$ to be larger than the data bit duration. This approach is referred to as the aided (or assisted) signal acquisition, and it is a part of the Assisted GNSS (A-GNSS) positioning method defined by different standardization bodies such as 3GPP and OMA.
  * **Local oscillator stability**. The uncertainty on the actual frequency value delivered by the front-end's local oscillator gives rise to effects very similar to those caused by a Doppler shift, and hence to an additional correlation loss. Using a simple model for time deviation between the clock with the true oscillator and an ideal clock,
  $$ x_{LO}(t) = x_0 + y_0 t $$, where $$ x_0 $$ is an initial synchronization error between real and ideal clocks, $$ y_0 $$ is a constant frequency offset and $$ t $$ is the time elapsed since the initial synchronization epoch, the output of the sampling process will be $$ x[n] = x \left( \frac{n}{f_s} + x_0 + y_0 \frac{n}{f_s} \right) $$, which is affected by a time-variant delay with respect to the ideal case. This might cause correlation losses, specially when $$ T_{\text{int}} $$ is large.

Acquisition sensitivity is quite dependant of the radio frequency front-end (including the antenna / cable connection to a RF generator) that was used to capture signals (either live signals or simulated). It is then a good practice to provide technical details of the front-end equipment used in the testing procedures when reporting acquisition sensitivity of a software-defined receiver. Ideally, input signals should be generated digitally and stored in files in order to remove this limitation and to provide a measure for which the software-defined receiver is the sole responsible.
{: .notice--info}

The generation of testing inputs is as follows: fixing the number of visible satellites to one, the power level of the received signal is set such that the GNSS software receiver under test can detect the single GNSS satellite signal within a given probability of detection. The power level of the GPS satellite signal is then decreased until the GNSS receiver is not able to acquire that satellite signal. This power level and the corresponding GNSS software receiver under test reported carrier-to-noise density ratio ($$ C/N_0 $$) should be collected as data. The received power level at the beginning of this scenario is $$ -140 $$ dBm, and it is decreased by $$ 1 $$ dB in each acquisition procedure.

|----------
|  **Reported parameter**  |  **Description** |
|:-:|:--|
|--------------
|  **Acquisition sensitivity**  | Minimum signal power level, in dBm, for which the receiver is able to acquire it, for a given probability of detection. |
|  **$$ C/N_0 $$**  | $$ C/N_0 $$ value, in dB-Hz, reported by the receiver when the input signal is set to the acquisition sensitivity power level. |
| **RF front-end** | In the case that the input signals were originally captured from a RF source, identification (brand and model) of the RF front-end that was used to gather input signals, including the local oscillator nominal stability and possible attenuators used in the set up. 'N/A' in case of input signals generated digitally and stored in files. |
| **Signal** | Targeted GNSS signal(s) during the test. |
| **Source** | [`Live`, `Sim`, `File`]: `Live` for GNSS signals from space, `Sim` for or simulated GNSS signals generated at RF, `File` for a pre-defined set of signal inputs, stored in files. |
| **DGNSS** |  [`Y`, `N`]: `Y` if an external system is providing data, `N` if the receiver is not receiving external information. |
| **Processing platform**  | Brand and model of the processing platform performing the test. |
| **Operating system**  | Brand and release of the operating system in which the software receiver undergoing the test was executed. |
| **Source code unique ID** | Software release version, D.O.I., Git hash, or any other unique identifier. |
|--------------

**Example of report**: For version X.Y.Z of the software receiver executed in a Brand B, Model M machine under GNU/Linux Ubuntu 15.04 64 bits, obtaining an acquisition sensitivity of -147 dBm reporting a $$ C/N_0 $$ of 30 dB-Hz, using simulated Galileo E1 open signals, the results would be presented as:


|----------
|  **Acq. sensitivity**  |  **$$ C/N_0 $$** | **RF front-end**  | **Signal** | **Source** | **DGNSS** | **Processing platform** | **Operating system** |  **Source code unique ID**  |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|--------------
| -147 | 30 | N/A | 1B | File | N | Brand B, Model M | Ubuntu 16.04 (64 bits) | X.Y.Z |
|--------------


## Tracking sensitivity

Tracking sensitivity refers to the minimum signal level that allows the receiver to maintain a location fix within some specified degree of accuracy. The generation of testing inputs is as follows: fixing the number of visible satellites to one, the power level of the received signal is set such that the GNSS software receiver under test can identify the single GNSS satellite signal. The power level of the GNSS satellite signal is then decreased until the GNSS receiver loses tracking of the single satellite. This power level and the corresponding GNSS software receiver under test reported carrier-to-noise density ratio ($$ C/N_0 $$) should be collected as data.

All the effects explained above for acqusition sensitivity apply as well to tracking sensitivity, where the definition of $$ {C/N_0}_{\text{min}} $$ is now:

  * $$ {C/N_0}_{\text{min}} $$ is the minimum $$ C/N_0 $$ required for signal tracking, in dB-Hz.

and the concept of _integration time_ is now called _correlation length_. The usual approach to improve tracking sensitivity is to span the correlation length to more than one codeword period, but again the same limitations apply: the presence of data bit transitions and the stability of the RF front-end's local oscillator.

The generation of testing inputs is as follows: fixing the number of visible satellites to one, the power level of the received signal is set such that the GNSS software receiver under test can identify the single GNSS satellite signal. The power level of the GNSS satellite signal is then decreased until the GNSS receiver loses tracking of the single satellite. This power level and the corresponding GNSS receiver reported $$ C/N_0 $$ should be collected as data. The received power level at the beginning of this scenario is $$ -130 $$ dBm, and it is decreased by $$ 1 $$ dB at $$ 60 $$-second intervals.

Another possible receiver sensitivity test is to measure the power level and $$ C/N_0 $$ level at which 3D location fix is lost. This is a similar procedure as above but using eight visible satellites from the same constellation. The power level of the received signals are then decreased until the 3D location fix is lost. Again, the power level and the corresponding GNSS software receiver under test reported $$ C/N_0 $$ are collected as data.


|----------
|  **Reported parameter**  |  **Description** |
|:-:|:--|
|--------------
|  **Tracking sensitivity**  | Minimum signal power level, in dBm, for which the receiver is able to keep track of the signal under some pre-defined error bounds. |
|  **$$ C/N_0 $$**  | $$ C/N_0 $$ value, in dB-Hz, reported by the receiver when the input signal is set to the tracking sensitivity power level. |
| **Test mode** | [`Single`, `Multiple`]: `Single` in case of the single signal test described above measuring tracking loss, and `Multiple` in case of using multiple signals and measuring the availability of 3D location fixes. |
| **RF front-end** | In the case that the input signals were originally captured from a RF source, identification (brand and model) of the RF front-end that was used to gather input signals, including the local oscillator nominal stability and possible attenuators used in the set up. N/A' in case of input signals generated digitally and stored in files. |
| **Signal** | Targeted GNSS signal(s) during the test. |
| **Source** | [`Live`, `Sim`, `File`]: `Live` for GNSS signals from space, `Sim` for or simulated GNSS signals generated at RF, `File` for a pre-defined set of signal inputs, stored in files. |
| **Processing platform**  | Brand and model of the processing platform performing the test. |
| **Operating system**  | Brand and release of the operating system in which the software receiver undergoing the test was executed. |
| **Source code unique ID** | Software release version, D.O.I., Git hash, or any other unique identifier. |
|--------------

**Example of report**: For version X.Y.Z of the software receiver executed in a Brand B, Model M machine under GNU/Linux Ubuntu 15.04 64 bits, obtaining an acquisition sensitivity of -163 dBm reporting a $$ C/N_0 $$ of 28 dB-Hz, using one simulated Galileo E1 open signal and no external data, the results would be presented as:

|----------
|  **Trk. sensitivity**  |  **$$ C/N_0 $$** | **Test Mode** | **RF front-end**  | **Signal** | **Source** | **DGNSS** | **Processing platform** | **Operating system** |  **Source code unique ID**  |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|--------------
| -163 | 28 | Single | N/A | 1B | File | N | Brand B, Model M | Ubuntu 16.04 (64 bits) | X.Y.Z |
|--------------


## Indicators of Availability

It follows a list of possible availability indicators for a software-defined GNSS receiver:

* Maximum observed running time, measured and reported as explained above, and for each of the _running modes_ (that is, for all the GNSS signal combinations) allowed by the software receiver.
* Time To First Fix (TTFF), measured and reported as explained above for cold, warm and hot starts, and for each of the _running modes_ (that is, for all the GNSS signal combinations) allowed by the software receiver.
* Reacquisition Time, measured and reported as explained above, for each of the for each of the GNSS signals allowed by the software receiver.
* Acquisition sensitivity, measured and reported as explained above, for each of the GNSS signals allowed by the software receiver.
* Tracking sensitivity, measured and reported as explained above, for each of the GNSS signals allowed by the software receiver.


In case of using differential GNSS techniques:

* Availability and continuity of a minimum number of input data streams.
* Availability of corrections for precise positioning.
* Corrections’ latency / generation time.
* Convergence time to subdecimeter level.
* Phase ambiguity fixing success rate.
* Baseline maximum length.


In case of using assisted GNSS techniques:

* Availability of an external service delivering assisted GNSS data.

------


## References

[^ION101]: Institute of Navigation, _ION STD 101 recommended test procedures for GPS receivers,_ Revision C, Manassas, VA, 1997.

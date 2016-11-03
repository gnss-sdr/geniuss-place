---
title: "Observables"
permalink: docs/sp-blocks/observables/
excerpt: "Documentation for the Observables block"
sidebar:
  nav: "sp-block"
modified: 2016-04-13T15:54:02-04:00
---
{% include toc %}

The role of an _Observables_ block is to collect the synchronization data coming from all the processing Channels, and to compute from them the GNSS basic measurements: **pseudorange** and **carrier phase**.
{: .notice--info}

The **pseudorange measurement** is defined as the difference of the time of reception (expressed in the time frame of the receiver) and the time of transmission (expressed in the time frame of the satellite) of a distinct satellite signal. It can be modeled as follows:

$$ P = \rho + c \left( dt_r - dt^s \right) + d_{\text{trop}} + d_{\text{ion}} + d_{\rho} + k_{P_r} - k_{P_s} + d_{P_{\text{multipath}}} + \epsilon_P $$

where:

  * $$ P $$ is the pseudorange measurement.
  * $$ \rho $$ is the true range.
  * $$ c $$ is the speed of light.
  * $$ dt_r  $$ is the satellite clock offset from GNSS time.
  * $$ dt^s $$ is the receiver clock offset from GNSS time.
  * $$ d_{\text{trop}} $$ is the tropospheric delay.
  * $$ d_{\text{ion}} $$ is the ionospheric delay.
  * $$ d_{\rho} $$ models satellite orbital errors, since the orbits of the satellites are affected by many factors including the variations in gravity, drag and tidal forces from the sun, the moon etc.
  * $$ k_{P_r} $$ models receiver's instrumental delays.
  * $$ k_{P_s} $$ models satellites's instrumental delays.
  * $$ d_{P_\text{multipath}} $$ models the effect of multipath on code delay estimation.
  * $$ \epsilon_P $$ models the receiver's thermal noise.


GNSS-SDR performs pseudorange generation based on setting a **common reception time** across all channels[^Petovello12]. The result of this approach is not an absolute pseudorange, but a relative pseudorange with respect to the value (of pseudorange) allocated for a _reference_ satellite. This is possible thanks to the time of week (TOW) information, that is the epoch conveyed by the navigation message, and the associated reception time $$ t_{\text{RX}} $$, that is the epoch measured by the receiver's time counter, both available for each satellite.

The first step performed by the common reception time algorithm is the selection of a reference satellite: it is the satellite with the most recent TOW (which is the nearest satellite), denoted as $$ \text{TOW}_\text{ref} $$, whose associated $$ t_{\text{RX}_\text{ref}} $$ is taken as the common reception time for all channels. An initial travel time ($$ \tau_\text{ref} = 68.802 $$ ms is assigned to this satellite, but in general it is a value between $$ 65 $$ and $$ 85 $$ milliseconds according to the user altitude) that can be easily converted in meters considering the speed of light. Then, the pseudoranges for all other satellites are derived by adding the relative-arrival times. Each travel time $$ \tau $$ can be computed as:

$$ \tau^{(i)} = \Delta \text{TOW} + \Delta t_\text{RX} + \tau_\text{ref} = \text{TOW}^{(i)}-\text{TOW}_\text{ref}+t_\text{RX}^{(i)}-t_{\text{RX}_\text{ref}} + \tau_\text{ref} $$

where $$ \Delta \text{TOW} $$ is the difference between the reference TOW and the current TOW of the $$ i $$-th satellite; $$  \Delta t_\text{RX} $$ is the time elapsed between the reference $$ t_{\text{RX}_\text{ref}} $$ and the actual receiver time, when the pseudorange must be computed for the specific satellite. This method is equivalent to taking a snapshot of all the channels' counters at a given time, and thus it can produce pseudoranges at any time, without waiting for a particular bit front on each channel.

The block diagram of such approach is shown below:


![Pseudorange computation]({{ site.url }}{{ site.baseurl }}/images/common-reception-time.png)
_Block diagram of the pseudorange computation using the common reception time approach in GNSS-SDR[^Arribas14]_
{: style="text-align: center;"}

Note that, in the case of a multi-system receiver, all pseudorange observations must be referred to one receiver clock only.


The **carrier phase measurement** is actually a measurement on the beat frequency between the received carrier of the satellite signal and a receiver-generated reference frequency. It can be modeled as:

$$ \Phi = \rho + c \left( dt_r - dt^s \right) +  d_{\text{trop}} - d_{\text{ion}} +  k_{L_r} - k_{L_s} + \lambda_L N_L + \lambda_L \omega + d_{L_{\text{multipath}}}  + \epsilon_L $$

where:

  * $$ \Phi $$ is the carrier phase measurement.
  * $$ c $$ is the speed of light.
  * $$ dt_r $$ is the satellite clock offset from GNSS time.    
  * $$ dt^s $$ is the receiver clock offset from GNSS time.
  * $$ d_{\text{trop}} $$ is the tropospheric delay.
  * $$ d_{\text{ion}} $$ is the ionospheric delay.
  * $$ k_{L_r} $$ models receiver's carrier phase instrumental delays.
  * $$ k_{L_s} $$ models satellites's carrier phase instrumental delays.
  * $$ \lambda_L $$ is the carrier wavelength.
  * $$ N_L $$ represents the integer ambiguity.
  * $$ \lambda_L \omega $$  is the [wind-up](http://www.navipedia.net/index.php/Carrier_Phase_Wind-up_Effect){:target="_blank"} term due to the circular polarization of the electromagnetic signal.
  * $$ d_{L_{\text{multipath}}} $$ models the effect of multipath on carrier phase estimation.
  * $$ \epsilon_L $$ models the receiver's thermal noise.

Notice that the ionospheric term has opposite sign for code and phase. This means that the ionosphere produces an advance of the carrier phase measurement equal to the delay on the code measurements.

As shown in a paper by Petovello and O'Driscoll[^Petovello10], the carrier phase measurement delivered by the receiver can be written as:

$$ \Phi^{(i)} (t_{\text{Rx}})= \frac{r(t_{\text{Rx}})}{\lambda} + \phi_{\text{mix}}(0) - \phi^{s_i}(0) + N^{(i)} (t_{\text{Rx}}) $$

where:

  * $$ t_{\text{Rx}} $$ is the signal reception time.
  * $$ r(t_{\text{Rx}}) $$ is the range from the satellite to the receiver at time $$ t_{\text{Rx}} $$.
  * $$ \lambda $$ is the radio frequency wavelegth.
  * $$ \phi_{\text{mix}}(0) $$ is an initial phase offset of the locally-generated mixer signal.
  * $$ \phi^{s_i}(0) $$ is an initial satellite phase offset.
  * $$ N^{(i)} (t_{\text{Rx}}) = L^{(i)} (t_{\text{Rx}}) - K^{(i)} (t_{\text{Rx}}) $$ is the integer ambiguity, where:
    * $$ L^{(i)} (t_{\text{Rx}}) $$ is the integer component of the NCO phase.
    * $$ K^{(i)} (t_{\text{Rx}}) $$ is the integer component of the term $$ \left( \frac{r(t_{\text{Rx}})}{\lambda} +\phi_{\text{mix}}(0)- \phi^{s_i}(0) \right) $$.

In order to generate useable phase measurements, the receiver phase observations must maintain a contant integer number of cycles offset from the true carrier phase. That is, if the range increases by one cycle (_i.e._, one wavelength), the integer component of the NCO, denoted as $$ L^{(i)} (t_{\text{Rx}}) $$, also increments by one cycle.


### Implementation: `GPS_L1_CA_Observables`

This implementation computes observables by collecting the outputs of channels for GPS L1 C/A signals.

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `GPS_L1_CA_Observables` | Mandatory |
| `averaging_depth` | Number of observables used in a moving average filter. It defaults to $100$. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Observables internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./observables.dat` | Optional |
|--------------

  _Observables implementation:_ **`GPS_L1_CA_Observables`**.
  {: style="text-align: center;"}

Example:

```ini
    ;######### OBSERVABLES CONFIG ############
    Observables.implementation=GPS_L1_CA_Observables
    Observables.dump=true
    Observables.dump_filename=./my_observables.dat
```

### Implementation: `Galileo_E1B_Observables`

This implementation computes observables by collecting the outputs of channels for Galileo E1B signals.

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Galileo_E1B_Observables` | Mandatory |
| `averaging_depth` | Number of observables used in a moving average filter. It defaults to $100$. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Observables internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./observables.dat` | Optional |
|--------------

  _Observables implementation:_ **`Galileo_E1B_Observables`**.
  {: style="text-align: center;"}

Example:

```ini
    ;######### OBSERVABLES CONFIG ############
    Observables.implementation=Galileo_E1B_Observables
```



### Implementation: `Hybrid_Observables`  

This implementation computes observables by collecting the outputs of channels for all kind of allowed GNSS signals. **You always can use this implementation in your configuration file, since it accepts all kind of (single- or multi-band, single- or multi-constellation) receiver configurations.**

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Hybrid_Observables` | Mandatory |
| `averaging_depth` | Number of observables used in a moving average filter. It defaults to $100$. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Observables internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./observables.dat` | Optional |
|--------------

  _Observables implementation:_ **`Hybrid_Observables`**.
  {: style="text-align: center;"}

Example:

```ini
    ;######### OBSERVABLES CONFIG ############
    Observables.implementation=Hybrid_Observables
```

----

## References

[^Arribas14]: J. Arribas, M. Branzanti, C. Fern&aacute;ndez-Prades and P. Closas, [_Fastening GPS and Galileo Tight with a Software Receiver_](https://www.ion.org/publications/abstract.cfm?jp=p&articleID=12428){:target="_blank"}, in Proc. of the 27th International Technical Meeting of The Satellite Division of the Institute of Navigation (ION GNSS+ 2014), Tampa, Florida, Sep. 2014, pp. 1383 - 1395.

[^Petovello12]: M. Petovello, M. Rao, G. Falca, [_Code Tracking and Pseudoranges: How can pseudorange measurements be generated from code tracking?_](http://www.insidegnss.com/auto/IGM_janfeb12-Solutions.pdf){:target="_blank"}, Inside GNSS, vol. 7, no. 1, pp. 26–33, Jan./Feb. 2012.

[^Petovello10]: M. Petovello, C. O'Driscoll, [_Carrier phase and its measurements for GNSS: What is the carrier phase measurement? How is it generated in GNSS receivers?_](http://www.insidegnss.com/auto/julaug10-solutions.pdf){:target="_blank"} Inside GNSS, vol. 5, no. 5, pp. 18–22, Jul./Aug. 2010.

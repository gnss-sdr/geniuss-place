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

The pseudorange is defined as follows:

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
  * $$ d_{P_\text{multipath}}} $$ represents the effect of multipath.
  * $$ \epsilon_P $$ models the receiver's noise.



The carrier phase measurements can be modeled as:

$$ \Phi = \rho + c \left( dt_r - dt^s \right) +  d_{\text{trop}} - d_{\text{ion}} +  k_{L_r} - k_{L_s} + \lambda_L N_L + \lambda_L \omega + d_{L_{\text{multipath}}}  + \epsilon_L $$

where:

  * $$ \Phi $$ is the carrier phase measurement
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
  * $$ \epsilon_L $$ models the receiver's noise.

Notice that the ionospheric term has opposite sign for code and phase. This means that the ionosphere produces an advance of the carrier phase measurement equal to the delay on the code measurements

### Implementation: `GPS_L1_CA_Observables`

Parameters:

|----------
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `flag_averaging` |  . It defaults to `false`. | Optional |
| `output_rate_ms` |  . It defaults to 500 ms. | Optional |
| `dump` |  . It defaults to `false`. | Optional |
| `dump_filename` |  . It defaults to `./navigation.dat` | Optional |
|--------------

  _Observables implementation:_ **`GPS_L1_CA_Observables`**.
  {: style="text-align: center;"}

Example:

```ini
    ;######### OBSERVABLES CONFIG ############
    Observables.implementation=GPS_L1_CA_Observables
    Observables.dump=false
    Observables.dump_filename=./observables.dat
```

### Implementation: `Galileo_E1B_Observables`

Parameters:

|----------
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `flag_averaging` |  . It defaults to `false`. | Optional |
| `output_rate_ms` |  . It defaults to 500 ms. | Optional |
| `dump` |  . It defaults to `false`. | Optional |
| `dump_filename` |  . It defaults to `./navigation.dat` | Optional |
|--------------

  _Observables implementation:_ **`Galileo_E1B_Observables`**.
  {: style="text-align: center;"}

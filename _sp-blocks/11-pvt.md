---
title: "PVT"
permalink: /docs/sp-blocks/pvt/
excerpt: "Documentation for the PVT block"
sidebar:
  nav: "sp-block"
last_modified_at: 2017-05-103T15:54:02-04:00
---
{% include toc %}

The _PVT_ block is the last one in the GNSS-SDR flow graph. Hence, it acts as a signal sink, since the stream of data flowing along the receiver ends here.

The role of a _PVT_ block is to compute navigation solutions and deliver information in adequate formats for further processing or data representation.
{: .notice--info}

## Positioning modes

The positioning problem is generally stated as

$$ \mathbf{y} = \mathbf{h}(\mathbf{x}) +  \mathbf{n} $$

where $$ \mathbf{y} $$ is the measurement vector (that is, the observables obtained from the GNSS signals of a set of $$ m $$ satellites), $$ \mathbf{x} $$ is the state vector to be estimated (at least, the position of the receiver's antenna and the time), $$ \mathbf{h}(\cdot) $$ is the function that relates states with measurements, and $$ \mathbf{n} $$ models measurement noise. Depending on the models, assumptions, available measurements and the availability of *a priori* or externally-provided information, many positioning strategies and algorithms can be devised. It follows a description of the positioning modes available at the `RTKLIB_PVT` implementation, mostly extracted from the excellent [RTKLIB manual](http://www.rtklib.com/prog/manual_2.4.2.pdf){:target="_blank"}.

[^RTKLIBManual]: T. Takasu, [RTKLIB ver. 2.4.2 Manual](http://www.rtklib.com/prog/manual_2.4.2.pdf){:target="_blank"}. April 29, 2013.

### Single Point Positioning

The default positiong mode is `PVT.positioning_mode=Single`. In this mode, the vector of unknown states is defined as:

$$ \mathbf{x} = ( \mathbf{r}_r^T, cdt_r)^T $$

where $$ \mathbf{r}_r $$ is the receiver's antenna position in an earth-centered, earth-fixed (ECEF) coordinate system (in meters), $$ c $$ is the speed of light and $$ dt_r $$ is the receiver clock bias (in seconds).

The measurement vector is defined as:

$$ \mathbf{y} = ( P_r^{(1)}, P_r^{(2)}, P_r^{(3)}, ..., P_r^{(m)} )^T $$

As described in the [Observables]({{ "docs/sp-blocks/observables/" | absolute_url }}) block, for a signal from satellite $$ s $$ in the *i*-th band, the pseudorange measurement $$ P_{r,i}^{(s)} $$ can be expressed as:

$$  P_{r,i}^{(s)} = \rho_r^{(s)} + c( dt_r(t_r) - dT^{(s)}(t^{(s)}) ) + I_{r,i}^{(s)} + T_r^{(s)} +\epsilon_P $$

Hence, the equation that relates pseudorange measurements to the vector of unknown states can be written as:

$$ \mathbf{h}(\mathbf{x}) = \left( \begin{array}{c} \rho_{r}^{(1)} + cdt_r - cdT^{(1)} + I_{r}^{(1)} + T_{r}^{(1)} \\  \rho_{r}^{(2)} + cdt_r - cdT^{(2)} + I_{r}^{(2)} + T_{r}^{(2)}  \\ \rho_{r}^{(3)} + cdt_r - cdT^{(3)} + I_{r}^{(3)} + T_{r}^{(3)}  \\ \vdots \\ \rho_{r}^{(m)} + cdt_r - cdT^{(m)} + I_{r}^{(m)} + T_{r}^{(m)} \end{array} \right) $$


The geometric range $$ \rho_r^{(s)} $$ is defined as the physical distance between the satellite antenna phase center position and the receiver antenna phase center position in the inertial coordinates. For the expression in the ECEF coordinates, the earth rotation effect has to be incorporated. This is known as the <span style="color: green">Sagnac effect</span> and it can be approximated by:

$$ \definecolor{dark-green}{RGB}{0,128,0} \color{dark-grey} \rho_{r}^{(s)} \approx \left\| \mathbf{r}_r(t_r) - \mathbf{r}^{(s)}(t^{(s)}) \right\| + \color{dark-green} \frac{\omega_e}{c}(x^{(s)}y_r - y^{(s)}x_r ) $$

where $$ \omega_e $$ is the Earth rotation angle velocity (in rad/s).

![Earth rotation correction]({{ "/assets/images/earth-rotation.png" | absolute_url }})
_Geometric range and Earth rotation correction [^RTKLIBManual]_
{: style="text-align: center;"}

Equation $$ \mathbf{h}(\mathbf{x}) $$ is clearly nonlinear due to the presence of the Eucliden norm operator $$ \left\| \cdot \right\| $$. However, this term can be extended by using Taylor series around an initial parameter vector $$ \mathbf{x}_0 $$ as $$ \mathbf{h}(\mathbf{x}) = \mathbf{h}(\mathbf{x}_0) + \mathbf{H}(\mathbf{x}-\mathbf{x}_0) + ... $$, where $$ \mathbf{H}= \frac{\partial \mathbf{h}(\mathbf{x})}{\partial \mathbf{x}} \bigg\rvert_{\mathbf{x} = \mathbf{x}_{0} } $$ is a partial derivatives matrix of $$ \mathbf{h}(\mathbf{x}) $$ with respect to $$ \mathbf{x} $$ at $$ \mathbf{x} = \mathbf{x}_{0} $$. Assuming that the initial parameters are adequately near the true values and the second and further terms of the Taylor series can be neglected, equation $$ \mathbf{y} = \mathbf{h}(\mathbf{x}) +  \mathbf{n} $$ can be approximated by $$ \mathbf{y} \approx \mathbf{h}(\mathbf{x}_0) + \mathbf{H}(\mathbf{x}-\mathbf{x}_0) + \mathbf{n} $$, and then we can obtain the following linear equation:

$$ \mathbf{y} - \mathbf{h}(\mathbf{x}_0) = \mathbf{H}(\mathbf{x}-\mathbf{x}_0) + \mathbf{n} $$

which can be solved by a standard weighted iterative least squares method.

Matrix $$ \mathbf{H} $$ can be written as

$$ \mathbf{H} = \left( \begin{array}{cc} -{\mathbf{e}_{r}^{(1)}}^T & 1 \\  -{\mathbf{e}_{r}^{(2)}}^T & 1 \\ -{\mathbf{e}_{r}^{(3)}}^T & 1 \\ \vdots & \vdots \\ -{\mathbf{e}_{r}^{(m)}}^T & 1 \end{array} \right), \quad \text{where } \mathbf{e}_r^{(s)}= \frac{\mathbf{r}^{(s)}(t^{(s)}) - \mathbf{r}_r(t_r) }{\left\| \mathbf{r}^{(s)}(t^{(s)}) - \mathbf{r}_r(t_r)  \right\|} $$

and the weighted least squares estimator (LSE) of the unknown state vector is obtained as:

$$ \hat{\mathbf{x}}_{i+1} = \hat{\mathbf{x}}_{i} + \left( \mathbf{H}^T \mathbf{W} \mathbf{H}\right)^{-1} \mathbf{H}^T \mathbf{W} \left(\mathbf{y} - \mathbf{h}(\hat{\mathbf{x}}_{i}) \right) $$


For the initial parameter vector $$ \mathbf{x}_0 $$ for the iterated weighted LSE, just all $$ 0 $$ are used for the first epoch of the single point positioning. Once a solution obtained, the position is used for the next epoch initial receiver position. For the weight matrix $$ \mathbf{W} $$, the `RTKLIB_PVT` implementation uses:

$$ \mathbf{W} = \text{diag} \left( \sigma_1^{-2}, \sigma_2^{-2}, \sigma_3^{-2}, ..., \sigma_m^{-2} \right) $$

$$ \sigma_{s}^{2} = F^{(s)} R_r \left( a_{\sigma}^2 + \frac{b_{\sigma}^2}{\sin \left( El_r^{(s)} \right)} \right) + \sigma_{eph}^2 + \sigma_{ion}^{2} + \sigma_{trop}^{2} + \sigma_{bias}^2  $$

where:

  - $$ F^{(s)} $$ is the satellite system error factor (1:GPS, Galileo, QZSS and BeiDou, 1.5: GLONASS, 3.0: SBAS)

  - $$ R_r $$ is the code/carrier‐phase error ratio

  - $$ a_{\sigma}, b_{\sigma} $$ is the carrier‐phase error factor $$ a $$ and $$ b $$ (in m).

  - $$ El_r^{(s)} $$ is the elevation angle of satellite direction (in rad).

  - $$ \sigma_{eph} $$ is the standard deviation of ephemeris and clock error (in m).

  - $$ \sigma_{ion} $$ is the standard deviation of ionosphere correction model error (in m). This parameter defaults to $$ $$, and the value can be changed by the option `PVT.sigma_iono`

  - $$ \sigma_{trop} $$ is the standard deviation of troposphere correction model error (in m). `PVT.sigma_trop`

  - $$ \sigma_{bias} $$ is the standard deviation of code bias error (in m). `PVT.sigma_bias`

The estimated receiver clock bias $$ dt_r $$ is not explicitly output, but incorporated in the solution time‐tag. That means the solution time‐tag indicates not the receiver time‐tag but the true signal reception time measured in [GPS Time](http://www.navipedia.net/index.php/Time_References_in_GNSS){:target="_blank"}.


### Static / Kinematic

Assuming the use of triple‐frequency GPS/GNSS receivers for both of the rover and the base‐station, the unknown state vector $$ \mathbf{x} $$ to be estimated can be defined as:

$$ \mathbf{x} = \left(\mathbf{r}_{r}^{T}, \mathbf{v}_{r}^{T} ,\mathbf{B}_{1}^{T} ,\mathbf{B}_{2}^{T} ,\mathbf{B}_{5}^{T} \right)^T $$

where $$ \mathbf{B}_{i} = \left ( B_{rb,i}^{(1)}, B_{rb,i}^{(2)}, B_{rb,i}^{(3)}, ..., B_{rb,i}^{(m)} \right) $$ are the single‐difference carrier‐phase biases (in cycles) for the $$ i $$-th band.


$$ \mathbf{y} = \left(\boldsymbol{\Phi}_{1}^T, \boldsymbol{\Phi}_{2}^T, \boldsymbol{\Phi}_{3}^T, \mathbf{P}_{1}^T, \mathbf{P}_{2}^T, \mathbf{P}_{5}^T \right)^T  $$

where:

  * $$ \boldsymbol{\Phi}_{i} = \left( \Phi_{rb,i}^{(12)}, \Phi_{rb,i}^{(13)}, \Phi_{rb,i}^{(14)}, ..., \Phi_{rb,i}^{(1m)}\right)^T  $$
  * $$ \mathbf{P}_{i} =  \left( P_{rb,i}^{(12)}, P_{rb,i}^{(13)}, P_{rb,i}^{(14)}, ..., P_{rb,i}^{(1m)} \right)^T$$


$$ \mathbf{h}(\mathbf{x}) = \left( \mathbf{h}_{\Phi,1}^{T}, \mathbf{h}_{\Phi,2}^{T} , \mathbf{h}_{\Phi,5}^{T}, \mathbf{h}_{P,1}^{T}, \mathbf{h}_{P,2}^{T} , \mathbf{h}_{P,5}^{T}  \right)^T $$

where:

  * $$  \mathbf{h}_{\Phi,i} = \left( \begin{array}{c} \rho_{rb}^{(12)} +\lambda_i (B_{rb}^{(1)} -B_{rb}^{(2)} ) \\  \rho_{rb}^{(13)} +\lambda_i (B_{rb}^{(1)} -B_{rb}^{(3)} )\\ \rho_{rb}^{(14)} +\lambda_i (B_{rb}^{(1)} -B_{rb}^{(4)}) \\ \vdots \\ \rho_{rb}^{(1m)} +\lambda_i (B_{rb}^{(1)} -B_{rb}^{(m)} ) \end{array} \right) \quad \mathbf{h}_{P,i} = \left(  \begin{array}{c} \rho_{rb}^{(12)} \\  \rho_{rb}^{(13)} \\ \rho_{rb}^{(14)} \\ \vdots \\ \rho_{rb}^{(1m)} \end{array}\right) $$


$$ \mathbf{H}(\mathbf{x}) = \frac{\partial  \mathbf{h}(\mathbf{x})}{\partial \mathbf{x}} \bigg\rvert_{\mathbf{x} = \hat{\mathbf{x}} } = \left( \begin{array}{ccccc} -\mathbf{DE} & \mathbf{0} & \lambda_1 \mathbf{D} & \mathbf{0}  & \mathbf{0} \\  -\mathbf{DE} & \mathbf{0}  & \mathbf{0} & \lambda_2 \mathbf{D} & \mathbf{0}  \\ -\mathbf{DE} & \mathbf{0}  & \mathbf{0} &  \mathbf{0} & \lambda_5 \mathbf{D} \\ -\mathbf{DE} & \mathbf{0}  & \mathbf{0} & \mathbf{0}  & \mathbf{0} \\ -\mathbf{DE} & \mathbf{0}  & \mathbf{0} & \mathbf{0}  & \mathbf{0} \\ -\mathbf{DE} & \mathbf{0}  & \mathbf{0} & \mathbf{0}  & \mathbf{0}  \end{array} \right) $$


$$ \mathbf{D} = \left( \begin{array}{ccccc} 1 & -1 & 0 & \cdots & 0 \\ 1 & 0 & -1 & \cdots & 0 \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 1 & 0 & 0 & \cdots & -1 \end{array} \right) $$

$$ \mathbf{E} = \left( \mathbf{e}_{r}^{(1)}, \mathbf{e}_{r}^{(2)}, \mathbf{e}_{r}^{(3)}, ..., \mathbf{e}_{r}^{(m)}  \right)^T $$

Time update (prediction):

$$ \hat{\mathbf{x}}_{k|k-1} = \mathbf{F}_k  \hat{\mathbf{x}}_{k-1|k-1} $$

$$ \mathbf{P}_{k|k-1} = \mathbf{F}_k  \mathbf{P}_{k-1|k-1}  \mathbf{F}_k^T + \mathbf{Q}_k $$

Measurement update (estimation):

$$ \mathbf{K}_k = \mathbf{P}_{k|k-1} \mathbf{H}_k(\hat{\mathbf{x}}_{k|k-1}) \left( \mathbf{H}_k(\hat{\mathbf{x}}_{k|k-1})\mathbf{P}_{k|k-1} \mathbf{H}_k(\hat{\mathbf{x}}_{k|k-1})^T+\mathbf{R}_k \right)^{-1}   $$

$$ \hat{\mathbf{x}}_{k|k} = \hat{\mathbf{x}}_{k|k-1} + \mathbf{K}_k \left( \mathbf{y}_k - \mathbf{h}_k(\hat{\mathbf{x}}_{k|k-1}) \right) $$

$$ \mathbf{P}_{k|k} = \left( \mathbf{I} -\mathbf{K}_{K} \mathbf{H}_k ( \hat{\mathbf{x}}_{k|k-1} )  \right)\mathbf{P}_{k|k-1} $$

### Precise Point Positioning

$$ \mathbf{x} = ( \mathbf{r}_r^T, \mathbf{v}_r^T, cdt_r, Z, G_{N_r}, G_{E_r}, \mathbf{B}_{LC}^T )^T $$

$$ \mathbf{y} = ( \boldsymbol{\Phi}_{LC}^T, \mathbf{P}_{LC}^T )^T $$




## Troposphere Model

### Saastamoinen

The standard atmosphere can be expressed as:

$$ p = 1013.15 \cdot (1-2.2557 \cdot 10^{-5} \cdot h)^{5.2568} $$

$$ T = 15.0 -6.5 \cdot 10^{-3} \cdot h + 273.15 $$

$$ e = 6.108  \cdot \exp\left\{\frac{17.15 T -4684.0}{T-38.45}\right\} \cdot \frac{h_{rel}}{100} $$   

where $$ p $$ is the total pressure (hPa), $$ T $$ is the absolute temperature (K) of the air, $$ h $$  is the geodetic height above MSL (mean sea level), $$ e $$ is the partial pressure (hPa) of water vapor and $$ h_{rel} $$ is the relative humidity. The tropospheric delay $$ T_{r}^{s} $$ is expressed by the Saastamoinen model with $$ p $$, $$ T $$ and $$ e $$ derived from the standard atmosphere:

$$ T_{r}^{s} = \frac{0.002277}{\cos(z)} \left\{ p+\left( \frac{1255}{T} + 0.05 \right) e - \tan(z)^2  \right\} $$

where $$ z $$ is the zenith angle (rad) as $$ z = \frac{\pi}{2} - El_{r}^{s} $$, where $$ El_{r}^{s} $$ is elevation angle of satellite direction (rad).

The standard atmosphere and the Saastamoinen model are applied in case that the processing option `trop_model` is set to `Saastamoinen`, where the geodetic height is approximated by the ellipsoidal height and the relative humidity is fixed to 70 %.

### SBAS

If the processing option `trop_model` is set to `SBAS`, the SBAS troposphere models defined in the SBAS receiver specifications are applied. The model often called as "MOPS model". Refer to [MOPS reference](http://standards.globalspec.com/std/1014192/rtca-do-229)[^MOPS], A.4.2.4 for details.


[^MOPS]: RTCA/DO‐229C, [Minimum operational performance standards for global positioning system/wide area augmentation system airborne equipment](http://standards.globalspec.com/std/1014192/rtca-do-229){:target="_blank"}, RTCA Inc., December 13, 2006.

## Estimate the tropospheric zenith total delay

If the processing option `trop_model` is set to `Estimate_ZTD`, a more precise troposphere model is applied with strict mapping functions as:

$$ m(El_{r}^{s}) = m_{W}(El_{r}^{s})\left\{1+\cot(El_{r}^{s}) \right\} $$

$$ T_{r}^{s} =  m_{H}(El_{r}^{s})Z_{H,r} + m(El_{r}^{s}) (Z_{T,r}-Z_{H,r}) $$

where $$ Z_{T,t} $$ is the tropospheric zenith total delay (m), $$ Z_{H,r} $$ is the tropospheric zenith hydro‐static delay (m), $$ m_{H}(El_{r}^{s}) $$ is the hydro‐static mapping function and $$ m_{W}(El_{r}^{s}) $$ is the wet mapping function. The tropospheric zenith hydro‐static delay is given by Saastamoinen model described above with the zenith angle $$ z = 0 $$ and relative humidity $$ h_{rel} = 0 $$. For the mapping function, the software employs the [Niell mapping function](http://www.navipedia.net/index.php/Mapping_of_Niell)[^Niell96]. The zenith total delay $$ Z_{T,r} $$ is estimated as a unknown parameter in the parameter estimation process.

[^Niell96]: A. E. Niell, [Global mapping functions for the atmosphere delay at radio wavelengths](http://dx.doi.org/10.1029/95JB03048){:target="_blank"}, Journal of Geophysical Research: Solid Earth, Volume 101, Issue B2 10, Feb. 1996, pp. 3227-3246.

## Estimate the tropospheric zenith total delay and gradient

If the processing option `trop_model` is set to `Estimate_ZTD_Grad`, a more precise troposphere model is applied with strict mapping functions as:

$$ m(El_{r}^{s}) = m_{W}(El_{r}^{s})\left\{1+\cot(El_{r}^{s}) \left( G_{N,r} \cos(Az_{r}^{s}) + G_{E,r} \sin(Az_{r}^{s})\right) \right\} $$

where $$ Az_{r}^{s} $$ is the azimuth angle of satellite direction (rad), and $$ G_{E,r} $$ and $$ G_{N,r} $$ are the east and north components of the tropospheric gradient, respectively. The zenith total delay $$ Z_{T,r} $$ and the gradient parameters $$ G_{E,r} $$ and $$ G_{N,r} $$ are estimated as unknown parameters in the parameter estimation process.

## Ionosphere Model

### Broadcast

For ionosphere correction for single frequency GNSS users, GPS navigation data include the following broadcast ionospheric parameters:

$$ \mathbf{p}_{ion} = ( \alpha_0, \alpha_1, \alpha_2, \alpha_3, \beta_0, \beta_1, \beta_2, \beta_3)^T $$

By using these ionospheric parameters, the L1 ionospheric delay $$ I_{r}^{s} $$ (m) can be derived the following
procedure [1]. The model is often called as Klobuchar model.

$$ \Psi = \frac{0.0137}{El + 0.11}-0.022 $$

$$ \psi_i = \psi + \Psi \cos(Az) $$

$$ \lambda_i = \lambda + \frac{\Psi \sin(Az)}{\cos(\psi_i)} $$

$$  \psi_m = \psi_i + 0.064 \cos(\lambda_i -1.617) $$

$$ t = 4.32 \cdot 10^4 \lambda_i +t $$

$$ F = 1.0 + 16.0 \cdot (0.43 - El)^3 $$


$$ x = \frac{2 \pi (t - 505400)}{ \sum_{n=0}^{3} \beta_n {\psi_m}^n} $$

$$ I_{r}^{s} = \left\{ \begin{array}{cc}  F \cdot 5 \cdot 10 ^{-9} & ( | x | > 1.57) \\ F \cdot \left( 5 \cdot 10^{-9}+ \sum_{n=1}^{4} \alpha_n  {\psi_m}^{n} \cdot \left( 1-\frac{x^2}{2}+\frac{x^4}{24} \right) \right) & ( | x | \leq 1.57)\end{array}   \right. $$

### SBAS


## Output formats

Depending on the specific application or service that is exploiting the information provided by GNSS-SDR, different internal data will be required, and thus the receiver needs to provide such data in an adequate, standard formats:

* For Geographic Information Systems, map representation and Earth browsers: [KML](http://www.opengeospatial.org/standards/kml){:target="_blank"} and [GeoJSON](http://geojson.org/){:target="_blank"}.
* For sensor integration: [NMEA-0183](https://en.wikipedia.org/wiki/NMEA_0183){:target="_blank"}.
* For post-processing applications: RINEX [2.11](https://igscb.jpl.nasa.gov/igscb/data/format/rinex211.txt){:target="_blank"} and [3.02](ftp://igs.org/pub/data/format/rinex302.pdf){:target="_blank"}.
* For real-time, possibly networked processing: [RTCM-104](http://www.rtcm.org/Pub-DGNSS.php){:target="_blank"} messages, v3.2.


In _PVT_ implementations that support it, KML files are generated automatically by default, upon the computation of the first position fix.

In _PVT_ implementations that support it, GNSS-SDR by default generates RINEX version [3.02](https://igscb.jpl.nasa.gov/igscb/data/format/rinex302.pdf){:target="_blank"}. If [2.11](https://igscb.jpl.nasa.gov/igscb/data/format/rinex211.txt){:target="_blank"} is needed, it can be requested through a commandline flag when invoking the software receiver:

   ```
   $ gnss-sdr --RINEX_version=2
   ```

In _PVT_ implementations that support it, the TCP/IP server of RTCM messages can be enabled by setting ```PVT.flag_rtcm_server=true``` in the configuration file, and will be active during the execution of the software receiver. By default, the server will operate on port 2101 (which is the recommended port for RTCM services according to the Internet Assigned Numbers Authority, [IANA](http://www.iana.org/assignments/service-names-port-numbers "Service Name and Transport Protocol Port Number Registry"){:target="_blank"}), and will identify the Reference Station with ID=1234. This behaviour can be changed through the configuration file.


**Important:** In order to get well-formatted GeoJSON, KML and RINEX files, always terminate ```gnss-sdr``` execution by pressing key '`q`' and then key '`ENTER`'. Those files will be automatically deleted if no position fix have been obtained during the execution of the software receiver.
{: .notice--warning}

Read more about standard output formats at our [**Interoperability**]({{ "/design-forces/interoperability/#output-formats" | absolute_url }}){:target="_blank"} page.
{: .notice--success}



## Implementation: `RTKLIB_PVT`


This implementation makes use of the positioning libraries of [RTKLIB](http://www.rtklib.com), a well-known open source program package for standard and precise positioning. It accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.SUPL_gps_ephemeris_xml` |  Name of an XML file containing GPS ephemeris data. It defaults to `./gps_ephemeris.xml` | Optional |
|--------------

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `RTKLIB_PVT` | Mandatory |
| `output_rate_ms` |  Rate at which PVT solutions will be computed, in ms. It defaults to 500 ms. | Optional |
| `display_rate_ms` |  Rate at which PVT solutions will be displayed in the terminal, in ms. It defaults to 500 ms. | Optional |
| `positioning_mode` | [`Single`, `Static`, `Kinematic`, `PPP_Static`, `PPP_Kinematic`] Set positioning mode. `Single`: Single point positioning. `Static`: Carrier‐based Static positioning. `Kinematic`: Carrier‐based Kinematic positioning. `PPP_Static`: Precise Point Positioning with static mode. It defaults to `Single`. | Optional |
| `num_bands` | [`1`: L1 Single frequency, `2`: L1 and L2 Dual‐frequency, `3`: L1, L2 and L5 Triple‐frequency] This option is automatically configured according to the Channels configuration. This option can be useful to force some configuration (*e.g.*, single-band solution in a dual frequency receiver).  | Optional |
| `elevation_mask` | Set the elevation mask angle, in degrees. It defaults to $$ 15^{o} $$.  | Optional |
| `dynamics_model` | [`0`: none, `1`: velocity, `3`: acceleration] Set the dynamics model of the rover receiver. It defaults to $$ 0 $$ (no dynamics model). | Optional |
| `iono_model` |  [`OFF`, `Broadcast`, `SBAS`, `Iono-Free-LC`, `Estimate_STEC`, `IONEX`]. Set ionospheric correction options. `OFF`: Not apply ionospheric correction. `Broadcast`: Apply broadcast ionospheric model. `SBAS`: Apply SBAS ionospheric model. `Iono‐Free-LC`: Ionosphere‐free linear combination with dual frequency (L1‐L2 for GPS/GLONASS/QZSS or L1‐L5 for Galileo) measurements is used for ionospheric correction. `Estimate_STEC`:  Estimate ionospheric parameter STEC (slant total electron content). `IONEX`: Use IONEX TEC grid data. It defaults to `OFF` (no ionospheric model) | Optional |
| `trop_model` | [`OFF`, `Saastamoinen`, `SBAS`, `Estimate_ZTD`, `Estimate_ZTD_Grad`]. Set whether tropospheric parameters (zenith total delay at rover and base‐station positions) are estimated or not. `OFF`: Not apply troposphere correction. `Saastamoinen`: Apply Saastamoinen model. `SBAS`: Apply SBAS tropospheric model (MOPS). `Estimate_ZTD`: Estimate ZTD (zenith total delay) parameters as EKF states. `Estimate_ZTD_Grad`: Estimate ZTD and horizontal gradient parameters as EKF states. If defaults to `OFF` (no dynamics model). | Optional |
| `AR_GPS` | [`OFF`, `Continuous`, `Instantaneous`, `Fix-and-Hold`, `PPP-AR`]. Set the strategy of integer ambiguity resolution for GPS. `OFF`: No ambiguity resolution, `Continuous`: Continuously static integer ambiguities are estimated and resolved, `Instantaneous`: Integer ambiguity is estimated and resolved by epoch‐by‐epoch basis, `Fix-and-Hold`: Continuously static integer ambiguities are estimated and resolved. If the validation OK, the ambiguities are tightly constrained to the resolved values, `PPP-AR`: Ambiguity resolution in PPP (experimental, only applicable to PPP‐* modes). It defaults to `OFF`. | Optional |
| `AR_GLO` | [`OFF`, `ON`]: Set the strategy of GLONASS integer ambiguity resolution. | Optional |
| `AR_BDS` | [`OFF`, `ON`]: Set the strategy of Beidou integer ambiguity resolution. | Optional |
| `min_ratio_to_fix_ambiguity` | Set the integer ambiguity validation threshold for ratio‐test, which uses the ratio  of squared residuals of the best integer vector to the second‐best vector. It defaults to $$ 3.0 $$. | Optional |
| `min_lock_to_fix_ambiguity` | Set the minimum lock count to fix integer ambiguity. If the lock count is less than the value, the ambiguity is excluded from the fixed integer vector. | Optional |
| `min_elevation_to_fix_ambiguity` | Set the minimum elevation angle (in degrees) to fix integer ambiguity. If the elevation angle is less than the value, the ambiguity is excluded from the fixed integer vector. It defaults to $$ 0^{o} $$. | Optional |
| `outage_reset_ambiguity` | Set the outage count to reset ambiguity. If the data outage count is over the value, the estimated ambiguity is reset to the initial value. It defaults to $$ 5 $$. | Optional |
| `slip_threshold` | Set the cycle‐slip threshold (m) of geometry‐free LC carrier‐phase difference between epochs. It defaults to $$ 0.05 $$. | Optional |
| `threshold_reject_GDOP` | Set the reject threshold of GDOP. If the GDOP is over the value, the observable is excluded for the estimation process as an outlier. It defaults to $$ 30.0 $$. | Optional |
| `threshold_reject_innovation` | Set the reject threshold of innovation (pre‐fit residual) (m). If the innovation is over the value, the observable is excluded for the estimation process as an outlier. It defaults to $$ 30.0 $$. | Optional |
| `number_filter_iter` | Set the number of iteration in the measurement update of the estimation filter. If the baseline length is very short like 1 m, the iteration may be effective to handle the nonlinearity of measurement equation. It defaults to 1. | Optional |
| `bias_0` | Set the process noise initial bias of carrier‐phase bias (ambiguity), in m. It defaults to 30 m. | Optional |
| `iono_0` | Set the process noise initial bias of vertical ionospheric delay per 10 km baseline, in m. It defaults to 0.03 m. | Optional |
| `trop_0` | Set the process noise initial bias of zenith tropospheric delay, in m. It defaults to 0.3 m. | Optional |
| `sigma_bias` | Set the process noise standard deviation of carrier‐phase bias (ambiguity), in $$ cycle/ \sqrt{s} $$. It defaults to $$ 1e-4 $$. | Optional |
| `sigma_iono` | Set the process noise standard deviation of vertical ionospheric delay per 10 km baseline, in $$ m/ \sqrt{s} $$. It defaults to $$ 1e-3 $$. | Optional |
| `sigma_trop` | Set the process noise standard deviation of zenith tropospheric delay, in  $$ m/ \sqrt{s} $$. It defaults to $$ 1e-4 $$. | Optional |
| `sigma_acch` | Set the process noise standard deviation of the receiver acceleration as the horizontal component, in $$ m/s^2/ \sqrt{s} $$. It defaults to $$ 1e-1 $$. If Receiver Dynamics is set to OFF, this parameter is not used.| Optional |
| `sigma_accv` | Set the process noise standard deviation of the receiver acceleration as the vertical component, in $$ m/s^2/ \sqrt{s} $$. It defaults to $$ 1e-2 $$. If Receiver Dynamics is set to OFF, this parameter is not used. | Optional |
| `rinex_version` | [`2`: version 2.11, `3`: version 3.02] Version of the generated RINEX files. It defaults to 3.02. | Optional |
| `nmea_dump_filename` | Name of the file containing the generated NMEA sentences in ASCII format. It defaults to `./nmea_pvt.nmea`. | Optional |
| `flag_nmea_tty_port` | [`true`, `false`]: If set to `true`, the NMEA sentences are also sent to a serial port device. It defaults to `false`. | Optional |
| `nmea_dump_devname` | If `flag_nmea_tty_port` is set to `true`, descriptor of the serial port device.  It defaults to `/dev/tty1`. | Optional |
| `flag_rtcm_server` |  [`true`, `false`]: If set to `true`, it runs up a TCP server that is serving RTCM messages to the connected clients during the execution of the software receiver. It defaults to `false`. | Optional |
| `rtcm_tcp_port` | If `flag_rtcm_server` is set to `true`, TCP port from which the RTCM messages will be served. It defaults to 2101. | Optional |
| `rtcm_station_id` | Station ID reported in the generated RTCM messages. It defaults to 1234. | Optional |
| `rtcm_MT1045_rate_ms` | Rate at which RTCM Message Type 1045 (Galileo Ephemeris data) will be generated, in ms. If set to `0`, mutes this message. It defaults to 5000 ms. | Optional |
| `rtcm_MT1019_rate_ms` | Rate at which RTCM Message Type 1019 (GPS Ephemeris data) will be generated, in ms. If set to `0`, mutes this message. It defaults to 5000 ms. | Optional |
| `rtcm_MSM_rate_ms` |  Default rate at which RTCM Multiple Signal Messages will be generated. It defaults to 1000 ms. | Optional |
| `rtcm_MT1077_rate_ms` | Rate at which RTCM Multiple Signal Messages GPS MSM7 (MT1077 - Full GPS observations) will be generated, in ms. If set to `0`, mutes this message. It defaults to `rtcm_MSM_rate_ms`. | Optional |
| `rtcm_MT1097_rate_ms` | Rate at which RTCM Multiple Signal Messages Galileo MSM7 (MT1097 - Full Galileo observations) will be generated, in ms. If set to `0`, mutes this message. It defaults to `rtcm_MSM_rate_ms`.  | Optional |
| `flag_rtcm_tty_port` | [`true`, `false`]: If set to `true`, the generated RTCM messages are also sent to a serial port device. It defaults to `false`. | Optional |
| `rtcm_dump_devname` |  If `flag_rtcm_tty_port` is set to `true`, descriptor of the serial port device. . It defaults to `/dev/pts/1`. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the PVT internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./pvt.dat`. | Optional |
|----------

Example:

```ini
;######### PVT CONFIG ############
PVT.implementation=RTKLIB_PVT
PVT.positioning_mode=PPP_Static
PVT.output_rate_ms=100
PVT.display_rate_ms=500
PVT.iono_model=Broadcast
PVT.trop_model=Saastamoinen
PVT.AR_GPS=Continuous
PVT.flag_rtcm_server=true
PVT.flag_rtcm_tty_port=false
PVT.rtcm_dump_devname=/dev/pts/1
PVT.rtcm_tcp_port=2101
PVT.rtcm_MT1045_rate_ms=5000
PVT.rtcm_MT1045_rate_ms=5000
PVT.rtcm_MT1097_rate_ms=1000
PVT.rtcm_MT1077_rate_ms=1000
PVT.rinex_version=2
```

-------------
# References

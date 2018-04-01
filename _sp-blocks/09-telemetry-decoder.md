---
title: "Telemetry Decoder"
permalink: /docs/sp-blocks/telemetry-decoder/
excerpt: "Documentation for the Telemetry Decoder block."
sidebar:
  nav: "sp-block"
toc: true
last_modified_at: 2018-03-26T15:54:02-04:00
---


The role of a _Telemetry Decoder_ block is to obtain the data bits from the navigation message broadcast by GNSS satellites.
{: .notice--info}

## GPS NAV navigation message

### Implementation: `GPS_L1_CA_Telemetry_Decoder`

The GPS L1 C/A baseband signal can be written as:

$$ \begin{equation} s^{\text{(GPS L1)}}_{T}(t)=e_{L1I}(t) + j e_{L1Q}(t)~, \end{equation} $$

with

$$ \definecolor{dark-grey}{RGB}{100,100,100} \color{dark-grey} e_{L1I}(t) =  \sum_{l=-\infty}^{\infty} \color{blue} D_{\text{NAV}} \Big[ [l]_{204600}\Big] \color{dark-grey} \oplus C_{\text{P(Y)}} \Big[ |l|_{L_{\text{P(Y)}}} \Big]   p(t -  lT_{c,\text{P(Y)}})~,\\
\color{dark-grey} e_{L1Q}(t) = \sum_{l=-\infty}^{\infty} \color{blue} D_{\text{NAV}}\Big[ [l]_{20460}  \Big] \color{dark-grey} \oplus   C_{\text{C/A}}  \Big[ |l|_{1023} \Big] p(t - lT_{c,\text{C/A}})~ $$

The GPS NAV message $$ D_{\text{NAV}} \in \{ 1, -1 \} $$ is modulated at 50 bits per second. The whole message contains 25 pages (or "frames") of 30 seconds each, forming the master frame that takes 12,5 minutes to be transmitted. Every frame is subdivided into 5 sub-frames of 6 seconds each; in turn, every sub-frame consists of 10 words, with 30 bits per word:

![GPS NAV message](http://www.navipedia.net/images/f/fe/Navigation_Message.png)
_GPS NAV message. Source: [Navipedia](http://www.navipedia.net/index.php/GPS_Navigation_Message)_.
{: style="text-align: center;"}

The content of every sub-frame is as follows:

* **Sub-frame 1**: contains information about the parameters to be applied to satellite clock status for its correction. These values are polynomial coefficients that allow converting time on board to GPS time. It also has information about satellite health condition.
* **Sub-frames 2 and 3**: these sub-frames contain satellite ephemeris.
* **Sub-frame 4**: provides ionospheric model parameters (in order to adjust for ionospheric refraction), UTC information (Universal Coordinate Time), part of the almanac, and indications whether the Anti-Spoofing, A/S, is activated or not (which transforms P code into the encrypted Y code).
* **Sub-frame 5**: contains data from the almanac and the constellation status. A total of 25 frames are needed to complete the almanac.

Sub-frames 1, 2 and 3 are transmitted with each frame (i.e., they are repeated every 30 seconds). Sub-frames 4 and 5 contain different pages (25 pages each) of the navigation message. Thence, the transmission of the full navigation message takes $$ 25 \times 30 $$ seconds = 12.5 minutes.


The content of sub-frames 4 and 5 is common for all satellites. Thence, the almanac data for all in orbit satellites can be obtained from a single tracked satellite.

This implementation accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `GPS_L1_CA_Telemetry_Decoder` | Mandatory |
| `decimation_factor` |  . It defaults to 1. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Telemetry Decoder internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./navigation.dat` | Optional |
|--------------

  _Telemetry Decoder implementation:_ **`GPS_L1_CA_Telemetry_Decoder`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TELEMETRY DECODER CONFIG ############
TelemetryDecoder_1C.implementation=GPS_L1_CA_Telemetry_Decoder
TelemetryDecoder_1C.dump=false
```

## Galileo I/NAV navigation message

### Implementation: `Galileo_E1B_Telemetry_Decoder`

The Galileo E1 baseband signal can be written as:

$$ \begin{equation} s^{\text{(Gal E1)}}_{T}(t) = \frac{1}{\sqrt{2}} \Big( e_{E1B}(t)\left( \alpha sc_A(t)+ \beta sc_B(t) \right) - e_{E1C}(t) \left( \alpha sc_A(t)- \beta  sc_B(t) \right) \Big)~, \end{equation} $$

where $$ sc_A(t) $$ and $$ sc_B(t) $$ are the Composite Binary Offset Carrier (CBOC) square subcarriers, and:

$$  \definecolor{dark-grey}{RGB}{100,100,100} \color{dark-grey} e_{E1B}(t) = \sum_{l=-\infty}^{+\infty} \color{blue} D_{\text{I/NAV}} \Big[ [l]_{4092}\Big] \color{dark-grey} \oplus C_{E1B}\Big[|l|_{4092}\Big] p(t - lT_{c,E1B})~. $$

As shown in this equation, the E1B signal component carries the
$$ D_{\text{I/NAV}} \in \{ 1, -1 \} $$ navigation message, which provides the space vehicle
identification (SVID), an Issue of Data, the ephemeris data, a
signal-in-space accuracy (SISA) indicator, clock correction parameters,
an ionospheric correction, the Broadcast Group Delay (BGD), signal health
and data validity status, Galileo System Time (GST), GST-UTC and GST-GPS
time conversion parameters, the almanacs, and Search and Rescue (SAR)
service data.

![INAV message structure]({{ "/assets/images/inav.png" | relative_url }})
{: style="text-align: center;"}

In the message structure depicted above,
each frame contains 24 subframes, and each subframe contains 15 nominal
pages, having a duration of 2 seconds transmitted sequentially in time
in two parts of duration 1 second each. Each page part (denoted as
*even* or *odd*) consists of a 10-bit synchronization pattern followed
by 240 coded symbols, corresponding to 114 data bits and 6 tail bits
(sequence of zeros) that allow Viterbi decoding. Three levels of error
coding are applied to the Galileo message data stream:

-   a Cyclic Redundancy Check (CRC) with error detection capabilities
    after recovery of the received data,

-   a one-half rate Forward Error Correction (FEC) convolutional coding,
    and

-   block interleaving on the resulting frames, with $$ 30 $$ columns (where
    data is written) and $$ 8 $$ rows (where data is read), providing
    robustness to the FEC decoding algorithm by avoiding error bursts.

This implementation accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Galileo_E1B_Telemetry_Decoder` | Mandatory |
| `decimation_factor` |  . It defaults to 1. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Telemetry Decoder internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./navigation.dat` | Optional |
|--------------

  _Telemetry Decoder implementation:_ **`Galileo_E1B_Telemetry_Decoder`**.
  {: style="text-align: center;"}


## Glonass GNAV navigation message

### Implementation: `GLONASS_L1_CA_Telemetry_Decoder`

**IMPORTANT**: This implementation is only available from the `next` branch of GNSS-SDR's repository, so it is **not** present in the current stable release.
{: .notice--warning}

This implementation accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `GLONASS_L1_CA_Telemetry_Decoder` | Mandatory |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Telemetry Decoder internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./navigation.dat` | Optional |
|--------------

_Telemetry Decoder implementation:_ **`GLONASS_L1_CA_Telemetry_Decoder`**.
{: style="text-align: center;"}


Example:

```ini
;######### TELEMETRY DECODER GLONASS L1 C/A CONFIG ############
TelemetryDecoder_1G.implementation=GLONASS_L1_CA_Telemetry_Decoder
TelemetryDecoder_1G.dump=false
```

### Implementation: `GLONASS_L2_CA_Telemetry_Decoder`

**IMPORTANT**: This implementation is only available from the `next` branch of GNSS-SDR's repository, so it is **not** present in the current stable release.
{: .notice--warning}

This implementation accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `GLONASS_L2_CA_Telemetry_Decoder` | Mandatory |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Telemetry Decoder internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./navigation.dat` | Optional |
|--------------

  _Telemetry Decoder implementation:_ **`GLONASS_L2_CA_Telemetry_Decoder`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TELEMETRY DECODER GPS L2C CONFIG ############
TelemetryDecoder_2G.implementation=GLONASS_L2_CA_Telemetry_Decoder
TelemetryDecoder_2G.dump=true
```


## GPS CNAV navigation message

### Implementation: `GPS_L2C_Telemetry_Decoder`

The GPS L2C baseband signal can be written as:

$$ \begin{equation} s^{\text{(GPS L2)}}_{T}(t)=e_{L2I}(t) + j e_{L2Q}(t)~, \end{equation} $$

with the Quadrature–phase component defined as:

$$ \definecolor{dark-grey}{RGB}{100,100,100} \color{dark-grey} e_{L2Q}(t) = \sum_{l=-\infty}^{\infty}\color{blue} D_{\text{CNAV}} \Big[ [l]_{10230} \Big] \color{dark-grey} \oplus \left(  C_{\text{CL}} \Big[ |l|_{L_{\text{CL}}} \Big] p_{\text{1/2}} \left(t - lT_{c,L2C} \right) + C_{\text{CM}} \Big[ |l|_{L_{\text{CM}}} \Big] p_{\text{1/2}}\left(t - \left(l+\frac{3}{4}\right)T_{c,L2C}\right) \right), $$

The civilian long code $$ C_{\text{CL}} $$ is
$$ L_{\text{CL}}=767250 $$ chips long, repeating every $$ 1.5 $$ s, while the
civilian moderate code $$ C_{\text{CM}} $$ is $$ L_{\text{CL}}=10230 $$ chips
long and its repeats every $$ 20 $$ ms. The CNAV data message $$ D_{\text{CNAV}} \in \{ 1, -1 \} $$ is an upgraded version
of the original NAV navigation message, containing higher precision
representation and nominally more accurate data than the NAV data. It is
transmitted at $$ 25 $$ bps with forward error correction (FEC) encoding,
resulting in $$ 50 $$ sps.

This implementation accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `GPS_L2C_Telemetry_Decoder` | Mandatory |
| `decimation_factor` |  . It defaults to 1. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Telemetry Decoder internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./navigation.dat` | Optional |
|--------------

  _Telemetry Decoder implementation:_ **`GPS_L2C_Telemetry_Decoder`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TELEMETRY DECODER GPS L2C CONFIG ############
TelemetryDecoder_2S.implementation=GPS_L2C_Telemetry_Decoder
TelemetryDecoder_2S.dump=true
```

### Implementation: `GPS_L5_Telemetry_Decoder`

**IMPORTANT**: This implementation is only available from the `next` branch of GNSS-SDR's repository, so it is **not** present in the current stable release.
{: .notice--warning}

The GPS L5 baseband signal can be written as:

$$ \begin{equation} s^{\text{(GPS L5)}}_{T}(t)=e_{L5I}(t) +j e_{L5Q}(t)~, \end{equation} $$

where:

$$ \definecolor{dark-grey}{RGB}{100,100,100} \color{dark-grey} \begin{equation} e_{L5I}(t) = \sum_{m=-\infty}^{+\infty} C_{nh_{10}} \Big[ |m|_{10}\Big] \oplus  \ \color{blue} D_{\text{CNAV}}\Big[ [m]_{10}\Big] \color{dark-grey} \oplus \sum_{l=1}^{102300} C_{L5I}\Big[|l|_{10230}\Big]  p(t - m T_{c,nh} - lT_{c,L5}) ~,\end{equation} $$

$$ \definecolor{dark-grey}{RGB}{100,100,100} \color{dark-grey} \begin{equation} e_{L5Q}(t) = \sum_{m=-\infty}^{+\infty} C_{nh_{20}} \Big[ |m|_{20}\Big]   \oplus  \sum_{l=1}^{102300}C_{L5Q}\Big[|l|_{10230}\Big] \cdot p(t - m T_{c,nh} - lT_{c,L5})~, \end{equation} $$

with $$ T_{c,nh}=1 $$ ms and $$ T_{c,L5}=\frac{1}{10.23} $$ $$ \mu $$s. The L5I
component contains a synchronization sequence $$ C_{nh_{10}} $$ that modulates each $$ 100 $$ symbols of the
GPS L5 civil navigation data $$ D_{\text{CNAV}} $$. The L5Q component
has another synchronization sequence $$ C_{nh_{20}} $$.


This implementation accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `GPS_L5_Telemetry_Decoder` | Mandatory |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Telemetry Decoder internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./navigation.dat` | Optional |
|--------------

  _Telemetry Decoder implementation:_ **`GPS_L5_Telemetry_Decoder`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TELEMETRY DECODER GPS L5 CONFIG ############
TelemetryDecoder_L5.implementation=GPS_L5_Telemetry_Decoder
TelemetryDecoder_L5.dump=true
```



## Galileo F/NAV navigation message

### Implementation: `Galileo_E5a_Telemetry_Decoder`

The Galileo E5 baseband signal can be written as:

$$ \begin{equation} s^{\text{(Gal E5)}}_{T}(t) = e_{E5a}(t) ssc_s^{*}(t)+ e_{E5b}(t) ssc_s(t) +\bar{e}_{E5a}(t)ssc_p^{*}(t)+\bar{e}_{E5b}(t)ssc_p(t)~, \end{equation} $$

where $$ ssc_s(t) $$ and $$ ssc_p(t) $$ are the single and product side–band signal subcarriers. However, sub-band E5a can be approximated by a QPSK signal. Galileo's F/NAV navigation message $$ D_{\text{F/NAV}} \in \{ 1, -1 \} $$ modulates the I component of the E5a signal, which can be expressed as:

$$ \definecolor{dark-grey}{RGB}{100,100,100} \color{dark-grey} e_{E5aI}(t) =  \sum_{m=-\infty}^{+\infty}C_{E5aIs}\Big[|m|_{20}\Big] \oplus \sum_{l=1}^{10230}C_{E5aIp}\Big[ l \Big] \oplus \color{blue} D_{\text{F/NAV}} \Big[ [l]_{204600}\Big]  \color{dark-grey} p(t-mT_{c,E5s}-lT_{c,E5p})~. $$


This implementation accepts the following parameters:


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Galileo_E5a_Telemetry_Decoder` | Mandatory |
| `decimation_factor` |  . It defaults to 1. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Telemetry Decoder internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./navigation.dat` | Optional |
|--------------

  _Telemetry Decoder implementation:_ **`Galileo_E5a_Telemetry_Decoder`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TELEMETRY DECODER GALILEO E5a CONFIG ############
TelemetryDecoder_5X.implementation=Galileo_E5a_Telemetry_Decoder
TelemetryDecoder_5X.dump=false
```

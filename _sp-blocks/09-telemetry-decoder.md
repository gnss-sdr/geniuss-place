---
title: "Telemetry Decoder"
permalink: /docs/sp-blocks/telemetry-decoder/
excerpt: "Documentation for the Telemetry Decoder block"
sidebar:
  nav: "sp-block"
modified: 2016-04-13T15:54:02-04:00
---

{% include toc %}

The role of a _Telemetry Decoder_ block is to obtain the data bits from the navigation message broadcast by GNSS satellites.
{: .notice--info}

## GPS navigation message



### Implementation: `GPS_L1_CA_Telemetry_Decoder`

The GPS L1 C/A baseband signal can be written as:

$$ s^{\text{(GPS L1)}}_{T}(t)=e_{L1I}(t) + j e_{L1Q}(t)~,$$

with

$$ \color{black} e_{L1I}(t) =  \sum_{l=-\infty}^{\infty} \color{blue} D_{\text{NAV}} \Big[ [l]_{204600}\Big] \color{black} \oplus C_{\text{P(Y)}} \Big[ |l|_{L_{\text{P(Y)}}} \Big]   p(t -  lT_{c,\text{P(Y)}})~,\\
\color{black} e_{L1Q}(t) = \sum_{l=-\infty}^{\infty} \color{blue} D_{\text{NAV}}\Big[ [l]_{20460}  \Big] \color{black} \oplus   C_{\text{C/A}}  \Big[ |l|_{1023} \Big] p(t - lT_{c,\text{C/A}})~ $$

The GPS NAV message $$ D_{\text{NAV}} $$ is modulated at 50 bps. The whole message contains 25 pages (or "frames") of 30 seconds each, forming the master frame that takes 12,5 minutes to be transmitted. Every frame is subdivided into 5 sub-frames of 6 seconds each; in turn, every sub-frame consists of 10 words, with 30 bits per word:

![GPS NAV message](http://www.navipedia.net/images/f/fe/Navigation_Message.png)
_GPS NAV message. Source: [Navipedia](http://www.navipedia.net/index.php/GPS_Navigation_Message){:target="_blank"}_.
{: style="text-align: center;"}

The content of every sub-frame is as follows:

* **Sub-frame 1**: contains information about the parameters to be applied to satellite clock status for its correction. These values are polynomial coefficients that allow converting time on board to GPS time. It also has information about satellite health condition.
* **Sub-frames 2 and 3**: these sub-frames contain satellite ephemeris.
* **Sub-frame 4**: provides ionospheric model parameters (in order to adjust for ionospheric refraction), UTC information (Universal Coordinate Time), part of the almanac, and indications whether the Anti-Spoofing, A/S, is activated or not (which transforms P code into the encrypted Y code).
* **Sub-frame 5**: contains data from the almanac and the constellation status. A total of 25 frames are needed to complete the almanac.

Sub-frames 1, 2 and 3 are transmitted with each frame (i.e., they are repeated every 30 seconds). Sub-frames 4 and 5 contain different pages (25 pages each) of the navigation message. Thence, the transmission of the full navigation message takes $$ 25 \times 30 $$ seconds = 12.5 minutes.


The content of sub-frames 4 and 5 is common for all satellites. Thence, the almanac data for all in orbit satellites can be obtained from a single tracked satellite.

Parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `decimation_factor` |  . It defaults to 1. | Optional |
| `dump` |  [`true`, `false`]: if set to `true`, it enables the Telemetry Decoder internal binary data file logging. It defaults to `false`. | Optional |
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

## Galileo navigation message

### Implementation: `Galileo_E1B_Telemetry_Decoder`


$$ \color{black}  e_{E1B}(t) = \sum_{l=-\infty}^{+\infty} \color{blue} D_{\text{I/NAV}} \Big[ [l]_{4092}\Big] \color{black} \oplus C_{E1B}\Big[|l|_{4092}\Big] p(t - lT_{c,E1B})~. $$

As shown in this equation, the E1B signal component carries the
$$ D_{\text{I/NAV}} $$ navigation message, which provides the space vehicle
identification (SVID), an Issue of Data, the ephemeris data, a
signal-in-space accuracy (SISA) indicator, clock correction parameters,
a ionospheric correction, the Broadcast Group Delay (BGD), signal health
and data validity status, Galileo System Time (GST), GST-UTC and GST-GPS
time conversion parameters, the almanacs, and Search and Rescue (SAR)
service data.

![INAV message structure]({{ site.url }}{{ site.baseurl }}/images/inav.png)
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


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `decimation_factor` |  . It defaults to 1. | Optional |
| `dump` |  [`true`, `false`]: if set to `true`, it enables the Telemetry Decoder internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./navigation.dat` | Optional |
|--------------

  _Telemetry Decoder implementation:_ **`Galileo_E1B_Telemetry_Decoder`**.
  {: style="text-align: center;"}


### Implementation: `Galileo_E5a_Telemetry_Decoder`

Galileo's F/NAV navigation message modulates the I component of the E5a signal, which baseband can be expressed as:

$$ \color{black} e_{E5aI}(t) =  \sum_{m=-\infty}^{+\infty}C_{E5aIs}\Big[|m|_{20}\Big] \oplus \sum_{l=1}^{10230}C_{E5aIp}\Big[ l \Big] \oplus \color{blue} D_{\text{F/NAV}} \Big[ [l]_{204600}\Big]  \color{black} p(t-mT_{c,E5s}-lT_{c,E5p})~. $$

$$ \color{black} e_{E5aI}(t) =  \sum_{m=-\infty}^{+\infty}C_{E5aIs}\Big[|m|_{20}\Big] \oplus \sum_{l=1}^{10230}C_{E5aIp}\Big[ l \Big] \oplus \color{blue} D_{\text{F/NAV}} \Big[ [l]_{204600}\Big] \color{black} p(t-mT_{c,E5s}-lT_{c,E5p})~. $$

Parameters:


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `decimation_factor` |  . It defaults to 1. | Optional |
| `dump` |  [`true`, `false`]: if set to `true`, it enables the Telemetry Decoder internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./navigation.dat` | Optional |
|--------------

  _Telemetry Decoder implementation:_ **`Galileo_E5a_Telemetry_Decoder`**.
  {: style="text-align: center;"}

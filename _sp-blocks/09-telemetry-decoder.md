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


|----------
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `decimation_factor` |  . It defaults to 1. | Optional |
| `dump` |  . It defaults to `false`. | Optional |
| `dump_filename` |  . It defaults to `./navigation.dat` | Optional |
|--------------

  _Telemetry Decoder implementation:_ **`GPS_L1_CA_Telemetry_Decoder`**.
  {: style="text-align: center;"}



```ini
;######### TELEMETRY DECODER CONFIG ############
TelemetryDecoder_1C.implementation=GPS_L1_CA_Telemetry_Decoder
TelemetryDecoder_1C.dump=false
```

## Galileo navigation message

### Implementation: `Galileo_E1B_Telemetry_Decoder`


$$ e_{E1B}(t) = \sum_{l=-\infty}^{+\infty} D_{\text{I/NAV}} \Big[ [l]_{4092}\Big] \oplus C_{E1B}\Big[|l|_{4092}\Big]    p(t - lT_{c,E1B})~. $$

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
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `decimation_factor` |  . It defaults to 1. | Optional |
| `dump` |  . It defaults to `false`. | Optional |
| `dump_filename` |  . It defaults to `./navigation.dat` | Optional |
|--------------

  _Telemetry Decoder implementation:_ **`Galileo_E1B_Telemetry_Decoder`**.
  {: style="text-align: center;"}


### Implementation: `Galileo_E5a_Telemetry_Decoder`

|----------
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `decimation_factor` |  . It defaults to 1. | Optional |
| `dump` |  . It defaults to `false`. | Optional |
| `dump_filename` |  . It defaults to `./navigation.dat` | Optional |
|--------------

  _Telemetry Decoder implementation:_ **`Galileo_E5a_Telemetry_Decoder`**.
  {: style="text-align: center;"}

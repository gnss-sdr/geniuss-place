---
title: "Channels"
permalink: /docs/sp-blocks/channels/
excerpt: "Documentation for the Channel blocks."
sidebar:
  nav: "sp-block"
toc: true
toc_sticky: true
last_modified_at: 2022-02-09T12:54:02+02:00
---


Each _Channel_ encapsulates blocks for signal [acquisition]({{
"/docs/sp-blocks/acquisition/" | relative_url }}), [tracking]({{
"/docs/sp-blocks/tracking/" | relative_url }}), and [demodulation of the
navigation message]({{ "/docs/sp-blocks/telemetry-decoder/" | relative_url }})
for a single satellite. These abstract interfaces can be populated with
different algorithms addressing any suitable GNSS signal. The user can define
the number of parallel channels to be instantiated by the software receiver, and
the thread-per-block scheduler imposed by GNU Radio automatically manages the
multitasking capabilities of modern multi-core processors. This is done through
the configuration file with the `Channels_XX.count` parameter, where `XX` is one
of the following signal identifiers:

|----------
| **Identifier** |   **Signal**   | **Center Frequency** |
| :------------: | :------------: | :------------------: |
| -------------- |
|      `1G`      | Glonass L1 C/A |  $$ 1602.00 $$ MHz   |
|      `1C`      |   GPS L1 C/A   |  $$ 1575.42 $$ MHz   |
|      `1B`      | Galileo E1 B/C |  $$ 1575.42 $$ MHz   |
|      `B1`      |   Beidou B1I   |  $$ 1561.098 $$ MHz  |
|      `E6`      |  Galileo E6B   |  $$ 1278.75 $$ MHz   |
|      `B3`      |   Beidou B3I   |  $$ 1268.520 $$ MHz  |
|      `2G`      | Glonass L2 C/A |  $$ 1246.00 $$ MHz   |
|      `2S`      |  GPS L2 L2CM   |  $$ 1227.60 $$ MHz   |
|      `7X`      |  Galileo E5b   |  $$ 1207.140 $$ MHz  |
|      `5X`      |  Galileo E5a   |  $$ 1176.450 $$ MHz  |
|      `L5`      |    GPS L5C     |  $$ 1176.45 $$ MHz   |
|     -----      |


Then, eleven parameters can be set: `Channels_1G.count`, `Channels_1C.count`,
`Channels_1B.count`, `Channels_B1.count`,  `Channels_E6.count`,
`Channels_B3.count`, `Channels_2G.count`, `Channels_2S.count`,
`Channels_5X.count`, `Channels_7X.count` and `Channels_L5.count`, all of them
defaulting to $$ 0 $$.

In addition, the GNSS-SDR flow graph allows setting the number of channels that
will be executing signal acquisition (which is known to require a high
computational load) concurrently. This is controlled by the parameter
`Channels.in_acquisition`, which defaults to the total number of channels (all
of them performing acquisition on different satellite signals at the same time,
if required). When working with real-time configurations, it is a good practice
to set this parameter to 1 (that is, only one channel performing acquisition at
a given time) in order to alleviate the computational burden.

_Channels_ accepts the following parameters:

|----------
|        **Parameter**        | **Description**                                                                                                                                                                                                                                                                                                                                                                   | **Required** |
| :-------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|       --------------        |
|     `Channels_1G.count`     | Number of channels targeting Glonass L1 C/A signals. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                                                      |   Optional   |
|     `Channels_1C.count`     | Number of channels targeting GPS L1 C/A signals. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                                                          |   Optional   |
|     `Channels_1B.count`     | Number of channels targeting Galileo E1 B/C signals. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                                                      |   Optional   |
|     `Channels_B1.count`     | Number of channels targeting BeiDou B1I signals. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                                                          |   Optional   |
|     `Channels_E6.count`     | Number of channels targeting Galileo E6B signals. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                                                         |   Optional   |
|     `Channels_B3.count`     | Number of channels targeting BeiDou B3I signals. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                                                          |   Optional   |
|     `Channels_2S.count`     | Number of channels targeting GPS L2 L2CM signals. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                                                         |   Optional   |
|     `Channels_2G.count`     | Number of channels targeting Glonass L2 C/A signals. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                                                      |   Optional   |
|     `Channels_7X.count`     | Number of channels targeting Galileo E5b (I+Q) signals. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                                                   |   Optional   |
|     `Channels_5X.count`     | Number of channels targeting Galileo E5a (I+Q) signals. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                                                   |   Optional   |
|     `Channels_L5.count`     | Number of channels targeting GPS L5 signals. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                                                              |   Optional   |
|      `Channel.signal`       | Assign all channels to a specific signal [`1C`, `1B`, `2S`, `5X`, `L5`]. Only required in single-system receivers.                                                                                                                                                                                                                                                                |   Optional   |
|      `ChannelN.signal`      | (where `N` is the channel number, starting from $$ 0 $$). Assign each channel to a specific signal [`1C`, `1B`, `2S`, `5X`, `L5`]. Not required in single-system receivers.                                                                                                                                                                                                       |   Optional   |
| `Channels_1G.RF_channel_ID` | Connects channels targeting Glonass L1 C/A to a radio frequency chain. It defaults to $$ 0 $$. Not required in single-band receivers. This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                             |   Optional   |
| `Channels_1C.RF_channel_ID` | Connects channels targeting GPS L1 C/A to a radio frequency chain. It defaults to $$ 0 $$. Not required in single-band receivers. This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                                 |   Optional   |
| `Channels_1B.RF_channel_ID` | Connects channels targeting Galileo E1 B/C to a radio frequency chain. It defaults to $$ 0 $$. Not required in single-band receivers. This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                             |   Optional   |
| `Channels_B1.RF_channel_ID` | Connects channels targeting BeiDou B1I to a radio frequency chain. It defaults to $$ 0 $$.Not required in single-band receivers. This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                                  |   Optional   |
| `Channels_E6.RF_channel_ID` | Connects channels targeting Galileo E6B to a radio frequency chain. It defaults to $$ 0 $$. Not required in single-band receivers. This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                                |   Optional   |
| `Channels_B3.RF_channel_ID` | Connects channels targeting BeiDou B3I to a radio frequency chain. It defaults to $$ 0 $$. Not required in single-band receivers. This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                                 |   Optional   |
| `Channels_2S.RF_channel_ID` | Connects channels targeting GPS L2 L2CM to a radio frequency chain. It defaults to $$ 0 $$. Not required in single-band receivers. This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                                |   Optional   |
| `Channels_2G.RF_channel_ID` | Connects channels targeting Glonass L2 C/A to a radio frequency chain. It defaults to $$ 0 $$. Not required in single-band receivers. This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                             |   Optional   |
| `Channels_7X.RF_channel_ID` | Connects channels targeting Galileo E5b (I+Q) to a radio frequency chain. It defaults to $$ 0 $$. Not required in single-band receivers. This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                          |   Optional   |
| `Channels_5X.RF_channel_ID` | Connects channels targeting Galileo E5a (I+Q) to a radio frequency chain. It defaults to $$ 0 $$. Not required in single-band receivers. This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                          |   Optional   |
| `Channels_L5.RF_channel_ID` | Connects channels targeting GPS L5 to a radio frequency chain. It defaults to $$ 0 $$. Not required in single-band receivers. This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                                     |   Optional   |
|  `ChannelN.RF_channel_ID`   | (where `N` is the channel number, starting from $$ 0 $$). Connects channel `N` to a radio frequency chain. Overrides Channels_XX.RF_channel_ID parameter value for a specific channel. It defaults to $$ 0 $$. Not required in single-band receivers.                                                                                                                             |   Optional   |
| `ChannelN.Signal_Source_ID` | (where `N` is the channel number, starting from $$ 0 $$). Connects channel `N` to a signal source. It defaults to $$ 0 $$. Not required in single-source receivers.                                                                                                                                                                                                               |   Optional   |
|    `ChannelN.satellite`     | (where `N` is the channel number, starting from $$ 0 $$). Assigns channel `N` to given satellite by its PRN. This channel will always be trying to acquire and track the given satellite.                                                                                                                                                                                         |   Optional   |
|  `Channels.in_acquisition`  | Maximum number of channels performing signal acquisition at the same time. The recommended value is $$ 1 $$. In the case of having assigned a channel to a given satellite (e.g., with `Channel0.satellite=1`), it is recommended to increase this number in order to always have at least one channel searching for new satellites. It defaults to the total number of channels. |   Optional   |
|         ----------          |

Then, each type of defined channel requires the configuration of:

* [_Acquisition_]({{ "/docs/sp-blocks/acquisition/" | relative_url }}) blocks
targeting the desired signal type, in charge of the detection of signals coming
from a given GNSS satellite and, in the case of a positive detection, to provide
coarse estimations of the code phase $$ \hat{\tau} $$ and the Doppler shift
$$ \hat{f}_{d} $$,
* [_Tracking_]({{ "/docs/sp-blocks/tracking/" | relative_url }}) blocks
targeting the desired signal type, in charge of following the evolution of the
signal synchronization parameters: code phase $$ \tau(t) $$, Doppler shift
$$ f_d(t) $$ and carrier phase $$ \phi(t) $$, and
* [_Telemetry Decoder_]({{ "/docs/sp-blocks/telemetry-decoder/" | relative_url }})
blocks targeting the desired signal type, in charge of demodulating and decoding
the GNSS navigation message carried by that particular signal.

Examples for different receiver architectures are provided below.


## Single system, single band receiver

Setting a single-band receiver with twelve channels devoted to GPS L1 C/A signal
can be done as:


```ini
;######### CHANNELS GLOBAL CONFIG ############
Channels_1C.count=12
Channel.signal=1C
Channels.in_acquisition=1

Acquisition_1C.implementation=...
; or Acquisition_1C0, ..., Acquisition_1C11, and parameters.

Tracking_1C.implementation=...
; or Tracking_1C0, ..., Tracking_1C11, and parameters.

TelemetryDecoder_1C.implementation=...
; or TelemetryDecoder_1C0, ..., TelemetryDecoder_1C11, and parameters.
```


## Multi-constellation, single band receiver

When defining a multi-system receiver, the user must specify which channels are
devoted to each signal. This is done through the parameter `ChannelN.signal`,
where `N` is the absolute channel number, starting from zero:

```ini
;######### CHANNELS CONFIG ############
Channels_1C.count=4
Channels_1B.count=4
Channels.in_acquisition=1
Channel0.signal=1C
Channel1.signal=1C
Channel2.signal=1C
Channel3.signal=1C
Channel4.signal=1B
Channel5.signal=1B
Channel6.signal=1B
Channel7.signal=1B

Acquisition_1C.implementation=...
; or Acquisition_1C0, ..., Acquisition_1C3, and parameters.
Acquisition_1B.implementation=...
; or Acquisition_1B4, ..., Acquisition_1B7, and parameters.

Tracking_1C.implementation=...
; or Tracking_1C0, ..., Tracking_1C3
Tracking_1B.implementation=...
; or Tracking_1B4, ..., Tracking_1B7

TelemetryDecoder_1C.implementation=...
; or TelemetryDecoder_1C0, ..., TelemetryDecoder_1C3, and parameters.
TelemetryDecoder_1B.implementation=...
; or TelemetryDecoder_1B4, ..., TelemetryDecoder_1B7, and parameters.
```


## Multi-band receiver

When defining a multi-band receiver, in addition to assign a signal to each
channel, users need to specify the connection of the different radio-frequency
chains to the processing channels. This is done using the
`ChannelN.RF_channel_ID`, where `N` is the absolute channel number, starting
from zero:

```ini
; # Channel connection
Channel0.RF_channel_ID=0
Channel1.RF_channel_ID=1
```

Thus, a dual-band GPS receiver, connecting eight GPS L1 C/A channels to the
radio frequency chain $$ 0 $$ and eight GPS L2CM channels to the radio frequency
chain $$ 1 $$ would be configured as:


```ini
;######### CHANNELS CONFIG ############
Channels_1C.count=8
Channels_1B.count=8
Channels.in_acquisition=1
Channel0.signal=1C
Channel1.signal=1C
Channel2.signal=1C
Channel3.signal=1C
Channel4.signal=1C
Channel5.signal=1C
Channel6.signal=1C
Channel7.signal=1C
Channel8.signal=2S
Channel9.signal=2S
Channel10.signal=2S
Channel11.signal=2S
Channel12.signal=2S
Channel13.signal=2S
Channel14.signal=2S
Channel15.signal=2S
Channel0.RF_channel_ID=0
Channel1.RF_channel_ID=0
Channel2.RF_channel_ID=0
Channel3.RF_channel_ID=0
Channel4.RF_channel_ID=0
Channel5.RF_channel_ID=0
Channel6.RF_channel_ID=0
Channel7.RF_channel_ID=0
Channel8.RF_channel_ID=1
Channel9.RF_channel_ID=1
Channel10.RF_channel_ID=1
Channel11.RF_channel_ID=1
Channel12.RF_channel_ID=1
Channel13.RF_channel_ID=1
Channel14.RF_channel_ID=1
Channel15.RF_channel_ID=1

Acquisition_1C.implementation=...
; or Acquisition_1C0, ..., Acquisition_1C7
Acquisition_2S.implementation=...
; or Acquisition_2S8, ..., Acquisition_2S15

Tracking_1C.implementation=...
; or Tracking_1C0, ..., Tracking_1C7
Tracking_2S.implementation=...
; or Tracking_2S8, ..., Tracking_2S15

TelemetryDecoder_1C.implementation=...
; or TelemetryDecoder_1C0, ..., TelemetryDecoder_1C7
TelemetryDecoder_2S.implementation=...
; or TelemetryDecoder_2S8, ..., TelemetryDecoder_2S15
```



## Multi-source receiver

When defining a multi-source receiver, in addition to assign a signal to each
channel, users need to specify the connection of the different signal sources to
the processing channels. This is done using the `ChannelN.SignalSource_ID`,
where `N` is the absolute channel number, starting from zero:


```ini
; # Channel connection
Channel0.SignalSource_ID=0
Channel1.SignalSource_ID=0
Channel2.SignalSource_ID=1
Channel3.SignalSource_ID=1
```

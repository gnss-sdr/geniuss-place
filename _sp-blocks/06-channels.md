---
title: "Channels"
permalink: /docs/sp-blocks/channels/
excerpt: "Documentation for the Channel block"
sidebar:
  nav: "sp-block"
modified: 2016-04-13T15:54:02-04:00
---
{% include toc %}


Each _Channel_ encapsulates blocks for signal acquisition, tracking and demodulation of the navigation message for a single satellite. These abstract interfaces can be populated with different algorithms addressing any suitable GNSS signal. The user can define the number of parallel channels to be instantiated by the software receiver, and the thread-per-block scheduler imposed by GNU Radio automatically manages the multitasking capabilities of modern multi-core processors. This is done through the configuration file with the ```Channels_XX.count``` parameter, where ```XX``` is one of the following signal identifiers:

|----------
|  **Identifier**  |  **Signal** | **Center Frequency** |
|:-:|:-:|:-:|   
|--------------
|  ```1C```      | GPS L1 C/A | $$ 1575.42 $$ MHz |
|  ```1B```      | Galileo E1 B | $$ 1575.42 $$ MHz |
|  ```2S```      | GPS L2 L2C (M) | $$ 1227.60 $$ MHz |
|  ```5X```      | Galileo E5a (I+Q) | $$ 1207.14 $$ MHz |
|-----


Then, four parameters can be set: ```Channels_1C.count```, ```Channels_2S.count```, ```Channels_1B.count``` and ```Channels_5X.count```, all of them defaulting to $$ 0 $$.

In addition, the GNSS-SDR flow graph allows to set the number of channels that will be executing signal acquisition (which is known to require a high computational load) concurrently. This is controlled by the parameter `Channels.in_acquisition`, which defaults to the total number of channels (all of them performing acquisition on different satellite signals at the same time, if required). When working with real-time configurations, it is a good practice to set this parameter  to 1 (that is, only one channel performing acquisition at a given time) in order to alleviate the computational burden.

Parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `Channels_1C.count` |  Number of channels targeting GPS L1 C/A signals. It defaults to $$ 0 $$.| Optional |
| `Channels_2S.count` |  Number of channels targeting GPS L2 L2C (M) signals. It defaults to $$ 0 $$.| Optional |
| `Channels_1B.count` |  Number of channels targeting Galileo E1 B  signals. It defaults to $$ 0 $$.| Optional |
| `Channels_5X.count` |  Number of channels targeting Galileo E5a (I+Q) signals. It defaults to $$ 0 $$. | Optional |
| `ChannelN.signal` |  (where `N` is the channel number, starting from $$ 0 $$). Assign each channel to a specific signal [`1C`, `1B`, `2S`, `5X`]. Not required in single-system receivers. | Optional |
| `ChannelN.RF_channel_ID` | (where `N` is the channel number, starting from $$ 0 $$). Connects channel `N` to a radio frequency chain. It defaults to $$ 0 $$. Not required in single-band receivers. | Optional |
| `ChannelN.Signal_Source_ID` | (where `N` is the channel number, starting from $$ 0 $$). Connects channel `N` to a signal source. It defaults to $$ 0 $$. Not required in single-source receivers. | Optional |
| `Channels.in_acquisition` | Maximum number of channels performing signal acquisition at the same time. It defaults to the total number of channels. | Optional |
|----------


Examples for different receiver architectures are provided below.


## Single system, single band receiver

Setting a single-band receiver with twelve channels devoted to GPS L1 C/A signal can be done as:


```ini
;######### CHANNELS GLOBAL CONFIG ############
Channels_1C.count=12
Channels.in_acquisition=1
```


## Multi-constellation, single band receiver

When defining a multi-system receiver, the user must specify which channels are devoted to each signal. This is done through the parameter ```ChannelN.signal```, where ```N``` is the absolute channel number, starting from zero:

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
```


## Multi-band receiver

When defining a multi-band receiver, in addition to assign a signal to each channel, users need to specify the connection of the different radio-frequency chains to the processing channels. This is done using the ```ChannelN.RF_channel_ID```, where ```N``` is the absolute channel number, starting from zero:

```ini
; # Channel connection
Channel0.RF_channel_ID=0
Channel1.RF_channel_ID=1
```

Thus, a dual-band GPS receiver, connecting eight GPS L1 C/A channels to the radio frequency chain $$ 0 $$ and eight GPS L2C (M) channels to the radio frequency chain $$ 1 $$ would be configured as:


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
```



## Multi-source receiver

When defining a multi-source receiver, in addition to assign a signal to each channel, users need to specify the connection of the different signal sources to the processing channels. This is done using the ```ChannelN.SignalSource_ID```, where ```N``` is the absolute channel number, starting from zero:


```ini
; # Channel connection
Channel0.SignalSource_ID=0
Channel1.SignalSource_ID=0
Channel2.SignalSource_ID=1
Channel3.SignalSource_ID=1
```

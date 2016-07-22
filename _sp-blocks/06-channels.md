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
|  **Identifier**  |  **Signal** |
|:-:|:-:|     
|--------------
|  ```1C```      | GPS L1 C/A |
|  ```2S```      | GPS L2 L2C (M) |
|  ```1B```      | Galileo E1 B |
|  ```5X```      | Galileo E5a (I+Q) |
|-----


Then, four parameters can be set: ```Channels_1C.count```, ```Channels_2S.count```, ```Channels_1B.count``` and ```Channels_5X.count```, all of them defaulting to $$ 0 $$.

## Single system, single band receiver

Setting a single-band receiver with twelve channels devoted to GPS L1 C/A signal can be done as:


```ini
Channels_1C.count=12
```


## Multi-constellation, single band receiver

When defining a multi-system receiver, the user must specify which channels are devoted to each signal. This is done through the parameter ```ChannelN.signal```, where ```N``` is the absolute channel number, starting from zero:

```ini
;######### CHANNELS GLOBAL CONFIG ############
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



## Multi-source receiver

When defining a multi-source receiver, in addition to assign a signal to each channel, users need to specify the connection of the different signal sources to the processing channels. This is done using the ```ChannelN.SignalSource_ID```, where ```N``` is the absolute channel number, starting from zero:


```ini
; # CHANNEL CONNECTION
Channel0.SignalSource_ID=0
Channel1.SignalSource_ID=0
Channel2.SignalSource_ID=1
Channel3.SignalSource_ID=1
```

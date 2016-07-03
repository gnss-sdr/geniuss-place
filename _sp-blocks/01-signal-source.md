---
title: "Signal Source"
permalink: /docs/sp-blocks/signal-source/
excerpt: "Documentation for the Signal Source block"
modified: 2016-04-13T15:54:02-04:00
sidebar:
  nav: "sp-block"
---

{% include toc %}

{% capture fig_img2 %}
  ![Front-end]({{ site.url }}{{ site.baseurl }}/images/frontend.png)
{% endcapture %}

{% capture fig_img3 %}
  ![Multichannel]({{ site.url }}{{ site.baseurl }}/images/multichannel.png)
{% endcapture %}

{% capture fig_img4 %}
  ![Multiple sources]({{ site.url }}{{ site.baseurl }}/images/multisource.png)
{% endcapture %}

{% capture fig_img5 %}
  ![Output2]({{ site.url }}{{ site.baseurl }}/images/Ch3_track.jpg)
{% endcapture %}

{% capture fig_img6 %}
  ![GooGle Earth]({{ site.url }}{{ site.baseurl }}/images/RTLSDR-4CH-fs1.2-MSPS-no-LNA.jpg)
{% endcapture %}


The input of a software receiver are the raw bits that come out from the
front-end’s analog-to-digital converter (ADC), as sketched in Figure
[fig:RFfront-end]. Those bits can be read from a file stored in the hard
disk or directly in real-time from a hardware device through USB or
Ethernet buses.

<figure>
  {{ fig_img2 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>Simplified lock diagram of a generic radio frequency front-end,
  consisting of an antenna, an amplification stage, downshifting from RF
  to and intermediate frequency (or baseband), filtering, sampling, and an
  interface to a host computer for real-time processing mode, or to an
  storage device for post-processing..</figcaption>
</figure>


The Signal Source module is in charge of implementing the hardware
driver, that is, the portion of the code that communicates with the RF
front-end and receives the samples coming from the ADC. This
communication is usually performed through USB or Ethernet buses. Since
real-time processing requires a highly optimized implementation of the
whole receiver, this module also allows to read samples from a file
stored in a hard disk, and thus processing without time constraints.
Relevant parameters of those samples are the intermediate frequency (or
baseband I&Q components), the sampling rate and number of bits per
sample, that must be specified by the user in the configuration file, as
shown below.

This module also performs bit-depth adaptation, since most of the
existing RF front-ends provide samples quantized with 2 or 3 bits, while
operations inside the processor are performed on 32- or 64-bit words,
depending on its architecture. Although there are implementations of the
most intensive computational processes (mainly correlation) that take
advantage of specific data types and architectures for the sake of
efficiency, the approach is processor-specific and hardly portable. We
suggest to keep signal samples in standard data types and letting the
compiler select the best library version (implemented using SIMD or any
other processor-specific technology) of the required routines for a
given processor.

## Reading data from a file

The user can configure the receiver for reading from a file, setting in
the configuration file the data file location, sample format, and the
sampling and intermediate frequencies at which the signal was originally
captured.

Real signals sampled at an intermediate frequency can be downshifted to
baseband (and thus expressed as complex samples) by the
`Freq_Xlating_Fir_Filter` implementation of the Input Filter present at
the Signal Conditioner block (see Section
[Input Filter]({{ site.url }}{{ site.baseurl }}/docs/sp-blocks/input-filter/) for further details).

### Implementation: `File_Signal_Source`

This Signal Source implementation reads samples stored in a file.

Parameters:

-   `filename`: Path to the file containing the raw digitized signal
    samples.

-   `samples`: Number of samples to be read. If set to $$ 0 $$ the whole
    file but the last two milliseconds are processed. It defaults to
    $$ 0 $$.

-   `sampling_frequency`: sample rate, in samples per second.

-   `item_type` [`byte`, `ibyte`, `short`, `ishort`, `float`,
    `gr_complex`]: Sample data type. Defaults to `gr_complex`.

-   `repeat` [`true`, `false`]: If set to `true`, processing of samples
    restarts the file when the end is reached. It defaults to `false`.

-   `dump` [`true`, `false`]:

-   `dump_filename`: If `dump` is set to `true`....

-   `enable_throttle_control` [`true`, `false`]: Defaults to `false`

This implementation assumes that the center frequency is the nominal
corresponding to the frequency band defined in ... (see ...). Any known
deviation from that value can be compensated by using the `IF` parameter
of the `Freq_Xlating_Fir_Filter` implementation of the Input Filter
present at the Signal Conditioner block (see Section
[Input Filter]({{ site.url }}{{ site.baseurl }}/docs/sp-blocks/input-filter/){:target="_blank"} for further details).

It follows  an example of a Signal Source block
configured with the `File_Signal_Source` implementation:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=File_Signal_Source
SignalSource.filename=/home/user/gnss-sdr/data/my_capture.dat
SignalSource.samples=0
SignalSource.item_type=gr_complex
SignalSource.sampling_frequency=4000000 ; Sampling frequency in [sps]
```


The name of the file to be read (that is, `SignalSource.filename`) that
appears on the configuration file can be overriden at the command line
when invoking `gnss-sdr` with the flag `--signal_source`. Example:

```bash
$ gnss-sdr --config_file=/path/to/my_receiver.conf \
  --signal_source=/path/to/my_capture2.dat
```

This will read the configuration file `my_receiver.conf`, but it will
read samples from the file `my_capture2.dat` instead of the one
specified in `SignalSource.filename`.

### Implementation: `Two_Bit_Packed_File_Signal_Source`

Sometimes, samples are stored in files in a format that is not in the
list of “native” types supported by the `File_Signal_Source`
implementation (i.e, it is not among `byte`, `ibyte`, `short`, `ishort`,
`float` or `gr_complex`). This is the case of 2-bit real samples
delivered at a given intermediate frequency, which is a common format
for GNSS RF front-ends.

The `Two_Bit_Packed_File_Signal_Source` implementation allows reading
two-bit length samples from a file. The data is assumed to be packed as
bytes `item_type=byte` or shorts `item_type=short` so that there are 4
two bit samples in each byte. The two bit values are assumed to have the
following interpretation:

|---
| **b1** | **b0** | **Value** |
|:-:|:-:|:-:|
| 0 | 0 | +1 |
| 0 | 1 | +3 |
| 1 | 0 | -3 |
| 1 | 1 | -1 |

Within a byte the samples may be packed in big endian
`big_endian_bytes=true` (if the most significant byte value is stored at
the memory location with the lowest address, the next byte value in
significance is stored at the following memory location, and so on) or
little endian `big_endian_bytes=false` (if the least significant byte
value is at the lowest address, and the other bytes follow in increasing
order of significance). If the order is big endian then the most
significant two bits will form the first sample output, otherwise the
least significant two bits will be used.

Additionally the samples may be either real `sample_type=real`, or
complex. If the sample type is complex, then the samples are either
stored in the order: real, imag, real, imag, ... `sample_type=iq` or in
the order: imag, real, imag, real, ... `sample_type=qi`.

Finally, if the data is stored as shorts `item_type=short`, then it may
be stored in either big endian `big_endian_items=true` or little endian
`big_endian_items=false`. If the shorts are big endian, then the second
byte in each short is output first.

The output data type is either `float` or `gr_complex` depending on
whether or not `sample_type` is real. Example:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=Two_Bit_Packed_File_Signal_Source
SignalSource.filename=/data/my_capture.datz
SignalSource.item_type=short
SignalSource.sampling_frequency=60000000
SignalSource.freq=1575468750
SignalSource.samples=6000000000  ;Notice that 0 indicates the entire file.
SignalSource.repeat=false
SignalSource.dump=false
SignalSource.dump_filename=./signal_source.dat
SignalSource.enable_throttle_control=false
SignalSource.sample_type=iq
SignalSource.big_endian_items=true
SignalSource.big_endian_bytes=false
```

### Implementation: `Nsr_File_Signal_Source`

Sometimes, samples are stored in files in a format that is not in the
list of “native” types supported by the `File_Signal_Source`
implementation (i.e, it is not among `byte`, `ibyte`, `short`, `ishort`,
`float` or `gr_complex`). This is the case of 2-bit real samples
delivered at a given intermediate frequency, which is a common format
found in RF front-ends:

$$ [S_0], [S_1], [S_2], ... $$ where $$ [S_i] $$ are 2-bit real samples.

This Signal Source implementation is able to read such format and
deliver at its output a sample stream composed of samples of type *byte*
(8-bit signed integer). This implementation delivers a stream of samples
of type `gr_complex`.

Parameters:

-   `filename`:

-   `samples`:

-   `sampling_frequency`:

-   `item_type` [`byte`]: Output data type. Only `byte` is allowed in
    this implementation.

-   `repeat` [`true`, `false`]:

-   `dump` [`true`, `false`]:

-   `dump_filename`:

-   `enable_throttle_control` [`true`, `false`]:

It follows an example of a Signal Source block
configured with the `Nsr_Signal_Source` implementation:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=Nsr_File_Signal_Source
SignalSource.filename=/datalogger/signals/ifen/E1L1_FE0_Band0.stream
SignalSource.item_type=byte
SignalSource.sampling_frequency=20480000
SignalSource.freq=1575420000
SignalSource.samples=0
SignalSource.repeat=false
SignalSource.dump=false
SignalSource.dump_filename=../data/signal_source.dat
SignalSource.enable_throttle_control=false
```

The name of the file to be read (that is, `SignalSource.filename`) that
appears on the configuration file can be overriden at the command line
when invoking `gnss-sdr` with the flag `–nsr_signal_source`. Example:

```bash
$ gnss-sdr --config_file=/path/to/my_receiver.conf \
  --nsr_signal_source=/path/to/my_capture2.dat
```

This will read the configuration file `my_receiver.conf`, but it will
read samples from the file `my_capture2.dat` instead of the one
specified in `SignalSource.filename`.

## Radio Frequency front-ends

### Implementation: `UHD_Signal_Source`

![Ettus Research](http://files.ettus.com/meta/logos/ettus_logo.png){:height="250px" width="250x"}



Parameters:

-   `device_address`: IP address of the USRP device. When left empty,
    the device discovery routines will search all the available
    transports on the system (Ethernet, USB, ...).

-   `RF_channels`: Number of RF channels present in the front-end
    device.

-   `subdevice [A:0, B:0]`: UHD subdevice specification.

-   `sampling_frequency`: RF front-end center frequency, in Hz.

-   `item_type [cbyte, cshort, gr_complex]`: data type for each sample.
    The type `cbyte` (i.e., complex signed 8-bit integers) is not
    available in USRP devices. This parameter defaults to `cshort`.

If `RF_channels` is set to `1`, then:

-   `samples`: Number of samples to be processed.

-   `dump [true, false]`: Defaults to `false`.

-   `dump_filename`:

-   `freq`: RF front-end center frequency, in Hz.

-   `gain`: RF front-end gain, in dB.

-   `IF_bandwidth_hz`:

Example:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=UHD_Signal_Source
SignalSource.device_address=192.168.40.2  ; <- PUT YOUR USRP IP ADDRESS HERE
SignalSource.item_type=cshort
SignalSource.sampling_frequency=4000000
SignalSource.freq=1575420000
SignalSource.gain=40
SignalSource.subdevice=A:0
SignalSource.repeat=false
SignalSource.dump=false
SignalSource.dump_filename=../data/signal_source.dat
SignalSource.enable_throttle_control=false
```

If `RF_channels` is set to more than one, then the number of the
radio-frequency channel (starting with $$ 0 $$) is appended to the name of
parameters `samples`, `dump`, `dump_filename`, `freq`, `gain` and
`IF_bandwidth_hz` to indicate to which RF chain they come from:

-   `samples0`: Number of samples to be processed for RF channel 0.

-   `dump0`:

-   `dump_filename0`:

-   `freq0`: RF front-end center frequency for RF channel 0, in Hz.

-   `gain0`: RF front-end gain for RF channel 0, in dB.

-   `IF_bandwidth_hz0`:

-   `samples1`: Number of samples to be processed for RF channel 1.

-   `dump1`:

-   `dump_filename1`:

-   `freq1`: RF front-end center frequency for RF channel 1, in Hz.

-   `gain1`: RF front-end gain for RF channel 1, in dB.

-   `IF_bandwidth_hz1`:

Example:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=UHD_Signal_Source
SignalSource.device_address=192.168.40.2
SignalSource.item_type=gr_complex
SignalSource.RF_channels=2
SignalSource.sampling_frequency=4000000
SignalSource.subdevice=A:0 B:0

;######### RF Channels specific settings ######
SignalSource.freq0=1575420000
SignalSource.gain0=50
SignalSource.samples0=0
SignalSource.dump0=false
SignalSource.dump_filename0=../data/signal_source0.dat

SignalSource.freq1=1575420000
SignalSource.gain1=50
SignalSource.samples1=0
SignalSource.dump1=false
SignalSource.dump_filename1=../data/signal_source1.dat
```

### NSL Stereo

### Flexiband

```bash
$ cmake -DENABLE_FLEXIBAND=ON ../
```
It requires an specific driver that is not available under an open
source license.

### OsmoSDR-compatible devices

OsmoSDR is a small form-factor inexpensive SDR (Software Defined Radio)
project. It provides a driver for several front-ends, such as RTL-based
dongles, HackRF, bladeRF, etc.


```bash
$ cmake -DENABLE_OSMOSDR=ON ../
```

Not all the OsmoSDR-compatible devices can work as radio frequency
front-ends for proper GNSS signal receiving.

### Implementation: `Osmosdr_Signal_Source`

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=Osmosdr_Signal_Source
SignalSource.item_type=gr_complex
SignalSource.sampling_frequency=2000000
SignalSource.freq=1575420000
SignalSource.gain=40
SignalSource.rf_gain=40
SignalSource.if_gain=30
SignalSource.enable_throttle_control=false

;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=Osmosdr_Signal_Source
SignalSource.item_type=gr_complex
SignalSource.sampling_frequency=2000000
SignalSource.freq=1575420000
SignalSource.gain=40
SignalSource.rf_gain=40
SignalSource.if_gain=30
;SignalSource.AGC_enabled=false
SignalSource.samples=0
SignalSource.repeat=false
SignalSource.dump=false
SignalSource.dump_filename=../data/signal_source.dat
SignalSource.enable_throttle_control=false
SignalSource.osmosdr_args=rtl_tcp,offset_tune=1
```

### Implementation: `RtlTcp_Signal_Source`

`rtl_tcp` is an I/Q spectrum server for RTL2832 based DVB-T receivers.

```bash
$ rtl_tcp -a 127.0.0.1 -f 1575420000 -g 0 -s 2000000
```

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=RtlTcp_Signal_Source
SignalSource.filename=/media/DATALOGGER_/signals/RTL-SDR/geo/pmt4.dat
SignalSource.item_type=gr_complex
SignalSource.sampling_frequency=1200000
SignalSource.freq=1575420000
SignalSource.gain=40
SignalSource.rf_gain=40
SignalSource.if_gain=30
SignalSource.AGC_enabled=false
SignalSource.samples=0
SignalSource.repeat=false
SignalSource.dump=false
SignalSource.dump_filename=../data/signal_source.dat
SignalSource.enable_throttle_control=false
SignalSource.address=127.0.0.1
SignalSource.port=1234
SignalSource.swap_iq=false
```

Multiple radio frequency chains
-------------------------------

A single Signal Source can be equipped with more than one
radio-frequency chain. Examples of such configuration could be a USRP
with two subdevices, or dual or triple band RF front ends, such as NSL
Stereo or Flexiband.

This case implies not only the configuration of the Signal Source, but
also there is a need to set up different Signal Conditioners for each
band, and configure the Channel implementations for the different
signals present on each band.

<figure>
  {{ fig_img3 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>Simplified block diagram of a dual-band receiver of GPS L1 C/A and GPS
  L2C (M) signals.</figcaption>
</figure>


The number of radio-frequency chains is denoted by parameter
`RF_channels`, which defaults to one if it is not present in the
configuration file.

```ini
SignalSource.RF_channels=2
```

Then:

```ini
SignalSource.RF_channels=2
SignalSource.implementation=UHD_Signal_Source
...
SignalSource.subdevice=A:0 B:0
...
SignalSource.freq0=1575420000
SignalSource.freq1=1227600000
...

SignalConditioner0.implementation=...
DataTypeAdapter0.implementation=...
InputFilter0.implementation=...
Resampler0.implementation=...

SignalConditioner1.implementation=...
DataTypeAdapter1.implementation=...
InputFilter1.implementation=...
Resampler1.implementation=...

...
Channels_1C.count=8
Channels_2S.count=8

; # Channel connection
Channel0.RF_channel_ID=1
Channel1.RF_channel_ID=1
Channel2.RF_channel_ID=1
Channel3.RF_channel_ID=1
Channel4.RF_channel_ID=1
Channel5.RF_channel_ID=1
Channel6.RF_channel_ID=1
Channel7.RF_channel_ID=1
Channel8.RF_channel_ID=0
Channel9.RF_channel_ID=0
Channel10.RF_channel_ID=0
Channel11.RF_channel_ID=0
Channel12.RF_channel_ID=0
Channel13.RF_channel_ID=0
Channel14.RF_channel_ID=0
Channel15.RF_channel_ID=0

; Channel signal
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

...


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

...
```


Multiple sources
----------------

A receiver can have more than one Signal Source delivering signal
streams at the same time.

Examples of such configuration could be:

-   Two files, one for each band (such as in the case of NSL’s Stereo
    front-end);

-   Different antennas, working at the same band but with different RF
    front-ends;

-   Different front-ends sharing the same antenna.


<figure>
  {{ fig_img4 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>Simplified block diagram of a multi-source receiver of GPS L1 C/A and
  GPS L2C (M) signals.</figcaption>
</figure>


```ini
Receiver.sources_count=2
```

Then:

```ini
Receiver.sources_count=2
...
SignalSource0.implementation=...
SignalSource1.implementation=...
...
SignalConditioner0.implementation=...
DataTypeAdaper0.implementation=...
InputFilter0.implementation=...
...
SignalConditioner1.implementation=...
DataTypeAdaper1.implementation=...
InputFilter1.implementation=...
...
Channels_1C.count=2
Channels_1B.count=2

...
; # CHANNEL CONNECTION
Channel0.SignalSource_ID=0
Channel1.SignalSource_ID=0
Channel2.SignalSource_ID=1
Channel3.SignalSource_ID=1

Channel0.signal=1C
Channel1.signal=1C
Channel2.signal=1B
Channel3.signal=1B
...
```

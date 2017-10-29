---
title: "Signal Source"
permalink: /docs/sp-blocks/signal-source/
excerpt: "Documentation for the Signal Source block"
sidebar:
  nav: "sp-block"
toc: true
last_modified_at: 2016-04-13T15:54:02-04:00
---

{% capture fig_img2 %}
  ![Front-end]({{ "/assets/images/frontend.png" | absolute_url }})
{% endcapture %}

{% capture fig_img3 %}
  ![Multichannel]({{ "/assets/images/multichannel.png" | absolute_url }})
{% endcapture %}

{% capture fig_img4 %}
  ![Multiple sources]({{ "/assets/images/multisource.png" | absolute_url }})
{% endcapture %}

A _Signal Source_ is the block that injects a continuous stream of raw samples of GNSS signal to the processing flow graph. This is an abstraction that wraps _all_ kind of sources, from samples stored in files (in a variety of formats) to multiple sample streams delivered in real-time by radio frequency front-ends.
{: .notice--info}


The input of a software receiver are the raw bits that come out from the
front-end’s analog-to-digital converter (ADC), as sketched in the figure below. Those bits can be read from a file stored in the hard
disk or directly in real-time from a hardware device through USB or
Ethernet buses.

<figure>
  {{ fig_img2 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>Simplified block diagram of a generic radio frequency front-end,
  consisting of an antenna, an amplification stage, downshifting from RF
  to and intermediate frequency (or baseband), filtering, sampling, and an
  interface to a host computer for real-time processing mode, or to an
  storage device for post-processing.</figcaption>
</figure>


The _Signal Source_ block is in charge of implementing the hardware
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

This block also performs bit-depth adaptation, since most of the
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

For more details about sample formats, please check out our tutorial on [data types in GNSS-SDR]({{ "/docs/tutorials/understanding-data-types/" | absolute_url }}).

The more kinds of signal souces GNSS-SDR is able to work with, the better is its [**Interoperability**]({{ "/design-forces/interoperability/#signal-sources" | absolute_url }}).
{: .notice--success}

## Reading data from a file

The user can configure the receiver for reading from a file, setting in
the configuration file the data file location, sample format, and the
sampling and intermediate frequencies at which the signal was originally
captured.

Real signals sampled at an intermediate frequency can be downshifted to
baseband (and thus expressed as complex samples) by the
`Freq_Xlating_Fir_Filter` implementation of the [Input Filter]({{ "/docs/sp-blocks/input-filter/" | absolute_url }}) present at
the Signal Conditioner block with its `IF` parameter.

### Implementation: `File_Signal_Source`

This _Signal Source_ implementation reads raw signal samples stored in a file, as long as they are stored in one of the following formats: `byte`, `ibyte`, `short`, `ishort`, `float` or `gr_complex`. Their definition is as follows:

|----------
| **Type name in GNSS-SDR conf files** | **Definition** | **Sample stream**
|:-:|:-|:-|
|----------
| `byte` | Signed integer, 8-bit two’s complement number ranging from -128 to 127. C++ type name: `int8_t`| $$ [ S_0 ], [S_1 ], S_2], ... $$
| `short` |  Signed integer, 16-bit two’s complement number ranging from -32768 to 32767. C++ type name: `int16_t` | $$ [ S_0 ], [S_1 ], S_2], ... $$
| `float` |  Defines numbers with fractional parts, can represent values ranging from approx. $$ 1.5 \times 10^{-45} $$ to $$ 3.4 \times 10^{38} $$ with a precision of 7 digits (32 bits). C++ type name: `float` | $$ [ S_0 ], [S_1 ], [S_2], ... $$
| `ibyte` |   Interleaved (I&Q) stream of samples of type `byte`. C++ type name: `int8_t` | $$ [ S_0^{I} ], [ S_0^{Q} ], [S_1^{I} ], [S_1^{Q}], [ S_2^{I} ], [S_2^{Q}], ... $$
| `ishort` |  Interleaved (I&Q) samples of type `short`. C++ type name: `int16_t` | $$ [ S_0^{I} ], [ S_0^{Q} ], [S_1^{I} ], [S_1^{Q}], [ S_2^{I} ], [S_2^{Q}], ... $$
| `cbyte` |  Complex samples, with real and imaginary parts of type `byte`. C++ type name: `lv_8sc_t` | $$ [S_0^{I}+jS_0^{Q}],[S_1^{I}+jS_1^{Q}],[S_2^{I}+jS_2^{Q}],... $$
| `cshort` | Complex samples, with real and imaginary parts of type `short`. C++ type name: `lv_16sc_t` | $$ [S_0^{I}+jS_0^{Q}],[S_1^{I}+jS_1^{Q}],[S_2^{I}+jS_2^{Q}],... $$
| `gr_complex` | Complex samples, with real and imaginary parts of type `float`.  C++ type name: `std::complex<float>` | $$ [S_0^{I}+jS_0^{Q}],[S_1^{I}+jS_1^{Q}],[S_2^{I}+jS_2^{Q}],... $$
|----------

  _Data type definition in GNSS-SDR._
  {: style="text-align: center;"}

This implementation accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `File_Signal_Source` | Mandatory |
| `filename` |  Path to the file containing the raw digitized signal samples | Mandatory |
| `sampling_frequency` | Sample rate, in samples per second. | Mandatory |
| `samples` | Number of samples to be read. If set to $$ 0 $$ the whole file but the last two milliseconds are processed. It defaults to $$ 0 $$. | Optional |
| `item_type` | [`byte`, `ibyte`, `short`, `ishort`, `float`, `gr_complex`]: Sample data type. It defaults to `gr_complex`. | Optional |
| `repeat` | [`true`, `false`]: If set to `true`, processing of samples restarts the file when the end is reached. It defaults to `false`. | Optional |
| `enable_throttle_control` | [`true`, `false`]: If set to `true`, it places a throttle controlling the data flow. It is generally not required, and it defaults to `false`. | Optional |
|-------

  _Signal Source implementation:_ **`File_Signal_Source`**
  {: style="text-align: center;"}

This implementation assumes that the center frequency is the nominal
corresponding to the GNSS frequency band. Any known
deviation from that value can be compensated by using the `IF` parameter
of the `Freq_Xlating_Fir_Filter` implementation of the [Input Filter]({{ "/docs/sp-blocks/input-filter/" | absolute_url }})
present at the Signal Conditioner block, or later on in the flow graph at the [Acquisition]({{ "/docs/sp-blocks/acquisition/" | absolute_url }}) and [Tracking]({{ "/docs/sp-blocks/tracking/" | absolute_url }}) blocks with their `if` parameter.

It follows an example of a Signal Source block
configured with the `File_Signal_Source` implementation:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=File_Signal_Source
SignalSource.filename=/home/user/gnss-sdr/data/my_capture.dat
SignalSource.sampling_frequency=4000000
```

{% capture overide-file %}
**Tip:** The name of the file to be read (that is, `SignalSource.filename`) that
appears on the configuration file can be overridden at the command line
when invoking `gnss-sdr` with the flag `--signal_source`. Example:

```bash
$ gnss-sdr --config_file=/path/to/my_receiver.conf \
  --signal_source=/path/to/my_capture2.dat
```

This will read the configuration file `my_receiver.conf`, but it will
read samples from the file `my_capture2.dat` instead of the one
specified in `SignalSource.filename`.
{% endcapture %}

<div class="notice--warning">
  {{ overide-file | markdownify }}
</div>

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
whether or not `sample_type` is real.

This implementation accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Two_Bit_Packed_File_Signal_Source` | Mandatory |
| `filename` |  Path to the file containing the raw digitized signal samples | Mandatory |
| `sampling_frequency` | Sample rate, in samples per second. | Mandatory |
| `samples` | Number of samples to be read. If set to $$ 0 $$ the whole file but the last two milliseconds are processed. It defaults to $$ 0 $$. | Optional |
| `item_type` | [`byte`, `short`]: Sample data type. It defaults to `byte`. | Optional |
| `repeat` | [`true`, `false`]: If set to `true`, processing of samples restarts the file when the end is reached. It defaults to `false`. | Optional |
| `sample_type` | [`real`, `qi`, `iq`]: Set real or complex sample types (see above). It defaults to `real`. | Optional |
| `big_endian_bytes` |  [`true`, `false`]: If set to `true`, the most significant byte value is expected to be stored at the memory location with the lowest address. If set to `false`, the least significant byte value is expected at the lowest address. It defaults to `false`. | Optional |
| `seconds_to_skip` | Seconds to skip in the file header. It defaults to $$ 0 $$ s. | Optional |
| `big_endian_items` |  [`true`, `false`]: If set to `true`, and the data is stored as shorts, it is interpreted as big endian. If set to `false`, data is interpreted to be stored in little endian. It defaults to `true`. | Optional |
| `enable_throttle_control` | [`true`, `false`]: If set to `true`, it places a throttle controlling the data flow. It is generally not required, and it defaults to `false`. | Optional |
|-------

  _Signal Source implementation:_ **`Two_Bit_Packed_File_Signal_Source`**
  {: style="text-align: center;"}



Example:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=Two_Bit_Packed_File_Signal_Source
SignalSource.filename=/data/my_capture.datz
SignalSource.item_type=short
SignalSource.sampling_frequency=60000000
SignalSource.samples=6000000000  ; Notice that 0 indicates the entire file.
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

This implementation accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Nsr_Signal_Source` | Mandatory |
| `filename` |  Path to the file containing the raw digitized signal samples | Mandatory |
| `sampling_frequency` | Sample rate, in samples per second. | Mandatory |
| `samples` | Number of samples to be read. If set to $$ 0 $$ the whole file but the last two milliseconds are processed. It defaults to $$ 0 $$. | Optional |
| `item_type` | [`byte`]: Sample data type. Only `byte` is allowed in this implementation. | Optional |
| `repeat` | [`true`, `false`]: If set to `true`, processing of samples restarts the file when the end is reached. It defaults to `false`. | Optional |
| `enable_throttle_control` | [`true`, `false`]: If set to `true`, it places a throttle controlling the data flow. It is generally not required, and it defaults to `false`. | Optional |
|-------

  _Signal Source implementation:_ **`Nsr_Signal_Source`**
  {: style="text-align: center;"}


It follows an example of a Signal Source block
configured with the `Nsr_Signal_Source` implementation:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=Nsr_File_Signal_Source
SignalSource.filename=/datalogger/signals/ifen/E1L1_FE0_Band0.stream
SignalSource.item_type=byte
SignalSource.sampling_frequency=20480000
SignalSource.samples=0
```

{% capture overide-nsr %}
**Tip:** The name of the file to be read (that is, `SignalSource.filename`) that
appears on the configuration file can be overridden at the command line
when invoking `gnss-sdr` with the flag `–nsr_signal_source`. Example:

```bash
$ gnss-sdr --config_file=/path/to/my_receiver.conf \
  --nsr_signal_source=/path/to/my_capture2.dat
```

This will read the configuration file `my_receiver.conf`, but it will
read samples from the file `my_capture2.dat` instead of the one
specified in `SignalSource.filename`.
{% endcapture %}

<div class="notice--warning">
  {{ overide-nsr | markdownify }}
</div>

## Radio Frequency front-ends

### Implementation: `UHD_Signal_Source`

[![Ettus Research](http://files.ettus.com/meta/logos/ettus_logo.png){:height="250px" width="250x"}{: .align-right}](https://www.ettus.com) The USRP Hardware Driver ([UHD](http://files.ettus.com/manual/)) software API supports application development on all [Ettus Research](https://www.ettus.com)'s [USRP](https://www.ettus.com/product) Software Defined Radio products. Using a common software interface is critical as it increases code portability, allowing applications to transition seamlessly to other USRP SDR platforms when development requirements expand or new platforms are available. Hence, it enables a significant reduction in development effort by allowing you to preserve and reuse your legacy code so you can focus on new algorithms.

This implementation accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `UHD_Signal_Source` | Mandatory |
| `device_address` |  IP address of the USRP device. When left empty, the device discovery routines will search all the available transports on the system (Ethernet, USB, ...) | Mandatory |
| `subdevice` | [`A:0`, `B:0`]: UHD subdevice specification.  | Mandatory |
| `sampling_frequency` |  Set the sampling frequency, in samples per second. | Mandatory |
| `RF_channels` | Number of RF channels present in the front-end device. It defaults to 1. | Optional |
| `clock_source` | [`internal`, `external`, `MIMO`]: Set the clock source for the USRP device. It defaults to `internal`. | Optional |
| `item_type` | [`cbyte`, `cshort`, `gr_complex`]: data type for each sample. The type `cbyte` (_i.e._, complex signed 8-bit integers) is not available in USRP devices with their default configurations. This parameter defaults to `cshort`. | Optional |
| `device_serial` | Filter the device by serial number if required (useful for USB devices). It is empty by default | Optional |
|-------

If `RF_channels` is set to `1`, then:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `freq` | Set the RF front-end center frequency, in Hz. | Mandatory |
| `IF_bandwidth_hz` | Set the IF passband filter bandwidth of the front-end, in Hz. It defaults to `sampling_frequency` / 2. | Optional |
| `gain` | Set the RF front-end gain, in dB, distributed across all gain elements. It defaults to $$ 50 $$ dB. | Optional |
| `samples` |  Number of samples to be processed. It defaults to $$ 0 $$, which means infinite samples. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the dump of the signal source delivered data into a file. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./data/signal_source.dat` | Optional |
|-------

  _Signal Source implementation:_ **`UHD_Signal_Source`** single-band parameters.
  {: style="text-align: center;"}


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
`IF_bandwidth_hz` to indicate to which RF chain they apply.

For instance, if `RF_channels` is set to `2`, then:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `freq0` | RF front-end center frequency for RF channel 0, in Hz. | Mandatory |
| `IF_bandwidth_hz0` | Set the IF passband filter bandwidth of RF channel 0, in Hz. It defaults to `sampling_frequency` / 2. | Optional |
| `gain0` | Set the RF front-end gain for RF channel 0, in dB, distributed across all gain elements. It defaults to $$ 50 $$ dB. | Optional |
| `samples0` |  Number of samples to be processed for RF channel 0. It defaults to $$ 0 $$, which means infinite samples | Optional |
| `dump0` | [`true`, `false`]: If set to `true`, it enables the dump of the signal source $$ 0 $$ delivered data into a file. It defaults to `false`. | Optional |
| `dump_filename0` | If `dump0` is set to `true`, name of the file in which data will be stored. It defaults to `./data/signal_source0.dat` | Optional |
| `freq1` | RF front-end center frequency for RF channel 1, in Hz. | Mandatory |
| `IF_bandwidth_hz1` | Set the IF passband filter bandwidth of RF channel 1, in Hz. It defaults to `sampling_frequency` / 2. | Optional |
| `gain1` | Set the RF front-end gain for RF channel 1, in dB, distributed across all gain elements. It defaults to $$ 50 $$ dB. | Optional |
| `samples1` |  Number of samples to be processed for RF channel 1. It defaults to $$ 0 $$, which means infinite samples | Optional |
| `dump1` | [`true`, `false`]: If set to `true`, it enables the dump of the signal source $$ 1 $$ delivered data into a file. It defaults to `false`.  | Optional |
| `dump_filename1` | If `dump1` is set to `true`, name of the file in which data will be stored. It defaults to `./data/signal_source1.dat` | Optional |
|-------

  _Signal Source implementation:_ **`UHD_Signal_Source`** multiple-band parameters.
  {: style="text-align: center;"}

{% capture tip-exit %}
  **Tip:** If the `samples` parameter is not specified, or set to $$ 0 $$, the USRP will deliver samples in a continuous way and with no specified end time, and so the software receiver will process endlessly. When configured for an infinite number of samples, please **always** terminate the software receiver execution by **pressing key 'q' and then key 'ENTER'**. This will make the program to exit gracefully, doing some clean-up work and preparing output products such as RINEX files to be properly read by other software tools. This is not guaranteed if the program is interrupted for instance by pressing keys 'CTRL' and 'c' at the same time.
{% endcapture %}

<div class="notice--warning">
  {{ tip-exit | markdownify }}
</div>



### Implementation: `Osmosdr_Signal_Source`

[![OsmoSDR](http://sdr.osmocom.org/osmocom/osmocom_sdr.png){:height="250px" width="250x"}{: .align-right}](http://sdr.osmocom.org/trac/)
[OsmoSDR](http://sdr.osmocom.org/trac/) is a 100 % Free Software based small form-factor inexpensive SDR (Software Defined Radio)
project. It consists of USB-attached hardware, the associated firmware as well as software tools for GNU Radio integration. It provides a driver for several front-ends, such as RTL-based
dongles, HackRF, bladeRF, etc.

If you installed GNSS-SDR from a software package, this implementation is already available. But if you built GNSS-SDR from the source code, you will need the required software dependencies (the `gr-osmosdr` component of GNU Radio) and configure the building with the following flag:

```bash
$ cmake -DENABLE_OSMOSDR=ON ../
```

For more information, check out the tutorial about [GNSS-SDR options at building time]({{ "/docs/tutorials/configuration-options-building-time/" | absolute_url }}).


This implementation accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Osmosdr_Signal_Source` | Mandatory |
| `freq` | RF front-end center frequency, in Hz. | Mandatory |
| `gain` | RF front-end gain for RF channel 0, in dB. The value is spread across the receiving chain. It defaults to $$ 40 $$ dB. | Optional |
| `rf_gain` | RF front-end gain for the RF amplifier, in dB. It defaults to $$ 40 $$ dB.|  Optional |
| `if_gain` | RF front-end gain for the IF amplifier, in dB. It defaults to $$ 40 $$ dB. | Optional |
| `sampling_frequency` | Sampling frequency, in samples per second. It defaults to 2 Ms/s. | Optional |
| `AGC_enabled` | [`true`, `false`]: If set to `true`, enables Automatic Gain Control. It defaults to `false`. | Optional |
| `samples` |  Number of samples to be processed. It defaults to $$ 0 $$, which means infinite samples. | Optional |
| `item_type` | [`gr_complex`]: Set the output data type. Only  `gr_complex` is allowed in this version, so it is set by default. | Optional |
| `osmosdr_args` | Pass arguments to the OsmoSDR driver.  | Optional |
| `dump` | [`true`, `false`]: If set to `true`, it enables the dump of the signal source into a file. It defaults to `false`.  | Optional |
| `dump_filename` | If `dump1` is set to `true`, name of the file in which data will be stored. It defaults to `./data/signal_source.dat` | Optional |
|-------

Please note that not all the OsmoSDR-compatible devices can work as radio frequency front-ends for proper GNSS signal reception, please check the specifications. For suitable RF front-ends, you can use:

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
SignalSource.osmosdr_args=rtl_tcp,offset_tune=1
```


### Implementation: `RtlTcp_Signal_Source`

In case of using a Zarlink's RTL2832 based DVB-T receiver, you can even use the [`rtl_tcp`](http://sdr.osmocom.org/trac/wiki/rtl-sdr#rtl_sdr) I/Q server in order to use the USB dongle remotely. `rtl_tcp` is an I/Q spectrum server for RTL2832 based DVB-T receivers.

If you installed GNSS-SDR from a software package, this implementation is already available. But if you built GNSS-SDR from the source code, you will need the required software dependencies (the `gr-osmosdr` component of GNU Radio) and configure the building with the following flag:

```bash
$ cmake -DENABLE_OSMOSDR=ON ../
```

For more information, check out the tutorial about [GNSS-SDR options at building time]({{ "/docs/tutorials/configuration-options-building-time/" | absolute_url }}).

In a terminal, type:

```bash
$ rtl_tcp -a 127.0.0.1 -f 1575420000 -g 0 -s 2000000
```

and use the following configuration:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=RtlTcp_Signal_Source
SignalSource.item_type=gr_complex
SignalSource.sampling_frequency=2000000
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
SignalSource.address=127.0.0.1 ; Put your IP here
SignalSource.port=1234         ; Put your port here
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


Example: Configuring the USRP X300 with two front-ends for receiving signals in L1 and L2 bands

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=UHD_Signal_Source
SignalSource.device_address=192.168.40.2  ; Put your USRP IP address here
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

SignalSource.freq1=1227600000
SignalSource.gain1=50
SignalSource.samples1=0
SignalSource.dump1=false
SignalSource.dump_filename1=../data/signal_source1.dat
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

---
title: "Signal Source"
permalink: /docs/sp-blocks/signal-source/
excerpt: "Documentation for the Signal Source block."
sidebar:
  nav: "sp-block"
toc: true
toc_sticky: true
last_modified_at: 2024-10-17T10:54:02+02:00
---

{% capture fig_img2 %}
  ![Front-end]({{ "/assets/images/frontend.png" | relative_url }}){: .align-center .invert-colors}
{% endcapture %}

{% capture fig_img3 %}
  ![Multichannel]({{ "/assets/images/multichannel.png" | relative_url }}){: .align-center .invert-colors}
{% endcapture %}

{% capture fig_img4 %}
  ![Multiple sources]({{ "/assets/images/multisource.png" | relative_url }}){: .align-center .invert-colors}
{% endcapture %}

{% capture fig_img5 %}
  ![AD9361 Rx Signal Path]( {{ "/assets/images/AD9361_rx_signal_path.png" | relative_url }})
{% endcapture %}

A _Signal Source_ is the block that injects a continuous stream of raw samples
of GNSS signal to the processing flow graph. This is an abstraction that wraps
_all_ kinds of sources, from samples stored in files (in a variety of formats)
to multiple sample streams delivered in real-time by radiofrequency front-ends.
{: .notice--info}


The input of a software receiver are the raw bits that come out from the
front-end's analog-to-digital converter (ADC), as sketched in the figure below.
Those bits can be read from a file stored in the hard disk or directly in
real-time from a hardware device through USB or Ethernet buses.

<figure>
  {{ fig_img2 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>Simplified block diagram of a generic radio frequency front-end,
  consisting of an antenna, an amplification stage, downshifting from RF
  to an intermediate frequency (or baseband), filtering, sampling, and an
  interface to a host computer for real-time processing mode, or to a
  storage device for post-processing.</figcaption>
</figure>


The _Signal Source_ block is in charge of implementing the hardware driver, that
is, the portion of the code that communicates with the RF front-end and receives
the samples coming from the ADC. This communication is usually performed through
USB or Ethernet buses. Since real-time processing requires a highly optimized
implementation of the whole receiver, this module also allows reading samples
from a file stored in a hard disk, and thus processing without time constraints.
Relevant parameters of those samples are the intermediate frequency (or baseband
I&Q components), the sampling rate, and the number of bits per sample, which
must be specified by the user in the configuration file, as shown below.

This block also performs bit-depth adaptation, since most of the existing RF
front-ends provide samples quantized with 2 or 3 bits, while operations inside
the processor are performed on 32- or 64-bit words, depending on its
architecture. Although there are implementations of the most intensive
computational processes (mainly correlation) that take advantage of specific
data types and architectures for the sake of efficiency, the approach is
processor-specific and hardly portable. We suggest keeping signal samples in
standard data types and letting the compiler select the best library version
(implemented using SIMD or any other processor-specific technology) of the
required routines for a given processor.

For more details about sample formats, please check out our [tutorial on data
types in GNSS-SDR]({{ "/docs/tutorials/understanding-data-types/" | relative_url }}).

The more kinds of signal sources GNSS-SDR is able to work with, the better is
its [**Interoperability**]({{ "/design-forces/interoperability/#signal-sources" |
relative_url }}).
{: .notice--success}

## Reading data from a file

The user can configure the receiver for reading from a file, setting in the
configuration file the data file location, sample format, and the sampling and
intermediate frequencies at which the signal was originally captured.

Real signals sampled at an intermediate frequency can be downshifted to baseband
(and thus expressed as complex samples) by the `Freq_Xlating_Fir_Filter`
implementation of the [Input Filter]({{ "/docs/sp-blocks/input-filter/" |
relative_url }}) present at the Signal Conditioner block with its `IF`
parameter.

### Implementation: `File_Signal_Source`

This _Signal Source_ implementation reads raw signal samples stored in a file,
as long as they are stored in one of the following formats: <abbr id="data-type"
title="Signed integer, 8-bit two's complement number ranging from -128 to 127.
C++ type name: int8_t">`byte`</abbr>, <abbr id="data-type" title="Interleaved
(I&Q) stream of samples of type signed 8-bit integer. C++ name:
int8_t">`ibyte`</abbr>, <abbr id="data-type" title="Signed integer, 16-bit two's
complement number ranging from -32768 to 32767. C++ type name:
int16_t">`short`</abbr>, <abbr id="data-type" title="Interleaved (I&Q) stream of
samples of type signed 16-bit integer. C++ name: int16_t">`ishort`</abbr>, <abbr
id="data-type" title="Defines numbers with fractional parts, can represent
values ranging from approx. 1.5e-45 to 3.4e38 with a precision of 7 digits (32
bits). C++ type name: float">`float`</abbr>, or <abbr id="data-type"
title="Complex samples with real and imaginary parts of type 32-bit floating
point. C++ name: std::complex<float>">`gr_complex`</abbr>. Their definition is
as follows:

|----------
| **Type name in GNSS-SDR conf files** | **Definition**                                                                                                                                                                                        | **Sample stream**                                                                  |
| :----------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
|              ----------              |
|                `byte`                | Signed integer, 8-bit two's complement number ranging from -128 to 127. C++ type name: `int8_t`                                                                                                       | $$ [ S_0 ], [S_1 ], [S_2], ... $$                                                  |
|               `short`                | Signed integer, 16-bit two's complement number ranging from -32768 to 32767. C++ type name: `int16_t`                                                                                                 | $$ [ S_0 ], [S_1 ], [S_2], ... $$                                                  |
|               `float`                | Defines numbers with fractional parts, can represent values ranging from approx. $$ 1.5 \times 10^{-45} $$ to $$ 3.4 \times 10^{38} $$ with a precision of 7 digits (32 bits). C++ type name: `float` | $$ [ S_0 ], [S_1 ], [S_2], ... $$                                                  |
|               `ibyte`                | Interleaved (I&Q) stream of samples of type `byte`. C++ type name: `int8_t`                                                                                                                           | $$ [ S_0^{I} ], [ S_0^{Q} ], [S_1^{I} ], [S_1^{Q}], [ S_2^{I} ], [S_2^{Q}], ... $$ |
|               `ishort`               | Interleaved (I&Q) samples of type `short`. C++ type name: `int16_t`                                                                                                                                   | $$ [ S_0^{I} ], [ S_0^{Q} ], [S_1^{I} ], [S_1^{Q}], [ S_2^{I} ], [S_2^{Q}], ... $$ |
|               `cbyte`                | Complex samples, with real and imaginary parts of type `byte`. C++ type name: `lv_8sc_t`                                                                                                              | $$ [S_0^{I}+jS_0^{Q}],[S_1^{I}+jS_1^{Q}],[S_2^{I}+jS_2^{Q}],... $$                 |
|               `cshort`               | Complex samples, with real and imaginary parts of type `short`. C++ type name: `lv_16sc_t`                                                                                                            | $$ [S_0^{I}+jS_0^{Q}],[S_1^{I}+jS_1^{Q}],[S_2^{I}+jS_2^{Q}],... $$                 |
|             `gr_complex`             | Complex samples, with real and imaginary parts of type `float`.  C++ type name: `std::complex<float>`                                                                                                 | $$ [S_0^{I}+jS_0^{Q}],[S_1^{I}+jS_1^{Q}],[S_2^{I}+jS_2^{Q}],... $$                 |
|              ----------              |

  _Data type definition in GNSS-SDR._
  {: style="text-align: center;"}

This implementation accepts the following parameters:

|----------
|       **Parameter**       | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | **Required** |
| :-----------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|      --------------       |
|     `implementation`      | `File_Signal_Source`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |  Mandatory   |
|        `filename`         | Path to the file containing the raw digitized signal samples                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |  Mandatory   |
|   `sampling_frequency`    | Sample rate, in samples per second.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |  Mandatory   |
|         `samples`         | Number of samples to be read. If set to $$ 0 $$, the whole file but the last two milliseconds are processed. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |   Optional   |
|        `item_type`        | [<abbr id="data-type" title="Signed integer, 8-bit two's complement number ranging from -128 to 127. C++ type name: int8_t">`byte`</abbr>, <abbr id="data-type" title="Interleaved (I&Q) stream of samples of type signed 8-bit integer. C++ name: int8_t">`ibyte`</abbr>, <abbr id="data-type" title="Signed integer, 16-bit two's complement number ranging from -32768 to 32767. C++ type name: int16_t">`short`</abbr>, <abbr id="data-type" title="Interleaved (I&Q) stream of samples of type signed 16-bit integer. C++ name: int16_t">`ishort`</abbr>, <abbr id="data-type" title="Defines numbers with fractional parts, can represent values ranging from approx. 1.5e-45 to 3.4e38 with a precision of 7 digits (32 bits). C++ type name: float">`float`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Sample data type. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. |   Optional   |
|     `seconds_to_skip`     | Seconds of signal to skip from the beginning of the file before start processing. It defaults to $$ 0 $$ s.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |   Optional   |
|         `repeat`          | [`true`, `false`]: If set to `true`, processing of samples restarts the file when the end is reached. It defaults to `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |   Optional   |
| `enable_throttle_control` | [`true`, `false`]: If set to `true`, it places a throttle controlling the data flow. It is generally not required, and it defaults to `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |   Optional   |
|          -------          |

  _Signal Source implementation:_ **`File_Signal_Source`**
  {: style="text-align: center;"}

This implementation assumes that the center frequency is the nominal
corresponding to the GNSS frequency band. Any known deviation from that value
can be compensated by using the `IF` parameter of the `Freq_Xlating_Fir_Filter`
implementation of the [Input Filter]({{ "/docs/sp-blocks/input-filter/" |
relative_url }}) present at the Signal Conditioner block, or later on in the
flow graph at the [Acquisition]({{ "/docs/sp-blocks/acquisition/" | relative_url }})
and [Tracking]({{ "/docs/sp-blocks/tracking/" | relative_url }}) blocks with
their `if` parameter.

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

```console
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

Sometimes, samples are stored in files in a format that is not in the list of
"native" types supported by the `File_Signal_Source` implementation (i.e, it is
not among <abbr id="data-type" title="Signed integer, 8-bit two's complement
number ranging from -128 to 127. C++ type name: int8_t">`byte`</abbr>, <abbr
id="data-type" title="Interleaved (I&Q) stream of samples of type signed 8-bit
integer. C++ name: int8_t">`ibyte`</abbr>, <abbr id="data-type" title="Signed
integer, 16-bit two's complement number ranging from -32768 to 32767. C++ type
name: int16_t">`short`</abbr>, <abbr id="data-type" title="Interleaved (I&Q)
stream of samples of type signed 16-bit integer. C++ name:
int16_t">`ishort`</abbr>, <abbr id="data-type" title="Defines numbers with
fractional parts, can represent values ranging from approx. 1.5e-45 to 3.4e38
with a precision of 7 digits (32 bits). C++ type name: float">`float`</abbr>, or
<abbr id="data-type" title="Complex samples with real and imaginary parts of
type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>).
This is the case of 2-bit real samples delivered at a given intermediate
frequency, which is a common format for GNSS RF front-ends.

The `Two_Bit_Packed_File_Signal_Source` implementation allows reading two-bit
length samples from a file. The data is assumed to be packed as bytes
`item_type=byte` or shorts `item_type=short` so that there are 4 two-bit samples
in each byte. The two-bit values are assumed to have the following
interpretation:

|---
| **b1** | **b0** | **Value** |
| :----: | :----: | :-------: |
|   0    |   0    |    +1     |
|   0    |   1    |    +3     |
|   1    |   0    |    -3     |
|   1    |   1    |    -1     |

Within a byte, the samples may be packed in big-endian `big_endian_bytes=true`
(if the most significant byte value is stored at the memory location with the
lowest address, the next byte value in significance is stored at the following
memory location, and so on) or little-endian `big_endian_bytes=false` (if the
least significant byte value is at the lowest address, and the other bytes
follow in increasing order of significance). If the order is big-endian then the
most significant two bits will form the first sample output. Otherwise, the
least significant two bits will be used.

Additionally, the samples may be either real `sample_type=real` or complex. If
the sample type is complex, then the samples are either stored in the order:
real, imag, real, imag, ... `sample_type=iq` or in the order: imag, real, imag,
real, ... `sample_type=qi`.

Finally, if the data is stored as shorts `item_type=short`, then it may be
stored in either big-endian `big_endian_items=true` or little-endian
`big_endian_items=false`. If the shorts are big-endian, then the second byte in
each short is output first.

The output data type is either <abbr id="data-type" title="Defines numbers with
fractional parts, can represent values ranging from approx. 1.5e-45 to 3.4e38
with a precision of 7 digits (32 bits). C++ type name: float">`float`</abbr> or
<abbr id="data-type" title="Complex samples with real and imaginary parts of
type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>
depending on whether or not `sample_type` is real.

This implementation accepts the following parameters:

|----------
|       **Parameter**       | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                         | **Required** |
| :-----------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|      --------------       |
|     `implementation`      | `Two_Bit_Packed_File_Signal_Source`                                                                                                                                                                                                                                                                                                                                                                                                                                     |  Mandatory   |
|        `filename`         | Path to the file containing the raw digitized signal samples                                                                                                                                                                                                                                                                                                                                                                                                            |  Mandatory   |
|   `sampling_frequency`    | Sample rate, in samples per second.                                                                                                                                                                                                                                                                                                                                                                                                                                     |  Mandatory   |
|         `samples`         | Number of samples to be read. If set to $$ 0 $$, the whole file but the last two milliseconds are processed. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                                                                                    |   Optional   |
|        `item_type`        | [<abbr id="data-type" title="Signed integer, 8-bit two's complement number ranging from -128 to 127. C++ type name: int8_t">`byte`</abbr>, <abbr id="data-type" title="Signed integer, 16-bit two's complement number ranging from -32768 to 32767. C++ type name: int16_t">`short`</abbr>]: Sample data type. It defaults to <abbr id="data-type" title="Signed integer, 8-bit two's complement number ranging from -128 to 127. C++ type name: int8_t">`byte`</abbr>. |   Optional   |
|         `repeat`          | [`true`, `false`]: If set to `true`, processing of samples restarts the file when the end is reached. It defaults to `false`.                                                                                                                                                                                                                                                                                                                                           |   Optional   |
|       `sample_type`       | [`real`, `qi`, `iq`]: Set real or complex sample types (see above). It defaults to `real`.                                                                                                                                                                                                                                                                                                                                                                              |   Optional   |
|    `big_endian_bytes`     | [`true`, `false`]: If set to `true`, the most significant byte value is expected to be stored at the memory location with the lowest address. If set to `false`, the least significant byte value is expected at the lowest address. It defaults to `false`.                                                                                                                                                                                                            |   Optional   |
|     `seconds_to_skip`     | Seconds to skip in the file header. It defaults to $$ 0 $$ s.                                                                                                                                                                                                                                                                                                                                                                                                           |   Optional   |
|    `big_endian_items`     | [`true`, `false`]: If set to `true`, and the data is stored as shorts, it is interpreted as big-endian. If set to `false`, data is interpreted to be stored in little-endian. It defaults to `true`.                                                                                                                                                                                                                                                                    |   Optional   |
| `enable_throttle_control` | [`true`, `false`]: If set to `true`, it places a throttle controlling the data flow. It is generally not required, and it defaults to `false`.                                                                                                                                                                                                                                                                                                                          |   Optional   |
|          -------          |

  _Signal Source implementation:_ **`Two_Bit_Packed_File_Signal_Source`**
  {: style="text-align: center;"}



Example:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=Two_Bit_Packed_File_Signal_Source
SignalSource.filename=/data/my_capture.dat
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

Sometimes, samples are stored in files in a format that is not in the list of
"native" types supported by the `File_Signal_Source` implementation (i.e, it is
not among <abbr id="data-type" title="Signed integer, 8-bit two's complement
number ranging from -128 to 127. C++ type name: int8_t">`byte`</abbr>, <abbr
id="data-type" title="Interleaved (I&Q) stream of samples of type signed 8-bit
integer. C++ name: int8_t">`ibyte`</abbr>, <abbr id="data-type" title="Signed
integer, 16-bit two's complement number ranging from -32768 to 32767. C++ type
name: int16_t">`short`</abbr>, <abbr id="data-type" title="Interleaved (I&Q)
stream of samples of type signed 16-bit integer. C++ name:
int16_t">`ishort`</abbr>, <abbr id="data-type" title="Defines numbers with
fractional parts, can represent values ranging from approx. 1.5e-45 to 3.4e38
with a precision of 7 digits (32 bits). C++ type name: float">`float`</abbr> or
<abbr id="data-type" title="Complex samples with real and imaginary parts of
type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>).
This is the case of 2-bit real samples delivered at a given intermediate
frequency, which is a common format found in RF front-ends:

$$ [S_0], [S_1], [S_2], ... $$ where $$ [S_i] $$ are 2-bit real samples.

This Signal Source implementation is able to read such format and deliver at its
output a sample stream composed of samples of type *byte* (8-bit signed
integer). This implementation delivers a stream of samples of type <abbr
id="data-type" title="Complex samples with real and imaginary parts of type
32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>.

This implementation accepts the following parameters:

|----------
|       **Parameter**       | **Description**                                                                                                                                                                                                                                                                                                                                | **Required** |
| :-----------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|      --------------       |
|     `implementation`      | `Nsr_Signal_Source`                                                                                                                                                                                                                                                                                                                            |  Mandatory   |
|        `filename`         | Path to the file containing the raw digitized signal samples                                                                                                                                                                                                                                                                                   |  Mandatory   |
|   `sampling_frequency`    | Sample rate, in samples per second.                                                                                                                                                                                                                                                                                                            |  Mandatory   |
|         `samples`         | Number of samples to be read. If set to $$ 0 $$, the whole file but the last two milliseconds are processed. It defaults to $$ 0 $$.                                                                                                                                                                                                           |   Optional   |
|        `item_type`        | [<abbr id="data-type" title="Signed integer, 8-bit two's complement number ranging from -128 to 127. C++ type name: int8_t">`byte`</abbr>]: Sample data type. Only <abbr id="data-type" title="Signed integer, 8-bit two's complement number ranging from -128 to 127. C++ type name: int8_t">`byte`</abbr> is allowed in this implementation. |   Optional   |
|         `repeat`          | [`true`, `false`]: If set to `true`, processing of samples restarts the file when the end is reached. It defaults to `false`.                                                                                                                                                                                                                  |   Optional   |
| `enable_throttle_control` | [`true`, `false`]: If set to `true`, it places a throttle controlling the data flow. It is generally not required, and it defaults to `false`.                                                                                                                                                                                                 |   Optional   |
|          -------          |

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
when invoking `gnss-sdr` with the flag `–-signal_source`. Example:

```console
$ gnss-sdr --config_file=/path/to/my_receiver.conf \
    --signal_source=/path/to/my_capture2.dat
```

This will read the configuration file `my_receiver.conf`, but it will
read samples from the file `my_capture2.dat` instead of the one
specified in `SignalSource.filename`.
{% endcapture %}

<div class="notice--warning">
  {{ overide-nsr | markdownify }}
</div>


### Implementation: `Spir_GSS6450_File_Signal_Source`

[![GSS6450]({{ "/assets/images/GSS6450.png" | relative_url }}){:height="250px" width="250px"}{: .align-right}](https://www.spirent.com/products/gnss-rf-record-and-playback-system-gss6450)

The Spirent
[GSS6450](https://www.spirent.com/products/gnss-rf-record-and-playback-system-gss6450)
Record and Playback System digitizes and stores the RF signals from real GNSS
satellites along with any interference observed in the GNSS bands. These
recordings are then made available for subsequent playback.

This block reads files generated by Spirent's GSS6450, and delivers samples in
format <abbr id="data-type" title="Complex samples with real and imaginary parts
of type 32-bit floating point. C++ name:
std::complex<float>">`gr_complex`</abbr>.  It accepts the following parameters:

|----------
|       **Parameter**       | **Description**                                                                                                                                                                                                                                                                                                                                                                                       | **Required** |
| :-----------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|      --------------       |
|     `implementation`      | `Spir_GSS6450_File_Signal_Source`                                                                                                                                                                                                                                                                                                                                                                     |  Mandatory   |
|        `filename`         | Path to the file containing the raw digitized signal samples. Files delivered by the GSS6450 end in `.gns`.                                                                                                                                                                                                                                                                                           |  Mandatory   |
|   `sampling_frequency`    | Sample rate, in samples per second.                                                                                                                                                                                                                                                                                                                                                                   |  Mandatory   |
|     `total_channels`      | Number of frequency bands present in the data file. It defaults to 1.                                                                                                                                                                                                                                                                                                                                 |   Optional   |
|         `sel_ch`          | Selected frequency band. 1 $$ <= $$ `sel_ch` $$ <= $$ `total_channels`. It defaults to 1.                                                                                                                                                                                                                                                                                                             |   Optional   |
|        `adc_bits`         | [`2`, `4`, `8`, `16`]: Selects 2, 4, 8 or 16 bit I/Q quantization. It defaults to 4 bits.                                                                                                                                                                                                                                                                                                             |   Optional   |
|         `endian`          | [`true`, `false`]: If it is set to `false`, it assumes that the host machine is reading in Big Endian (that is, the byte containing the most significant bit is stored first and has the lowest memory address). If it is set to `true`, it assumes Little Endian reading (that is, the byte containing the most significant bit is stored last and has the highest address). It defaults to `false`. |   Optional   |
|         `samples`         | Number of samples to be read. If set to $$ 0 $$, the whole file but the last two milliseconds are processed. It defaults to $$ 0 $$.                                                                                                                                                                                                                                                                  |   Optional   |
|      `bytes_to_skip`      | Number of bytes to skip from the beginning of the file. It defaults to 65536 bytes (which is `.gns` files' header length).                                                                                                                                                                                                                                                                            |   Optional   |
|         `repeat`          | [`true`, `false`]: If set to `true`, processing of samples restarts the file when the end is reached. It defaults to `false`.                                                                                                                                                                                                                                                                         |   Optional   |
| `enable_throttle_control` | [`true`, `false`]: If set to `true`, it places a throttle controlling the data flow. It is generally not required, and it defaults to `false`.                                                                                                                                                                                                                                                        |   Optional   |
|          -------          |

  _Signal Source implementation:_ **`Spir_GSS6450_File_Signal_Source`**
  {: style="text-align: center;"}

Example:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=Spir_GSS6450_File_Signal_Source
SignalSource.filename=/home/gnss/data/my_capture.gns
SignalSource.sampling_frequency=30000000
SignalSource.adc_bits=4
```

### Implementation: `Labsat_Signal_Source`

[![LabSat3]({{ "/assets/images/labsat3.png" | relative_url }}){:width="250px"}{: .align-right}](https://www.labsat.co.uk/index.php/en/products/labsat-3)

[LabSat](https://www.labsat.co.uk/index.php/en/) is an affordable, portable, and
versatile multi-constellation Global Navigation Satellite Simulator.

LabSat 3 devices record and replay real-world raw sample data, allowing
realistic and repeatable testing to be carried out under controlled conditions.
This block reads files stored by LabSat 2 or LabSat 3 devices, and delivers a
stream of samples of type <abbr id="data-type" title="Complex samples with real
and imaginary parts of type 32-bit floating point. C++ name:
std::complex<float>">`gr_complex`</abbr>. For the LabSat 3 Wideband file format,
this source can provide
[multiple radio frequency channels](#multiple-radio-frequency-chains).
This feature is not implemented for LabSat 2 or LabSat 3 format files.

LabSat 3 splits data into 2 GB files. This file source automatically increments
the file name when the signal is split into several files: it adds "_0000.LS3"
to this base path and filename. Thus, the next file will be "_0001.LS3" and so
on.

The block can work as well with files generated by
[SatGen](https://www.labsat.co.uk/index.php/en/products/satgen-simulator-software),
the associated software that allows users to create GNSS RF I&Q or IF data files
from predefined and user-defined scenarios.

This implementation accepts the following parameters:

|----------
|       **Parameter**       | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | **Required** |
| :-----------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|      --------------       |
|     `implementation`      | `Labsat_Signal_Source`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |  Mandatory   |
|        `filename`         | Path to the file base name of files containing the raw digitized signal samples. For single files using the LabSat 2 or the LabSat 3 Wideband formats, write directly the name of the file. Example: ```output.ls2```                                                                                                                                                                                                                                                                                                                                            |  Mandatory   |
|    `selected_channel`     | [`1`, `2`, `3`]: Select the frequency band of data present in the file. It defaults to 1. For LabSat 3 Wideband format files, this parameter admits a list of channels (_i.e._, `SignalSource.selected_channel=1,2`) and the source becomes a [multiple radio frequency channel source](#multiple-radio-frequency-chains).                                                                                                                                                                                                                                       |   Optional   |
|        `item_type`        | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Sample data type. Only <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr> is allowed in this implementation. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. |   Optional   |
| `enable_throttle_control` | [`true`, `false`]: If set to `true`, it throttles the output flow of samples such that the average rate does not exceed `throttle_frequency_sps`, thus emulating real-time operation. It defaults to `false`.                                                                                                                                                                                                                                                                                                                                                    |   Optional   |
| `throttle_frequency_sps`  | If `enable_throttle_control` is set to `true`, this parameter sets the sample rate applied by the throttle. It defaults to $$ 16368000 $$ Sps.                                                                                                                                                                                                                                                                                                                                                                                                                   |   Optional   |
|   `digital_io_enabled`    | [`true`, `false`]: If set to `true`, indicates that the LabSat 3 Wideband file contains additional I/O data. Those digital input channels are not used. This parameter is ignored for Labsat 2 and Labsat 3 file formats. It defaults to `false`.                                                                                                                                                                                                                                                                                                                |   Optional   |
|          `dump`           | [`true`, `false`]: If set to `true`, it dumps the content of the source file `filename` in <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr> format. It defaults to `false`.                                                                                                                                                                                                                                                                           |   Optional   |
|      `dump_filename`      | If `dump` is set to `true`, the name of the dump file. It defaults to `labsat_output.dat`                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |   Optional   |
|          -------          |

  _Signal Source implementation:_ **`Labsat_Signal_Source`**
  {: style="text-align: center;"}


It follows an example of a Signal Source block
configured with the `Labsat_Signal_Source` implementation, for the LabSat 2 format:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=Labsat_Signal_Source
SignalSource.filename=./output.ls2  ; <- PUT YOUR FILE NAME HERE
SignalSource.enable_throttle_control=true
SignalSource.throttle_frequency_sps=16368000
```

For the LabSat 3 format, this would be:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=Labsat_Signal_Source
SignalSource.filename=./GPS_025  ; <- PUT YOUR FILE BASE NAME HERE
SignalSource.enable_throttle_control=true
SignalSource.throttle_frequency_sps=16368000
```

In this LabSat 3 format example, the names of the files would be
`GPS_025_0000.LS3`, `GPS_025_0001.LS3`, and so on.

For the LabSat 3 Wideband version, this would be:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=Labsat_Signal_Source
SignalSource.filename=./output.LS3W  ; <- PUT YOUR FILE BASE NAME HERE
SignalSource.selected_channel=1
```

Please note that reading the LabSat 3 Wideband version requires an additional
INI file with the same name as the binary file but the extension (so in the
example it would be `./output.ini`) and located in the same folder.


### Implementation: `ION_GSMS_Signal_Source`

This is a signal source implementation that can read XML files that follow ION's
[GNSS Software Defined Receiver Metadata Standard](https://sdr.ion.org/) and
properly extract sample streams on demand.

A metadata file provides a structured representation of a list of sample streams,
which are stored in a specified location. The precise location and manner in which
the data is stored are entirely defined within the metadata file. Consequently,
users are not required to have knowledge of details such as quantization, alignment,
or data packing. The only necessary configuration for the user is to specify which
streams to decode and which to exclude.

This process is straightforward, as each stream within the metadata file is identified
by a unique string ID. The user simply needs to supply a comma-separated list of these
stream IDs. The specified streams will then be read, decoded, and presented as distinct
signal sources, thereby enabling support for multi-band receivers. GNSS-SDR can
automatically determine the item types and sizes based on the metadata file.

This source is not built by default. It requires explicit activation when building GNSS-SDR:

```console
$ cmake -DENABLE_ION=ON ../
```

This implementation accepts the following parameters:

|----------
|    **Parameter**    | **Description**                                  | **Required** |
| :-----------------: |
|  `implementation`   | `ION_GSMS_Signal_Source`                         | Mandatory    |
| `metadata_filename` | Path to the file containing the metadata.        | Mandatory    |
|      `streams`      | Comma-separated list of streams to be processed. | Mandatory    |
|       -------       |

  _Signal Source implementation:_ **`ION_GSMS_Signal_Source`**
  {: style="text-align: center;"}

Example:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=ION_GSMS_Signal_Source
SignalSource.metadata_filename=data/capture0_L1.sdrx
SignalSource.streams=L1
```

For testing purposes, this is an example of a metadata file that describes
the data file used in [My first position fix]({{ "/my-first-fix/" | relative_url }}):

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<metadata xmlns="http://www.ion.org/standards/sdrwg/schema/metadata.xsd">
    <system id="test-system">
        <freqbase format="MHz"> 4.0000000000000000e+00 </freqbase>
    </system>
    <band id="L1">
        <centerfreq format="GHz"> 1.5754200000000000e+00 </centerfreq>
        <translatedfreq format="kHz"> 0.0000000000000000e+00 </translatedfreq>
        <bandwidth format="MHz"> 2.4000000000000000e+01 </bandwidth>
    </band>
    <file>
        <url>2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.dat</url>
        <timestamp>04-Apr-2013 00:00:00</timestamp>
        <lane id="L1"/>
    </file>
    <lane id="L1">
        <bandsrc idband="L1" idsrc="none"/>
        <system id="test-system"/>
        <block>
            <cycles>0</cycles>
            <chunk>
                <sizeword>2</sizeword>
                <countwords>2</countwords>
                <endian>Little</endian>
                <padding>None</padding>
                <wordshift>Left</wordshift>
                <lump>
                    <stream id="L1">
                        <ratefactor>1</ratefactor>
                        <quantization>16</quantization>
                        <packedbits>32</packedbits>
                        <alignment>Right</alignment>
                        <shift>Left</shift>
                        <format>IQ</format>
                        <encoding>TC</encoding>
                        <band id="L1"/>
                    </stream>
                </lump>
            </chunk>
        </block>
    </lane>
</metadata>
```

### Implementation: `NTLab_File_Signal_Source`

This Signal Source implementation is currently available only in the `next` branch of the [GNSS-SDR upstream repository](https://github.com/gnss-sdr/gnss-sdr). It will be included in the upcoming stable release.
{: .notice--warning}

This is a Signal Source implementation that can read files of samples grabbed from [NTLab RF front-ends](https://ntlab.lt/) (NT1062/65/66/68/69), which can deliver 1, 2, or 4 parallel float streams from 2-bit sign-magnitude packed samples. This implementation supports 1-, 2-, or 4-channel modes, and it has been tested on the [TEXCUP GNSS dataset](https://mklimenko.github.io/english/2020/05/23/texcup_gnss_dataset/) (NTLab NT1065 capture). The dataset is described in this [article](/http://rnl.ae.utexas.edu/wp-content/uploads/texcup.pdf).

This Signal Source delivers 32-bit float items, each containing 4 bytes of real data, and with an Intermediate Frequency (check the NTLab documentation of the specific configuration used for signal grabbing).

* **Bit packing format:**

Each input byte encodes four 2-bit samples (**M**=magnitude, **S**=sign) in MSB-first order:

| Bits  | Sample Description          |
|:-----:|:----------------------------|
| 7–6   | $$ \left[ M_0^k S_0^k \right] $$ (ch 0 at time k) |
| 5–4   | $$ \left[ M_1^k S_1^k \right] $$ (ch 1 at time k) |
| 3–2   | $$ \left[ M_2^k S_2^k \right] $$ (ch 2 at time k) |
| 1–0   | $$ \left[ M_3^k S_3^k \right] $$ (ch 3 at time k) |

* **Value mapping**:

| M | S | Sample |
|:-:|:-:|:------:|
| 0 | 0 |  −1    |
| 0 | 1 |  +1    |
| 1 | 0 |  −3    |
| 1 | 1 |  +3    |

* **Sample arrangement by channel count:**
  - **1 channel**: each byte defined as $$ \left[ M_0^k S_0^k \quad \| \quad M_0^{k+1} S_0^{k+1} \quad \| \quad  M_0^{k+2} S_0^{k+2} \quad \|\quad  M_0^{k+3} S_0^{k+3} \right] $$, where symbol $$ \| $$ means bit concatenation.

  - **2 channels**: each byte defined as $$ \left[ M_0^k S_0^k	\quad \| \quad  M_1^k S_1^k\quad \| \quad  M_0^{k+1} S_0^{k+1}	\quad \| \quad  M_1^{k+1} S_1^{k+1} \right] $$.

  - **4 channels**: each byte defined as $$ \left[ M_0^k S_0^k \quad \| \quad M_1^k S_1^k	\quad \| \quad M_2^k S_2^k \quad \| \quad M_3^k S_3^k \right] $$.

This implementation accepts the following parameters:

|----------
|  **Parameter**   | **Description**     | **Required** |
| :--------------: | :------- | :----------: |
|  --------------  |
| `implementation` | `NTLab_File_Signal_Source`  |  Mandatory   |
|    `filename`    | Path to the file where samples dumped by the NTLab receiver is stored.  |  Mandatory   |
| `RF_channels` | `[1/2/4]` Number of RF bands delivered by the NTLab RF front-end. | Mandatory |
|   `sampling_frequency`    | Sample rate, in samples per second.  |  Mandatory   |
|         `samples`         | Number of samples to be read. If set to $$ 0 $$, the whole file but the last few milliseconds are processed. It defaults to $$ 0 $$.  |   Optional   |
|        `item_type`        | This implementation only admits <abbr id="data-type" title="Signed integer, 8-bit two's complement number ranging from -128 to 127. C++ type name: int8_t">`byte`</abbr>. |   Optional   |
|     `seconds_to_skip`     | Seconds of signal to skip from the beginning of the file before start processing. It defaults to $$ 0 $$ s.  |   Optional   |
|         `repeat`          | [`true`, `false`]: If set to `true`, processing of samples restarts the file when the end is reached. It defaults to `false`.  |   Optional   |
| `enable_throttle_control` | [`true`, `false`]: If set to `true`, it places a throttle controlling the data flow. It is generally not required, and it defaults to `false`.  |   Optional   |
 -------       |

  _Signal Source implementation:_ **`NTLab_File_Signal_Source`**
  {: style="text-align: center;"}


* **Configuration example:**

For this NTLab receiver's configuration:

**Channel 0:**
  - Sampling frequency: 79.5 Msps.
  - RF mixer frequency: 1590 MHz.
  - Passband: 1559 MHz - 1590 MHz.
  - Spectral inversion: true.
  - IF: 14.58 MHz.
  - Signals: GPS L1 C/A, Galileo E1, Beidou B1C.

**Channel 1:**
  - Sampling frequency: 79.5 Msps.
  - RF mixer frequency: 1590 MHz.
  - Passband: 1590 MHz - 1610 MHz.
  - Spectral inversion: false.

**Channel 2:**
  - Sampling frequency: 79.5 Msps.
  - RF mixer frequency: 1200 MHz.
  - Passband: 1163 MHz - 1200 MHz.
  - Spectral inversion: true.
  - IF: 23.55 MHz
  - Signals: GPS L5, Galileo E5a.

**Channel 3:**
  - Sampling frequency: 79.5 Msps.
  - RF mixer frequency: 1200 MHz.
  - Passband: 1200 MHz - 1237 MHz.
  - Spectral inversion: false.
  - IF: 27.6 MHz
  - Signals: GPS L2C.

A possible GNSS-SDR configuration file could look like this:

```ini

[GNSS-SDR]

;######### GLOBAL OPTIONS ##################
GNSS-SDR.internal_fs_sps=9937500

;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=NTLab_File_Signal_Source
SignalSource.filename=ntlab.bin  ; <- PUT YOUR FILE HERE
SignalSource.sampling_frequency=79500000
SignalSource.RF_channels=4

;######### SIGNAL_CONDITIONER CONFIG ############
SignalConditioner0.implementation=Signal_Conditioner  ; RF CHANNEL 0
SignalConditioner1.implementation=Signal_Conditioner  ; RF CHANNEL 1
SignalConditioner2.implementation=Signal_Conditioner  ; RF CHANNEL 2
SignalConditioner3.implementation=Signal_Conditioner  ; RF CHANNEL 3

;######### DATA_TYPE_ADAPTER CONFIG ############
; RF CHANNEL 0
DataTypeAdapter0.implementation=Pass_Through
DataTypeAdapter0.item_type=float
DataTypeAdapter0.inverted_spectrum=true
; RF CHANNEL 1
DataTypeAdapter1.implementation=Pass_Through
DataTypeAdapter1.item_type=float
; RF CHANNEL 2
DataTypeAdapter2.implementation=Pass_Through
DataTypeAdapter2.item_type=float
DataTypeAdapter2.inverted_spectrum=true
; RF CHANNEL 3
DataTypeAdapter3.implementation=Pass_Through
DataTypeAdapter3.item_type=float

;######### INPUT_FILTER CONFIG ############
; RF CHANNEL 0
InputFilter0.implementation=Freq_Xlating_Fir_Filter
InputFilter0.dump=false
InputFilter0.input_item_type=float
InputFilter0.output_item_type=gr_complex
InputFilter0.taps_item_type=float
InputFilter0.number_of_taps=5
InputFilter0.number_of_bands=2
InputFilter0.band1_begin=0.0
InputFilter0.band1_end=0.45
InputFilter0.band2_begin=0.55
InputFilter0.band2_end=1.0
InputFilter0.ampl1_begin=1.0
InputFilter0.ampl1_end=1.0
InputFilter0.ampl2_begin=0.0
InputFilter0.ampl2_end=0.0
InputFilter0.band1_error=1.0
InputFilter0.band2_error=1.0
InputFilter0.filter_type=bandpass
InputFilter0.grid_density=16
InputFilter0.sampling_frequency=79500000
InputFilter0.IF=14580000
InputFilter0.decimation_factor=8
; RF CHANNEL 1
InputFilter1.implementation=Freq_Xlating_Fir_Filter
InputFilter1.dump=false
InputFilter1.input_item_type=float
InputFilter1.output_item_type=gr_complex
InputFilter1.taps_item_type=float
InputFilter1.number_of_taps=5
InputFilter1.number_of_bands=2
InputFilter1.band1_begin=0.0
InputFilter1.band1_end=0.45
InputFilter1.band2_begin=0.55
InputFilter1.band2_end=1.0
InputFilter1.ampl1_begin=1.0
InputFilter1.ampl1_end=1.0
InputFilter1.ampl2_begin=0.0
InputFilter1.ampl2_end=0.0
InputFilter1.band1_error=1.0
InputFilter1.band2_error=1.0
InputFilter1.filter_type=bandpass
InputFilter1.grid_density=16
InputFilter1.sampling_frequency=79500000
InputFilter1.IF=0
InputFilter1.decimation_factor=8
; RF CHANNEL 2
InputFilter2.implementation=Freq_Xlating_Fir_Filter
InputFilter2.dump=false
InputFilter2.input_item_type=float
InputFilter2.output_item_type=gr_complex
InputFilter2.taps_item_type=float
InputFilter2.number_of_taps=5
InputFilter2.number_of_bands=2
InputFilter2.band1_begin=0.0
InputFilter2.band1_end=0.45
InputFilter2.band2_begin=0.55
InputFilter2.band2_end=1.0
InputFilter2.ampl1_begin=1.0
InputFilter2.ampl1_end=1.0
InputFilter2.ampl2_begin=0.0
InputFilter2.ampl2_end=0.0
InputFilter2.band1_error=1.0
InputFilter2.band2_error=1.0
InputFilter2.filter_type=bandpass
InputFilter2.grid_density=16
InputFilter2.sampling_frequency=79500000
InputFilter2.IF=23550000
InputFilter2.decimation_factor=8
; RF CHANNEL 3
InputFilter3.implementation=Freq_Xlating_Fir_Filter
InputFilter3.dump=false
InputFilter3.input_item_type=float
InputFilter3.output_item_type=gr_complex
InputFilter3.taps_item_type=float
InputFilter3.number_of_taps=5
InputFilter3.number_of_bands=2
InputFilter3.band1_begin=0.0
InputFilter3.band1_end=0.45
InputFilter3.band2_begin=0.55
InputFilter3.band2_end=1.0
InputFilter3.ampl1_begin=1.0
InputFilter3.ampl1_end=1.0
InputFilter3.ampl2_begin=0.0
InputFilter3.ampl2_end=0.0
InputFilter3.band1_error=1.0
InputFilter3.band2_error=1.0
InputFilter3.filter_type=bandpass
InputFilter3.grid_density=16
InputFilter3.sampling_frequency=79500000
InputFilter3.IF=27600000
InputFilter3.decimation_factor=8

;######### RESAMPLER CONFIG ############
; RF CHANNEL 0
Resampler0.implementation=Pass_Through
Resampler0.item_type=gr_complex
; RF CHANNEL 1
Resampler1.implementation=Pass_Through
Resampler1.item_type=gr_complex
; RF CHANNEL 2
Resampler2.implementation=Pass_Through
Resampler2.item_type=gr_complex
; RF CHANNEL 3
Resampler3.implementation=Pass_Through
Resampler3.item_type=gr_complex

;######### CHANNELS GLOBAL CONFIG ############
Channels.in_acquisition=1
Channels_1C.count=8 ;# GPS L1
Channels_L5.count=8 ;# GPS L5
Channels_2S.count=8 ;# GPS L2C
Channels_1B.count=8 ;# Galileo E1b
Channels_5X.count=8 ;# Galileo E5a
Channels_B1.count=8 ;# Beidou B1I
; RF CHANNEL MAPPING
Channels_1C.RF_channel_ID=0
Channels_L5.RF_channel_ID=2
Channels_2S.RF_channel_ID=3
Channels_1B.RF_channel_ID=0
Channels_5X.RF_channel_ID=2
Channels_B1.RF_channel_ID=0

;######### ACQUISITION CONFIG ############
...
```

A full configuration example is available [here](https://github.com/gnss-sdr/gnss-sdr/blob/next/conf/File_input/MultiCons/gnss-sdr_ntlab.conf).

---

<p>&nbsp;</p>
<p>&nbsp;</p>

## Reading data from a pipe

### Implementation: `Fifo_Signal_Source`

This implementation allows using a
[Unix FIFO](https://en.wikipedia.org/wiki/Named_pipe) as a signal source, thus
allowing to multiplex signal streams outside of `gnss-sdr`, letting another
program to hold access to the receiver, or allowing signal sources that are not
supported by `gnss-sdr` but can dump the signal to a FIFO.

This implementation accepts the following parameters:

|----------
|  **Parameter**   | **Description**                                                                                                                                                                                                                                                                        | **Required** |
| :--------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|  --------------  |
| `implementation` | `Fifo_Signal_Source`                                                                                                                                                                                                                                                                   |  Mandatory   |
|    `filename`    | Name of the fifo stream from which samples will be read.                                                                                                                                                                                                                               |  Mandatory   |
|  `sample_type`   | [`ibyte`, `ishort`, `gr_complex`]: Sample type in fifo stream. It defaults to `ishort`. The output of this block is always `gr_complex`.                                                                                                                                                        |   Optional   |
|      `dump`      | [`true`, `false`]: If set to `true`, it dumps the content of the source file `filename` in <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr> format. It defaults to `false`. |   Optional   |
| `dump_filename`  | If `dump` is set to `true`, the name of the dump file. It defaults to `./data/signal_source.dat`                                                                                                                                                                                       |   Optional   |
|     -------      |

_Signal Source implementation:_ **`Fifo_Signal_Source`**
{: style="text-align: center;"}

Example of configuration:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=Fifo_Signal_Source
SignalSource.filename=fifo.fifo
SignalSource.sample_type=ishort
SignalSource.dump=false
SignalSource.dump_filename=./dump.dat
```

Example of usage:
```console
$ mkfifo fifo.fifo && cat path_to.bin >> fifo.fifo
```

## Reading data from a ZeroMQ stream

### Implementation: `ZMQ_Signal_Source`

This implementation allows for existing GNU Radio flow graphs to handle the data
source control, potentially including various transformations, then publish
samples via [ZeroMQ](https://zeromq.org/). This block could subscribe to that
stream.

The availability of this block requires the source code to be configured with

```console
$ cmake -DENABLE_ZMQ=ON ..
```

and the GNU Radio's `gr::zeromq` component installed in your system.

This implementation accepts the following parameters:

|----------
|  **Parameter**   | **Description**                                                                                                        | **Required** |
| :--------------: | :--------------------------------------------------------------------------------------------------------------------- | :----------: |
|  --------------  |
| `implementation` | `ZMQ_Signal_Source`                                                                                                    |  Mandatory   |
|    `endpoint`    | Address of the ZMQ pub. Empty by default.                                                                              |  Mandatory   |
|   `item_type`    | [`gr_complex`, `short`, `ishort`, `byte`, `ibyte`]: Data type of the samples (default: `gr_complex`).                  |   Optional   |
|      `vlen`      | Vector length of the input items. Note that one vector is one item. It defaults to `1`.                                |   Optional   |
|   `pass_tags`    | [`true`, `false`]: Whether source will look for and deserialize tags. It defaults to `false`.                          |   Optional   |
|   `timeout_ms`   | Receive timeout in milliseconds, default is `100` ms, 1 ms increments.                                                 |   Optional   |
|      `hwm`       | High Watermark to configure the socket to. It defaults to `-1`, which is also zmq's default.                           |   Optional   |
|      `dump`      | [`true`, `false`]: If set to `true`, it dumps the content received from the ZMQ pub in a file. It defaults to `false`. |   Optional   |
| `dump_filename`  | If `dump` is set to `true`, the name of the dump file. It defaults to `./data/zmq_dump.dat`                            |   Optional   |
|     -------      |

_Signal Source implementation:_ **`ZMQ_Signal_Source`**
{: style="text-align: center;"}

Example of configuration:

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=ZMQ_Signal_Source
SignalSource.endpoint=tcp://127.0.0.1:55555
SignalSource.item_type=ishort
SignalSource.dump=true
SignalSource.dump_filename=./zmq_dump.dat
```

<p>&nbsp;</p>
<p>&nbsp;</p>

## Radio Frequency front-ends

### Implementation: `UHD_Signal_Source`

[![Ettus Research]({{ "/assets/images/logo-ettus.png" | relative_url
}}){:height="250px" width="250px"}{: .align-right}{:
.invert-colors}](https://www.ettus.com) The USRP Hardware Driver
([UHD](https://files.ettus.com/manual/)) software API supports application
development on all [Ettus Research](https://www.ettus.com)'s
[USRP](https://www.ettus.com/products/) Software Defined Radio products. Using a
common software interface is critical as it increases code portability, allowing
applications to transition seamlessly to other USRP SDR platforms when
development requirements expand or new platforms are available. Hence, it
enables a significant reduction in development effort by allowing you to
preserve and reuse your legacy code so you can focus on new algorithms.

This implementation accepts the following parameters:

|----------
|      **Parameter**       | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | **Required** |
| :----------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|      --------------      |
|     `implementation`     | `UHD_Signal_Source`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |  Mandatory   |
|     `device_address`     | IP address of the USRP device. When left empty, the device discovery routines will search all the available transports on the system (Ethernet, USB, ...)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |  Mandatory   |
|       `subdevice`        | [`A:0`, `B:0`, `A:0 B:0`]: UHD [subdevice specification](https://files.ettus.com/manual/page_configuration.html#config_subdev).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |  Mandatory   |
|   `sampling_frequency`   | Set the sampling frequency, in samples per second.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |  Mandatory   |
|      `RF_channels`       | Number of RF channels present in the front-end device. It defaults to 1.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |   Optional   |
|      `clock_source`      | [`internal`, `external`, `MIMO`]: Set the clock source for the USRP device. It defaults to `internal`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |   Optional   |
|       `item_type`        | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 8-bit integer. C++ name: lv_8sc_t (custom definition of std::complex<int8_t>)">`cbyte`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: data type for each sample. The type <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 8-bit integer. C++ name: lv_8sc_t (custom definition of std::complex<int8_t>)">`cbyte`</abbr> (_i.e._, complex signed 8-bit integers) is not available in USRP devices with their default configurations. This parameter defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>. |   Optional   |
|       `otw_format`       | [`sc16` (Q16 I16), `sc8` (Q8_1 I8_1 Q8_0 I8_0), `sc12` (only some devices)]: Set the [over-the-wire data format](https://files.ettus.com/manual/page_configuration.html#config_stream_args_otw_format) (that is, the sample format used between the device and the UHD). It defaults to `sc16`. This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |   Optional   |
|     `device_serial`      | Filter the device by serial number if required (useful for USB devices). It is empty by default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |   Optional   |
| `device_recv_frame_size` | The size of a single receive buffer in bytes. Default value (on MPMD-based and X300 devices): `1472` (if link rate is GigE); `8000` (if link rate is 10 GigE or 100 GigE); RX MTU (other link rates). Note that value will be capped at the link's receive [MTU](https://en.wikipedia.org/wiki/Maximum_transmission_unit). This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |   Optional   |
| `device_num_recv_frames` | The number of receive buffers to allocate. Default value: `32`. This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |   Optional   |
|         -------          |

If `RF_channels` is set to `1`, then:

|----------
|   **Parameter**   | **Description**                                                                                                                   | **Required** |
| :---------------: | :-------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|  --------------   |
|      `freq`       | Set the RF front-end center frequency, in Hz.                                                                                     |  Mandatory   |
| `IF_bandwidth_hz` | Set the IF passband filter bandwidth of the front-end, in Hz. It defaults to `sampling_frequency` / 2.                            |   Optional   |
|      `gain`       | Set the RF front-end gain, in dB, distributed across all gain elements. It defaults to $$ 50 $$ dB.                               |   Optional   |
|     `samples`     | Number of samples to be processed. It defaults to $$ 0 $$, which means infinite samples.                                          |   Optional   |
|      `dump`       | [`true`, `false`]: If set to `true`, it enables the dump of the signal source delivered data into a file. It defaults to `false`. |   Optional   |
|  `dump_filename`  | If `dump` is set to `true`, the name of the file in which internal data will be stored. It defaults to `./data/signal_source.dat` |   Optional   |
|      -------      |

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

If `RF_channels` is set to more than one, then the number of the radio-frequency
channel (starting with $$ 0 $$) is appended to the name of parameters `samples`,
`dump`, `dump_filename`, `freq`, `gain` and `IF_bandwidth_hz` to indicate to
which RF chain they apply.

For instance, if `RF_channels` is set to `2`, then:

|----------
|   **Parameter**    | **Description**                                                                                                                           | **Required** |
| :----------------: | :---------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|   --------------   |
|      `freq0`       | RF front-end center frequency for RF channel 0, in Hz.                                                                                    |  Mandatory   |
| `IF_bandwidth_hz0` | Set the IF passband filter bandwidth of RF channel 0, in Hz. It defaults to `sampling_frequency` / 2.                                     |   Optional   |
|      `gain0`       | Set the RF front-end gain for RF channel 0, in dB, distributed across all gain elements. It defaults to $$ 50 $$ dB.                      |   Optional   |
|     `samples0`     | Number of samples to be processed for RF channel 0. It defaults to $$ 0 $$, which means infinite samples                                  |   Optional   |
|      `dump0`       | [`true`, `false`]: If set to `true`, it enables the dump of the signal source $$ 0 $$ delivered data into a file. It defaults to `false`. |   Optional   |
|  `dump_filename0`  | If `dump0` is set to `true`, the name of the file in which data will be stored. It defaults to `./data/signal_source0.dat`                |   Optional   |
|      `freq1`       | RF front-end center frequency for RF channel 1, in Hz.                                                                                    |  Mandatory   |
| `IF_bandwidth_hz1` | Set the IF passband filter bandwidth of RF channel 1, in Hz. It defaults to `sampling_frequency` / 2.                                     |   Optional   |
|      `gain1`       | Set the RF front-end gain for RF channel 1, in dB, distributed across all gain elements. It defaults to $$ 50 $$ dB.                      |   Optional   |
|     `samples1`     | Number of samples to be processed for RF channel 1. It defaults to $$ 0 $$, which means infinite samples                                  |   Optional   |
|      `dump1`       | [`true`, `false`]: If set to `true`, it enables the dump of the signal source $$ 1 $$ delivered data into a file. It defaults to `false`. |   Optional   |
|  `dump_filename1`  | If `dump1` is set to `true`, the name of the file in which data will be stored. It defaults to `./data/signal_source1.dat`                |   Optional   |
|      -------       |

  _Signal Source implementation:_ **`UHD_Signal_Source`** multiple-band parameters.
  {: style="text-align: center;"}

{% capture tip-exit %}
  **Tip:** If the `samples` parameter is not specified, or set to $$ 0 $$, the
  USRP will deliver samples in a continuous way and with no specified end time,
  and so the software receiver will process endlessly. When configured for an
  infinite number of samples, please **always** terminate the software receiver
  execution by **pressing key 'q' and then key 'ENTER'**. This will make the
  program to exit gracefully, doing some clean-up work and preparing output
  products such as RINEX files to be properly read by other software tools. This
  is not guaranteed if the program is interrupted for instance by pressing keys
  'CTRL' and 'c' at the same time.
{% endcapture %}

<div class="notice--warning">
  {{ tip-exit | markdownify }}
</div>



### Implementation: `Osmosdr_Signal_Source`

[![OsmoSDR]({{ "/assets/images/osmocom.png" | relative_url }}){:height="250px"
width="250px"}{: .align-right}](https://osmocom.org/)
[OsmoSDR](https://osmocom.org/projects/gr-osmosdr) is a 100 % Free Software
based small form-factor inexpensive SDR (Software Defined Radio) project. It
consists of USB-attached hardware, the associated firmware as well as software
tools for GNU Radio integration. The project also provides a software driver for
several RF front-ends such as [RTL-based
dongles](https://www.rtl-sdr.com/tag/v3/),
[HackRF](https://greatscottgadgets.com/hackrf/),
[bladeRF](https://www.nuand.com/),
[LimeSDR](https://myriadrf.org/projects/component/limesdr/),
[etc](https://osmocom.org/projects/gr-osmosdr).

If you installed GNSS-SDR from a software package, this implementation is
already available. But if you built GNSS-SDR from the source code, you will need
to install the required software dependencies (the `gr-osmosdr` component of GNU
Radio) and configure the GNSS-SDR building with the following flag:

```console
$ cmake -DENABLE_OSMOSDR=ON ../
```

For more information, check out the tutorial about [GNSS-SDR options at building
time]({{ "/docs/tutorials/configuration-options-building-time/" | relative_url }}).


This implementation accepts the following parameters:

|----------
|    **Parameter**     | **Description**                                                                                                                                                                                                                                                                                                                                                                                                 | **Required** |
| :------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|    --------------    |
|   `implementation`   | `Osmosdr_Signal_Source`                                                                                                                                                                                                                                                                                                                                                                                         |  Mandatory   |
|        `freq`        | RF front-end center frequency, in Hz.                                                                                                                                                                                                                                                                                                                                                                           |  Mandatory   |
|        `gain`        | RF front-end gain for RF channel 0, in dB. The value is spread across the receiving chain. It defaults to $$ 40 $$ dB.                                                                                                                                                                                                                                                                                          |   Optional   |
|      `rf_gain`       | RF front-end gain for the RF amplifier, in dB. It defaults to $$ 40 $$ dB.                                                                                                                                                                                                                                                                                                                                      |   Optional   |
|      `if_gain`       | RF front-end gain for the IF amplifier, in dB. It defaults to $$ 40 $$ dB.                                                                                                                                                                                                                                                                                                                                      |   Optional   |
|       `if_bw`        | Set the bandpass filter on the radio frontend, in Hz. It defaults to `0` (automatic selection). This feature is present in GNSS-SDR v0.0.18 and later versions.                                                                                                                                                                                                                                                 |   Optional   |
| `sampling_frequency` | Sampling frequency, in samples per second. It defaults to 2 Ms/s.                                                                                                                                                                                                                                                                                                                                               |   Optional   |
|    `AGC_enabled`     | [`true`, `false`]: If set to `true`, enables Automatic Gain Control. It defaults to `false`.                                                                                                                                                                                                                                                                                                                    |   Optional   |
| `iq_balance_mode` | [`0`, `1`, `2`]: Set the RF front-end IQ balance mode: `0` = Off, `1` = Manual, `2` = Automatic. The automatic correction uses an algorithm to adjust for I-Q imbalance. It defaults to `2` (Automatic). | Optional |
| `dc_offset_mode` | [`0`, `1`, `2`]: Set the RF front-end DC correction mode: `0` = Off, `1` = Manual, `2` = Automatic. The automatic correction subtracts out the long-run average. It defaults to `2` (Automatic).  | Optional |
|      `samples`       | Number of samples to be processed. It defaults to $$ 0 $$, which means infinite samples.                                                                                                                                                                                                                                                                                                                        |   Optional   |
|     `item_type`      | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the output data type. Only  <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr> is allowed in this version, so it is set by default. |   Optional   |
|    `osmosdr_args`    | Pass arguments to the OsmoSDR driver. Check the [gr-osmosdr wiki](https://osmocom.org/projects/gr-osmosdr/wiki/GrOsmoSDR) for a list of arguments for your specific hardware.                                                                                                                                                                                                                                   |   Optional   |
|      `antenna`       | [`NONE`, `LNAL`, `LNAH`, `LNAW`]: Select the LimeSDR RX antenna. `LNAW` is recommended for GNSS applications. It defaults to _empty_.                                                                                                                                                                                                                                                                           |   Optional   |
|        `dump`        | [`true`, `false`]: If set to `true`, it enables the dump of the signal source into a file. It defaults to `false`.                                                                                                                                                                                                                                                                                              |   Optional   |
|   `dump_filename`    | If `dump` is set to `true`, the name of the file in which data will be stored. It defaults to `./data/signal_source.dat`                                                                                                                                                                                                                                                                                        |   Optional   |
|       -------        |

Please note that not all the OsmoSDR-compatible devices can work as radio
frequency front-ends for proper GNSS signal reception, please check the
specifications. For suitable RF front-ends, you can use:

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
```

{% capture bias-tee-rtlsdrv3 %}
**Tip:** To feed an active GNSS antenna, various SDRs feature a bias-tee which is activated through *osmosdr_args*.

In the case of using a [HackRF One](https://greatscottgadgets.com/hackrf/),
you can activate the antenna feeding with:

```ini
SignalSource.osmosdr_args=hackrf,bias=1
```

The new [RTL-SDR Blog V3](https://www.rtl-sdr.com/wp-content/uploads/2018/02/RTL-SDR-Blog-V3-Datasheet.pdf)
dongles ship a < 1 PPM temperature compensated oscillator (TCXO), well
suited for GNSS signal processing, and a 4.5 V powered bias-tee to feed an
active antenna.
With newer versions of [gr-osmosdr](https://github.com/osmocom/gr-osmosdr)
(>= 0.1.4-13), the bias-tee can be activated by passing the following
parameters to the configuration:

```ini
SignalSource.osmosdr_args=rtl,bias=1
```

For older gr-osmosdr versions (at GNSS-SDR compile time), the utility
[rtl_biast](https://github.com/OrbitTheSun/rtl_biast) may be used to switch the
bias-tee on before calling gnss-sdr. After reception, the bias-tee is switched off
automatically by the program.


For the [bladeRF 2.0 micro](https://www.nuand.com/bladerf-2-0-micro/), the argument is slightly different:
```ini
SignalSource.osmosdr_args=bladerf,biastee=1	#or =[on,rx]
```

{% endcapture %}

<div class="notice--warning">
  {{ bias-tee-rtlsdrv3 | markdownify }}
</div>

### Implementation: `RtlTcp_Signal_Source`

In the case of using a Zarlink's RTL2832 based DVB-T receiver, you can even use
the [`rtl_tcp`](https://osmocom.org/projects/rtl-sdr/wiki) I/Q server in order
to use the USB dongle remotely. `rtl_tcp` is an I/Q spectrum server for RTL2832
based DVB-T receivers.

If you installed GNSS-SDR from a software package, this implementation is
already available. But if you built GNSS-SDR from the source code, you will need
the required software dependencies (the `gr-osmosdr` component of GNU Radio) and
configure the building with the following flag:

```console
$ cmake -DENABLE_OSMOSDR=ON ../
```

For more information, check out the tutorial about [GNSS-SDR options at building
time]({{ "/docs/tutorials/configuration-options-building-time/" | relative_url }}).

In a terminal, type:

```console
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


### Implementation: `Fmcomms2_Signal_Source`

[![AD-FMComms2-EBZ]({{ "/assets/images/fmcomms2.png" | relative_url
}}){:height="250px" width="250px"}{:
.align-right}](https://www.analog.com/en/resources/evaluation-hardware-and-software/evaluation-boards-kits/EVAL-AD-FMCOMMS2.html)
The
[AD-FMCOMMS2-EBZ](https://www.analog.com/en/resources/evaluation-hardware-and-software/evaluation-boards-kits/EVAL-AD-FMCOMMS2.html)
is an FPGA Mezzanine Card
([FMC](https://fmchub.github.io/appendix/VITA57_FMC_HPC_LPC_SIGNALS_AND_PINOUT.html))
board for the [AD9361](https://www.analog.com/en/products/ad9361.html), a highly
integrated RF transceiver originally designed for use in 3G and 4G base station
applications.  Its programmability and wideband capability make it ideal for a
broad range of applications, since the device combines a RF front end with a
flexible mixed-signal baseband section and integrated frequency synthesizers,
providing a configurable digital interface. The AD9361 receiver's local
oscillator can operate from $$ 70 $$ MHz to $$ 6.0 $$ GHz, and channel
bandwidths from less than $$ 200 $$ kHz to $$ 56 $$ MHz are supported. The two
independent direct conversion receivers have state-of-the-art noise figure and
linearity. Each receive (RX) subsystem includes independent automatic gain
control (AGC), dc offset correction, quadrature correction, and digital
filtering, thereby eliminating the need for these functions in the digital
baseband. Two high dynamic range analog-to-digital converters (ADCs) per channel
digitize the received I and Q signals and pass them through decimation filters
and 128-tap finite impulse response (FIR) filters to produce a 12-bit output
signal at the appropriate sample rate.

The AD9361 RX signal path passes downconverted signals (I and Q) to the baseband
receiver section. The baseband RX signal path is composed of two programmable
analog low-pass filters, a 12-bit ADC, and four stages of digital decimating
filters. Each of the four decimating filters can be bypassed. The figure below
shows a block diagram for the AD9361 RX signal path after downconversion. Note
that both the I and Q paths are schematically identical to each other.

<figure>
  {{ fig_img5 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>Block diagram for the AD9361 RX signal path after downconversion, composed of two programmable analog low-pass filters, a 12-bit ADC, and four stages of digital decimating filters.</figcaption>
</figure>

In order to make use of this block implementation, you need to build GNSS-SDR
from the source code after installing the required software dependencies.

In Debian Buster or Ubuntu Cosmic, those dependencies can be installed as:

```console
$ sudo apt install libiio-dev gr-iio
```

In older releases or other distributions, dependencies can be built from source
as:

```console
$ sudo apt install libxml2-dev bison flex
$ git clone https://github.com/analogdevicesinc/libiio
$ cd libiio
$ mkdir build && cd build && cmake .. && make && sudo make install
$ cd ../..
$ git clone https://github.com/analogdevicesinc/libad9361-iio
$ cd libad9361-iio
$ mkdir build && cd build && cmake .. && make && sudo make install
$ cd ../..
$ git clone https://github.com/analogdevicesinc/gr-iio
$ cd gr-iio
$ mkdir build && cd build && cmake .. && make && sudo make install
$ cd ../..
```

**Warning**: do **not** use gr-iio < 0.3 packaged in Debian releases older than
Buster and Ubuntu releases older than Cosmic.

`gr-iio` became a [native component of GNU
Radio](https://github.com/gnuradio/gnuradio/tree/main/gr-iio) since version
3.10.1.0. If that native component is found, the explicit installation of the
gr-iio package is not required.
{: .notice--info }

Once gr-iio is installed, build GNSS-SDR passing the flag `-DENABLE_FMCOMMS2=ON`
at configure time:

```console
$ cd gnss-sdr && mkdir build && cd build
$ git checkout next
$ git pull upstream next
$ cmake -DENABLE_FMCOMMS2=ON ..
$ make && sudo make install
```

This implementation accepts the following parameters:

|----------
|    **Parameter**     | **Description**                                                                                                                                                                                                                                                                                                                                                                                                | **Required** |
| :------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|    --------------    |
|   `implementation`   | `Fmcomms2_Signal_Source`                                                                                                                                                                                                                                                                                                                                                                                       |  Mandatory   |
|   `device_address`   | Set to `local:` if using GNSS-SDR locally on the target (_e.g._, in a Zedboard). If using GNSS-SDR remotely on a PC, set the target IP address using `ip:XXX.XXX.XXX.XXX` or via USB using the URI `usb:XX.XX.XX`. It defaults to `192.168.2.1`                                                                                                                                                                |  Mandatory   |
|        `freq`        | Selects the RX local oscillator frequency, in Hz. It defaults to $$ f_{\text{GPS L1}}=1575420000 $$ Hz.                                                                                                                                                                                                                                                                                                        |   Optional   |
| `sampling_frequency` | Defines the sampling rate, in samples per second (Sps). It defaults to $$ f_s = 2600000 $$ Sps.                                                                                                                                                                                                                                                                                                                |   Optional   |
|     `bandwidth`      | Configures RX analog filters TIA LPF and BB LPF, in Hz. It defaults to $$ 2000000 $$ Hz.                                                                                                                                                                                                                                                                                                                       |   Optional   |
|     `item_type`      | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the output data type. Only <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr> is allowed in this version, so it is set by default. |   Optional   |
|     `rx1_enable`     | [`true`, `false`]: If set to `true`, it enables the RX1 chain. It defaults to `true`.                                                                                                                                                                                                                                                                                                                          |   Optional   |
|     `rx2_enable`     | [`true`, `false`]: If set to `true`, it enables the RX2 chain. It defaults to `false`.                                                                                                                                                                                                                                                                                                                         |   Optional   |
|    `buffer_size`     | Size of the internal buffer, in samples. This block will only input one buffer of samples at a time. It defaults to 0xA0000 (that is, $$ 655360 $$ samples).                                                                                                                                                                                                                                                   |   Optional   |
|     `quadrature`     | [`true`, `false`]: If set to `true`, it enables the Quadrature calibration tracking option ([Read more](https://ez.analog.com/rf/wide-band-rf-transceivers/design-support/w/documents/10074/ad9361-transmit-quadrature-calibration-tx-quad-cal)). It defaults to `true`.                                                                                                                                       |   Optional   |
|       `rf_dc`        | [`true`, `false`]: If set to `true`, it enables the RF DC calibration tracking option ([Read more](https://wiki.analog.com/resources/tools-software/linux-drivers/iio-transceiver/ad9361#calibration_tracking_controls)). It defaults to `true`.                                                                                                                                                               |   Optional   |
|       `bb_dc`        | [`true`, `false`]: If set to `true`, it enables the BB DC calibration tracking option ([Read more](https://wiki.analog.com/resources/tools-software/linux-drivers/iio-transceiver/ad9361#calibration_tracking_controls)). It defaults to `true`.                                                                                                                                                               |   Optional   |
|   `gain_mode_rx1`    | [`manual`, `slow_attack`, `hybrid`, `fast_attack`]: Sets the gain control mode of the RX1 chain ([Read more](https://wiki.analog.com/resources/tools-software/linux-drivers/iio-transceiver/ad9361#gain_control_modes)). It defaults to `slow_attack`.                                                                                                                                                         |   Optional   |
|   `gain_mode_rx2`    | [`manual`, `slow_attack`, `hybrid`, `fast_attack`]: Sets the gain control mode of the RX2 chain ([Read more](https://wiki.analog.com/resources/tools-software/linux-drivers/iio-transceiver/ad9361#gain_control_modes)). It defaults to `slow_attack`.                                                                                                                                                         |   Optional   |
|      `gain_rx1`      | If `gain_mode_rx1` is set to `manual`, it sets the gain of the RX1 chain, in dB, with a granularity of 1 dB and range $$ 0 < $$`gain_rx1`$$ < 72 $$ dB. It defaults to $$ 64 $$ dB.                                                                                                                                                                                                                            |   Optional   |
|      `gain_rx2`      | If `gain_mode_rx2` is set to `manual`, it sets the gain of the RX2 chain, in dB, with a granularity of 1 dB and range $$ 0 < $$`gain_rx2`$$ < 72 $$ dB. It defaults to $$ 64 $$ dB.                                                                                                                                                                                                                            |   Optional   |
|   `rf_port_select`   | [`A_BALANCED`, `B_BALANCED`, `C_BALANCED`, `A_N`, `A_P`, `B_N`, `B_P`, `C_N`, `C_P`]: Selects the RF port to be used ([Read more](https://wiki.analog.com/resources/tools-software/linux-drivers/iio-transceiver/ad9361#rf_port_selection) and [more](https://wiki.analog.com/resources/tools-software/linux-drivers/iio-transceiver/ad9361-customization?&#rf_port_select)). It defaults to `A_BALANCED`.     |   Optional   |
|    `filter_file`     | Allows a FIR filter configuration to be loaded from a file ([Read more](https://wiki.analog.com/resources/tools-software/linux-drivers/iio-transceiver/ad9361#digital_fir_filter_controls)). It defaults to "" (empty).                                                                                                                                                                                        |   Optional   |
|    `filter_auto`     | [`true`, `false`]: If set to `true`, it loads a default FIR filter and thereby enables lower sampling / baseband rates. It defaults to `false`.                                                                                                                                                                                                                                                                |   Optional   |
|      `samples`       | Number of samples to be processed. It defaults to $$ 0 $$, which means infinite samples.                                                                                                                                                                                                                                                                                                                       |   Optional   |
|        `dump`        | [`true`, `false`]: If set to `true`, it enables the dump of the signal source into a file. It defaults to `false`.                                                                                                                                                                                                                                                                                             |   Optional   |
|   `dump_filename`    | If `dump` is set to `true`, the name of the file in which data will be stored. It defaults to `./data/signal_source.dat`                                                                                                                                                                                                                                                                                       |   Optional   |
|       -------        |

  _Signal Source implementation:_ **`Fmcomms2_Signal_Source`**
  {: style="text-align: center;"}

Example:

```ini
SignalSource.implementation=Fmcomms2_Signal_Source
SignalSource.device_address=10.42.0.196  ; <- PUT YOUR DEVICE ADDRESS HERE
SignalSource.sampling_frequency=2000000
SignalSource.freq=1575420000
SignalSource.bandwidth=2000000
SignalSource.rx1_enable=true
SignalSource.gain_mode_rx1=manual
SignalSource.gain_rx1=64
SignalSource.rf_port_select=A_BALANCED
```

### Implementation: `Plutosdr_Signal_Source`

[![ADALM-Pluto]({{ "/assets/images/ADALM-Pluto.png" | relative_url
}}){:height="250px" width="250px"}{:
.align-right}](https://www.analog.com/en/resources/evaluation-hardware-and-software/evaluation-boards-kits/adalm-pluto.html)
The
[ADALM-Pluto](https://www.analog.com/en/resources/evaluation-hardware-and-software/evaluation-boards-kits/adalm-pluto.html)
is a learning module that helps introduce electrical engineering students to the
fundamentals of software-defined radio (SDR), radio frequency (RF), and wireless
communications. Based on the
[AD9363](https://www.analog.com/en/products/AD9363.html), it offers one receive
channel and one transmit channel which can be operated in full-duplex, capable
of generating or measuring RF analog signals from $$ 325 $$ to $$ 3800 $$ MHz,
with a $$ 20 $$ MHz bandwidth, at up to $$ 61.44 $$ Mega Samples per second
(MSps) with a 12-bit ADC and DAC.

In order to make use of this block implementation, you need to build GNSS-SDR
from the source code after installing the required software dependencies:

```console
$ sudo apt install libxml2-dev bison flex
$ git clone https://github.com/analogdevicesinc/libiio
$ cd libiio
$ mkdir build && cd build && cmake .. && make && sudo make install
$ cd ../..
$ git clone https://github.com/analogdevicesinc/libad9361-iio
$ cd libad9361-iio
$ mkdir build && cd build && cmake .. && make && sudo make install
$ cd ../..
$ git clone https://github.com/analogdevicesinc/gr-iio
$ cd gr-iio
$ mkdir build && cd build && cmake .. && make && sudo make install
$ cd ../..
```

**Warning**: do **not** use gr-iio < 0.3 packaged in some Debian and Ubuntu
distributions.

`gr-iio` became a [native component of GNU
Radio](https://github.com/gnuradio/gnuradio/tree/main/gr-iio) since version
3.10.1.0. If that native component is found, the explicit installation of the
gr-iio package is not required.
{: .notice--info }

Once gr-iio is installed, build GNSS-SDR passing the flag `-DENABLE_PLUTOSDR=ON`
at configure time:

```console
$ cd gnss-sdr && mkdir build && cd build
$ git checkout next
$ git pull upstream next
$ cmake -DENABLE_PLUTOSDR=ON ..
$ make && sudo make install
```


This implementation accepts the following parameters:

|----------
|    **Parameter**     | **Description**                                                                                                                                                                                                                                                                                                                                                                                                | **Required** |
| :------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|    --------------    |
|   `implementation`   | `Plutosdr_Signal_Source`                                                                                                                                                                                                                                                                                                                                                                                       |  Mandatory   |
|   `device_address`   | Set to `local:` if using GNSS-SDR locally on the target (_e.g._, in a Zedboard). If using GNSS-SDR remotely on a PC, set the target IP address using `ip:XXX.XXX.XXX.XXX` or via USB using the URI `usb:XX.XX.XX`. It defaults to `192.168.2.1`                                                                                                                                                                |  Mandatory   |
|        `freq`        | Selects the RX local oscillator frequency, in Hz. It defaults to $$ f_{\text{GPS L1}}=1575420000 $$ Hz.                                                                                                                                                                                                                                                                                                        |   Optional   |
| `sampling_frequency` | Defines the sampling rate, in samples per second (Sps). It defaults to $$ f_s = 3000000 $$ Sps.                                                                                                                                                                                                                                                                                                                |   Optional   |
|     `bandwidth`      | Configures RX analog filters TIA LPF and BB LPF, in Hz. It defaults to $$ 2000000 $$ Hz.                                                                                                                                                                                                                                                                                                                       |   Optional   |
|     `item_type`      | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the output data type. Only <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr> is allowed in this version, so it is set by default. |   Optional   |
|    `buffer_size`     | Size of the internal buffer, in samples. This block will only input one buffer of samples at a time. It defaults to 0xA0000 (that is, $$ 655360 $$ samples).                                                                                                                                                                                                                                                   |   Optional   |
|     `quadrature`     | [`true`, `false`]: If set to `true`, it enables the Quadrature calibration tracking option ([Read more](https://ez.analog.com/rf/wide-band-rf-transceivers/design-support/w/documents/10074/ad9361-transmit-quadrature-calibration-tx-quad-cal)). It defaults to `true`.                                                                                                                                       |   Optional   |
|       `rf_dc`        | [`true`, `false`]: If set to `true`, it enables the RF DC calibration tracking option ([Read more](https://wiki.analog.com/resources/tools-software/linux-drivers/iio-transceiver/ad9361#calibration_tracking_controls)). It defaults to `true`.                                                                                                                                                               |   Optional   |
|       `bb_dc`        | [`true`, `false`]: If set to `true`, it enables the BB DC calibration tracking option ([Read more](https://wiki.analog.com/resources/tools-software/linux-drivers/iio-transceiver/ad9361#calibration_tracking_controls)). It defaults to `true`.                                                                                                                                                               |   Optional   |
|     `gain_mode`      | [`manual`, `slow_attack`, `hybrid`, `fast_attack`]: Sets the gain control mode of the RX chain ([Read more](https://wiki.analog.com/resources/tools-software/linux-drivers/iio-transceiver/ad9361#gain_control_modes)). It defaults to `slow_attack`.                                                                                                                                                          |   Optional   |
|        `gain`        | If `gain_mode` is set to `manual`, it sets the gain of the RX chain, in dB, with a granularity of 1 dB and range $$ 0 < $$`gain`$$ < 72 $$ dB. It defaults to $$ 50 $$ dB.                                                                                                                                                                                                                                     |   Optional   |
|    `filter_file`     | Allows a FIR filter configuration to be loaded from a file ([Read more](https://wiki.analog.com/resources/tools-software/linux-drivers/iio-transceiver/ad9361#digital_fir_filter_controls)). It defaults to "" (empty).                                                                                                                                                                                        |   Optional   |
|    `filter_auto`     | [`true`, `false`]: If set to `true`, it loads a default filter and thereby enables lower sampling / baseband rates. It defaults to `true`.                                                                                                                                                                                                                                                                     |   Optional   |
|      `samples`       | Number of samples to be processed. It defaults to $$ 0 $$, which means infinite samples.                                                                                                                                                                                                                                                                                                                       |   Optional   |
|        `dump`        | [`true`, `false`]: If set to `true`, it enables the dump of the signal source into a file. It defaults to `false`.                                                                                                                                                                                                                                                                                             |   Optional   |
|   `dump_filename`    | If `dump` is set to `true`, the name of the file in which data will be stored. It defaults to `./data/signal_source.dat`                                                                                                                                                                                                                                                                                       |   Optional   |
|       -------        |

  _Signal Source implementation:_ **`Plutosdr_Signal_Source`**
  {: style="text-align: center;"}

Example:
```ini
SignalSource.implementation=Plutosdr_Signal_Source
SignalSource.device_address=192.168.2.1   ; <- PUT YOUR DEVICE ADDRESS HERE
SignalSource.freq=1575420000
SignalSource.bandwidth=2600000
SignalSource.sampling_frequency=3000000
SignalSource.item_size=gr_complex
SignalSource.gain_mode=manual
SignalSource.gain=30
SignalSource.samples=0
SignalSource.buffer_size=65000
SignalSource.dump=false
SignalSource.dump_filename=./capture.dat
```


### Implementation: `Limesdr_Signal_Source`

[![LimeSDR]({{ "/assets/images/LimeSDR.png" | relative_url
}}){:width="250px"}{:.align-right}](https://limemicro.com/products/boards/limesdr/)

[LimeSDR](https://limemicro.com/products/boards/limesdr/) is a low cost, open
source, apps-enabled software defined radio (SDR) platform that can be used to
support just about any type of wireless communication standard. For more
information, please check the [LimeSDR Wiki](https://wiki.myriadrf.org/LimeSDR).

GNSS-SDR can make use of this platform through a dedicated Signal Source
implementation. In order to enable it, you need to build
GNSS-SDR from the source code after installing the required software
dependencies. On Debian-based systems, this can be done by:

```console
$ sudo apt install gr-limesdr
```

Please check the [official instructions](https://wiki.myriadrf.org/Gr-limesdr_Plugin_for_GNURadio)
for installing gr-limesdr on other systems.

Once `gr-limesdr` is installed, build GNSS-SDR passing the flag
`-DENABLE_LIMESDR=ON` at configure time:

```console
$ cd gnss-sdr && mkdir build && cd build
$ git checkout next
$ git pull upstream next
$ cmake -DENABLE_LIMESDR=ON ..
$ make && sudo make install
```


This implementation accepts the following parameters:

|----------
|    **Parameter**     | **Description**                                                                                                                                                                                                                                                                                                            | **Required** |
| :------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|    --------------    |
|   `implementation`   | `Limesdr_Signal_Source`                                                                                                                                                                                                                                                                                                    |  Mandatory   |
|        `freq`        | `[100000-3800000000]`: RF center frequency, in Hz.                                                                                                                                                                                                                                                                         |  Mandatory   |
|        `gain`        | `[0-73]`: Combined RX gain settings, in dB.                                                                                                                                                                                                                                                                                |  Mandatory   |
|     `item_type`      | `[ibyte, ishort, gr_complex]` sets the item to be streamed from the source to the rest of the signal processing blocks. GNSS-SDR works internally with `gr_complex` (`std::complex<float>`) samples. Thus, setting the `item_type` to `gr_complex` avoids the use of extra data type converters in the signal conditioner. |  Mandatory   |
| `sampling_frequency` | Sampling frequency, in Sps. It defaults to `2000000`.                                                                                                                                                                                                                                                                      |   Optional   |
|   `limesdr_serial`   | LimeSDR serial number to discriminate between two or more LimeSDR connected to the same computer. If not set, the detection is automatic.                                                                                                                                                                                  |   Optional   |
|      `samples`       | Number of samples to be read. If set to `0`, the receiver will work until `q`+`ENTER` are pressed. It defaults to `0` .                                                                                                                                                                                                    |   Optional   |
|      `antenna`       | `[0, 1, 2, 3, 255]` Set which antenna is used: None(0), LNAH(1), LNAL(2), LNAW(3), AUTO(255). It defaults to `3`.                                                                                                                                                                                                          |   Optional   |
|      `channels`      | `[1, 2]` Number of channels to activate: `1` or `2`. It defaults to `1`.                                                                                                                                                                                                                                                   |   Optional   |
|     `analog_bw`      | `[0, 1500000-130000000]`: Analog filter bandwidth for each channel, in Hz. Analog filter is off if bandwidth is set to `0`. If enabled, its range is between 1.5 MHz and 130 MHz.                                                                                                                                          |   Optional   |
|     `digital_bw`     | `[0-sampling_frequency]`: Digital filter bandwidth for each channel. Digital filter if off if bandwidth is set to 0. Bandwidth should not be higher than the `sampling_frequency`.                                                                                                                                         |   Optional   |
|  `limechannel_mode`  | `[0, 1, 2]` Channel and mode selection: A(0), B(1) or (A+B) MIMO(2). It defaults to `0`.                                                                                                                                                                                                                                   |   Optional   |
|   `ext_clock_MHz`    | Frequency of the external oscillator, if connected. It defaults to `0` (no external oscillator).                                                                                                                                                                                                                           |   Optional   |
|        `dump`        | [`true`, `false`]: If set to `true`, it enables the dump of the signal source into a file. It defaults to `false`.                                                                                                                                                                                                         |   Optional   |
|   `dump_filename`    | If `dump` is set to `true`, the name of the file in which data will be stored. It defaults to `./data/signal_source.dat`                                                                                                                                                                                                   |   Optional   |
|       -------        |

  _Signal Source implementation:_ **`Limesdr_Signal_Source`**
  {: style="text-align: center;"}

Example:
```ini
SignalSource.implementation=Limesdr_Signal_Source
SignalSource.item_type=gr_complex
SignalSource.sampling_frequency=5000000
SignalSource.freq=1575420000
SignalSource.gain=50
SignalSource.antenna=2
SignalSource.ext_clock_MHz=0
SignalSource.limechannel_mode=0
SignalSource.samples=0
SignalSource.dump=false
SignalSource.dump_filename=./captured_signal.dat
```



Multiple radio frequency chains
-------------------------------

A single Signal Source can be equipped with more than one radio-frequency chain.
Examples of such configuration could be a USRP with two subdevices, or dual or
triple band RF front ends, such as NSL Stereo or Flexiband.

This case implies not only the configuration of the Signal Source, but also
there is a need to set up different Signal Conditioners for each band, and
configure the Channel implementations for the different signals present on each
band.

<figure>
  {{ fig_img3 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>Simplified block diagram of a dual-band receiver of GPS L1 C/A and
  GPS L2C (M) signals.</figcaption>
</figure>


The number of radio-frequency chains is denoted by the parameter `RF_channels`,
which defaults to one if it is not present in the configuration file.

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


Example: Configuring the USRP X300 with two front-ends for receiving signals in
L1 and L2 bands

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

A receiver can have more than one Signal Source delivering signal streams at the
same time.

Examples of such configuration could be:

-   Two files, one for each band (such as in the case of NSL's Stereo
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
; GNSS-SDR.num_sources=2   ; starting from v0.0.15
```

Then:

```ini
Receiver.sources_count=2
; GNSS-SDR.num_sources=2   ; starting from v0.0.15
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
Channel0.RF_channel_ID=0
Channel1.RF_channel_ID=0
Channel2.RF_channel_ID=1
Channel3.RF_channel_ID=1

Channel0.signal=1C
Channel1.signal=1C
Channel2.signal=1B
Channel3.signal=1B
...
```

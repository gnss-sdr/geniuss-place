---
title: "Resampler"
permalink: /docs/sp-blocks/resampler/
excerpt: "Documentation for the Resampler block."
sidebar:
  nav: "sp-block"
toc: true
toc_sticky: true
last_modified_at: 2018-12-14T12:54:02-04:00
---


The _Resampler_ is the third processing block inside a _Signal Conditioner_ when
the latter is using a [**`Signal_Conditioner`**]({{
"/docs/sp-blocks/signal-conditioner/#signal-conditioner" | relative_url }})
implementation.

A _Resampler_ block is in charge of resampling the signal and delivering it to
the $$ N $$ parallel processing channels.
{: .notice--info}

At the _Resampler_'s output, only complex types are allowed: <abbr
id="data-type" title="Complex samples with real and imaginary parts of type
signed 8-bit integer. C++ name: lv_8sc_t (custom definition of
std::complex<int8_t>)">`cbyte`</abbr>, <abbr id="data-type" title="Complex
samples with real and imaginary parts of type signed 16-bit integer. C++ name:
lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>, or
<abbr id="data-type" title="Complex samples with real and imaginary parts of
type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>.
This block does not perform any data type conversion.


### Implementation: `Direct_Resampler`

This implementation performs a direct resampling of the incoming signal,
without performing any interpolation.

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `Direct_Resampler` | Mandatory |
| `sample_freq_in` |  Sample rate at the block input, in samples per second. | Mandatory |
| `sample_freq_out` |  Sample rate at the block output, in samples per second. | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 8-bit integer. C++ name: lv_8sc_t (custom definition of std::complex<int8_t>)">`cbyte`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Data type to be resampled. | Mandatory |
|----------

  _Resampler implementation:_ **`Direct_Resampler`**.
  {: style="text-align: center;"}


Examples:

```ini
;######### RESAMPLER CONFIG ############
Resampler.implementation=Direct_Resampler
Resampler.sample_freq_in=8000000
Resampler.sample_freq_out=4000000
Resampler.item_type=gr_complex
```

```ini
;######### RESAMPLER CONFIG ############
Resampler.implementation=Direct_Resampler
Resampler.sample_freq_in=8000000
Resampler.sample_freq_out=2500000
Resampler.item_type=cshort
```


### Implementation: `Mmse_Resampler`

This implementation performs a resampling of the incoming signal with a MMSE
filtering stage. This resampling block is suitable in cases when the ratio
between the incoming sampling frequency and the outcoming one is not a rational
number. A typical use case is when the sampling frequency is an integer multiple
of the chip frequency and artifacts appear in the tracking blocks. In that case,
it is desirable to slightly decrease the sampling ratio in order to avoid the
artifacts and, also, to maintain a similar sampling frequency (for instance,
downsampling from 30.69 to 30 Msps).

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `Mmse_Resampler` | Mandatory |
| `sample_freq_in` |  Sample rate at the block input, in samples per second. | Mandatory |
| `sample_freq_out` |  Sample rate at the block output, in samples per second. | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Data type to be resampled. This implementation only accepts samples of <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr> type. | Optional |
|----------

  _Resampler implementation:_ **`Mmse_Resampler`**.
  {: style="text-align: center;"}


Examples:

```ini
;######### RESAMPLER CONFIG ############
Resampler.implementation=Mmse_Resampler
Resampler.sample_freq_in=30690000
Resampler.sample_freq_out=30000000
Resampler.item_type=gr_complex
```



### Implementation: `Pass_Through`

This implementation copies samples from its input to its output.

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `Pass_Through` | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 8-bit integer. C++ name: lv_8sc_t (custom definition of std::complex<int8_t>)">`cbyte`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Data type to be copied from the input to the output of this block. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
|----------

  _Resampler implementation:_ **`Pass_Through`**.
  {: style="text-align: center;"}


Examples:

```ini
;######### RESAMPLER CONFIG ############
Resampler.implementation=Pass_Through
```

```ini
;######### RESAMPLER CONFIG ############
Resampler.implementation=Pass_Through
Resampler.item_type=cshort
```

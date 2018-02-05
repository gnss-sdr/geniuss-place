---
title: "Resampler"
permalink: /docs/sp-blocks/resampler/
excerpt: "Documentation for the Resampler block."
sidebar:
  nav: "sp-block"
toc: true
last_modified_at: 2018-02-01T15:54:02-04:00
---


The _Resampler_ is the third processing block inside a _Signal Conditioner_ when the later is using a [**`Signal_Conditioner`**]({{ "/docs/sp-blocks/signal-conditioner/#signal-conditioner" | absolute_url }}) implementation.

A _Resampler_ block is in charge of resampling the signal and delivering it to
the $$ N $$ parallel processing channels.
{: .notice--info}

At the _Resampler_’s output, only complex types are allowed: `cbyte`, `cshort`, or `gr_complex`. This block does not perform any data type conversion.


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
| `item_type` |  [`cbyte`, `cshort`, `gr_complex`]: Data type to be resampled. | Mandatory |
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

**IMPORTANT**: This implementation is only available from the `next` branch of GNSS-SDR's repository, so it is **not** present in the current stable release.
{: .notice--warning}

This implementation performs a resampling of the incoming signal with a MMSE filtering stage. This resampling block is suitable in cases when the ratio between the incoming sampling frequency and the outcoming one is not a rational number. A typical use case is when the sampling frequency is an integer multiple of the chip frequency and artifacts appear in the tracking blocks. In that case, it is desirable to slightly decrease the sampling ratio in order to avoid the artifacts and, also, to maintain a similar sampling frequency (for instance, downsampling from 30.69 to 30 Msps).

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Mmse_Resampler` | Mandatory |
| `sample_freq_in` |  Sample rate at the block input, in samples per second. | Mandatory |
| `sample_freq_out` |  Sample rate at the block output, in samples per second. | Mandatory |
| `item_type` |  [`gr_complex`]: Data type to be resampled. This implementation only accepts samples of `gr_complex` type. | Optional |
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
| `item_type` |  [`cbyte`, `cshort`, `gr_complex`]: Data type to be copied from the input to the output of this block. It defaults to `gr_complex`. | Optional |
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

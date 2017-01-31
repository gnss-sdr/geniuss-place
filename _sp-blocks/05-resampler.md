---
title: "Resampler"
permalink: /docs/sp-blocks/resampler/
excerpt: "Documentation for the Resampler block"
sidebar:
  nav: "sp-block"
modified: 2016-04-13T15:54:02-04:00
---

{% include toc %}

The _Resampler_ is the third processing block inside a _Signal Conditioner_ when the later is using a [**`Signal_Conditioner`**]({{ "/docs/sp-blocks/signal-conditioner/#signal-conditioner" | absolute_url }}){:target="_blank"} implementation.

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

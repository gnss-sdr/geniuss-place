---
title: "Resampler"
permalink: /docs/sp-blocks/resampler/
excerpt: "Documentation for the Resampler block"
modified: 2016-04-13T15:54:02-04:00
---

{% include toc %}

This block is in charge of resampling the signal and delivering it to
the $N$ parallel processing channels. At the Resampler’s output, only
complex types are allowed: `cbyte`, `cshort`, or `gr_complex`. This
block does not perform any data type conversion.

### Implementation: `Direct_Resampler`

This implementation performs a direct resampling of the incoming signal,
without performing any interpolation.

Parameters:

-   `sample_freq_in`: Sample rate at the Resampler’s input, in samples
    per second.

-   `sample_freq_out`: Sample rate at the Resampler’s output, in samples
    per second.

-   `item_type` [`cbyte`, `cshort`, `gr_complex`]: Data type to be
    resampled. It defaults to `gr_complex`.


```ini
;######### RESAMPLER CONFIG ############
Resampler.implementation=Direct_Resampler
Resampler.sample_freq_in=8000000
Resampler.sample_freq_out=4000000
Resampler.item_type=gr_complex
```

### Implementation: `Pass_Through`

This implementation copies samples from its input to its output.

Parameters:

-   `item_type` [`cbyte`, `cshort`, `gr_complex`]: Data type to be
    copied from the input to the output of this block. It defaults to
    `gr_complex`.


```ini
;######### RESAMPLER CONFIG ############
Resampler.implementation=Pass_Through
```

```ini
;######### RESAMPLER CONFIG ############
Resampler.implementation=Pass_Through
Resampler.item_type=cshort
```

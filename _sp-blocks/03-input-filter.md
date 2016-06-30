---
title: "Input Filter"
permalink: /docs/sp-blocks/input-filter/
excerpt: "Documentation for the Input Filter block"
modified: 2016-04-13T15:54:02-04:00
sidebar:
  nav: "sp-block"
---

{% include toc %}

This block is in charge of filtering the incoming signal.

### Implementation: `Fir_Filter`

This implementation, based on the [Parks-McClellan algorithm](https://en.wikipedia.org/wiki/Parks%E2%80%93McClellan_filter_design_algorithm){:target="_blank"}, computes
the optimal (in the Chebyshev/minimax sense) FIR filter impulse response
given a set of band edges, the desired response on those bands, and the
weight given to the error in those bands. The Parks-McClellan algorithm
uses the Remez exchange algorithm and Chebyshev approximation theory to
design filters with an optimal fit between the desired and actual
frequency responses.

Parameters:

-   `dump` [`false`, `true`]: Flag for storing the signal at the filter
    output in a file. It defaults to `false`.

-   `dump_filename`: If `dump` is set to true, path to the file where
    data will be stored.

-   `input_item_type` [`cbyte`, `cshort`, `gr_complex`]: Input data
    type. This implementation only accepts streams of complex data
    types.

-   `output_item_type` [`cbyte`, `cshort`, `gr_complex`]: Output data
    type. You can use this implementation to upcast the data type (i.e.,
    from `cbyte` to `gr_complex` and from `cshort` to `gr_complex`).

-   `taps_item_type` [`float`]: Type and resolution for the taps of the
    filter. Only `float` is allowed in the current version.

-   `number_of_taps`: Number of taps in the filter. Increasing this
    parameter increases the processing time.

-   `number_of_bands`: Number of frequency bands in the filter.

-   `band1_begin`: Frequency at the band edges [ **b1** e1 b2 e2 b3 e3
    ...]. Frequency is in the range [0, 1], with 1 being the Nyquist
    frequency ($$ \frac{F_s}{2} $$). The number of `band_begin` and
    `band_end` elements must match the number of bands. See the Figure
    below for an example of filter design.

-   `band1_end`: Frequency at the band edges [ b1 **e1** b2 e2 b3 e3
    ...]

-   `band2_begin`: Frequency at the band edges [ b1 e1 **b2** e2 b3 e3
    ...]

-   `band2_end`: Frequency at the band edges [ b1 e1 b2 e2 **b3** e3
    ...]

-   `ampl1_begin`: Desired amplitude at the band edges [ **a(b1)** a(e1)
    a(b2) a(e2) ...]. The number of `ampl_begin` and `ampl_end` elements
    must match the number of bands.

-   `ampl1_end`: Desired amplitude at the band edges [ a(b1) **a(e1)**
    a(b2) a(e2) ...].

-   `ampl2_begin`: Desired amplitude at the band edges [ a(b1) a(e1)
    **a(b2)** a(e2) ...].

-   `ampl2_end`: Desired amplitude at the band edges [ a(b1) a(e1) a(b2)
    **a(e2)** ...].

-   `band1_error`: Weighting applied to band 1 (usually 1).

-   `band2_error`: Weighting applied to band 2 (usually 1).

-   `filter_type` [`bandpass`, `hilbert`, `differentiator`]: type of
    filter to be used.

    -   `passband`: designs a FIR filter, using the weights
        `band1_error`, `band2_error`, etc. to weight the fit in each
        frequency band.

    -   `hilbert`: designs linear-phase filters with odd symmetry. This
        class of filters has a desired amplitude of 1 across the entire
        band.

    -   `differentiator`: For nonzero amplitude bands, it weights the
        error by a factor of $$ 1/f $$ so that the error at low frequencies is
        much smaller than at high frequencies. For FIR differentiators,
        which have an amplitude characteristic proportional to
        frequency, these filters minimize the maximum relative error
        (the maximum of the ratio of the error to the desired
        amplitude).

-   `grid_density`: Determines how accurately the filter will be
    constructed. The minimum value is 16; higher values makes the filter
    slower to compute, but often results in filters that more exactly
    match an equiripple filter.

The following figure shows the relationship between $$ f $$ = [`band1_begin` `band1_end`
`band2_begin` `band2_end`] and $$ a $$ = [`ampl1_begin` `ampl1_end`
`ampl2_begin` `ampl2_end`] vectors in defining a desired frequency
response for the _Input Filter_:

![Filter]({{ site.url }}{{ site.baseurl }}/images/fir-filter.png)


If you have access to MATLAB, you can plot easily the frequency response
of the filter. Just copy these lines into the command window:

```matlab
f = [0 0.45 0.55 1];
a = [1 1 0 0];
b = firpm(5, f, a);
[h, w] = freqz(b, 1, 512);
plot(f, a, w/pi, abs(h))
legend('Ideal', 'Filter design')
xlabel('Radian Frequency (\omega/\pi)'), ylabel('Magnitude')
```

Example of GNSS-SDR configuration:

```ini
;######### INPUT_FILTER CONFIG ############
InputFilter.implementation=Fir_Filter

InputFilter.dump=false
InputFilter.dump_filename=../data/input_filter.dat

InputFilter.input_item_type=cbyte
InputFilter.output_item_type=gr_complex
InputFilter.taps_item_type=float
InputFilter.number_of_taps=5

InputFilter.number_of_bands=2

InputFilter.band1_begin=0.0
InputFilter.band1_end=0.45
InputFilter.band2_begin=0.55
InputFilter.band2_end=1.0

InputFilter.ampl1_begin=1.0
InputFilter.ampl1_end=1.0
InputFilter.ampl2_begin=0.0
InputFilter.ampl2_end=0.0

InputFilter.band1_error=1.0
InputFilter.band2_error=1.0

InputFilter.filter_type=bandpass
InputFilter.grid_density=16
```


### Implementation: `Freq_Xlating_Fir_Filter`

This implementation features a frequency-translating FIR filter. This is
often used when input data is art an intermediate frequency, as it
performs frequency translation, filtering and decimation in one step.
The basic principle of this block is to perform:

Input signal $$ \rightarrow $$ BPF $$ \rightarrow $$ decim $$ \rightarrow $$ (mult
by $$ 2 \pi \frac{f_{IF}}{f_s} $$\*decim) $$ \rightarrow $$ Output signal.

The BPF is the baseband filter (LPF) moved up to the center frequency
$$ 2 \pi \frac{f_{IF}}{f_s} $$. The block then applies a derotator with
$$ -2 \pi \frac{f_{IF}}{f_s} $$ to downshift the signal to baseband.

This implementation accepts the same parameters as `Fir_Filter`, with
the following differences:

-   `input_item_type` [`byte`, `short`, `float`, `gr_complex`]: This
    implementation accepts as input data type real samples. It also
    accepts complex samples of the type `gr_complex`, assuming the
    presence of an intermediate frequency. The filter also works with
    `IF=0`.

-   `IF`: Specifies the intermediate frequency $$ f_{IF} $$, in Hz.

-   `sampling_frequency`: Specifies the sample rate $$ f_s $$, in samples
    per second.

-   `decimation_factor`: Decimation factor (defaults to 1).


```ini
;######### INPUT_FILTER CONFIG ############
InputFilter.implementation=Freq_Xlating_Fir_Filter

InputFilter.dump=false
InputFilter.dump_filename=../data/input_filter.dat

InputFilter.input_item_type=byte
InputFilter.output_item_type=gr_complex
InputFilter.taps_item_type=float

InputFilter.number_of_taps=5
InputFilter.number_of_bands=2

InputFilter.band1_begin=0.0
InputFilter.band1_end=0.45
InputFilter.band2_begin=0.55
InputFilter.band2_end=1.0

InputFilter.ampl1_begin=1.0
InputFilter.ampl1_end=1.0
InputFilter.ampl2_begin=0.0
InputFilter.ampl2_end=0.0

InputFilter.band1_error=1.0
InputFilter.band2_error=1.0
InputFilter.filter_type=bandpass
InputFilter.grid_density=16

InputFilter.IF=2000000
InputFilter.sampling_frequency=8000000
```


### Implementation: `Pass_Through`

This implementation copies samples from its input to its output, without
performing any filtering.

```ini
;######### INPUT_FILTER CONFIG ############
InputFilter.implementation=Pass_Through
```

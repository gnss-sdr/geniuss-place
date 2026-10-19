---
title: "Signal Conditioner"
permalink: /docs/sp-blocks/signal-conditioner/
excerpt: "Documentation for the Signal Conditioner block."
sidebar:
  nav: "sp-block"
toc: true
toc_sticky: true
last_modified_at: 2026-10-17T12:00:00+02:00
---



A _Signal Conditioner_ block is in charge of adapting the sample bit depth to a
data type tractable at the host computer running the software receiver, and
optionally intermediate frequency to baseband conversion, resampling, and
filtering.
{: .notice--info}

Regardless of the selected signal source features, the _Signal Conditioner_
interface delivers in a unified format a sample data stream to the receiver
downstream processing channels, acting as a facade between the signal source and
the synchronization channels, providing a simplified interface to the input
signal at a reference, _internal_ sample rate $$ f_{IN} $$. We denote the
complex samples at the Signal Conditioner output as $$ x_{\text{IN}}[n] $$. This
signal stream feeds a set of parallel [_Channels_]({{
"/docs/sp-blocks/channels/" | relative_url }}).


### Implementation: `Signal_Conditioner`

This implementation is in fact a wrapper for other three processing blocks.

<a name="signal-conditioner"></a>

<span class="invert-colors"><img src="{{ "/assets/images/SignalConditioner2.png" | relative_url }}" alt="Signal Conditioner" usemap="#sc-map"></span>
{: style="text-align: center; width: 644px;"}


<map name="sc-map" id="Diagram-sc-map">
   <area alt="Data Type Adapter" title="Data Type Adapter" href="{{ "/docs/sp-blocks/data-type-adapter/" | relative_url }}" coords="176,38,267,76" shape="rect" style="outline:none;" target="_self">
   <area alt="Input Filter" title="Input Filter" href="{{ "/docs/sp-blocks/input-filter/" | relative_url }}" coords="291,38,384,76" shape="rect" style="outline:none;" target="_self">
   <area alt="Resampler" title="Resampler" href="{{ "/docs/sp-blocks/resampler/" | relative_url }}" coords="409,38,502,76" shape="rect" style="outline:none;" target="_self">
</map>


Those inner blocks are in charge of:

* The role of the [Data Type Adapter]({{ "/docs/sp-blocks/data-type-adapter/" |
relative_url }}) block is to perform a conversion of the data type in the
incoming sample stream.

* The role of the [Input Filter]({{ "/docs/sp-blocks/input-filter/" |
relative_url }}) block is to filter the incoming signal.

* The role of the [Resampler]({{ "/docs/sp-blocks/resampler/" | relative_url }})
block is to resample the signal and to deliver it to the $$ N $$ parallel
processing channels.

Any of them can be bypassed by using a `Pass_Through` implementation. Such
identity stages can be removed from the flowgraph when the receiver batches the
conditioned stream, see [Batching and buffering](#batching-and-buffering) below.

The `Signal_Conditioner` implementation accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `Signal_Conditioner` | Mandatory |
| _DataTypeAdapter_ | This implementation requires the configuration of a [Data Type Adapter]({{ "/docs/sp-blocks/data-type-adapter/" | relative_url }}) block. | Mandatory |
| _InputFilter_ | This implementation requires the configuration of an [Input Filter]({{ "/docs/sp-blocks/input-filter/" | relative_url }}) block. | Mandatory |
| _Resampler_ | This implementation requires the configuration of a [Resampler]({{ "/docs/sp-blocks/resampler/" | relative_url }}) block. | Mandatory |
|-------

  _Signal Conditioner implementation:_ **`Signal_Conditioner`**.
  {: style="text-align: center;"}

Example:

```ini
;######### SIGNAL_CONDITIONER CONFIG ############
;## It holds blocks to change data type, filter and resample input data.
SignalConditioner.implementation=Signal_Conditioner

;######### DATA_TYPE_ADAPTER CONFIG ############
;## Changes the type of input data.
;#implementation: [Pass_Through] disables this block
DataTypeAdapter.implementation=Ishort_To_Complex

;######### INPUT_FILTER CONFIG ############
;## Filter the input data.
InputFilter.implementation=Fir_Filter
InputFilter.input_item_type=gr_complex
InputFilter.output_item_type=gr_complex
; ... other InputFilter parameters

;######### RESAMPLER CONFIG ############
;## Resamples the input data.
Resampler.implementation=Pass_Through
```

### Implementation: `Pass_Through`

This implementation copies samples from its input to its output.

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `Pass_Through` | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>]: Format of data samples. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
|-------

  _Signal Conditioner implementation:_ **`Pass_Through`**.
  {: style="text-align: center;"}

Examples:

```ini
;######### SIGNAL_CONDITIONER CONFIG ############
SignalConditioner.implementation=Pass_Through
```

```ini
;######### SIGNAL_CONDITIONER CONFIG ############
SignalConditioner.implementation=Pass_Through
SignalConditioner.item_type=cshort
```

### Implementation: `Bypass`

This implementation connects the channels directly to the output of the
[Signal Source]({{ "/docs/sp-blocks/signal-source/" | relative_url }}), with no
conditioning block in between. It is intended for sources that already deliver
samples in the data type, spectrum orientation, and sample rate (set by
`GNSS-SDR.internal_fs_sps`) expected by the channels: `Bypass` does not convert,
filter, or resample samples, and it does not correct an inverted spectrum.

<span style="color: orange">This implementation is only present in the `next`
branch of the upstream repository, and will be included in the next GNSS-SDR
stable release.</span>

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `Bypass` | Mandatory |
|-------

  _Signal Conditioner implementation:_ **`Bypass`**.
  {: style="text-align: center;"}

The receiver refuses to start if the `DataTypeAdapter`, `InputFilter`, or
`Resampler` of a bypassed Signal Conditioner set an implementation other than
`Pass_Through`, or if `inverted_spectrum=true` is set on any of them or on the
Signal Conditioner itself, since those settings would be silently ignored. It
also reports any mismatch between the item size of the source output and the
one expected by the channels.

In multi-band receivers, each `SignalConditioner0`, `SignalConditioner1`, ...
can be bypassed independently.

Example:

```ini
;######### SIGNAL_CONDITIONER CONFIG ############
SignalConditioner.implementation=Bypass
```

## Batching and buffering

Every time the block that feeds the channels delivers new samples, GNU Radio
wakes up all its readers: the tracking and acquisition blocks of each channel
connected to that stream, plus the receiver clock on the first stream. When
samples are delivered in many small chunks, this cost can exceed the cost of
the signal processing itself. GNSS-SDR controls two things at that point:

- **Batching**: when the last stage of the Signal Conditioner is a
  `Pass_Through` with no spectrum inversion, or the whole Signal Conditioner is
  `Pass_Through`, the receiver removes every such identity stage from the
  flowgraph, wherever it is in the chain, keeps the stages that do real work,
  and inserts a batching block after the last of them (or right after the
  source, if none is left). For instance, with a `Pass_Through` Data Type
  Adapter, a `Freq_Xlating_Fir_Filter` Input Filter, and a `Pass_Through`
  Resampler, the channels are fed by source → Input Filter → batching block.
  The batching block delivers samples to the channels in batches of
  $$ \min(10, T_{obs}) $$ ms of signal, where $$ T_{obs} $$ is
  `GNSS-SDR.observable_interval_ms`, with at most 512 KiB per batch. A batch
  that is not complete within that time is delivered anyway, and the last
  samples of a file are always delivered. No sample or stream tag is lost. If
  the last stage does real work, nothing is removed and no batching block is
  inserted, even if an earlier stage is a `Pass_Through`. `Bypass` is also kept
  as configured.
- **Buffer depth**: with real-time sources (radio frequency front-ends, and file
  sources with `enable_throttle_control=true`), the buffer that feeds the
  channels holds as much signal as the observables allow (up to about 200 ms
  with the default settings, at most 8 MiB), so that a channel that falls temporarily
  behind, for instance during a blocking acquisition, does not stop the others.
  Unthrottled file replays keep a minimal buffer, as before.

No configuration change is required. The following parameters, with the same
prefix as the Signal Conditioner (`SignalConditioner`, or `SignalConditioner0`,
`SignalConditioner1`, ... for multiple radio frequency chains), override these
choices:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `batch_size_ms` | [`auto`, `0`, a positive number]: Duration, in ms, of the batches delivered to the channels. `auto` lets the receiver decide as described above. `0` disables batching. A positive number inserts a batching block, also for `Bypass`, and is limited as explained below. It defaults to `auto`. | Optional |
| `max_batch_latency_ms` | Longest time, in ms, that a sample waits for its batch to be completed. It defaults to the largest of `batch_size_ms` and $$ \min(10, T_{obs}) $$, and must not be smaller than `batch_size_ms`. With `batch_size_ms=auto`, it also sets the length of the automatic batch, which is then limited as explained below. | Optional |
| `remove_pass_through` | [`true`, `false`]: If set to `true`, identity `Pass_Through` stages are removed from the flowgraph. It defaults to `true` when batching is applied and to `false` otherwise. Setting it with `batch_size_ms=auto` disables automatic batching. | Optional |
| `output_buffer_ms` | [`auto`, `0`, a positive number]: Signal time, in ms, held by the buffer that feeds the channels. `auto` applies the buffer depth described above to real-time sources only. `0` requests no extra depth. A positive number must not exceed the observables delay (280 ms with $$ T_{obs} = 20 $$ ms), and a warning is logged if it exceeds the budget described below. It has no effect on a `Bypass` Signal Conditioner without batching, since the source keeps its own buffer. It defaults to `auto`. | Optional |
|-------

  _Signal Conditioner parameters for batching and buffering._
  {: style="text-align: center;"}

<span style="color: orange">These parameters are only present in the `next`
branch of the upstream repository, and will be included in the next GNSS-SDR
stable release.</span>

**Limits.** The observables block computes the observables of an epoch when the
receiver clock is a fixed time past it. This observables delay is 280 ms with
the default $$ T_{obs} = 20 $$ ms, 190 ms with $$ T_{obs} = 10 $$ ms, and
200 ms with $$ T_{obs} = 100 $$ ms. A channel can lag the
receiver clock by up to the buffer that feeds it, and it needs its own input
window (usually two code periods) and one 20 ms telemetry symbol beyond an epoch
to report it. What remains of the observables delay after that window, the
symbol and a 60 ms guard is the time a channel can lag and still deliver its
observables: 198 ms for GPS L1 C/A with the default settings. A batch is always
accepted up to the automatic length. A longer batch is accepted only if the
buffer it needs (two batches, or one batch on top of the largest reader input
window) fits in that time, and if the batch takes no more than 4 MiB. With GPS
L1 C/A, $$ T_{obs} = 20 $$ ms and `gr_complex` samples at 4 Msps, this allows
batches of up to about 99 ms. Otherwise, the receiver refuses to start and
explains why.
{: .notice--info}

Longer batches reduce the scheduling cost, but they add up to one batch of
latency, and channels searching for satellites wait for each new batch before
starting a new acquisition attempt, so they search less often. If
`GNSS-SDR.max_source_buffer_samples` is set, a batch takes at most half of it,
and the batch plus the largest reader input window must fit in it.

The receiver logs its decision for each Signal Conditioner. For example, with
twelve GPS L1 C/A channels, `SignalConditioner.batch_size_ms=90`, and an
unthrottled file at 4 Msps:

```
SignalConditioner: explicit batch target; readers=25, batch=360000 samples, batch deadline=90 ms, largest reader window=80000 samples, output buffer=720000 samples (180 ms), alignment budget=198 ms, unthrottled replay
```

Examples:

```ini
;######### SIGNAL_CONDITIONER CONFIG ############
;## Keep the configured topology, with no batching and no extra buffer depth
SignalConditioner.implementation=Signal_Conditioner
SignalConditioner.batch_size_ms=0
SignalConditioner.remove_pass_through=false
SignalConditioner.output_buffer_ms=0
```

```ini
;######### SIGNAL_CONDITIONER CONFIG ############
;## Feed the channels from the source, in batches of 40 ms
SignalConditioner.implementation=Bypass
SignalConditioner.batch_size_ms=40
```

<link rel="prefetch" as="document" href="{{ "/docs/sp-blocks/data-type-adapter/" | relative_url }}">
<link rel="prefetch" as="document" href="{{ "/docs/sp-blocks/input-filter/" | relative_url }}">
<link rel="prefetch" as="document" href="{{ "/docs/sp-blocks/resampler/" | relative_url }}">

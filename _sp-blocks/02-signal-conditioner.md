---
title: "Signal Conditioner"
permalink: /docs/sp-blocks/signal-conditioner/
excerpt: "Documentation for the Signal Conditioner block"
sidebar:
  nav: "sp-block"
modified: 2016-04-13T15:54:02-04:00
---
{% include base_path %}
{% include toc %}


A _Signal Conditioner_ block is in charge of adapting the sample bit depth to a data type tractable at the host computer running the software receiver, and optionally intermediate frequency to baseband conversion, resampling, and filtering.
{: .notice--info}

Regardless the selected signal source features, the _Signal Conditioner_ interface delivers in a unified format a sample data stream to the receiver downstream processing channels, acting as a facade between the signal source and the synchronization channels, providing a simplified interface to the input signal at a reference, _internal_ sample rate $$ f_{IN} $$. We denote the complex samples at the Signal Conditioner output as $$ x_{\text{IN}}[n] $$. This signal stream feeds a set of parallel [_Channels_]({{ site.url }}{{ site.baseurl }}/docs/sp-blocks/channels/).


### Implementation: `Signal_Conditioner`

This implementation is in fact a wrapper for other three processing blocks.

<a name="signal-conditioner"></a>

![Signal Conditioner]( {{ base_path }}/images/SignalConditioner2.png)

Those inner blocks are in charge of:

* The role of the [Data Type Adapter]({{ site.url }}{{ site.baseurl }}/docs/sp-blocks/data-type-adapter/) block is to perform a conversion of the data type in the incoming sample stream.
* The role of the [Input Filter]({{ site.url }}{{ site.baseurl }}/docs/sp-blocks/input-filter/) block is to filter the incoming signal.
* The role of the [Resampler]({{ site.url }}{{ site.baseurl }}/docs/sp-blocks/resampler/) block is to resample the signal and to deliver it to the $$ N $$ parallel processing channels.

Any of them can be by-passed by using a `Pass_Through` implementation.

The `Signal_Conditioner` implementation accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Signal_Conditioner` | Mandatory |
| _DataTypeAdapter_ | This implementation requires the configuration of a [Data Type Adapter]({{ site.url }}{{ site.baseurl }}/docs/sp-blocks/data-type-adapter/) block. | Mandatory |
| _InputFilter_ | This implementation requires the configuration of an [Input Filter]({{ site.url }}{{ site.baseurl }}/docs/sp-blocks/input-filter/) block. | Mandatory |
| _Resampler_ | This implementation requires the configuration of a [Resampler]({{ site.url }}{{ site.baseurl }}/docs/sp-blocks/resampler/) block. | Mandatory |
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
| `item_size` |  [`gr_complex`, `cshort`]: Format of data samples. It defaults to `gr_complex`. | Optional |
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
SignalConditioner.item_size=cshort
```

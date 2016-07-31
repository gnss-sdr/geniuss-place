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

Regardless the selected signal source features, the Signal Conditioner interface delivers in a unified format a sample data stream to the receiver downstream processing channels, acting as a facade between the signal source and the synchronization channels, providing a simplified interface to the input signal at a reference, _internal_ sample rate $$ f_{IN} $$. We denote the complex samples at the Signal Conditioner output as $$ x_{\text{IN}}[n] $$. This signal stream feeds a set of parallel _Channels_.


### Implementation: `Signal_Conditioner`

<a name="signal-conditioner"></a>

![Signal Conditioner]( {{ base_path }}/images/SignalConditioner2.png)

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
Resampler.item_type=gr_complex
```

### Implementation: `Pass_Through`

```ini
;######### SIGNAL_CONDITIONER CONFIG ############
SignalConditioner.implementation=Pass_Through
```

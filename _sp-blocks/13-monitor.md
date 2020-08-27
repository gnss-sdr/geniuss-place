---
title: "Monitor"
permalink: /docs/sp-blocks/monitor/
excerpt: "Documentation for the Monitor block."
sidebar:
  nav: "sp-block"
toc: true
toc_sticky: true
last_modified_at: 2019-04-21T15:54:02-04:00
---


The _Monitor_ block provides an interface for monitoring the internal status of the receiver in real-time by streaming the receiver internal parameters to local or remote clients over UDP.
{: .notice--info}

This block is a feature of GNSS-SDR which was developed having [usability]({{ "/design-forces/usability/" | relative_url }}) in mind. It gives an internal (or white-box) perspective of the receiver, allowing a deeper insight into its performance and provides a communication interface through which end-users can build their monitoring clients upon.

This is made possible by exposing [`Gnss_Synchro`](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/core/system_parameters/gnss_synchro.h) objects from inside the receiver to the user. These objects are special containers that hold a set of variables which capture the internal state of the receiver as they travel along the receiver chain.

Each channel of the receiver instantiates a `Gnss_Synchro` object. Once it reaches the _Monitor_ block, the object is serialized into a binary encoded message and then streamed through a network socket to one or more destination endpoints (clients) designated by the user. Each client can then deserialize the encoded message from the data stream, recover the `Gnss_Synchro` object and access its member variables for further inspection and monitoring.

This communication mechanism is built with [Boost.Asio](https://www.boost.org/doc/libs/release/libs/asio/) for the networking logic and [Protocol Buffers](https://developers.google.com/protocol-buffers/) for the serialization logic. Originally [Boost.Serialization](https://www.boost.org/doc/libs/release/libs/serialization/) was used but in release [v0.0.11](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.11) it was deprecated in favour of Protocol Buffers. If you still wish to use the old serialization format based on Boost, set the `Monitor.enable_protobuf` parameter to `false` in your configuration file.
{: .notice--info}

## Exposed Internal Parameters

The exposed internal parameters are the data members of the `Gnss_Synchro` class. There are 25 in total, and can be classified based on the subsystem they inform about:

### Satellite and signal information

The following set of variables record general information about the [Channel]({{ "/docs/sp-blocks/acquisition/" | relative_url }}).

|----------
|  **Name**  |  **Type** | **Description** |
|:-:|:-:|:--|    
|--------------
| `System` | `char` | GNSS constellation:`"G"` for GPS, `"R"` for Glonass, `"S"` for SBAS, `"E"` for Galileo and `"C"` for Beidou. |
| `Signal` | `char[3]` | GNSS signal: `"1C"` for GPS L1 C/A, `"1B"` for Galileo E1b/c, `"1G"` for Glonass L1 C/A, `"2S"` for GPS L2 L2C(M), `"2G"` for Glonass L2 C/A, `"L5"` for GPS L5 and `"5X"` for Galileo E5a. |
| `PRN` | `uint32_t` | Satellite ID processed in each channel. |
| `Channel_ID` | `int32_t` | Absolute channel number. |
|----------

### Acquisition

The following set of variables record information about the [Acquisition]({{ "/docs/sp-blocks/acquisition/" | relative_url }}) block.

|----------
|  **Name**  |  **Type** | **Description** |
|:-:|:-:|:--|    
|--------------
| `Acq_delay_samples` | `double` | Coarse code delay estimation, in [samples]. |
| `Acq_doppler_hz` | `double` | Coarse Doppler estimation in each channel, in [Hz]. |
| `Acq_samplestamp_samples` | `uint64_t` | [samples] at signal SampleStamp. |
| `Acq_doppler_step` | `uint32_t` | Frequency bin of the search grid, in [Hz]. |
| `Flag_valid_acquisition` | `bool` | Acquisition status in each channel. |
|----------

### Tracking

The following set of variables record information about the [Tracking]({{ "/docs/sp-blocks/tracking/" | relative_url }}) block.

|----------
|  **Name**  |  **Type** | **Description** |
|:-:|:-:|:--|    
|--------------
| `fs` | `int64_t` | Sampling frequency, in [Hz]. |
| `Prompt_I` | `double` | In-phase (real) component of the prompt correlator output. |
| `Prompt_Q` | `double` | Quadrature (imaginary) component of the prompt correlator output. |
| `CN0_dB_hz` | `double` | Carrier-to-Noise density ratio, in [dB-Hz]. |
| `Carrier_Doppler_hz` | `double` | Doppler estimation in each channel, in [Hz]. |
| `Carrier_phase_rads` | `double` | Carrier phase estimation in each channel, in [rad]. |
| `Code_phase_samples` | `double` | Code phase in [samples]. |
| `Tracking_sample_counter` | `uint64_t` | Sample counter as an index (1,2,3,..etc) indicating number of samples processed. |
| `Flag_valid_symbol_output` | `bool` | Indicates the validity of the tracking for each channel. |
| `correlation_length_ms` | `int32_t` | Time duration of correlation-integration, in [ms]. |
|----------

### Telemetry Decoder

The following set of variables record information about the [Telemetry Decoder]({{ "/docs/sp-blocks/telemetry-decoder/" | relative_url }}) block.

|----------
|  **Name**  |  **Type** | **Description** |
|:-:|:-:|:--|    
|--------------
| `Flag_valid_word` | `bool` | Indicates the validity of the decoded word for pseudorange computation. |
| `TOW_at_current_symbol_ms` | `uint32_t` | Time of week of the current symbol, in [ms]. |
|----------

### Observables

The following set of variables record information about the [Observables]({{ "/docs/sp-blocks/observables/" | relative_url }}) block.

|----------
|  **Name**  |  **Type** | **Description** |
|:-:|:-:|:--|    
|--------------
| `Pseudorange_m` | `double` | Pseudorange computation in each channel, in [m]. |
| `RX_time` | `double` | Receiving time in each channel after the start of the week, in [s]. |
| `Flag_valid_pseudorange` | `bool` | Pseudorange computation status in each channel. |
| `interp_TOW_ms` | `double` | Interpolated time of week, in [ms]. |
|----------

## Configuration

The configuration of the _Monitor_ block accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `Monitor.enable_monitor` | [`true`, `false`]: If set to `true`, the _Monitor_ block is activated. | Mandatory |
| `Monitor.decimation_factor` | Decimation integer factor $$ N $$. Limits the streaming output rate to only every $$ N^{th} $$ sample. To stream all the samples, set this to `1`. Zero or negative values are treated as `1`. | Mandatory |
| `Monitor.client_addresses` | Destination IP address(es). To specify multiple clients, use an underscore delimiter character ( `_` ) between addresses. As many addresses can be added as deemed necessary. Duplicate addresses are ignored. | Mandatory |
| `Monitor.udp_port` | Destination port number. Must be within the range from `0` to `65535`. Ports outside this range are treated as `0`. The port number is the same for all the clients. | Mandatory |
| `Monitor.enable_protobuf` | [`true`, `false`]: If set to `true`, the serialization is done using [Protocol Buffers](https://developers.google.com/protocol-buffers/), with the format defined at [`gnss_synchro.proto`](https://github.com/gnss-sdr/gnss-sdr/blob/next/docs/protobuf/gnss_synchro.proto). If set to `false`, it uses [Boost Serialization](https://www.boost.org/doc/libs/release/libs/serialization/doc/index.html). That is a deprecated behavior that can be abandoned in the future. It defaults to `true` (Protocol Buffers is used). | Optional |
|----------


Example 1:

The following configuration streams the receiver internal parameters to the localhost address on port 1234 UDP without decimation:

```ini
;######### MONITOR CONFIG ############
Monitor.enable_monitor=true
Monitor.decimation_factor=1
Monitor.client_addresses=127.0.0.1
Monitor.udp_port=1234
```

Example 2:

The following configuration streams the receiver internal parameters to the addresses 10.10.10.1 and 10.10.10.2 on port 1234 UDP with a decimation integer factor of $$ N=1000 $$:

```ini
;######### MONITOR CONFIG ############
Monitor.enable_monitor=true
Monitor.decimation_factor=1000
Monitor.client_addresses=10.10.10.1_10.10.10.2
Monitor.udp_port=1234
```

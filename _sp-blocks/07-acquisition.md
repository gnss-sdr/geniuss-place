---
title: "Acquisition"
permalink: /docs/sp-blocks/acquisition/
excerpt: "Documentation for the Acquisition block."
sidebar:
  nav: "sp-block"
toc: true
last_modified_at: 2018-01-16T15:54:02-04:00
---

The role of an _Acquisition_ block is the detection of presence/absence
of signals coming from a given GNSS satellite. In case of a positive
detection, it should provide coarse estimations of the code phase
$$ \hat{\tau} $$ and the Doppler shift $$ \hat{f}_d $$, yet accurate enough to
initialize the delay and phase tracking loops.
{: .notice--info}

By exploiting the concepts and methodology of estimation theory, it is possible to
show that the maximum likelihood (ML) estimates of $$ f_d $$ and $$ \tau $$ can
be obtained by maximizing the function

$$ \begin{equation}
\hat{f}_{d_{ML}}, \hat{\tau}_{ML} = \arg \max_{f_d,\tau} \left\{ \left| \hat{R}_{xd}(f_d,\tau)\right|^2\right\}~, \end{equation} $$

where

$$ \begin{equation}
\hat{R}_{xd}(f_d,\tau)=\frac{1}{N}\sum_{n=0}^{N-1}x_{\text{IN}}[n]d[nT_s-\tau]e^{-j 2 \pi f_d nT_s}~, \end{equation} $$

$$ x_{\text{IN}}[n] $$ is a complex vector containing I&Q samples of the
received signal, $$ T_s $$ is the sampling period, $$ \tau $$ is the code phase
of the received signal with respect to a local reference, $$ f_d $$ is the
Doppler shift, $$ N $$ is the number of samples in a spreading code (4 ms
for Galileo E1, 1 ms for GPS L1), and $$ d[n] $$ is a locally generated
reference. The maximization in the equation above requires a two-dimensional
search in a function which output results from a multiplication-and-sum
of $$ N $$ complex samples, becoming the computational bottleneck of the
whole process. A usual method to alleviate this issue is to resort to
the FFT-based circular convolution, which exchanges the expensive
multiplication-and-sum operation by a discrete Fourier transform, a
vector product and an inverse transform, taking advantage of the
efficient implementations available for such operations[^Borre06].


The magnitude of $$ |\hat{R}_{xd}(f_d,\tau)| $$, also known as cross-ambiguity function, is
also used to decide whether the satellite corresponding to the local
replica $$ d[n] $$ is in view or it is not. Resorting to signal detection
theory, it is possible to define tests statistics with desirable
properties. A criterion commonly used for a detection problem is the
maximization of the detection probability ($$ P_d $$) subject to a given
false alarm probability ($$ P_{fa} $$). It is well-known in the literature
that the optimum solution to that problem can be found by applying the
Neyman-Pearson (NP) approach, which requires perfect knowledge of the
signal parameters and constitutes the uniformly most powerful test.
Assuming additive white Gaussian noise and replacing the true
synchronization parameters by their ML estimators in the NP detector,
one obtains the Generalized Likelihood Ratio Test (GLRT) function, that
can be written as:

$$ \begin{equation} T_{\text{GLRT}}\left(\mathbf{x}_{\text{IN}}\right)=\max_{f_d,\tau}\left\{ \frac{\left|\hat{R}_{xd}(f_d,\tau) \right|^2}{\hat{R}_{xx}} \right\}~, \end{equation} $$

where $$ \hat{R}_{xx} $$ is an estimation of the input signal power. It can
be shown that this acquisition test statistic is a Constant False
Alarm Rate (CFAR) detector because $$ P_{fa} $$ does not depend on the noise
power.

![CAF]({{ "/assets/images/caf.png" | absolute_url }}){:width="600x"}
{: style="text-align: center;"}
_GLRT statistic for Parallel Code Phase Search acquisition algoritm
for a configuration of $$ f_{IN} = 4 $$ Msps, a frequency span of $$ \pm 5 $$ kHz with steps of $$ 250 $$ Hz, and using the E1B sinBOC local replica for Galileo’s IOV satellite PRN 11[^Fernandez12]._
{: style="text-align: center;"}


## GPS L1 C/A signal acquisition

### Implementation: `GPS_L1_CA_PCPS_Acquisition`

The Parallel Code Phase Search (PCPS) algorithm is described as follows:

* **Require**: Input signal buffer $$ \mathbf{x}_{\text{IN}} $$ of $$ N $$ complex samples,
provided by the Signal Conditioner; on-memory FFT of the local replica,
$$ D[n]=FFT_{N}\left\{d[n]\right\} $$; acquisition threshold $$ \gamma $$; freq.
span $$ [f_{min}\; f_{max}] $$; freq. step $$ f_{step} $$.
* **Ensure**: Decision positive or negative signal acquisition. In case of positive detection, it provides
coarse estimations of code phase $$ \hat{\tau}_{acq} $$ and Doppler shift
$$ \hat{f}_{d_{acq}} $$ to the Tracking block.

1.	Compute input signal power estimation:
 $$ \hat{P}_{in}=\frac{1}{N}\sum_{n=0}^{N-1}\left|x_{\text{IN}}[n]\right|^2 $$.

2.	**for** $$ \check{f}_d=f_{min} $$ to  $$ \check{f}_d=f_{max} $$ in $$ f_{step} $$ steps:
*	Carrier wipe-off: $$ x[n]=x_{\text{IN}}[n] \cdot e^{-(j2\pi  \check{f}_d  n T_s)} $$, for $$ n=0,...,N-1 $$.
*	Compute $$ X[n]=\text{FFT}_{N}\left\{ x[n]\right\} $$.
*	Compute $$ Y[n]=X[n] \cdot D[n] $$, for $$ n=0,...,N-1 $$.
*	Compute $$ R_{xd}(\check{f}_d, \boldsymbol{\tau})=\frac{1}{N^2}\text{IFFT}_{N}\left\{Y[n]\right\} $$.

7.	**end for**

8.	Search maximum and its indices in the search grid:
 $$ \left\{S_{max}, f_i, \tau_j \right\} \quad \Leftarrow \quad \max_{f,\tau}\left|R_{xd}(f,\tau)\right|^2 $$

9.	Compute the GLRT function with normalized variance:
 $$ \Gamma_{\text{GLRT}}=\frac{2\cdot N \cdot S_{max}}{\hat{P}_{in}} $$

10.	**if** $$ \Gamma_{\text{GLRT}}>\gamma $$
*	Declare positive acquisition and provide $$ \hat{f}_{d_{acq}}=f_i $$ and
$$ \hat{\tau}_{acq}=\tau_j $$.

12.	**else**
* Declare negative acquisition.

14. **endif**
{: .notice--info}


The computation of the Fast Fourier Transform and its
inverse (second and fourth steps inside the _for_ loop) are performed by means of GNU
Radio wrappers of the [FFTW library](http://www.fftw.org/), an efficient implementation
for computing the discrete Fourier transform, whereas the products (first and third steps in the _for_ loop) are implemented with the Vector-Optimized Library of
Kernels ([VOLK](http://libvolk.org/)), which generates processor-specific Single-Input
Multiple-Data (SIMD) assembly instructions that take advantage of
parallel computing techniques and allow writing efficient and portable
code.

This implementation accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_hz` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `GPS_L1_CA_PCPS_Acquisition` | Mandatory |
| `item_type` | [`gr_complex`, `cshort`, `cbyte`]: Set the sample data type expected at the block input. It defaults to `gr_complex`. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to $$ 0 $$ (_i.e._, complex baseband signal). | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `use_CFAR_algorithm` | [`true`, `false`]: If set to `true`, applies a normalization to the computed peak value on the search grid. It defaults to `true`. | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. It defaults to 1 ms. | Optional |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| <span style="color: DarkOrange">`blocking`</span> | <span style="color: DarkOrange">[`true`, `false`]: If set to `false`, the acquisition workload is executed in a separate thread, outside the GNU Radio scheduler that manages the flow graph, and the block skips over samples that arrive while the processing thread is busy. This is specially useful in real-time operation using radio frequency front-ends, overcoming the processing bottleneck for medium and high sampling rates. However, this breaks the determinism provided by the GNU Radio scheduler, and different processing results can be obtained in different machines. Do not use this option for file processing. **ONLY AVAILABLE IN THE `next` BRANCH**. It defaults to `true`.</span> | <span style="color: DarkOrange">Optional</span> |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
|--------------

  _Acquisition implementation:_ **`GPS_L1_CA_PCPS_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION GLOBAL CONFIG ############
Acquisition_1C.implementation=GPS_L1_CA_PCPS_Acquisition
Acquisition_1C.doppler_max=8000
Acquisition_1C.doppler_step=250
Acquisition_1C.pfa=0.0001
```

### Implementation: `GPS_L1_CA_PCPS_Acquisition_Fine_Doppler`

This implementation accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_hz` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `GPS_L1_CA_PCPS_Acquisition_Fine_Doppler` | Mandatory |
| `item_type` | [`gr_complex`]: Set the sample data type expected at the block input. Only `gr_complex` is defined in this version. It defaults to `gr_complex`. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to $$ 0 $$ (_i.e._, complex baseband signal). | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to $$ 5000 $$ Hz. | Optional |
| `doppler_min`  | Minimum Doppler value in the search grid, in Hz. It defaults to $$ -5000 $$ Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. It defaults to 1 ms. | Optional |
| `max_dwells` |  Set the maximum number of dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
|--------------

  _Acquisition implementation:_ **`GPS_L1_CA_PCPS_Fine_Doppler_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
Acquisition_1C.implementation=GPS_L1_CA_PCPS_Acquisition_Fine_Doppler
Acquisition_1C.threshold=0.007
Acquisition_1C.doppler_max=10000
Acquisition_1C.doppler_min=-10000
Acquisition_1C.doppler_step=500
Acquisition_1C.max_dwells=10
```

### Implementation: `GPS_L1_CA_PCPS_Tong_Acquisition`

On top of the PCPS Algorithm (or any other providing the same
outputs), we could integrate results from more than one consecutive code
periods in order to enhance the *acquisition sensitivity*, understood as
the minimum signal power at which a receiver can correctly identify the
presence of a particular satellite signal in the incoming RF signal
within a given time-out interval.

This is the case of the Tong detector[^Tong73], a sequential variable dwell time detector with a
reasonable computation burden and proves good for acquiring signals with low $$ C/N_0 $$ levels.  During the
signal search, the up/down counter $$ K $$ is incremented by one if the correlation peak value exceeds the threshold, otherwise it is
decremented by one. If the counter has reached maximum count value $$ A $$, the signal is
declared ‘_present_’ and the search is terminated. Similarly if the counter contents reach zero,
the signal is declared ‘_absent_’ and the search is terminated. So that the Tong detector is not
trapped into an extended dwell in the same cell, under certain poor signal conditions, another
counter ($$ K_{max} $$) sets the limit on maximum number of dwells.

This implementation accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_hz` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `GPS_L1_CA_Tong_PCPS_Acquisition` | Mandatory |
| `item_type` | [`gr_complex`]: Set the sample data type expected at the block input. It defaults to `gr_complex`. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to $$ 0 $$ (_i.e._, complex baseband signal). | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. It defaults to 1 ms. | Optional |
| `tong_init_val` | Initial value of the Tong counter $$ K $$. It defaults to 1. | Optional |
| `tong_max_val` | Count value $$ A $$ that, if reached by counter $$ K $$, declares a signal as present. It defaults to 2. | Optional |
| `tong_max_dwells` | Maximum number of dwells in a search $$ K_{max} $$. It defaults to `tong_max_val` $$ +1 $$. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
|--------------

  _Acquisition implementation:_ **`GPS_L1_CA_PCPS_Tong_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION GLOBAL CONFIG ############
Acquisition_1C.implementation=GPS_L1_CA_PCPS_Tong_Acquisition
Acquisition_1C.pfa=0.0001
Acquisition_1C.doppler_max=10000
Acquisition_1C.doppler_step=250
Acquisition_1C.tong_init_val=2
Acquisition_1C.tong_max_val=10
Acquisition_1C.tong_max_dwells=20
```


## GPS L2CM signal acquisition

### Implementation: `GPS_L2_M_PCPS_Acquisition`

This implementation accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_hz` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `GPS_L2_M_PCPS_Acquisition` | Mandatory |
| `item_type` | [`gr_complex`, `cshort`, `cbyte`]: Set the sample data type expected at the block input. It defaults to `gr_complex`. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to $$ 0 $$ (_i.e._, complex baseband signal). | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    | Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `use_CFAR_algorithm` | [`true`, `false`]: If set to `true`, applies a normalization to the computed peak value on the search grid. It defaults to `true`. | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. It defaults to 1 ms. | Optional |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| <span style="color: DarkOrange">`blocking`</span> | <span style="color: DarkOrange">[`true`, `false`]: If set to `false`, the acquisition workload is executed in a separate thread, outside the GNU Radio scheduler that manages the flow graph, and the block skips over samples that arrive while the processing thread is busy. This is specially useful in real-time operation using radio frequency front-ends, overcoming the processing bottleneck for medium and high sampling rates. However, this breaks the determinism provided by the GNU Radio scheduler, and different processing results can be obtained in different machines. Do not use this option for file processing. **ONLY AVAILABLE IN THE `next` BRANCH**. It defaults to `true`.</span> | <span style="color: DarkOrange">Optional</span> |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
|--------------

  _Acquisition implementation:_ **`GPS_L2_M_PCPS_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
Acquisition_2S.implementation=GPS_L2_M_PCPS_Acquisition
Acquisition_2S.item_type=cshort
Acquisition_2S.threshold=0.0015
Acquisition_2S.doppler_max=6000
Acquisition_2S.doppler_step=60
Acquisition_2S.max_dwells=2
```

## GPS L5 signal acquisition

### Implementation: `GPS_L5i_PCPS_Acquisition`

**IMPORTANT**: This implementation is only available from the `next` branch of GNSS-SDR's repository, so it is **not** present in the current stable release.
{: .notice--warning}

This implementation accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_sps` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `GPS_L5i_PCPS_Acquisition` | Mandatory |
| `item_type` | [`gr_complex`, `cshort`, `cbyte`]: Set the sample data type expected at the block input. It defaults to `gr_complex`. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to $$ 0 $$ (_i.e._, complex baseband signal). | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `use_CFAR_algorithm` | [`true`, `false`]: If set to `true`, applies a normalization to the computed peak value on the search grid. It defaults to `true`. | Optional |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `blocking` | [`true`, `false`]: If set to `false`, the acquisition workload is executed in a separate thread, outside the GNU Radio scheduler that manages the flow graph, and the block skips over samples that arrive while the processing thread is busy. This is specially useful in real-time operation using radio frequency front-ends, overcoming the processing bottleneck for medium and high sampling rates. However, this breaks the determinism provided by the GNU Radio scheduler, and different processing results can be obtained in different machines. Do not use this option for file processing. It defaults to `true`. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
|--------------

  _Acquisition implementation:_ **`GPS_L5i_PCPS_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
Acquisition_L5.implementation=GPS_L5i_PCPS_Acquisition
Acquisition_L5.item_type=cshort
Acquisition_L5.threshold=0.0015
Acquisition_L5.doppler_max=6000
Acquisition_L5.doppler_step=60
Acquisition_L5.max_dwells=2
```


## Galileo E1 signal acquisition

The Galileo E1 Open Service signal can be written as:[^GalileoICD]

$$ \begin{equation} s^{\text{(Gal E1)}}_{T}(t) = \frac{1}{\sqrt{2}} \Big( e_{E1B}(t)\left( \alpha sc_A(t)+ \beta sc_B(t) \right) - e_{E1C}(t) \left( \alpha sc_A(t)- \beta  sc_B(t) \right) \Big)~, \end{equation} $$

where $$ sc_A(t) $$ and $$ sc_B(t) $$ are the subcarriers defined as
$$ sc_A(t)= \text{sign}\Big(\sin(2\pi f_{s,E1A}t) \Big) $$ and
$$ sc_B(t)= \text{sign} \Big( \sin( 2 \pi f_{s, E1B}t ) \Big) $$, with
$$ f_{s,E1A}=1.023 $$ MHz and $$ f_{s, E1B}=6.138 $$ MHz.

Channel B contains the I/NAV type of navigation message,
$$ D_{I/NAV} $$, and can be expressed as:

$$ \begin{equation} e_{E1B}(t) = \sum_{l=-\infty}^{+\infty} D_{\text{I/NAV}} \Big[ [l]_{4092}\Big] \oplus C_{E1B}\Big[|l|_{4092}\Big]    p(t - lT_{c,E1B})~. \end{equation} $$

In case of channel C, it is a pilot (dataless) channel with a secondary code with a length of 100 ms, forming a tiered code:

$$ \begin{equation} e_{E1C}(t) = \sum_{m=-\infty}^{+\infty}C_{E1Cs}\Big[|m|_{25}\Big] \oplus \sum_{l=1}^{4092}C_{E1Cp}\Big[ l \Big] \cdot  p(t-mT_{c,E1Cs}-lT_{c,E1Cp})~, \end{equation} $$

with $$ T_{c,E1B}=T_{c,E1Cp}=\frac{1}{1.023} $$ $$ \mu $$s and $$ T_{c,E1Cs}=4 $$ ms.

### Implementation: `Galileo_E1_PCPS_Ambiguous_Acquisition`

This implementation permits the configuration of the shape of the local replica $$ d[n] $$, allowing for simplifications that reduce the computational load. As shown in the figure
[below]({{ "/docs/sp-blocks/acquisition/#fig:Rxd" | absolute_url }}), in narrowband receivers the CBOC waveform can be substituted
by a sinBOC modulation with very small performance penalty[^Lohan11]. For
the E1B signal component, the reference signals available in this
implementation are:

$$ \begin{equation} d_{E1B}^{(\text{CBOC})}[n] = \sum_{l=-\infty}^{+\infty}   C_{E1B}\Big[|l|_{4092}\Big]  p(t  -  lT_{c,E1B}) \cdot \left( \alpha sc_A[n]+ \beta sc_B[n] \right) \end{equation} $$

or

$$ \begin{equation} \label{eq:dE1BsinBOC}
d_{E1B}^{(\text{sinBOC})}[n]= \sum_{l=-\infty}^{+\infty}  C_{E1B}\Big[|l|_{4092}\Big] p(t  -  lT_{c,E1B})  sc_A[n]~, \end{equation} $$

while for E1C, users can choose among:

$$ \begin{equation} d_{E1C}^{(\text{CBOC})}[n] = \sum_{m=-\infty}^{+\infty}  \sum_{l=1}^{4092}\! C_{E1Cp}\Big[ l \Big] \! \cdot  \! p[n\! -\! mT_{c,E1Cs} - lT_{c,E1Cp}] \cdot \left( \alpha sc_A[n]+ \beta sc_B[n] \right) \end{equation} $$

or

$$ \begin{equation} d_{E1C}^{(\text{sinBOC})}[n] = \sum_{m=-\infty}^{+\infty}  \! \sum_{l=1}^{4092}C_{E1Cp}\Big[ l \Big]   \! \cdot  \!   p[n - mT_{c,E1Cs} - lT_{c,E1Cp}] \cdot sc_A[n]~. \end{equation} $$

The simpler sinBOC options are chosen by default. CBOC versions can be set by `Acquisition_1B.cboc=true`.
Next figure plots the shape of the cross-correlation function for those waveforms:

<a name="fig:Rxd"></a>![Rxd]({{ "/assets/images/rxd.png" | absolute_url }}){:width="600x"}
{: style="text-align: center;"}
_Normalized $$ \left|R_{xd}\left(\check{f}_d=f_d, \tau \right) \right|^2 $$ for different sampling rates and local reference waveforms[^Fernandez12]._
{: style="text-align: center;"}



This implementation accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_hz` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Galileo_E1_PCPS_Ambiguous_Acquisition` | Mandatory |
| `item_type` | [`gr_complex`, `cshort`, `cbyte`]: Set the sample data type expected at the block input. It defaults to `gr_complex`. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to $$ 0 $$ (_i.e._, complex baseband signal). | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `cboc` | [`true`, `false`]: If set to `true` the algorithm uses the CBOC waveform , if set to `false` a simpler sinBOC waveform is used. It defaults to `false`. | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. Should be a multiple of 4 ms. It defaults to 4 ms. | Optional |
| <span style="color: DarkOrange">`acquire_pilot`</span> | <span style="color: DarkOrange">[`true`, `false`]: If set to `true`, sets the receiver to acquire the E1C pilot component. **ONLY AVAILABLE IN THE `next` BRANCH**. It defaults to `false` (that is, the receiver is set to acquire the E1B data component).</span> | <span style="color: DarkOrange">Optional</span> |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| <span style="color: DarkOrange">`blocking`</span> | <span style="color: DarkOrange">[`true`, `false`]: If set to `false`, the acquisition workload is executed in a separate thread, outside the GNU Radio scheduler that manages the flow graph, and the block skips over samples that arrive while the processing thread is busy. This is specially useful in real-time operation using radio frequency front-ends, overcoming the processing bottleneck for medium and high sampling rates. However, this breaks the determinism provided by the GNU Radio scheduler, and different processing results can be obtained in different machines. Do not use this option for file processing. **ONLY AVAILABLE IN THE `next` BRANCH**. It defaults to `true`.</span> | <span style="color: DarkOrange">Optional</span> |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
|--------------

  _Acquisition implementation:_ **`Galileo_E1_PCPS_Ambiguous_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION GLOBAL CONFIG ############
Acquisition_1B.implementation=Galileo_E1_PCPS_Ambiguous_Acquisition
Acquisition_1B.pfa=0.000008
Acquisition_1B.doppler_max=6000
Acquisition_1B.doppler_step=250
```

### Implementation: `Galileo_E1_PCPS_Tong_Ambiguous_Acquisition`

The Tong detector[^Tong73] is a sequential variable dwell time detector with a
reasonable computation burden that proves good for acquiring signals with low $$ C/N_0 $$ levels.  During the
signal search, the up/down counter $$ K $$ is incremented by one if the correlation peak value exceeds the threshold, otherwise it is
decremented by one. If the counter has reached maximum count value $$ A $$, the signal is
declared ‘_present_’ and the search is terminated. Similarly if the counter contents reach zero,
the signal is declared ‘_absent_’ and the search is terminated. So that the Tong detector is not
trapped into an extended dwell in the same cell, under certain poor signal conditions, another
counter ($$ K_{max} $$) sets the limit on maximum number of dwells.

This implementation accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_hz` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Galileo_E1_PCPS_Tong_Ambiguous_Acquisition` | Mandatory |
| `item_type` | [`gr_complex`]: Set the sample data type expected at the block input. It defaults to `gr_complex`. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to $$ 0 $$ (_i.e._, complex baseband signal). | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. Should be a multiple of 4 ms. It defaults to 4 ms. | Optional |
| `tong_init_val` | Initial value of the Tong counter $$ K $$. It defaults to 1. | Optional |
| `tong_max_val` | Count value $$ A $$ that, if reached by counter $$ K $$, declares a signal as present. It defaults to 2. | Optional |
| `tong_max_dwells` | Maximum number of dwells in a search $$ K_{max} $$. It defaults to `tong_max_val` $$ +1 $$. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
|--------------

  _Acquisition implementation:_ **`Galileo_E1_PCPS_Tong_Ambiguous_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION GLOBAL CONFIG ############
Acquisition_1B.implementation=Galileo_E1_PCPS_Tong_Ambiguous_Acquisition
Acquisition_1B.pfa=0.0001
Acquisition_1B.doppler_max=10000
Acquisition_1B.doppler_step=250
Acquisition_1B.tong_init_val=2
Acquisition_1B.tong_max_val=10
Acquisition_1B.tong_max_dwells=20
```


## Galileo E5a signal acquisition

### Implementation: `Galileo_E5a_Noncoherent_IQ_Acquisition_CAF`

This implementation accepts the following parameters:


|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_hz` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Galileo_E5a_Noncoherent_IQ_Acquisition_CAF` | Mandatory |
| `item_type` | [`gr_complex`]: Set the sample data type expected at the block input. It defaults to `gr_complex`. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to $$ 0 $$ (_i.e._, complex baseband signal). | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `CAF_window_hz` | Resolves Doppler ambiguity by averaging the specified bandwidth (in Hz) in the winner code delay. If set to $$ 0 $$, the CAF filter is deactivated. Recommended value: $$ 3000 $$ Hz. It defaults to 0 Hz. | Optional |
| `Zero_padding` |  If set to a $$ 1 $$, it avoids power loss and doppler ambiguity in bit transitions by correlating one code with twice the input data length, ensuring that at least one full code is present without transitions. It defaults to $$ 0 $$ (_i.e._, deactivated). | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. Should be a 3 ms or less. It defaults to 1 ms. | Optional |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
|--------------

  _Acquisition implementation:_ **`Galileo_E5a_Noncoherent_IQ_Acquisition_CAF`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION GLOBAL CONFIG ############
Acquisition_5X.implementation=Galileo_E5a_Noncoherent_IQ_Acquisition_CAF
Acquisition_5X.threshold=0.002
Acquisition_5X.doppler_max=10000
Acquisition_5X.doppler_step=250
```




-------


## References

[^Borre06]: K. Borre, D. M. Akos, N. Bertelsen, P. Rinder, S. H. Jensen, _A Software-Defined GPS and Galileo Receiver. A Single-Frequency Approach_, 1st edition, Boston: Birkhäuser, November 2006.

[^Fernandez12]: C. Fern&aacute;ndez-Prades, J. Arribas, L. Esteve-Elfau, D. Pubill, P. Closas, [An Open Source Galileo E1 Software Receiver](http://www.cttc.es/wp-content/uploads/2013/03/121208-2582419-fernandez-9099698438457074772.pdf), in Proceedings of the 6th ESA Workshop on Satellite Navigation Technologies (NAVITEC 2012), 5-7 December 2012, ESTEC, Noordwijk (The Netherlands).

[^Lohan11]: J. Zhang, E. S. Lohan, _Galileo E1 and E5a Link-Level Performances in Single and Multipath Channels_. In G. Giambene, C. Sacchi, Eds., Personal Satellite Services, Third International ICST Conference PSATS 2011, Malaga, Spain, February 2011.

[^Tong73]: P. S. Tong, _A Suboptimum Synchronization Procedure for Pseudo Noise Communication Systems_, in Proc. of National Telecommunications Conference, 1973, pp. 26D1-26D5.

[^GalileoICD]: [European GNSS (Galileo) Open Service Signal In Space Interface Control Document](http://www.gsc-europa.eu/system/files/galileo_documents/Galileo_OS_SIS_ICD.pdf), Issue 1.3, Dec. 2016.

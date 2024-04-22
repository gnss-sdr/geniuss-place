---
title: "Acquisition"
permalink: /docs/sp-blocks/acquisition/
excerpt: "Documentation for the Acquisition blocks."
sidebar:
  nav: "sp-block"
toc: true
toc_sticky: true
last_modified_at: 2021-01-11T12:54:02-02:00
---

A generic GNSS signal defined by its complex baseband equivalent, $$ s_{T}(t) $$,
the digital signal at the input of an _Acquisition_ block can be written as:

$$ \begin{equation}
\label{xin} x_\text{IN}[k] = A(t)\tilde{s}_{T}(t - \tau(t))e^{j \left( 2\pi f_D(t) t + \phi(t) \right) } \Bigr \rvert_{t=kT_s} + n(t) \Bigr \rvert_{t=kT_s}
\end{equation} $$

where $$ A(t) $$ is the signal amplitude, $$ \tilde{s}_{T}(t) $$ is a filtered
version of $$ s_T(t) $$, $$ \tau(t) $$ is a time-varying code delay, $$ f_D(t) $$
is a time-varying Doppler shift, $$ \phi(t) $$ is a time-varying carrier phase
shift, $$ n(t) $$ is a term modeling random noise and $$ T_s $$ is the sampling
period.

The role of an _Acquisition_ block is the detection of the presence/absence of
signals coming from a given GNSS satellite. In the case of a positive detection,
it should provide coarse estimations of the code phase $$ \hat{\tau}_{acq} $$
and the Doppler shift $$ \hat{f}_{\!D_{acq}} $$, yet accurate enough to
initialize the delay and phase tracking loops.
{: .notice--info}

By exploiting the concepts and methodology of estimation theory, it is possible
to show that the maximum likelihood (ML) estimates of $$ f_D $$ and $$ \tau $$
can be obtained by maximizing the function

$$ \begin{equation}
\hat{f}_{\!D_{ML}}, \hat{\tau}_{ML} = \arg \max_{f_D,\tau} \left\{ \left| \hat{R}_{xd}(f_D,\tau)\right|^2\right\}~,
\end{equation} $$

where

$$ \begin{equation}
\hat{R}_{xd}(f_D,\tau) = \frac{1}{K}\sum_{k=0}^{K-1}x_{\text{IN}}[k]d[kT_s - \tau]e^{-j 2 \pi f_D kT_s}~,
\end{equation} $$

$$ x_{\text{IN}}[k] $$ is a complex vector containing I&Q samples of the
received signal, $$ T_s $$ is the sampling period, $$ \tau $$ is the code phase
of the received signal with respect to a local reference, $$ f_D $$ is the
Doppler shift, $$ K $$ is the number of samples in a spreading code (4 ms for
Galileo E1, 1 ms for GPS L1, etc.), and $$ d[k] $$ is a locally generated
reference. The maximization in the equation above requires a two-dimensional
search in a function which output results from a multiplication-and-sum of $$ K $$
complex samples, becoming the computational bottleneck of the whole process. A
usual method to alleviate this issue is to resort to the FFT-based circular
convolution, which exchanges the expensive multiplication-and-sum operation by a
discrete Fourier transform, a vector product, and an inverse transform, taking
advantage of the efficient implementations available for such
operations[^Borre06].

The magnitude of $$ |\hat{R}_{xd}(f_D,\tau)| $$, also known as cross-ambiguity
function, is also used to decide whether the satellite corresponding to the
local replica $$ d[k] $$ is in view or it is not. Resorting to signal detection
theory, it is possible to define tests statistics with desirable properties. A
criterion commonly used for a detection problem is the maximization of the
detection probability ($$ P_d $$) subject to a given false alarm probability ($$
P_{fa} $$). It is well-known in the literature that the optimum solution to that
problem can be found by applying the
[Neyman-Pearson](https://en.wikipedia.org/wiki/Neyman%E2%80%93Pearson_lemma)
approach, which requires perfect knowledge of the signal parameters and
constitutes the [uniformly most powerful
test](https://en.wikipedia.org/wiki/Uniformly_most_powerful_test). Assuming
additive white Gaussian noise and replacing the true synchronization parameters
by their ML estimators in the Neyman-Pearson detector, one obtains the
Generalized Likelihood Ratio Test (GLRT) function, which can be written as:

$$ \begin{equation}
T_{\text{GLRT}}\left(\mathbf{x}_{\text{IN}}\right) = \max_{f_D,\tau}\left\{ \frac{\left| \hat{R}_{xd}(f_D,\tau) \right|^2}{\hat{R}_{xx}} \right\}~,
\end{equation} $$

where $$ \hat{R}_{xx} $$ is an estimation of the input signal power. It can
be shown that this acquisition test statistic is a Constant False
Alarm Rate (CFAR) detector because $$ P_{fa} $$ does not depend on the noise
power.

![CAF]({{ "/assets/images/caf.png" | relative_url }}){:width="600px"}{: .align-center .invert-colors}
_GLRT statistic for Parallel Code Phase Search acquisition algorithm for a
configuration of $$ f_{IN} = 4 $$ Msps, a frequency span of $$ \pm 5 $$ kHz with
steps of $$ 250 $$ Hz, and using the E1B sinBOC local replica for Galileo's IOV
satellite PRN 11[^Fernandez12]._
{: style="text-align: center;"}


## GPS L1 C/A signal acquisition

### Implementation: `GPS_L1_CA_PCPS_Acquisition`

The Parallel Code Phase Search (PCPS) algorithm is described as follows:

* **Require**: Input signal buffer $$ \mathbf{x}_{\text{IN}} $$ of $$ K $$
complex samples, provided by the Signal Conditioner; on-memory FFT of the local
replica, $$ D[k]=FFT_{K}\left\{d[k]\right\} $$; acquisition threshold $$ \gamma $$;
freq. span $$ [f_{min}\; f_{max}] $$; freq. step $$ f_{step} $$.
* **Ensure**: Decision positive or negative signal acquisition. In the case of
positive detection, it provides coarse estimations of code phase
$$ \hat{\tau}_{acq} $$ and Doppler shift $$ \hat{f}_{\!D_{acq}} $$ to the Tracking
block.

1.	Compute input signal power estimation:
 $$ \hat{P}_{in} = \frac{1}{K}\sum_{k=0}^{K-1}\left|x_{\text{IN}}[k]\right|^2 $$.

2.	**for** $$ \check{f}_D=f_{min} $$ to $$ \check{f}_D = f_{max} $$ in $$ f_{step} $$ steps:
*	Carrier wipe-off: $$ x[k] = x_{\text{IN}}[k] \cdot e^{-(j2\pi \check{f}_D k T_s)} $$, for $$ k = 0,...,K-1 $$.
*	Compute $$ X[k] = \text{FFT}_{K}\left\{ x[k]\right\} $$.
*	Compute $$ Y[k] = X[k] \cdot D[k] $$, for $$ k = 0,...,K-1 $$.
*	Compute $$ R_{xd}(\check{f}_D, \boldsymbol{\tau}) = \frac{1}{K^2}\text{IFFT}_{K}\left\{Y[k]\right\} $$.

7.	**end for**

8.	Search maximum and its indices in the search grid:
 $$ \left\{S_{max}, f_i, \tau_j \right\} \quad \Leftarrow \quad \max_{f,\tau}\left|R_{xd}(f,\tau)\right|^2 $$

9.	Compute the GLRT function with normalized variance:
 $$ \Gamma_{\text{GLRT}} = \frac{2\cdot K \cdot S_{max}}{\hat{P}_{in}} $$

10.	**if** $$ \Gamma_{\text{GLRT}}>\gamma $$
*	Declare positive acquisition and provide $$ \hat{f}_{\!D_{acq}} = f_i $$ and
$$ \hat{\tau}_{acq} = \tau_j $$.

12.	**else**
* Declare negative acquisition.

14. **endif**
{: .notice--info}


The computation of the Fast Fourier Transform and its inverse (second and fourth
steps inside the _for_ loop) are performed by means of GNU Radio wrappers of the
[FFTW library](http://www.fftw.org/), an efficient implementation for computing
the discrete Fourier transform, whereas the products (first and third steps in
the _for_ loop) are implemented with the Vector-Optimized Library of Kernels
([VOLK](https://www.libvolk.org/)), which generates processor-specific
Single-Input Multiple-Data (SIMD) assembly instructions that take advantage of
parallel computing techniques and allow writing efficient and portable code.

This implementation accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `GNSS-SDR.internal_fs_sps` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
| `GNSS-SDR.use_acquisition_resampler` | [`true`, `false`]: If set to `true`, the Acquisition block makes use of the minimum possible sample rate during acquisition by setting a resampler at its input. This allows reducing the FFT size when using high data rates at `GNSS-SDR.internal_fs_sps`. All the required setup is configured automatically. It defaults to `false`. | Optional |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `GPS_L1_CA_PCPS_Acquisition` | Mandatory |
| `item_type` | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 8-bit integer. C++ name: lv_8sc_t (custom definition of std::complex<int8_t>)">`cbyte`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present). | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. It defaults to 1 ms. | Optional |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of non-coherent dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `blocking` | [`true`, `false`]: If set to `false`, the acquisition workload is executed in a separate thread, outside the GNU Radio scheduler that manages the flow graph, and the block skips over samples that arrive while the processing thread is busy. This is especially useful in real-time operation using radio frequency front-ends, overcoming the processing bottleneck for medium and high sampling rates. However, this breaks the determinism provided by the GNU Radio scheduler, and different processing results can be obtained in different machines. Do not use this option for file processing. It defaults to `true`. | Optional |
| `make_two_steps` | [`true`, `false`]: If set to `true`, an acquisition refinement stage is performed after a signal is declared present. This allows providing an updated, refined Doppler estimation to the Tracking block. It defaults to `false`. | Optional |
| `second_nbins` | If `make_two_steps` is set to `true`, this parameter sets the number of bins done in the acquisition refinement stage. It defaults to 4. | Optional |
| `second_doppler_step` | If `make_two_steps` is set to `true`, this parameter sets the Doppler step applied in the acquisition refinement stage, in Hz. It defaults to 125 Hz. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. This parameter accepts either a relative or an absolute path; if there are non-existing specified folders, they will be created. It defaults to `./acquisition`, so files with name `./acquisition_G_1C_ch_N_K_sat_P.mat` (where `N` is the channel number defined by `dump_channel`, `K` is the dump number, and `P` is the targeted satellite's PRN number) will be generated. | Optional |
| `dump_channel` | If `dump` is set to `true`, channel number from which internal data will be stored. It defaults to 0. | Optional |
|--------------

  _Acquisition implementation:_ **`GPS_L1_CA_PCPS_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION CONFIG FOR GPS L1 CHANNELS ############
Acquisition_1C.implementation=GPS_L1_CA_PCPS_Acquisition
Acquisition_1C.doppler_max=5000
Acquisition_1C.doppler_step=250
Acquisition_1C.pfa=0.01
Acquisition_1C.coherent_integration_time_ms=1
Acquisition_1C.max_dwells=1
```

### Implementation: `GPS_L1_CA_PCPS_Acquisition_Fine_Doppler`

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
| `implementation` | `GPS_L1_CA_PCPS_Acquisition_Fine_Doppler` | Mandatory |
| `item_type` | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the sample data type expected at the block input. Only <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr> is defined in this version. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to $$ 5000 $$ Hz. | Optional |
| `doppler_min`  | Minimum Doppler value in the search grid, in Hz. It defaults to $$ -5000 $$ Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. It defaults to 1 ms. | Optional |
| `max_dwells` |  Set the maximum number of non-coherent dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
|--------------

  _Acquisition implementation:_ **`GPS_L1_CA_PCPS_Fine_Doppler_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION CONFIG FOR GPS L1 CHANNELS ############
Acquisition_1C.implementation=GPS_L1_CA_PCPS_Acquisition_Fine_Doppler
Acquisition_1C.threshold=0.007
Acquisition_1C.doppler_max=10000
Acquisition_1C.doppler_min=-10000
Acquisition_1C.doppler_step=500
Acquisition_1C.max_dwells=10
```

### Implementation: `GPS_L1_CA_PCPS_Tong_Acquisition`

On top of the PCPS Algorithm (or any other providing the same outputs), we could
integrate results from more than one consecutive code periods in order to
enhance the *acquisition sensitivity*, understood as the minimum signal power at
which a receiver can correctly identify the presence of a particular satellite
signal in the incoming RF signal within a given time-out interval.

This is the case of the Tong detector[^Tong73], a sequential variable dwell time
detector with a reasonable computation burden and proves good for acquiring
signals with low $$ C/N_0 $$ levels.  During the signal search, the up/down
counter $$ \mathcal{K} $$ is incremented by one if the correlation peak value
exceeds the threshold, otherwise it is decremented by one. If the counter has
reached the maximum count value $$ A $$, the signal is declared
_&lsquo;present&rsquo;_ and the search is terminated. Similarly, if the counter
contents reach zero, the signal is declared _&lsquo;absent&rsquo;_ and the
search is terminated. So that the Tong detector is not trapped into an extended
dwell in the same cell, under certain poor signal conditions, another counter
($$ \mathcal{K}_{max} $$) sets the limit on the maximum number of dwells.

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
| `implementation` | `GPS_L1_CA_Tong_PCPS_Acquisition` | Mandatory |
| `item_type` | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. It defaults to 1 ms. | Optional |
| `tong_init_val` | Initial value of the Tong counter $$ \mathcal{K} $$. It defaults to 1. | Optional |
| `tong_max_val` | Count value $$ A $$ that, if reached by counter $$ \mathcal{K} $$, declares a signal as present. It defaults to 2. | Optional |
| `tong_max_dwells` | Maximum number of dwells in a search $$ \mathcal{K}_{max} $$. It defaults to `tong_max_val` $$ +1 $$. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
|--------------

  _Acquisition implementation:_ **`GPS_L1_CA_PCPS_Tong_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION CONFIG FOR GPS L1 CHANNELS ############
Acquisition_1C.implementation=GPS_L1_CA_PCPS_Tong_Acquisition
Acquisition_1C.pfa=0.0001
Acquisition_1C.doppler_max=10000
Acquisition_1C.doppler_step=250
Acquisition_1C.tong_init_val=2
Acquisition_1C.tong_max_val=10
Acquisition_1C.tong_max_dwells=20
```

## Galileo E1 signal acquisition

The Galileo E1 Open Service signal can be written as:[^GalileoICD]

$$ \begin{eqnarray}
s^{\text{(Gal E1)}}_{T}(t)& = &\frac{1}{\sqrt{2}} \Big( e_{E1B}(t) \left(\alpha sc_A(t) + \beta sc_B(t) \right)~ + \nonumber \\
{} & {} & -~e_{E1C}(t) \left(\alpha sc_A(t) - \beta sc_B(t) \right) \Big)~,
\end{eqnarray} $$

where $$ sc_A(t) $$ and $$ sc_B(t) $$ are the subcarriers defined as
$$ sc_A(t) = \text{sign}\Big(\sin(2\pi f_{s,E1A}t) \Big) $$ and
$$ sc_B(t) = \text{sign}\Big(\sin(2\pi f_{s, E1B}t) \Big) $$, with
$$ f_{s,E1A}=1.023 $$ MHz and $$ f_{s, E1B}=6.138 $$ MHz.

Channel B contains the I/NAV type of navigation message,
$$ D_{I/NAV} $$, and can be expressed as:

$$ \begin{equation}
e_{E1B}(t) = \sum_{l=-\infty}^{+\infty} D_{\text{I/NAV}} \Big[ [l]_{4092}\Big] \oplus C_{E1B}\Big[|l|_{4092}\Big] \cdot p(t - lT_{c,E1B})~.
\end{equation} $$

In the case of channel C, it is a pilot (dataless) channel with a secondary code
with a length of 100 ms, forming a tiered code:

$$ \!\!\!\!\!\!\!\!\!\!\!\begin{equation}
e_{E1C}(t) =\!\! \sum_{m=-\infty}^{+\infty}\!C_{E1Cs}\Big[|m|_{25}\Big] \oplus \sum_{l=1}^{4092}C_{E1Cp}\Big[ l \Big] \cdot p(t \! - \! mT_{c,E1Cs} \! - \! lT_{c,E1Cp})~,
\end{equation} $$

with $$ T_{c,E1B}=T_{c,E1Cp}=\frac{1}{1.023} $$ $$ \mu $$s and $$ T_{c,E1Cs}=4 $$ ms.

### Implementation: `Galileo_E1_PCPS_Ambiguous_Acquisition`

This implementation permits the configuration of the shape of the local replica $$
d[k] $$, allowing for simplifications that reduce the computational load. As
shown in the figure [below]({{ "/docs/sp-blocks/acquisition/#fig:Rxd" |
relative_url }}), in narrowband receivers the CBOC waveform can be substituted
by a sinBOC modulation with a very small performance penalty[^Lohan11]. For the
E1B signal component, the reference signals available in this implementation
are:

$$ \begin{equation}
d_{E1B}^{(\text{CBOC})}[n] = \sum_{l=-\infty}^{+\infty} C_{E1B}\Big[|l|_{4092}\Big] p(t - lT_{c,E1B}) \cdot \left( \alpha sc_A[n] + \beta sc_B[n] \right)
\end{equation} $$

or

$$ \begin{equation} \label{eq:dE1BsinBOC}
d_{E1B}^{(\text{sinBOC})}[n] = \sum_{l=-\infty}^{+\infty} C_{E1B}\Big[|l|_{4092}\Big] p(t - lT_{c,E1B}) sc_A[n]~,
\end{equation} $$

while for E1C, users can choose among:

$$ \begin{eqnarray}
d_{E1C}^{(\text{CBOC})}[n] & = &\sum_{m=-\infty}^{+\infty} \sum_{l=1}^{4092}\! C_{E1Cp}\Big[ l \Big] \! \cdot \! p[n\! -\! mT_{c,E1Cs} - lT_{c,E1Cp}] \cdot \nonumber \\
{} & {} & \cdot \left( \alpha sc_A[n] + \beta sc_B[n] \right)
\end{eqnarray} $$

or

$$ \!\!\!\!\begin{equation} d_{E1C}^{(\text{sinBOC})}[n] = \! \sum_{m=-\infty}^{+\infty} \! \sum_{l=1}^{4092}C_{E1Cp}\Big[ l \Big] \! \cdot \! p[n \! - \! mT_{c,E1Cs} \! - \! lT_{c,E1Cp}] \cdot sc_A[n]~.
\end{equation} $$

The simpler sinBOC options are chosen by default. CBOC versions can be set by
`Acquisition_1B.cboc=true`. Next figure plots the shape of the cross-correlation
function for those waveforms:

<a name="fig:Rxd"></a>![Rxd]({{ "/assets/images/rxd.png" | relative_url }}){:width="600px"}{: .align-center .invert-colors}
_Normalized $$ \left|R_{xd}\left(\check{f}_D = f_D, \tau \right) \right|^2 $$ for different sampling rates and local reference waveforms[^Fernandez12]._
{: style="text-align: center;"}



This implementation accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `GNSS-SDR.internal_fs_sps` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
| `GNSS-SDR.use_acquisition_resampler` | [`true`, `false`]: If set to `true`, the Acquisition block makes use of the minimum possible sample rate during acquisition by setting a resampler at its input. This allows reducing the FFT size when using high data rates at `GNSS-SDR.internal_fs_sps`. All the required setup is configured automatically. It defaults to `false`. | Optional |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `Galileo_E1_PCPS_Ambiguous_Acquisition` | Mandatory |
| `item_type` | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 8-bit integer. C++ name: lv_8sc_t (custom definition of std::complex<int8_t>)">`cbyte`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `cboc` | [`true`, `false`]: If set to `true` the algorithm uses the CBOC waveform , if set to `false` a simpler sinBOC waveform is used. It defaults to `false`. | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. Should be a multiple of 4 ms. It defaults to 4 ms. | Optional |
| `acquire_pilot` | [`true`, `false`]: If set to `true`, sets the receiver to acquire the E1C pilot component. It defaults to `false` (that is, the receiver is set to acquire the E1B data component). | Optional |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of non-coherent dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `blocking` | [`true`, `false`]: If set to `false`, the acquisition workload is executed in a separate thread, outside the GNU Radio scheduler that manages the flow graph, and the block skips over samples that arrive while the processing thread is busy. This is especially useful in real-time operation using radio frequency front-ends, overcoming the processing bottleneck for medium and high sampling rates. However, this breaks the determinism provided by the GNU Radio scheduler, and different processing results can be obtained in different machines. Do not use this option for file processing. It defaults to `true`. | Optional |
| `make_two_steps` | [`true`, `false`]: If set to `true`, an acquisition refinement stage is performed after a signal is declared present. This allows providing an updated, refined Doppler estimation to the Tracking block. It defaults to `false`. | Optional |
| `second_nbins` | If `make_two_steps` is set to `true`, this parameter sets the number of bins done in the acquisition refinement stage. It defaults to 4. | Optional |
| `second_doppler_step` | If `make_two_steps` is set to `true`, this parameter sets the Doppler step applied in the acquisition refinement stage, in Hz. It defaults to 125 Hz. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. This parameter accepts either a relative or an absolute path; if there are non-existing specified folders, they will be created. It defaults to `./acquisition`, so files with name `./acquisition_E_1B_ch_N_K_sat_P.mat` (where `N` is the channel number defined by `dump_channel`, `K` is the dump number, and `P` is the targeted satellite's PRN number) will be generated. | Optional |
| `dump_channel` | If `dump` is set to `true`, channel number from which internal data will be stored. It defaults to 0. | Optional |
|--------------

  _Acquisition implementation:_ **`Galileo_E1_PCPS_Ambiguous_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION CONFIG FOR GALILEO E1 CHANNELS ############
Acquisition_1B.implementation=Galileo_E1_PCPS_Ambiguous_Acquisition
Acquisition_1B.pfa=0.01
Acquisition_1B.doppler_max=5000
Acquisition_1B.doppler_step=250
Acquisition_1B.coherent_integration_time_ms=4
Acquisition_1B.max_dwells=1
```

### Implementation: `Galileo_E1_PCPS_Tong_Ambiguous_Acquisition`

The Tong detector[^Tong73] is a sequential variable dwell time detector with a
reasonable computation burden that proves good for acquiring signals with low $$
C/N_0 $$ levels.  During the signal search, the up/down counter $$ \mathcal{K} $$
is incremented by one if the correlation peak value exceeds the threshold,
otherwise it is decremented by one. If the counter has reached the maximum count
value $$ A $$, the signal is declared _&lsquo;present&rsquo;_ and the search is
terminated. Similarly, if the counter contents reach zero, the signal is
declared _&lsquo;absent&rsquo;_ and the search is terminated. So that the Tong
detector is not trapped into an extended dwell in the same cell, under certain
poor signal conditions, another counter ($$ \mathcal{K}_{max} $$) sets the limit
on the maximum number of dwells.

This implementation accepts the following parameters:

|----------
| **Global Parameter** | **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `GNSS-SDR.internal_fs_sps` | Input sample rate to the processing channels, in samples per second. | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `Galileo_E1_PCPS_Tong_Ambiguous_Acquisition` | Mandatory |
| `item_type` | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    | Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `coherent_integration_time_ms` | Set the integration time $$ T_{int} $$, in ms. Should be a multiple of 4 ms. It defaults to 4 ms. | Optional |
| `tong_init_val` | Initial value of the Tong counter $$ \mathcal{K} $$. It defaults to 1. | Optional |
| `tong_max_val` | Count value $$ A $$ that, if reached by counter $$ \mathcal{K} $$, declares a signal as present. It defaults to 2. | Optional |
| `tong_max_dwells` | Maximum number of dwells in a search $$ \mathcal{K}_{max} $$. It defaults to `tong_max_val` $$ +1 $$. | Optional |
| `repeat_satellite` | [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `dump` | [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` | If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
|--------------

  _Acquisition implementation:_ **`Galileo_E1_PCPS_Tong_Ambiguous_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION CONFIG FOR GALILEO E1 CHANNELS ############
Acquisition_1B.implementation=Galileo_E1_PCPS_Tong_Ambiguous_Acquisition
Acquisition_1B.pfa=0.0001
Acquisition_1B.doppler_max=10000
Acquisition_1B.doppler_step=250
Acquisition_1B.tong_init_val=2
Acquisition_1B.tong_max_val=10
Acquisition_1B.tong_max_dwells=20
```


## Glonass L1 C/A signal acquisition

### Implementation: `GLONASS_L1_CA_PCPS_Acquisition`

This implementation accepts the following parameters:

|----------
| **Global Parameter** | **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `GNSS-SDR.internal_fs_sps` | Input sample rate to the processing channels, in samples per second. | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `GLONASS_L1_CA_PCPS_Acquisition` | Mandatory |
| `item_type` | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 8-bit integer. C++ name: lv_8sc_t (custom definition of std::complex<int8_t>)">`cbyte`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. It defaults to 1 ms. | Optional |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of non-coherent dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `blocking` | [`true`, `false`]: If set to `false`, the acquisition workload is executed in a separate thread, outside the GNU Radio scheduler that manages the flow graph, and the block skips over samples that arrive while the processing thread is busy. This is especially useful in real-time operation using radio frequency front-ends, overcoming the processing bottleneck for medium and high sampling rates. However, this breaks the determinism provided by the GNU Radio scheduler, and different processing results can be obtained in different machines. Do not use this option for file processing. It defaults to `true`. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
| `dump_channel` |  If `dump` is set to `true`, channel number from which internal data will be stored. It defaults to 0. | Optional |
|--------------

  _Acquisition implementation:_ **`GLONASS_L1_CA_PCPS_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION CONFIG FOR GLONASS L1 CHANNELS ############
Acquisition_1G.implementation=GLONASS_L1_CA_PCPS_Acquisition
Acquisition_1G.doppler_max=8000
Acquisition_1G.doppler_step=250
Acquisition_1G.pfa=0.0001
```


## GPS L2CM signal acquisition

### Implementation: `GPS_L2_M_PCPS_Acquisition`

This implementation accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `GNSS-SDR.internal_fs_sps` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
| `GNSS-SDR.use_acquisition_resampler` | [`true`, `false`]: If set to `true`, the Acquisition block makes use of the minimum possible sample rate during acquisition by setting a resampler at its input. This allows reducing the FFT size when using high data rates at `GNSS-SDR.internal_fs_sps`. All the required setup is configured automatically. It defaults to `false`. | Optional |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `GPS_L2_M_PCPS_Acquisition` | Mandatory |
| `item_type` | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 8-bit integer. C++ name: lv_8sc_t (custom definition of std::complex<int8_t>)">`cbyte`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    | Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. It defaults to 20 ms. | Optional |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of non-coherent dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `blocking` | [`true`, `false`]: If set to `false`, the acquisition workload is executed in a separate thread, outside the GNU Radio scheduler that manages the flow graph, and the block skips over samples that arrive while the processing thread is busy. This is especially useful in real-time operation using radio frequency front-ends, overcoming the processing bottleneck for medium and high sampling rates. However, this breaks the determinism provided by the GNU Radio scheduler, and different processing results can be obtained in different machines. Do not use this option for file processing. It defaults to `true`. | Optional |
| `make_two_steps` | [`true`, `false`]: If set to `true`, an acquisition refinement stage is performed after a signal is declared present. This allows providing an updated, refined Doppler estimation to the Tracking block. It defaults to `false`. | Optional |
| `second_nbins` | If `make_two_steps` is set to `true`, this parameter sets the number of bins done in the acquisition refinement stage. It defaults to 4. | Optional |
| `second_doppler_step` | If `make_two_steps` is set to `true`, this parameter sets the Doppler step applied in the acquisition refinement stage, in Hz. It defaults to 125 Hz. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. This parameter accepts either a relative or an absolute path; if there are non-existing specified folders, they will be created. It defaults to `./acquisition`, so files with name `./acquisition_G_2S_ch_N_K_sat_P.mat` (where `N` is the channel number defined by `dump_channel`, `K` is the dump number, and `P` is the targeted satellite's PRN number) will be generated. | Optional |
| `dump_channel` | If `dump` is set to `true`, channel number from which internal data will be stored. It defaults to 0. | Optional |
|--------------

  _Acquisition implementation:_ **`GPS_L2_M_PCPS_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION CONFIG FOR GPS L2C CHANNELS ############
Acquisition_2S.implementation=GPS_L2_M_PCPS_Acquisition
Acquisition_2S.item_type=cshort
Acquisition_2S.pfa=0.01
Acquisition_2S.doppler_max=6000
Acquisition_2S.doppler_step=60
Acquisition_2S.coherent_integration_time_ms=20
Acquisition_2S.max_dwells=2
```

## Glonass L2 C/A signal acquisition

### Implementation: `GLONASS_L2_CA_PCPS_Acquisition`


This implementation accepts the following parameters:

|----------
| **Global Parameter** | **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `GNSS-SDR.internal_fs_sps` | Input sample rate to the processing channels, in samples per second. | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `GLONASS_L2_CA_PCPS_Acquisition` | Mandatory |
| `item_type` | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 8-bit integer. C++ name: lv_8sc_t (custom definition of std::complex<int8_t>)">`cbyte`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. It defaults to 1 ms. | Optional |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of non-coherent dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `blocking` | [`true`, `false`]: If set to `false`, the acquisition workload is executed in a separate thread, outside the GNU Radio scheduler that manages the flow graph, and the block skips over samples that arrive while the processing thread is busy. This is especially useful in real-time operation using radio frequency front-ends, overcoming the processing bottleneck for medium and high sampling rates. However, this breaks the determinism provided by the GNU Radio scheduler, and different processing results can be obtained in different machines. Do not use this option for file processing. It defaults to `true`. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
| `dump_channel` |  If `dump` is set to `true`, channel number from which internal data will be stored. It defaults to 0. | Optional |
|--------------

  _Acquisition implementation:_ **`GLONASS_L2_CA_PCPS_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION CONFIG FOR GLONASS L2 CHANNELS ############
Acquisition_2G.implementation=GLONASS_L2_CA_PCPS_Acquisition
Acquisition_2G.doppler_max=8000
Acquisition_2G.doppler_step=250
Acquisition_2G.pfa=0.0001
```

## Galileo E6 signal acquisition

### Implementation: `Galileo_E6_PCPS_Acquisition`

**NOTE:** This block implementation is only available from the `next` branch of
the upstream repository. It will be available in the next stable release.
{: .notice--warning}

This implementation accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `GNSS-SDR.internal_fs_sps` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
| `GNSS-SDR.use_acquisition_resampler` | [`true`, `false`]: If set to `true`, the Acquisition block makes use of the minimum possible sample rate during acquisition by setting a resampler at its input. This allows reducing the FFT size when using high data rates at `GNSS-SDR.internal_fs_sps`. All the required setup is configured automatically. It defaults to `false`. | Optional |
|--------------

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `Galileo_E6_PCPS_Acquisition` | Mandatory |
| `item_type` | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the sample data type expected at the block input. Only <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr> is defined in this version. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to $$ 5000 $$ Hz. | Optional |
| `doppler_min`  | Minimum Doppler value in the search grid, in Hz. It defaults to $$ -5000 $$ Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. It defaults to 1 ms. | Optional |
| `max_dwells` |  Set the maximum number of non-coherent dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
|--------------

  _Acquisition implementation:_ **`Galileo_E6_PCPS_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION CONFIG FOR GALILEO E6 CHANNELS ############
Acquisition_E6.implementation=Galileo_E6_PCPS_Acquisition
Acquisition_E6.item_type=gr_complex
Acquisition_E6.pfa=0.001;
Acquisition_E6.blocking=true
Acquisition_E6.doppler_max=5000
Acquisition_E6.doppler_step=250
Acquisition_E6.dump=false
Acquisition_E6.dump_filename=./acq_e6_dump
Acquisition_E6.dump_channel=0
```

## GPS L5 signal acquisition

### Implementation: `GPS_L5i_PCPS_Acquisition`

This implementation accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `GNSS-SDR.internal_fs_sps` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
| `GNSS-SDR.use_acquisition_resampler` | [`true`, `false`]: If set to `true`, the Acquisition block makes use of the minimum possible sample rate during acquisition by setting a resampler at its input. This allows reducing the FFT size when using high data rates at `GNSS-SDR.internal_fs_sps`. All the required setup is configured automatically. It defaults to `false`. | Optional |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `GPS_L5i_PCPS_Acquisition` | Mandatory |
| `item_type` | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 8-bit integer. C++ name: lv_8sc_t (custom definition of std::complex<int8_t>)">`cbyte`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of non-coherent dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `blocking` | [`true`, `false`]: If set to `false`, the acquisition workload is executed in a separate thread, outside the GNU Radio scheduler that manages the flow graph, and the block skips over samples that arrive while the processing thread is busy. This is especially useful in real-time operation using radio frequency front-ends, overcoming the processing bottleneck for medium and high sampling rates. However, this breaks the determinism provided by the GNU Radio scheduler, and different processing results can be obtained in different machines. Do not use this option for file processing. It defaults to `true`. | Optional |
| `make_two_steps` | [`true`, `false`]: If set to `true`, an acquisition refinement stage is performed after a signal is declared present. This allows providing an updated, refined Doppler estimation to the Tracking block. It defaults to `false`. | Optional |
| `second_nbins` | If `make_two_steps` is set to `true`, this parameter sets the number of bins done in the acquisition refinement stage. It defaults to 4. | Optional |
| `second_doppler_step` | If `make_two_steps` is set to `true`, this parameter sets the Doppler step applied in the acquisition refinement stage, in Hz. It defaults to 125 Hz. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` | If `dump` is set to `true`, base name of the file(s) in which internal data will be stored. This parameter accepts either a relative or an absolute path; if there are non-existing specified folders, they will be created. It defaults to `./acquisition`, so files with name `./acquisition_G_L5_ch_N_K_sat_P.mat` (where `N` is the channel number defined by `dump_channel`, `K` is the dump number, and `P` is the targeted satellite's PRN number) will be generated.  | Optional |
| `dump_channel` |  If `dump` is set to `true`, channel number from which internal data will be stored. It defaults to 0. | Optional |
|--------------

  _Acquisition implementation:_ **`GPS_L5i_PCPS_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION CONFIG FOR GPS L5 CHANNELS ############
Acquisition_L5.implementation=GPS_L5i_PCPS_Acquisition
Acquisition_L5.item_type=cshort
Acquisition_L5.pfa=0.01
Acquisition_L5.doppler_max=6000
Acquisition_L5.doppler_step=60
Acquisition_L5.coherent_integration_time_ms=4
Acquisition_L5.max_dwells=1
```


## Galileo E5a signal acquisition

### Implementation: `Galileo_E5a_Pcps_Acquisition`

This implementation accepts the following parameters:


|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `GNSS-SDR.internal_fs_sps` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
| `GNSS-SDR.use_acquisition_resampler` | [`true`, `false`]: If set to `true`, the Acquisition block makes use of the minimum possible sample rate during acquisition by setting a resampler at its input. This allows reducing the FFT size when using high data rates at `GNSS-SDR.internal_fs_sps`. All the required setup is configured automatically. It defaults to `false`. | Optional |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `Galileo_E5a_Pcps_Acquisition` | Mandatory |
| `item_type` | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. It defaults to 1 ms. | Optional |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of non-coherent dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `blocking` | [`true`, `false`]: If set to `false`, the acquisition workload is executed in a separate thread, outside the GNU Radio scheduler that manages the flow graph, and the block skips over samples that arrive while the processing thread is busy. This is especially useful in real-time operation using radio frequency front-ends, overcoming the processing bottleneck for medium and high sampling rates. However, this breaks the determinism provided by the GNU Radio scheduler, and different processing results can be obtained in different machines. Do not use this option for file processing. It defaults to `true`. | Optional |
| `acquire_pilot` |  [`true`, `false`]: If set to `true`, it enables the Acquisition of the pilot Galileo E5a signal (Q component). It defaults to `false`. | Optional |
| `acquire_iq` |  [`true`, `false`]: If set to `true`, it enables the Acquisition of both, data (I) and pilot (Q) components of the Galileo E5a signal and overrides `acquire_pilot` to `false`. It is suitable for increasing the acquisition sensitivity of the receiver. It defaults to `false`. | Optional |
| `make_two_steps` | [`true`, `false`]: If set to `true`, an acquisition refinement stage is performed after a signal is declared present. This allows providing an updated, refined Doppler estimation to the Tracking block. It defaults to `false`. | Optional |
| `second_nbins` | If `make_two_steps` is set to `true`, this parameter sets the number of bins done in the acquisition refinement stage. It defaults to 4. | Optional |
| `second_doppler_step` | If `make_two_steps` is set to `true`, this parameter sets the Doppler step applied in the acquisition refinement stage, in Hz. It defaults to 125 Hz. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, base name of the file(s) in which internal data will be stored. This parameter accepts either a relative or an absolute path; if there are non-existing specified folders, they will be created. It defaults to `./acquisition`, so files with name `./acquisition_E_5X_ch_N_K_sat_P.mat` (where `N` is the channel number defined by `dump_channel`, `K` is the dump number, and `P` is the targeted satellite's PRN number) will be generated. | Optional |
| `dump_channel` |  If `dump` is set to `true`, channel number from which internal data will be stored. It defaults to 0. | Optional |
|--------------

  _Acquisition implementation:_ **`Galileo_E5a_Pcps_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION CONFIG FOR GALILEO E5a CHANNELS ############
Acquisition_5X.implementation=Galileo_E5a_Pcps_Acquisition
Acquisition_5X.doppler_max=8000
Acquisition_5X.doppler_step=250
Acquisition_5X.pfa=0.01
Acquisition_5X.coherent_integration_time_ms=1
Acquisition_5X.max_dwells=1
```

### Implementation: `Galileo_E5a_Noncoherent_IQ_Acquisition_CAF`

This implementation accepts the following parameters:


|----------
| **Global Parameter** | **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `GNSS-SDR.internal_fs_sps` | Input sample rate to the processing channels, in samples per second. | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `Galileo_E5a_Noncoherent_IQ_Acquisition_CAF` | Mandatory |
| `item_type` | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `CAF_window_hz` | Resolves Doppler ambiguity by averaging the specified bandwidth (in Hz) in the winner code delay. If set to $$ 0 $$, the CAF filter is deactivated. Recommended value: $$ 3000 $$ Hz. It defaults to 0 Hz. | Optional |
| `Zero_padding` |  If set to a $$ 1 $$, it avoids power loss and doppler ambiguity in bit transitions by correlating one code with twice the input data length, ensuring that at least one full code is present without transitions. It defaults to $$ 0 $$ (_i.e._, deactivated). | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. Should be a 3 ms or less. It defaults to 1 ms. | Optional |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of non-coherent dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./acquisition.dat` | Optional |
|--------------

  _Acquisition implementation:_ **`Galileo_E5a_Noncoherent_IQ_Acquisition_CAF`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION CONFIG FOR GALILEO E5a CHANNELS ############
Acquisition_5X.implementation=Galileo_E5a_Noncoherent_IQ_Acquisition_CAF
Acquisition_5X.pfa=0.01
Acquisition_5X.doppler_max=10000
Acquisition_5X.doppler_step=250
```

## Galileo E5b signal acquisition

### Implementation: `Galileo_E5b_Pcps_Acquisition`

This implementation accepts the following parameters:


|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `GNSS-SDR.internal_fs_sps` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
| `GNSS-SDR.use_acquisition_resampler` | [`true`, `false`]: If set to `true`, the Acquisition block makes use of the minimum possible sample rate during acquisition by setting a resampler at its input. This allows reducing the FFT size when using high data rates at `GNSS-SDR.internal_fs_sps`. All the required setup is configured automatically. It defaults to `false`. | Optional |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `implementation` | `Galileo_E5b_Pcps_Acquisition` | Mandatory |
| `item_type` | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `doppler_max`  | Maximum Doppler value in the search grid, in Hz. It defaults to 5000 Hz. | Optional |
| `doppler_step` | Frequency step in the search grid, in Hz. It defaults to 500 Hz. | Optional |
| `threshold`    |  Decision threshold $$ \gamma $$ from which a signal will be considered present. It defaults to $$ 0.0 $$ (_i.e._, all signals are declared present), | Optional |
| `pfa` |  If defined, it supersedes the `threshold` value and computes a new threshold $$ \gamma_{pfa} $$ based on the Probability of False Alarm. It defaults to $$ 0.0 $$ (_i.e._, not set). | Optional |
| `coherent_integration_time_ms` |  Set the integration time $$ T_{int} $$, in ms. It defaults to 1 ms. | Optional |
| `bit_transition_flag` | [`true`, `false`]: If set to `true`, it takes into account the possible presence of a bit transition, so the effective integration time is doubled. When set, it invalidates the value of `max_dwells`. It defaults to `false`. | Optional |
| `max_dwells` |  Set the maximum number of non-coherent dwells to declare a signal present. It defaults to 1. | Optional |
| `repeat_satellite` |  [`true`, `false`]: If set to `true`, the block will search again for the same satellite once its presence has been discarded. Useful for testing. It defaults to `false`. | Optional |
| `blocking` | [`true`, `false`]: If set to `false`, the acquisition workload is executed in a separate thread, outside the GNU Radio scheduler that manages the flow graph, and the block skips over samples that arrive while the processing thread is busy. This is especially useful in real-time operation using radio frequency front-ends, overcoming the processing bottleneck for medium and high sampling rates. However, this breaks the determinism provided by the GNU Radio scheduler, and different processing results can be obtained in different machines. Do not use this option for file processing. It defaults to `true`. | Optional |
| `acquire_pilot` |  [`true`, `false`]: If set to `true`, it enables the Acquisition of the pilot Galileo E5b signal (Q component). It defaults to `false`. | Optional |
| `acquire_iq` |  [`true`, `false`]: If set to `true`, it enables the Acquisition of both, data (I) and pilot (Q) components of the Galileo E5b signal and overrides `acquire_pilot` to `false`. It is suitable for increasing the acquisition sensitivity of the receiver. It defaults to `false`. | Optional |
| `make_two_steps` | [`true`, `false`]: If set to `true`, an acquisition refinement stage is performed after a signal is declared present. This allows providing an updated, refined Doppler estimation to the Tracking block. It defaults to `false`. | Optional |
| `second_nbins` | If `make_two_steps` is set to `true`, this parameter sets the number of bins done in the acquisition refinement stage. It defaults to 4. | Optional |
| `second_doppler_step` | If `make_two_steps` is set to `true`, this parameter sets the Doppler step applied in the acquisition refinement stage, in Hz. It defaults to 125 Hz. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Acquisition internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, base name of the file(s) in which internal data will be stored. This parameter accepts either a relative or an absolute path; if there are non-existing specified folders, they will be created. It defaults to `./acquisition`, so files with name `./acquisition_E_7X_ch_N_K_sat_P.mat` (where `N` is the channel number defined by `dump_channel`, `K` is the dump number, and `P` is the targeted satellite's PRN number) will be generated. | Optional |
| `dump_channel` |  If `dump` is set to `true`, channel number from which internal data will be stored. It defaults to 0. | Optional |
|--------------

  _Acquisition implementation:_ **`Galileo_E5b_Pcps_Acquisition`**.
  {: style="text-align: center;"}

Example:

```ini
;######### ACQUISITION CONFIG FOR GALILEO E5a CHANNELS ############
Acquisition_7X.implementation=Galileo_E5b_PCPS_Acquisition
Acquisition_7X.item_type=gr_complex
Acquisition_7X.pfa=0.01
Acquisition_7X.blocking=true
Acquisition_7X.doppler_max=5000
Acquisition_7X.doppler_step=250
Acquisition_7X.max_dwells=1
Acquisition_7X.dump=false
Acquisition_7X.dump_filename=./acq_dump_x5
```

## Plotting results with MATLAB/Octave

Some Acquisition block implementations are able to dump intermediate results of
the channel indicated by the `dump_channel` parameter in [MATLAB Level 5
MAT-file
v7.3](https://www.loc.gov/preservation/digital/formats/fdd/fdd000440.shtml) file
format (`.mat` files), which can be opened in MATLAB/Octave.

The list of output variables contained in each `.mat` file is the following:

  * `acq_delay_samples`: Coarse estimation of time delay, in number of samples from the start of the pseudorandom code.
  * `acq_doppler_hz`: Coarse estimation of Doppler shift, in Hz.
  * `acq_grid`: Acquisition search grid.
  * `d_positive_acq`: `1` if there has been a positive acquisition, `0` for no detection.
  * `doppler_max`: Maximum Doppler shift in the search grid.
  * `doppler_step`: Doppler step in the search grid.
  * `input_power`: Input signal power.
  * `num_dwells`: Number of dwells performed in non-coherent acquisition.
  * `PRN`: Satellite ID.
  * `sample_counter`: Sample counter from receiver's start.
  * `test_statistic`: Result of the test statistic.
  * `threshold`: Threshold above which a signal is declared present.


Example:

Assuming that you are processing GPS L1 C/A signals, and you have included the
following lines in your configuration file:

```ini
Acquisition_1C.implementation=GPS_L1_CA_PCPS_Acquisition
;... (other parameters) ...
Acquisition_1C.dump=true
Acquisition_1C.dump_filename=acq_dump
Acquisition_1C.dump_channel=0
```

Then, after the processing, you will get `.mat` files storing the results
obtained from the Acquisition block corresponding to channel 0.

The acquisition grid can be plotted from MATLAB or Octave as:

```matlab
load('./acq_dump_G_1C_chan0_1_sat1.mat')
f = -doppler_max:doppler_step:(doppler_max-doppler_step);
tau = linspace(0, 1023, size(acq_grid, 1));
surf(f, tau, acq_grid); xlabel('Doppler [Hz]'); ylabel('Delay [chips]');
```

You should see something like:

![Positive acquisition](/assets/images/capture_matlab_acq_positive.png){: .align-center}
_Positive acquisition._
{: style="text-align: center;"}

or

![Negative acquisition](/assets/images/capture_matlab_acq_negative.png){: .align-center}
_Negative acquisition._
{: style="text-align: center;"}


&nbsp;<br/>

-------


## References

[^Borre06]: K. Borre, D. M. Akos, N. Bertelsen, P. Rinder, S. H. Jensen, _A Software-Defined GPS and Galileo Receiver. A Single-Frequency Approach_, 1st edition, Boston: Birkh&auml;user, November 2006.

[^Fernandez12]: C. Fern&aacute;ndez-Prades, J. Arribas, L. Esteve-Elfau, D. Pubill, P. Closas, [An Open Source Galileo E1 Software Receiver](https://www.researchgate.net/publication/233859838_An_Open_Source_Galileo_E1_Software_Receiver), in Proceedings of the 6th ESA Workshop on Satellite Navigation Technologies (NAVITEC 2012), 5-7 December 2012, ESTEC, Noordwijk, The Netherlands.

[^Lohan11]: J. Zhang, E. S. Lohan, _Galileo E1 and E5a Link-Level Performances in Single and Multipath Channels_. In G. Giambene, C. Sacchi, Eds., Personal Satellite Services, Third International ICST Conference PSATS 2011, M&aacute;laga, Spain, February 2011.

[^Tong73]: P. S. Tong, _A Suboptimum Synchronization Procedure for Pseudo Noise Communication Systems_, in Proc. of National Telecommunications Conference, pp. 26D1-26D5. Atlanta, GA, Nov. 1973.

[^GalileoICD]: [European GNSS (Galileo) Open Service Signal In Space Interface Control Document](https://www.gsc-europa.eu/sites/default/files/sites/all/files/Galileo_OS_SIS_ICD_v2.1.pdf), Issue 2.1, Nov. 2023.

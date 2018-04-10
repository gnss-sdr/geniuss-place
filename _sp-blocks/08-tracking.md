---
title: "Tracking"
permalink: /docs/sp-blocks/tracking/
excerpt: "Documentation for the Tracking block."
sidebar:
  nav: "sp-block"
toc: true
last_modified_at: 2018-04-10T15:54:02-04:00
---

A generic GNSS signal defined by its complex baseband equivalent, $$ s_{T}(t) $$, the digital signal at the input of a _Tracking_ block can be written as:

$$ \begin{equation} \label{xin} x_\text{IN}[k] = A(t)\tilde{s}_{T}(t-\tau(t))e^{j \left( 2\pi f_D(t) t + \phi(t) \right) } \Bigr \rvert_{t=kT_s} + n(t) \Bigr \rvert_{t=kT_s} \end{equation} $$

where $$ A(t) $$ is the signal amplitude, $$ \tilde{s}_{T}(t) $$ is a filtered version of $$ s_T(t) $$, $$ \tau(t) $$ is a time-varying code delay, $$ f_D(t) $$ is a time-varying Doppler shift, $$ \phi(t) $$ is a time-varying carrier phase shift, $$ n(t) $$ is a term modeling random noise and $$ T_s $$ is the sampling period.

The role of a _Tracking_ block is to follow the evolution of the
signal synchronization parameters: code phase $$ \tau(t) $$, Doppler shift $$ f_D(t) $$ and carrier phase $$ \phi(t) $$.
{: .notice--info}

According to the Maximum Likelihood (ML) approach[^Proakis], obtaining
the optimum estimators implies the maximization of the correlation of
the incoming signal with its _matched filter_.  The ML estimates of $$ f_D $$ and $$ \tau $$ can be obtained by maximizing the function

$$ \begin{equation}
\hat{f}_{D_{ML}}, \hat{\tau}_{ML} = \arg \max_{f_D,\tau} \left\{ \left| \hat{R}_{xd}(f_D,\tau)\right|^2\right\}~, \end{equation}
$$

where

$$ \begin{equation}
\hat{R}_{xd}(f_D,\tau)=\frac{1}{K}\sum_{k=0}^{K-1}x_{\text{IN}}[k]d[kT_s-\tau]e^{-j 2 \pi f_D kT_s}~, \end{equation}
$$

with $$ K $$ being the number of samples in an integration period, and $$ d[k] $$ is a locally generated reference.

This is usually achieved with closed-loop structures designed to minimize the difference between
the code phase, carrier phase and frequency of the incoming signal with
respect to the locally-generated replica $$ d[k] $$.

In the case of code phase tracking, the cost function is driven to the
maximum using feedback loops that employ the derivative
$$ \frac{dR_{xd}(\tau)}{d\tau} $$ zero-crossing as a timing error detector.
This is the case of the Delay Lock Loop (DLL) architecture and its wide
range of variants, where the receiver computes three samples of $$ R_{xd} $$, usually referred to as *Early*
$$ E=R_{xd}(\hat{\tau}+\epsilon) $$, *Prompt* $$ P=R_{xd}(\hat{\tau}) $$ and
*Late* $$ L=R_{xd}(\hat{\tau}-\epsilon) $$, with $$ \epsilon $$ ranging from
$$ 0.1T_c $$ to $$ 0.5T_c $$, and then computes a timing error with some
combination of those samples, known as _discriminator_ functions. The result is low-pass filtered and reinjected back to the matched filter, as shown in the figure below:

![VOLK_GNSSDR example](https://raw.githubusercontent.com/gnss-sdr/gnss-sdr/next/src/algorithms/libs/volk_gnsssdr_module/volk_gnsssdr/docs/images/VOLK_GNSSSDR_Usage_Example.png)
_Typical diagram of a tracking block. Colored boxes indicate functions implemented in the [VOLK_GNSSSDR](https://github.com/gnss-sdr/gnss-sdr/tree/master/src/algorithms/libs/volk_gnsssdr_module/volk_gnsssdr) library._
{: style="text-align: center;"}

GNSS-SDR's _Tracking_ implementations make heavy use of [VOLK_GNSSSDR](https://github.com/gnss-sdr/gnss-sdr/tree/master/src/algorithms/libs/volk_gnsssdr_module/volk_gnsssdr), an extension module of the original [VOLK](http://libvolk.org/) library which contains some functions that are specially useful in the context of a GNSS receiver (some examples in the figure above).

The [VOLK_GNSSSDR](https://github.com/gnss-sdr/gnss-sdr/tree/master/src/algorithms/libs/volk_gnsssdr_module/volk_gnsssdr) library addresses [**Efficiency**]({{ "/design-forces/efficiency/" | relative_url }}) and [**Portability**]({{ "/design-forces/portability/" | relative_url }}) at the same time, by providing several implementations of the same functions in different SIMD technologies, benchmarking them and selecting the fastest in your machine at runtime.
{: .notice--success}


_Tracking_ blocks are continually receiving the data stream
$$ x_\text{IN} $$, but they do nothing until receiving a "positive
acquisition" message from the control plane, along with the coarse
estimations $$ \hat{\tau}_{acq} $$ and $$ \hat{f}_{D_{acq}} $$. Then, the role of the _tracking_ blocks
is to refine such estimations and track their changes along time.
As shown in the figure below, more refinements can be made once the navigation message bits (in the case of tracking a _data_ component of a GNSS signal) or the secondary spreading code (in the case of tracking a _pilot_ component of a GNSS signal) is synchronized, for instance by extending the integration time or by narrowing the tracking loops.


![Tracking State Machine]({{ "/assets/images/tracking_state_machine.png" | relative_url }})
_Internal state machine of a Tracking block._
{: style="text-align: center;"}

In addition to track the synchronization parameters, the _Tracking_ blocks
must also implement code and carrier lock detectors, providing
indicators of the tracking performance, as well as an estimation of the carrier-to-noise-density ratio, $$ C/N_0 $$.

### Carrier-to-noise-density ratio

The carrier-to-noise-density ratio, expressed as $$ C/N_0 =\frac{C}{\frac{N}{BW}}$$ (where $$ C $$ is the carrier power, $$ N $$ is the noise power and $$ BW $$ is the bandwidth of observation) refers to the ratio of the carrier power and the noise power _per unit of bandwidth_, so it is expressed in decibel-Hertz (dB-Hz). The term $$ \frac{C}{N} $$ is known as the signal-to-noise power ratio (SNR).

Considering that the observation bandwidth is the inverse of the coherent integration time, $$ T_{int} $$, we can write:

$$ \begin{equation}
C/N_0 = \frac{SNR}{T_{int}}
\end{equation} $$

The SNR estimation can be computed as:

$$ \begin{equation}
\widehat{SNR}=\frac{\hat{C}}{\hat{N}}=\frac{\hat{C}}{\hat{C}+\hat{N}-\hat{C}},
\end{equation} $$

where:
 * $$ \displaystyle \hat{C} = \left(\frac{1}{M}\sum^{M-1}_{m=0}\|\Re(P(m))\|\right)^2 $$ is the estimation of the signal power,
 * $$ \displaystyle \hat{C}+\hat{N}=\frac{1}{M}\sum^{M-1}_{m=0}\|P(m)\|^2 $$ is the estimation of the total power,
 * $$ \|\cdot\| $$ is the absolute value (also known as norm, modulus, or magnitude),
 * $$ \Re(\cdot) $$ stands for the real part of the value, and
 * $$ P(m) $$ is the prompt correlator output for the integration period $$ m $$.

Then, the estimated $$ C/N_0 $$ value in dB-Hz can be written as:

$$ \begin{equation}
\widehat{C/N}_{0_{dB-Hz}} = 10\log_{10}(\widehat{SNR})-10\log_{10}(T_{int})
\end{equation} $$

The $$ C/N_0 $$ value provides an indication of the signal quality that is independent of the acquisition and tracking algorithms used by a receiver, and it remains constant through the different processing stages of the receiver.

The number of correlation outputs to perform the estimation defaults to $$ M = 20 $$. This value can be changed by using the command line flag  `-cn0_samples` when running the executable:

```bash
$ gnss-sdr -cn0_samples=100 -c=./configuration_file.conf
```


### Code lock detector

The lock detector for the code tracking loop is defined as:

$$ \begin{equation}
\widehat{C/N}_{0_{dB-Hz}} \overset{\text{lock}}{\underset{\text{no lock}}{\gtrless}} \gamma_{code}
\end{equation} $$

If the estimated $$ C/N_{0_{dB-Hz}} $$ is above a certain threshold, the tracking loop is declared locked.

The threshold $$ \gamma_{code} $$ is set by default to 25 dB-Hz. This value can be changed by using the command line flag  `-cn0_min` when running the executable:

```bash
$ gnss-sdr -cn0_min=22 -c=./configuration_file.conf
```

### Carrier lock detector

The lock detector test for the carrier tracking loop is defined as:

$$ \begin{equation}
\cos(2\widehat{\Delta \phi}) \overset{\text{lock}}{\underset{\text{no lock}}{\gtrless}} \gamma_{carrier}
\end{equation} $$

where $$ \Delta \phi = \phi - \hat{\phi} $$ is the carrier phase error. If the estimate of the cosine of twice the carrier phase error is above a certain threshold, the loop is declared in lock.

The estimate of the cosine of twice the carrier phase error is computed as:

$$ \begin{equation}
\cos(2\widehat{\Delta \phi})=\frac{NBD}{NBP},
\end{equation} $$

where:
  * $$ \displaystyle NBD=\left(\sum^{M-1}_{m=0}\Im(P(m))\right)^2-\left(\sum^{M-1}_{i=0}\Re(P(m))\right)^2 $$,
  * $$ \displaystyle NBP=\left(\sum^{M-1}_{m=0}\Im(P(m))\right)^2+\left(\sum^{M-1}_{i=0}\Re(P(m))\right)^2 $$,
  * $$ \Re(\cdot) $$ and $$ \Im(\cdot) $$ stand for the real and imaginary parts of the value, respectively, and
  * $$ P(m) $$ is the prompt correlator output for the integration period $$ m $$.

The threshold $$ \gamma_{carrier} $$ is set by default to 0.85 radians (corresponding to an error of approx. 31 degrees). This value can be changed by using the command line flag `-carrier_lock_th` when running the executable:

```bash
$ gnss-sdr -carrier_lock_th=0.75 -c=./configuration_file.conf
```

### Number of failures allowed before declaring a loss of lock

The maximum number of lock failures before dropping a satellite is set by default to 50 consecutive failures. This value can be changed by using the command line flag  `-max_lock_fail` when running the executable:

```bash
$ gnss-sdr -max_lock_fail=100 -c=./configuration_file.conf
```

&nbsp;
&nbsp;

The configuration interfaces for the available block implementations are described below.


## GPS L1 C/A signal tracking

This signal, centered at $$ f_{\text{GPS L1}}=1575.42 $$ MHz, has a complex baseband
transmitted signal that can be written as:

$$ \begin{equation} \label{GPSL1} s^{\text{(GPS L1)}}_{T}(t)=e_{L1I}(t) + j e_{L1Q}(t)~, \end{equation} $$

with

$$ \begin{equation} e_{L1I}(t) = \sum_{l=-\infty}^{\infty} D_{\text{NAV}}\Big[ [l]_{204600}\Big] \oplus C_{\text{P(Y)}} \Big[ |l|_{L_{\text{P(Y)}}} \Big] p(t - lT_{c,\text{P(Y)}})~, \end{equation} $$

$$ \begin{equation} e_{L1Q}(t) = \sum_{l=-\infty}^{\infty} D_{\text{NAV}}\Big[ [l]_{20460}  \Big]  \oplus   C_{\text{C/A}} \Big[ |l|_{1023} \Big] p(t - lT_{c,\text{C/A}})~, \end{equation} $$

where $$ \oplus $$ is the exclusive–or operation (modulo–2 addition),
$$ |l|_{L} $$ means $$ l $$ modulo $$ L $$, $$ [l]_{L} $$ means the integer part of
$$ \frac{l}{L} $$, $$ D_{\text{NAV}} $$ is the GPS navigation message bit
sequence, transmitted at $$ 50 $$ bit/s, $$ T_{c,\text{P(Y)}}=\frac{1}{10.23} $$
$$ \mu $$s, $$ T_{c,\text{C/A}}=\frac{1}{1.023} $$ $$ \mu $$s,
$$ L_{\text{P(Y)}}=6.1871 \cdot 10^{12} $$, and $$ p(t) $$ is the chip
pulse of a chip–period duration.

Then, applying equation $$ (\ref{GPSL1}) $$ in $$ (\ref{xin}) $$, the digital signal at the input of the _Tracking_ block can be written as:

$$ \begin{equation} x_\text{IN}[k] =  A(kT_s)\tilde{s}^{\text{(GPS L1)}}_{T}(kT_s-\tau(kT_s)) e^{j \left( 2\pi f_D(kT_s) kT_s + \phi(kT_s) \right) } + n(kT_s)~. \end{equation} $$

The implementations described below perform the estimation of $$ \tau $$, $$ f_D $$ and $$ \phi $$, which are assumed piecewise constant (that is, constant within an integration time, but allowed to vary from one integration period to the next one).

### Implementation: `GPS_L1_CA_DLL_PLL_Tracking`

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
| `implementation` | `GPS_L1_CA_DLL_PLL_Tracking` | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to 0 (_i.e._, complex baseband signal). <span style="color: DarkOrange">This parameter has been removed from the `next` branch.</span> | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter, in Hz. It defaults to 50 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter, in Hz. It defaults to 2 Hz. | Optional |
| `early_late_space_chips` | Spacing between Early and Prompt and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Tracking internal binary data file logging. Binary data can be retrieved and plotted in Matlab / Octave, see scripts under [gnss-sdr/src/utils/matlab/](https://github.com/gnss-sdr/gnss-sdr/tree/next/src/utils/matlab). It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Tracking implementation:_ **`GPS_L1_CA_DLL_PLL_Tracking`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TRACKING GLOBAL CONFIG ############
Tracking_1C.implementation=GPS_L1_CA_DLL_PLL_Tracking
Tracking_1C.pll_bw_hz=30.0
Tracking_1C.dll_bw_hz=4.0
Tracking_1C.early_late_space_chips=0.5
```



### Implementation: `GPS_L1_CA_DLL_PLL_C_Aid_Tracking`

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
| `implementation` | `GPS_L1_CA_DLL_PLL_C_Aid_Tracking` | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>]. Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to 0 (_i.e._, complex baseband signal). <span style="color: DarkOrange">This parameter has been removed from the `next` branch.</span> | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter before bit synchronization, in Hz. It defaults to 50 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter before bit synchronization, in Hz. It defaults to 2 Hz. | Optional |
| `pll_bw_narrow_hz` |  Bandwidth of the PLL low pass filter after bit synchronization, in Hz. It defaults to 20 Hz. | Optional |
| `dll_bw_narrow_hz` |  Bandwidth of the DLL low pass filter after bit synchronization, in Hz. It defaults to 2 Hz. | Optional |
| `extend_correlation_ms` | Correlation length, in ms. It defaults to 1 ms. | Optional |
| `early_late_space_chips` |  Spacing between Early and Prompt and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Tracking internal binary data file logging.  Binary data can be retrieved and plotted in Matlab / Octave, see scripts under [gnss-sdr/src/utils/matlab/](https://github.com/gnss-sdr/gnss-sdr/tree/next/src/utils/matlab). It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Tracking implementation:_ **`GPS_L1_CA_DLL_PLL_C_Aid_Tracking`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TRACKING GLOBAL CONFIG ############
Tracking_1C.implementation=GPS_L1_CA_DLL_PLL_C_Aid_Tracking
Tracking_1C.item_type=cshort
Tracking_1C.pll_bw_hz=40.0;
Tracking_1C.dll_bw_hz=4.0;
```

### Implementation: `GPS_L1_CA_DLL_PLL_Tracking_GPU`

GPU-accelerated computing consists in the use of a graphics processing unit (GPU) together with a CPU to accelerate the execution of a software application, by offloading computation-intensive portions of the application to the GPU, while the remainder of the code still runs on the CPU. The key idea is to utilize the computation power of both CPU cores and GPU execution units in tandem for better utilization of available computing power.

This implementation follows the CUDA programming model and targets NVIDIA's GPU computing platform. Thus, you will need a [CUDA-enabled GPU](https://developer.nvidia.com/cuda-gpus) and the [CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit) installed. Moreover, it is only available if GNSS-SDR has been built from source and configured with the flag `ENABLE_CUDA` set to `ON`:

```bash
$ cmake -DENABLE_CUDA=ON ../ && make && sudo make install
```

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
| `implementation` | `GPS_L1_CA_DLL_PLL_Tracking_GPU` | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to 0 (_i.e._, complex baseband signal). <span style="color: DarkOrange">This parameter has been removed from the `next` branch.</span> | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter, in Hz. It defaults to 50 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter, in Hz. It defaults to 2 Hz. | Optional |
| `early_late_space_chips` | Spacing between Early and Prompt and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Tracking internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Tracking implementation:_ **`GPS_L1_CA_DLL_PLL_Tracking_GPU`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TRACKING GLOBAL CONFIG ############
Tracking_1C.implementation=GPS_L1_CA_DLL_PLL_Tracking_GPU
Tracking_1C.pll_bw_hz=40.0;
Tracking_1C.dll_bw_hz=4.0;
```

## Galileo E1 signal tracking

This band, centered at $$ f_{\text{Gal E1}}=1575.420 $$ MHz and
with a reference bandwidth of $$ 24.5520 $$ MHz, uses the Composite Binary
Offset Carrier (CBOC) modulation, defined in baseband as:

$$ \begin{equation} \label{GalE1} s^{\text{(Gal E1)}}_{T}(t) = \frac{1}{\sqrt{2}} \Big( e_{E1B}(t)\left( \alpha sc_A(t)+ \beta sc_B(t) \right) - e_{E1C}(t) \left( \alpha sc_A(t)- \beta  sc_B(t) \right) \Big)~, \end{equation} $$

where the subcarriers $$ sc(t) $$ are defined as

$$ \begin{equation} sc_A(t) = \text{sign} \Big(\sin(2\pi f_{s,E1A}t) \Big)~, \end{equation} $$

$$ \begin{equation} sc_B(t) = \text{sign} \Big(\sin(2\pi f_{s,E1B}t) \Big)~, \end{equation} $$

and $$ f_{s,E1A}=1.023 $$ MHz, $$ f_{s, E1B}=6.138 $$ MHz are the subcarrier
rates, $$ \alpha=\sqrt{\frac{10}{11}} $$, and $$ \beta=\sqrt{\frac{1}{11}} $$.
Channel B contains the I/NAV type of navigation message,
$$ D_{I/NAV} $$, intended for Safety–of–Life (SoL) services:

$$ \begin{equation} e_{E1B}(t) = \sum_{l=-\infty}^{+\infty} D_{\text{I/NAV}} \Big[ [l]_{4092}\Big] \oplus C_{E1B}\Big[|l|_{4092}\Big]    p(t - lT_{c,E1B})~. \end{equation} $$

In case of channel C, it is a pilot (dataless) channel with a
secondary code, forming a tiered code:

$$ \begin{equation} e_{E1C}(t) = \sum_{m=-\infty}^{+\infty}C_{E1Cs}\Big[|m|_{25}\Big] \oplus \sum_{l=1}^{4092}C_{E1Cp}\Big[ l \Big] \cdot  p(t-mT_{c,E1Cs}-lT_{c,E1Cp})~, \end{equation} $$

with $$ T_{c,E1B}=T_{c,E1Cp}=\frac{1}{1.023} $$ $$ \mu $$s and $$ T_{c,E1Cs}=4 $$
ms.

Then, applying equation $$ (\ref{GalE1}) $$ in $$ (\ref{xin}) $$, the digital signal at the input of the _Tracking_ block can be written as

$$ \begin{equation} x_\text{IN}[k] =  A(kT_s)\tilde{s}^{\text{(Gal E1)}}_{T}(kT_s-\tau(kT_s)) e^{j \left( 2\pi f_D(kT_s) kT_s + \phi(kT_s) \right) } + n(kT_s)~. \end{equation} $$

The implementation described below performs the estimation of $$ \tau $$, $$ f_D $$ and $$ \phi $$, which are assumed piecewise constant (that is, constant within an integration time, but allowed to vary from one integration period to the next one).

### Implementation: `Galileo_E1_DLL_PLL_VEML_Tracking`

In case of Galileo E1, the CBOC(6,1,$$ \frac{1}{11} $$) modulation creates
correlation ambiguities, as shown in the following figure:

![Rxd]({{ "/assets/images/rxd.png" | relative_url }}){:width="600x"}
{: style="text-align: center;"}
_Normalized $$ \left|R_{xd}\left(\check{f}_D=f_D, \tau \right) \right|^2 $$ for different sampling rates and local reference waveforms[^Fernandez]._
{: style="text-align: center;"}

The possibility of tracking a local maximum instead of the global one can be avoided by
using discriminators that consider two extra samples of the cost
function, referred to as *Very Early*
$$ \text{VE}=R_{xd}(\hat{\tau}-\epsilon^\prime) $$ and *Very Late*
$$ \text{VL}=R_{xd}(\hat{\tau}+\epsilon^\prime) $$, with
$$ \epsilon^\prime > \epsilon $$.

In the case of carrier tracking loops, the pilot channel E1C can be used
for the phase error estimation, since it does not contain data bit
transitions, and, theoretically, coherent integration of several code
periods can be used for as long as needed once the secondary code has been removed. As a consequence, a
discriminator that is insensitive to phase jumps can be used. Using pure
PLL tracking on the pilot channel as well as longer coherent integration
improves the carrier *tracking sensitivity*, the minimum signal power at
which the receiver can keep the tracking process in lock.


The implementation of this block is described in Algorithm
below. The computation of the complex values VE, E, P, L and VL
in step $$ 5 $$ was implemented using the [VOLK_GNSSSDR](https://github.com/gnss-sdr/gnss-sdr/tree/master/src/algorithms/libs/volk_gnsssdr_module/volk_gnsssdr) library. The
PLL discriminator implemented in step $$ 6 $$  is the extended
arctangent (four-quadrant) discriminator, and for the DLL we used the
normalized Very Early Minus Late Power discriminator (step $$ 10 $$ ). For code lock detection
(step $$ 13 $$ ), we used the Squared Signal-to-Noise Variance
(SNV) estimator[^Petovello10]. In the case of carrier lock
detection (step $$ 14 $$ ), we used the normalized estimate of
the cosine of twice the carrier phase[^Dierendonck]. The values of the
lock indicator range from $$ -1 $$, when the locally generated carrier is
completely out of phase, to $$ 1 $$, that indicates a perfect match. When
either the code or the carrier detectors are below given thresholds
during a consecutive number of code periods $$ \vartheta $$, the Tracking
block informs to control plane through the message queue.



*  **Require:** Complex sample stream, $$ \mathbf{x}_{\text{IN}} $$; estimations of code
phase $$ \hat{\tau}_{acq} $$ and Doppler shift $$ \hat{f}_{D_{acq}} $$; buffer
size for power estimation, $$ \mathcal{U} $$; carrier lock detector
threshold, $$ \mathcal{T} $$; $$ CN0_{min} $$; maximum value for the lock fail
counter, $$ \vartheta $$; correlators spacing $$ \epsilon $$ and
$$ \epsilon^\prime $$; loop filters bandwidth $$ BW_{DLL} $$ and $$ BW_{PLL} $$;
integration time $$ T_{int} $$. Track signal’s synchronization parameters
within a given lock margin. Inform about a loss of lock.

1. **Initialization:** Using $$ \hat{\tau}_{acq} $$
and a sample counter $$ \mathcal{N} $$, skip samples until
$$ \mathbf{x}_{\text{IN}} $$ is aligned with local PRN replica. Set
$$ \upsilon=0 $$, $$ k=0 $$, $$ \hat{f}_{D_{0}}=\hat{f}_{D_{acq}} $$,
$$ \hat{\phi}_0=0 $$, $$ \psi_1=0 $$, $$ N_1=\text{round}(T_{int} f_{\text{IN}}) $$.

2. Increase the integration period counter: $$ k=k+1 $$.

3. Generate local code references: for $$ n=1...N_k $$,
$$ s[n]=d_{E1B/E1C_{p}}\left[\text{round}(\delta_{k} \cdot n + \psi_{k})\right] $$,
where
$$ \delta_{k}= \frac{1}{T_{c,E1B} \cdot f_{\text{IN}} }\left( 1 + \frac{\hat{f}_{D_{k-1}}}{f^{\text{(Gal E1)}}_c} \right) $$,
and the Very Early, Early, Late, and Very Late versions with $$ \epsilon $$
and $$ \epsilon^\prime $$.
4. Generate local carrier: for $$ n=1...N_k $$,
$$ c[n]=e^{-j\left(2\pi \hat{f}_{D_{k-1}} \frac{n}{f_{\text{IN}}}+\text{mod}\left(\hat{\phi}_{k-1},2\pi \right) \right)} $$.

5. Perform carrier wipe-off and compute the complex samples VE$$ _k $$, E$$ _k $$, P$$ _k $$,
L$$ _k $$ and VL$$ _k $$.
Example:
$$ \text{P}_k=\frac{1}{N_k} \sum_{n=0}^{N_k-1} x_{\text{IN}}[n] s[n] c[n] $$.

6. Compute PLL discriminator:
$$ \Delta \hat{\phi}_{k} = \mbox{atan2}\left( \frac{ \text{P}_{Q_{k}}}{\text{P}_{I_{k}}} \right) $$

7. Filter $$ \Delta \hat{\phi}_{k} $$ with a bandwidth $$ BW_{PLL} $$:
$$ h_{PLL}\left( \Delta \hat{\phi}_{k}\right) $$.

8. Update carrier frequency
estimation (in Hz):
$$ \hat{f}_{D_{k}}=\hat{f}_{D_{acq}}+\frac{1}{ 2\pi T_{int} } h_{PLL}\left( \Delta \hat{\phi}_{k} \right) $$.

9. Update carrier phase estimation (in rad):
$$ \hat{\phi}_k=\hat{\phi}_{k-1}+ 2 \pi \hat{f}_{D_{k}} T_{int}+ h_{PLL}(\Delta \hat{\phi}) $$.

10. Compute DLL discriminator:
$$ \Delta \hat{\tau}_{k}=\frac{\mathcal{E}_{k}-\mathcal{L}_{k}}{\mathcal{E}_{k}+\mathcal{L}_{k}} $$,
where:
$$ \mathcal{E}_{k}=\sqrt{\text{VE}_{I_{k}}^2+\text{VE}_{Q_{k}}^2+E_{I_{k}}^2+E_{Q_{k}}^2} $$,
and
$$ \mathcal{L}_{k}=\sqrt{\text{VL}_{I_{k}}^2+\text{VL}_{Q_{k}}^2+L_{I_{k}}^2+L_{Q_{k}}^2} $$.

11. Filter $$ \Delta \hat{\tau}_{k} $$ with a bandwidth $$ BW_{DLL} $$:
$$ h_{DLL}\left( \Delta \hat{\tau}_{k}\right) $$.

12. Update code phase
estimation (in samples):
$$ N_{k+1}=\text{round}(S) $$ and $$ \psi_{k+1}=S-N_{k+1} $$, where
$$ S = \frac{T_{int}f_{\text{IN} } }{\left( 1 + \frac{\hat{f}_{D_{k} } }{f^{\text{(Gal E1) } }_c} \right)} +\psi_{k} + h_{DLL}(\hat{\Delta \tau}_k)f_{\text{IN} }  $$.

13. Code lock indicator:
$$ \hat{ \text{CN0} } = 10 \cdot \log_{10} ( \hat{\rho}) + 10 \cdot \log_{10}(\frac{ f_{ \text{IN} } }{2} )-10 \cdot \log_{10} (L_{ \text{PRN} }) $$,
where:
$$ \hat{\rho}=\frac{ \hat{P}_s }{ \hat{P}_n } = \frac{\hat{P}_s}{\hat{P}_{tot}-\hat{P}_s} $$,
$$ \hat{P}_s = \left(\frac{1}{\mathcal{U}}\sum^{\mathcal{U}-1}_{i=0}|\text{P}_{I_{k-i}} |\right)^2 $$,
and
$$ \hat{P}_{tot} = \frac{1}{\mathcal{U}}\sum^{\mathcal{U}-1}_{i=0}|\text{P}_{k-i}|^2 $$.

14. Phase lock indicator:
$$ T_{carrier} = \frac{ \left( \sum^{\mathcal{U}-1}_{i=0} \text{P}_{ {I}_{k-i}}\right)^2 - \left( \sum^{\mathcal{U} -1}_{i=0} \text{P}_{Q_{k-i}}\right)^2}{\left(\sum^{\mathcal{U}-1}_{i=0} \text{P}_{ {I}_{k-i}}\right)^2 + \left( \sum^{\mathcal{U} -1}_{i=0} \text{P}_{Q_{k-i}}\right)^2} $$.

15. **if** $$ T_{carrier} < \mathcal{T} $$ or $$  \hat{ CN0 } < CN0_{min} $$
* Increase lock fail counter $$ \upsilon \leftarrow \upsilon +1 $$.

16. **else**
* Decrease lock fail counter $$ \upsilon \leftarrow \max(\upsilon -1,0) $$.

17. **endif**

18. **if**  $$ \upsilon >  \vartheta $$
* Notify the loss of lock to the control plane through the message queue.

20. **endif**

21. **Output**:
$$ \text{P}_k $$, accumulated carrier phase error $$ \hat{\phi}_k $$, code phase
$$ \mathcal{N} \leftarrow \mathcal{N}+ N_k + \psi_k $$, carrier-to-noise-density ratio $$ \hat{\text{CN0}} $$.
{: .notice--info}



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
| `implementation` | `Galileo_E1_DLL_PLL_VEML_Tracking` | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to 0 (_i.e._, complex baseband signal). <span style="color: DarkOrange">This parameter has been removed from the `next` branch.</span> | Optional |
| <span style="color: DarkOrange">`track_pilot`</span> | <span style="color: DarkOrange">[`true`, `false`]: If set to `true`, the receiver is set to track the pilot signal E1C and enables an extra prompt correlator (slave to pilot's prompt) in the data component E1B. It defaults to `false` (that is, correlations on a data length of 4 ms over the E1B component).</span> | <span style="color: DarkOrange">Optional</span> |
| <span style="color: DarkOrange">`extend_correlation_symbols`</span> | <span style="color: DarkOrange">If `track_pilot=true`, sets the number of correlation symbols to be extended after the secondary code $$ C_{E1C_{s}} $$ is removed from the pilot signal, in number of symbols. Each symbol is 4 ms, so setting this parameter to 25 means a coherent integration time of 100 ms. The higher this parameter is, the better local clock stability will be required. It defaults to 1.</span> | <span style="color: DarkOrange">Optional</span> |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter, in Hz. It defaults to 5 Hz. This implementation uses a Costas loop. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter, in Hz. It defaults to 0.5 Hz. | Optional |
| `early_late_space_chips` | Spacing between Early and Prompt and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.15 $$. | Optional |
| `very_early_late_space_chips` | Spacing between Very Early and Prompt and between Prompt and Very Late correlators, normalized by the chip period $$ T_c $$ It defaults to $$ 0.6 $$. | Optional |
| <span style="color: DarkOrange">`pll_bw_narrow_hz`</span> |  <span style="color: DarkOrange">If `track_pilot=true` and `extend_correlation_symbols` $$ > $$ 1, sets the bandwidth of the PLL low pass filter after removal of the secondary code $$ C_{E1C_{s}} $$, in Hz. It defaults to 2 Hz. This implementation uses a four-quadrant arctangent discriminator (atan2).</span> | <span style="color: DarkOrange">Optional</span> |
| <span style="color: DarkOrange">`dll_bw_narrow_hz`</span> |  <span style="color: DarkOrange">If `track_pilot=true` and `extend_correlation_symbols` $$ > $$ 1, sets the bandwidth of the DLL low pass filter after removal of the secondary code $$ C_{E1C_{s}} $$ and extension of the coherent integration time, in Hz. It defaults to 0.25 Hz.</span> | <span style="color: DarkOrange">Optional</span> |
| <span style="color: DarkOrange">`early_late_space_narrow_chips`</span> | <span style="color: DarkOrange">If `track_pilot=true` and `extend_correlation_symbols` $$ > $$ 1, sets the spacing between Early and Prompt and between Prompt and Late correlators after removal of the secondary code $$ C_{E1C_{s}} $$, normalized by the chip period $$ T_c $$. It defaults to $$ 0.15 $$.</span> | <span style="color: DarkOrange">Optional</span> |
| <span style="color: DarkOrange">`very_early_late_space_narrow_chips`</span> | <span style="color: DarkOrange">If `track_pilot=true` and `extend_correlation_symbols` $$ > $$ 1, sets the spacing between Very Early and Prompt and between Prompt and Very Late correlators after removal of the secondary code $$ C_{E1C_{s}} $$ and extension of the coherent integration time, normalized by the chip period $$ T_c $$. It defaults to $$ 0.6 $$.</span> | <span style="color: DarkOrange">Optional</span> |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Tracking internal binary data file logging.  Binary data can be retrieved and plotted in Matlab / Octave, see scripts under [gnss-sdr/src/utils/matlab/](https://github.com/gnss-sdr/gnss-sdr/tree/next/src/utils/matlab). It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Tracking implementation:_ **`Galileo_E1_DLL_PLL_VEML_Tracking`**.
  {: style="text-align: center;"}

<span style="color: DarkOrange">Please note that parameters in orange text are only available in the `next` branch of the upstream repository.</span>

Example:

```ini
;######### TRACKING GLOBAL CONFIG ############
Tracking_1B.implementation=Galileo_E1_DLL_PLL_VEML_Tracking
Tracking_1B.pll_bw_hz=15.0;
Tracking_1B.dll_bw_hz=2.0;
```


## Glonass L1 C/A signal tracking

The complex baseband transmitted
signal can be written as:

$$ \begin{equation} \label{GLOL1} s^{\text{(GLO L1)}}_{T}(t)=e_{L1I}(t) + j e_{L1Q}(t)~, \end{equation} $$

with

$$ \begin{equation} e_{L1I}(t) = \sum_{l=-\infty}^{\infty} D_{\text{GNAV}}\Big[ [l]_{102200}\Big] \oplus C_{\text{HP}} \Big[ |l|_{L_{\text{HP}}} \Big] p(t  -  lT_{c,\text{HP}})~,\end{equation} $$

$$ \begin{equation} e_{L1Q}(t) = \sum_{l=-\infty}^{\infty} D_{\text{GNAV}}\Big[ [l]_{10220} \Big]  \oplus  C_{\text{C/A}}  \Big[ |l|_{511} \Big] p(t - lT_{c,\text{C/A}})~,\end{equation} $$

where $$ T_{c,\text{HP}}=\frac{1}{5.11} $$ $$ \mu $$s,
$$ T_{c,\text{C/A}}=\frac{1}{0.511} $$ $$ \mu $$s, and
$$ L_{\text{HP}}=3.3554\cdot 10^7 $$. The navigation message
$$ D_{\text{GNAV}} $$ is transmitted at $$ 50 $$ bit/s.

Then, applying equation $$ (\ref{GLOL1}) $$ in $$ (\ref{xin}) $$, the digital signal at the input of the _Tracking_ block can be written as

$$ \begin{equation} x_\text{IN}[k] =  A(kT_s)\tilde{s}^{\text{(GLO L1)}}_{T}(kT_s-\tau(kT_s)) e^{j \left( 2\pi f_D(kT_s) kT_s + \phi(kT_s) \right) } + n(kT_s)~. \end{equation} $$

The implementations described below perform the estimation of $$ \tau $$, $$ f_D $$ and $$ \phi $$, which are assumed piecewise constant (that is, constant within an integration time, but allowed to vary from one integration period to the next one).


### Implementation: `GLONASS_L1_CA_DLL_PLL_Tracking`

**IMPORTANT**: This implementation is only available from the `next` branch of GNSS-SDR's repository, so it is **not** present in the current stable release.
{: .notice--warning}

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
| `implementation` | `GLONASS_L1_CA_DLL_PLL_Tracking` | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to 0 (_i.e._, complex baseband signal). | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter, in Hz. It defaults to 50 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter, in Hz. It defaults to 2 Hz. | Optional |
| `early_late_space_chips` | Spacing between Early and Prompt and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Tracking internal binary data file logging. Binary data can be retrieved and plotted in Matlab / Octave, see scripts under [gnss-sdr/src/utils/matlab/](https://github.com/gnss-sdr/gnss-sdr/tree/next/src/utils/matlab). It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Tracking implementation:_ **`GLONASS_L1_CA_DLL_PLL_Tracking`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TRACKING GLOBAL CONFIG ############
Tracking_1G.implementation=GLONASS_L1_CA_DLL_PLL_Tracking
Tracking_1G.pll_bw_hz=30.0
Tracking_1G.dll_bw_hz=4.0
Tracking_1G.early_late_space_chips=0.5
```



### Implementation: `GLONASS_L1_CA_DLL_PLL_C_Aid_Tracking`

**IMPORTANT**: This implementation is only available from the `next` branch of GNSS-SDR's repository, so it is **not** present in the current stable release.
{: .notice--warning}

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
| `implementation` | `GLONASS_L1_CA_DLL_PLL_C_Aid_Tracking` | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>]. Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to 0 (_i.e._, complex baseband signal). | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter before bit synchronization, in Hz. It defaults to 50 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter before bit synchronization, in Hz. It defaults to 2 Hz. | Optional |
| `pll_bw_narrow_hz` |  Bandwidth of the PLL low pass filter after bit synchronization, in Hz. It defaults to 20 Hz. | Optional |
| `dll_bw_narrow_hz` |  Bandwidth of the DLL low pass filter after bit synchronization, in Hz. It defaults to 2 Hz. | Optional |
| `extend_correlation_ms` | Correlation length, in ms. It defaults to 1 ms. | Optional |
| `early_late_space_chips` |  Spacing between Early and Prompt and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Tracking internal binary data file logging.  Binary data can be retrieved and plotted in Matlab / Octave, see scripts under [gnss-sdr/src/utils/matlab/](https://github.com/gnss-sdr/gnss-sdr/tree/next/src/utils/matlab). It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Tracking implementation:_ **`GLONASS_L1_CA_DLL_PLL_C_Aid_Tracking`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TRACKING GLOBAL CONFIG ############
Tracking_1G.implementation=GLONASS_L1_CA_DLL_PLL_C_Aid_Tracking
Tracking_1G.item_type=cshort
Tracking_1G.pll_bw_hz=40.0;
Tracking_1G.dll_bw_hz=4.0;
```


## GPS L2CM signal tracking

This signal, centered at $$ f_{\text{GPS L2}}=1227.60 $$ MHz, has a complex baseband
transmitted signal that can be written as:

$$ \begin{equation} \label{GPSL2} s^{\text{(GPS L2)}}_{T}(t)=e_{L2I}(t) + j e_{L2Q}(t)~, \end{equation} $$

with the In–phase and Quadrature components defined as:

$$ \begin{equation} e_{L2I}(t) =  \sum_{l=-\infty}^{\infty} D_{\text{NAV}}\Big[ [l]_{204600}\Big] \oplus C_{\text{P(Y)}} \Big[ |l|_{L_{\text{P(Y)}}} \Big] p(t -  lT_{c,\text{P(Y)}})\end{equation}  $$

and

$$ \begin{equation} e_{L2Q}(t)  =  \sum_{l=-\infty}^{\infty}\left( D_{\text{CNAV}} \Big[ [l]_{10230} \Big] \oplus   C_{\text{CM}} \Big[ |l|_{L_{\text{CM}}} \Big] p_{\text{1/2}} \left(t - lT_{c,L2C} \right) + C_{\text{CL}} \Big[ |l|_{L_{\text{CL}}} \Big] p_{\text{1/2}}\left(t - \left(l+\frac{1}{2}\right)T_{c,L2C}\right) \right)~, \end{equation} $$

where $$ T_{c,L2C}=\frac{1}{511.5} $$ ms and $$ p_{\text{1/2}}(t) $$ is a
rectangular pulse of half chip–period duration, thus time–multiplexing
codes $$C_{\text{CL}} $$ and $$ C_{\text{CM}} $$. The civilian long code $$ C_{\text{CL}} $$ is
$$ L_{\text{CL}}=767250 $$ chips long, repeating every $$ 1.5 $$ s, while the
civilian moderate code $$ C_{\text{CM}} $$ is $$ L_{\text{CM}}=10230 $$ chips
long and it repeats every $$ 20 $$ ms.

Then, applying equation $$ (\ref{GPSL2}) $$ in $$ (\ref{xin}) $$, the digital signal at the input of the _Tracking_ block can be written as

$$ \begin{equation} x_\text{IN}[k] =  A(kT_s)\tilde{s}^{\text{(GPS L2)}}_{T}(kT_s-\tau(kT_s)) e^{j \left( 2\pi f_D(kT_s) kT_s + \phi(kT_s) \right) } + n(kT_s)~. \end{equation} $$

The implementation described below performs the estimation of $$ \tau $$, $$ f_D $$ and $$ \phi $$, which are assumed piecewise constant (that is, constant within an integration time, but allowed to vary from one integration period to the next one).

### Implementation: `GPS_L2_M_DLL_PLL_Tracking`

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
| `implementation` | `GPS_L2_M_DLL_PLL_Tracking` | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to 0 (_i.e._, complex baseband signal). <span style="color: DarkOrange">This parameter has been removed from the `next` branch.</span> | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter, in Hz. It defaults to 2 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter, in Hz. It defaults to 0.75 Hz. | Optional |
| `early_late_space_chips` |  Spacing between Early and Prompt and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Tracking internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Tracking implementation:_ **`GPS_L2_M_DLL_PLL_Tracking`**.
  {: style="text-align: center;"}


Example:

```ini
;######### TRACKING GLOBAL CONFIG ############
Tracking_2S.implementation=GPS_L2_M_DLL_PLL_Tracking
Tracking_2S.pll_bw_hz=40.0;
Tracking_2S.dll_bw_hz=4.0;
Tracking_2S.early_late_space_chips=0.4
```


## Glonass L2 C/A signal tracking

Beginning with the second generation of satellites, called GLONASS–M and
first launched in 2001, a second civil signal is available using the
same C/A code than the one in the L1 band but centered at $$ 1246 $$ MHz.


### Implementation: `GLONASS_L2_CA_DLL_PLL_Tracking`

**IMPORTANT**: This implementation is only available from the `next` branch of GNSS-SDR's repository, so it is **not** present in the current stable release.
{: .notice--warning}

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
| `implementation` | `GLONASS_L2_CA_DLL_PLL_Tracking` | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to 0 (_i.e._, complex baseband signal). | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter, in Hz. It defaults to 50 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter, in Hz. It defaults to 2 Hz. | Optional |
| `early_late_space_chips` | Spacing between Early and Prompt and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Tracking internal binary data file logging. Binary data can be retrieved and plotted in Matlab / Octave, see scripts under [gnss-sdr/src/utils/matlab/](https://github.com/gnss-sdr/gnss-sdr/tree/next/src/utils/matlab). It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Tracking implementation:_ **`GLONASS_L2_CA_DLL_PLL_Tracking`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TRACKING GLOBAL CONFIG ############
Tracking_2G.implementation=GLONASS_L2_CA_DLL_PLL_Tracking
Tracking_2G.pll_bw_hz=30.0
Tracking_2G.dll_bw_hz=4.0
Tracking_2G.early_late_space_chips=0.5
```



### Implementation: `GLONASS_L2_CA_DLL_PLL_C_Aid_Tracking`

**IMPORTANT**: This implementation is only available from the `next` branch of GNSS-SDR's repository, so it is **not** present in the current stable release.
{: .notice--warning}

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
| `implementation` | `GLONASS_L2_CA_DLL_PLL_C_Aid_Tracking` | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>]. Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to 0 (_i.e._, complex baseband signal). | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter before bit synchronization, in Hz. It defaults to 50 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter before bit synchronization, in Hz. It defaults to 2 Hz. | Optional |
| `pll_bw_narrow_hz` |  Bandwidth of the PLL low pass filter after bit synchronization, in Hz. It defaults to 20 Hz. | Optional |
| `dll_bw_narrow_hz` |  Bandwidth of the DLL low pass filter after bit synchronization, in Hz. It defaults to 2 Hz. | Optional |
| `extend_correlation_ms` | Correlation length, in ms. It defaults to 1 ms. | Optional |
| `early_late_space_chips` |  Spacing between Early and Prompt and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Tracking internal binary data file logging.  Binary data can be retrieved and plotted in Matlab / Octave, see scripts under [gnss-sdr/src/utils/matlab/](https://github.com/gnss-sdr/gnss-sdr/tree/next/src/utils/matlab). It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Tracking implementation:_ **`GLONASS_L2_CA_DLL_PLL_C_Aid_Tracking`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TRACKING GLOBAL CONFIG ############
Tracking_2G.implementation=GLONASS_L2_CA_DLL_PLL_C_Aid_Tracking
Tracking_2G.item_type=cshort
Tracking_2G.pll_bw_hz=40.0;
Tracking_2G.dll_bw_hz=4.0;
```

## GPS L5 signal tracking

The GPS L5 link is only available on Block IIF and subsequent satellite blocks. Centered at
$$ f_{\text{GPS L5}}=1176.45 $$ MHz, this signal can be written as:

$$ \begin{equation} \label{GPSL5} s^{\text{(GPS L5)}}_{T}(t)=e_{L5I}(t) +j e_{L5Q}(t)~, \end{equation} $$

$$ \begin{equation} e_{L5I}(t) = \sum_{m=-\infty}^{+\infty} C_{nh_{10}} \Big[ |m|_{10}\Big] \oplus  \ D_{\text{CNAV}}\Big[ [m]_{10}\Big]    \oplus \sum_{l=1}^{102300} C_{L5I}\Big[|l|_{10230}\Big]  p(t - m T_{c,nh} - lT_{c,L5}) ~,\end{equation} $$

$$ \begin{equation} e_{L5Q}(t) = \sum_{m=-\infty}^{+\infty} C_{nh_{20}} \Big[ |m|_{20}\Big]   \oplus  \sum_{l=1}^{102300}C_{L5Q}\Big[|l|_{10230}\Big] \cdot p(t - m T_{c,nh} - lT_{c,L5})~, \end{equation} $$

where $$ T_{c,nh}=1 $$ ms and $$ T_{c,L5}=\frac{1}{10.23} $$ $$ \mu $$s. The L5I
component contains a synchronization sequence $$ C_{nh_{10}}=0000110101 $$,
a $$ 10 $$–bit Neuman–Hoffman code that modulates each $$ 100 $$ symbols of the
GPS L5 civil navigation data $$ D_{\text{CNAV}} $$, and the L5Q component
has another synchronization sequence $$ C_{nh_{20}}=00000100110101001110 $$.

Then, applying equation $$ (\ref{GPSL5}) $$ in $$ (\ref{xin}) $$, the digital signal at the input of the _Tracking_ block can be written as

$$ \begin{equation} x_\text{IN}[k] =  A(kT_s)\tilde{s}^{\text{(GPS L5)}}_{T}(kT_s-\tau(kT_s)) e^{j \left( 2\pi f_D(kT_s) kT_s + \phi(kT_s) \right) } + n(kT_s)~. \end{equation} $$

The implementation described below performs the estimation of $$ \tau $$, $$ f_D $$ and $$ \phi $$, which are assumed piecewise constant (that is, constant within an integration time, but allowed to vary from one integration period to the next one).

### Implementation: `GPS_L5i_DLL_PLL_Tracking`

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
| `implementation` | `GPS_L5i_DLL_PLL_Tracking` | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `track_pilot` | [`true`, `false`]: If set to `true`, the receiver is set to track the pilot signal L5Q and enables an extra prompt correlator (slave to pilot's prompt) in the data component L5I. It defaults to `false` (that is, correlations on a data length of 1 ms over the L5I component). | Optional |
| `extend_correlation_symbols` | If `track_pilot=true`, sets the number of correlation symbols to be extended after the secondary code $$ C_{nh_{20}} $$ is removed from the pilot signal, in number of symbols. Each symbol is 1 ms, so setting this parameter to 25 means a coherent integration time of 25 ms. The higher this parameter is, the better local clock stability will be required. It defaults to 1. | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter, in Hz. It defaults to 50 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter, in Hz. It defaults to 2 Hz. | Optional |
| `early_late_space_chips` | Spacing between Early and Prompt and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dll_bw_narrow_hz` |  Bandwidth of the DLL low pass filter after the secondary code lock, in Hz. It defaults to 0.25 Hz. | Optional |
| `pll_bw_narrow_hz` |  Bandwidth of the PLL low pass filter after the secondary code lock, in Hz. It defaults to 2 Hz. | Optional |
| `early_late_space_narrow_chips` | If `track_pilot=true` and `extend_correlation_symbols` $$ > $$ 1, sets the spacing between Early and Prompt and between Prompt and Late correlators after removal of the secondary code $$ C_{nh_{20}} $$, normalized by the chip period $$ T_{c,L5} $$. It defaults to $$ 0.15 $$. | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Tracking internal binary data file logging. Binary data can be retrieved and plotted in Matlab / Octave, see scripts under [gnss-sdr/src/utils/matlab/](https://github.com/gnss-sdr/gnss-sdr/tree/next/src/utils/matlab). It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Tracking implementation:_ **`GPS_L5i_DLL_PLL_Tracking`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TRACKING GLOBAL CONFIG ############
Tracking_L5.implementation=GPS_L5i_DLL_PLL_Tracking
Tracking_L5.pll_bw_hz=30.0
Tracking_L5.dll_bw_hz=4.0
Tracking_L5.early_late_space_chips=0.5
```




## Galileo E5a signal tracking

The AltBOC modulation in the Galileo E5 band allows the approximation to two sub-bands, referred to as E5a and E5b, QPSK-modulated and centered at $$ f_{\text{Gal E5a}}=1176.450 $$ MHz and $$ f_{Gal E5b}=1207.140 $$ MHz, respectively.

The baseband signal at E5a can then be approximated by:

$$ \begin{equation} \label{GalE5a} s^{\text{(Gal E5a)}}_{T}(t) = e_{E5aI}(t)+je_{E5aQ}(t)~, \end{equation} $$

where the signal components are defined as:

$$ \begin{equation} e_{E5aI}(t) = \sum_{m=-\infty}^{+\infty}C_{E5aIs}\Big[|m|_{20}\Big] \oplus \sum_{l=1}^{10230}C_{E5aIp}\Big[ l \Big] \oplus D_{\text{F/NAV}} \Big[ [l]_{204600}\Big] p(t-mT_{c,E5s}-lT_{c,E5p})~, \end{equation} $$

$$ \begin{equation} e_{E5aQ}(t) = \sum_{m=-\infty}^{+\infty}C_{E5aQs}\Big[|m|_{100}\Big] \oplus \sum_{l=1}^{10230}C_{E5aQp}\Big[ l \Big] \cdot p(t-mT_{c,E5s}-lT_{c,E5p})~, \end{equation}$$

where $$ T_{c,E5s}=1 $$ ms and $$ T_{c,E5p}=\frac{1}{10.23} $$ $$ \mu $$s.

Then, applying equation $$ (\ref{GalE5a}) $$ in $$ (\ref{xin}) $$, the digital signal at the input of the _Tracking_ block can be written as

$$ \begin{equation} x_\text{IN}[k] =  A(kT_s)\tilde{s}^{\text{(Gal E5a)}}_{T}(kT_s-\tau(kT_s)) e^{j \left( 2\pi f_D(kT_s) kT_s + \phi(kT_s) \right) } + n(kT_s)~. \end{equation} $$

The implementation described below performs the estimation of $$ \tau $$, $$ f_D $$ and $$ \phi $$, which are assumed piecewise constant (that is, constant within an integration time, but allowed to vary from one integration period to the next one).

### Implementation: `Galileo_E5a_DLL_PLL_Tracking`

This implementation accepts the following parameters:

|----------
|  **Global Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_hz` | Input sample rate to the processing channels, in samples per second.  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Galileo_E5a_DLL_PLL_Tracking` | Mandatory |
| `item_type` |  [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>]: Set the sample data type expected at the block input. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. | Optional |
| `if`        |  Intermediate frequency of the incoming signal, in Hz. It defaults to $$ 0 $$ (_i.e._, complex baseband signal). <span style="color: DarkOrange">This parameter has been removed from the `next` branch.</span> | Optional |
| <span style="color: DarkOrange">`track_pilot`</span> | <span style="color: DarkOrange">[`true`, `false`]: If set to `true`, the receiver is set to track the pilot signal E5aQ and enables an extra prompt correlator (slave to pilot's prompt) in the data component E5aI. It defaults to `false` (that is, correlations on a data length of 1 ms over the E5aI component).</span> | <span style="color: DarkOrange">Optional</span> |
| <span style="color: DarkOrange">`extend_correlation_symbols`</span> | <span style="color: DarkOrange">If `track_pilot=true`, sets the number of correlation symbols to be extended after the secondary code $$ C_{E5aQs} $$ is removed from the pilot signal, in number of symbols. Each symbol is 1 ms, so setting this parameter to 25 means a coherent integration time of 25 ms. The higher this parameter is, the better local clock stability will be required. It defaults to 1.</span> | <span style="color: DarkOrange">Optional</span> |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter before the secondary code lock, in Hz. It defaults to 20 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter before the secondary code lock, in Hz. It defaults to 20 Hz. | Optional |
| `early_late_space_chips` |  Spacing between Early and Prompt and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dll_bw_narrow_hz` |  Bandwidth of the DLL low pass filter after the secondary code lock, in Hz. It defaults to 5 Hz. | Optional |
| `pll_bw_narrow_hz` |  Bandwidth of the PLL low pass filter after the secondary code lock, in Hz. It defaults to 2 Hz. | Optional |
| <span style="color: DarkOrange">`early_late_space_narrow_chips`</span> | <span style="color: DarkOrange">If `track_pilot=true` and `extend_correlation_symbols` $$ > $$ 1, sets the spacing between Early and Prompt and between Prompt and Late correlators after removal of the secondary code $$ C_{E5aQs} $$, normalized by the chip period $$ T_{c,E5p} $$. It defaults to $$ 0.15 $$.</span> | <span style="color: DarkOrange">Optional</span> |
| `ti_ms` | Correlation length after the secondary code lock, in ms. It defaults to 3 ms. <span style="color: DarkOrange">This parameter has been removed from the `next` branch (replaced by `extend_correlation_symbols`).</span> | Optional |
| `dump` |  [`true`, `false`]: If set to `true`, it enables the Tracking internal binary data file logging. Binary data can be retrieved and plotted in Matlab / Octave, see scripts under [gnss-sdr/src/utils/matlab/](https://github.com/gnss-sdr/gnss-sdr/tree/next/src/utils/matlab). It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Tracking implementation:_ **`Galileo_E5a_DLL_PLL_Tracking`**.
  {: style="text-align: center;"}

Example:

```ini
;######### TRACKING GLOBAL CONFIG ############
Tracking_5X.implementation=Galileo_E5a_DLL_PLL_Tracking
Tracking_5X.item_type=gr_complex
Tracking_5X.pll_bw_hz=25.0
Tracking_5X.dll_bw_hz=4.0
Tracking_5X.pll_bw_narrow_hz=10.0
Tracking_5X.dll_bw_narrow_hz=4.0
Tracking_5X.early_late_space_chips=0.5
```



-------

## References

[^Proakis]: J. G. Proakis, _Digital Communications_, 5th Ed., McGraw-Hill, 2008.

[^Petovello10]: M. Petovello, E. Falletti, M. Pini, L. Lo Presti, [Are Carrier-to-Noise algorithms equivalent in all situations?](http://www.insidegnss.com/auto/IGM_gnss-sol-janfeb10.pdf). Inside GNSS, Vol. 5, no. 1, pp. 20-27, Jan.-Feb. 2010.

[^Dierendonck]: A. J. Van Dierendonck, “GPS Receivers”, from _Global Positioning System: Theory and Applications_, Volume I, Edited by B. W. Parkinson and J. J. Spilker Jr. American Institute of Aeronautics and Astronautics, 1996.

[^Fernandez]: C. Fernández-Prades, J. Arribas, L. Esteve-Elfau, D. Pubill, P. Closas, [An Open Source Galileo E1 Software Receiver](http://www.cttc.es/wp-content/uploads/2013/03/121208-2582419-fernandez-9099698438457074772.pdf), in Proceedings of the 6th ESA Workshop on Satellite Navigation Technologies (NAVITEC 2012), 5-7 December 2012, ESTEC, Noordwijk (The Netherlands).

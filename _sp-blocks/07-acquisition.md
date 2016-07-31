---
title: "Acquisition"
permalink: /docs/sp-blocks/acquisition/
excerpt: "Documentation for the Acquisition block"
sidebar:
  nav: "sp-block"
modified: 2016-04-13T15:54:02-04:00
---
{% include toc %}

The role of an _Acquisition_ block is the detection of presence/absence
of signals coming from a given GNSS satellite. In case of a positive
detection, it should provide coarse estimations of the code phase
$$ \hat{\tau} $$ and the Doppler shift $$ \hat{f}_d $$, yet accurate enough to
initialize the delay and phase tracking loops.
{: .notice--info}

By exploiting the
concepts and the methodology of the estimation theory, it is possible to
show that the maximum likelihood (ML) estimates of $$ f_d $$ and $$ \tau $$ can
be obtained by maximizing the function

$$
\hat{f}_{d_{ML}}, \hat{\tau}_{ML} = \arg \max_{f_d,\tau} \left\{   \left| \hat{R}_{xd}(f_d,\tau)\right|^2\right\}~, $$

where

$$
\hat{R}_{xd}(f_d,\tau)=\frac{1}{N}\sum_{n=0}^{N-1}x_{\text{IN}}[n]d[nT_s-\tau]e^{-j 2 \pi f_d nT_s}~, $$

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

$$ T_{\text{GLRT}}\left(\mathbf{x}_{\text{IN}}\right)=\max_{f_d,\tau}\left\{ \frac{\left|\hat{R}_{xd}(f_d,\tau) \right|^2}{\hat{R}_{xx}} \right\}~, $$

where $$ \hat{R}_{xx} $$ is an estimation of the input signal power. It can
be shown that this acquisition test statistic is a Constant False
Alarm Rate (CFAR) detector because $$ P_{fa} $$ does not depend on the noise
power.

![CAF]({{ site.url }}{{ site.baseurl }}/images/caf.png)
{: style="text-align: center;"}
_GLRT statistic for Parallel Code Phase Search acquisition algoritm
for a configuration of $$ f_{IN} = 4 $$ Msps, a frequency span of $$ \pm 5 $$ kHz with steps of $$ 250 $$ Hz, and using the E1B sinBOC local replica for Galileo’s IOV satellite PRN 11[^Fernandez]._
{: style="text-align: center;"}


[^Borre06]: K. Borre, D. M. Akos, N. Bertelsen, P. Rinder, S. H. Jensen, _A Software-Defined GPS and Galileo Receiver. A Single-Frequency Approach_, 1st edition, Boston: Birkhäuser, November 2006.

[^Fernandez]: C. Fernández-Prades, J. Arribas, L. Esteve-Elfau, D. Pubill, P. Closas, [_An Open Source Galileo E1 Software Receiver_](http://www.cttc.es/wp-content/uploads/2013/03/121208-2582419-fernandez-9099698438457074772.pdf){:target="_blank"}, in Proceedings of the 6th ESA Workshop on Satellite Navigation Technologies (NAVITEC 2012), 5-7 December 2012, ESTEC, Noordwijk (The Netherlands).

## GPS L1 C/A signal acquisition

### Implementation: `GPS_L1_CA_PCPS_Acquisition`

The Parallel Code Phase Search (PCPS) method is described as follows:

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
Radio wrappers of the [FFTW library](http://www.fftw.org/){:target="_blank"}, an efficient implementation
for computing the discrete Fourier transform, wghereas the products (first and third steps in de _for_ loop) are implemented with the Vector-Optimized Library of
Kernels ([VOLK](http://libvolk.org/){:target="_blank"}), which generates processor-specific Single-Input
Multiple-Data (SIMD) assembly instructions that take advantage of
parallel computing techniques and allows writing efficient and portable
code.




```ini
;######### ACQUISITION GLOBAL CONFIG ############
Acquisition_1C.implementation=GPS_L1_CA_PCPS_Acquisition
Acquisition_1C.dump=false
Acquisition_1C.dump_filename=./acq_dump.dat
Acquisition_1C.item_type=gr_complex
Acquisition_1C.if=0
Acquisition_1C.sampled_ms=1
Acquisition_1C.pfa=0.0001
Acquisition_1C.doppler_max=10000
Acquisition_1C.doppler_step=500
```

### Implementation: `GPS_L1_CA_PCPS_Fine_Doppler_Acquisition`

### Implementation: `GPS_L1_CA_PCPS_Tong_Acquisition`

On top of the PCPS Algorithm (or any other providing the same
outputs), we could integrate results from more than one consecutive code
periods in order to enhance the *acquisition sensitivity*, understood as
the minimum signal power at which a receiver can correctly identify the
presence of a particular satellite signal in the incoming RF signal
within a given time-out interval.

## GPS L2C (M) signal acquisition

### Implementation: `GPS_L2_M_PCPS_Acquisition`

## Galileo E1B signal acquisition

### Implementation: `Galileo_E1_PCPS_Ambiguous_Acquisition`

The user can also configure the shape of $$ d[n] $$, allowing
simplifications that reduce the computational load. As shown in Figure
[fig:Rxd], in narrowband receivers the CBOC waveform can be substituted
by a sinBOC modulation with very small performance penalty @Lohan11. For
the E1B signal component, the reference signals available in our
implementation are:

$$ d_{E1B}^{(\text{CBOC})}[n] = \sum_{l=-\infty}^{+\infty}   C_{E1B}\Big[|l|_{4092}\Big]  p(t  -  lT_{c,E1B}) \cdot \left( \alpha sc_A[n]+ \beta sc_B[n] \right)~, $$

$$ \label{eq:dE1BsinBOC}
d_{E1B}^{(\text{sinBOC})}[n]= \sum_{l=-\infty}^{+\infty}  C_{E1B}\Big[|l|_{4092}\Big] p(t  -  lT_{c,E1B})  sc_A[n]~, $$

while for E1C, users can choose among:

$$ d_{E1C}^{(\text{CBOC})}[n] = \sum_{m=-\infty}^{+\infty}  \sum_{l=1}^{4092}\! C_{E1Cp}\Big[ l \Big] \! \cdot  \! p[n\! -\! mT_{c,E1Cs} - lT_{c,E1Cp}] \cdot \left( \alpha sc_A[n]+ \beta sc_B[n] \right)~, $$

$$ \nonumber d_{E1C}^{(\text{sinBOC})}[n] = \sum_{m=-\infty}^{+\infty}  \! \sum_{l=1}^{4092}C_{E1Cp}\Big[ l \Big]   \! \cdot  \!   p[n - mT_{c,E1Cs} - lT_{c,E1Cp}] \cdot sc_A[n]. $$

where the subcarriers are defined as
$$ sc_A(t)= \text{sign}\Big(\sin(2\pi f_{s,E1A}t) \Big) $$ and
$$ sc_B(t)= \text{sign} \Big( \sin( 2 \pi f_{s, E1B}t ) \Big) $$, with
$$ f_{s,E1A}=1.023 $$ MHz and $$ f_{s, E1B}=6.138 $$ MHz.

## Galileo E5a signal acquisition

### Implementation: `Galileo_E5a_Noncoherent_IQ_Acquisition_CAF`

## Assisted acquisition


-------


## References

---
title: "Tracking"
permalink: /docs/sp-blocks/tracking/
excerpt: "Documentation for the Tracking block"
sidebar:
  nav: "sp-block"
modified: 2016-04-13T15:54:02-04:00
---
{% include toc %}

The _Tracking_ block is continually receiving the data stream
$$ x_\text{IN} $$, but does nothing until it receives a “positive
acquisition” message from the control plane, along with the coarse
estimations $$ \hat{\tau}_{acq} $$ and $$ \hat{f}_{d_{acq}} $$. Then, its role
is to refine such estimations and track their changes along the time.

The role of a _Tracking_ block is to follow the evolution of the
signal synchronization parameters: code phase $$ \tau $$, Doppler shift $$ f_d $$ and carrier phase $$ \phi $$.
{: .notice--info}

According to the Maximum Likelihood approach, obtaining
the optimum estimators implies the maximization of the correlation of
the incoming signal with its _matched filter_. This is usually achieved
with closed-loop structures designed to minimize the difference between
the code phase, carrier phase and frequency of the incoming signal with
respect to a locally-generated replica.

In the case of code phase tracking, the cost function is driven to the
maximum using feedback loops that employ the derivative
$$ \frac{dR_{xd}(\tau)}{d\tau} $$ zero-crossing as a timing error detector.
This is the case of the Delay Lock Loop (DLL) architecture and its wide
range of variants, where the receiver computes three samples of $$ R_{xd} $$, usually referred to as *Early*
$$ E=R_{xd}(\hat{\tau}-\epsilon) $$, *Prompt* $$ P=R_{xd}(\hat{\tau}) $$ and
*Late* $$ L=R_{xd}(\hat{\tau}-\epsilon) $$, with $$ \epsilon $$ ranging from
$$ 0.1T_c $$ to $$ 0.5T_c $$, and then computes a timing error with some
combination of those samples, known as _discriminator_ functions.

![VOLK_GNSSDR example](https://raw.githubusercontent.com/gnss-sdr/gnss-sdr/master/src/algorithms/libs/volk_gnsssdr_module/volk_gnsssdr/docs/images/VOLK_GNSSSDR_Usage_Example.png)
_Typical diagram of a tracking block._
{: style="text-align: center;"}

The VOLK_GNSSSDR library addresses [**Efficiency**]({{ site.url }}{{ site.baseurl }}/design-forces/efficiency/){:target="_blank"} and [**Portability**]({{ site.url }}{{ site.baseurl }}/design-forces/portability/){:target="_blank"} at the same time.
{: .notice--success}

## GPS L1 C/A signal tracking

### Implementation: `GPS_L1_CA_DLL_PLL_Tracking`

|----------
|  **Global Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_hz` |  .  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `item_type` |  [`gr_complex`]: Format of data samples. It defaults to `gr_complex`. | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter. It defaults to 50 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter. It defaults to 2 Hz. | Optional |
| `early_late_space_chips` |  Spacing between Early and Prompt, and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dump` |  [`true`, `false`]: if set to `true`, it enables the Tracking internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Acquisition implementation:_ **`GPS_L1_CA_DLL_PLL_Tracking`**.
  {: style="text-align: center;"}


### Implementation: `GPS_L1_CA_DLL_PLL_C_Aid_Tracking`

|----------
|  **Global Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_hz` |  .  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `item_type` |  [`gr_complex`, `cshort`]: Format of data samples. It defaults to `gr_complex`. | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter before achieving bit synchronization. It defaults to 50 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter before achieving bit synchronization. It defaults to 2 Hz. | Optional |
| `pll_bw_narrow_hz` |  Bandwidth of the PLL low pass filter after achieving bit synchronization. It defaults to 20 Hz. | Optional |
| `dll_bw_narrow_hz` |  Bandwidth of the DLL low pass filter after achieving bit synchronization. It defaults to 2 Hz. | Optional |
| `extend_correlation_ms` |  [`1` , `2`, `4`, `5`, `10`, `20`]: extension of the correlation length, in ms, after bit synchronization is achieved. It defaults to 1 ms. Only available when using `gr_complex`. | Optional |
| `early_late_space_chips` |  Spacing between Early and Prompt, and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dump` |  [`true`, `false`]: if set to `true`, it enables the Tracking internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Tracking implementation:_ **`GPS_L1_CA_DLL_PLL_C_Aid_Tracking`**.
  {: style="text-align: center;"}


### Implementation: `GPS_L1_CA_DLL_PLL_Tracking_GPU`

|----------
|  **Global Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_hz` |  .  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `item_type` |  [`gr_complex`, `cshort`]: Format of data samples. It defaults to `gr_complex`. | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter. It defaults to 50 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter. It defaults to 2 Hz. | Optional |
| `early_late_space_chips` |  Spacing between Early and Prompt, and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dump` |  [`true`, `false`]: if set to `true`, it enables the Tracking internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Tracking implementation:_ **`GPS_L1_CA_DLL_PLL_Tracking_GPU`**.
  {: style="text-align: center;"}


## GPS L2C (M) signal tracking

|----------
|  **Global Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_hz` |  .  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `item_type` |  [`gr_complex`]: Format of data samples. It defaults to `gr_complex`. | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter. It defaults to 50 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter. It defaults to 2 Hz. | Optional |
| `early_late_space_chips` |  Spacing between Early and Prompt, and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.5 $$. | Optional |
| `dump` |  [`true`, `false`]: if set to `true`, it enables the Tracking internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Acquisition implementation:_ **`GPS_L2_M_DLL_PLL_Tracking`**.
  {: style="text-align: center;"}



## Galileo E1B signal tracking

### Implementation: `Galileo_E1_DLL_PLL_VEML_Tracking`

The Maximum likelihood (ML) estimates of $$ f_d $$ and $$ \tau $$ can be obtained by maximizing the function

$$
\hat{f}_{d_{ML}}, \hat{\tau}_{ML} = \arg \max_{f_d,\tau} \left\{   \left| \hat{R}_{xd}(f_d,\tau)\right|^2\right\}~,
$$

where

$$
\hat{R}_{xd}(f_d,\tau)=\frac{1}{N}\sum_{n=0}^{N-1}x_{\text{IN}}[n]d[nT_s-\tau]e^{-j 2 \pi f_d nT_s}~,
$$

$$ x_{\text{IN}}[n] $$ is a complex vector containing I&Q samples of the received signal, $$ T_s $$ is the sampling period, $$ \tau $$ is the code phase of the received signal with respect to a local reference,  $$ f_d $$ is the Doppler shift, $$ N $$ is the number of samples in a spreading code (4 ms for E1), and $$ d[n] $$ is a locally generated reference. The user can also configure the shape of $$ d[n] $$, allowing simplifications that reduce the computational load. For the E1B signal component, the reference signals available in our implementation are:

$$ d_{E1B}^{(\text{CBOC})}[n] = \sum_{l=-\infty}^{+\infty} C_{E1B}\Big[|l|_{4092}\Big] p(t  -  lT_{c,E1B})\cdot  \left( \alpha sc_A[n]+ \beta sc_B[n] \right)~,$$

$$ d_{E1B}^{(\text{sinBOC})}[n] = \sum_{l=-\infty}^{+\infty} C_{E1B}\Big[|l|_{4092}\Big] p(t - lT_{c,E1B}) sc_A[n]~,
$$

while for E1C, users can choose among:

$$ d_{E1C}^{(\text{CBOC})}[n] = \sum_{m=-\infty}^{+\infty} \sum_{l=1}^{4092} C_{E1Cp}\Big[ l \Big] \cdot  p[n- mT_{c,E1Cs} - lT_{c,E1Cp}] \cdot \left( \alpha sc_A[n]+ \beta sc_B[n] \right)~,
$$

$$ d_{E1C}^{(\text{sinBOC})}[n] = \sum_{m=-\infty}^{+\infty}  \sum_{l=1}^{4092}C_{E1Cp}\Big[ l \Big] \cdot  p[n - mT_{c,E1Cs} - lT_{c,E1Cp}] \cdot sc_A[n].
$$




![Rxd]({{ site.url }}{{ site.baseurl }}/images/rxd.png){:width="600x"}
{: style="text-align: center;"}
_Normalized $$ \left|R_{xd}\left(\check{f}_d=f_d, \tau \right) \right|^2 $$ for different sampling rates and local reference waveforms[^Fernandez]._
{: style="text-align: center;"}

In case of Galileo E1, the CBOC(6,1,$$ \frac{1}{11} $$) modulation creates
correlation ambiguities, as shown in the figure above. The possibility
of tracking a local maximum instead of the global one can be avoided by
using discriminators that consider two extra samples of the cost
function, referred to as *Very Early*
$$ \text{VE}=R_{xd}(\hat{\tau}-\epsilon^\prime) $$ and *Very Late*
$$ \text{VL}=R_{xd}(\hat{\tau}+\epsilon^\prime) $$, with
$$ \epsilon^\prime > \epsilon $$.

In the case of carrier tracking loops, the pilot channel E1C can be used
for the phase error estimation, since it does not contain data bit
transitions, and, theoretically, coherent integration of several code
periods can be used for as long as needed. As a consequence, a
discriminator that is insensitive to phase jumps can be used. Using pure
PLL tracking on the pilot channel as well as longer coherent integration
improves the carrier *tracking sensitivity*, the minimum signal power at
which the receiver can keep the tracking process in lock.

In addition to track the synchronization parameters, the Tracking block
must also implement code and carrier lock detectors, providing
indicators of the tracking performance.

The implementation of this block is described in Algorithm
below. The computation of the complex values VE, E, P, L and VL
in step $$ 5 $$ was implemented using the [VOLK_GNSSSDR](https://github.com/gnss-sdr/gnss-sdr/tree/master/src/algorithms/libs/volk_gnsssdr_module/volk_gnsssdr){:target="_blank"} library. The
PLL discriminator implemented in step $$ 6 $$  is the extended
arctangent (four-quadrant) discriminator, and for the DLL we used the
normalized Very Early Minus Late Power discriminator (step $$ 10 $$ ). For code lock detection
(step $$ 13 $$ ), we used the [Squared Signal-to-Noise Variance
(SNV) estimator](http://www.insidegnss.com/auto/IGM_gnss-sol-janfeb10.pdf){:target="_blank"}. In the case of carrier lock
detection (step $$ 14 $$ ), we used the normalized estimate of
the cosine of twice the carrier phase[^Dierendonck]. The values of the
lock indicator range from $$ -1 $$, when the locally generated carrier is
completely out of phase, to $$ 1 $$, that indicates a perfect match. When
either the code or the carrier detectors are below given thresholds
during a consecutive number of code periods $$ \vartheta $$, the Tracking
block informs to control plane through the message queue.


*  **Require:** Complex sample stream, $$ \mathbf{x}_{\text{IN}} $$; estimations of code
phase $$ \hat{\tau}_{acq} $$ and Doppler shift $$ \hat{f}_{d_{acq}} $$; buffer
size for power estimation, $$ \mathcal{U} $$; carrier lock detector
threshold, $$ \mathcal{T} $$; $$ CN0_{min} $$; maximum value for the lock fail
counter, $$ \vartheta $$; correlators spacing $$ \epsilon $$ and
$$ \epsilon^\prime $$; loop filters bandwidth $$ BW_{DLL} $$ and $$ BW_{PLL} $$;
integration time $$ T_{int} $$. Track signal’s synchronization parameters
within a given lock margin. Inform about a loss of lock.

1. **Initialization:** Using $$ \hat{\tau}_{acq} $$
and a sample counter $$ \mathcal{N} $$, skip samples until
$$ \mathbf{x}_{\text{IN}} $$ is aligned with local PRN replica. Set
$$ \upsilon=0 $$, $$ k=0 $$, $$ \hat{f}_{d_{0}}=\hat{f}_{d_{acq}} $$,
$$ \hat{\phi}_0=0 $$, $$ \psi_1=0 $$, $$ N_1=\text{round}(T_{int} f_{\text{IN}}) $$.

2. Increase the integration period counter: $$ k=k+1 $$.

3. Generate local code references: for $$ n=1...N_k $$,
$$ s[n]=d_{E1B/E1C_{p}}\left[\text{round}(\delta_{k} \cdot n + \psi_{k})\right] $$,
where
$$ \delta_{k}= \frac{1}{T_{c,E1B} \cdot f_{\text{IN}} }\left( 1 + \frac{\hat{f}_{d_{k-1}}}{f^{\text{(Gal E1)}}_c} \right) $$,
and the Very Early, Early, Late, and Very Late versions with $$ \epsilon $$
and $$ \epsilon^\prime $$.
4. Generate local carrier: for $$ n=1...N_k $$,
$$ c[n]=e^{-j\left(2\pi \hat{f}_{d_{k-1}} \frac{n}{f_{\text{IN}}}+\text{mod}\left(\hat{\phi}_{k-1},2\pi \right) \right)} $$.

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
$$ \hat{f}_{d_{k}}=\hat{f}_{d_{acq}}+\frac{1}{ 2\pi T_{int} } h_{PLL}\left( \Delta \hat{\phi}_{k} \right) $$.

9. Update carrier phase estimation (in rad):
$$ \hat{\phi}_k=\hat{\phi}_{k-1}+ 2 \pi \hat{f}_{d_{k}} T_{int}+ h_{PLL}(\Delta \hat{\phi}) $$.

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
$$ S = \frac{T_{int}f_{\text{IN} } }{\left( 1 + \frac{\hat{f}_{d_{k} } }{f^{\text{(Gal E1) } }_c} \right)} +\psi_{k} + h_{DLL}(\hat{\Delta \tau}_k)f_{\text{IN} }  $$.

13. Code lock indicator:
$$ \hat{ \text{CN0} } = 10 \cdot \log_{10} ( \hat{\rho}) + 10 \cdot \log_{10}(\frac{ f_{ \text{IN} } }{2} )-10 \cdot \log_{10} (L_{ \text{PRN} }) $$,
where:
$$ \hat{\rho}=\frac{ \hat{P}_s }{ \hat{P}_n } = \frac{\hat{P}_s}{\hat{P}_{tot}-\hat{P}_s} $$,
$$ \hat{P}_s = \left(\frac{1}{\mathcal{U}}\sum^{\mathcal{U}-1}_{i=0}|\text{P}_{I_{k-i}} |\right)^2 $$,
and
$$ \hat{P}_{tot} = \frac{1}{\mathcal{U}}\sum^{\mathcal{U}-1}_{i=0}|\text{P}_{k-i}|^2 $$.

14. Phase lock indicator:
$$ T_{carrier} = \frac{ \left( \sum^{\mathcal{U}-1}_{i=0} \text{P}_{ {I}_{k-i}}\right)^2 - \left( \sum^{\mathcal{U} -1}_{i=0} \text{P}_{Q_{k-i}}\right)^2}{\left(\sum^{\mathcal{U}-1}_{i=0} \text{P}_{ {I}_{k-i}}\right)^2 + \left( \sum^{\mathcal{U} -1}_{i=0} \text{P}_{Q_{k-i}}\right)^2} $$.

15. **if** $$ T_{carrier} < \mathcal{T} $$ or $$ CN0 < CN0_{min} $$
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


|----------
|  **Global Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `GNSS-SDR.internal_fs_hz` |  .  | Mandatory |
|--------------


|----------
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `item_type` |  [`gr_complex`]: Format of data samples. It defaults to `gr_complex`. | Optional |
| `pll_bw_hz` |  Bandwidth of the PLL low pass filter. It defaults to 50 Hz. | Optional |
| `dll_bw_hz` |  Bandwidth of the DLL low pass filter. It defaults to 2 Hz. | Optional |
| `early_late_space_chips` |  Spacing between Early and Prompt, and between Prompt and Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.15 $$.  | Optional |
| `very_early_late_space_chips` |  Spacing between Very Early and Prompt, and between Prompt and Very Late correlators, normalized by the chip period $$ T_c $$. It defaults to $$ 0.6 $$. | Optional |
| `dump` |  [`true`, `false`]: if set to `true`, it enables the Tracking internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./track_ch` | Optional |
|--------------

  _Acquisition implementation:_ **`Galileo_E1_DLL_PLL_VEML_Tracking`**.
  {: style="text-align: center;"}


Example:

```ini
;######### TRACKING GLOBAL CONFIG ############
Tracking_1B.implementation=Galileo_E1_DLL_PLL_VEML_Tracking
Tracking_1B.item_type=gr_complex
Tracking_1B.pll_bw_hz=20.0;
Tracking_1B.dll_bw_hz=2.0;
Tracking_1B.early_late_space_chips=0.15;
Tracking_1B.very_early_late_space_chips=0.6;
Tracking_1B.dump=false
Tracking_1B.dump_filename=../data/veml_tracking_ch_
```

## Galileo E5a signal tracking


-------

## References

[^Dierendonck]: A. J. Van Dierendonck, “GPS Receivers”, from “Global Positioning System: Theory and Applications”, Volume I, Edited by B. W. Parkinson, J. J. Spilker Jr.

[^Fernandez]: C. Fern&aacute;ndez-Prades, J. Arribas, L. Esteve-Elfau, D. Pubill, P. Closas, [_An Open Source Galileo E1 Software Receiver_](http://www.cttc.es/wp-content/uploads/2013/03/121208-2582419-fernandez-9099698438457074772.pdf){:target="_blank"}, in Proceedings of the 6th ESA Workshop on Satellite Navigation Technologies (NAVITEC 2012), 5-7 December 2012, ESTEC, Noordwijk (The Netherlands).

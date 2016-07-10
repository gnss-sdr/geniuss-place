---
title: "Tracking"
permalink: /docs/sp-blocks/tracking/
excerpt: "Documentation for the Tracking block"
sidebar:
  nav: "sp-block"
modified: 2016-04-13T15:54:02-04:00
---
{% include toc %}

The Tracking block is continually receiving the data stream
$$ x_\text{IN} $$, but does nothing until it receives a “positive
acquisition” message from the control plane, along with the coarse
estimations $$ \hat{\tau}_{acq} $$ and $$ \hat{f}_{d_{acq}} $$. Then, its role
is to refine such estimations and track their changes along the time.
Three parameters are relevant for signal tracking: the evolution of the
code phase $$ \tau $$, Doppler shift $$ f_d $$ and carrier phase $$ \phi $$.

## GPS L1 C/A signal tracking

### Implementation: `GPS_L1_CA_DLL_PLL_Tracking`

According the ML principle expressed in Equation ([eq:ML]), obtaining
the optimum estimators implies the maximization of the correlation of
the incoming signal with its matched filter. This is usually achieved
with closed-loop structures designed to minimize the difference between
the code phase, carrier phase and frequency of the incoming signal with
respect to a locally-generated replica.

In the case of code phase tracking, the cost function is driven to the
maximum using feedback loops that employ the derivative
$$ \frac{dR_{xd}(\tau)}{d\tau} $$ zero-crossing as a timing error detector.
This is the case of the Delay Lock Loop (DLL) architecture and its wide
range of variants usually applied for GPS L1 signals, where the receiver
computes three samples of $$ R_{xd} $$, usually referred to as *Early*
$$ E=R_{xd}(\hat{\tau}-\epsilon) $$, *Prompt* $$ P=R_{xd}(\hat{\tau}) $$ and
*Late* $$ L=R_{xd}(\hat{\tau}-\epsilon) $$, with $$ \epsilon $$ ranging from
$$ 0.1T_c $$ to $$ 0.5T_c $$, and then computes a timing error with some
combination of those samples, known as discriminator functions.

## GPS L2C (M) signal tracking

## Galileo E1B signal tracking

### Implementation: `Galileo_E1_DLL_PLL_VEML_Tracking`

In case of Galileo E1, the CBOC(6,1,$$ \frac{1}{11} $$) modulation creates
correlation ambiguities, as shown in Figure [fig:Rxd]. The possibility
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
in step $$ 5 $$ was implemented using the VOLK library. The
PLL discriminator implemented in step [step:atan2] is the extended
arctangent (four-quadrant) discriminator, and for the DLL we used the
normalized Very Early Minus Late Power discriminator proposed in
@Jovanovic12 (step [step:dlldiscriminator]). For code lock detection
(step [step:codelock]), we used the Squared Signal-to-Noise Variance
(SNV) estimator proposed in @Pauluzzi00. In the case of carrier lock
detection (step [step:carrierlock]), we used the normalized estimate of
the cosine of twice the carrier phase @Dierendonck95. The values of the
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

15. Increase lock fail counter $$ \upsilon \leftarrow \upsilon +1 $$. Decrease
lock fail counter $$ \upsilon \leftarrow \max(\upsilon -1,0) $$.

16. Notify the
loss of lock to the control plane through the message queue.

17. **Output**:
$$ \text{P}_k $$, accumulated carrier phase error $$ \hat{\phi}_k $$, code phase
$$ \mathcal{N} \leftarrow \mathcal{N}+ N_k + \psi_k $$, carrier-to-noise-density ratio $$ \hat{\text{CN0}} $$.
{: .notice--info}


## Galileo E5a signal tracking

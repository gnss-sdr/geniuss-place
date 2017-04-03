---
title: "GNSS Signals"
permalink: /docs/tutorials/gnss-signals/
excerpt: "Description of Open Service GNSS signals transmitted by satellites."
author_profile: false
header:
  teaser: /assets/images/Galileo_Signal_Plan_Fig_7-th.png
tags:
  - tutorial
sidebar:
  nav: "docs"
modified: 2017-04-03T09:37:02+02:00
---

{% include toc %}


A _generic_ GNSS complex baseband signal transmitted by a given GNSS space vehicle $$ i $$ can be described as

$$
s_T(t)= \sqrt{P_{T}} \sum_{u=-\infty}^{\infty}d(u)p(t-uT_{b_I}) ~,
$$

where

$$
p(t)=\sum_{k=0}^{N_{c}-1}q(t-kT_{PRN})
$$

and

$$
q(t)=\sum_{l=0}^{L_{c}-1}c_{i}(l)g_{T}(t-lT_{c}) ~,
$$


being $$ P_{T} $$ the transmitting power, $$ d(u) $$ the navigation message data
symbols, $$ T_{b} $$ the bit period,  $$ N_{c} $$ the number of
repetitions of a full codeword that spans a bit period,
$$ T_{PRN}=\frac{T_{b}}{N_{c}} $$ the codeword period,
$$ c_{i}(l) $$ a chip of a spreading codeword $$ i $$ of length
$$ L_{c} $$ chips, $$ g_{T}(t) $$ the transmitting chip pulse shape,
which is considered energy-normalized for notation clarity, and
$$ T_{c}=\frac{T_{b}}{N_{c} L_{c}} $$ is the chip period.

Particularizations of such signal structure for the different existing systems[^Fernandez11] are described below.

[^Fernandez11]: C. Fern&aacute;ndez-Prades, L. Lo Presti, E. Falleti, [Satellite Radiolocalization From GPS to GNSS and Beyond: Novel Technologies and Applications for Civil Mass–Market](http://ieeexplore.ieee.org/xpl/login.jsp?tp=&arnumber=5942139){:target="_blank"}, Proceedings of the IEEE. Special Issue on Aerospace Communications and Networking in the Next Two Decades: Current Trends and Future Perspectives. Vol 99, No. 11, pp. 1882-1904. November 2011. DOI: [10.1109/JPROC.2011.2158032](http://dx.doi.org/10.1109/JPROC.2011.2158032).

## Global Positioning System (GPS)

The Navstar Global Positioning System (GPS) is a space–based
radio–navigation system owned by the United States Government (USG) and
operated by the United States Air Force (USAF). GPS provides positioning
and timing services to military and civilian users on a continuous,
worldwide basis. Two GPS services are provided:

-   the Precise Positioning Service (PPS), available primarily to the
    military of the United States and its allies, and

-   the Standard Positioning Service (SPS) open to civilian users.

The most updated and authorized source is the [Official U.S. Government website about GPS and related topics](http://www.gps.gov/){:target="_blank"}.

### GPS L1

Defined in IS-GPS-200[^ISGPS200], this band is centered at
$$ f_{\text{GPS L1}}=1575.42 $$ MHz. The complex baseband
transmitted signal can be written as

$$ s^{\text{(GPS L1)}}_{T}(t)=e_{L1I}(t) + j e_{L1Q}(t)~,$$

with

$$ e_{L1I}(t) =  \sum_{l=-\infty}^{\infty} D_{\text{NAV}}\Big[ [l]_{204600}\Big] \oplus C_{\text{P(Y)}} \Big[ |l|_{L_{\text{P(Y)}}} \Big]   p(t -  lT_{c,\text{P(Y)}})~,\\
e_{L1Q}(t) = \sum_{l=-\infty}^{\infty} D_{\text{NAV}}\Big[ [l]_{20460}  \Big]  \oplus   C_{\text{C/A}}  \Big[ |l|_{1023} \Big] p(t - lT_{c,\text{C/A}})~ $$

where $$ \oplus $$ is the exclusive–or operation (modulo–2 addition),
$$ |l|_{L} $$ means $$ l $$ modulo $$ L $$, $$ [l]_{L} $$ means the integer part of
$$ \frac{l}{L} $$, $$ D_{\text{NAV}} $$ is the GPS navigation message bit
sequence, transmitted at $$ 50 $$ bps, $$ T_{c,\text{P(Y)}}=\frac{1}{10.23} $$
$$ \mu $$s, $$ T_{c,\text{C/A}}=\frac{1}{1.023} $$ $$ \mu $$s,
$$ L_{\text{P(Y)}}=6.1871 \cdot 10^{12} $$, and $$ p(t) $$ is a rectangular
pulse of a chip–period duration centered at $$ t=0 $$ and filtered at the
transmitter. The precision P codes (named Y codes whenever the
anti–spoofing mode is activated, encrypting the code and thus denying
non–U.S. military users) are sequences of $$ 7 $$ days in length.

Regarding the modernization plans for GPS, it is worthwhile to mention
that there is a new civilian–use signal planned, called L1C and defined
in IS-GPS-800D[^ISGPS800], to be broadcast on the same L1 frequency that currently
contains the C/A signal. The L1C signal will be available with first
Block III launch, currently scheduled for May 3, 2017, and it will feature a
Multiplexed Binary Offset Carrier (MBOC) modulation scheme that ensure
backward compatibility with the C/A signal.

The L1C signal consists of two main components; one denoted $$ L1C_P $$ to
represent a pilot signal, without any data message, that is spread by a
ranging code, and $$ L1C_D $$ that is spread by a ranging code and modulated
by a data message. The $$ L1C_P $$ is also modulated by an SV unique overlay
code, $$ L1C_O $$. The SVs could transmit intentionally “incorrect” versions
of the respective ranging codes as needed to protect users from
receiving and utilizing anomalous signals. These “incorrect” codes are
termed non-standard $$ L1C_P $$ (NSCP) and non-standard $$ L1C_D $$ (NSCD).
Non-standard codes are not for utilization by the users and, therefore,
are not defined in IS-GPS-800D.

![Spectra GPS Signals L1](http://www.navipedia.net/images/thumb/4/41/Chapter_2_Spectra_GPS_Signals_L1.png/800px-Chapter_2_Spectra_GPS_Signals_L1.png)
_GPS signals spectra in L1. Source: [Navipedia](http://www.navipedia.net/index.php/GPS_Signal_Plan){:target="_blank"}_.
{: style="text-align: center;"}

[^ISGPS200]: Global Positioning System Directorate Systems Engineering & Integration, [Interface Specification IS-GPS-200H: Navstar GPS Space Segment/Navigation User Interfaces](http://www.gps.gov/technical/icwg/IRN-IS-200H-001+002+003_rollup.pdf){:target="_blank"}, Dec. 2015.

[^ISGPS800]: Global Positioning System Directorate Systems Engineering & Integration, [Interface Specification IS-GPS-800D: Navstar GPS Space Segment/User Segment L1C Interface](http://www.gps.gov/technical/icwg/IS-GPS-800D.pdf){:target="_blank"}, Sept. 2013.

### GPS L2C

Defined in IS-GPS-200[^ISGPS200], this band is centered at
$$ f_{\text{GPS L2}}=1227.60 $$ MHz. The complex baseband
transmitted signal can be written as:

$$ s^{\text{(GPS L2)}}_{T}(t)=e_{L2I}(t) + j e_{L2Q}(t)~,$$

with the In–phase component defined as:

$$ e_{L2I}(t) =  \sum_{l=-\infty}^{\infty} D_{\text{NAV}}\Big[ [l]_{204600}\Big] \oplus C_{\text{P(Y)}} \Big[ |l|_{L_{\text{P(Y)}}} \Big]   p(t -  lT_{c,\text{P(Y)}})~, $$

with an optional presence of the navigation message $$ D_{\text{NAV}} $$. For the Quadrature–phase component, three options are defined:

$$ e_{L2Q}(t) = \sum_{l=-\infty}^{\infty} D_{\text{CNAV}} \Big[ [l]_{10230} \Big] \oplus \left(  C_{\text{CL}} \Big[ |l|_{L_{\text{CL}}} \Big] p_{\text{1/2}} \left(t - lT_{c,L2C} \right) + C_{\text{CM}} \Big[ |l|_{L_{\text{CM}}} \Big] p_{\text{1/2}}\left(t - \left(l+\frac{3}{4}\right)T_{c,L2C}\right) \right), $$

$$ e_{L2Q}(t) = \sum_{l=-\infty}^{\infty} D_{\text{NAV}} \Big[ [l]_{20460} \Big] \oplus C_{\text{C/A}} \Big[ |l|_{1023} \Big] p \left(t - lT_{c,\text{C/A}}\right) $$

or

$$ e_{L2Q}(t) = \sum_{l=-\infty}^{\infty}C_{\text{C/A}} \Big[ |l|_{1023} \Big] p(t - lT_{c,\text{C/A}})~, $$

where $$ T_{c,L2C}=\frac{1}{511.5} $$ ms and $$ p_{\text{1/2}}(t) $$ is a
rectangular pulse of half chip–period duration, thus time–multiplexing
both codes. The civilian long code $$ C_{\text{CL}} $$ is
$$ L_{\text{CL}}=767250 $$ chips long, repeating every $$ 1.5 $$ s, while the
civilian moderate code $$ C_{\text{CM}} $$ is $$ L_{\text{CL}}=10230 $$ chips
long and its repeats every $$ 20 $$ ms. The CNAV data is an upgraded version
of the original NAV navigation message, containing higher precision
representation and nominally more accurate data than the NAV data. It is
transmitted at $$ 25 $$ bps with forward error correction (FEC) encoding,
resulting in $$ 50 $$ sps.

![Spectra GPS Signals L2](http://www.navipedia.net/images/c/c4/Chapter_2_Spectra_GPS_Signals_L2.png)
_GPS signals spectra in L2. Source: [Navipedia](http://www.navipedia.net/index.php/GPS_Signal_Plan){:target="_blank"}_.
{: style="text-align: center;"}

GPS L2C is only available on Block IIR–M and subsequent satellite blocks.

### GPS L5

The GPS L5 link, defined in IS-GPS-705[^ISGPS705], is only available on Block IIF
and subsequent satellite blocks. Centered at
$$ f_{\text{GPS L5}}=1176.45 $$ MHz, this signal in space can be
written as:

$$ s^{\text{(GPS L5)}}_{T}(t)=e_{L5I}(t) +j e_{L5Q}(t)~, $$

$$ e_{L5I}(t) = \sum_{m=-\infty}^{+\infty} C_{nh_{10}} \Big[ |m|_{10}\Big] \oplus  \ D_{\text{CNAV}}\Big[ [m]_{10}\Big]    \oplus \sum_{l=1}^{102300} C_{L5I}\Big[|l|_{10230}\Big]  p(t - m T_{c,nh} - lT_{c,L5}) ~,$$


$$ e_{L5Q}(t) = \sum_{m=-\infty}^{+\infty} C_{nh_{20}} \Big[ |m|_{20}\Big]   \oplus  \sum_{l=1}^{102300}C_{L5Q}\Big[|l|_{10230}\Big] \cdot p(t - m T_{c,nh} - lT_{c,L5})~, $$

where $$ T_{c,nh}=1 $$ ms and $$ T_{c,L5}=\frac{1}{10.23} $$ $$ \mu $$s. The L5I
component contains a synchronization sequence $$ C_{nh_{10}}=0000110101 $$,
a $$ 10 $$–bit Neuman–Hoffman code that modulates each $$ 100 $$ symbols of the
GPS L5 civil navigation data $$ D_{\text{CNAV}} $$, and the L5Q component
has another synchronization sequence $$ C_{nh_{20}}=00000100110101001110 $$.

![Spectra GPS Signals L5](http://www.navipedia.net/images/7/7a/Chapter_2_Spectra_GPS_Signals_L5.png)
_GPS signals spectra in L5. Source: [Navipedia](http://www.navipedia.net/index.php/GPS_Signal_Plan){:target="_blank"}_.
{: style="text-align: center;"}

[^ISGPS705]: Global Positioning System Directorate Systems Engineering & Integration, [Interface Specification IS-GPS-705D: Navstar GPS Space Segment/User Segment L5 Interfaces](http://www.gps.gov/technical/icwg/IS-GPS-705D.pdf){:target="_blank"}, Sept. 2013.


## GLONASS

The nominal baseline constellation of the Russian Federation’s Global
Navigation Satellite System (GLONASS) comprises $$ 24 $$ GLONASS–M
satellites that are uniformly deployed in three roughly circular orbital
planes at an inclination of $$ 64.8^o $$ to the equator. The altitude of the
orbit is $$ 19,100 $$ km. The orbit period of each satellite is $$ 11 $$ hours,
$$ 15 $$ minutes, and $$ 45 $$ seconds. The orbital planes are separated by
$$ 120^o $$ right ascension of the ascending node. Eight satellites are
equally spaced in each plane with $$ 45^o $$ argument of latitude. Moreover,
the orbital planes have an argument of latitude displacement of $$ 15^o $$
relative to each other. The current constellation status can be checked at the Russian [Information and Analysis Center for Positioning, Navigation and Timing website](https://www.glonass-iac.ru/en/){:target="_blank"}.

The ground control segment of GLONASS is almost entirely located within
former Soviet Union territory, except for a station in Brasilia, Brazil.
The Ground Control Center and Time Standards is located in Moscow and
the telemetry and tracking stations are in Saint Petersburg, Ternopol,
Eniseisk, and Komsomolsk-na-Amure.

GLONASS civil signal–in–space is defined in GLONASS' ICD [^GLONASS08]. This system
makes use of a frequency–division multiple access (FDMA) signal
structure, transmitting in two bands:

 * $$ f^{(k)}_{GLO L1}=1602+k \cdot 0.5625 $$ MHz and
 * $$ f^{(k)}_{GLO L2}=1246+k \cdot 0.4375 $$ MHz,

where $$ k\in \left\{ -7,-6,\cdots,5,6\right\} $$ is the channel number.
Satellites in opposite points of an orbit plane transmit signals on
equal frequencies, as these satellites will never be in view
simultaneously by a ground–based user.

The modernization of GLONASS includes the adoption of the CDMA scheme[^GLONASS16], with new open signals called L1OC, L2OC and L3OC.

[^GLONASS16]: Global Navigation Satellite System GLONASS. [General description of the system with code division of signals](http://russianspacesystems.ru/wp-content/uploads/2016/08/IKD.-Obshh.-opis.-Red.-1.0-2016.pdf){:target="_blank"}. Revision 1.0, Moscow, Russia, 2016. (In Russian).

### GLONASS L1

Two kind of signals are transmitted: a standard precision (SP) and an
obfuscated high precision (HP) signal. The complex baseband transmitted
signal can be written as

$$ s^{\text{(GLO L1)}}_{T}(t)=e_{L1I}(t) + j e_{L1Q}(t)~, $$

with

$$ e_{L1I}(t) = \sum_{l=-\infty}^{\infty} D_{\text{GNAV}}\Big[ [l]_{102200}\Big] \oplus C_{\text{HP}} \Big[ |l|_{L_{\text{HP}}} \Big] p(t  -  lT_{c,\text{HP}})~,$$

$$ e_{L1Q}(t) = \sum_{l=-\infty}^{\infty} D_{\text{GNAV}}\Big[ [l]_{10220} \Big]  \oplus  C_{\text{SP}}  \Big[ |l|_{511} \Big] p(t - lT_{c,\text{SP}})~$$

where $$ T_{c,\text{HP}}=\frac{1}{5.11} $$ $$ \mu $$s,
$$ T_{c,\text{SP}}=\frac{1}{0.511} $$ $$ \mu $$s, and
$$ L_{\text{HP}}=3.3554\cdot 10^7 $$. The navigation message
$$ D_{\text{GNAV}} $$ is transmitted at $$ 50 $$ bps. Details of its content and
structure, as well as the generation of the $$ C_{\text{SP}} $$ code, can be
found in GLONASS' ICD [^GLONASS08]. The usage of the HP signal should be agreed with
the Russian Federation Defense Ministry, and no more details have been
disclosed.


![Spectra GLONASS Signals L1](http://www.navipedia.net/images/2/2e/GLONASS_Sig_Plan_Fig_2.png)
_GLONASS signals spectra in L1. Source: [Navipedia](http://www.navipedia.net/index.php/GLONASS_Signal_Plan){:target="_blank"}_.
{: style="text-align: center;"}

The use of FDMA techniques, in which the same code is used to broadcast
navigation signals on different frequencies, and the placement of civil
GLONASS transmissions on frequencies close to $$ 1600 $$ MHz, well above the
GPS L1 band, have complicated the design of combined GLONASS/GPS
receivers, particularly low–cost equipment for mass–market applications.

In late 2016, the Russian Federation published a new ICD related to a CDMA signal at $$ 1600.99 $$ MHz, referred to as L1OC, to be broadcast by GLONASS satellites starting by Enhanced Glonass-K1 and Glonass-K2, to be launched from 2018. This documentation is only available in Russian [^GLONASS16-1].


[^GLONASS08]: Global Navigation Satellite System GLONASS. [Interface Control Document. Navigational radiosignal in bands L1, L2](http://russianspacesystems.ru/wp-content/uploads/2016/08/ICD_GLONASS_eng_v5.1.pdf){:target="_blank"}. Edition 5.1, Moscow, Russia, 2008.

[^GLONASS16-1]: Global Navigation Satellite System GLONASS. [An open-access navigation radio signal with code division in the L1 band](http://russianspacesystems.ru/wp-content/uploads/2016/08/IKD-L1-s-kod.-razd.-Red-1.0-2016.pdf){:target="_blank"}. Revision 1.0, Moscow, Russia, 2016. (In Russian).



### GLONASS L2

Beginning with the second generation of satellites, called GLONASS–M and
first launched in 2001, a second civil signal is available using the
same SP code than the one in the L1 band but centered at $$ 1246 $$ MHz.

![Spectra GLONASS Signals L2](http://www.navipedia.net/images/4/41/GLONASS_Sig_Plan_Fig_4.png)
_GLONASS signals spectra in L2. Source: [Navipedia](http://www.navipedia.net/index.php/GLONASS_Signal_Plan){:target="_blank"}_.
{: style="text-align: center;"}

Future plans of modernization are intended to increase compatibility and
interoperability with other GNSS, and include the addition of a
code–division multiple access (CDMA) structure.

On July 2, 2013, a Russian Proton-M rocket carrying three GLONASS–M
navigation satellites [crashed](https://www.youtube.com/watch?v=HpBYCLu6kXA){:target="_blank"} soon after liftoff today from Kazakhstan’ Baikonur cosmodrome.

In late 2016, the Russian Federation published a new ICD related to a CDMA signal at $$ 1248.06 $$ MHz, referred to as L2OC and featuring a BOC(1,1) modulation, to be broadcast by GLONASS satellites starting by Enhanced Glonass-K1 and Glonass-K2, to be launched from 2018. This documentation is only available in Russian [^GLONASS16-2].

[^GLONASS16-2]: Global Navigation Satellite System GLONASS. [An open-access navigation radio signal with code division in the L2 band](http://russianspacesystems.ru/wp-content/uploads/2016/08/IKD-L2-s-kod.-razd.-Red-1.0-2016.pdf){:target="_blank"}. Revision 1.0, Moscow, Russia, 2016. (In Russian).


### GLONASS L3

In late 2016, the Russian Federation published a new ICD related to a CDMA signal at $$ 1202.025 $$ MHz, referred to as L3OC and featuring a BPSK(10) modulation, to be broadcast by GLONASS satellites starting by Glonass-M, in production since 2014. This documentation is only available in Russian [^GLONASS16-3].

[^GLONASS16-3]: Global Navigation Satellite System GLONASS. [An open-access navigation radio signal with code division in the L3 band](http://russianspacesystems.ru/wp-content/uploads/2016/08/IKD-L3-s-kod.-razd.-Red-1.0-2016.pdf){:target="_blank"}. Revision 1.0, Moscow, Russia, 2016. (In Russian).

## Galileo

The nominal Galileo constellation comprises a total of $$ 24 $$ operational
satellites (plus $$ 6 $$ active spares), that are evenly distributed among
three orbital planes inclined at $$ 56^o $$ relative to the equator. There
are eight operational satellites per orbital plane, occupying evenly
distributed orbital slots. Six additional spare satellites (two per
orbital plane) complement the nominal constellation configuration. The
Galileo satellites are placed in quasi–circular Earth orbits with a
nominal semi–major axis of about $$ 30,000 $$ km and an approximate
revolution period of $$ 14 $$ hours. The Control segment full infrastructure
will be composed of $$ 30-40 $$ sensor stations, $$ 3 $$ control centers, $$ 9 $$
Mission Uplink stations, and $$ 5 $$ TT&C stations. The current constellation status can be checked at the [European GNSS Service Centre website](http://www.gsc-europa.eu/system-status/Constellation-Information){:target="_blank"}.

Galileo’s Open Service is defined in Galileo's ICD[^GalileoICD], where the following
signal structures are specified:

### Galileo E1

This band, centered at $$ f_{\text{Gal E1}}=1575.420 $$ MHz and
with a reference bandwidth of $$ 24.5520 $$ MHz, uses the Composite Binary
Offset Carrier (CBOC) modulation, defined in baseband as:

$$ s^{\text{(Gal E1)}}_{T}(t) = \frac{1}{\sqrt{2}} \Big( e_{E1B}(t)\left( \alpha sc_A(t)+ \beta sc_B(t) \right) - e_{E1C}(t) \left( \alpha sc_A(t)- \beta  sc_B(t) \right) \Big)~, $$

where the subcarriers $$ sc(t) $$ are defined as

$$ sc_A(t) = \text{sign} \Big(\sin(2\pi f_{s,E1A}t) \Big)~, $$

$$ sc_B(t) = \text{sign} \Big(\sin(2\pi f_{s,E1B}t) \Big)~, $$

and $$ f_{s,E1A}=1.023 $$ MHz, $$ f_{s, E1B}=6.138 $$ MHz are the subcarrier
rates, $$ \alpha=\sqrt{\frac{10}{11}} $$, and $$ \beta=\sqrt{\frac{1}{11}} $$.
Channel B contains the I/NAV type of navigation message,
$$ D_{I/NAV} $$, intended for Safety–of–Life (SoL) services:

$$ e_{E1B}(t) = \sum_{l=-\infty}^{+\infty} D_{\text{I/NAV}} \Big[ [l]_{4092}\Big] \oplus C_{E1B}\Big[|l|_{4092}\Big]    p(t - lT_{c,E1B})~. $$

In case of channel C, it is a pilot (dataless) channel with a
secondary code, forming a tiered code:

$$ e_{E1C}(t) = \sum_{m=-\infty}^{+\infty}C_{E1Cs}\Big[|m|_{25}\Big] \oplus \sum_{l=1}^{4092}C_{E1Cp}\Big[ l \Big] \cdot  p(t-mT_{c,E1Cs}-lT_{c,E1Cp})~, $$

with $$ T_{c,E1B}=T_{c,E1Cp}=\frac{1}{1.023} $$ $$ \mu $$s and $$ T_{c,E1Cs}=4 $$
ms. The $$ C_{E1B} $$ and $$ C_{E1Cp} $$ primary codes are pseudorandom memory
code sequences defined in Galileo's ICD[^GalileoICD] [Annex C.7 and C.8]. The binary
sequence of the secondary code $$ C_{E1Cs} $$ is $$ 0011100000001010110110010 $$.
This band also contains another component, Galileo E1A, intended for the
Public Regulated Service (PRS), that uses a BOC modulation with
cosine–shaped subcarrier, $$ f_{s,E1A}=15.345 $$ MHz, and
$$ T_{c, E1A}=\frac{1}{2.5575} $$ $$ \mu $$s. The PRS spreading codes and the
structure of the navigation message have not been made public.

![Spectra of Galileo signals in E1. Source:
Navipedia.](http://www.navipedia.net/images/2/23/Galileo_Signal_Plan_Fig_2.png)
_Galileo signals spectra in E1. Source: [Navipedia](http://www.navipedia.net/index.php/Galileo_Signal_Plan){:target="_blank"}_.
{: style="text-align: center;"}

[^GalileoICD]: [European GNSS (Galileo) Open Service Signal In Space Interface Control Document](http://www.gsc-europa.eu/system/files/galileo_documents/Galileo_OS_SIS_ICD.pdf){:target="_blank"}, Version 1.2, Nov. 2015.

### Galileo E6

Intended for the Commercial Service and centered at
$$ f_{\text{Gal E6}}=1278.750 $$ MHz, this band provides with pilot
and data components

$$ s_{T}^{\text{(Gal E6)}}(t) = \frac{1}{\sqrt{2}}\left(e_{E6B}(t)-e_{E6C}(t)\right)~, $$

$$ e_{E6B}(t) = \sum_{m=-\infty}^{+\infty} D_{\text{C/NAV}} \Big[ [l]_{5115}\Big]  \oplus C_{E6B}\Big[|l|_{L_{E6B}}\Big] \cdot p(t - lT_{c,E6})~, $$

$$ e_{E6C}(t) = \sum_{m=-\infty}^{+\infty}C_{E6Cs}\Big[|m|_{100}\Big] \oplus \sum_{l=1}^{L_{E6C}}C_{E6Cp}\Big[ l \Big] \cdot p(t-mT_{c,E6s} -lT_{c,E6p})~, $$

where $$ D_{\text{C/NAV}} $$ is the C/NAV navigation data stream, which is
modulated with the encrypted ranging code $$ C_{E6B} $$ with chip period
$$ T_{c,E6}=\frac{1}{5.115} $$ $$\mu $$s. Codes $$ C_{E6B} $$ and primary codes
$$ C_{E6Cs} $$ and their respective lengths, $$ L_{E6B} $$ and $$ L_{E6C} $$, have
not been published. The secondary codes for the pilot component,
$$ C_{E6Cs} $$, are available in Galileo's ICD[^GalileoICD]. The receiver reference
bandwidth for this signal is $$ 40.920 $$ MHz.

This band also contains another component, Galileo E6A, intended for
PRS. It uses a BOC modulation with cosine–shaped subcarrier,
$$ f_{s,E6A}=10.23 $$ MHz, and $$ T_{c, E6A}=\frac{1}{5.115} $$ $$ \mu $$s. The PRS
spreading codes and the structure of the navigation message are not
publicly available.

![Spectra of Galileo signals in E6. Source:
Navipedia.](http://www.navipedia.net/images/e/e7/Galileo_Signal_Plan_Fig_5.png)
_Galileo signals spectra in E6. Source: [Navipedia](http://www.navipedia.net/index.php/Galileo_Signal_Plan){:target="_blank"}_.
{: style="text-align: center;"}


### Galileo E5 {#subsec:GalileoE5}

Centered at $$ f_{\text{Gal E5}}=1191.795 $$ MHz and with a total
(baseband) bandwidth of $$ 51.150 $$ MHz, its signal structure deserves some analysis.
The AltBOC modulation can be generically expressed as

$$ s^{\text{AltBOC}}(t) = x_1(t)v^{*}(t)+x_2(t)v(t)~, $$

where
$$ v(t)=\frac{1}{\sqrt{2}}\left( \text{sign}\left( \cos (2 \pi f_s t)\right)+j \text{sign}\left( \sin (2 \pi f_s t)\right)\right) $$
is the single side–band subcarrier, $$ f_s $$ is the subcarrier frequency,
$$ (\cdot)^{*} $$ stands for the conjugate operation, and $$ x_1(t) $$ and
$$ x_2(t) $$ are QPSK signals. The resulting waveform does not exhibit
constant envelope. In case of Galileo, the need for high efficiency of
the satellites’ onboard High Power Amplifier (HPA) has pushed a
modification on the signal in order to make it envelope–constant and
thus use the HPA at saturation. This can be done by adding some
inter–modulation products to the expression above, coming up
with the following definition:

$$ s^{\text{(Gal E5)}}_{T}(t) = e_{E5a}(t) ssc_s^{*}(t)+ e_{E5b}(t) ssc_s(t) +\bar{e}_{E5a}(t)ssc_p^{*}(t)+\bar{e}_{E5b}(t)ssc_p(t)~, $$

where the single and product side–band signal subcarriers are

$$ ssc_s(t) = sc_s(t) +jsc_s\left(t-\frac{T_s}{4}\right) ~, $$

$$ ssc_p(t) = sc_p(t) +jsc_p\left(t-\frac{T_s}{4}\right) ~, $$

and

$$ e_{E5a}(t) = e_{E5aI}(t)+je_{E5aQ}(t)~, $$

$$ e_{E5b}(t) = e_{E5bI}(t)+je_{E5bQ}(t)~, $$

$$ \bar{e}_{E5a}(t) = \bar{e}_{E5aI}(t)+j\bar{e}_{E5aQ}(t)~, $$

$$ \bar{e}_{E5b}(t) = \bar{e}_{E5bI}(t)+j\bar{e}_{E5bQ}(t)~, $$

$$ \bar{e}_{E5aI}(t) = e_{E5aQ}(t)e_{E5bI}(t)e_{E5bQ}(t)~, $$

$$ \bar{e}_{E5aQ}(t) = e_{E5aI}(t)e_{E5bI}(t)e_{E5bQ}(t)~, $$

$$ \bar{e}_{E5bI}(t) = e_{E5bQ}(t)e_{E5aI}(t)e_{E5aQ}(t)~, $$

$$ \bar{e}_{E5bQ}(t) = e_{E5bI}(t)e_{E5aI}(t)e_{E5aQ}(t). $$

The signal components are defined as

$$ e_{E5aI}(t) =  \sum_{m=-\infty}^{+\infty}C_{E5aIs}\Big[|m|_{20}\Big] \oplus \sum_{l=1}^{10230}C_{E5aIp}\Big[ l \Big] \oplus D_{\text{F/NAV}} \Big[ [l]_{204600}\Big] p(t-mT_{c,E5s}-lT_{c,E5p})~, $$

$$ e_{E5aQ}(t) = \sum_{m=-\infty}^{+\infty}C_{E5aQs}\Big[|m|_{100}\Big] \oplus \sum_{l=1}^{10230}C_{E5aQp}\Big[ l \Big] \cdot p(t-mT_{c,E5s}-lT_{c,E5p})~, $$

$$ e_{E5bI}(t) = \sum_{m=-\infty}^{+\infty}C_{E5bIs}\Big[|m|_{4}\Big] \oplus \sum_{l=1}^{10230}C_{E5aIp}\Big[ l \Big] \oplus D_{\text{I/NAV}} \Big[ [l]_{40920}\Big] p(t-mT_{c,E5s}-lT_{c,E5p})~, $$

$$ e_{E5bQ}(t) = \sum_{m=-\infty}^{+\infty}C_{E5bQs}\Big[|m|_{100}\Big] \oplus \sum_{l=1}^{10230}C_{E5bQp}\Big[ l \Big] \cdot p(t-mT_{c,E5s}-lT_{c,E5p})~, $$


where $$ T_{c,E5s}=1 $$ ms and $$ T_{c,E5p}=\frac{1}{10.23} $$ $$ \mu $$s. Channel
A contains the F/NAV type of navigation message, $$ D_{F/NAV} $$,
intended for the Open Service. The I/NAV message structures for the E5bI
and E1B signals use the same page layout. Only page sequencing is
different, with page swapping between both components in order to allow
a fast reception of data by a dual frequency receiver. The single
subcarrier $$ sc_s(t) $$ and the product subcarrier $$ sc_p(t) $$  are defined as:

$$ sc_s(t) = \frac{\sqrt{2}}{4}\text{sign} \left( \cos \left( 2 \pi f_s t - \frac{\pi}{4}\right) \right)+\frac{1}{2}\text{sign} \Big( \cos \left( 2 \pi f_s t \right) \Big)+\frac{\sqrt{2}}{4}\text{sign} \left( \cos \left( 2 \pi f_s t + \frac{\pi}{4}\right) \right)~, $$

$$ sc_p(t) = -\frac{\sqrt{2}}{4}\text{sign} \left( \cos \left( 2 \pi f_s t - \frac{\pi}{4}\right) \right)+ \frac{1}{2}\text{sign} \Big( \cos \left( 2 \pi f_s t \right) \Big)-\frac{\sqrt{2}}{4}\text{sign} \left( \cos \left( 2 \pi f_s t + \frac{\pi}{4}\right) \right)~, $$

with a subcarrier frequency of $$ f_s=15.345 $$ MHz.

Plotting the power spectrum of the carriers for $$ s^{\text{(Gal E5)}}_{T}(t) $$ (see Figure below), we
can see that the QPSK signal $$ e_{E5a}(t) $$ defined above is shifted
to
$$ f_{\text{Gal E5a}}\doteq f_{\text{Gal E5}}-f_s=1176.450 $$
MHz, while $$ e_{E5b}(t) $$ is shifted to
$$ f_{Gal E5b}\doteq f_{\text{Gal E5}}+f_s=1207.140 $$
MHz.

![Single and product side-band spectra in E5.]({{ "/assets/images/subcarriers-e5.png" | absolute_url }})
_Power spectrum of single and product side-band subcarriers signals for $$ s^{\text{(Gal E5)}}_{T}(t) $$, normalized to the power of $$ ssc^{*}_s(t) $$ at $$ f_{\text{Gal E5a}} $$. The modified AltBOC modulation can be well approximated by two QPSK signals $$ 2 f_s $$ apart, with negligible contribution of the crossed terms around its center frequency._[^Fernandez11]
{: style="text-align: center;"}



Thus, we can bandpass filter around $$ f_{Gal E5a} $$
and get a good approximation of a QPSK signal, with very low energy
components of $$ e_{E5b}(t) $$, $$ \bar{e}_{E5a}(t) $$, and
$$ \bar{e}_{E5b}(t) $$:

$$ s_{T}^{(Gal E5a)}(t) \simeq e_{E5aI}(t)+je_{E5aQ}(t). $$

The same applies to $$ e_{E5b}(t) $$, allowing an independent reception of
two QPSK signals and thus requiring considerably less bandwidth than the
processing of the whole E5 band.

![Spectra of Galileo signals in E5. Source:
Navipedia.](http://www.navipedia.net/images/e/e2/Galileo_Signal_Plan_Fig_7.png)
_Galileo signals spectra in E5. Source: [Navipedia](http://www.navipedia.net/index.php/Galileo_Signal_Plan){:target="_blank"}_.
{: style="text-align: center;"}


## BeiDou

People’s Republic of China was also concerned with the importance of an
accurate (and independent) navigation and timing satellite system.

According to the China National Space Administration, in a communicate
dated on May 19, 2010, the development of the system would be carried
out in three steps:

* 2000 – 2003: China built the BeiDou Satellite Navigation Experimental
  System, also known as BeiDou-1, consisting of 3 satellites. It offered
  limited coverage and applications and nowadays is not usable.
* by 2012: regional BeiDou navigation system covering China and
  neighboring regions.
* by 2020: global BeiDou navigation system.

The second generation of the system, officially called the BeiDou
Satellite Navigation System (BDS) and also formerly known as COMPASS or
BeiDou-2, will be a global satellite navigation system consisting of $$ 5 $$
geostationary satellites and $$ 30 $$ non–geostationary satellites. The
geostationary satellites will be located at $$ 58.75^o $$ E, $$ 80^o $$ E,
$$ 110.5^o $$ E, $$ 140^o $$ E and $$ 160^o $$ E. Non–geostationary satellites will
be in medium–Earth orbit (MEO) and inclined geosynchronous orbit. Global
coverage is planned by 2020. The ground segment will consist of one
Master Control Station, two Upload Stations and $$ 30 $$ Monitor Stations.

After the first geostationary satellite (located at $$ 140^o $$ E) was
launched on October 31, 2000, a second satellite (located at $$ 80^o $$ E)
and a third satellite (located at $$ 110.5^o $$ E) were launched on December
21, 2000 and May 25, 2003, respectively.  The first
geostationary satellite, COMPASS–G2, was launched on April 15, 2009.

On December 27, 2012, the Chinese government released the first version
of BeiDou’s Interface Control Document (ICD), a 77-page
document that included details of the navigation message, including
parameters of the satellite almanacs and ephemerides that were missing
from a “test version” of the ICD released exactly one year before. One year later cersion 2.0 was released, and version 2.1 followed in November 2016[^Beidou]. The wonderful Navipedia keeps track of [BeiDou status](http://www.navipedia.net/index.php/BeiDou_Future_and_Evolutions){:target="_blank"}.

![BeiDou Logo](http://www.gpsworld.com/wp-content/uploads/2013/01/BeiDou-Logo.png){:height="250px" width="250x"}{: .align-left} On December, 2012, the China Satellite Navigation Office released the
official logo of the BeiDou system, the design of which incorporates the
yin/yang symbol reflecting traditional Chinese culture, dark and light
blue coloration symbolizing, respectively, space and Earth (including
the aerospace industry), and the Big Dipper (a pattern of stars
recognized on Earth’s night sky which star components are the seven
brightest of the constellation Ursa Major) used for navigation since
ancient times to locate the North Star Polaris and representing the
first navigation device developed by China.
{: .notice--info}


It also appeared that China intended to discontinue use of COMPASS as
the English name for BeiDou. During the press briefing about publication
of the ICD, Ran Chengqi, director of China Satellite Navigation Office,
said the English designation will henceforth be BeiDou Navigation
Satellite System with the abbreviation BDS.

[^Beidou]: [BeiDou Navigation Satellite System Signal In Space Interface Control Document](http://www.beidou.gov.cn/attach/2016/11/07/21212.pdf){:target="_blank"}. Open Service Signal (Version 2.1). China Satellite Navigation Office, November 2016.



### BeiDou B1

BeiDou B1, centered at $$ f_{B1} = 1561.098 $$ MHz, features a QPSK(2) modulation. The complex baseband transmitted signal can be written as:

$$ s^{\text{(BeiDou B1)}}_{T}(t) = e_{B1I}(t) + j e_{B1Q}(t)~,$$

with

$$ e_{B1I}(t) = \sum_{l=-\infty}^{\infty} D_{\text{NAV}}\Big[ [l]_{40920}\Big] \oplus C_{\text{B1I}} \Big[ |l|_{2046} \Big]   p(t -  lT_{c,\text{B1I}})~, $$

$$ e_{B1Q}(t) = \sum_{l=-\infty}^{\infty} D_{\text{NAV}}\Big[ [l]_{\text{N/A}}  \Big]  \oplus   C_{\text{B1Q}}  \Big[ |l|_{L_{\text{B1Q}}} \Big] p(t - lT_{c,\text{B1Q}})~, $$

Beidou’s Interface Control Document version 2.1 describes the Inphase
component of the Beidou B1 link.[^Beidou] The chip rate of the B1I ranging code, $$ C_{B1I} $$ is 2.046 Mcps, and the length is 2046 chips.




### BeiDou B2


BeiDou B2, centered at $$ f_{B2} = 1207.140 $$ MHz, features a BPSK(2) modulation in the I component, and a BPSK(10) in the Q component.[^Beidou]

Next figure shows the power spectral densities of the BeiDou signals in B2.

![Spectra of BeiDou signals in B2. Source:
Navipedia.](http://www.navipedia.net/images/e/ec/Compass_Sig_Plan_Fig_3.png)
_BeiDou signals spectra in B1. Source: [Navipedia](http://www.navipedia.net/index.php/BeiDou_Signal_Plan){:target="_blank"}_.
{: style="text-align: center;"}


### BeiDou B3

Currntly, not all the technical aspects of the BeiDou B3 signals are defined yet. It probably will feature a QPSK(10) modulation centered at $$ f_{B3} = 1268.52 $$ MHz.


Next figure shows the power spectral densities of the proposed BeiDou signals in B3.



![Spectra of BeiDou signals in B3. Source:
Navipedia.](http://www.navipedia.net/images/d/de/Compass_Sig_Plan_Fig_5.png)
_BeiDou signals spectra in B1. Source: [Navipedia](http://www.navipedia.net/index.php/BeiDou_Signal_Plan){:target="_blank"}_.
{: style="text-align: center;"}


------



## References

---
title: "5.- Interoperability"
permalink: /design-forces/interoperability/
excerpt: "The ability of making systems work together."
modified: 2016-07-29T15:54:02-04:00
---
{% include toc %}

_Interoperability_ refers to the ability of making systems work together. In particular, the possibility to exchange information with other free and proprietary software, devices and systems, including GNSS signals, RF front-ends, external assistance, and all sort of information-displaying or sensor data fusion applications via standard outputs.


## Interoperability with GNSS signals

A software defined receiver needs to interoperate with GNSS signals, defined as combinations of frequency band and channel or code, from which GNSS observables (_i.e._, measurements of pseudorange, carrier phase, Doppler and signal strength) can be generated. The new signal structures for GPS, Galileo and Beidou make it possible to generate code and phase observations based on one or a combination of several channels: two-channel signals are composed of I and Q components, whereas three-channel signals of A, B, and C components.

Possible GNSS signals are listed below:

* **GPS**
  - L1 band: $$ 1575.42 $$ MHz
    * C/A; L1C (D); L1C (P); L1C (D+P); P (AS off); Z-tracking and similar (AS on); Y; M; and codeless.

  - L2 band: $$ 1227.60 $$ MHz
    * C/A; L1(C/A)+(P2-P1) (semi-codeless); L2C (M): L2C (L); L2C (M+L); P (AS off); Z-tracking and similar (AS on); Y; M; and codeless.

  - L5 band: $$ 1176.45 $$ MHz
    * I; Q; I+Q.

* **Galileo**
  - E1 band: $$ 1575.42 $$ MHz
    * A PRS;  B I/NAV OS/CS/SoL; C no data; C+B; A+B+C.

  - E5a band: $$ 1176.45 $$ MHz
    * I F/NAV OS; Q no data; I+Q.

  - E5b band: $$ 1207.14 $$ MHz
    * I I/NAV OS/CS/SoL; Q no data; I+Q.

  - E5 (E5a+E5b) band: $$ 1191.795 $$ MHz
    * I; Q; I+Q.

  - E6 band: $$ 1278.75 $$ MHz
    * A PRS; B C/NAV CS; C no data; B+C; A+B+C.


* **GLONASS**
  - G1 band: $$ 1602+k \cdot 9/16 $$ MHz,  $$ k=-7,...,+12 $$.
    * C/A; P.

  - G2 band: $$ 1246+k \cdot 716 $$ MHz
    * C/A (GLONASS M); P.

  - G3 band: $$ 1202.025 $$ MHz
    * I; Q; I+Q.


* **Beidou**
  - B1 band: $$ 1561.098 $$ MHz
    * I; Q; I+Q.

  - B2 band: $$ 1207.14 $$ MHz
    * I; Q; I+Q.

  - B3 band: $$ 1268.52 $$ MHz
    * I; Q; I+Q.


Depending of the region of use, other satellite-based signals can be available:

* **SBAS**: C/A in the L1 band; I, Q, I+Q in L5.
* **QZSS**: C/A, L1C (D), L1C (P), L1C (D+P), and L1-SAIF in the L1 band;  L2C (M), L2C (L) and L2C (M+L) in the L2 band; I, Q, and I+Q in the L5 band; and S, L, and S+L in the LEX(6) band located at $$ 1278.75 $$ MHz.
* **IRNSS**: A SPS, B RS (D), C RS (P), and B+C in the L5 band; A SPS, B RS (D), C RS (P), and B+C in the S band, located at $$ 2492.028 $$ MHz.

## Interoperability with radio frequency front-ends

## Interoperability with data collection topologies

For raw GNSS (and possibly other sensors) data stored digitally, the software receiver should support the fundamental data collection topologies, as defined by the [ION GNSS SDR Standard Working Group](https://github.com/IonMetadataWorkingGroup){:target="_blank"} (which, by the way, is _not_ related to GNSS-SDR):

* Single band, single-stream, single file.
* Multi-band, single-stream, single file.
* Multi-stream, single file.
* Multi-sensor, single file.
* Temporal splitting of files.
* Spatial splitting of files.
* Spatial-temporal splitting.

Support of sample formats for the exchange of raw GNSS data:

* Quantization: 1, 2, 4, 8, 16, 32 or 64 bits per sample.
* Encoding: sign, sign-magnitude, signed integer, offset binary or floating point.

More details in the initial draft of the [Global Navigation Satellite Systems Software Defined Radio Sampled Data Metadata Standard](https://github.com/IonMetadataWorkingGroup/MetadataSpec/blob/master/documentation/DraftMetadataStd_0_1_150125.pdf){:target="_blank"}.

## Support of output formats

The software receiver should deliver the results of the processing in several standard output formats:

* GIS-oriented formats: [KML](http://www.opengeospatial.org/standards/kml){:target="_blank"}, [GeoJSON](http://geojson.org/){:target="_blank"}, [SHP](https://en.wikipedia.org/wiki/Shapefile){:target="_blank"}.
* Application-specific messages (_e.g._, NMEA [0183](https://en.wikipedia.org/wiki/NMEA_0183){:target="_blank"} / [2000](https://en.wikipedia.org/wiki/NMEA_2000){:target="_blank"}, [ISOBUS](https://en.wikipedia.org/wiki/ISO_11783), proprietary / custom, etc.).
* [RTCM-104](http://www.rtcm.org/Pub-DGNSS.php){:target="_blank"} messages (specify version, type and rate). RTCM messages should be streamed over a communication network as defined by the Networked Transport of RTCM via Internet Protocol (NTRIP [1.0](http://epsagnss.usal.es/documentos/ntripdocumentation.pdf){:target="_blank"}, [2.0](https://ssl29.pair.com/dmarkle/puborder.php?show=3){:target="_blank"}).
* RINEX observation and navigation data files. Specify version: [2.10](https://igscb.jpl.nasa.gov/igscb/data/format/rinex210.txt){:target="_blank"}, [2.11](https://igscb.jpl.nasa.gov/igscb/data/format/rinex211.txt){:target="_blank"}, [3.00](https://igscb.jpl.nasa.gov/igscb/data/format/rinex300.pdf){:target="_blank"}, [3.02](ftp://igs.org/pub/data/format/rinex302.pdf){:target="_blank"}, [3.03](ftp://igs.org/pub/data/format/rinex303.pdf){:target="_blank"}.

## Interoperability with data link protocols

The software receiver should support several data link communication protocols, both to the digital signal source (the radio frequency front-end, the network providing a data stream) and to other systems expecting the outputs of the processing:

* Ethernet (IEEE 802.3ab / 802.3ae / others).
* Wireless LAN (IEEE 802.11 family).
* Bluetooth (specify version).
* CAN bus (see ISOBUS, standard ISO 11783).
* Serial communication: USB (specify version) / RS-232 / RS-422 / RS-485 / PCI Express / Pmod / FMC - VITA57 / SPI / I$$ ^2 $$C / MIL-STD-1553 / others.



## Indicators of Interoperability

* Number of GNSS signals, defined as combinations of frequency band and channel or code, from which GNSS observables (_i.e._, measurements of pseudorange, carrier phase, Doppler and signal strength) can be generated by the software receiver.


* Type and frequency of real-time generated RTCM messages. Specify RTCM version.

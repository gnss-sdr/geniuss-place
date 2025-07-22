---
title: "5.- Interoperability"
permalink: /design-forces/interoperability/
excerpt: "The ability of making systems work together."
header:
  teaser: /assets/images/radar-chart.png
toc: true
toc_sticky: true
last_modified_at: 2021-02-10T08:31:02+02:00
---

_Interoperability_ refers to the ability of making systems work together. In
particular, the possibility to exchange information with other free and
proprietary software, devices, and systems, including GNSS signals, RF
front-ends, external assistance, and all sort of information-displaying or
sensor data fusion applications via standard outputs.

## Interoperability with GNSS signals

A software-defined receiver needs to interoperate with GNSS signals, defined as
combinations of frequency band and channel or code, from which GNSS observables
(_i.e._, measurements of pseudorange, carrier phase, Doppler, and signal
strength) can be generated. The new signal structures for GPS, Galileo and
Beidou make it possible to generate code and phase observations based on one or
a combination of several channels: two-channel signals are composed of I and Q
components, whereas three-channel signals of A, B, and C components.

Possible GNSS signals are listed below:

- **GPS**
  - L1 band: $$ 1575.42 $$ MHz
    - C/A; L1C (D); L1C (P); L1C (D+P); P (AS off); Z-tracking and similar (AS
      on); Y; M; and codeless.
  - L2 band: $$ 1227.60 $$ MHz
    - C/A; L1(C/A)+(P2-P1) (semi-codeless); L2C (M): L2C (L); L2C (M+L); P (AS
      off); Z-tracking and similar (AS on); Y; M; and codeless.
  - L5 band: $$ 1176.45 $$ MHz
    - I; Q; I+Q.

- **Galileo**
  - E1 band: $$ 1575.42 $$ MHz
    - A PRS; B I/NAV OS/CS/SoL; C no data; C+B; A+B+C.
  - E5a band: $$ 1176.45 $$ MHz
    - I F/NAV OS; Q no data; I+Q.
  - E5b band: $$ 1207.14 $$ MHz
    - I I/NAV OS/CS/SoL; Q no data; I+Q.
  - E5 (E5a+E5b) band: $$ 1191.795 $$ MHz
    - I; Q; I+Q.
  - E6 band: $$ 1278.75 $$ MHz
    - A PRS; B C/NAV CS; C no data; B+C; A+B+C.

* **GLONASS**
  - G1 band: $$ 1602+k \cdot 9/16 $$ MHz, $$ k=-7,...,+12 $$.
    - C/A; P.
  - G2 band: $$ 1246+k \cdot 716 $$ MHz
    - C/A (GLONASS M); P.
  - G3 band: $$ 1202.025 $$ MHz
    - I; Q; I+Q.

- **Beidou**
  - B1 band: $$ 1561.098 $$ MHz
    - I; Q; I+Q.
  - B2 band: $$ 1207.14 $$ MHz
    - I; Q; I+Q.
  - B3 band: $$ 1268.52 $$ MHz
    - I; Q; I+Q.

Depending on the region of use, other satellite-based signals can be available:

- **SBAS**: C/A in the L1 band; I, Q, I+Q in L5.
- **QZSS**: C/A, L1C (D), L1C (P), L1C (D+P), and L1-SAIF in the L1 band; L2C
  (M), L2C (L) and L2C (M+L) in the L2 band; I, Q, and I+Q in the L5 band; and
  S, L, and S+L in the LEX(6) band located at $$ 1278.75 $$ MHz.
- **IRNSS**: A SPS, B RS (D), C RS (P), and B+C in the L5 band; A SPS, B RS (D),
  C RS (P), and B+C in the S band, located at $$ 2492.028 $$ MHz.

## Interoperability with radio frequency front-ends

<a name="signal-sources"></a>

Software-defined receivers intended to operate in real-time with live GNSS
signals require an "air-to-computer" interface. That is, a suitable antenna and
some hardware providing signal amplification, downshifting, filtering and
conversion to the digital domain, plus some standard connection (usually,
through USB or Ethernet) to the host computer platform executing the software
receiver.

From the software side, each radio frequency front-end brand and model requires
the availability of a _driver_, a software interface to hardware devices,
enabling operating systems and other computer programs to access hardware
functions without needing to know precise details of the hardware being used.

A driver communicates with the device through the computer bus or communications
subsystem to which the hardware connects. When a calling program invokes a
routine in the driver, the driver issues commands to the device. Once the device
sends data back to the driver, the driver may invoke routines in the original
calling program. Drivers are hardware-dependent and operating-system-specific.
They usually provide the interrupt handling required for any necessary
asynchronous time-dependent hardware interface.

## Interoperability with data collection topologies

For raw GNSS (and possibly other sensors) data stored digitally, the software
receiver should support the fundamental data collection topologies, as defined
by the
[ION GNSS SDR Standard Working Group](https://github.com/IonMetadataWorkingGroup)
(which, by the way, is _not_ related to GNSS-SDR):

- Single-band, single-stream, single file.
- Multi-band, single-stream, single file.
- Multi-stream, single file.
- Multi-sensor, single file.
- Temporal splitting of files.
- Spatial splitting of files.
- Spatial-temporal splitting.

Support of sample formats for the exchange of raw GNSS data:

- Quantization: 1, 2, 4, 8, 16, 32, or 64 bits per sample.
- Encoding: sign, sign-magnitude, signed integer, offset binary, or
  floating-point.

More details in version 1.0 of the
[Global Navigation Satellite Systems Software Defined Radio Sampled Data Metadata Standard](https://github.com/IonMetadataWorkingGroup/GNSS-Metadata-Standard/blob/master/Specifications/documentation/ION_MetadataStd_V1.0.pdf).

## Support of output formats

<a name="output-formats"></a>

The software receiver should deliver the results of the processing in several
standard output formats:

- GIS-oriented formats: [KML](https://www.ogc.org/standards/kml/),
  [GeoJSON](https://geojson.org/),
  [SHP](https://en.wikipedia.org/wiki/Shapefile).

  **KML** (Keyhole Markup Language) is an XML grammar used to encode and
  transport representations of geographic data for display in an earth browser.
  KML is an open standard officially named the OpenGIS KML Encoding Standard
  (OGC KML), and it is maintained by the Open Geospatial Consortium, Inc. (OGC).
  KML files can be displayed in geobrowsers such as
  [Google Earth](https://earth.google.com/web/),
  [Marble](https://marble.kde.org), [osgEarth](https://github.com/gwaldron/osgearth), or used
  with the [NASA World Wind SDK for Java](https://worldwind.arc.nasa.gov/java/).
  {: .notice--info}

  **GeoJSON** is a geospatial data interchange format based on JavaScript Object
  Notation (JSON) supported by numerous mapping and GIS software packages,
  including [OpenLayers](https://openlayers.org),
  [Leaflet](https://leafletjs.com), [MapServer](https://www.mapserver.org/),
  [GeoServer](https://geoserver.org/), [GeoDjango](https://www.djangoproject.com),
  [GDAL](https://gdal.org/), and [CARTO](https://carto.com/). It is also
  possible to use GeoJSON with [PostGIS](https://postgis.net) and
  [Mapnik](https://mapnik.org/), both of which handle the format via the GDAL
  OGR conversion library. The
  [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/)
  v3 directly supports the
  [integration of GeoJSON data layers](https://developers.google.com/maps/documentation/javascript/examples/layer-data-simple),
  and
  [GitHub also supports GeoJSON rendering](https://github.blog/news-insights/product-news/there-s-a-map-for-that/).
  {: .notice--info}

  **Shapefile** is a digital vector storage format for storing geometric
  location and associated attribute information. It is a popular format for
  geographic information system (GIS) software. It is developed and regulated by
  [Esri](https://www.esri.com/en-us/home) as a (mostly) open specification for
  data interoperability among Esri and other GIS software products. The
  shapefile format can spatially describe vector features: points, lines, and
  polygons, representing, for example, water wells, rivers, and lakes. Each item
  usually has attributes that describe it, such as _name_ or _temperature_.
  {: .notice--info}

- Application-specific messages (_e.g._, NMEA
  [0183](https://en.wikipedia.org/wiki/NMEA_0183) /
  [2000](https://en.wikipedia.org/wiki/NMEA_2000),
  [GPX](https://www.topografix.com/gpx.asp),
  [ISOBUS](https://en.wikipedia.org/wiki/ISO_11783), proprietary / custom,
  etc.).

  **NMEA 0183** is a combined electrical and data specification for
  communication between marine electronics such as echo sounder, sonars,
  anemometer, gyrocompass, autopilot, GPS receivers, and many other types of
  instruments. It has been defined by, and is controlled by, the U.S.
  [National Marine Electronics Association](https://www.nmea.org/). The NMEA
  0183 standard uses a simple ASCII, serial communications protocol that defines
  how data are transmitted in a _sentence_ from one _talker_ to multiple
  _listeners_ at a time. Through the use of intermediate expanders, a talker can
  have a unidirectional conversation with a nearly unlimited number of
  listeners, and using multiplexers, multiple sensors can talk to a single
  computer port. At the application layer, the standard also defines the
  contents of each sentence (message) type, so that all listeners can parse
  messages accurately. Those messages can be sent through the serial port (that
  could be for instance a Bluetooth link) and be used/displayed by a number of
  software applications such as
  [gpsd](https://gpsd.gitlab.io/gpsd/index.html "The UNIX GPS daemon"),
  [JOSM](https://josm.openstreetmap.de/ "The Java OpenStreetMap Editor"),
  [OpenCPN](https://opencpn.org/ "Open Chart Plotter Navigator"), and many
  others (and maybe running on other devices).
  {: .notice--info}

  **GPX** (the GPS Exchange Format) is a light-weight XML data format for the
  interchange of GPS data (waypoints, routes, and tracks) between applications
  and Web services on the Internet. The format is open and can be used without
  the need to pay license fees, and it is supported by a
  [large list of software tools](https://www.topografix.com/gpx_resources.asp).
  {: .notice--info}

- [RTCM-104](https://rtcm.myshopify.com/collections/differential-global-navigation-satellite-dgnss-standards/products/rtcm-10403-3-differential-gnss-global-navigation-satellite-systems-services-version-3-amendment-2-may-20-2021)
  messages (specify version, type and rate). RTCM messages should be streamed
  over a communication network as defined by the Networked Transport of RTCM via
  Internet Protocol (NTRIP
  [1.0](https://gssc.esa.int/wp-content/uploads/2018/07/NtripDocumentation.pdf),
  2.0).

  **RTCM SC-104** provides standards that define the data structure for
  differential GNSS correction information for a variety of differential
  correction applications. Developed by the Radio Technical Commission for
  Maritime Services ([RTCM](https://www.rtcm.org/ "Radio Technical Commission
  for Maritime Services")), they have become an industry standard for the
  communication of correction information. GNSS-SDR implements RTCM version 3.2,
  defined in the document _RTCM 10403.2, Differential GNSS (Global Navigation
  Satellite Systems) Services - Version 3_ (October 7, 2016). A newer version
  3.3 (August 19, 2022) can be [purchased
  online](https://rtcm.myshopify.com/collections/differential-global-navigation-satellite-dgnss-standards/products/rtcm-10403-3-differential-gnss-global-navigation-satellite-systems-services-version-3-amendment-2-may-20-2021
  "RTCM Online Publication Order Form"). The software receiver should implement
  a TCP/IP server, acting as an NTRIP source that can feed an NTRIP server.
  NTRIP (Networked Transport of RTCM via Internet Protocol) is an open standard
  protocol that can be freely downloaded from
  [here](https://gssc.esa.int/wp-content/uploads/2018/07/NtripDocumentation.pdf
  "Networked Transport of RTCM via Internet Protocol (Ntrip) Version 1.0"), and
  it is designed for disseminating differential correction data (_e.g._ in the
  RTCM-104 format) or other kinds of GNSS streaming data to stationary or mobile
  users over the Internet.
  {: .notice--info}

- RINEX observation and navigation data files. Specify version:
  [2.10](https://files.igs.org/pub/data/format/rinex210.txt),
  [2.11](https://files.igs.org/pub/data/format/rinex211.txt),
  [3.00](https://files.igs.org/pub/data/format/rinex300.pdf),
  [3.02](https://files.igs.org/pub/data/format/rinex302.pdf),
  [3.03](https://files.igs.org/pub/data/format/rinex303.pdf),
  [3.04](https://files.igs.org/pub/data/format/rinex304.pdf),
  [3.05](https://files.igs.org/pub/data/format/rinex305.pdf), or
  [4.00](https://files.igs.org/pub/data/format/rinex_4.00.pdf).

  **RINEX** (Receiver Independent Exchange Format) is an interchange format for
  raw satellite navigation system data, covering observables and the information
  contained in the navigation message broadcast by GNSS satellites. This allows
  the user to post-process the received data to produce a more accurate result
  (usually with other data unknown to the original receiver, such as better
  models of the atmospheric conditions at the time of measurement). RINEX files
  can be used by software packages such as
  [GNSSTk](https://github.com/SGL-UT/gnsstk), [RTKLIB](https://www.rtklib.com/),
  and [gLAB](https://gage.upc.edu/en/learning-materials/software-tools/glab-tool-suite),
  among many others.
  {: .notice--info}

- Custom output formats: if the software receiver needs to output data that is
  not covered by any of the above standards, there is a need for a specific
  output for a given external application, or there is a need for a structured
  data serialization mechanism. This mechanism needs to be efficient (_i. e._
  binary data instead of plain text), fast (it needs to be executed in
  real-time), portable, well-documented, and easy to read by other external
  applications (ideally, language-neutral). Support of backward and
  forward-compatible formats is a desirable feature since the number of
  parameters extracted by the software receiver tends to grow along with
  different versions. A forward-compatible serialization system should allow
  doing that without breaking existing external applications still using the old
  format. An example of an open-source software library that fulfills these
  requirements is
  [Protocol Buffers](https://protobuf.dev/), which
  allows reading data from many different languages such as C++, C#, Dart, Go,
  Java, Javascript, Ruby, Objective-C, PHP, and Python.

## Interoperability with data link protocols

The software receiver should support several data link communication protocols,
both to the digital signal source (the radio frequency front-end, the network
providing a data stream) and to other systems expecting the outputs of the
processing:

- Ethernet (IEEE 802.3ab / 802.3ae / others).
- Wireless LAN (IEEE 802.11 family).
- Bluetooth (specify version).
- CAN bus (see ISOBUS, standard ISO 11783).
- Serial communication: USB (specify version) / RS-232 / RS-422 / RS-485 / PCI
  Express / Pmod / FMC - VITA57 / SPI / I$$ ^2 $$C / MIL-STD-1553 / others.

## Indicators of Interoperability

It follows a list of possible interoperability indicators for a software-defined
GNSS receiver:

- Number of GNSS signals, defined as combinations of frequency band and channel
  or code, from which GNSS observables (_i.e._, measurements of pseudorange,
  carrier phase, Doppler and signal strength) can be generated by the software
  receiver.
- Number of GNSS signals that can be processed _at the same time_.
- Number of _device drivers_, or physical radio frequency front-ends brands /
  models the software receiver can interact to (_i.e._, configure and read
  samples from it).
  - Specify data link protocol for communication between the front-end and the
    host computer executing the software-defined GNSS receiver.
- Number of supported combinations of data collection topologies and formats.
- Number of supported standard output formats.
  - GIS formats: [KML](https://www.ogc.org/standards/kml/),
    [GeoJSON](https://geojson.org/),
    [Shapefile](https://en.wikipedia.org/wiki/Shapefile), others.
  - Application-specific formats: NMEA
    [0183](https://en.wikipedia.org/wiki/NMEA_0183) /
    [2000](https://en.wikipedia.org/wiki/NMEA_2000),
    [GPX](https://www.topografix.com/gpx.asp), others. Specify version.
  - Custom formats: portable, well-documented, easily readable by other
    programming languages, support of backward and forward-compatible formats.
  - Geodesic formats: [RINEX](https://en.wikipedia.org/wiki/RINEX),
    [RTCM-104](https://rtcm.myshopify.com/collections/differential-global-navigation-satellite-dgnss-standards/products/rtcm-10403-3-differential-gnss-global-navigation-satellite-systems-services-version-3-amendment-2-may-20-2021).
    - Generation of RINEX observation and navigation data files. Specify
      version.
    - Real-time generation of RTCM messages in real-time. Type and frequency of
      real-time generated RTCM messages. Specify RTCM version.
- Number of supported data link protocols for output data.

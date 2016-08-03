---
title: "PVT"
permalink: /docs/sp-blocks/pvt/
excerpt: "Documentation for the PVT block"
sidebar:
  nav: "sp-block"
modified: 2016-04-13T15:54:02-04:00
---
{% include toc %}

The _PVT_ block is the last one in the GNSS-SDR flow graph. Hence, it acts as a signal sink, since the stream of data flowing along the receiver ends there.

The role of a _PVT_ block is to compute navigation solutions and deliver information in adequate formats for further processing or data representation.
{: .notice--info}

Depending on the specific application or service that is exploiting the information provided by GNSS-SDR, different internal data will be required, and thus the receiver needs to provide such data in an adequate, standard format:

* For Geographic Information Systems, map representation and Earth browsers: KML and GeoJSON.
* For sensor integration: NMEA.
* For post-processing applications: RINEX.
* For real-time, possibly networked processing: RTCM messages.


Such formats are described below.


## Output formats

GNSS-SDR provides outputs in different standard formats:


* **KML** (Keyhole Markup Language) is an XML grammar used to encode and transport representations of geographic data for display in an earth browser. KML is an open standard officially named the OpenGIS KML Encoding Standard (OGC KML), and it is maintained by the Open Geospatial Consortium, Inc. (OGC). KML files can be displayed in geobrowsers such as [Google Earth](https://www.google.com/earth/), [Marble](https://marble.kde.org), [osgEarth](http://osgearth.org), or used with the [NASA World Wind SDK for Java](http://worldwind.arc.nasa.gov/java/).

   KML files are generated automatically by default, upon the first position fix obtained by the _PVT_ block.
   {: .notice--info}

* **GeoJSON** is a geospatial data interchange format based on JavaScript Object Notation (JSON) supported by numerous mapping and GIS software packages, including [OpenLayers](http://openlayers.org), [Leaflet](http://leafletjs.com), [MapServer](http://www.mapserver.org), [GeoServer](http://geoserver.org), [GeoDjango](https://www.djangoproject.com), [GDAL](http://www.gdal.org), and [CartoDB](https://cartodb.com). It is also possible to use GeoJSON with [PostGIS](http://postgis.net) and [Mapnik](http://mapnik.org), both of which handle the format via the GDAL OGR conversion library. The [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/) v3 directly supports the [integration of GeoJSON data layers](https://developers.google.com/maps/documentation/javascript/examples/layer-data-simple), and [GitHub also supports GeoJSON rendering](https://github.com/blog/1528-there-s-a-map-for-that).



* **NMEA 0183** is a combined electrical and data specification for communication between marine electronics such as echo sounder, sonars, anemometer, gyrocompass, autopilot, GPS receivers and many other types of instruments. It has been defined by, and is controlled by, the U.S. [National Marine Electronics Association](http://www.nmea.org/). The NMEA 0183 standard uses a simple ASCII, serial communications protocol that defines how data are transmitted in a *sentence* from one *talker* to multiple *listeners* at a time. Through the use of intermediate expanders, a talker can have a unidirectional conversation with a nearly unlimited number of listeners, and using multiplexers, multiple sensors can talk to a single computer port. At the application layer, the standard also defines the contents of each sentence (message) type, so that all listeners can parse messages accurately. Those messages can be sent through the serial port (that could be for instance a Bluetooth link) and be used/displayed by a number of software applications such as [gpsd](http://www.catb.org/gpsd/ "The UNIX GPS daemon"), [JOSM](https://josm.openstreetmap.de/ "The Java OpenStreetMap Editor"), [OpenCPN](http://opencpn.org/ocpn/ "Open Chart Plotter Navigator"), and many others (and maybe running on other devices).

* **RINEX** (Receiver Independent Exchange Format) is an interchange format for raw satellite navigation system data, covering observables and the information contained in the navigation message broadcast by GNSS satellites. This allows the user to post-process the received data to produce a more accurate result (usually with other data unknown to the original receiver, such as better models of the atmospheric conditions at time of measurement). RINEX files can be used by software packages such as [GPSTk](http://www.gpstk.org), [RTKLIB](http://www.rtklib.com/) and [gLAB](http://gage14.upc.es/gLAB/). GNSS-SDR by default generates RINEX version [3.02](https://igscb.jpl.nasa.gov/igscb/data/format/rinex302.pdf). If [2.11](https://igscb.jpl.nasa.gov/igscb/data/format/rinex211.txt) is needed, it can be requested through a commandline flag when invoking the software receiver:

   ```
   $ gnss-sdr --RINEX_version=2
   ```

* **RTCM SC-104** provides standards that define the data structure for differential GNSS correction information for a variety of differential correction applications. Developed by the Radio Technical Commission for Maritime Services ([RTCM](http://www.rtcm.org/overview.php#Standards "Radio Technical Commission for Maritime Services")), they have become an industry standard for communication of correction information. GNSS-SDR implements RTCM version 3.2, defined in the document *RTCM 10403.2, Differential GNSS (Global Navigation Satellite Systems) Services - Version 3* (February 1, 2013), which can be [purchased online](https://ssl29.pair.com/dmarkle/puborder.php?show=3 "RTCM Online Publication Order Form"). By default, the generated RTCM binary messages are dumped into a text file in hexadecimal format. However, GNSS-SDR is equipped with a TCP/IP server, acting as an NTRIP source that can feed an NTRIP server. NTRIP (Networked Transport of RTCM via Internet Protocol) is an open standard protocol that can be freely download from [BKG](http://igs.bkg.bund.de/root_ftp/NTRIP/documentation/NtripDocumentation.pdf "Networked Transport of RTCM via Internet Protocol (Ntrip) Version 1.0"), and it is designed for disseminating differential correction data (*e.g.* in the RTCM-104 format) or other kinds of GNSS streaming data to stationary or mobile users over the Internet. The TCP/IP server can be enabled by setting ```PVT.flag_rtcm_server=true``` in the configuration file, and will be active during the execution of the software receiver. By default, the server will operate on port 2101 (which is the recommended port for RTCM services according to the Internet Assigned Numbers Authority, [IANA](http://www.iana.org/assignments/service-names-port-numbers "Service Name and Transport Protocol Port Number Registry")), and will identify the Reference Station with ID=1234. This behaviour can be changed in the configuration


**Important:** In order to get well-formatted GeoJSON, KML and RINEX files, always terminate ```gnss-sdr``` execution by pressing key '`q`' and then key '`ENTER`'. Those files will be automatically deleted if no position fix have been obtained during the execution of the software receiver.
{: .notice--warning}

### Implementation: `GPS_L1_CA_PVT`

This _PVT_ implementation computes position fixes with a basic, memoryless Least Squares solution. Those solutions are exported to KML and GeoJSON formats for their graphical representation.

In addition, observation and navigation RINEX files are also generated by default.

If configured, this block delivers NMEA messages in real time though a serial port.

If configured, this block also generates RTCM messages in real-time, delivered through a TCP server.

Parameters:


|----------
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `averaging_depth` |  ... | Optional |
| `flag_averaging` |  ... | Optional |
| `output_rate_ms` |  ... | Optional |
| `display_rate_ms` |  ... | Optional |
| `nmea_dump_filename` |  ...| Optional |
| `flag_nmea_tty_port` |  ... | Optional |
| `nmea_dump_devname` |  ... | Optional |
| `flag_rtcm_server` |  [`true`, `false`]: | Optional |
| `rtcm_tcp_port` |  ... | Optional |
| `rtcm_station_id` |  ... | Optional |
| `rtcm_MT1019_rate_ms` |  ... | Optional |
| `rtcm_MSM_rate_ms` |  ... | Optional |
| `rtcm_dump_devname` |  . . It defaults to `/dev/pts/1`. | Optional |
| `dump` |  [`true`, `false`]: if set to `true`, it enables the PVT internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./pvt.dat`. | Optional |
|----------

Example:

```ini
;######### PVT CONFIG ############
PVT.implementation=GPS_L1_CA_PVT
PVT.nmea_dump_filename=./gnss_sdr_pvt.nmea ; NMEA log path and filename
PVT.flag_nmea_tty_port=true ; Enable the NMEA log to a serial TTY port
PVT.nmea_dump_devname=/dev/pts/4 ;serial device descriptor for NMEA log
PVT.dump=false ; Enables the PVT internal binary data file logging
```


### Implementation: `Galileo_E1_PVT`

Parameters:

|----------
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `averaging_depth` |  . It defaults to 10. | Optional |
| `flag_averaging` |  . It defaults to `false`. | Optional |
| `output_rate_ms` |  . It defaults to 500 ms. | Optional |
| `display_rate_ms` |  . It defaults to 500 ms. | Optional |
| `nmea_dump_filename` |  . It defaults to `./nmea_pvt.nmea`. | Optional |
| `flag_nmea_tty_port` |  . It defaults to `false`. | Optional |
| `nmea_dump_devname` |  .  It defaults to `/dev/tty1`. | Optional |
| `flag_rtcm_server` |  [`true`, `false`]: . It defaults to `false`. | Optional |
| `rtcm_tcp_port` |  . It defaults to 2101. | Optional |
| `rtcm_station_id` |  . It defaults to 1234. | Optional |
| `rtcm_MT1045_rate_ms` |  . It defaults to 5000 ms. | Optional |
| `rtcm_MSM_rate_ms` |  . . It defaults to 1000 ms. | Optional |
| `rtcm_dump_devname` |  . . It defaults to `/dev/pts/1`. | Optional |
| `dump` |  [`true`, `false`]: if set to `true`, it enables the PVT internal binary data file logging. It defaults to `false`. | Optional |
| `dump_filename` |  If `dump` is set to `true`, name of the file in which internal data will be stored. It defaults to `./pvt.dat`. | Optional |
|----------

### Implementation: `Hybrid_PVT`

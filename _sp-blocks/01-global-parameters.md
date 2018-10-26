---
title: "Global receiver parameters"
permalink: /docs/sp-blocks/global-parameters/
excerpt: "Documentation of global receiver parameters. Assisted GNSS."
sidebar:
  nav: "sp-block"
toc: true
toc_sticky: true
last_modified_at: 2018-10-25T15:54:02-04:00
---

This page describes GNSS-SDR global parameters.

The notation is as follows: for a global parameter `XXX` with value `YY`, its entry in the configuration file is:

```ini
GNSS-SDR.XXX=YY
```

If a parameter is not specified in the configuration file, it takes its default value.


## Sampling rate of the GNSS baseband engine

In the current design, all the processing [Channels]({{ "docs/sp-blocks/channels/" | relative_url }}) need to accept streams of samples at the same rate. This is not necessarily the same as the sampling frequency of the [Signal Source]({{ "docs/sp-blocks/signal-source/" | relative_url }}), since the [Signal Conditioner]({{ "docs/sp-blocks/signal-conditioner/" | relative_url }}) block can apply some resampling. Please note that this is a **mandatory** parameter, it needs to be present in the configuration file.

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `internal_fs_sps` |  Input sample rate to the processing channels, in samples per second.  | Mandatory |
|--------------

_Global GNSS-SDR parameters_.
{: style="text-align: center;"}

Example in the configuration file:

```ini
GNSS-SDR.internal_fs_sps=4000000
```


## Assisted GNSS with XML files

GNSS-SDR can read assistance data from [Extensible Markup Language (XML)](https://www.w3.org/XML/) files for faster [Time-To-First-Fix](https://gnss-sdr.org/design-forces/availability/#time-to-first-fix-ttff), and can store navigation data decoded from GNSS signals in the same format. Check [this folder](https://github.com/gnss-sdr/gnss-sdr/tree/next/docs/xml-schemas) for XML Schemas describing those XML files structure.


|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `AGNSS_XML_enabled` | [`true`, `false`]: If set to `true`, it enables the load of GNSS assistance data cia local XML files. It defaults to `false`. | Optional |
| `AGNSS_gps_ephemeris_xml` |  If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for GPS NAV ephemeris data. It defaults to  `gps_ephemeris.xml` | Optional |
| `AGNSS_gps_iono_xml` | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML of the XML that will be read for GPS Ionosphere model data. It defaults to  `gps_iono.xml` | Optional |
| `AGNSS_gps_utc_model_xml` | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for GPS UTC model data. It defaults to  `gps_utc_model.xml` | Optional |
| `AGNSS_gal_ephemeris_xml` | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for Galileo ephemeris data. It defaults to  `gal_ephemeris.xml`| Optional |
| `AGNSS_gal_iono_xml` | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML of the XML that will be read for Galileo Ionosphere model data. It defaults to  `gal_iono.xml` | Optional |
| `AGNSS_gal_utc_model_xml` | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for Galileo UTC model data. It defaults to  `gal_utc_model.xml` | Optional |
| `AGNSS_gps_cnav_ephemeris_xml` |  If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for GPS CNAV ephemeris data. It defaults to  `gps_cnav_ephemeris.xml` | Optional |
| `AGNSS_cnav_utc_model_xml` | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for GPS UTC model data. It defaults to  `gps_cnav_utc_model.xml` |  Optional |
|-------

_Global GNSS-SDR parameters: Assisted GNSS via XML files_.
{: style="text-align: center;"}

Example in the configuration file:

```ini
GNSS-SDR.AGNSS_XML_enabled=true
```

## Assisted GNSS with SUPL v1.0

One way of accelerating a GPS receiver's time to first fix is to use assistance data from a Secure User Plane Location (SUPL) server. SUPL is a standard produced by the Open Mobile Alliance (OMA) that allows a device such as a mobile phone to connect to a location server using the TCP/IP protocol, and to request assistance data for location.


In order to retrieve that information from a SUPL server, the device to be located needs to send some information, namely its Location Area Identity (which uniquely identifies a location area within a mobile network, and consists of the Mobile Country Code, the Mobile Network Code and the Location Area Code) and the Cell ID to which the device is connected.

These parameters are defined as follows:

  - The **Mobile Country Code (MCC)** is used in wireless telephone networks (GSM, CDMA, UMTS, LTE, etc.) in order to identify the country which a mobile subscriber belongs to. Defined by the [ITU-T Recommendation E.212](https://www.itu.int/rec/T-REC-E.212/en), this code is an integer number (three digits) represented with 16 bits.

  - The **Mobile Network Code (MNC)** is used for the international identification of networks. Jointly with the MCC, these parameters are used to to uniquely identify a mobile network operator. This code is an integer of two or three digits, depending on the country.

  - The **Location Area Code (LAC)** is a unique number of current local area. The served area of a cellular radio network is usually divided into location areas. Location areas are comprised of one or several radio cells, and each location area is given a unique number within the network - the LAC. Please note that in some networks, the LAC is called Tracking Area Code (TAC). Both the LAC and TAC share the same concept of providing the location code of a base station set. The only difference between LAC and TAC is that the LAC is the terminology used in GSM/UMTS while the TAC is the terminology used in LTE networks.

  - The **CellID (CID)** is a generally unique number used to identify each Base Transceiver Station (BTS) or sector of a BTS within a location area. While BTS is the terminology for GSM networks, this is called Node B in UMTS and eNode B in LTE networks.


Those values can be easily retrieved using any net monitor on a smartphone. There are a lot of apps that can do that (an example [here](https://play.google.com/store/apps/details?id=com.parizene.netmonitor&hl=en)). These applications are able to provide the required MMC, MNC, LAC and CI parameters for your location. A list of MCC and MNC around the World can be found at [mcc-mnc.com](http://www.mcc-mnc.com) and at the [Wikipedia](https://en.wikipedia.org/wiki/Mobile_country_code).


GNSS-SDR is a SUPL Enabled Terminal (SET) receiver that can use a TCP/IP network connection to retrieve Assisted GPS data from a remote server via the Secure User Plane Location (SUPL) v1.0 and hence accelerate its time to first fix. SUPL v1.0 only applies to GPS L1 C/A assistance.

GNSS-SDR configuration parameters for Assisted GNSS with SUPL v1.0 are shown below:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|
|--------------
| `SUPL_gps_enabled` | [`true`, `false`]: If set to `true`, it enables requests of GPS assistance data to a SUPL v1.0 server. It defaults to `false`. |  Optional |
|  `SUPL_read_gps_assistance_xml` | [`true`, `false`]: If `SUPL_gps_enabled` is set to  `true`, this parameter enables searching for local XML files instead of requesting data to the SUPL server. It defaults to `false`. |  Optional |
| `SUPL_gps_ephemeris_server` | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the name of the SUPL server asked for ephemeris data. It defaults to `supl.google.com`. |  Optional |
| `SUPL_gps_ephemeris_port` | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the port of the `SUPL_gps_ephemeris_server` server. It defaults to `7275`. |  Optional |
|  `SUPL_gps_acquisition_server` | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the name of the SUPL server asked for acquisition assistance data. It defaults to `supl.google.com`. |  Optional |
|  `SUPL_gps_acquisition_port` | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the port of the `SUPL_gps_acquisition_server` server. It defaults to `7275`.  |  Optional |
|  `SUPL_MCC` | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the Mobile Country Code (MCC) to be sent to the SUPL server. It defaults to `244`. |  Optional |
|  `SUPL_MNC` | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the Mobile Network Code (MNC) to be sent to the SUPL server. It defaults to `5`. |  Optional |
|  `SUPL_LAC` | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the Location Area Code (LAC) to be sent to the SUPL server. It defaults to `0x59e2`. |  Optional |
|  `SUPL_CI` | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the Cell ID to be sent to the SUPL server. It defaults to `0x31b0`. |  Optional |
|  `SUPL_gps_ephemeris_xml` | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the name of the XML that will be read/written if the SUPL assistance gets the GPS NAV ephemeris data. It defaults to  `gps_ephemeris.xml`. |  Optional |
|  `SUPL_gps_iono_xml` | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the name of the XML that will be read/written if the SUPL assistance gets the GPS Ionosphere model data. It defaults to  `gps_iono.xml`. |  Optional |
|  `SUPL_gps_utc_model_xml` | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the name of the XML that will be read/written if the SUPL assistance gets the GPS UTC model data. It defaults to  `gps_utc_model.xml`. |  Optional |
|-------

_Global GNSS-SDR parameters: Assisted GPS SUPL V1.0_.
{: style="text-align: center;"}

LAC and CI may be presented in a decimal or hexadecimal form, and the GNSS-SDR configuration accepts both. Setting `GNSS-SDR.SUPL_LAC=0x59e2` is equivalent to `GNSS-SDR.SUPL_LAC=23010`.

An example of GNSS-SDR configuration file follows:

```ini
GNSS-SDR.SUPL_gps_enabled=true
GNSS-SDR.SUPL_read_gps_assistance_xml=false
GNSS-SDR.SUPL_gps_ephemeris_server=supl.google.com
GNSS-SDR.SUPL_gps_ephemeris_port=7275
GNSS-SDR.SUPL_gps_acquisition_server=supl.google.com
GNSS-SDR.SUPL_gps_acquisition_port=7275
GNSS-SDR.SUPL_MCC=244
GNSS-SDR.SUPL_MNC=5
GNSS-SDR.SUPL_LAC=0x59e2
GNSS-SDR.SUPL_CI=0x31b0
```

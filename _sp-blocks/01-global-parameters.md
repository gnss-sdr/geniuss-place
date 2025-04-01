---
title: "Global receiver parameters"
permalink: /docs/sp-blocks/global-parameters/
excerpt:
  "Documentation of global receiver parameters: Sampling rate of the GNSS
  baseband engine, Telecommand and Assisted GNSS."
sidebar:
  nav: "sp-block"
toc: true
toc_sticky: true
last_modified_at: 2021-06-12T12:54:02+02:00
---

This page describes GNSS-SDR global parameters.

The notation is as follows: for a global parameter `XXX` with value `YY`, its
entry in the configuration file is:

```ini
GNSS-SDR.XXX=YY
```
{: class="no-copy"}

If a parameter is not specified in the configuration file, it takes its default
value.


## Sampling rate of the GNSS baseband engine

In the current design, all the processing [Channels]({{
"docs/sp-blocks/channels/" | relative_url }}) need to accept streams of samples
at the same rate. This is not necessarily the same as the sampling frequency of
the [Signal Source]({{ "docs/sp-blocks/signal-source/" | relative_url }}), since
the [Signal Conditioner]({{ "docs/sp-blocks/signal-conditioner/" | relative_url }})
block can apply some resampling. Please note that this is a **mandatory**
parameter, it needs to be present in the configuration file.

|----------
|        **Parameter**        | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                     **Required**                      |
| :-------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------: |
|       --------------        |
|      `internal_fs_sps`      | Input sample rate to the processing channels, in samples per second.                                                                                                                                                                                                                                                                                                                                                                                            |                       Mandatory                       |
| `use_acquisition_resampler` | [`true`, `false`]: If set to `true`, the Acquisition block makes use of the minimum possible sample rate during the signal acquisition by setting a resampler at its input. This allows reducing the FFT size when using high data rates at `internal_fs_sps`. All the required setup is configured automatically. This feature is not implemented in all the Acquisition blocks, please check the [Acquisition documentation]({{ "docs/sp-blocks/acquisition/" | relative_url }}). This parameter defaults to `false`. | Optional |
|       --------------        |

_Global GNSS-SDR parameter: channel's input sampling rate_.
{: style="text-align: center;"}

Example in the configuration file:

```ini
GNSS-SDR.internal_fs_sps=4000000
```

## Multiple signal sources

|----------
| **Parameter**  | **Description**                                   | **Required** |
| :------------: | :------------------------------------------------ | :----------: |
| `num_sources`  | Number of input signal sources. It defaults to 1. |   Optional   |
| -------------- |

Example:

```ini
GNSS-SDR.num_sources=2
```

For more details, please check [how to configure multiple signal sources]({{ "docs/sp-blocks/signal-source/#multiple-sources" | relative_url }}).

**NOTE**: This parameter is equivalent to the former parameter
`Receiver.sources_count`. The old name is still read to ensure backward
compatibility with configuration files using that nomenclature. The new name
`GNSS-SDR.num_sources` is used since GNSS-SDR v.0.0.15.
{: .notice--warning }

## Internal observables processing rate

This global parameter allows to control the internal rate at which observable
sets are processed.

|----------
|      **Parameter**       | **Description**                                                                  | **Required** |
| :----------------------: | :------------------------------------------------------------------------------- | :----------: |
| `observable_interval_ms` | Time interval, in ms, at which observable sets are processed. It defaults to 20. |   Optional   |
|      --------------      |

Example in the configuration file:

```ini
GNSS-SDR.observable_interval_ms=10
```


## Open Service Navigation Message Authentication (OSNMA)

The Galileo OSNMA service is enabled by default if the configuration file defines `1B` (that is, Galileo E1 OS) channels. 

Users must register and log in on the [European GNSS Service Centre website](https://www.gsc-europa.eu/), and download the OSNMA public key ("GSC Products > OSNMA_PublicKey", the file with `.crt` format) and the OSNMA Merkle Tree root file ("GSC Products > OSNMA_MerkleTree", in `.xml` format), and set the corresponding options in the GNSS-SDR configuration file:

|----------
| **Parameter**  | **Description**                                   | **Required** |
| :------------: | :------------------------------------------------ | :----------: |
| `osnma_enable`  | [`true`, `false`]: Enables or disables the OSNMA service. It defaults to `true`. |   Optional   |
| `osnma_public_key` | Path to the OSNMA Public Key (`.crt` file). it defaults to `./OSNMA_PublicKey_20240115100000_newPKID_1.crt` |   Optional   |
| `osnma_merkletree` | Path to the Merkle Tree root (`.xml` file). It defaults to `./OSNMA_MerkleTree_20240115100000_newPKID_1.xml` |   Optional |
| `osnma_mode` | If set to `strict`, only authenticated satellites are used in the PVT computation. If not set, the receiver will only log OSNMA events and warn the user in case of authentication failures. Please note that the `strict` mode requires the host computer's internal date and time to be synchronized with the Galileo System Time, allowing a tolerance of ±30 seconds, so it is only intended for real-time operation. No other systems than Galileo will be used in the PVT solution. |   Optional |
| -------------- |

Example in the configuration file:

```ini
GNSS-SDR.osnma_public_key=./OSNMA_PublicKey_20240115100000_newPKID_1.crt
GNSS-SDR.osnma_merkletree=./OSNMA_MerkleTree_20240115100000_newPKID_1.xml
```

The same, but with the strict mode:

```ini
GNSS-SDR.osnma_public_key=./OSNMA_PublicKey_20240115100000_newPKID_1.crt
GNSS-SDR.osnma_merkletree=./OSNMA_MerkleTree_20240115100000_newPKID_1.xml
GNSS-SDR.osnma_mode=strict
```

Example to turn off the OSNMA reception:

```ini
GNSS-SDR.osnma_enable=false
```


## Telecommand via TCP/IP

The user can access the receiver interactive interface by connecting a TCP/IP
client (_e.g._, with a telnet client) to the TCP port specified in the
configuration file for telecommand.

In order to use it, the executable `gnss-sdr` must be called with the
[gnss-sdr-harness.sh](https://github.com/gnss-sdr/gnss-sdr/blob/next/utils/scripts/gnss-sdr-harness.sh)
script provided at
[utils/scripts](https://github.com/gnss-sdr/gnss-sdr/tree/next/utils/scripts):

```console
$ gnss-sdr-harness.sh gnss-sdr -c config_file.conf
```
{: class="no-copy"}

The configuration of the Telecommand system is as follows:

|----------
|     **Parameter**      | **Description**                                                                                                                    | **Required** |
| :--------------------: | :--------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|     --------------     |
| `telecommand_enabled`  | [`true`, `false`]:  If set to `true`, it enables the telecommand system. It defaults to `false`.                                   |   Optional   |
| `telecommand_tcp_port` | If `telecommand_enabled=true`, this parameter sets the TCP/IP port in which the service will be provided. It defaults to port 3333 |   Optional   |
|     --------------     |

_Global GNSS-SDR parameters for telecommand_.
{: style="text-align: center;"}


Example in the GNSS-SDR configuration file:

```ini
GNSS-SDR.telecommand_enabled=true
GNSS-SDR.telecommand_tcp_port=3333
```


The user commands must be sent as a lower-case string, command parameters
separated by 1 space, and ended by `\r \n` (carriage-return and line feed). The
commands will provide feedback to the user.


The following commands are implemented in GNSS-SDR's telecommand interface:

|----------
|                             **Command**                              | **Response**                                                                  | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :------------------------------------------------------------------: | :---------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                            --------------                            |
|                               `reset`                                | `OK`                                                                          | Performs a complete reset of the receiver. The receiver will delete all the stored satellite information, reload the configuration parameters from the configuration file and perform a regular startup. Notice that if the configuration file has enabled the assisted acquisition, the receiver will trigger the assisted acquisition. It is equivalent to shutdown and restart the GNSS-SDR program from a regular SSH shell. Notice that the telecommand interface will be also restarted.                                                                        |
|                              `standby`                               | `OK` / `ERROR`                                                                | Stops all the acquisition and tracking operations and sets the receiver in the standby state. The front-end will continue delivering samples to the receiver but no signal processing will be done. Obviously, all the tracked satellites will be lost, but the received satellite telemetry (_e.g._ ephemeris data) and the last PVT state will be kept. NOTE: It is possible to specify an option in the configuration file to start the receiver already in the standby state, ready to receive start commands.                                                    |
|                             `coldstart`                              | `OK` / `ERROR`                                                                | Performs a receiver cold start. Requires the receiver set to standby mode. After executing this command, the acquisition engine will search for all the satellites in all the signals configured in the configuration file.                                                                                                                                                                                                                                                                                                                                           |
| `warmstart`&nbsp;`dd/mm/yyyy`&nbsp;`HH:MM:SS`&nbsp;`Lat Long Height` | `OK` / `ERROR`                                                                | Performs an assisted acquisition receiver start at the specified UTC time (the receiver will transform the UTC time to GPS time internally) assuming a previous Latitude [deg], Longitude [deg] and Height [m] position. Requires the receiver set to standby mode. After executing this command, the acquisition engine will read the ephemeris and the almanac assistance data from the [XML files specified in the configuration file](#axml), and the last valid PVT information to predict the visible satellites and coarse estimations of their Doppler rates. |
|            `hotstart dd/mm/yyyy HH:MM:SS Lat Long Height`            | `OK` / `ERROR`                                                                | Performs a receiver hot start at the specified UTC time (the receiver will transform the UTC time to GPS time internally) assuming a previous Latitude [deg], Longitude [deg] and Height [m] position. Requires the receiver set to standby mode. After executing this command, the acquisition engine will search first for the last set of in-view satellites  according to the stored ephemeris, almanac, and the predicted visible satellites based on the last valid PVT.                                                                                        |
|                               `status`                               | Summary of current receiver status: individual channel status and PVT status. | This command prints a summary of the current receiver status intended for debugging and system testing purposes only. The user should monitor the RTCM and NMEA streams for detailed and synchronized receiver data, which are the primary receiver standard data interfaces.                                                                                                                                                                                                                                                                                         |
|                                `exit`                                | `OK`                                                                          | Closes the telecommand connection.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|                            --------------                            |


Telecommand execution examples using telnet:


```console
user@ubuntu:~\$ telnet receiver_ip tc_port
Trying receiver_ip...
Connected to receiver_ip.
Escape character is '^]'.
status
---------------------------------------------------------
ch | sys | sig  | mode | Tlm | Eph | Doppler  |   CN0   |
   |     |      |      |     |     |  [Hz]    | [dB-Hz] |
---------------------------------------------------------
0  | GPS | L1CA | TRK  | YES | YES | 23412.4  |  44.3   |
1  | GPS | L1CA | TRK  | YES | YES | -14725.4 |  45.4   |
2  | GPS | L1CA | TRK  | YES | YES | 4562.1   |  41.0   |
3  | GPS | L1CA | TRK  | YES | YES | 15223.4  |  38.2   |
4  | GPS | L1CA | TRK  | YES | NO  |-8456.0   |  40.5   |
5  | GPS | L1CA | ACQ  | NO  | NO  | -------- |  ----   |
6  | GPS | L1CA | STBY | NO  | NO  | -------- |  ----   |
---------------------------------------------------------

- Receiver UTC Time: 02/04/2017 21:02:33
- Receiver Position WGS84 [Lat, Long, H]: 41.2750209, 1.98558393, 58.1
- Receiver Speed over Ground [km/h]: 2
- Receiver Course over ground [deg]: 175.3
```
{: class="no-copy"}
_Example of the `status` command_.
{: style="text-align: center;"}



```console
user@ubuntu:~\$ telnet receiver_ip tc_port
Trying receiver_ip...
Connected to receiver_ip.
Escape character is '^]'.
standby
OK
coldstart
OK
```
{: class="no-copy"}
_Example of the `coldstart` command_.
{: style="text-align: center;"}



```console
user@ubuntu:~\$ telnet receiver_ip tc_port
Trying receiver_ip...
Connected to receiver_ip.
Escape character is '^]'.
standby
OK
warmstart 1/12/2018 09:15:42 41.234 1.76 560.0
OK
```
{: class="no-copy"}
_Example of the `warmstart` command_.
{: style="text-align: center;"}


## Assisted GNSS

GNSS-SDR can read satellite's ephemeris and almanacs from other sources than
GNSS signals themselves.



<a name="axml"></a>

### Assisted GNSS via XML files


GNSS-SDR can read assistance data from [Extensible Markup Language
(XML)](https://www.w3.org/XML/) files for faster
[Time-To-First-Fix](https://gnss-sdr.org/design-forces/availability/#time-to-first-fix-ttff),
and can store navigation data decoded from GNSS signals in the same format.
Check [this
folder](https://github.com/gnss-sdr/gnss-sdr/tree/main/docs/xml-schemas) for
XML Schemas describing those XML files structure.

When reading AGNSS data from XML files, you must provide a rough initial
reference position and time (parameters `AGNSS_ref_location` and
`AGNSS_ref_utc_time`), which will be used to compute the list of visible
satellites (those with positive elevation angle) from your receiver standpoint
before getting any GNSS signal. Hence, the receiver can start searching for
those satellites and thus accelerate its Time-To-First-Fix.

|----------
|         **Parameter**          | **Description**                                                                                                                                                                                                                                                                                                                                | **Required** |
| :----------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|         --------------         |
|      `AGNSS_XML_enabled`       | [`true`, `false`]: If set to `true`, it enables the load of GNSS assistance data via local XML files. It defaults to `false`.                                                                                                                                                                                                                  |   Optional   |
|      `AGNSS_ref_location`      | If `AGNSS_XML_enabled` is set to  `true`, this parameter is mandatory, and it sets the reference location used for the preliminary computation of visible satellites from AGNSS data. It must be in the format: `Latitude,Longitude`, in degrees, with a positive sign for North and East.                                                     |  Mandatory   |
|      `AGNSS_ref_utc_time`      | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the reference local time, expressed in UTC, used for the preliminary computation of visible satellites from AGNSS data. It must be in the format: `DD/MM/YYYY HH:MM:SS`, referred to UTC. If this parameter is not set, the receiver will take the system time of your computer. |   Optional   |
|   `AGNSS_gps_ephemeris_xml`    | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for GPS NAV ephemeris data. It defaults to  `gps_ephemeris.xml`                                                                                                                                                                            |   Optional   |
|      `AGNSS_gps_iono_xml`      | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML of the XML that will be read for GPS Ionosphere model data. It defaults to  `gps_iono.xml`                                                                                                                                                                   |   Optional   |
|   `AGNSS_gps_utc_model_xml`    | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for GPS UTC model data. It defaults to  `gps_utc_model.xml`                                                                                                                                                                                |   Optional   |
|   `AGNSS_gal_ephemeris_xml`    | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for Galileo ephemeris data. It defaults to  `gal_ephemeris.xml`                                                                                                                                                                            |   Optional   |
|      `AGNSS_gal_iono_xml`      | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for Galileo Ionosphere model data. It defaults to  `gal_iono.xml`                                                                                                                                                                          |   Optional   |
|   `AGNSS_gal_utc_model_xml`    | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for Galileo UTC model data. It defaults to  `gal_utc_model.xml`                                                                                                                                                                            |   Optional   |
|    `AGNSS_gal_almanac_xml`     | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for Galileo almanac data. The XML format of [Galileo almanac data published by the European GNSS Service Centre](https://www.gsc-europa.eu/gsc-products/almanac) is also accepted. It defaults to `gal_almanac.xml`                        |   Optional   |
| `AGNSS_gps_cnav_ephemeris_xml` | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for GPS CNAV ephemeris data. It defaults to  `gps_cnav_ephemeris.xml`                                                                                                                                                                      |   Optional   |
|   `AGNSS_cnav_utc_model_xml`   | If `AGNSS_XML_enabled` is set to  `true`, this parameter sets the name of the XML that will be read for GPS UTC model data. It defaults to  `gps_cnav_utc_model.xml`                                                                                                                                                                           |   Optional   |
|            -------             |

_Global GNSS-SDR parameters: Assisted GNSS via XML files_.
{: style="text-align: center;"}

Example in the configuration file:

```ini
GNSS-SDR.AGNSS_XML_enabled=true
GNSS-SDR.AGNSS_ref_location=41.39,2.31
```

The location in the example refers to a latitude of 41.39º N and a longitude of
2.31º E.


Please note that the parameter `AGNSS_gal_almanac_xml` accepts, in addition to
the [own-defined XML
format](https://github.com/gnss-sdr/gnss-sdr/blob/next/docs/xml-schemas/gal_almanac_map.xsd)
for the Galileo almanac, the XML format published by the European GNSS Service
Centre and available
[here](https://www.gsc-europa.eu/gsc-products/almanac). Just download the
latest almanac XML file from there, and set the following parameters in your
configuration file:

```ini
GNSS-SDR.AGNSS_XML_enabled=true
GNSS-SDR.AGNSS_ref_location=41.39,2.31
GNSS-SDR.AGNSS_ref_utc_time=22/11/2018 17:45:53
GNSS-SDR.AGNSS_gal_almanac_xml=2018-11-06.xml
```

(changing `2018-11-06.xml` by the name of the file you actually downloaded, as
well as your reference position) and the format will be detected and read
automatically. If `AGNSS_ref_utc_time` is not set, the receiver will read the
system time from the computer executing the software receiver and will take that
as a reference. So, if you are using the receiver with live signals from an RF
front-end, you do not need to set this parameter.

You could find useful the utility program
[rinex2assist](https://github.com/gnss-sdr/gnss-sdr/tree/next/utils/rinex2assist)
for the generation of compatible XML files from recent, publicly available RINEX
navigation data files.

### Assisted GNSS via SUPL v1.0

One way of accelerating a GNSS receiver's Time-To-First-Fix is to use assistance
data from a Secure User Plane Location (SUPL) server. SUPL is a standard
produced by the Open Mobile Alliance (OMA) that allows a device such as a mobile
phone to connect to a location server using the TCP/IP protocol, and to request
assistance data for location.


In order to retrieve that information from a SUPL server, the device to be
located needs to send some information, namely its Location Area Identity (which
uniquely identifies a location area within a mobile network, and consists of the
Mobile Country Code, the Mobile Network Code and the Location Area Code) and the
Cell ID to which the device is connected.

These parameters are defined as follows:

  - The **Mobile Country Code (MCC)** is used in wireless telephone networks
  (GSM, CDMA, UMTS, LTE, etc.) in order to identify the country to which a
  mobile subscriber belongs. Defined by the [ITU-T Recommendation
  E.212](https://www.itu.int/rec/T-REC-E.212/en), this code is an integer number
  (three digits) represented with 16 bits.

  - The **Mobile Network Code (MNC)** is used for the international
  identification of networks. Jointly with the MCC, these parameters are used to
  uniquely identify a mobile network operator. This code is an integer of two or
  three digits, depending on the country.

  - The **Location Area Code (LAC)** is a unique number of the current local
  area. The served area of a cellular radio network is usually divided into
  location areas. Location areas are comprised of one or several radio cells,
  and each location area is given a unique number within the network - the LAC.
  Please note that in some networks, the LAC is called Tracking Area Code (TAC).
  Both the LAC and TAC share the same concept of providing the location code of
  a base station set. The only difference between LAC and TAC is that the LAC is
  the terminology used in GSM/UMTS while the TAC is the terminology used in LTE
  networks.

  - The **Cell ID (CID)** is a generally unique number used to identify each
  Base Transceiver Station (BTS) or sector of a BTS within a location area code.
  While BTS is the terminology for GSM networks, this is called Node B in UMTS
  and eNode B in LTE networks. Valid values for the CID range from $$ 0 $$ to $$
  65535 $$, that is, ($$ 2^{16} − 1 $$), on GSM and CDMA networks and from $$ 0 $$
  to $$ 268435455 $$, that is, ($$ 2^{28} − 1 $$), on UMTS and LTE networks.


Those values can be easily retrieved using any net monitor on a smartphone.
There are a lot of apps that can do that (an example
[here](https://play.google.com/store/apps/details?id=com.parizene.netmonitor&hl=en)).
These applications are able to provide the required MMC, MNC, LAC, and CI
parameters for your location. A list of MCC and MNC around the World can be
found at [mcc-mnc.com](https://mcc-mnc.com/) and at the
[Wikipedia](https://en.wikipedia.org/wiki/Mobile_country_code).


GNSS-SDR is a SUPL Enabled Terminal (SET) receiver that can use a TCP/IP network
connection to retrieve Assisted GPS data from a remote server via the Secure
User Plane Location (SUPL) v1.0 and hence accelerate its Time-To-First-Fix. SUPL
v1.0 only applies to GPS L1 C/A assistance.

GNSS-SDR configuration parameters for Assisted GNSS with SUPL v1.0 are shown
below:

|----------
|         **Parameter**          | **Description**                                                                                                                                                                                         | **Required** |
| :----------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------: |
|         --------------         |
|       `SUPL_gps_enabled`       | [`true`, `false`]: If set to `true`, it enables requests of GPS assistance data to a SUPL v1.0 server. It defaults to `false`.                                                                          |   Optional   |
| `SUPL_read_gps_assistance_xml` | [`true`, `false`]: If `SUPL_gps_enabled` is set to  `true`, this parameter enables searching for local XML files instead of requesting data to the SUPL server. It defaults to `false`.                 |   Optional   |
|  `SUPL_gps_ephemeris_server`   | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the name of the SUPL server asked for ephemeris data. It defaults to `supl.google.com`.                                                    |   Optional   |
|   `SUPL_gps_ephemeris_port`    | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the port of the `SUPL_gps_ephemeris_server` server. It defaults to `7275`.                                                                 |   Optional   |
| `SUPL_gps_acquisition_server`  | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the name of the SUPL server asked for acquisition assistance data. It defaults to `supl.google.com`.                                       |   Optional   |
|  `SUPL_gps_acquisition_port`   | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the port of the `SUPL_gps_acquisition_server` server. It defaults to `7275`.                                                               |   Optional   |
|           `SUPL_MCC`           | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the Mobile Country Code (MCC) to be sent to the SUPL server. It defaults to `244`.                                                         |   Optional   |
|           `SUPL_MNC`           | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the Mobile Network Code (MNC) to be sent to the SUPL server. It defaults to `5`.                                                           |   Optional   |
|           `SUPL_LAC`           | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the Location Area Code (LAC) to be sent to the SUPL server. It defaults to `0x59e2`.                                                       |   Optional   |
|           `SUPL_CI`            | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the Cell ID to be sent to the SUPL server. It defaults to `0x31b0`.                                                                        |   Optional   |
|    `SUPL_gps_ephemeris_xml`    | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the name of the XML that will be read/written if the SUPL assistance gets the GPS NAV ephemeris data. It defaults to  `gps_ephemeris.xml`. |   Optional   |
|      `SUPL_gps_iono_xml`       | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the name of the XML that will be read/written if the SUPL assistance gets the GPS Ionosphere model data. It defaults to  `gps_iono.xml`.   |   Optional   |
|    `SUPL_gps_utc_model_xml`    | If `SUPL_gps_enabled` is set to  `true`, this parameter sets the name of the XML that will be read/written if the SUPL assistance gets the GPS UTC model data. It defaults to  `gps_utc_model.xml`.     |   Optional   |
|            -------             |

_Global GNSS-SDR parameters: Assisted GPS via SUPL V1.0_.
{: style="text-align: center;"}

LAC and CI may be presented in a decimal or hexadecimal form, and the GNSS-SDR
configuration accepts both. Setting `GNSS-SDR.SUPL_LAC=0x59e2` is equivalent to
`GNSS-SDR.SUPL_LAC=23010`.

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

## Self-assistance in multi-frequency receivers

In case the receiver is configured to work with signals from different frequency
bands from the same satellite (for instance, GPS L1 and GPS L5, Galileo E1 and
E5a, etc.), GNSS-SDR makes use of the acquisition parameters obtained in the
primary band to accelerate acquisition in the secondary band(s). This allows
reducing the computational load (since the search grid in the secondary band(s)
can be smaller) and the acquisition-to-tracking latency. This behavior can be
deactivated by setting this parameter to `false`, which makes the receiver
search satellites in each band independently.

|----------
|        **Parameter**        | **Description**                                                                                                                                                                                                                                   | **Required** |
| :-------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------: |
|       --------------        |
| `assist_dual_frequency_acq` | [`true`, `false`]: If set to `true`, it enables the assistance to acquisition from primary to secondary bands in dual-frequency configurations. If set to `false`, satellites are searched for independently in each band. It defaults to `true`. |   Optional   |
|           -------           |

Example for satellites searched independently in each band:

```ini
GNSS-SDR.assist_dual_frequency_acq=false
```


## Banned satellites

By default, GNSS-SDR searches for all the available satellites by PRN
identification, from 1 up to the nominal maximum identifier (32 for GPS, 36 for
Galileo, and so on). The order in which they are searched for can be altered if
assisted GNSS is enabled, but all of them will be eventually processed as long
as there are channels available.

The following parameters allow to remove specific satellites from the list of
potentially available ones:

|----------
|     **Parameter**     | **Description**                                                                                                                                 | **Required** |
| :-------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|    --------------     |
|   `GPS_banned_prns`   | List of GPS satellites, by PRN, that will be removed from the list of available satellites and will not be processed. It defaults to empty.     |   Optional   |
| `Galileo_banned_prns` | List of Galileo satellites, by PRN, that will be removed from the list of available satellites and will not be processed. It defaults to empty. |   Optional   |
| `Glonass_banned_prns` | List of GLONASS satellites, by PRN, that will be removed from the list of available satellites and will not be processed. It defaults to empty. |   Optional   |
| `Beidou_banned_prns`  | List of Beidou satellites, by PRN, that will be removed from the list of available satellites and will not be processed. It defaults to empty.  |   Optional   |
|        -------        |

With these parameters, users can specify lists of satellites that will not be
processed. Satellites on those lists will never be assigned to a processing
channel.

Example: since Galileo E14 and E18 satellites are not usable for PVT, they can
be removed from the list of Galileo searched satellites by setting:

```ini
GNSS-SDR.Galileo_banned_prns=14,18
```



## Processing old data files

If you are processing raw data files containing GPS L1 C/A signals dated before
July 14, 2009, you can set this parameter to `true` in order to get the right
date and time, with the corresponding adjustment to the week rollover.


|----------
|  **Parameter**  | **Description**                                                                                                                                                                                                         | **Required** |
| :-------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
| --------------  |
| `pre_2009_file` | [`true`, `false`]: If you are processing raw data files containing GPS L1 C/A signals dated before July 14, 2009, you can set this parameter to `true` in order to get the right date and time. It defaults to `false`. |   Optional   |
|     -------     |

Example:



```ini
GNSS-SDR.pre_2009_file=true
```

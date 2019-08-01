---
title: "My first position fix"
permalink: /my-first-fix/
excerpt: "How to quickly get a position fix with GNSS-SDR."
last_modified_at: 2017-09-03T13:54:02+02:00
header:
  teaser: "/assets/images/gn3s_pvt_4_sats.jpg"
sidebar:
  nav: "start"
toc: true
toc_sticky: true
---

**This page is the "_Hello, world!_&nbsp;" for GNSS-SDR**. It will guide you from the scratch up to getting position fixes with GNSS-SDR, in one of its simplest configurations. The signal source will be a file (freely available on the Internet) containing raw signal samples, so this procedure does not require the availability of a radio frequency front-end nor a powerful computer executing the software receiver. The only requirement is GNSS-SDR installed in your computer, and an Internet connection to download the file containing the raw signal samples.
{: .notice--info}

## Step 1: Verify that GNSS-SDR is installed

This guide assumes that GNSS-SDR and its software dependencies are already installed on your system. In order to check whether it is correctly installed, open a terminal and type:

```bash
$ gnss-sdr --version
```

you should see something similar to:

```bash
$ gnss-sdr --version
gnss-sdr version 0.0.11
$  
```

Please check that your installed version is 0.0.11 (or something like 0.0.11.git-`branchname`-`githash` if you built the code from a source code snapshot). Older versions could not work for the example shown here. If you installed GNSS-SDR by doing `sudo apt-get install gnss-sdr` and you got a version earlier to 0.0.11, please do `sudo apt-get remove gnss-sdr` and [build it from source]({{ "/build-and-install/#build" | relative_url }}).
{: .notice--warning}

If you see something like:

```bash
$ gnss-sdr --version
gnss-sdr: command not found
$  
```

please check out the [building guide]({{ "/build-and-install/" | relative_url }}) and the [README.md](https://github.com/gnss-sdr/gnss-sdr/blob/master/README.md) file for more details on how to install GNSS-SDR.

In order to take advantage of the SIMD instruction sets present in your processor, you will need to run the profiler tools of the VOLK and VOLK_GNSSSDR libraries (these operations only need to be done once, and can take a while):

```bash
$ volk_profile
```

and

```bash
$ volk_gnsssdr_profile
```

## Step 2: Download a file of raw signal samples

Now it's time to download the file containing the GNSS raw signal samples. This can be done directly from the terminal:

```bash
$ mkdir work
$ cd work
$ wget https://sourceforge.net/projects/gnss-sdr/files/data/2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.tar.gz
$ tar -zxvf 2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.tar.gz
```

or by opening [this link](https://sourceforge.net/projects/gnss-sdr/files/data/2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.tar.gz/download) in your browser, downloading the file and unpacking it. This will get you the file `2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.dat`, which contains $$ 100 $$ seconds of raw GNSS signal samples collected by an RF front-end centered at $$ 1,575.42 $$ MHz, that was delivering baseband samples at $$ 4 $$ MS/s, in an interleaved I&Q 16-bit integer format.


## Step 3: Configure GNSS-SDR

Then, copy the GNSS-SDR configuration shown below and paste it into your favorite plain text editor:

```ini
[GNSS-SDR]

;######### GLOBAL OPTIONS ##################
GNSS-SDR.internal_fs_sps=2000000

;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=File_Signal_Source
SignalSource.filename=/home/your-username/work/data/2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.dat
SignalSource.item_type=ishort
SignalSource.sampling_frequency=4000000
SignalSource.freq=1575420000
SignalSource.samples=0

;######### SIGNAL_CONDITIONER CONFIG ############
SignalConditioner.implementation=Signal_Conditioner
DataTypeAdapter.implementation=Ishort_To_Complex
InputFilter.implementation=Pass_Through
InputFilter.item_type=gr_complex
Resampler.implementation=Direct_Resampler
Resampler.sample_freq_in=4000000
Resampler.sample_freq_out=2000000
Resampler.item_type=gr_complex

;######### CHANNELS GLOBAL CONFIG ############
Channels_1C.count=8
Channels.in_acquisition=1
Channel.signal=1C

;######### ACQUISITION GLOBAL CONFIG ############
Acquisition_1C.implementation=GPS_L1_CA_PCPS_Acquisition
Acquisition_1C.item_type=gr_complex
Acquisition_1C.threshold=0.008
Acquisition_1C.doppler_max=10000
Acquisition_1C.doppler_step=250

;######### TRACKING GLOBAL CONFIG ############
Tracking_1C.implementation=GPS_L1_CA_DLL_PLL_Tracking
Tracking_1C.item_type=gr_complex
Tracking_1C.pll_bw_hz=40.0;
Tracking_1C.dll_bw_hz=4.0;

;######### TELEMETRY DECODER GPS CONFIG ############
TelemetryDecoder_1C.implementation=GPS_L1_CA_Telemetry_Decoder

;######### OBSERVABLES CONFIG ############
Observables.implementation=Hybrid_Observables

;######### PVT CONFIG ############
PVT.implementation=RTKLIB_PVT
PVT.positioning_mode=Single
PVT.output_rate_ms=10
PVT.display_rate_ms=500
PVT.iono_model=Broadcast
PVT.trop_model=Saastamoinen
PVT.flag_rtcm_server=true
PVT.flag_rtcm_tty_port=false
PVT.rtcm_dump_devname=/dev/pts/1
PVT.rtcm_tcp_port=2101
PVT.rtcm_MT1019_rate_ms=5000
PVT.rtcm_MT1077_rate_ms=1000
PVT.rinex_version=2
```

**NOTE:** Check that the parameter `SignalSource.filename` actually points to the name and path of your raw data file.
{: .notice--warning}

**NOTE:** For more details about the configuration options for each block, check out the [**Signal Processing Blocks**]({{ "/docs/sp-blocks/" | relative_url }}) documentation.
{: .notice--info}

Save the file as `my-first-GNSS-SDR-receiver.conf` (or any other name of your choice).

## Step 4: Run GNSS-SDR

Ok, let's recap. We have:

* GNSS-SDR installed in our system.
* A signal source: A file named `2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.dat` containing 100 seconds of raw GPS signal samples, that were grabbed by a radio frequency front-end.
* A configuration file for a GPS L1 C/A receiver that will take the file `2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.dat` as its signal source.

So, we are ready to run our software-defined GPS receiver. In a terminal, type:

```bash
$ gnss-sdr --config_file=./my-first-GNSS-SDR-receiver.conf
```

**NOTE:** Change `./my-first-GNSS-receiver.conf` by the actual name and path of your recently created configuration file.
{: .notice--warning}

You should see something similar to:

```
$ gnss-sdr --config_file=./my-first-GNSS-SDR-receiver.conf
Initializing GNSS-SDR v0.0.11 ... Please wait.
Logging will be done at "/tmp"
Use gnss-sdr --log_dir=/path/to/log to change that.
Processing file /home/your-username/work/2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.dat, which contains 1600000000 [bytes]
GNSS signal recorded time to be processed: 99.999 [s]
Starting a TCP/IP server of RTCM messages on port 2101
The TCP/IP server of RTCM messages is up and running. Accepting connections ...
...
```

Then, after some seconds detecting GPS signals and decoding some frames of their navigation messages (at least, subframes 1, 2 and 3 from four satellites)...

```
...
Current receiver time: 14 s
New GPS NAV message received in channel 3: subframe 1 from satellite GPS PRN 20 (Block IIR)
New GPS NAV message received in channel 0: subframe 1 from satellite GPS PRN 01 (Block IIF)
New GPS NAV message received in channel 4: subframe 1 from satellite GPS PRN 32 (Block IIF)
New GPS NAV message received in channel 2: subframe 1 from satellite GPS PRN 17 (Block IIR-M)
Current receiver time: 15 s
Current receiver time: 16 s
Current receiver time: 17 s
Current receiver time: 18 s
Current receiver time: 19 s
Current receiver time: 20 s
New GPS NAV message received in channel 3: subframe 2 from satellite GPS PRN 02 (Block IIR)
New GPS NAV message received in channel 0: subframe 2 from satellite GPS PRN 01 (Block IIF)
New GPS NAV message received in channel 4: subframe 2 from satellite GPS PRN 32 (Block IIF)
New GPS NAV message received in channel 1: subframe 2 from satellite GPS PRN 11 (Block IIR)
New GPS NAV message received in channel 2: subframe 2 from satellite GPS PRN 17 (Block IIR-M)
Current receiver time: 21 s
Current receiver time: 22 s
Current receiver time: 23 s
Current receiver time: 24 s
Current receiver time: 25 s
Current receiver time: 26 s
New GPS NAV message received in channel 3: subframe 3 from satellite GPS PRN 20 (Block IIR)
New GPS NAV message received in channel 0: subframe 3 from satellite GPS PRN 01 (Block IIF)
New GPS NAV message received in channel 4: subframe 3 from satellite GPS PRN 32 (Block IIF)
New GPS NAV message received in channel 2: subframe 3 from satellite GPS PRN 17 (Block IIR-M)
New GPS NAV message received in channel 1: subframe 3 from satellite GPS PRN 11 (Block IIR)
First position fix at 2013-Apr-04 06:23:31.740000 UTC is Lat = 41.2749 [deg], Long = 1.98754 [deg], Height= 100.795 [m]
Position at 2013-Apr-04 06:23:32.000000 UTC using 4 observations is Lat = 41.274888307 [deg], Long = 1.987581872 [deg], Height = 86.928 [m]
Position at 2013-Apr-04 06:23:32.500000 UTC using 4 observations is Lat = 41.274964746 [deg], Long = 1.987510141 [deg], Height = 90.557 [m]
Current receiver time: 27 s
Position at 2013-Apr-04 06:23:33.000000 UTC using 4 observations is Lat = 41.274921885 [deg], Long = 1.987605767 [deg], Height = 73.365 [m]
Position at 2013-Apr-04 06:23:33.500000 UTC using 4 observations is Lat = 41.274866502 [deg], Long = 1.987553835 [deg], Height = 83.313 [m]
Current receiver time: 28 s
Position at 2013-Apr-04 06:23:34.000000 UTC using 4 observations is Lat = 41.274904024 [deg], Long = 1.987612510 [deg], Height = 87.615 [m]
Position at 2013-Apr-04 06:23:34.500000 UTC using 4 observations is Lat = 41.274877911 [deg], Long = 1.987553312 [deg], Height = 81.405 [m]
Current receiver time: 29 s
Position at 2013-Apr-04 06:23:35.000000 UTC using 4 observations is Lat = 41.274916750 [deg], Long = 1.987576650 [deg], Height = 108.288 [m]
Position at 2013-Apr-04 06:23:35.500000 UTC using 4 observations is Lat = 41.274803167 [deg], Long = 1.987562527 [deg], Height = 90.144 [m]
Current receiver time: 30 s
Position at 2013-Apr-04 06:23:36.000000 UTC using 4 observations is Lat = 41.275044618 [deg], Long = 1.987619037 [deg], Height = 102.346 [m]
Position at 2013-Apr-04 06:23:36.500000 UTC using 4 observations is Lat = 41.274878468 [deg], Long = 1.987557377 [deg], Height = 102.764 [m]
Current receiver time: 31 s
Position at 2013-Apr-04 06:23:37.000000 UTC using 4 observations is Lat = 41.274995336 [deg], Long = 1.987554843 [deg], Height = 113.653 [m]
Position at 2013-Apr-04 06:23:37.500000 UTC using 4 observations is Lat = 41.274951615 [deg], Long = 1.987600581 [deg], Height = 92.064 [m]
Current receiver time: 32 s
...
```


If you see something similar to this... Yay! You are getting position fixes with your open source software-defined GPS receiver!
{: .notice--success}

```
...
Current receiver time: 1 min 40 s
Position at 2013-Apr-04 06:24:45.500000 UTC using 5 observations is Lat = 41.274821613 [deg], Long = 1.987629659 [deg], Height = 69.292 [m]
Position at 2013-Apr-04 06:24:46.000000 UTC using 5 observations is Lat = 41.274817101 [deg], Long = 1.987576895 [deg], Height = 43.517 [m]
Position at 2013-Apr-04 06:24:46.500000 UTC using 5 observations is Lat = 41.274830209 [deg], Long = 1.987583859 [deg], Height = 54.475 [m]
Stopping GNSS-SDR, please wait!
Total GNSS-SDR run time: 37.106698 [seconds]
GNSS-SDR program ended.
Stopping TCP/IP server on port 2101
$
```

Now you can examine the processing outputs in the folder from which you invoked GNSS-SDR:

 * A `.kml` file.
 * A `.geojson` file.
 * A `.gpx` file.
 * A `.nmea` file.
 * Observation and Navigation RINEX files.

... play with the configuration parameters or try out more challenging [configurations]({{ "/conf/" | relative_url }}).

<link rel="prerender" href="{{ "/conf/" | relative_url }}">
<link rel="prerender" href="{{ "/build-and-install/" | relative_url }}">
<link rel="prerender" href="{{ "/docs/" | relative_url }}">

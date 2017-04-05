---
title: "My first position fix"
permalink: /my-first-fix/
excerpt: "How to quickly get a position fix with GNSS-SDR."
last_modified_at: 2016-09-10T15:54:02-04:00
header:
  teaser: "/assets/images/gn3s_pvt_4_sats.jpg"
sidebar:
  nav: "start"
---
{% include toc %}

**This page is the "_Hello, world!_&nbsp;" for GNSS-SDR**. It will guide you from the scratch up to getting position fixes with GNSS-SDR, in one of its simplest configurations. The signal source will be a file (freely available on the Internet) containing raw signal samples, so this procedure does not require the availability of a radio frequency front-end nor a powerful computer executing the software receiver. The only requirement is GNSS-SDR installed in your computer, and an Internet connection to download the file containing the raw signal samples.
{: .notice--info}

## Step 1: Verify that GNSS-SDR is installed

This guide assumes that GNSS-SDR and its software dependencies are already installed on you system. In order to check whether it is correctly installed, open a terminal and type:

```bash
$ gnss-sdr --version
```

you should see something similar to:

```bash
$ gnss-sdr --version
linux; GNU C++ version 4.9.2; Boost_105400; UHD_003.010

gnss-sdr version 0.0.8
$
```

If you see something like:

```
$ gnss-sdr --version
gnss-sdr: command not found
$
```

please check out the [building guide]({{ "/build-and-install/" | absolute_url }}) and the [README.md](https://github.com/gnss-sdr/gnss-sdr/blob/master/README.md){:target="_blank"} file for more details on how to install GNSS-SDR.

In order to take advantage of the SIMD instruction sets present in your processor, you will need to run the prolifer tools of the VOLK and VOLK_GNSSSDR libraries (these operations only need to be done once, and can take a while):

```bash
$ volk_profile
```

and

```bash
$ volk_gnsssdr_profile
```

## Step 2: Download a file of raw signal samples

Now it's time to download the file containing the GNSS raw signal samples. This can be done directly from the terminal:

```
$ mkdir work
$ cd work
$ wget https://sourceforge.net/projects/gnss-sdr/files/data/2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.tar.gz
$ tar -zxvf 2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.tar.gz
```

or by opening [this link](https://sourceforge.net/projects/gnss-sdr/files/data/2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.tar.gz/download) in your browser, downloading the file and unpacking it. This will get you the file `2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.dat`, which contains $$ 100 $$ seconds of raw GNSS signal samples collected by a RF front-end centered at $$ 1,575.42 $$ MHz, that was delivering baseband samples at $$ 4 $$ MS/s, in an interleaved I&Q 16-bit integer format.


## Step 3: Configure GNSS-SDR

Then, copy the GNSS-SDR configuration shown below and paste it into your favorite plain text editor:

```ini
[GNSS-SDR]

;######### GLOBAL OPTIONS ##################
GNSS-SDR.internal_fs_hz=2000000

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
Tracking_1C.implementation=GPS_L1_CA_DLL_PLL_C_Aid_Tracking
Tracking_1C.item_type=gr_complex
Tracking_1C.pll_bw_hz=40.0;
Tracking_1C.dll_bw_hz=4.0;

;######### TELEMETRY DECODER GPS CONFIG ############
TelemetryDecoder_1C.implementation=GPS_L1_CA_Telemetry_Decoder

;######### OBSERVABLES CONFIG ############
Observables.implementation=GPS_L1_CA_Observables

;######### PVT CONFIG ############
PVT.implementation=GPS_L1_CA_PVT
PVT.averaging_depth=100
PVT.flag_averaging=true
PVT.output_rate_ms=10
PVT.display_rate_ms=500
```

**NOTE:** Check that the parameter `SignalSource.filename` actually points to the name and path of your raw data file.
{: .notice--warning}

**NOTE:** For more details about the configuration options for each block, check out the [**Signal Processing Blocks**]({{ "/docs/sp-blocks/" | absolute_url }}){:target="_blank"} documentation.
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
linux; GNU C++ version 4.9.2; Boost_105400; UHD_003.010.git-0-2d68f228

Initializing GNSS-SDR v0.0.8 ... Please wait.
Logging will be done at "/tmp"
Use gnss-sdr --log_dir=/path/to/log to change that.
Processing file /home/your-username/work/2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.dat, which contains 1600000000 [bytes]
GNSS signal recorded time to be processed: 99.999 [s]
...
```

Then, after some seconds detecting GPS signals and decoding some frames of their navigation messages (at least, subframes 1, 2 and 3 from four satellites)...

```
...
Current input signal time = 42 [s]
NAV Message: received subframe 1 from satellite GPS PRN 20 (Block IIR)
NAV Message: received subframe 1 from satellite GPS PRN 01 (Block IIF)
NAV Message: received subframe 1 from satellite GPS PRN 32 (Block IIF)
NAV Message: received subframe 1 from satellite GPS PRN 11 (Block IIR)
NAV Message: received subframe 1 from satellite GPS PRN 17 (Block IIR-M)
Current input signal time = 43 [s]
Current input signal time = 44 [s]
Current input signal time = 45 [s]
Current input signal time = 46 [s]
Current input signal time = 47 [s]
Current input signal time = 48 [s]
NAV Message: received subframe 2 from satellite GPS PRN 20 (Block IIR)
NAV Message: received subframe 2 from satellite GPS PRN 01 (Block IIF)
NAV Message: received subframe 2 from satellite GPS PRN 32 (Block IIF)
NAV Message: received subframe 2 from satellite GPS PRN 11 (Block IIR)
NAV Message: received subframe 2 from satellite GPS PRN 17 (Block IIR-M)
Current input signal time = 49 [s]
Current input signal time = 50 [s]
Current input signal time = 51 [s]
Current input signal time = 52 [s]
Current input signal time = 53 [s]
Current input signal time = 54 [s]
NAV Message: received subframe 3 from satellite GPS PRN 20 (Block IIR)
NAV Message: received subframe 3 from satellite GPS PRN 01 (Block IIF)
NAV Message: received subframe 3 from satellite GPS PRN 32 (Block IIF)
NAV Message: received subframe 3 from satellite GPS PRN 11 (Block IIR)
NAV Message: received subframe 3 from satellite GPS PRN 17 (Block IIR-M)
Position at 2013-Apr-04 06:24:17 UTC is Lat = 41.27478751250208 [deg], Long = 1.98761094822992 [deg], Height= 91.81396374478936 [m]
Current input signal time = 55 [s]
Position at 2013-Apr-04 06:24:18 UTC is Lat = 41.27489321842131 [deg], Long = 1.987777463187041 [deg], Height= 70.65930022858083 [m]
Position at 2013-Apr-04 06:24:18 UTC is Lat = 41.27487423787719 [deg], Long = 1.987675595977398 [deg], Height= 74.81919255573303 [m]
Current input signal time = 56 [s]
Position at 2013-Apr-04 06:24:19 UTC is Lat = 41.27484502531679 [deg], Long = 1.987679687583814 [deg], Height= 66.56866730749607 [m]
Position at 2013-Apr-04 06:24:19 UTC is Lat = 41.27489169044892 [deg], Long = 1.987773660276054 [deg], Height= 63.41946520376951 [m]
Current input signal time = 57 [s]
Position at 2013-Apr-04 06:24:20 UTC is Lat = 41.27484764102147 [deg], Long = 1.987674857241589 [deg], Height= 84.82868976891041 [m]
Position at 2013-Apr-04 06:24:20 UTC is Lat = 41.27488795165949 [deg], Long = 1.987767396734624 [deg], Height= 57.30093908496201 [m]
Current input signal time = 58 [s]
...
```


If you see something similar to this... Yay! You are getting position fixes with your open source software-defined GPS receiver!
{: .notice--success}

```
...
Current input signal time = 98 [s]
Position at 2013-Apr-04 06:25:01 UTC is Lat = 41.27485191181121 [deg], Long = 1.987647398644359 [deg], Height= 71.97478503454477 [m]
Stopping GNSS-SDR, please wait!
Total GNSS-SDR run time 20.65166 [seconds]
GNSS-SDR program ended.
$
```

Now you can examine the processing outputs in the folder from which you invoked GNSS-SDR:

 * A `.kml` file.
 * A `.geojson` file.
 * A `.nmea` file.
 * Observation and Navigation RINEX files.

... play with the configuration parameters or try out more challenging [configurations]({{ "/conf/" | absolute_url }}).

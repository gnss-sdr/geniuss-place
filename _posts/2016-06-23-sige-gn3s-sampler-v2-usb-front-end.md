---
title: "SiGe GN3S Sampler v2 USB front-end"
permalink: /docs/tutorials/sige-gn3s-sampler-v2-usb-front-end/
excerpt: "This article provides details about the support that GNSS-SDR offers for real-time operation using the GNSS USB front-end SiGe GN3S Sampler v2."
author_profile: false
header:
  teaser: /assets/images/GN3S_setup1-th.jpg
tags:
  - tutorial
  - GN3S
sidebar:
  nav: "docs"
redirect_from:
  - /documentation/sige-gn3s-sampler-v2-usb-front-end
  - /node/51
toc: true
---


{% capture fig_img1 %}
  ![SiGe GN3S Sampler v2]({{ "/assets/images/sige_v2.jpg" | absolute_url }})
{% endcapture %}

{% capture fig_img2 %}
  ![Gnuradio-companion example]({{ "/assets/images/gr_gn3s_1.jpg" | absolute_url }})
{% endcapture %}

{% capture fig_img3 %}
  ![FFT plot and waterfall spectrum]({{ "/assets/images/gr_gn3s_driver_2.jpg" | absolute_url }})
{% endcapture %}

{% capture fig_img4 %}
  ![SiGe GN3S setup]({{ "/assets/images/gr_gn3s_4.jpg" | absolute_url }})
{% endcapture %}

{% capture fig_img5 %}
  ![Realtime GN3S GPS positioning]({{ "/assets/images/GN3S_setup1.jpg" | absolute_url }})
{% endcapture %}

{% capture fig_img6 %}
  ![GTracking data analysis]({{ "/assets/images/gn3s_tracking_2M.jpg" | absolute_url }})
{% endcapture %}

{% capture fig_img7 %}
  ![ Google Earth]({{ "/assets/images/gn3s_pvt_4_sats.jpg" | absolute_url }})
{% endcapture %}

## Introduction

This article provides details about the support that GNSS-SDR offers for real-time operation using the GNSS USB front-end [SiGe GN3S Sampler v2](https://www.sparkfun.com/products/retired/8238). Unfortunately, this product has been retired and replaced by a newer version v3, but we hope this still can be useful to v2 users. The article starts with a brief description of the GN3S hardware and gives some insights about the required modifications in the firmware code that drives the Cypress FX2 microcontroller. It follows introducing the GNU Radio compliant GN3S signal source that enables access to the signal samples in real-time. The driver can be compiled and installed as standalone library, and thus can be used by any other GNU Radio application in C++ or Python, including gnuradio-companion. Finally, we describe a step-by-step procedure to configure GNSS-SDR to receive GPS L1 signals using the GN3S dongle. Some experimental results with real-life signals are also provided.


## SiGe GN3S firmware internal details and modifications

The [SiGe GN3S v2 USB RF front-end](https://www.sparkfun.com/products/8238?), developed by the [Colorado Center For Astrodynamics Research](http://ccar.colorado.edu/gnss/), is basically composed of two different integrated circuits. On the one hand, GNSS-related operations are based on the [SiGe 4120](http://www.skyworksinc.com/Products_SiGe.aspx) GPS Application Specific Integrated Circuit (ASIC), that performs RF amplification, filtering, downconversion, and baseband sampling (in June 2011, Skyworks closed its acquisition of SiGe Semiconductor). On the other hand, the Cypress Semiconductors [EZ-USB FX2LP](http://www.cypress.com/?id=193) USB 2.0 microcontroller is in charge of reading the digital samples coming from the SiGe 4120 ASIC and sending them in real-time to the PC through the universal serial bus.


<figure>
  {{ fig_img1 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>SiGe GN3S Sampler v2.</figcaption>
</figure>


SiGe 4120 Analog to Digital Converter (ADC) is configured to provide a sample stream with a sampling frequency equal to 8.1838 MHz. The FX2LP microcontroller sends the samples in In-phase and Quadrature (I/Q) sample pairs. The specific parameters of the front-end are the following:


 * Sampling frequency:  8.1838 MHz
 * Intermediate frequency:  38.400 KHz
 * 2-bit I/Q samples (1bit I & 1bit Q) in a short char binary format (sI0, sQ0, sI1, sQ1, sI2, sQ2, ...)


The front-end firmware is licensed as GPL open source, and available online from [GN3Sv2.rar](http://www.sparkfun.com/datasheets/GPS/Modules/GN3Sv2.rar). The front-end was intended to capture up to 600 Mb of data and then use a Matlab GNSS software available from K.Borre’s book[^Kay06] to perform post-processing operations to GPS signals.

[^Kay06]: K. Borre, D. M. Akos, N. Bertelsen, P. Rinder, S. H. Jensen, _A Software-Defined GPS and Galileo Receiver. A Single-Frequency Approach_, 1st edition, Boston: Birkhäuser, November 2006.


In order to enable real-time operation and remove the capture size limitation, some modifications to the firmware are required. Basically, we need to modify the file “gn3s_main.c” to disable an interrupt counter that accumulates the number of processed signal samples. The 8051 code should be modified as follows:

```cpp
void main(void) {
 init_usrp();
 init_gpif();
 init_se4110();
 TD_Init();  // Init function for A9 vendor commands

 EA = 0;     // disable all interrupts

 setup_autovectors();
 usb_install_handlers();

 EIEX4 = 1;          // disable INT4 FIXME
 EA = 1;             // global interrupt enable

 fx2_renumerate();   // simulates disconnect / reconnect

// enable_se4110();
 program_3w();
 //remove capture filesize limitation by disabling the sample counter interruption (hook_timer_tick() function)
 //hook_timer_tick((unsigned int)guardC);

 main_loop();
}
```

and

```cpp
static void main_loop(void)
{
 setup_flowstate_common();
 SYNCDELAY;   

 while (1) {
   // We don't do much, GPIF is running on autopilot

   if (_usb_got_SUDAV) {
     usb_handle_setup_packet();
     _usb_got_SUDAV = 0;
   }

  //the following code is not needed because we do not check for capture size limit
  /*
   if (guardTick && guardCnt) {
     guardTick = 0;

     if(!(--guardCnt)) {
       GPIFTRIG = 0; SYNCDELAY;
       GPIFABORT =0xff; SYNCDELAY;
       FIFORESET = bmNAKALL;SYNCDELAY;
       FIFORESET = 2;SYNCDELAY;
       FIFORESET = 6;SYNCDELAY;
       FIFORESET = 0;SYNCDELAY;
     }
   }
  */
 }
}
```

For the sake of simplicity of use, the [gr-gn3s code repository](https://github.com/gnss-sdr/gr-gn3s) contains a copy of the modified GN3S v2 firmware, available at [gr-gn3s/firmware/GN3Sv2](https://github.com/gnss-sdr/gr-gn3s/tree/master/firmware/GN3S_v2). In addition, a pre-compiled binary firmware file ready to be uploaded by the GN3S driver is also available. See next section for the details.


## GNU Radio compliant GN3S front-end signal source: gr-gn3s

We developed a complete GNU Radio signal source that provides an interface to the GN3S RF front-end signal samples. The firmware loader is based on Gregory. W. Heckler’s [GPS-SDR](https://github.com/gps-sdr/gps-sdr) GN3S driver. However, the signal sample reception was based on the original SiGe GN3S driver.


Th gr-gn3s module contains a GNU Radio fully-compliant gr-block signal source, intended to be used either with GNSS-SDR as a signal source or as a standalone signal source block instantiated from a GNU Radio flowgraph from C++ or using Python (it includes a gnuradio-companion interface also). The source code is available at [gr-gn3s](https://github.com/gnss-sdr/gr-gn3s).


Once the driver is compiled and installed, the gr-gn3s signal source is available to gnuradio-companion under the tab [GN3S] -> gn3s_source and it can be instantiated as is shown in the following example:

<figure>
  {{ fig_img2 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>GNU Radio Companion sample script using the GN3S signal source.</figcaption>
</figure>


In addition, it is required to copy the GN3S firmware binary file [gr-gn3s/firmware/GN3S_v2/bin/gn3s_firmware.ihx](https://github.com/gnss-sdr/gr-gn3s/blob/master/firmware/GN3S_v2/bin/gn3s_firmware.ihx) to the application runtime directory. In this example, if the gnuradio-companion application is called from `/home/username/`, then a copy of `gn3s_firmware.ihx` should be available at `/home/username/gn3s_firmware.ihx`.


Since the driver requires access to the USB port, it is necessary to run the script as root. In case you are using gnuradio-companion, it can be done as:

```bash
$ sudo gnuradio-companion
```

If everything goes well, the driver initialization log will be as follows:

```
Executing: "/home/username/top_block.py"


Using Volk machine: sse4_1_32
GN3S Device Found... awaiting firmware flash
Using device vendor id 0x1781 product id 0x0b39
GN3S flashing ...
GN3S firmware file found!
End of file
GN3S flash complete!
Received handle for GNSS Front-End device
Creating GPS Source
GN3S Start
started TX
```



In this sample script, the FFT GUI shows in real-time the digitized signal spectrum, as is shown in the next picture:

<figure>
  {{ fig_img3 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>Real-time FFT plot and waterfall spectrum of GN3S signals.</figcaption>
</figure>



The GNSS signals are well below the noise floor, and thus the thermal white noise is exercising the ADC bits. Consequently, the Gaussian-like spectrum curve is caused by the front-end RF band-pass filter frequency response.


## GNSS-SDR’s GN3S signal source module


GNSS-SDR support for GN3S dongles makes use of the gr-gn3s GNU Radio source block and driver. The associated GNSS-SDR Signal Source name is `Gn3s_Signal_Source` and the adapter source code is located at:


* [gnss-sdr/src/algorithms/signal_source/adapters/gn3s_signal_source.h](https://github.com/gnss-sdr/gnss-sdr/blob/master/src/algorithms/signal_source/adapters/gn3s_signal_source.h)
* [gnss-sdr/src/algorithms/signal_source/adapters/gn3s_signal_source.cc](https://github.com/gnss-sdr/gnss-sdr/blob/master/src/algorithms/signal_source/adapters/gn3s_signal_source.cc)


It makes use of the library gr-gn3s by including the following header:

```cpp
#include <gn3s/gn3s_source_cc.h>
```


**Important:**
The compilation of the SiGe GN3S support in GNSS-SDR is optional and it requires the previous installation of the [gr-gn3s](https://github.com/gnss-sdr/gr-gn3s) module. See GNSS-SDR's [README.md](https://github.com/gnss-sdr/gnss-sdr#how-to-build-gnss-sdr) file for step-by-step building instructions with the [optional GN3S driver](https://github.com/gnss-sdr/gnss-sdr#build-gn3s-v2-custom-firmware-and-driver-optional).
{: .notice--warning}


## Configuring GNSS-SDR for GPS L1 real-time operation

In order to use a SiGe GN3S device it is necessary to select the `Gn3s_Signal_Source` implementation in the GNSS-SDR configuration file of the `SignalSource` block. Since this is a specific front-end for GNSS signal reception, there is no need to configure any source parameter. Hereafter can be found a working configuration for the reception of a GPS L1 C/A signal:

```ini
[GNSS-SDR]
;######### GLOBAL OPTIONS ##################
GNSS-SDR.internal_fs_hz=2045950
;######### CONTROL_THREAD CONFIG ############
ControlThread.wait_for_flowgraph=false
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=GN3S_Signal_Source
SignalSource.item_type=gr_complex
SignalSource.sampling_frequency=8183800
SignalSource.enable_throttle_control=false
```

The front-end sampling frequency is fixed by the SiGe ASIC to 8183800 Hz. However, this sampling frequency is too high for multichannel real-time operation, at least on our machine. On top of this issue, the samples signal contains an Intermediate Frequency of 38400 Hz that should be compensated.
The software receiver can solve both problems by enabling the GNU Radio’s frequency translating Finite Impulse Response (FIR) filter in the signal conditioner section to perform the following operations:

 1. Eliminate the parasitic IF signal

 2. Perform a Low Pass Filtering to prevent aliasing

 3. Perform a decimation operation to reduce the sampling frequency

In this configuration example we choose a decimation factor of 4. The resulting sampling frequency, which is the GNSS-SDR internal sampling frequency, is 8183800/4=2045950 Hz. The signal conditioner configuration is as follows:

```ini
;######### SIGNAL_CONDITIONER CONFIG ############
;## It holds blocks to change data type, filter and resample input data.
;#implementation: Use [Pass_Through] or [Signal_Conditioner]
;#[Pass_Through] disables this block and the [DataTypeAdapter], [InputFilter] and [Resampler] blocks
;#[Signal_Conditioner] enables this block. Then you have to configure [DataTypeAdapter], [InputFilter] and [Resampler] blocks
SignalConditioner.implementation=Signal_Conditioner
;######### DATA_TYPE_ADAPTER CONFIG ############
;## Changes the type of input data. Please disable it in this version.
;#implementation: [Pass_Through] disables this block
DataTypeAdapter.implementation=Pass_Through
;######### INPUT_FILTER CONFIG ############
;## Filter the input data. Can be combined with frequency translation for IF signals
;#implementation: Use [Pass_Through] or [Fir_Filter] or [Freq_Xlating_Fir_Filter]
;#[Freq_Xlating_Fir_Filter] enables FIR filter and a composite frequency translation that shifts IF down to zero Hz.
InputFilter.implementation=Freq_Xlating_Fir_Filter
;#The following options are used in the filter design of Fir_Filter and Freq_Xlating_Fir_Filter implementation.
;#These options are based on parameters of gnuradio's function: gr_remez.
;#These function calculates the optimal (in the Chebyshev/minimax sense) FIR filter inpulse response given a set of band edges, the desired response on those bands, and the weight given to the error in those bands.
; -- Filter parameters and coefficients are omitted in this example --
; 8183800/5 = 1636760
; 8183800/4 = 2045950
InputFilter.sampling_frequency=8183800
InputFilter.IF=38400
InputFilter.decimation_factor=4
;######### RESAMPLER CONFIG ############
;## Resamples the input data.
;#implementation: Use [Pass_Through] or [Direct_Resampler]
;#[Pass_Through] disables this block
Resampler.implementation=Pass_Through
```


This configuration enables the real-time receiver operation with 8 satellite channels in an Intel Core 2 quad Q9400 @ 2.66 GHz with 4 GB of RAM.
It is important to point out that the GN3S driver requires the firmware file available in the application runtime directory. In the case of the GNSS-SDR application, the firmware file gn3s_firmware.ihx should be copied the folder runniong the receiver. In addition, GNSS-SDR should be called with root privileges

```bash
$ sudo gnss-sdr --config_file=../conf/gnss-sdr_GPS_L1_GN3S_realtime.conf
```


## Hardware setup

We used the GN3S front-end connected to a ceramic patch antenna equipped with an internal Low Noise Amplifier (LNA) to reduce the overall noise figure. The picture below shows a picture of such On Shine Enterprise Co., Ltd ANT-555 antenna connected to the USB dongle.

<figure>
  {{ fig_img4 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>SiGe GN3S setup with ANT-555 active antenna.</figcaption>
</figure>



## Some qualitative performance measurements

In this experiment, we used a Dell XPS M1530 laptop equipped with an Intel Core 2 Duo T9300 CPU with 4 GB of RAM. The operating system was Linux Ubuntu 12.04 and GNU Radio version was 3.6.0.
At this time of writing (SVN rev. 244), real-time operation with the aforementioned equipment supports up to 7 satellite channels. The antenna was placed in the ground and remained static during the experiment. The whole setup is shown in the following picture:

<figure>
  {{ fig_img5 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>Real-time GN3S GPS positioning with GNSS-SDR setup picture.</figcaption>
</figure>

The following pictures show some tracking data analysis using the GNSS-SDR intermediate data extraction and dump feature:
```ini
Tracking.dump=true Tracking.dump_filename=./tracking_ch_
```

As a sanity check, we did some post processing analysis using the Matlab script available at
[gnss-sdr/src/utils/matlab/gps_l1_ca_dll_pll_plot_sample.m](https://github.com/gnss-sdr/gnss-sdr/blob/master/src/utils/matlab/gps_l1_ca_dll_pll_plot_sample.m).
The figure clearly shows the GPS C/A navigation symbols:


<figure>
  {{ fig_img6 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>Tracking data analysis for one satellite channel.</figcaption>
</figure>


Finally, the obtained KML file can be displayed by Google Earth as shown in the following picture. The yellow line represents the position evolution for a 10 seconds time lapse. The yellow mark represents the true antenna position.

<figure>
  {{ fig_img7 | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>GNSS-SDR estimated position analysis using Google Earth.</figcaption>
</figure>



## Conclusions

Summarizing this introductory article and the associated experiments we can highlight that:

 * GNSS-SDR is able to operate in real-time with the aforementioned hardware and software driver on average 4-years old laptop computer. It supports up to 7 satellite tracking channels in current revision (SVN rev. 244) thanks to the frequency shifting and decimation capability of signal conditioning module.

 * We developed and validated a GNU Radio signal source block that encapsulates a SiGe GN3S Sampler v2 front-end firmware loader and driver. Since this front-end is now obsolete and it is superseded by the [SiGe GN3S Sampler v3](https://www.sparkfun.com/products/retired/10981) front-end, it is planned to extend the signal source support for the new hardware in future versions of GNSS-SDR. Testing volunteers are highly welcome!


-------

## References

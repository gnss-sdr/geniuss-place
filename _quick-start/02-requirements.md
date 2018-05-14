---
title: "Requirements"
permalink: /requirements/
excerpt: "Things you need for executing GNSS-SDR."
last_modified_at: 2017-04-13T15:54:02-04:00
header:
  teaser: "/assets/images/checklist.jpg"
sidebar:
  nav: "start"
toc: true
---


In order to execute GNSS-SDR, you will need:


 1. A computing platform with some software dependencies installed.
 2. A GNSS signal source:
   - can be a file storing GNSS signal samples,
   - or a suitable radio frequency front-end, if you want to operate in real-time.


## The computing platform

### Processor architecture

GNSS-SDR can be built in a variety of processor architectures, covering a wide range of computers such as desktops, laptops, mini-computers, embedded systems and even mainframes:

* Intel/AMD [x86](https://en.wikipedia.org/wiki/X86) instruction set (32 and 64 bits).
* [PowerPC](https://en.wikipedia.org/wiki/PowerPC): big-endian and little-endian, 32 and 64 bits.
* [ARM](https://en.wikipedia.org/wiki/ARM_architecture): version v4t and above, including 64-bit ARMv8.
* [MIPS](https://en.wikipedia.org/wiki/MIPS_instruction_set): big-endian and little-endian, 32 and 64 bits.
* [IBM System z](https://en.wikipedia.org/wiki/IBM_System_z): IBM's architecture for mainframe computers.

GNSS-SDR will process incoming raw samples as fast as the computing platform executing it allows. It will automatically take advantage of multi-core architectures, and it will select the fastest SIMD implementation available in your machine (covering technologies such as [SSE2](https://software.intel.com/sites/landingpage/IntrinsicsGuide/#techs=SSE2), [SSE3](https://software.intel.com/sites/landingpage/IntrinsicsGuide/#techs=SSE3), [SSE4.1](https://software.intel.com/sites/landingpage/IntrinsicsGuide/#techs=SSE4_1), [AVX](https://software.intel.com/sites/landingpage/IntrinsicsGuide/#techs=AVX), [AVX2](https://software.intel.com/sites/landingpage/IntrinsicsGuide/#techs=AVX2) and [NEON](https://developer.arm.com/technologies/neon)). It can even offload some of the computing work to the Graphics Processing Unit. If there is computational power enough, GNSS-SDR can be used in real-time, reading raw samples from a radio frequency front-end. In slower machines, GNSS-SDR will execute exactly the same code, for instance reading raw samples from a file stored in a hard drive.


**Try the software in your own computer**: GNSS-SDR can be executed in a wide range of processor architectures, from the newest ones to those that have been around for a while. Your own computer will probably be among the list above. The software receiver processes data _as fast as it can_, taking advantage of the particularities of your processor and dumping messages to the terminal output in case it is not able to perform the required computation in real-time. If your processor is not fast enough to process GNSS signals in real-time, you can still use files and use the software, performing exactly the same processing but at a slower pace, and thus without processing time constraints.
{: .notice--success}

### Operating Systems

GNSS-SDR can be run on a variety of operating systems:

* ![GNU/Linux Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/2000px-Tux.svg.png){:height="100px" width="100x"}{: .align-right} **GNU/Linux**: GNSS-SDR and all its dependencies can be easily installed in most popular distributions, and it is even included as a software package starting in [Debian 9 (stretch)](https://packages.debian.org/stretch/gnss-sdr) and [Ubuntu 16.04 LTS (Xenial)](https://packages.ubuntu.com/search?keywords=gnss-sdr). Older releases and other distributions might also work well.
* ![GNU/kFreeBSD Logo](https://www.file-extensions.org/imgs/app-icon/128/3219/freebsd-icon.png){:height="100px" width="100x"}{: .align-right} **GNU/kFreeBSD**: GNSS-SDR can be built in GNU distributions which make use of the kernel of [FreeBSD](https://www.freebsd.org) instead of the Linux kernel. This is the case of [Debian GNU/kFreeBSD](https://wiki.debian.org/Debian_GNU/kFreeBSD), a port that consists of the GNU userland using the GNU C library on top of FreeBSD's kernel, coupled with the regular Debian package set.
* ![Mac OS Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/OS_X_El_Capitan_logo.svg/1024px-OS_X_El_Capitan_logo.svg.png){:height="100px" width="100x"}{: .align-right} **macOS / Mac OS X**: GNSS-SDR and all its dependencies can be easily installed using Mac OS X 10.9 (Mavericks) and above, including macOS High Sierra. You will need [Xcode](https://developer.apple.com/xcode/) and a software package manager such as [Macports](https://www.macports.org/) (there is a [gnss-sdr port](https://www.macports.org/ports.php?by=name&substr=gnss-sdr) that will do all the work for you) or [Homebrew](https://brew.sh/).
* ![Windows Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Windows_logo_-_2012.svg/2000px-Windows_logo_-_2012.svg.png){:height="100px" width="100x"}{: .align-right} **Microsoft Windows**: At this time of writing, GNSS-SDR cannot be built natively on Microsoft Windows. As far as authors' knowledge, nothing prevents it but their own ignorance on Microsoft's building tools. Users have reported successful buildings of GNU Radio on Windows systems, so there should be not serious caveats building GNSS-SDR as well. However, GNSS-SDR is not blocked for Windows users. There are several virtualization tools that work well. Here we suggest Oracle's [VirtualBox](https://www.virtualbox.org/), a professional solution that can be installed on Windows XP and later and it is freely available as Open Source Software under the terms of the GNU General Public License (GPL) version 2. Users can install VirtualBox on their Windows machine, and then install the ultimate Linux version as a _guest_ operating system. Another possibility is to run GNSS-SDR as a [Docker container](https://github.com/carlesfernandez/docker-gnsssdr).


**The Operating System should not be an issue**: GNSS-SDR can be executed in GNU/Linux distributions as old as Ubuntu  14.04 LTS, and even in Mac OS X starting from 10.9. You are probably already working with newer versions, or you can install a virtual machine running the ultimate Ubuntu or Debian releases.
{: .notice--success}

### Software dependencies

GNSS-SDR builds upon a number of free and open source software libraries:

* [GNU Radio](https://gnuradio.org/), a free and open source toolkit for software radio. In turn, GNU Radio requires a number of software dependencies, some of which are also used by GNSS-SDR. Notably, [Boost](https://www.boost.org/), [FFTW](http://www.fftw.org/) and [VOLK](http://libvolk.org/).
* [Armadillo](http://arma.sourceforge.net/), a C++ linear algebra library. It acts as a wrapper for all the relevant libraries present on your system, such as [LAPACK](http://www.netlib.org/lapack/), [BLAS](http://www.netlib.org/blas/), [OpenBlas](http://www.openblas.net/), [ATLAS](http://math-atlas.sourceforge.net/) and [others](http://arma.sourceforge.net/faq.html#linking).
* [glog](https://github.com/google/glog), a C++ implementation of the Google logging module.
* [gflags](https://github.com/gflags/gflags), a C++ library that implements commandline flags processing.
* A library implementing some basic SSL functions, such as [OpenSSL](https://www.openssl.org/), [GnuTLS](https://www.gnutls.org/) or [LibreSSL](https://www.libressl.org/).

In order to install those dependencies in your system, check out our [building guide]({{ "/build-and-install/" | relative_url }}) and find more details at GNSS-SDR's [README.md](https://github.com/gnss-sdr/gnss-sdr/blob/master/README.md) file.

**Availability of automated tools**: Building and installing GNSS-SDR and its dependencies is a quite complex process, but there are automated tools that can do most of the work for you. Check out our [**building guide**]({{ "/build-and-install/" | relative_url }}).
{: .notice--success}


## GNSS Signal Sources

The input of GNSS-SDR is a sequence of raw digital samples of GNSS signals. The _Signal Source_ abstraction wraps _all_ kind of sources, regardless of their nature: it can be a file containing a sequence of samples (which can be synthetically generated by a computer program, or real GNSS signals grabbed by an actual antenna and radio frequency front-end, and then translated into the digital domain and stored in a hard disk), or an actual device delivering live signal in real-time. In GNSS-SDR, whatever source delivering GNSS signal samples is a _Signal Source_.

For more details about the configuration and possible options, please check out the [**Signal Source documentation**]({{ "/docs/sp-blocks/signal-source/" | relative_url }}).
{: .notice--info}

### Files

The stream of raw GNSS signals samples can be stored in a file. Some of such files are freely available on the Internet, so you do not need access to a GNSS front-end for using GNSS-SDR. Only some few basic parameters are needed to be known (file name and path, the sampling frequency, the format in which samples are delivered, the presence of an Intermediate Frequency) in order to configure GNSS-SDR's _Signal Source_ adequately.

GNSS-SDR consumes data _as fast as it can_, regardless the original sample rate in which signal was captured. Hence, the processing of a file containing captured samples can take less time that the actual recording length.

On the contrary, in multi-system, multi-band configurations using a high number of parallel channels or highly complex algorithms, the host computer could not be able to perform the required processing in due time. While this is an issue in real-time configurations (that would cause buffer overflows and service discontinuity), it is not a problem when processing samples from a file. The software receiver will process samples at its own pace, applying exactly the same processing as it were real-time, and delivering the corresponding outputs as soon as they are available. This is very useful for algorithm prototyping, since its functional performance can be checked before code optimization and does not require a powerful computer.

### Radio frequency front-ends

For real-time operation with live GNSS signals, you will need an "air-to-computer" interface. That is, a suitable antenna and some hardware providing signal amplification at the appropriate frequency ranges (see our [GNSS Signals tutorial]({{ "/docs/tutorials/gnss-signals/" | relative_url }}) for more information about GNSS signals' center frequencies, modulations and recommended bandwidths), downshifting, filtering and conversion to the digital domain, plus some standard connection (usually, through USB or Ethernet) to the host computer in charge of the execution of the software-defined receiver, which will be performing all the baseband processing. Such computer needs to be powerful enough to sustain the required amount of computational load. For simple configurations, any modern laptop should work well.

It follows a non-exhaustive list of commercially available examples of such general-purpose "air-to-computer" interfaces which are suitable for software-defined GNSS receivers:

* **Ettus Research [USRP family](https://www.ettus.com/product)** is designed for RF applications from DC to 6 GHz, and provides a wide range of devices. The USRP product line spans from affordable hobbyist SDRs to high-end high-bandwidth radios. All USRPs can be used by GNSS-SDR through the USRP Hardware Driver ([UHD](https://files.ettus.com/manual/)).

* **Fairwaves [UmTRX](http://umtrx.org)** is an open hardware dual-channel wideband transceiver that covers from 300 MHz to 3.8 GHz with a maximum RF bandwidth of 28 MHz, delivering 12-bit quadrature samples up to 40 MS/s, and it is able to operate at industrial temperature ranges. Host connection is via Gigabit Ethernet, and a special version of UHD provides a host driver, along with the firmware.

* **Great Scott Gadgets [HackRF One](https://greatscottgadgets.com/hackrf/)** is an open source hardware platform for Software Defined Radio that can operate from 1 MHz to 6 GHz, with a maximum quadrature sample rate of 20 MS/s with 8-bit quadrature samples (8-bit I and 8-bit Q). It features a software-controlled port to feed an active antenna and a Hi-Speed USB 2.0 connection. GNSS-SDR integration is provided via [gr-osmosdr](https://sdr.osmocom.org/trac/wiki/GrOsmoSDR).

* **Nuand [BladeRF](https://nuand.com)** is a wideband transceiver that covers from 300 MHz to 3.8 GHz, delivering 12-bit quadrature sampling at a rate up to 40 MS/s. The host connection is via USB 3.0 Superspeed, and GNSS-SDR integration is provided via [gr-osmosdr](https://sdr.osmocom.org/trac/wiki/GrOsmoSDR).

For testing purposes, the antenna can be replaced by a radio frequency GNSS signal generator, which can directly feed the front-end and thus provide controlled inputs to the software-defined receiver. In such a case, you might need an attenuator between the signal generator and the antenna input in order to protect the RF circuitry.


-----

If everything is ready, now you can jump into [building and installing GNSS-SDR]({{ "/build-and-install/" | relative_url }}) in your own computer.

<link rel="prerender" href="{{ "/build-and-install/" | relative_url }}">

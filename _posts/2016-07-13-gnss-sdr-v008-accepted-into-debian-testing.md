---
title: "GNSS-SDR v0.0.8 accepted into Debian testing"
excerpt: "GNSS-SDR v0.0.8 is already in Debian stretch and Ubuntu 16.10."
header:
  teaser: /assets/images/Debian-logo-th.png
tags:
  - news
  - Debian
author_profile: false
sidebar:
  nav: "news"
---

GNSS-SDR v0.0.8 has been accepted as a software package in [Debian testing](https://packages.debian.org/source/testing/gnss-sdr) and [Ubuntu 16.10](https://launchpad.net/ubuntu/+source/gnss-sdr).

This package fixes building when using the new releases of [gnuradio 3.7.10](https://packages.debian.org/sid/gnuradio) and [libvolk1.3](https://packages.debian.org/sid/libvolk1.3), thus closing bug [#828034](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=828034).

The package also closes bug [#828040](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=828040), resulting in a expanded list of processor architectures in which GNSS-SDR can be built, now including:


* **i386**: Intel x86 instruction set (32-bit microprocessors).
* **amd64**: also known as x86-64, the 64-bit version of the x86 instruction set, originally created by AMD and implemented by AMD, Intel, VIA and others.
* **armel**: ARM embedded ABI, supported on ARM v4t and higher.
* **armhf**: ARM hard float, ARMv7 + VFP3-D16 floating-point hardware extension + Thumb-2 instruction set and above.
* **arm64**: ARM 64 bits or ARMv8.
* **mips**: MIPS architecture (big-endian, such as those manufactured by SGI).
* **mipsel**: MIPS architecture (little-endian, such as Loongson 3).
* **mips64el**: 64-bit version of MIPS architecture.
* **powerpc**: the RISC 32-bit microprocessor architecture developed by IBM, Motorola (now Freescale) and Apple.
* **ppc64**: 64-bit big-endian PowerPC architecture.
* **ppc64el**: 64-bit little-endian PowerPC architecture.
* **s390x**: IBM System z architecture for mainframe computers.


This is an improvement in [**Portability**]({{ "/design-forces/portability/" | absolute_url }}).
{: .notice--success}

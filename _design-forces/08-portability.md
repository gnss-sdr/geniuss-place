---
title: "8.- Portability"
permalink: /design-forces/portability/
excerpt: "It refers to the usability of the same software in different environments."
modified: 2016-07-29T15:54:02-04:00
---
{% include toc %}

_Portability_  refers to the usability of the same software in different computing environments.

## Processor architectures

* Intel/AMD [x86](https://en.wikipedia.org/wiki/X86){:target="_blank"} instruction set (32 and 64 bits).
* [PowerPC](https://en.wikipedia.org/wiki/PowerPC){:target="_blank"}: big-endian and little-endian, 32 and 64 bits.

* [ARM](https://en.wikipedia.org/wiki/ARM_architecture){:target="_blank"}: version v4t and above, including 64-bit ARMv8.
* [MIPS](https://en.wikipedia.org/wiki/MIPS_instruction_set){:target="_blank"}: big-endian and little-endian, 32 and 64 bits.


* [IBM System z](https://en.wikipedia.org/wiki/IBM_System_z){:target="_blank"}: IBM's architecture for mainframe computers.


## Operating systems

*  **GNU/Linux**: ...
*  **Mac OS X**: ...
*  **Microsoft Windows**:

## Indicators of Portability

Possible portability indicators are:

* Supported processor architectures:

  - **i386**: Intel x86 instruction set (32-bit microprocessors).
  - **x86_64/amd64**: the 64-bit version of the x86 instruction set, originally created by AMD and implemented by AMD, Intel, VIA and others.% Most popular processor architecture in today's laptops, desktops and even powerful mainframe computers.
  - **armhf**: ARM hard float, ARMv7 + VFP3-D16 floating-point hardware extension + Thumb-2 instruction set and above.
  - **arm64**: ARM 64 bits or ARMv8.% (next ARM generation, present in today's high-end smartphones and tablets).
  - **Support of GPU offloading** (define vendor/model).
  - **Support of FPGA offloading** (define vendor/model).
  - **Other** (define).

* Supported operating systems:

  - GNU/Linux: specify distributions and versions.
  - Mac OS X: specify versions.
  - Microsoft Windows: specify versions.
  - Real Time Operating System (specify).
  - Others (define) / None (bare metal program).

* Other software dependencies (define).

*  Minimal memory and storage requirements.

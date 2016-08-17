---
title: "8.- Portability"
permalink: /design-forces/portability/
excerpt: "It refers to the usability of the same software in different environments."
modified: 2016-07-29T15:54:02-04:00
---
{% include toc %}

_Portability_  refers to the usability of the same software in different computing environments. In this context, a _computer environment_ is defined by its hardware architecture, operating system and runtime libraries.

Software is portable when the cost of porting it to a new platform is significantly less than the cost of writing it from scratch. The lower the cost of porting software, relative to its implementation cost, the more portable it is said to be.

A prerequirement for portability is the generalized abstraction between the application logic and system interfaces.


## Processor architectures

The instructions supported by a particular processor and their byte-level encodings
are known as its _instruction-set architecture_ (ISA). A program compiled for one
type of machine will not run on another. On the other hand, there are many different models of processors
within a single family. Each manufacturer produces processors of ever-growing performance and complexity,
but the different models remain compatible at the ISA level. Popular families, such as x86-64 or ARM, have processors supplied by multiple manufacturers.

Examples of notable CPU architectures:

* [x86](https://en.wikipedia.org/wiki/X86){:target="_blank"} instruction sets (32 and 64 bits).
  * Intel's [IA-32](https://en.wikipedia.org/wiki/IA-32){:target="_blank"} architecture, also called x86-32.
  * [x86-64](https://en.wikipedia.org/wiki/X86-64){:target="_blank"} with AMD's [AMD64](https://en.wikipedia.org/wiki/X86-64#AMD64){:target="_blank"} and Intel's [Intel 64](https://en.wikipedia.org/wiki/X86-64#Intel_64){:target="_blank"} versions.

* ARM's
   * [ARM architecture](https://en.wikipedia.org/wiki/ARM_architecture){:target="_blank"} (32-bit).
   * [ARM64](https://en.wikipedia.org/wiki/ARM_architecture#64-bit){:target="_blank"} (64/32-bit).

* [Power Architecture](https://en.wikipedia.org/wiki/Power_Architecture){:target="_blank"} (formely known as [PowerPC](https://en.wikipedia.org/wiki/PowerPC){:target="_blank"}): big-endian and little-endian, 32 and 64 bits.

* DEC's [Alpha](https://en.wikipedia.org/wiki/DEC_Alpha){:target="_blank"} architecture for workstations and servers (64-bit).

* Intel's [Itanium](https://en.wikipedia.org/wiki/Itanium){:target="_blank"} architecture (formely called IA-64) for enterprise servers and high-performance computing systems (64-bit).

* MIPS Computer Systems Inc.'s [MIPS architecture](https://en.wikipedia.org/wiki/MIPS_instruction_set){:target="_blank"}: big-endian and little-endian, 32 and 64 bits.

* Oracle's [SPARC](https://en.wikipedia.org/wiki/SPARC){:target="_blank"} architecture for high-end servers (64-bit).

* [IBM System z](https://en.wikipedia.org/wiki/IBM_System_z){:target="_blank"}: IBM's architecture for mainframe computers (64-bit).

* [MIL-STD-1750A](https://en.wikipedia.org/wiki/MIL-STD-1750A){:target="_blank"}: the U.S.'s military standard computer (16-bit).

* IBM's [AP-101](https://en.wikipedia.org/wiki/IBM_AP-101){:target="_blank"}: the Space Shuttle's computer (32-bit).

In addition, a software-defined GNSS receiver can perform _computation offloading_, which consists in the transfer of certain computing tasks from the Central Processing Unit (CPU) to an external platform, such as a Graphics Processing Unit (GPU), a Field Programmable Gate Array (FPGA) device or a cloud-based service.

## Operating systems

An operating system (OS) is system software that manages computer hardware and software resources and provides common services for computer programs.

Software-defined GNSS receivers are _applications_, that is, computer programs designed to perform a group of coordinated functions, tasks, or activities for the benefit of the user.

Applications that do not need an operating system are called _bare metal_ applications.

*  **Unix** and **Unix-like** operating systems:

   * The present owner of the trademark _UNIX_ is [The Open Group](http://www.opengroup.org/){:target="_blank"}, an industry standards consortium. Only systems fully compliant with and certified to the [Single Unix Specification](https://en.wikipedia.org/wiki/Single_UNIX_Specification){:target="_blank"} qualify as "[Unix](https://en.wikipedia.org/wiki/Unix){:target="_blank"}" (others are called "Unix system-like" or "Unix-like"). Examples:
     * HP's [HP-UX](https://en.wikipedia.org/wiki/HP-UX){:target="_blank"}
     * IBM's [AIX](https://en.wikipedia.org/wiki/IBM_AIX){:target="_blank"}
     * Sun Microsystems's [Solaris](https://en.wikipedia.org/wiki/Solaris_(operating_system)){:target="_blank"}
     * IBM's [z/OS](https://en.wikipedia.org/wiki/Z/OS){:target="_blank"}
     * Apple's [OS X](https://en.wikipedia.org/wiki/OS_X){:target="_blank"}

   * [BSD](https://en.wikipedia.org/wiki/Berkeley_Software_Distribution){:target="_blank"} and its descendants, which includes [FreeBSD](https://en.wikipedia.org/wiki/FreeBSD){:target="_blank"}, [NetBSD](https://en.wikipedia.org/wiki/NetBSD){:target="_blank"}, and [OpenBSD](https://en.wikipedia.org/wiki/OpenBSD){:target="_blank"}.

   * The [Linux](https://en.wikipedia.org/wiki/Linux){:target="_blank"} kernel, used in some popular distributions such as [Debian](https://www.debian.org/){:target="_blank"}, [Fedora](https://getfedora.org/){:target="_blank"}, [Ubuntu](http://www.ubuntu.com/){:target="_blank"}, [openSUSE](https://www.opensuse.org/){:target="_blank"}, [Arch Linux](https://www.archlinux.org/){:target="_blank"}, [Linux Mint](https://www.linuxmint.com/){:target="_blank"}, [Linaro](https://en.wikipedia.org/wiki/Linaro){:target="_blank"}, [Raspbian](https://www.raspbian.org/){:target="_blank"} or Google's [Android](https://www.android.com/){:target="_blank"}.

*  **Microsoft Windows** is a family of proprietary operating systems designed by Microsoft Corporation and primarily targeted to Intel architecture based computers, with a [relevant percent total usage share](https://en.wikipedia.org/wiki/Usage_share_of_operating_systems){:target="_blank"} on Web connected computers. Latest version is [Windows 10](https://en.wikipedia.org/wiki/Windows_10){:target="_blank"}, which was preceded by [Windows 7](https://en.wikipedia.org/wiki/Windows_7){:target="_blank"}, [Windows Vista](https://en.wikipedia.org/wiki/Windows_Vista){:target="_blank"} and [Windows XP](https://en.wikipedia.org/wiki/Windows_XP){:target="_blank"}.

* **Real-Time Operating Systems** such as [VxWorks](http://windriver.com/products/vxworks/){:target="_blank"}, [eCos](http://ecos.sourceware.org/){:target="_blank"}, [QNX](http://www.qnx.com/){:target="_blank"}, [MontaVista Linux](http://www.mvista.com/){:target="_blank"} and [RTLinux](http://www.rtlinux.org/){:target="_blank"}.


## Indicators of Portability

Possible portability indicators are:

* Number of supported processor architectures (specify distribution and release).

* Support of GPU offloading (define GPU's vendor/model).

* Support of FPGA offloading (define FPGA's vendor/model).

* Number of supported operating systems:
  - GNU/Linux: specify distributions and versions.
  - OS X: specify versions.
  - Microsoft Windows: specify versions.
  - Real Time Operating System (specify).
  - Others (define) / None (bare metal program).

* Other software dependencies (define).

* Minimal memory and storage requirements.

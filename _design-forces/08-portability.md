---
title: "8.- Portability"
permalink: /design-forces/portability/
excerpt:
  "It refers to the usability of the same software in different environments."
header:
  teaser: /assets/images/radar-chart.png
toc: true
toc_sticky: true
last_modified_at: 2017-08-09T15:54:02-04:00
---

_Portability_ refers to the usability of the same software in different
computing environments. In this context, a _computer environment_ is defined by
its hardware architecture, operating system, and runtime libraries.

Software is portable when the cost of porting it to a new platform is
significantly less than the cost of writing it from scratch. The lower the cost
of porting software, relative to its implementation cost, the more portable it
is said to be.

A pre-requirement for portability is the generalized abstraction between the
application logic and system interfaces.

## Processor architectures

The instructions supported by a particular processor and their byte-level
encodings are known as its _instruction-set architecture_ (ISA). A program
compiled for one type of machine will not run on another. On the other hand,
there are many different models of processors within a single family. Each
manufacturer produces processors of ever-growing performance and complexity, but
the different models remain compatible at the ISA level. Popular families, such
as x86-64 or ARM, have processors supplied by multiple manufacturers.

Examples of notable CPU architectures:

- [x86](https://en.wikipedia.org/wiki/X86) instruction sets (32 and 64 bits).
  - Intel's [IA-32](https://en.wikipedia.org/wiki/IA-32) architecture, also
    called x86-32.
  - [x86-64](https://en.wikipedia.org/wiki/X86-64) with AMD's
    [AMD64](https://en.wikipedia.org/wiki/X86-64#AMD64) and Intel's
    [Intel 64](https://en.wikipedia.org/wiki/X86-64#Intel_64) versions.
    - Single Instruction Multiple Data (SIMD) instruction set extensions: SSE2,
      SSE3, SSSE3, SSE4.1, SSE4.2, AVX, AVX2, FMA, AVX-512, and others (see the
      [Intel Intrinsics
      Guide](https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html)
      for a full list of technologies).

- ARM
  - [ARM architecture](https://en.wikipedia.org/wiki/ARM_architecture) (32-bit).
    - SIMD instruction set extension:
      [NEON](https://developer.arm.com/Architectures/Neon).
  - [AArch64](https://en.wikipedia.org/wiki/ARM_architecture#64-bit)
    (64/32-bit).
    - SIMD instruction set extension: AArch64 NEON instruction set.

- [Power Architecture](https://en.wikipedia.org/wiki/Power_Architecture)
  (formerly known as [PowerPC](https://en.wikipedia.org/wiki/PowerPC)):
  big-endian and little-endian, 32 and 64 bits.

- DEC's [Alpha](https://en.wikipedia.org/wiki/DEC_Alpha) architecture for
  workstations and servers (64-bit).

- Intel's [Itanium](https://en.wikipedia.org/wiki/Itanium) architecture
  (formerly called IA-64) for enterprise servers and high-performance computing
  systems (64-bit).

- MIPS Computer Systems Inc.'s
  [MIPS architecture](https://en.wikipedia.org/wiki/MIPS_instruction_set):
  big-endian and little-endian, 32 and 64 bits.

- Oracle's [SPARC](https://en.wikipedia.org/wiki/SPARC) architecture for
  high-end servers (64-bit).

- [IBM System z](https://en.wikipedia.org/wiki/IBM_System_z): IBM's architecture
  for mainframe computers (64-bit).

- [MIL-STD-1750A](https://en.wikipedia.org/wiki/MIL-STD-1750A): the U.S.'s
  military standard computer (16-bit).

- IBM's [AP-101](https://en.wikipedia.org/wiki/IBM_AP-101): the Space Shuttle's
  computer (32-bit).

In addition, a software-defined GNSS receiver can perform _computation
offloading_, which consists in the transfer of certain computing tasks from the
Central Processing Unit (CPU) to an external platform, such as a Graphics
Processing Unit (GPU), a Field Programmable Gate Array (FPGA) device or a
cloud-based service.

## Operating systems

An operating system (OS) is system software that manages computer hardware and
software resources and provides common services for computer programs.

Software-defined GNSS receivers are _applications_, that is, computer programs
designed to perform a group of coordinated functions, tasks, or activities for
the benefit of the user.

Applications that do not need an operating system are called _bare-metal_
applications.

- **Unix** and **Unix-like** operating systems:

  - The present owner of the trademark _UNIX_ is
    [The Open Group](https://www.opengroup.org/), an industry standards
    consortium. Only systems fully compliant with and certified to the
    [Single Unix Specification](https://en.wikipedia.org/wiki/Single_UNIX_Specification)
    qualify as "[Unix](https://en.wikipedia.org/wiki/Unix)" (others are called
    "Unix system-like" or "Unix-like"). Examples:
    - HP's [HP-UX](https://en.wikipedia.org/wiki/HP-UX).
    - IBM's [AIX](https://en.wikipedia.org/wiki/IBM_AIX).
    - Sun Microsystems's
      [Solaris](<https://en.wikipedia.org/wiki/Solaris_(operating_system)>).
    - IBM's [z/OS](https://en.wikipedia.org/wiki/Z/OS).
    - Apple's [OS X](https://en.wikipedia.org/wiki/OS_X).

  - [BSD](https://en.wikipedia.org/wiki/Berkeley_Software_Distribution) and its
    descendants, which includes
    [FreeBSD](https://en.wikipedia.org/wiki/FreeBSD),
    [NetBSD](https://en.wikipedia.org/wiki/NetBSD), and
    [OpenBSD](https://en.wikipedia.org/wiki/OpenBSD).

  - The [Linux](https://en.wikipedia.org/wiki/Linux) kernel, used in some
    popular distributions such as [Debian](https://www.debian.org/),
    [Fedora](https://fedoraproject.org/), [Ubuntu](https://ubuntu.com/),
    [openSUSE](https://www.opensuse.org/),
    [Arch Linux](https://archlinux.org/),
    [Linux Mint](https://www.linuxmint.com/),
    [Linaro](https://en.wikipedia.org/wiki/Linaro),
    [Raspbian](https://www.raspbian.org/) or Google's
    [Android](https://www.android.com/).

- **Microsoft Windows** is a family of proprietary operating systems designed by
  Microsoft Corporation and primarily targeted to Intel architecture based
  computers, with a
  [relevant percent total usage share](https://en.wikipedia.org/wiki/Usage_share_of_operating_systems)
  on Web-connected computers. The latest version is
  [Windows 10](https://en.wikipedia.org/wiki/Windows_10), which was preceded by
  [Windows 7](https://en.wikipedia.org/wiki/Windows_7),
  [Windows Vista](https://en.wikipedia.org/wiki/Windows_Vista), and
  [Windows XP](https://en.wikipedia.org/wiki/Windows_XP).

- **Real-Time Operating Systems** such as
  [VxWorks](https://www.windriver.com/products/vxworks),
  [eCos](http://ecos.sourceware.org/), [QNX](https://blackberry.qnx.com/en/),
  [Wind River Linux](https://www.windriver.com/products/linux), and Real-Time Executive for
  Multiprocessor Systems ([RTEMS](https://www.rtems.org/)).

## Building tools

In the case of using compiled programming languages, software libraries and
executables are generated from the source code through three kinds of tools:

- **Build system generators**, which automatically generate _build files_ from
  human-written configuration files. Popular examples of those tools are the
  [GNU Build System](https://en.wikipedia.org/wiki/GNU_Build_System) (also known
  as Autotools), [CMake](https://cmake.org), and [SCons](https://scons.org).
- **Build automation tools**, which automatically build executable
  programs and libraries from the source code with the aid of _build files_ that
  contains _rules_ describing targets, components, and dependencies. Examples
  are [GNU Make](https://www.gnu.org/software/make/), Unix's
  [make](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/make.html),
  [Ninja](https://ninja-build.org), and
  [others](https://en.wikipedia.org/wiki/List_of_build_automation_software).
- **Compilers**, which are programs that convert instructions into a
  machine-code or lower-level form so that they can be read and executed by a
  computer. In general, it is desirable to be able to build the source code with
  different compilers, since it improves the overall quality of code by
  providing different checks and alerts. Examples of compilers are:
  - the [GNU Compiler Collection](https://gcc.gnu.org), which provides front
    ends for C (`gcc`), C++ (`g++`), Fortran (`gfortran`), Java (`gcj`) and
    other languages;
  - the [LLVM](https://llvm.org) project, which provides front-ends for C /
    Objective-C (`clang`) and C++ (`clang++`), while other external projects
    allow the compilation of Ruby, Python, Haskell, Java, D, PHP, Pure, Lua, and
    a number of other languages.
  - Those included in [Microsoft Visual Studio](https://visualstudio.microsoft.com/),
    such as the Microsoft C++ Compiler (MSVC) provided by
    [Microsoft Visual C++](https://en.wikipedia.org/wiki/Microsoft_Visual_C%2B%2B);
    `vbc.exe`, the Visual Basic .NET compiler; and `csc.exe`, the C# compiler,
    among others;
  - [other compilers](https://en.wikipedia.org/wiki/List_of_compilers).
  - In the case of targeting embedded platforms, it is desirable the
    availability of cross-compilers, which are compilers capable of creating
    executable code for a platform other than the one on which the compiler is
    running. Examples are GCC and the .NET Framework compiler.

Using popular, widely available cross-platform tools helps to ensure portability
among different systems and architectures.

In the case of using interpreted programming languages, portability is
determined by the availability of a language interpreter above the minimal
required version in the targeted platform(s).

- Examples of interpreted languages are GNU Octave, Matlab, Mathematica, Maple,
  Tcl, Haskell, Perl, and Excel spreadsheets.
- Other interpreted languages use an intermediate representation, which combines
  compiling and interpreting. This is the case with Java, Python, or Ruby, among
  others.

## Indicators of Portability

It follows a list of possible portability indicators for a software-defined GNSS
receiver:

- Number of supported processor architectures (specify distribution and
  release).

- Number of supported operating systems:
  - GNU/Linux: specify distributions and minimum working version.
  - OS X: specify minimum working version.
  - Microsoft Windows: specify minimum working version.
  - Real Time Operating System (specify OS and minimum working version).
  - Others (define) / None (bare metal program).

- Number of supported building toolchains:
  - Use of cross-platform build system generators such as Autotools or CMake
    (specify minimum working version).
  - Use of cross-platform build automation tools such as Make or Ninja (specify
    minimum working version).
  - Use of cross-platform compiler(s) or language interpreter(s) (specify
    minimum working versions).
    - Possibility to build the code with more than one build automation tool
      and/or compiler.
  - Availability of cross-compilation toolchains.
    - Provision of a cross-compilation Software Developer Kit (SDK) for
      developers.

- Supported SIMD technologies.
  - In x86-based architectures: SSE2, SSE3, SSSE3, SSE4.1, SSE4.2, AVX, AVX2,
    FMA, AVX-512 family.
  - In ARM architectures: NEON, AArch64 NEON.

- Support of GPU offloading (define GPU's vendor/model).
  - Through OpenCL.
  - Through CUDA.
  - Others.

- Support of FPGA offloading (define FPGA's vendor/model).
  - [AMD (formerly Xilinx)](https://www.xilinx.com/products/silicon-devices/fpga.html)
  - [Intel (formerly Altera)](https://www.intel.com/content/www/us/en/products/programmable.html)
  - [Microchip (formerly Actel)](https://www.microchip.com/en-us/products/fpgas-and-plds#)
  - Others.

- Other software dependencies (define required minimal versions).
  - Availability of software dependencies in the targeted platform(s).

- Minimal memory and storage requirements.

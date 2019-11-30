---
title: "GNSS-SDR v0.0.10 released"
excerpt: "GNSS-SDR v0.0.10 has been released."
header:
  teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2018-12-14T12:54:02+02:00  
---

This release has several improvements in different dimensions, addition of new features and bug fixes:


## Improvements in [Accuracy]({{ "/design-forces/accuracy/" | relative_url }}):

 * Part of the [RTKLIB](http://www.rtklib.com/) core library has been integrated into GNSS-SDR. There is now a single PVT block implementation which makes use of RTKLIB to deliver PVT solutions, including Single and PPP navigation modes.
 * Fixed CN0 estimation for other correlation times than 1 ms.
 * Improved computation of tracking parameters and GNSS observables.
 * Other minor bug fixes.


## Improvements in [Availability]({{ "/design-forces/availability/" | relative_url }}):

 * Internal Finite State Machines rewritten for improved continuity in delivering position fixes. This fixes a bug that was stalling the receiver after about six hours of continuous operation.
 * Redesign of the time counter for enhanced continuity.
 * Improved flow graph in multisystem configurations: the receiver does not get stalled anymore if no signal is found from the first system.
 * Improved acquisition and tracking sensitivity.
 * Added mechanisms for Assisted GNSS, thus shortening the Time-To-First-Fix. Provision of data via XML files or via SUPL v1.0. Documented [here](https://gnss-sdr.org/docs/sp-blocks/global-parameters/).
 * Other minor bug fixes.


## Improvements in [Efficiency]({{ "/design-forces/efficiency/" | relative_url }}):

 * Added the possibility of non-blocking acquisition, which works well when using real-time data from an RF front-end.
 * Improved flow graph in multiband configurations: satellites acquired in one band are immediately searched in others.
 * Complex local codes have been replaced by real codes, alleviating the computational burden.
 * New `volk_gnsssdr` kernels: `volk_gnsssdr_16i_xn_resampler_16i_xn.h`, `volk_gnsssdr_16ic_16i_rotator_dot_prod_16ic_xn.h`, `volk_gnsssdr_32f_xn_resampler_32f_xn.h`, `volk_gnsssdr_32fc_32f_rotator_dot_prod_32fc_xn.h`.
 * Some AVX2 implementations added to the `volk_gnsssdr` library.
 * Improvement in C++ usage: Use of `const` container calls when result is immediately converted to a `const` iterator. Using these members removes an implicit conversion from `iterator` to `const_iterator`.
 * Output printers can be shut down, with some savings in memory and storage requirements.
 * A number of code optimizations here and there.


## Improvements in [Flexibility]({{ "/design-forces/flexibility/" | relative_url }}):

 * A number of new parameters have been exposed to the configuration system.
 * Possibility to choose Pilot or Data component for tracking of GPS L5 and Galileo E5a signals.
 * Enabled extended coherent integration times.
 * Configurable coherent and/or non-coherent signal acquisition.
 * Some configuration parameters can now be overridden by commandline flags for easier use in scripts.


## Improvements in [Interoperability]({{ "/design-forces/interoperability/" | relative_url }}):

 * Added the GPS L5 receiver chain.
 * Added the GLONASS L1 SP receiver chain.
 * Added the GLONASS L2 SP receiver chain.
 * Improvements in the Galileo E5a and GPS L2C receiver chains.
 * Updated list of available GNSS satellites.
 * Added five more signal sources: [`Fmcomms2_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-fmcomms2_signal_source" | relative_url }}) (requires [gr-iio](https://github.com/analogdevicesinc/gr-iio)), [`Plutosdr_Signal Source`]({{ "/docs/sp-blocks/signal-source/#implementation-plutosdr_signal_source" | relative_url }}) (requires [gr-iio](https://github.com/analogdevicesinc/gr-iio)), [`Spir_GSS6450_File_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-spir_gss6450_file_signal_source" | relative_url }}), [`Labsat_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-labsat_signal_source" | relative_url }}) and `Custom_UDP_Signal_Source` (requires [libpcap](https://www.tcpdump.org/)).
 * Improved support for BladeRF, HackRF and RTL-SDR front-ends.
 * Added tools for the interaction with front-ends based on the AD9361 chipset.
 * Intermediate results are now saved in `.mat` binary format, readable from Matlab/Octave and from Python via [h5py](https://www.h5py.org/).
 * Added the [GPX](http://www.topografix.com/gpx.asp) output format.
 *  Improvements in the generation of KML files.
 *  Improvements in the NMEA output. The receiver can produce GPGGA, GPRMC, GPGSA, GPGSV, GAGSA and GAGSV sentences.
 *  Improvements in the RTCM server stability.
 *  Improvements in the correctness of generated RINEX files.
 *  The receiver can read and make use of Galileo [almanac XML files published by the European GNSS Service Centre](https://www.gsc-europa.eu/system-status/almanac-data).
 *  Own-defined XML schemas for navigation data published [here](https://github.com/gnss-sdr/gnss-sdr/tree/next/docs/xml-schemas)
 *  Added program rinex2assist to convert RINEX navigation files into XML files usable for Assisted GNSS. Only available building from source. See the [README](https://github.com/gnss-sdr/gnss-sdr/tree/next/src/utils/rinex2assist).



## Improvements in [Maintainability]({{ "/design-forces/maintainability/" | relative_url }}):

 * Setup of a Continuous Integration system that checks building and runs QA code in a wide range of GNU/Linux distributions (ArchLinux, CentOS, Debian, Fedora, OpenSUSE, Ubuntu) and releases. See the latest GitLab [pipeline](https://gitlab.com/gnss-sdr/gnss-sdr/pipelines) for this project.
 * Creation of multi-system processing blocks, drastically reducing code duplication and maintainability time.
 * Automated code formatting with [clang-format](https://clang.llvm.org/docs/ClangFormat.html). This tool is widely available and easy to integrate into many code editors, and it also can be used from the command line. It cuts time spent on adhering to the project's code formatting style.
 * Improvement in C++ usage: C-style casts have been replaced by C++ casts. C-style casts are difficult to search for. C++ casts provide compile time checking ability and express programmers' intent better, so they are safer and clearer.
 * Improvement in C++ usage: The `override` special identifier is now used when overriding a virtual function. This helps the compiler to check for type changes in the base class, making the detection of errors easier.
 * Improvement in C++ usage: A number of unused includes have been removed. Order of includes set to: local (in-source) headers, then library headers, then system headers. This helps to detect missing includes.
 * Improvement in C++ usage: Enhanced `const` correctness. Misuses of those variables are detected by the compiler.
 * Improved code with clang-tidy and generation of a compile_commands.json file containing the exact compiler calls for all translation units of the project in machine-readable form if clang-tidy is detected.
 * Applied some style rules to CMake scripts.
 * Minimal versions of dependencies identified and detected.


## Improvements in [Portability]({{ "/design-forces/portability/" | relative_url }}):

 * Several CMake scripts improvements, more verbose outputs in case of errors. Building configuration has been documented in a [tutorial]({{ "/docs/tutorials/configuration-options-building-time/" | relative_url }}).
 * Improved SDK for cross-compilation in embedded devices. Documented in a [tutorial]({{ "docs/tutorials/cross-compiling/" | relative_url }}).
 * Improved control over minimum required versions for core dependencies.
 * The software builds with C++11, C++14 and C++17 standards.
 * The software can now be built using GCC >= 4.7.2 or LLVM/Clang >= 3.4.0 compilers on GNU/Linux, and with Clang/AppleClang on MacOS.
 * The Ninja build system can be used in replacement of make.
 * The `volk_gnsssdr` library can be built using Python 2.7+ or Python 3.6+.
 * The `volk_gnsssdr` library is now ready for AArch64 NEON instructions.
 * Improved detection of required and optional dependencies in many GNU/Linux distributions and processor architectures.
 * Improvement in C++ usage: The `<ctime>` library has been replaced by the more modern and portable `<chrono>`.
 * Improvement in C++ usage: The `<stdio.h>` library has been replaced by the more modern and portable `<fstream>` for file handling.
 * Improvement in C++ usage: C++ libraries preferred over C libraries (_e.g._, `<cctype>` instead of `<ctype.h>`, `<cmath>` instead of `<math.h>`, etc.).
 * Fixes required by [Debian packaging](https://packages.debian.org/sid/gnss-sdr).
 * Fixes required by [Macports packaging](https://www.macports.org/ports.php?by=name&substr=gnss-sdr).
 * A downside in portability: BLAS and LAPACK libraries are now required even in ARM devices.
 * A downside in portability: the [matio library](https://github.com/tbeu/matio) >= 1.5.3 is a new required dependency. If not found, it is downloaded and built automatically at building time, but this requires `libtool`, `automake` and `hdf5` already installed in the system.
 * A downside in portability: the PugiXML library is a new required dependency. If not found, it is downloaded and built automatically at building time.



## Improvements in [Reliability]({{ "/design-forces/reliability/" | relative_url }}):

 * Introduced 3 new Input Filter implementations for pulsed and narrowband interference mitigation: `Pulse_Blanking_Filter`, `Notch_Filter` and `Notch_Filter_Lite`. Documented in the [Input Filter documentation page]({{ "/docs/sp-blocks/input-filter/" | relative_url }}).
 * Improved flow graph stability.
 * Introduction of high-integrity C++ practices into the source code and included in the [coding style guide]({{ "/coding-style/" | relative_url }}).
 * Fixed a number of defects detected by [Coverity Scan](https://scan.coverity.com/projects/gnss-sdr-gnss-sdr).
 * Improvement in C++ usage: `rand()` function replaced by `<random>` library.
 * Improvement in C++ usage: `strlen` and `strncpy` have been replaced by safer C++ counterparts.
 * Improvement in C++ usage: Some destructors have been fixed, avoiding segmentation faults when exiting the program.
 * Website switched from `http` to `https`. Links in the source tree switched when available.

## Improvements in [Reproducibility]({{ "/design-forces/reproducibility/" | relative_url }}):

 * Setup of a Continuous Reproducibility system at GitLab for the automatic reproduction of experiments. The concept was introduced in [this paper](https://ieeexplore.ieee.org/document/8331069/). Example added in the [`src/utils/reproducibility/ieee-access18/`](https://github.com/gnss-sdr/gnss-sdr/tree/next/src/utils/reproducibility/ieee-access18) folder.
 * Fixes of Lintian warnings related to build reproducibility.

## Improvements in [Scalability]({{ "/design-forces/scalability/" | relative_url }}):

 * Improvements in multi-system, multi-band receiver configurations. The receiver now accepts any number of channels and systems in the three available bands.
 * All possible combinations of signals and integration times are now accepted by the [Observables]({{ "/docs/sp-blocks/observables/" | relative_url }}) block.

## Improvements in [Testability]({{ "/design-forces/testability/" | relative_url }}):

 * Several Unit Tests added. Documentation of testing concepts and available in a [tutorial]({{ "/docs/tutorials/testing-software-receiver//" | relative_url }}).
 - New extra unit test AcquisitionPerformanceTest checks the performance of Acquisition blocks.
 - New extra unit test TrackingPullInTest checks acquisition to tracking transition.
 - New extra unit test HybridObservablesTest checks the generation of observables.
 - Improved system testing: position_test accepts a wide list of parameters and can be used with external files.
 - Receiver channels can now be fixed to a given satellite.
 * Improved [CTest](https://cmake.org/cmake/help/latest/manual/ctest.1.html) support in `volk_gnsssdr`.


## Improvements in [Usability]({{ "/design-forces/usability/" | relative_url }}):

 * All Observables block implementations have been merged into a single implementation for all kinds of GNSS signals, making it easier to configure.
 * All PVT block implementations have been merged into a single implementation for all kinds of GNSS signals, making it easier to configure.
 * Misleading parameter name `GNSS-SDR.internal_fs_hz` has been replaced by `GNSS-SDR.internal_fs_sps`. The old parameter name is still read. If found, a warning is provided to the user.
 * Updated and improved [documentation of processing blocks]({{ "/docs/sp-blocks/" | relative_url }}).
 * Improved documentation of required dependency packages in several GNU/Linux distributions.
 * Parameter names with the same role have been harmonized within different block implementations.
 * Added a [changelog](https://github.com/gnss-sdr/gnss-sdr/blob/master/docs/changelog), a [code of conduct](https://github.com/gnss-sdr/gnss-sdr/blob/master/CODE_OF_CONDUCT.md), a [contributing guide](https://github.com/gnss-sdr/gnss-sdr/blob/master/CONTRIBUTING.md) and a [pull-request template](https://github.com/gnss-sdr/gnss-sdr/blob/next/.github/PULL_REQUEST_TEMPLATE.md) in the source tree.
 * Added colors to the commandline user interface.
 * Updated manfiles.


-----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.10) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).

<a href="http://doi.org/10.5281/zenodo.2279988" ><i class="ai ai-fw ai-doi ai-lg" aria-hidden="true"></i></a>In order to make GNSS-SDR more easily referenced, and to promote reproducible research, each software release gets a Digital Object Identifier provided by [Zenodo](https://zenodo.org/faq). The DOI for GNSS-SDR v0.0.10 is [10.5281/zenodo.2279988](http://dx.doi.org/10.5281/zenodo.2279988).
{: .notice--info}

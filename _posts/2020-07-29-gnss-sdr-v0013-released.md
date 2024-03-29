---
title: "GNSS-SDR v0.0.13 released"
excerpt: "GNSS-SDR v0.0.13 has been released."
header:
 teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2020-07-29T08:54:02+02:00
---

This is a maintenance release which includes bug fixes, compatibility with the
most recent compiler versions, some code optimization and the addition of minor
new features. Most relevant changes with respect to the former release are
listed below:

## Improvements in [Efficiency]({{ "/design-forces/efficiency/" | relative_url }}):

 * Faster internal handling of `Gnss_Synchro` objects by reducing the amount of
 copying via adding `noexcept` move constructor and move assignment operators,
 so the move semantics are also used in STL containers.
 * All `std::endl` have been replaced by the `'\n'` character, since there is no
 need to always flush the stream.
 * Performed a stack reordering of class members that seems to offer
 statistically better performance in some processor architectures and/or
 compilers.
 * Add building option `ENABLE_STRIP` to generate stripped binaries (that is,
 without debugging symbols), smaller in size and potentially providing better
 performance than non-stripped counterparts. Only for GCC in Release build
 mode. Set to `OFF` by default.


## Improvements in [Maintainability]({{ "/design-forces/maintainability/" | relative_url }}):

 * Improved usage of smart pointers to better express ownership of resources.
 * Add definition of `std::make_unique` for buildings with C++11, and make use of
 it along the source code.
 * Private members in headers have been sorted by type and size, minimizing
 padding space in the stack and making the files more readable for humans.
 * Simpler, less error-prone design of the `GNSSBlockFactory` class public API
 and internal implementation.
 * Simpler API for the `Pvt_Solution` class.
 * Improved system constant definition headers, numerical values are only written
 once.
 * Improved const correctness.
 * The software can now be built against the GNU Radio 3.9 API that uses standard
 library's smart pointers instead of Boost's. Minimum GNU Radio required
 version still remains at 3.7.3.
 * The software can now be built against Boost <= 1.73 (minimum version: 1.53).
 * Fixed building with GCC 10 (gcc-10 and above flipped a default from `-fcommon`
 to `-fno-common`, causing an error due to multiple defined lambda functions).
 * Fixed warnings risen by GCC 10 and Clang 10.
 * Various improvements in the CMake scripts: better decision on the C++ standard
 to use; simplifications for various API dependency and environment versions
 requirements, with more intuitive naming for variables; fixed the
 `ENABLE_CLANG_TIDY` option; better GFORTRAN module; and broader adoption of
 the modern per-target approach.


## Improvements in [Portability]({{ "/design-forces/portability/" | relative_url }}):

 * The software can now be cross-compiled on Petalinux environments.
 * Removed python six module as a dependency if using Python 3.x.
 * Make use of `std::span` if the compiler supports it, and use gsl-lite as a
 fallback. The latter has been updated to version
 [0.37.0](https://github.com/gsl-lite/gsl-lite/releases/tag/0.37.0).
 * Improved finding of libgfortran in openSUSE and Fedora distributions.
 * Improved interface for FPGA off-loading.
 * Allow a random name for the build type. If not recognized, it is set to
 `None`. This allows packaging in some distributions that pass an arbitrary
 name as the build type (e.g., Gentoo) to avoid unexpected compiler flags. The
 building option `ENABLE_PACKAGING` must be set to `ON` when packaging.
 * Do not stop the receiver if SysV message queues cannot be created.


## Improvements in [Reliability]({{ "/design-forces/reliability/" | relative_url }}):

 * Fixed a bug in GLONASS GNAV CRC computation.
 * Fixed a bug in GLONASS time year.
 * Fixed a possible buffer overflow in the generation of RTCM messages.
 * Fixed bugs which could cause a random crash on receiver stopping.


## Improvements in [Reproducibility]({{ "/design-forces/reproducibility/" | relative_url }}):

 * Improved reproducibility of the volk_gnsssdr library: Drop compile-time CPU
 detection.


## Improvements in [Testability]({{ "/design-forces/usability/" | relative_url }}):

 * Add building option `ENABLE_BENCHMARKS`, which activates the building of
 benchmarks for some code snippets, making it easier to developers to benchmark
 different implementations for the same purpose. Set to `OFF` by default.


## Improvements in [Usability]({{ "/design-forces/usability/" | relative_url }}):

 * Do not pollute the source directory if the software is built from an
 out-of-source-tree directory. Downloaded external sources and test raw files
 are now stored in a `./thirdparty` folder under the building directory. In
 case of an out-of-source-tree build, the generated binaries are stored in an
 `./install` folder, also under the building directory. The old behavior for
 generated binaries is maintained if the building is done from any source tree
 subfolder (for instance, `gnss-sdr/build`): in that case, binaries are stored
 in the source tree (under `gnss-sdr/install`).
 * Defined new `GNSS-SDR.GPS_banned_prns`, `GNSS-SDR.Galileo_banned_prns`,
 `GNSS-SDR.Glonass_banned_prns` and `GNSS-SDR.Beidou_banned_prns` configuration
 parameters. The user can specify lists of satellites that will not be
 processed (e.g., `GNSS-SDR.Galileo_banned_prns=14,18` since Galileo E14 and
 E18 satellites are not usable for PVT). Satellites on those lists will never
 be assigned to a processing channel.
 * Added a Matlab script to quantize the input signal with a given number of bits
 per sample.
 * Fixed the building option `-DENABLE_LOG=OFF`, which strips internal logging
 from the binary and can help to reduce its size and ultimately to speed up the
 receiver. In binaries with enabled logging, it still can be disabled by
 passing the command line flag `--minloglevel=3` to `gnss-sdr`. This can be
 relevant in embedded devices with scarce storage capabilities.
 * Fixed a bug in the Signal Sources configuration that made the number of
 samples parameter ignored when too large (that is, when set larger than
 2^31-1). Now the `samples` parameter accepts values up to 2^64-1, that is,
 18,446,744,073,709,551,615 samples.
 * Fixed a bug in the forwarding of NMEA messages to a serial port (configuration
 of the `PVT.nmea_dump_devname` parameter was ignored).
 * Updated version of the Contributor Covenant to version 2.0. Added badge in the
 README.md file.

-----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.13) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).

<a href="https://doi.org/10.5281/zenodo.3965566" ><i class="ai ai-fw ai-doi ai-lg" aria-hidden="true"></i></a>In order to make GNSS-SDR more easily referenced, and to promote reproducible research, each software release gets a Digital Object Identifier provided by [Zenodo](https://help.zenodo.org/faq/). The DOI for GNSS-SDR v0.0.13 is [10.5281/zenodo.3965566](https://doi.org/10.5281/zenodo.3965566).
{: .notice--info}

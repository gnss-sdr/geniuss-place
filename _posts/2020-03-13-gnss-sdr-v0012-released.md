---
title: "GNSS-SDR v0.0.12 released"
excerpt: "GNSS-SDR v0.0.12 has been released."
header:
 teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2020-03-13T12:54:02+02:00
---

This release has several improvements in different dimensions, addition of new
features and bug fixes:

## Improvements in [Accuracy]({{ "/design-forces/accuracy/" | relative_url }}):

 * Improved accuracy of the $$ C/N_0 $$ estimator.


## Improvements in [Availability]({{ "/design-forces/availability/" | relative_url }}):

 * Fixed computation of acquisition threshold when using the `Acquisition_XX.pfa`
 configuration parameter, including non-coherent accumulation (`Acquisition_XX.max_dwells` > 1).


## Improvements in [Efficiency]({{ "/design-forces/efficiency/" | relative_url }}):

 * Faster implementation of the Viterbi decoder for Galileo navigation messages.
 * The `-O3` flag is now passed to GCC in `Release` and `RelWithDebInfo` build
 types (instead of `-O2`), thus enabling tree vectorization. Disabled if
 building for Fedora or Gentoo.


## Improvements in [Flexibility]({{ "/design-forces/flexibility/" | relative_url }}):

 * New Tracking parameters allow the configuration of the $$ C/N_0 $$ and lock detector
 smoothers, as well as the activation of the FLL in pull-in and steady state
 stages.
 * Added new Tracking parameter `Tracking_XX.carrier_aiding`, allowing
 enabling/disabling of carrier aiding to the code tracking loop.
 * New PVT parameter `PVT.enable_rx_clock_correction` allows to enable or disable
 the continuous application of the Time solution correction (clock steering) to
 the computation of Observables. By default is set to `false` (that is,
 disabled).
 * New PVT parameter `PVT.max_clock_offset_ms`: if
 `PVT.enable_rx_clock_correction` is set to `false`, this parameter sets the
 maximum allowed local clock offset with respect to the Time solution. If the
 estimated offset exceeds this parameter, a clock correction is applied to the
 computation of Observables.
 * Fixed L5 and E5a receiver chains when tracking the data component.
 * Added new PVT configuration parameter `PVT.rinex_name` to specify a custom
 name of the generated RINEX files. A commandline flag `--RINEX_name` is also
 available, and overrides the configuration.


## Improvements in [Interoperability]({{ "/design-forces/interoperability/" | relative_url }}):

 * Fixed PVT solution in receivers processing L1 plus L2C and/or L5 signals.
 * Fixed the initialization of the carrier phase accumulator. Carrier phase
 measurements are now usable to compute integer ambiguity resolution.
 * Added carrier phase observable initialization to match the pseudorange length.
 * Added RINEX files generation for triple-band configurations (L1 + L2C + L5 and
 L1 + E1 + L2C + L5 + E5a).
 * Fixed bugs in the decoding of BeiDou navigation messages.
 * Fixed bugs in the generation of RTCM messages.
 * Fixed a bug in feeding Galileo channels' observations to RTKLIB, which was
 causing wrong date of PVT fixes in Galileo-only receivers and not considering
 Galileo observations in multi-constellation receivers when using signals after
 the GPS rollover on April 6, 2019.
 * Improved management of devices with the AD9361 RF transceiver.
 * Fixed bugs in FPGA off-loading.


## Improvements in [Maintainability]({{ "/design-forces/maintainability/" | relative_url }}):

 * Rewriting of acquisition and tracking adapters, thus avoiding a lot of code
 duplication.
 * New CMake option `-DENABLE_ARMA_NO_DEBUG` defines the macro `ARMA_NO_DEBUG`,
 which disables all run-time checks, such as bounds checking, in the Armadillo
 library. This will result in faster code. This option is disabled by default
 during development, but automatically set to `ON` if the option
 `ENABLE_PACKAGING` is set to `ON`.
 * All shadowed variables detected by passing `-Wshadow` to the compiler have
 been fixed (see https://rules.sonarsource.com/cpp/RSPEC-1117?search=shadow and
 MISRA C++:2008, 2-10-2 * Identifiers declared in an inner scope shall not hide
 an identifier declared in an outer scope).
 * Apply more clang-tidy checks related to readability:
 `readability-avoid-const-params-in-decls`,
 `readability-braces-around-statements`, `readability-isolate-declaration`,
 `readability-redundant-control-flow`, `readability-uppercase-literal-suffix`.
 Fixed raised warnings.
 * Fixed a number of defects detected by `cpplint.py`. Filters applied:
 `+build/class`, `+build/c++14`, `+build/deprecated`,
 `+build/explicit_make_pair`, `+build/include_what_you_use`,
 `+build/printf_format`, `+build/storage_class`, `+readability/constructors`,
 `+readability/namespace`, `+readability/newline`, `+readability/utf8`,
 `+runtime/casting`, `+runtime/explicit`, `+runtime/indentation_namespace`,
 `+runtime/init`, `+runtime/invalid_increment`,
 `+runtime/member_string_references`, `+runtime/memset`, `+runtime/operator`,
 `+runtime/printf`, `+runtime/printf_format`, `+whitespace/blank_line`.
 * `clang-format` can now be applied to the whole code tree without breaking
 compilation.
 * Added more check options to `.clang-tidy` file.
 * Default Python version is now >= 3.4. Python 2.7 still can be used in systems
 where Python 3 is not available (e.g., CentOS 7, Debian 8, Ubuntu 10.04).
 * CMake now passes the `-DCMAKE_BUILD_TYPE` (or configuration in
 multi-configuration generators like Xcode) to modules built along gnss-sdr
 (e.g, the volk_gnsssdr library and googletest). Build types available: `None`,
 `Release` (by default), `Debug`, `RelWithDebInfo`, `MinSizeRel`, `Coverage`,
 `NoOptWithASM`, `O2WithASM`, `O3WithASM`, `ASAN`.
 * Fix runtime errors when compiling in `Debug` mode on macOS.
 * Updated links in comments along the source code and in CMake scripts.
 * Update GSL implementation to 0.36.0. See
 https://github.com/gsl-lite/gsl-lite/releases/tag/v0.36.0
 * Create a CI job on GitHub to ensure that `clang-tidy` has been applied in most
 of the source code (some optional blocks and tests are left apart).
 * Create a CI job on GitHub to ensure that `clang-format` has been applied.
 * Create a CI job on GitHub to ensure that `cpplint` filters have been applied.
 * Create a CI job on GitHub to ensure compliance with REUSE Specification (see
 https://reuse.software)
 * Create a CI job on GitHub using `prettier` (https://prettier.io/) to check
 markdown files formatting.
 * Create a CI job on GitHub to check the formatting of CMake scripts using
 `cmakelint` (see https://github.com/richq/cmake-lint).


## Improvements in [Openness]({{ "/design-forces/openness/" | relative_url }}):

 * Make software compliant with REUSE Specification – Version 3.0 (see
 https://reuse.software/spec/).


## Improvements in [Portability]({{ "/design-forces/portability/" | relative_url }}):

 * The CMake scripts now find dependencies in Debian's riscv64 architecture.
 * Enable AVX2 kernels of the volk_gnsssdr library when using the Clang compiler.
 * Fixed building in some ARM-based devices. Now Clang and ARMClang can be used
 for native building.
 * Added toolchain files for building gnss-sdr and the volk_gnsssdr library in
 several ARM processor architectures, including those in Raspberry Pi 3 and 4.
 * The software can now be built using Xcode (passing `-GXcode` to CMake) without
 previous manual installation of volk_gnsssdr.
 * The software can now be built using Xcode (passing `-GXcode` to CMake) without
 gflags, glog, matio, PugiXML, Protocol Buffers or googletest previously
 installed.
 * Now the volk_gnsssdr library can be built on Microsoft Windows.
 * Now the volk_gnsssdr library makes use of C11 `aligned_alloc` where available.
 * Improved CMake script for cross-compilation and for the detection of AVX, AVX2
 and NEON (v7 and v8) instructions.
 * Fixed warnings raised by CMake 3.17.
 * Fixed warnings raised by `cmake --warn-uninitialized ..`
 * Fixed the receiver's availability in systems in which the Sys V message queue
 mechanism is not available.


## Improvements in [Reliability]({{ "/design-forces/reliability/" | relative_url }}):

 * Decoding of navigation messages no longer rely on implementation defined
 behavior for shifting left a signed integer.
 * Removed usage of functions with insecure API (e.g., `strcpy`, `sprintf`).
 * New type alias `volk_gnsssdr::vector` allows both aligned memory allocation
 and automatic deallocation.
 * Fixed a memory leak in the generation of Galileo PRN codes.
 * Added clang-tidy checks `clang-analyzer-security.*`,
 `clang-analyzer-optin.portability.UnixAPI` clang-tidy checks. Fixed raised
 warnings.
 * Fixed `cpplint.py` `runtime/printf` and `runtime/explicit` errors.
 * All constructors callable with one argument are marked with the keyword
 explicit. See MISRA C++:2008, 12-1-3 * All constructors that are callable with
 a single argument of fundamental type shall be declared explicit.


## Improvements in [Repeatability]({{ "/design-forces/repeatability/" | relative_url }}):

 * Added the option to apply carrier smoothing of code pseudoranges with new
 Observables parameter `Observables.enable_carrier_smoothing`.
 * Fixed normalization of DLL discriminator in BPSK modulations when the spacing
 between correlators was not 0.5.


## Improvements in [Testability]({{ "/design-forces/usability/" | relative_url }}):

 * Add receiver runtime to `position_test` report.
 * Improvements in FPGA unit tests.
 * Add new utility tool `obsdiff` to perform single and double differences
 computations from observation RINEX files. Requires GPSTk and Armadillo >=
 9.800.


## Improvements in [Usability]({{ "/design-forces/usability/" | relative_url }}):

 * A new global parameter `GNSS-SDR.pre_2009_file` allows to process raw sample
 files containing GPS L1 C/A signals dated before July 14, 2009.
 * Improved DLL-PLL binary dump MATLAB/Octave plot script. Old versions removed.
 * Simplified RTKLIB error log.
 * Added a Python 3 plotting script to show relative performance of generic
 volk_gnsssdr kernels wrt SIMD fastest versions.
 * Added reporting of velocity in the terminal.
 * Added reporting of user clock drift estimation, in ppm, in the Pvt_Monitor and
 in internal logging (`Debug` mode).
 * Updated documentation generated by Doxygen, now the `pdfmanual` target works
 when using ninja.
 * CMake now generates an improved summary of required/optional dependency
 packages found and enabled/disabled features, including the building system
 and GNSS-SDR, CMake and compiler versions. This info is also stored in a file
 called `features.log` in the building directory.
 * Markdown files have been wrapped to 80 characters line length to make it
 easier to read them from the terminal.

-----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.12) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).

<a href="https://doi.org/10.5281/zenodo.3709089" ><i class="ai ai-fw ai-doi ai-lg" aria-hidden="true"></i></a>In order to make GNSS-SDR more easily referenced, and to promote reproducible research, each software release gets a Digital Object Identifier provided by [Zenodo](https://zenodo.org/faq). The DOI for GNSS-SDR v0.0.12 is [10.5281/zenodo.3709089](https://doi.org/10.5281/zenodo.3709089).
{: .notice--info}

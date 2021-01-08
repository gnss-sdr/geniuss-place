---
title: "GNSS-SDR v0.0.14 released"
excerpt: "GNSS-SDR v0.0.14 has been released."
header:
 teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2021-01-08T08:54:02+02:00
---

This is a maintenance and bug fix release. Most relevant changes with respect to
the former release are listed below:

## Improvements in [Availability]({{ "/design-forces/availability/" | relative_url }}):

 * Fixed bug in acquisition detection when the configuration parameter
  `Acquisition_XX.threshold` was set but `Acquisition_XX.pfa` was not, causing
  false locks.
 * Fixed anti-jamming filters: `Pulse_Blanking_Filter`, `Notch_Filter` and
  `Notch_Filter_Lite`.

## Improvements in [Efficiency]({{ "/design-forces/efficiency/" | relative_url }}):

 * Faster `SignalConditioner` block when its implementation is set to
  `Pass_Through`.

## Improvements in [Interoperability]({{ "/design-forces/interoperability/" | relative_url }}):

 * Added the Galileo E6 B/C signal structure based on E6-B/C Codes Technical
  Note, Issue 1, January 2019, including Acquisition and Tracking blocks. The
  Telemetry Decoder is still empty (only the CRC is checked, based on Galileo
  High Accuracy Service E6-B Signal-In-Space Message Specification v1.2, April
  2020).

## Improvements in [Maintainability]({{ "/design-forces/maintainability/" | relative_url }}):

 * Added a common shared pointer definition `gnss_shared_ptr`, which allows to
  handle the `boost::shared_ptr` to `std::shared_ptr` transition in GNU Radio
  3.9 API more nicely.
 * Support new FFT and firdes blocks' API in GNU Radio 3.9.
 * Added detection of inconsistent function prototypes in `volk_gnsssdr` library
  kernels at compile time.
 * Fixed defects detected by clang-tidy check `bugprone-reserved-identifier`, and
  added to the checks list. This check corresponds to CERT C Coding Standard
  rule
  [DCL37-C](https://wiki.sei.cmu.edu/confluence/display/c/DCL37-C.+Do+not+declare+or+define+a+reserved+identifier)
  as well as its C++ counterpart,
  [DCL51-CPP](https://wiki.sei.cmu.edu/confluence/display/cplusplus/DCL51-CPP.+Do+not+declare+or+define+a+reserved+identifier).
 * Applied and added more clang-tidy checks related to readability:
  `readability-make-member-function-const` and `readability-qualified-auto`.

## Improvements in [Portability]({{ "/design-forces/portability/" | relative_url }}):

 * Fixed `-DENABLE_OWN_GLOG=ON` building option when gflags is installed and it
  is older than v2.1.2 (_e.g._, in CentOS 7).
 * Improved handling of old gflags versions, minimum version set to 2.1.2.
  Replaced `google::` by `gflags::` namespace when using functions of the gflags
  library.
 * Replaced `git://` by `https://` as the used protocol when downloading Gflags,
  so it can work through firewalls requiring authentication.
 * Fixed static linking of the matio library when downloaded and built by CMake.
 * Improved CPU feature detection by switching to Google's
  [cpu_features](https://github.com/google/cpu_features) library: The
  `volk_gnsssdr` library had its own CPU feature detection methods, which were
  not totally reliable and difficult to implement across compilers and OSes.
  This is now handled by the `cpu_features` library, thus building upon that
  expertise. Since that library has higher dependency version requirements than
  GNSS-SDR, the old method is still used in old development environments. No
  extra dependency is needed. This change is transparent to the user, since
  everything is managed by the CMake scripts.
 * The `volk_gnsssdr` library can be built on Microsoft Windows and can execute
  SIMD instructions on that OS.
 * Removed all instances of `_mm256_zeroupper()` in the `volk_gnsssdr` library,
  since they are not required and lead to miscompilation with GCC 10.2 and
  optimization level `-O3`.
 * Fixed building with `-DENABLE_CUDA=ON` for blocks implemented with CUDA.
 * Fixed linking against the ORC library if it is present in the system.
 * Fixed a bug introduced in v0.0.13 that prevented getting Galileo-only PVT
  fixes in some environments.
 * Fixed duplication of protobuf build tree if it was locally built and then
  installed with DESTDIR variable set.

## Improvements in [Usability]({{ "/design-forces/usability/" | relative_url }}):

 * Fixed a bug when enabling pseudorange carrier smoothing in other bands than
  L1.
 * If `SignalConditioner.implementation=Pass_Through`, then all the configuration
  parameters for the `DataTypeAdapter`, `InputFilter` and `Resampler` blocks are
  ignored. This was the default behavior in GNSS-SDR v0.0.12, but it changed in
  v0.0.13. This change recovers the old behavior.
 * Fixed occasional segmentation fault when exiting with `q` + `[Enter]` keys if
  `Acquisition_XX.blocking=false`.
 * Fixed the termination of the receiver with `q` + `[Enter]` keys when using the
  `Osmosdr_Signal_Source` implementation of the `SignalSource` block.
 * The `Labsat_Signal_Source` implementation of the `SignalSource` block now can
  be throttled with the new parameters `SignalSource.enable_throttle_control`
  and `SignalSource.throttle_frequency_sps`, thus allowing the emulation of
  real-time operation.
 * Improved General Block diagram, both in content and in image resolution.
 * The `Custom_UDP_Signal_Source` implementation now accepts
  `SignalSource.sample_type=cfloat`, in addition to the existing 4 and 8-bit
  length sample types.
 * Fixed the `obsdiff` and `rinex2assist` utilities when installed if they were
  built with a locally downloaded version of GPSTk.
 * The generated HTML documentation now makes use of the Doxygen grouping
  feature.
 * Improved rendering of equations in HTML documentation generated by Doxygen.
  Make use of MathJax for equation rendering. Added new building option
  `ENABLE_EXTERNAL_MATHJAX`, set to `ON` by default. If set to `OFF`, it allows
  using a local installation of MathJax 2.
 * Improved dumps in Telemetry Decoding blocks. Now they include the raw
  navigation message bits. If `TelemetryDecoder_XX.dump=true`, the resulting
  `.dat` binary file is also delivered in `.mat` format, which is readable from
  Matlab and Python.


-----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.14) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).

<a href="https://doi.org/10.5281/zenodo.4428100" ><i class="ai ai-fw ai-doi ai-lg" aria-hidden="true"></i></a>In order to make GNSS-SDR more easily referenced, and to promote reproducible research, each software release gets a Digital Object Identifier provided by [Zenodo](https://zenodo.org/faq). The DOI for GNSS-SDR v0.0.14 is [10.5281/zenodo.4428100](https://doi.org/10.5281/zenodo.4428100).
{: .notice--info}

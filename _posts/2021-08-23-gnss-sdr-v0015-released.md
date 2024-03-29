---
title: "GNSS-SDR v0.0.15 released"
excerpt: "GNSS-SDR v0.0.15 has been released."
header:
 teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2021-08-23T08:54:02+02:00
---

This is a maintenance and bug fix release, with the addition of some minor
features. Most relevant changes with respect to the former release are listed
below:

## Improvements in [Availability]({{ "/design-forces/availability/" | relative_url }}):

- Added the reading of reduced clock and ephemeris data (CED) in the Galileo E1B
  INAV message introduced in Galileo OS SIS ICD Issue 2.0. If the reduced CED is
  available before the full ephemeris set, it is used for PVT computation until
  the full set has not yet been received. This can contribute to shortening the
  Time-To-First-Fix. Still experimental.
- Added the exploitation of the FEC2 Erasure Correction in the Galileo E1B INAV
  message introduced in Galileo OS SIS ICD Issue 2.0. This can contribute to
  shortening the Time-To-First-Fix. Since the added computational cost could
  break some real-time configurations, this feature is disabled by default. It
  can be activated from the configuration file by adding
  `TelemetryDecoder_1B.enable_reed_solomon=true`.
- Reduction of the TTFF in GPS L1 and Galileo E1 by improving the frame
  synchronization mechanism.


## Improvements in [Maintainability]({{ "/design-forces/maintainability/" | relative_url }}):

- The Contributor License Agreement (CLA) signing for new contributors has been
  replaced by a
  [Developer's Certificate of Origin (DCO)](https://github.com/gnss-sdr/gnss-sdr/blob/next/.github/DCO.txt),
  which implies that contributed commits in a pull request need to be signed as
  a manifestation that contributors have the right to submit their work under
  the open source license indicated in the contributed file(s) (instead of
  asking them to sign the CLA document).
- Improved handling of changes in GNU Radio 3.9 FFT API.
- Improved handling of the filesystem library.
- Added an abstract class `SignalSourceInterface` and a common base class
  `SignalSourceBase`, which allow removing a lot of duplicated code in Signal
  Source blocks, and further abstract file-based interfaces behind them.
- Do not apply clang-tidy fixes to protobuf-generated headers.
- Refactored private implementation of flow graph connection and disconnection
  for improved source code readability.
- Added a base class for GNSS ephemeris, saving some duplicated code and
  providing a common nomenclature for ephemeris' parameters. New generated XML
  files make use of the new parameters' names.
- Update GSL implementation to 0.38.1. See
  https://github.com/gsl-lite/gsl-lite/releases/tag/v0.38.1
- Update references to the latest GPS ICDs (IS-GPS-200M, IS-GPS-800H,
  IS-GPS-705H) published in May, 2021.


## Improvements in [Portability]({{ "/design-forces/portability/" | relative_url }}):

- Avoid collision of the `cpu_features` library when installing the
  `volk_gnsssdr` library on its own, and VOLK has already installed its version.
  Added a new building option `ENABLE_OWN_CPUFEATURES`, defaulting to `ON` when
  building `gnss-sdr` but defaulting to `OFF` when building a stand-alone
  version of `volk_gnsssdr`. When this building option is set to `ON`, it forces
  the building of the local version of the `cpu_features` library, regardless of
  whether it is already installed or not.
- CMake's `<policy_max>` version bumped to 3.21. The minimum CMake version is
  2.8.12.
- Fix building when using the Xcode generator, Xcode >= 12 and CMake >= 3.19.
- Fix building of FPGA blocks when linking against GNU Radio >= 3.9 and/or
  Boost >= 1.74.
- Fix linking of the `<filesystem>` library when using GCC 8.x and GNU Radio >=
  3.8.
- If the Matio library is not found, now it is configured and built by CMake
  instead of using autotools.
- Added support for Apple M1 AArch64 architecture processor and for FreeBSD on
  x86, improved AMD microarchitecture detection.
- CMake now selects the C++23 standard if the environment allows for it.
- Improved detection of Gnuplot and `gnss_sim` when cross-compiling.
- NEON kernel implementations of the `volk_gnsssdr` library are now enabled in
  aarch64 architectures.


## Improvements in [Reliability]({{ "/design-forces/reliability/" | relative_url }}):

- Bug fix in the Galileo E1/E5 telemetry decoder that produced incorrect timing
  information if a satellite is lost and then readquired.
- Check satellites' health status. If a satellite is marked as not healthy in
  its navigation message, the corresponding observables are not used for
  navigation.

## Improvements in [Usability]({{ "/design-forces/usability/" | relative_url }}):

- Added a new `Fifo_Signal_Source` implementation that allows using a
  [Unix FIFO](https://en.wikipedia.org/wiki/Named_pipe) as a signal source, thus
  allowing to multiplex signal streams outside of `gnss-sdr`, letting another
  program hold access to the receiver, or allowing signal sources that are not
  supported by `gnss-sdr` but can dump the signal to a FIFO.
- Avoid segmentation faults in the flow graph connection and/or starting due to
  some common inconsistencies in the configuration file.
- Provide hints to the user in case of failed flow graph connection due to
  inconsistencies in the configuration file.
- Fix segmentation fault if the RINEX output was disabled.
- Added a feature that optionally enables the remote monitoring of GPS and
  Galileo ephemeris using UDP and
  [Protocol Buffers](https://developers.google.com/protocol-buffers).
- Now building the software passing the `-DENABLE_FPGA=ON` to CMake does not
  make the receiver unusable when running on non-FPGA-enabled platforms. On
  FPGA-enabled platforms, now it is possible to run non-FPGA-enabled
  configurations.
- Fix bug that made the Monitor block to always set to 0 the
  `carrier_phase_rads` parameter value.
- The `Labsat_Signal_Source` implementation of the `SignalSource` block now can
  read files in the LabSat 3 Wideband format (`.LS3W`). When using this format,
  this source block can provide multiple RF chain outputs.
- Replace `Receiver.sources_count` configuration parameter name by
  `GNSS-SDR.num_sources`. The former parameter name is still read to ensure
  backward compatibility with configuration files using that nomenclature.
- Fix bug in searching for gr-iio when CMake was re-run several times with
  different settings for the `-DENABLE_FMCOMMS2` or `-DENABLE_PLUTOSDR` building
  options.
- Fix building when using UHD >= v4.0.0.0.
- Fix building for `-DENABLE_FMCOMMS2=ON` and/or `-DENABLE_PLUTOSDR=ON` when the
  built-in gr-iio module introduced in GNU Radio 3.10 is found. This in-tree GNU
  Radio module takes precedence over the gr-iio package provided at
  https://github.com/analogdevicesinc/gr-iio. If the GNU Radio module is found,
  the other one is ignored.
- File `changelog.md` renamed to the more usual `CHANGELOG.md` uppercase name.
- New global configuration parameter `GNSS-SDR.observable_interval_ms`, set by
  default to 20 [ms], allows to control the internal rate at which computed
  observables sets are processed (50 observables sets per second by default).
- Fix bug in the `Monitor.decimation_factor` parameter, which was not working
  properly for other values than 1.


-----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.15) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).

<a href="https://doi.org/10.5281/zenodo.5242839" ><i class="ai ai-fw ai-doi ai-lg" aria-hidden="true"></i></a>In order to make GNSS-SDR more easily referenced, and to promote reproducible research, each software release gets a Digital Object Identifier provided by [Zenodo](https://help.zenodo.org/faq/). The DOI for GNSS-SDR v0.0.15 is [10.5281/zenodo.5242839](https://doi.org/10.5281/zenodo.5242839).
{: .notice--info}

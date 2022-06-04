---
title: "GNSS-SDR v0.0.16 released"
excerpt: "GNSS-SDR v0.0.16 has been released."
header:
 teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2022-02-15T08:54:02+02:00
---

This release adds new features and fixes some bugs. Most relevant changes with respect to the former release are listed below:

## Improvements in [Availability]({{ "/design-forces/availability/" | relative_url }}):

- Added the Galileo E5b receiving chain. The software is now able to compute PVT solutions as a standalone Galileo E5b receiver.
- Improved Time-To-First-Fix when using GPS L1 C/A signals, fixing a bug that was making the receiver to drop the satellite if the PLL got locked at 180 degrees, and making some optimizations on bit transition detection.
- Fixed a bug that prevented from obtaining PVT fixes with Galileo E1 OS signals if the I/NAV subframe type 0 was the first decoded subframe.

## Improvements in [Interoperability]({{ "/design-forces/interoperability/" | relative_url }}):

- Fixed setting of the signal source gain if the AGC is enabled when using the AD9361 front-end.
- Fixed the regeneration of Galileo ephemeris from the reduced clock and ephemeris data (CED) defined in the Galileo E1B INAV message introduced in Galileo OS SIS ICD Issue 2.0.
- Added a `Limesdr_Signal_Source` for interoperability with LimeSDR (requires [gr-limesdr](https://github.com/myriadrf/gr-limesdr) and the `-DENABLE_LIMESDR=ON` building flag).

## Improvements in [Maintainability]({{ "/design-forces/maintainability/" | relative_url }}):

- Rewritten Viterbi decoder for Galileo navigation messages. Encapsulated in a class instead of being implemented as free inline functions. This improves memory management and source code readability.
- Prefer initialization to assignment in constructors. This improves the readability of the code, could potentially increase performance, and allows for easier detection of unused data members (see the [CppCoreGuidelines](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md/#Rc-initialize). Added the `cppcoreguidelines-prefer-member-initializer` clang-tidy check to enforce this policy.
- Non-functional change: Fixed formatting defects detected by clang-format 13.0.
- Non-functional change: Simplified flow graph disconnection.
- Updated GSL implementation to v0.40.0. See the [gsl-lite release](https://github.com/gsl-lite/gsl-lite/releases/tag/v0.40.0)
- CI - `cpplint` job on GitHub: Added the `build/include_what_you_use` filter for early detection of missing includes.
- CI - `clang-tidy` job on GitHub: More robust detection of LLVM paths installed by homebrew.

## Improvements in [Portability]({{ "/design-forces/portability/" | relative_url }}):

- Fixed building against the new API in the gr-iio component present in GNU Radio v3.10.X.Y.
- Fixed building against GNU Radio v3.10.X.Y, which does not support the C++20 standard.
- Fixed building against GNU Radio v3.10.X.Y, which replaced [log4cpp](http://log4cpp.sourceforge.net/) by the [spdlog](https://github.com/gabime/spdlog) and [fmt](https://github.com/fmtlib/fmt) libraries.
- Updated `cpu_features` library for improved processor detection.

## Improvements in [Reliability]({{ "/design-forces/reliability/" | relative_url }}):

- Fixed some potential buffer overflows.
- Avoid source code lines longer than 512 characters. This was a warning raised by Lintian (very-long-line-length-in-source-file). Long lines in source code could be used to obfuscate the source code and to hide stuff like backdoors or security problems.

## Improvements in [Usability]({{ "/design-forces/usability/" | relative_url }}):

- Added a new monitor to extract the decoded data bits of the navigation messages and send them elsewhere via UDP. Activated by setting `NavDataMonitor.enable_monitor=true`, `NavDataMonitor.client_addresses=127.0.0.1` and `NavDataMonitor.port=1237` in the configuration file. Format described in the `nav_message.proto` file. A simple listener application written in C++ is included in `src/utils/nav-listener` as an example.
- Extract successful rate of the CRC check in the decoding of navigation messages. This can be enabled by setting `TelemetryDecoder_XX.dump_crc_stats=true` and, optionally, `TelemetryDecoder_XX.dump_crc_stats_filename=./crc_stats` in the configuration file. At the end of the processing (or exiting with `q` + `[Enter]`), the CRC check success rate will be reported in a file.
- The `UHD_Signal_Source` learned to dump data in folders that do not exist, _e.g._, if `SignalSource.dump=true`, `SignalSource.dump_filename=./non-existing/data.dat`, and the `non-existing` folder does not exist, it will be created if the running user has writing permissions. This also works for absolute paths.
- Added a new configuration parameter `PVT.rtk_trace_level` that sets the logging verbosity level of the RTKLIB library.
- Added a new output parameter `Flag_PLL_180_deg_phase_locked` in the monitor output that indicates if the PLL got locked at 180 degrees, so the symbol sign is reversed.
- Fixed a bug in the satellite selection algorithm for configurations with a large number of channels. The maximum number of channels per signal is now limited to the number of available satellites per system minus one. The number of channels performing concurrent acquisition, `Channels.in_acquisition`, cannot be larger than the total number of channels. The program will stop if those requirements are not met in the configuration file.
- Fixed program termination when using `File_Signal_Source` and extended integration times.
- The `Fifo_Signal_Source` Signal Source implementation learned to handle the `ibyte` type.
- Added a `CITATION.cff` file.  
- Updated version of the Contributor Covenant to version 2.1.


-----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.16) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).

<a href="https://doi.org/10.5281/zenodo.6090349" ><i class="ai ai-fw ai-doi ai-lg" aria-hidden="true"></i></a>In order to make GNSS-SDR more easily referenced, and to promote reproducible research, each software release gets a Digital Object Identifier provided by [Zenodo](https://zenodo.org/faq). The DOI for GNSS-SDR v0.0.16 is [10.5281/zenodo.6090349](https://doi.org/10.5281/zenodo.6090349).
{: .notice--info}

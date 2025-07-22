---
title: "GNSS-SDR v0.0.20 released"
excerpt: "GNSS-SDR v0.0.20 has been released."
header:
 teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2025-04-01T08:54:02+02:00
---

This release provides bug fixes and new features. Most relevant changes with
respect to the former release are listed below:

## Improvements in [Interoperability]({{ "/design-forces/interoperability/" | relative_url }}):

- Improved error handling in UDP connections.
- Make it possible to receive multiple constellations using a single channel
  wideband device (HackRF/LimeSDR/USRP). Demonstration: [here](https://www.youtube.com/watch?v=ZQs2sFchJ6w)
  and [here](https://www.youtube.com/watch?v=HnZkKj9a-QM).
- Add the following signal sources for use when GNSS-SDR is operating on SoC
  FPGA boards (`-DENABLE_FPGA=ON`):

  - `ADRV9361_Z7035_Signal_Source_FPGA`: Analog Devices ADRV9361-Z7035 board.
  - `FMCOMMS5_Signal_Source_FPGA`: FMCOMMS5 analog front-end.
  - `MAX2771_EVKIT_Signal_Source_FPGA`: MAX2771 evaluation kit analog front-end.
  - `DMA_Signal_Source_FPGA`: FPGA DMA working in post-processing mode.

  When building GNSS-SDR for the SoC FPGA, the following options can be passed
  to CMake with possible values of `ON` or `OFF`, and their default value is
  `OFF`:

  - `-DENABLE_AD9361`: Checks if the IIO driver is installed and builds the
    `ADRV9361_Z7035_Signal_Source_FPGA` and the `FMCOMMS5_Signal_Source_FPGA`
    sources.
  - `-DENABLE_MAX2771`: Checks if the SPIdev driver is installed and builds the
    `MAX2771_EVKIT_Signal_Source_FPGA` source.
  - `-DENABLE_DMA_PROXY`: Checks if the DMA proxy driver is installed for
    controlling the DMA in the FPGA and enables its usage.

- Add the `ION_GSMS_Signal_Source`, which is able to process raw data files
  described with the
  [ION GNSS Software Defined Receiver Metadata Standard](https://sdr.ion.org/).
  It requires the `-DENABLE_ION=ON` building configuration option.
- The `Monitor` and `PVT` blocks are now able to send data to multiple UDP
  ports.
- Add experimental decoding of Galileo's I/NAV ARAIM Integrity Support Message
  (ISM) as defined in the OS SIS ICD v2.1. Values, if received, are only logged
  but not used.
- Added new
  [`Cshort_To_Gr_Complex`](https://gnss-sdr.org/docs/sp-blocks/data-type-adapter/#implementation-cshort_to_gr_complex)
  Data Type Adapter implementation.
- The
  [Osmosdr_Signal_Source](https://gnss-sdr.org/docs/sp-blocks/signal-source/#implementation-osmosdr_signal_source)
  has gained two new optional configuration parameters: `iq_balance_mode` and
  `dc_offset_mode`, both of which are set to Automatic by default.
- Implemented missing GPS almanac decoding.

## Improvements in [Maintainability]({{ "/design-forces/maintainability/" | relative_url }}):

- Updated GSL implementation to v0.42.0. See the
  [gsl-lite release](https://github.com/gsl-lite/gsl-lite/releases/tag/v0.42.0).
- Code formatting now based on clang-format 19.

## Improvements in [Portability]({{ "/design-forces/portability/" | relative_url }}):

- Fix building against google-glog 0.7.x.
- Find dependencies in the loongarch64 architecture.
- Soft transition from [GFlags](https://github.com/gflags/gflags) and
  [Google Logging (glog)](https://github.com/google/glog) to Abseil
  [Logging](https://abseil.io/docs/cpp/guides/logging) and
  [Flags](https://abseil.io/docs/cpp/guides/flags) libraries. While gflags and
  glog have dutifully served GNSS-SDR for over a decade, they are now showing
  signs of aging. The latest version of gflags dates back six years now,
  although the master branch seems to be maintained. Glog remains well
  maintained, with its latest version v0.7.1 released in June 2024, but with no
  active development of new features and stuck at C++14. Abseil, on the other
  hand, represents a contemporary evolution in software development, supports
  C++17 and C++20, and has absorbed the functionalities of flags and logging
  from its predecessors. Furthermore, as Abseil has become a prerequisite for
  the latest versions of Protocol Buffers, its eventual inclusion in GNSS-SDR's
  indirect dependencies is inevitable. Leveraging Abseil allows for eliminating
  the need for gflags and glog, thereby reducing the number of mandatory
  dependencies for GNSS-SDR in forthcoming GNU/Linux distributions. For seamless
  integration, GNSS-SDR requires a quite recent minimum version of Abseil,
  v20240116. If an older version is detected, the library will not be utilized,
  and GNSS-SDR will fall back to using gflags and glog, which still can be used
  and are fully supported. A new CMake configuration option
  `-DENABLE_GLOG_AND_GFLAGS=ON` is available to force the usage of glog and
  gflags instead of Abseil, even if a valid version of that library is present.
  If the Abseil version installed in your system is too old but you still want
  to try it, you can also force the downloading and building of a recent version
  with the new CMake configuration flag `-DENABLE_OWN_ABSEIL=ON` (requires
  CMake >= 3.24, otherwise it has no effect). This change has a downside in
  maintainability, since the source code becomes plagued with preprocessor
  directives required to maintain compatibility both with gflags and glog, and
  with Abseil.
- Historically, GNSS-SDR linked against the GnuTLS library for cryptographic
  functions. If GnuTLS was not found, then the building system looked for and
  linked against OpenSSL as a fallback. This was due to the OpenSSL 1.x dual
  license scheme, which was incompatible with GPL v3.0 license, preventing it
  from being a mandatory dependency for GNSS-SDR in most GNU/Linux
  distributions. This issue was solved with the release of OpenSSL 3.0.0, which
  transitioned to the Apache License 2.0, fully compatible with GPL v3.0.
  Accordingly, the GNSS-SDR building system now looks for OpenSSL in the first
  place and, if not found, then it looks for GnuTLS as a fallback.  The new CMake
  configuration option `-DENABLE_GNUTLS=ON` allows linking against GnuTLS
  instead of OpenSSL.
- Allow linking against Boost 1.87.0.
- Replace the System V queues by boost::interprocess, improving portability.
- Improve detection of Homebrew or Macports in macOS.

## Improvements in [Reliability]({{ "/design-forces/reliability/" | relative_url }}):

- Implementation of the Galileo Open Service Navigation Message Authentication
  (OSNMA), a data authentication function for the Galileo Open Service worldwide
  users, freely accessible to all. OSNMA provides receivers with the assurance
  that the received Galileo navigation message is coming from the system itself
  and has not been modified. OSNMA is enabled by default if the receiver
  configuration defines Galileo E1 OS channels. More details can be found in
  [Introducing GNSS Navigation Message Authentication](https://gnss-sdr.org/osnma/).

## Improvements in [Usability]({{ "/design-forces/usability/" | relative_url }}):

- Tidy up the `conf/` folder.
- Add `install` and `uninstall` targets to the `nav_msg_listener` utility.
- **Potential Breaking Change**: The source tree has been refactored to follow a
  more conventional folder structure. This may disrupt user pipelines that
  relied on the previous structure and could break development branches that
  were branched off from `next` before this change. The key changes are:

  - The `tests` and `utils` directories have been moved from the `src` folder to
    the root of the source tree.
  - The empty `build` and `data` folders have been removed. Users can create a
    building folder using `mkdir build` or by having CMake handle it:
    `cmake -S . -B build`.
  - All default names for dump or input files starting with `../data/<filename>`
    have been changed to `./<filename>`.


-----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.20) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).
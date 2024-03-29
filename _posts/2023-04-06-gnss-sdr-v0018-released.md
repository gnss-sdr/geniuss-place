---
title: "GNSS-SDR v0.0.18 released"
excerpt: "GNSS-SDR v0.0.18 has been released."
header:
 teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2023-04-06T08:54:02+02:00
---

This release provides bug fixes and new features. Most relevant changes with
respect to the former release are listed below:

## Improvements in [Accuracy]({{ "/design-forces/accuracy/" | relative_url }}):

- Processing and application of the corrections provided by the Galileo High
  Accuracy Service (HAS) to the PVT solution. It requires at least a Galileo E1
  (or E5a) + Galileo E6B configuration. A new configuration parameter
  `PVT.use_has_corrections`, set to `true` by default, can be used to deactivate
  the application of HAS corrections but still retrieve the HAS data if set to
  `false`.

## Improvements in [Availability]({{ "/design-forces/availability/" | relative_url }}):

- Fixed bug that made the PVT block to not resolve position anymore after a loss
  of samples event.
- Improved non-coherent acquisition when `Acquisition_XX.blocking=false`.
- Implemented processing of BeiDou PRN 34 up to PRN 63 signals.
- Implemented Hamming code correction for Glonass navigation message.
- Now the first iteration of the PVT computation is initialized by the Bancroft
  method. This allows to get PVT fixes in some unusual geometries (_e.g._,
  GNSS-like signals transmitted by LEO satellites). This initialization is
  performed by default. You can opt-out by setting `PVT.bancroft_init=false` in
  your configuration file.

## Improvements in [Interoperability]({{ "/design-forces/interoperability/" | relative_url }}):

- Enabled PVT computation in the Galileo E5a + E5b receiver. Observables
  reported in the RINEX file.
- Fixed PVT computation in the Galileo E5b-only receiver.
- Get E6B observables and PVT solutions in the Galileo E1B + E6B receiver.
  Decoding of HAS messages as described in the
  [HAS SIS ICD v1.0](https://www.gsc-europa.eu/sites/default/files/sites/all/files/Galileo_HAS_SIS_ICD_v1.0.pdf).
  Generation of RTCM 3.2 messages from the received HAS messages in the
  [IGS State Space Representation (SSR) Format](https://files.igs.org/pub/data/format/igs_ssr_v1.pdf).
  Specifically, it generates messages of type IGM01 (SSR Orbit Correction),
  IGM02 (SSR Clock Correction), IGM03 (SSR Combined Orbit and Clock Correction),
  and IGM05 (SSR Code Bias).
- Added a `ZMQ_Signal_Source` for working with streams of samples published via
  [ZeroMQ](https://zeromq.org/).
- Fixed register unpacking for Labsat3W files in `Labsat_Signal_Source`. This
  fix is only available if gnss-sdr is linked against Boost >= 1.58.0.

## Improvements in [Maintainability]({{ "/design-forces/maintainability/" | relative_url }}):

- The now archived [GPSTk toolkit](https://github.com/SGL-UT/GPSTk), used in
  some optional tests and applications, has been replaced by the new
  [GNSSTk](https://github.com/SGL-UT/gnsstk) C++ Library. Compatibility with the
  former GPSTk toolkit is maintained.

## Improvements in [Portability]({{ "/design-forces/portability/" | relative_url }}):

- Improved detection of the BLAS library under macOS / Macports (the `lapack`
  port dependency installed with the `+openblas` variant does not install `blas`
  but `openblas`, which is used as a replacement if `blas` is not found).
- Removed duplicated files in the Secure User Plane Location implementation,
  which caused issues when linking with some compilers.
- Added support for Xilinx's Zynq UltraScale+ devices (requires the
  `-DENABLE_FPGA=ON` building option).
- Fixed running time error if the `gnss-sdr` binary and/or the GNU Radio
  libraries were built with the `-D_GLIBCXX_ASSERTIONS` compiler option. This is
  added by default in some GNU/Linux distributions (e.g., ArchLinux and Fedora).
- Fixed linking against libunwind when the glog library is built locally.
- The configuration options at building time `-DENABLE_OWN_GLOG`,
  `-DENABLE_OWN_ARMADILLO`, and `-DENABLE_OWN_GNSSTK` can now be switched `ON`
  and `OFF` without the need to start from an empty buiding folder.
- Improved CMake handling of the spdlog library used by GNU Radio >= 3.10.
- Make use of the C++20 standard if the environment allows for it.
- Improved passing of compiler flags to `volk_gnsssdr` if the corresponding
  environment variables are defined. This fixes warnings in some packaging
  systems.
- Improved support for the RISC-V architecture.
- Test files are now donwloaded at configuration time instead of being included
  in the source tree. This allows for a smaller package and fixes Lintian
  `very-long-line-length-in-source-file` warnings since those files were not
  recognized as binaries. The configuration flag `-DENABLE_PACKAGING=ON` passed
  to CMake deactivates file downloading.
- The `ENABLE_GENERIC_ARCH` building option was removed, simplifying the process
  of buiding the software in non-x86 processor architectures.
- If the Protocol Buffers dependency is not found, it is downloaded, built and
  statically linked at buiding time. If CMake >= 3.13 and the
  [Abseil C++ libraries](https://github.com/abseil/abseil-cpp) >= 20230117 are
  installed on your system, Protocol Buffers v22.2 will be used. If those
  requirements are not met, Protocol Buffers v21.4 will be used instead
  (requires autotools).
- Since Debian 8 "Jessie", which enjoyed Long Term Support until the end of June
  2020, is not anymore in the Debian official repositories, we drop its support.
- Fixes for GCC 13 and Clang 16.

## Improvements in [Usability]({{ "/design-forces/usability/" | relative_url }}):

- Fixed large GLONASS velocity errors and the extended correlator when using the
  `GLONASS_L1_CA_DLL_PLL_C_Aid_Tracking` and
  `GLONASS_L2_CA_DLL_PLL_C_Aid_Tracking` implementations.
- The `UHD_Signal_Source` learned a new parameter `otw_format` for setting the
  [over-the-wire data format](https://files.ettus.com/manual/page_configuration.html#config_stream_args_otw_format)
  (that is, the format used between the device and the UHD) in some devices,
  thus allowing to select the `sc8` format instead of the default `sc16`. This
  would reduce the dynamic range and increase quantization noise, but also
  reduce the load on the data link and thus allow more bandwidth.
- The `UHD_Signal_Source` learned another two optional parameters:
  `device_recv_frame_size` and `device_num_recv_frames` for overriding
  [transport layer defaults](https://files.ettus.com/manual/page_transport.html).
- Added gain setting and reading for the XTRX board when using the
  `Osmosdr_Signal_Source` implementation of a `SignalSource`.
- The `Osmosdr_Signal_Source` implementation learned a new parameter `if_bw` to
  manually set the bandwidth of the bandpass filter on the radio frontend.
- The new configuration parameter `Channels_XX.RF_channel_ID` allows to specify
  the signal source per channel group.
- New configuration parameter `PVT.use_unhealthy_sats`, set by default to
  `false`, allows processing observables of satellites that report an unhealthy
  status in the navigation message if set to `true`.
- Added the [Geohash](https://en.wikipedia.org/wiki/Geohash) of the PVT solution
  in the internal logs.
- Allowed the CMake project to be a sub-project.

-----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.18) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).

<a href="https://doi.org/10.5281/zenodo.7805514" ><i class="ai ai-fw ai-doi ai-lg" aria-hidden="true"></i></a>In order to make GNSS-SDR more easily referenced, and to promote reproducible research, each software release gets a Digital Object Identifier provided by [Zenodo](https://help.zenodo.org/faq/). The DOI for GNSS-SDR v0.0.18 is [10.5281/zenodo.7805514](https://doi.org/10.5281/zenodo.7805514).
{: .notice--info}

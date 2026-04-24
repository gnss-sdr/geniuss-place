---
title: "GNSS-SDR v0.0.21 released"
excerpt: "GNSS-SDR v0.0.21 has been released."
header:
 teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2026-04-14T08:54:02+02:00
---

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.19564827.svg)](https://doi.org/10.5281/zenodo.19564827)

This release provides bug fixes and new features. Most relevant changes with
respect to the former release are listed below:

## Improvements in [Availability]({{ "/design-forces/availability/" | relative_url }}):

- Introduced a histogram-based navigation data bit synchronizer used by tracking
  loops to robustly detect navigation-bit transitions in signals without
  secondary code. Lock is declared when the histogram exhibits a clearly
  dominant phase bin, verified using a configurable dominance ratio and
  stability criterion. Once synchronized, the tracking loop can safely switch to
  extended coherent integration, improving tracking sensitivity and TTFF. New
  configuration parameters are `Tracking_1C.bs_dominance_ratio` (ratio between
  the count of the dominant histogram bin and the total number of detected
  transition events, default: 0.6), `Tracking_1C.bs_stable_best_required`
  (required number of consecutive evaluations with the same dominant histogram
  bin, default: 3), and `Tracking_1C.bs_min_events_for_lock` (minimum number of
  detected transition events before lock evaluation, default: 10).

## Improvements in [Interoperability]({{ "/design-forces/interoperability/" | relative_url }}):

- Enabled multi-band processing off-loading to the FPGA when using the MAX2771
  RF front-end.
- Added a new Signal Source implementation `NTLab_File_Signal_Source`, which is
  able to read files grabbed from [NTLab](https://ntlab.lt/) RF front-ends.
- Improved `Labsat_Signal_Source` by fixing multi-channel file reading from
  LabSat 3 recordings and adding initial support for LabSat 4.
- Improvements in Glonass L1/L2 C/A signal tracking and decoding of the GNAV
  message.
- Added a cycle-slip detector, with events reported in internal logging and
  RINEX observation files. This introduces a new field in `Gnss_Synchro` and in
  the corresponding `.proto` definition.
- Improved tracking of GPS L2C(M) signals.
- Fixed GPS L1 decoding failure when `pull_in_time_s` is too short.
- Improved processing chain for BeiDou B1I and B3I signals.
- Added processing chains for the Quasi-Zenith Satellite System (QZSS), Japan’s
  regional navigation satellite system, supporting L1 C/A and L5 signals.

## Improvements in [Maintainability]({{ "/design-forces/maintainability/" | relative_url }}):

- Added a CI job to detect lines longer than 512 characters (avoid this
  [lintian tag](https://lintian.debian.org/tags/very-long-line-length-in-source-file.html)
  warning).
- Added formatting of `.proto` files with clang-format. Added check in CI job.
- Major refactoring of the `GNSSFlowgraph` and `GNSSBlockFactory` class
  implementations, greatly improving maintainability, simplifying the addition
  of new signals, and eliminating a lot of duplicated code. Awesome contribution
  by @MathieuFavreau.
- Major refactoring of the acquisition adapters and GNU Radio blocks, improving
  maintainability and extensibility. Another excellent contribution by
  @MathieuFavreau.
- Refactoring of Telemetry Decoder adapters for better maintainability.
- Refactored the internal handling of multi-signal configurations in the PVT
  block for improved maintainability and extensibility. Another excellent
  contribution by @MathieuFavreau.
- Major refactoring of the RINEX printer, significantly improving
  maintainability and correcting several bugs. The printer now consistently
  populates all observable fields when multiple signals exist for the same
  constellation, writing zeros for missing observables as needed to strictly
  match the observables header format. Another excellent contribution by
  @MathieuFavreau.
- Integration of Glonass L1/L2 C/A signal tracking into the main tracking
  engine. Removed `GLONASS_L1_CA_DLL_PLL_C_Aid_Tracking` and
  `GLONASS_L1_CA_DLL_PLL_C_Aid_Tracking` Tracking block implementations,
  replaced by `GLONASS_L1_CA_DLL_PLL_Tracking` and
  `GLONASS_L1_CA_DLL_PLL_Tracking`.

## Improvements in [Portability]({{ "/design-forces/portability/" | relative_url }}):

- Fixed building option `-DENABLE_ION=ON` when using CMake >= 4.0.
- Updated `gsl-lite` to v1.0.1. See the
  [gsl-lite release](https://github.com/gsl-lite/gsl-lite/releases/tag/v1.0.1).
- Updated local `cpu_features` library to v0.10.1.
- Allow linking against Boost 1.89.0.
- Added implementations of several `volk_gnsssdr` kernels for the RISC‑V Vector
  (RVV) instruction set. Awesome contribution by @BigTurtle8 (Marcus Alagar) as
  part of Google Summer of Code 2025.

## Improvements in [Usability]({{ "/design-forces/usability/" | relative_url }}):

- Added a Python-based GNSS skyplot visualization utility at
  `utils/skyplot/skyplot.py`, which generates a skyplot from a RINEX navigation
  file and saves the image in usual image formats. It requires `numpy` and
  `matplotlib`.
- Added a Python-based OSNMA timeline viewer visualization utility at
  `utils/osnma-log-viewer/osnma_log_viewer.py`, which generates a plot from a
  GNSS-SDR log file containing OSNMA messages. It requires `matplotlib` and
  `pandas`.
- `File_Signal_Source` fixed file length and sample skip calculations on 32-bit
  systems.
- Fixed tracking the same PRN in multiple channels. Previously, this could
  happen when the number of acquisition channels was close to the number of
  available PRNs for a given signal.
- Added a new global configuration parameter, `GNSS-SDR.tow_to_trk`. When set to
  `true`, Telemetry blocks send asynchronous messages back to the Tracking
  blocks containing the information required to compute the TOW and week number
  at the tracking stage. The default value is `false`.
- Fixed a long-standing issue in which acquisition blocks still blocked
  execution even when `blocking=false` was specified in the configuration.


  -----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.21) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).
---
title: "GNSS-SDR v0.0.19 released"
excerpt: "GNSS-SDR v0.0.19 has been released."
header:
 teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2024-01-24T08:54:02+02:00
---

This release provides bug fixes and new features. Most relevant changes with
respect to the former release are listed below:

## Improvements in [Efficiency]({{ "/design-forces/efficiency/" | relative_url }}):

- Fixed some performance inefficiencies detected by Coverity Scan.

## Improvements in [Interoperability]({{ "/design-forces/interoperability/" | relative_url }}):

- Added a new PVT configuration boolean flag (`flag_geohash_log_out`) that
  enables or disables the Position Geohash tag output in INFO log files. Set to
  `false` by default.
- New fields have been added to the custom output stream defined by
  `monitor_pvt.proto`:
  - `utc_time` (a [RFC 3339](https://www.rfc-editor.org/rfc/rfc3339) datetime
    string),
  - velocity in the local ENU frame (`vel_e`, `vel_n`, and `vel_u`), in m/s,
  - the course over ground, `cog`, in degrees,
  - the status of the Galileo's High Accuracy Service, `galhas_status`:
    - 0: HAS data not available
    - 1: HAS Corrections applied
  - `geohash`, an
    [encoded geographic location](https://en.wikipedia.org/wiki/Geohash).

## Improvements in [Maintainability]({{ "/design-forces/maintainability/" | relative_url }}):

- Removed useless casts and shadowed variables, improving source code
  readability.

## Improvements in [Portability]({{ "/design-forces/portability/" | relative_url }}):

- Updated local `cpu_features` library to v0.9.0.
- `volk_gnsssdr`: fix syntax for Python 3.12 without breaking backward
  compatibility with Python 2.7.
- Fixed linking against GNU Radio v3.10.9.1.
- Make use of new API if linking against VOLK >= 3.1.
- Fixed undefined behaviour in `volk_gnsssdr` arising from incompatibility
  between complex numbers in C and C++.
- Now build system paths are not leaked when cross-compiling.
- Enabled building using macOS Sonoma and `arm64` processor architecture.

## Improvements in [Repeatability]({{ "/design-forces/repeatability/" | relative_url }}):

- A Kalman filter is now available in the PVT block, smoothing the outputs of a
  simple Least Squares solution and improving the precision of delivered fixes.
  It can be enabled by setting `PVT.enable_pvt_kf=true` in the configuration
  file. The user can set values for the measurement and process noise
  covariances with the following optional parameters (here with their default
  values): `PVT.kf_measures_ecef_pos_sd_m=1.0`, in [m];
  `PVT.kf_measures_ecef_vel_sd_ms=0.1`, in [m/s];
  `PVT.kf_system_ecef_pos_sd_m=2.0`, in [m]; and
  `PVT.kf_system_ecef_vel_sd_ms=0.5`, in [m/s].

## Improvements in [Scalability]({{ "/design-forces/scalability/" | relative_url }}):

- Fixed some potential data race conditions detected by Coverity Scan.

## Improvements in [Usability]({{ "/design-forces/usability/" | relative_url }}):

- The Galileo E1B Reduced CED parameters usage has been set to `false` by
  default. You can activate its usage with `Galileo_E1B_Telemetry_Decoder=true`
  in your configuration file.
- The generation of Galileo E6B observables has been disabled if the user sets
  `PVT.use_e6_for_pvt=false`, fixing the PVT computation in some multi-band
  configurations.
- Fix bug in the custom binary output (`PVT.enable_monitor=true`) output rate.
  Before this fix, it was outputting data every 20 ms, instead of observing the
  `PVT.output_rate_ms` setting.
- Now the program exits properly if a SIGINT signal is received (_e.g._, the
  user pressing Ctrl+C, or another user application sending an interruption
  signal).
- The estimated CN0 value is now printed in the terminal when navigation data is
  succesfully decoded.
- Fixed GPS navigation message satellite validation.
- Latitude and longitude are now reported in the terminal with six decimal
  places (the sixth decimal place worths up to 0.11 m), instead of the
  overkilling nine (the ninth decimal place worths up to 110 microns).
  Similarly, height in meters is now reported with two decimal places instead of
  three, and velocity in m/s also with two decimal places instead of three.
- Fixed the rate at which KLM, GPX, GeoJSON, and NMEA annotations are made. The
  rate is now set by `PVT.output_rate_ms` (`500` ms by default), and can be
  particularized by `PVT.kml_rate_ms`, `PVT.gpx_rate_ms`, `PVT.geojson_rate_ms`,
  and `PVT.nmea_rate_ms`. Those values should be multiples of
  `PVT.output_rate_ms`, or the least common multiple will be taken.


-----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.19) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).


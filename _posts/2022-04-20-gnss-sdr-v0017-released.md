---
title: "GNSS-SDR v0.0.17 released"
excerpt: "GNSS-SDR v0.0.17 has been released."
header:
 teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2022-04-20T08:54:02+02:00
---

This release provides minor bug fixes, new features, and compatibility with GNU
Radio 3.10.2.0. Most relevant changes with respect to the former release are
listed below:

## Improvements in [Availability]({{ "/design-forces/availability/" | relative_url }}):

- Compute PVT solutions when using GPS L5 signals even if the satellite is
  reported as not healthy in the CNAV message.

## Improvements in [Portability]({{ "/design-forces/portability/" | relative_url }}):

- Updated `cpu_features` library to v0.7.0. The building option
  `ENABLE_OWN_CPUFEATURES` has been replaced by `ENABLE_CPUFEATURES`, defaulting
  to `ON`.
- Fixed building against GNU Radio v3.10.2.0.

## Improvements in [Reliability]({{ "/design-forces/reliability/" | relative_url }}):

- Fixed some defects detected by Coverity Scan 2021.12.1.

## Improvements in [Usability]({{ "/design-forces/usability/" | relative_url }}):

- Added a script at `src/utils/scripts/download-galileo-almanac.sh` that
  downloads an XML file with the latest Galileo almanac published by the
  European GNSS Service Centre at https://www.gsc-europa.eu/gsc-products/almanac


-----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.17) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).

<a href="https://doi.org/10.5281/zenodo.6473244" ><i class="ai ai-fw ai-doi ai-lg" aria-hidden="true"></i></a>In order to make GNSS-SDR more easily referenced, and to promote reproducible research, each software release gets a Digital Object Identifier provided by [Zenodo](https://zenodo.org/faq). The DOI for GNSS-SDR v0.0.17 is [10.5281/zenodo.6473244](https://doi.org/10.5281/zenodo.6473244).
{: .notice--info}

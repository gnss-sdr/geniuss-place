---
title: "GNSS-SDR v0.0.8 release"
excerpt: "GNSS-SDR v0.0.8 has been released."
header:
  teaser: https://wiki.videolan.org/images/Debian-logo.jpg
tags:
  - news
author_profile: false
---

GNSS-SDR v0.0.8 has been released. This is a maintenance and bug fix release with no relevant new features with respect to v0.0.7. The main changes are:

 * Fixed a bug that broke building when using latest VOLK release
 * Updated PYBOMBS instructions
 * Added Tests for FFT length
 * Added Tests for CUDA-based tracking
 * Added Tests for SIMD-based tracking
 * Improved CUDA-based correlation.
 * Updated documentation
 * Fixed building in mips and powerpc architectures.
 * gr-gn3s and gr-dbfcttc moved to its own repository.
 * Improved package reproducibility
 * VOLK_GNSSSDR: Fixed a bug in AVX2 puppet
 * VOLK_GNSSSDR: can now be built using the C98 standard
 * VOLK_GNSSSDR: Fixed a bug that broke building when linking to Boost in some configurations.
 * VOLK_GNSSSDR: Added an option to trigger profiling at building time.
 * VOLK_GNSSSDR: Fix the CMake-based check for posix_memalign.

As always, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.8){:target="_blank"} and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/){:target="_blank"}.

<a href="http://dx.doi.org/10.5281/zenodo.57022" target="_blank"><i class="ai ai-fw ai-doi ai-lg" aria-hidden="true"></i></a>In order to make GNSS-SDR more easily referenced, and to promote reproducible research, each software release gets a Digital Object Identifier provided by [Zenodo](https://zenodo.org/faq){:target="_blank"}. The DOI for GNSS-SDR v0.0.8 is [10.5281/zenodo.57022](http://dx.doi.org/10.5281/zenodo.57022){:target="_blank"}.
{: .notice--info}


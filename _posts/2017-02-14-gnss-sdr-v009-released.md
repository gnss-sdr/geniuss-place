---
title: "GNSS-SDR v0.0.9 released"
excerpt: "GNSS-SDR v0.0.9 has been released."
header:
  teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
---

This release has several improvements, addition of new features and bug fixes in many dimensions.


## Improvements in [Accuracy]({{ "/design-forces/accuracy/" | absolute_url }}):

 * Major rewriting in the generation of pseudoranges.
 * Fixed bug in Galileo E5a/I codes.
 * Fixed bug in Galileo E1 correlator spacing.
 * Fixed bug that was causing errors in receivers above the troposphere.
 * Fixed 16-bit complex resampler.
 * Improved time tracking algorithm.
 * Added Bancroft's algorithm implementation for PVT initialization.


## Improvements in [Availability]({{ "/design-forces/availability/" | absolute_url }}):

 * Improved numerical stability of the PVT solution. The infamous bug that was causing apparently random error peaks has finally been fixed.


## Improvements in [Efficiency]({{ "/design-forces/efficiency/" | absolute_url }}):

 * VOLK_GNSSSDR: Added NEON, AVX and unaligned protokernels for ```volk_gnsssdr_32f_index_max_32``` kernel.
 * VOLK_GNSSSDR: Added ```volk_gnsssdr-config-info``` to the list of generated executables.


## Improvements in [Flexibility]({{ "/design-forces/flexibility/" | absolute_url }}):

 * Added maximum number of dwells in the Tong algorithm.


## Improvements in [Interoperability]({{ "/design-forces/interoperability/" | absolute_url }}):

 * Added six new Galileo satellites:  FM7, FM10, FM11, FM12, FM13, FM14.
 * The ```Hybrid_Observables``` and ```Hybrid_PVT``` implementations can now handle more types of GNSS signals.
 * The RINEX printer can now print L2C and E5a observables and navigation files, including multiband configurations.
 * Added RTCM 3.2 output to more receiver configurations.


## Improvements in [Maintainability]({{ "/design-forces/maintainability/" | absolute_url }}):

 * The VOLK_GNSSSDR library can now be built with Python 3. Switched dependencies for VOLK_GNSSDR: from (old, python2.7-only) python-cheetah templates to Python3 friendly python-mako and python-six. So, Python-cheetah dependency has been dropped, and python-mako and python-six have been added.
 * If suitable versions of gflags, glog, armadillo or googletest are not found in the system, they will be downloaded and built at compile time (versions 2.2.0, 0.3.4, 7.600.2 and 1.8.0, respectively).   
 * Fixed more than 30 defects detected by Coverity Scan.
 * Added CMake Python finder and module checker.
 * Deleted files related to CPack.
 * Fixes, updates and improvements in the documentation.
 * Improvements in CMake scripts: General code cleaning and addition of comments. Improved user information in case of failure. Improved detection of dependencies in more processor architectures (e.g. aarch64).


## Improvements in [Marketability]({{ "/design-forces/marketability/" | absolute_url }}):

 * Reduced time from a commit to deployment (see virtualization mechanisms in Portability).


## Improvements in [Portability]({{ "/design-forces/portability/" | absolute_url }}):

 * Now GNSS-SDR can be run in virtual environments through snap packages (see [https://github.com/carlesfernandez/snapcraft-sandbox](https://github.com/carlesfernandez/snapcraft-sandbox)) and docker images (see [https://github.com/carlesfernandez/docker-gnsssdr](https://github.com/carlesfernandez/docker-gnsssdr)).
 * Now GNSS-SDR is adapted to cross-compiling environments for embedded devices (see [https://github.com/carlesfernandez/oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest)).
 * BLAS and LAPACK libraries are not longer mandatory on ARM devices.


## Improvements in [Scalability]({{ "/design-forces/scalability/" | absolute_url }}):

 * Fixed bug in acquisition with data rates higher than 16 Msps in 4ms code periods.


## Improvements in [Testability]({{ "/design-forces/testability/" | absolute_url }}):

 * Major QA source code refactoring: they have been split into ```src/tests/unit-tests``` and  src/tests/system-tests folders. They are optionally built with the ```ENABLE_UNIT_TESTING=ON``` (unit testing QA code), ```ENABLE_UNIT_TESTING_EXTRA=ON``` (unit tests that require extra files downloaded at configure time), ```ENABLE_SYSTEM_TESTING=ON``` (system tests, such as measurement of Time-To-First-Fix) and ```ENABLE_SYSTEM_TESTING_EXTRA=ON``` (extra system test requiring external tools, automatically  downloaded and built at building time) configuration flags. The ```EXTRA``` options also download and build a custom software-defined signal generator and version 2.9 of [GPSTk](http://www.gpstk.org/), if not already found on the system. Download and local link of version 2.9 can be forced by ```ENABLE_OWN_GPSTK=ON``` building configuration flag. Only ```ENABLE_UNIT_TESTING``` is set to ON by default.
 * Unit tests added: ```CPU_multicorrelator_test``` and ```GPU_multicorrelator_test``` measure computer performance in multicorrelator setups.
 * Extra unit tests added: ```GpsL1CADllPllTracking``` and ```GpsL1CATelemetryDecoderTest```.
 * System test added: ```ttff_gps_l1``` performs a set of cold / assisted runs of the software receiver and computes statistics about the obtained Time To First Fix.
 * Extra system test added: ```obs_gps_l1_system_test``` uses an external software-defined signal generator to produce raw digital GNSS signal from a RINEX navigation file and a position (static or dynamic), processes it with GNSS-SDR, and then compares the RINEX observation file produced by the software receiver to that produced by the signal generator.
 * Software Development Kit provided for embedded devices (see [http://gnss-sdr.org/docs/tutorials/cross-compiling/](http://gnss-sdr.org/docs/tutorials/cross-compiling/)).


## Improvements in [Usability]({{ "/design-forces/usability/" | absolute_url }}):

 * Now the block factory automatically detects Channel input data type, so it is no longer required to specify ```Channel.input_type``` in the configuration. An error raises if Acquisition and Tracking Blocks are not configured with the same input data type.
 * Block names changed from ```L2_M``` to ```L2C```.
 * Documentation available at [http://gnss-sdr.org/docs/](http://gnss-sdr.org/docs/)
 * Improved tools for compilation, execution and testing in embedded devices.


-----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.9) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).

<a href="http://dx.doi.org/10.5281/zenodo.291371" ><i class="ai ai-fw ai-doi ai-lg" aria-hidden="true"></i></a>In order to make GNSS-SDR more easily referenced, and to promote reproducible research, each software release gets a Digital Object Identifier provided by [Zenodo](https://zenodo.org/faq). The DOI for GNSS-SDR v0.0.9 is [10.5281/zenodo.291371](http://dx.doi.org/10.5281/zenodo.291371).
{: .notice--info}

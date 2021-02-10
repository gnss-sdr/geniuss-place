---
title: "GNSS-SDR v0.0.11 released"
excerpt: "GNSS-SDR v0.0.11 has been released."
header:
  teaser: /assets/images/logo-gnss-sdr-new-release.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2019-08-04T12:54:02+02:00  
---

This release has several improvements in different dimensions, addition of new features and bug fixes:


## Improvements in [Accuracy]({{ "/design-forces/accuracy/" | relative_url }}):

 * Local clock correction based on PVT solution, allowing the delivery of continuous observables.
 * Fix a bug in broadcast ionospheric parameters usage.


## Improvements in [Availability]({{ "/design-forces/availability/" | relative_url }}):

 * Improved mechanism for false lock detection in the Tracking loops.
 * Fixed bug in Galileo INAV/FNAV message decoding when PLL is locked at 180 degrees, which prevented from correct navigation message decoding in some situations.
 * Fixed bug that caused a random deadlock in the Observables block, preventing the computation of PVT fixes.
 * Fixed PVT computation continuity through the TOW rollover.
 * Improved signal acquisition and tracking mechanisms in high dynamic scenarios.


## Improvements in [Efficiency]({{ "/design-forces/efficiency/" | relative_url }}):

 * Added mechanism for assisted acquisition of signals on a secondary band when the primary has already been acquired. This allows a great reduction of the computational load in multi-frequency configurations.
 * Tracking loops now perform bit synchronization, simplifying the decoding process in Telemetry blocks and FPGA-offloading.
 * Improved preamble detection implementation in the decoding of navigation messages (acceleration by x1.6 on average per channel).
 * Shortened Acquisition to Tracking transition time.
 * Applied clang-tidy checks and fixes related to performance: performance-faster-string-find, performance-for-range-copy, performance-implicit-conversion-in-loop, performance-inefficient-algorithm, performance-inefficient-string-concatenation, performance-inefficient-vector-operation, performance-move-const-arg, performance-move-constructor-init, performance-noexcept-move-constructor, performance-type-promotion-in-math-fn, performance-unnecessary-copy-initialization, performance-unnecessary-value-param, readability-string-compare.


## Improvements in [Flexibility]({{ "/design-forces/flexibility/" | relative_url }}):

 * Rewritten Control Thread and GNSS flow graph for increased control of channels' status and smarter assignation of satellites in multi-band configurations.
 * New Tracking parameters allow the configuration of PLL and DLL filters order.
 * Added parameter to enable FLL during pull-in time.
 * Configurable pull-in time in the Tracking loops.


## Improvements in [Interoperability]({{ "/design-forces/interoperability/" | relative_url }}):

 * Added the BeiDou B1I and B3I receiver chains.
 * Fix bug in GLONASS dual frequency receiver.
 * Added a custom UDP/IP output for PVT data streaming.
 * Improved Monitor block with UDP/IP output for internal receiver's data streaming.
 * Custom output formats described with .proto files, making easier to other applications reading them in a forward and backward-compatible fashion upon future format changes. New dependency: Protocol Buffers >= 3.0.0
 * Fixes in RINEX generation: week rollover, annotations are not repeated anymore in navigation files. Parameter rinexnav_rate_ms has been removed, annotations are made as new ephemeris arrive.
 * Fixes in RTCM messages generation: week rollover.


## Improvements in [Maintainability]({{ "/design-forces/maintainability/" | relative_url }}):

 * The internal communication mechanism based on gr::msg_queue has been replaced by a thread-safe, built-in asynchronous message passing system based on GNU Radio's Polymorphic Types. This change is backwards-compatible and prevents from a failure in case of a possible future deprecation or removal of the gr::msg_queue API.
 * Deprecated boost::asio::io_service replaced by boost::asio::io_context if Boost > 1.65
 * CMake turns all policies to ON according to the running version up to version 3.15.
 * Usage of clang-tidy integrated into CMake scripts. New option -DENABLE_CLANG_TIDY=ON executes clang-tidy along with compilation. Requires clang compiler.
 * Applied clang-tidy checks and fixes related to readability: readability-container-size-empty, readability-identifier-naming, readability-inconsistent-declaration-parameter-name, readability-named-parameter, readability-non-const-parameter, readability-string-compare.
 * Improved includes selection following suggestions by [include-what-you-use](https://include-what-you-use.org/), allowing faster compiles, fewer recompiles and making refactoring easier.
 * Massive reduction of warnings triggered by clang-tidy checks.
 * Throughout code cleaning and formatting performed with automated tools in order to reduce future commit noise.


## Improvements in [Portability]({{ "/design-forces/portability/" | relative_url }}):

 * Added interfaces for FPGA off-loading in GPS L1 C/A, Galileo E1b/c, GPS L2C, GPS L5 and Galileo E5a receiver chains.
 * CMake scripts now follow a modern approach (targets and properties) but still work with 2.8.12.
 * Improvements for macOS users using Homebrew.
 * The software builds against GNU Radio >= 3.7.3, including 3.8.0. Automatically detected, no user intervention is required.
 * The volk_gnsssdr library can now be built without requiring Boost if the compiler supports C++17 or higher.
 * The Boost Filesystem library is not anymore a required dependency in cases where it can be replaced by std::filesystem. Automatically detected, no user intervention is required.
 * CMake scripts automatically select among C++11, C++14, C++17 or C++20 standards, the most recent as possible, depending on compiler and dependencies versions.
 * Drawback in portability: Protocol Buffers >= 3.0.0 is a new required dependency.


## Improvements in [Reliability]({{ "/design-forces/reliability/" | relative_url }}):

 * Included the Guidelines Support Library. General improvement of memory management, replacement of raw pointers by containers or smart pointers.
 - Applied clang-tidy checks and fixes related to High Integrity C++: performance-move-const-arg, modernize-use-auto, modernize-use-equals-default, modernize-use-equals-delete, modernize-use-noexcept, modernize-use-nullptr, cert-dcl21-cpp, misc-new-delete-overloads, cert-dcl58-cpp, cert-err52-cpp, cert-err60-cpp, hicpp-exception-baseclass, hicpp-explicit-conversions.
 * Fixed a number of defects detected by Coverity Scan (version June 2019).


## Improvements in [Usability]({{ "/design-forces/usability/" | relative_url }}):

 * The receiver now admits FPGA off-loading, allowing for real-time operation in embedded systems at high sampling rates and high number of signals and channels per signal in multiple bands.
 * Fixed program termination (avoiding hangs and segfaults in some platforms/configurations).
 * The Labsat_Signal_Source now terminates the receiver's execution when the end of file(s) is reached. It now accepts LabSat 2 filenames and series of LabSat 3 files.
 * Added configuration parameters to set the annotation rate in KML, GPX, GeoJSON and NMEA outputs, set by default to 1 s.
 * New parameter PVT.show_local_time_zone displays time in the local time zone. Subject to the proper system configuration of the machine running the software receiver. This feature is not available in old compilers.
 * CMake now generates a summary of required/optional dependency packages found and enabled/disabled features. This info is also stored in a file called features.log in the building directory.
 * Improved information provided to the user in case of building configuration and runtime failures.


-----


As usual, compressed tarballs are available from [GitHub](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.11) and [Sourceforge](https://sourceforge.net/projects/gnss-sdr/).

<a href="https://doi.org/10.5281/zenodo.3359989" ><i class="ai ai-fw ai-doi ai-lg" aria-hidden="true"></i></a>In order to make GNSS-SDR more easily referenced, and to promote reproducible research, each software release gets a Digital Object Identifier provided by [Zenodo](https://zenodo.org/faq). The DOI for GNSS-SDR v0.0.11 is [10.5281/zenodo.3359989](https://doi.org/10.5281/zenodo.3359989).
{: .notice--info}

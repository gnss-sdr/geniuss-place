---
title: "Testing the software receiver, Part II: Test Execution"
permalink: /docs/tutorials/testing-software-receiver-2/
excerpt: "Documentation on how to build and run the testing code."
author_profile: false
header:
  teaser: /assets/images/PDCA.png
tags:
  - tutorial
  - Git
  - Testing
sidebar:
  nav: "docs"
toc: true
toc_sticky: true
show_date: false
last_modified_at: 2021-08-11T11:37:02+02:00
---

[Testability]({{ "/design-forces/testability/" | relative_url }}) is an
essential feature in any GNSS receiver. The companion tutorial [Testing the
software receiver, Part I: Methodology]({{
"/docs/tutorials/testing-software-receiver/" | relative_url }}) describes the
general approach taken in this project, and this page documents the available
set of Unit and System tests. Some of them are highly configurable, so they can
be seen as Performance tests.

In order to execute the tests, you must build GNSS-SDR from source. If the
Google C++ Testing Framework source code is not already present in your system
(and pointing the `GTEST_DIR` environment variable to the root of the source
code tree or, on Debian-based GNU/Linux distributions, doing `sudo apt-get
install libgtest-dev`), it will be automatically downloaded from its Git
repository, compiled and linked to GNSS-SDR at building time. The CMake script
automates all those steps for you.

**Tip:** some tests can optionally output plots if
[Gnuplot](http://www.gnuplot.info/), a portable command-line driven graphing
utility, is installed in your system. If you want to use this feature, install
Gnuplot (by doing `sudo apt-get install gnuplot` in Debian-based Linux
distributions, or `sudo port install gnuplot` using Macports in macOS) before
building GNSS-SDR, and then activate the corresponding flag in the tests in
which it is allowed (those flags start with `--plot_...`). This will display
figures in new windows and will save them as
[PostScript](https://en.wikipedia.org/wiki/PostScript) and PDF files in the
folder where the test was called. In order to avoid showing plots on the screen,
but still get the figures in files, use `--noshow_plot`.
{: .notice--info}

GNSS-SDR tests are divided into two categories:

 * **Unit Tests**: checking of certain functions and areas - or _units_ - of
 the source code.
 * **System Tests**: checking conducted on a complete, integrated system to
 evaluate the system's compliance with its specified requirements.

By default, only a (large) subset of unit tests is compiled (see details
[below]({{ "#unit-tests" }})). So, when doing:

```console
$ cd gnss-sdr/build
$ git checkout next
$ cmake ..
$ make
$ make check  # THIS STEP IS OPTIONAL. It builds and runs a subset of tests.
```

this process will end up generating some executables at the `gnss-sdr/install`
folder. Among them, a test program called `run_tests`. This executable gathers
all the available GNSS-SDR's unit tests. It can be run by doing:

```console
$ cd ../install
$ ./run_tests
```

The output of this program should be similar to:

```

Running GNSS-SDR Tests...
[==========] Running 217 tests from 57 test suites.
[----------] Global test environment set-up.

...

[----------] Global test environment tear-down
[==========] 217 tests from 57 test suites ran. (64845 ms total)
[  PASSED  ] 217 tests.

```
{: class="no-copy"}

Other additional unit and system tests require external tools, libraries and
data files not included in the GNSS-SDR's source tree. As in the case of the
Google C++ Testing Framework source code, they can be automatically downloaded
and built by passing the following option flags to CMake:

|----------
|  **Variable passed to CMake** | **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|
|--------------
| `-DENABLE_UNIT_TESTING` | ON / OFF | ON  |  If set to OFF, it disables the building of unit tests. This can be useful in memory-limited systems. |
| `-DENABLE_UNIT_TESTING_EXTRA` | ON / OFF | OFF  | If set to ON, it downloads external raw sample files and other software tools (among them, [GPSTk](https://github.com/SGL-UT/GPSTk/), if it is not already found in your system), and builds some extra unit tests that are added to the `run_tests` executable.  |
| `-DENABLE_SYSTEM_TESTING` | ON / OFF |  OFF |  If set to ON, it builds system tests (each one with its own executable test program) at the `gnss-sdr/install` folder, unless otherwise indicated by the ENABLE_INSTALL_TESTS option.  |
| `-DENABLE_SYSTEM_TESTING_EXTRA` | ON / OFF | OFF  | If set to ON, it downloads external software tools (among them, [GPSTk](https://github.com/SGL-UT/GPSTk/), if it is not already found in your system) and builds some extra system tests. The generated binaries are copied to the `gnss-sdr/install` folder, unless otherwise indicated by the ENABLE_INSTALL_TESTS option. |
| `-DENABLE_OWN_GPSTK` | ON / OFF |  OFF | If set to ON, it forces to download, build and link [GPSTk](https://github.com/SGL-UT/GPSTk/) for system tests, even if it is already installed. This can be useful if you have an old version of GPSTk (older than 2.10) already installed in your system and you do not want to remove it, but you still want the QA code to use a more recent version. |
| `-DENABLE_INSTALL_TESTS` | ON / OFF | OFF | By default, generated test binaries are not installed system-wide but placed in the local folder `gnss-sdr/install`. If this option is set to ON, test binaries and auxiliary files will not be copied to  `gnss-sdr/install` but installed in the system path when doing `make install`.  |
|----------

Those extra tests are described [below]({{ "#extra-unit-tests" }}).

Tests programs generated with the Google C++ Testing Framework accepts a number
of interesting command-line flags. Hereafter we describe some of the most
relevant ones.

# Using the testing framework

## Listing Tests names

Sometimes it is necessary to list the available tests in a program before
running them so that a filter may be applied if needed. Including the flag
`--gtest_list_tests` overrides all other flags and lists tests in the following
format:

```
TestSuite1.
  TestCase1
  TestCase2
TestSuite2.
  TestCase
```
{: class="no-copy"}

So, running:

```console
$ ./run_tests --gtest_list_tests
```

will get the currently available unit Test Suites and unit Test Cases.

##  Running a Subset of the Tests

By default, a Google Test program runs all tests the user has defined.
Sometimes, you want to run only a subset of the tests (_e.g._ for debugging or
quickly verifying a change). If you set the `GTEST_FILTER` environment variable
or the `--gtest_filter` flag to a filter string, Google Test will only run the
tests whose full names (in the form of TestSuiteName.TestCaseName) match the
filter.

The format of a filter is a '`:`'-separated list of wildcard patterns (called
the positive patterns) optionally followed by a '`-`' and another
'`:`'-separated pattern list (called the negative patterns). A test matches the
filter if and only if it matches any of the positive patterns but does not match
any of the negative patterns.

A pattern may contain '`*`' (matches any string) or '`?`' (matches any single
character). For convenience, the filter '`*-NegativePatterns`' can be also
written as '`-NegativePatterns`'.

For example:

 * `$ ./run_tests` Has no flag, and thus runs all its tests.
 * `$ ./run_tests --gtest_filter=*` Also runs everything, due to the single match-everything * value.
 * `$ ./run_tests --gtest_filter=GpsL1CaPcpsAcquisitionTest.*` Runs everything in test suite GpsL1CaPcpsAcquisitionTest.
 * `$ ./run_tests --gtest_filter=*Gps*:*Acquisition*` Runs any test whose full name contains either "Gps" or "Acquisition".
 * `$ ./run_tests --gtest_filter=-*Acquisition*` Runs all non-Acquisition tests.
 * `$ ./run_tests --gtest_filter=GpsL1CaPcpsAcquisitionTest.*-GpsL1CaPcpsAcquisitionTest.ValidationOfResults` Runs everything in test suite GpsL1CaPcpsAcquisitionTest except GpsL1CaPcpsAcquisitionTest.ValidationOfResults.

## Repeating the Tests

The `--gtest_repeat` flag allows you to repeat all (or selected) test methods in
a program many times.

For example:

```console
$ ./run_tests --gtest_filter=GpsL1CaPcpsAcquisitionTest.* --gtest_repeat=10
```

executes all the tests in the Test Suite `GpsL1CaPcpsAcquisitionTest` ten times.


## Generating an XML Report

Google Test can emit a detailed XML report to a file in addition to its normal
textual output. To generate the XML report, set the `GTEST_OUTPUT` environment
variable or the `--gtest_output` flag to the string
"`xml:_path_to_output_file_`", which will create the file at the given location.
You can also just use the string "`xml`", in which case the output can be found
in the `test_detail.xml` file in the current directory.

If you specify a directory (for example, "`xml:output/directory/`"), Google Test
will create the XML file in that directory, named after the test executable
(_e.g._ `run_tests.xml` for test program `run_tests`). If the file already
exists (perhaps left over from a previous run), Google Test will pick a
different name (_e.g._ `run_tests_1.xml`) to avoid overwriting it.

The format of the report is as follows:

```
<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="AllTests" ...>
  <testsuite name="test_suite_name" ...>
    <testcase name="test_case_name" ...>
      <failure message="..."/>
      <failure message="..."/>
      <failure message="..."/>
    </testcase>
  </testsuite>
</testsuites>
```
{: class="no-copy"}

 * The root `<testsuites>` element corresponds to the entire test program.
 * `<testsuite>` elements correspond to Google Test test suites.
 * `<testcase>` elements correspond to Google Test test cases.


For example:

```console
$ ./run_tests --gtest_filter=CpuMulticorrelatorTest.* --gtest_output=xml
```

generates a report called `test_detail.xml` in the current directory;

```console
$ ./run_tests --gtest_filter=CpuMulticorrelatorTest.* --gtest_output=xml:./test_results/
```

generates a report called `run_tests.xml` in a newly created `./test_results`
directory; and

```console
$ ./run_tests --gtest_filter=CpuMulticorrelatorTest.* --gtest_output=xml:./test_results/my_tests.xml
```

generates a report called `my_tests.xml` in the `./test_results` directory.

All these examples produce the following report:

```
<?xml version="1.0" encoding="UTF-8"?>
<testsuites tests="1" failures="0" disabled="0" errors="0" timestamp="2017-06-25T09:43:52" time="2.365" name="AllTests">
  <testsuite name="CpuMulticorrelatorTest" tests="1" failures="0" disabled="0" errors="0" time="2.365">
    <testcase name="MeasureExecutionTime" status="run" time="2.365" classname="CpuMulticorrelatorTest" />
  </testsuite>
</testsuites>
```
{: class="no-copy"}

&nbsp;


# Description of available tests

## Unit Tests

The generation of some unit test suites are enabled by default, and gathered in
the test program `run_tests`.

**Unit Test Suites for arithmetics:**

 * `CodeGenerationTest`: set of test cases for
 [gnss_signal_replica.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/libs/gnss_signal_replica.h)
 measuring the execution time of various implementations of PRN code generation.
 * `ComplexCarrierTest`: set of test cases for
 [gnss_signal_replica.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/libs/gnss_signal_replica.h)
 measuring the execution time of various implementations of complex carrier
 generation. The default vector length is $$ 100000 $$, but this test suite
 accepts the flag `--size_carrier_test`. You can try a different length by
 doing:
 ```console
 $ ./run_tests --gtest_filter=ComplexCarrier* --size_carrier_test=1000000
 ```
 * `ConjugateTest`: set of test cases measuring the execution time of various
 implementations of vector conjugation. The default vector length is $$ 100000 $$,
 but this test suite accepts the flag `--size_conjugate_test`. You can try a
 different length by doing:
 ```console
 $ ./run_tests --gtest_filter=Conjugate* --size_conjugate_test=1000000
 ```
 * `FFTLengthTest`: set of test cases measuring the execution time for several
 FFT lengths. The default number of averaged iterations is $$ 1000 $$, but this
 test suite accepts the flag `--fft_iterations_test`. If you have
 [Gnuplot](http://www.gnuplot.info/) installed in your system, you can get some
 plots by adding the flag `--plot_fft_length_test`. You can try a different
 number of iterations and get some plots by doing:
 ```console
 $ ./run_tests --gtest_filter=FFT* --fft_iterations_test=10000 --plot_fft_length_test
 ```
 * `MagnitudeSquaredTest`: set of test cases measuring the execution time of
 various implementations of vector square magnitude computation. The default
 vector length is $$ 100000 $$, but this test suite accepts the flag
 `--size_magnitude_test`. You can try a different length by doing:
 ```console
 $ ./run_tests --gtest_filter=Magnitude* --size_magnitude_test=1000000
 ```
 * `MultiplyTest`: set of test cases measuring the execution time of various
 implementations of vector (element-by-element) multiplication. The default
 vector length is $$ 10000 $$, but this test suite accepts the flag
 `--size_multiply_test`. You can try a different length by doing:
 ```console
 $ ./run_tests --gtest_filter=Multiply* --size_multiply_test=100000
 ```

**Unit Test Suites for the control plane:**

 * `ControlThreadTest`: set of test cases for [control_thread.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/core/receiver/control_thread.h)
 * `FileConfigurationTest`: set of test cases for [file_configuration.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/core/receiver/file_configuration.h)
 * `GNSSBlockFactoryTest`: set of test cases for [gnss_block_factory.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/core/receiver/gnss_block_factory.h)
 * `GNSSFlowgraph`: set of test cases for [gnss_flowgraph.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/core/receiver/gnss_flowgraph.h)
 * `InMemoryConfiguration`: set of test cases for [in_memory_configuration.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/core/receiver/in_memory_configuration.h)
 * `StringConverterTest`: set of test cases for [string_converter.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/core/libs/string_converter.h)

**Unit Test Suites for signal processing blocks:**

 * Signal sources
   - `FileSignalSource`: set of test cases for [file_signal_source.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/signal_source/adapters/file_signal_source.h)
   - `ValveTest`: set of test cases for [gnss_sdr_valve.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/signal_source/libs/gnss_sdr_valve.h)
   - `Unpack2bitSamplesTest`: set of test cases for [unpack_2bit_samples.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/signal_source/gnuradio_blocks/unpack_2bit_samples.h)

 * Data Type Adapter
   - `PassThroughTest`: set of test cases for [pass_through.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/libs/pass_through.h)
   - `DataTypeAdapter`: set of test cases for data type adapters [byte_to_short.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/data_type_adapter/adapters/byte_to_short.h), [ibyte_to_cbyte.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/data_type_adapter/adapters/ibyte_to_cbyte.h), [ibyte_to_complex.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/data_type_adapter/adapters/ibyte_to_complex.h), [ibyte_to_cshort.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/data_type_adapter/adapters/ibyte_to_cshort.h), [ishort_to_complex.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/data_type_adapter/adapters/ishort_to_complex.h) and [ishort_to_cshort.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/data_type_adapter/adapters/ishort_to_cshort.h)

 * Input filter
   - `FirFilterTest`: set of test cases for [fir_filter.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/input_filter/adapters/fir_filter.h)

 * Resampler
      - `DirectResamplerConditionerCcTest`: set of test cases for [direct_resampler_conditioner_cc.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/resampler/gnuradio_blocks/direct_resampler_conditioner_cc.h)
      - `MmseResamplerTest`: set of test cases for [mmse_resampler_conditioner.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/resampler/adapters/mmse_resampler_conditioner.h)

 * Acquisition
      - `GpsL1CaPcpsAcquisitionTest`: set of test cases for [gps_l1_ca_pcps_acquisition.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/acquisition/adapters/gps_l1_ca_pcps_acquisition.h). If Gnuplot is installed in your machine, this test can plot the acquisition grid by passing the flag `--plot_acq_grid`. Example:
      ```console
      $ ./run_tests --gtest_filter=GpsL1CaPcpsAcquisitionTest* --plot_acq_grid
      ```
      - `GpsL1CaPcpsAcquisitionGSoC2013Test`: set of test cases for [gps_l1_ca_pcps_acquisition.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/acquisition/adapters/gps_l1_ca_pcps_acquisition.h) developed during GSoC 2013.
      - `GpsL1CaPcpsTongAcquisitionGSoC2013Test`: set of test cases for [gps_l1_ca_pcps_tong_acquisition.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/acquisition/adapters/gps_l1_ca_pcps_tong_acquisition.h)
      - `GpsL1CaPcpsQuickSyncAcquisitionGSoC2014Test`: set of test cases for [gps_l1_ca_pcps_quicksync_acquisition.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/acquisition/adapters/gps_l1_ca_pcps_quicksync_acquisition.h)
      - `GalileoE1PcpsAmbiguousAcquisitionTest`: set of test cases for [galileo_e1_pcps_ambiguous_acquisition.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/acquisition/adapters/galileo_e1_pcps_ambiguous_acquisition.h). If Gnuplot is installed in your machine, this test can plot the acquisition grid by passing the flag `--plot_acq_grid`. Example:
      ```console
      $ ./run_tests --gtest_filter=GalileoE1PcpsAmbiguousAcquisitionTest* --plot_acq_grid
      ```
      - `GalileoE1PcpsAmbiguousAcquisitionGSoCTest`: set of test cases for [galileo_e1_pcps_ambiguous_acquisition.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/acquisition/adapters/galileo_e1_pcps_ambiguous_acquisition.h) developed during GSoC 2012.
      - `GalileoE1PcpsAmbiguousAcquisitionGSoC2013Test`: set of test cases for [galileo_e1_pcps_ambiguous_acquisition.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/acquisition/adapters/galileo_e1_pcps_ambiguous_acquisition.h) developed during GSoC 2013.
      - `GalileoE1PcpsTongAmbiguousAcquisitionGSoC2013Test`: set of test cases for [galileo_e1_pcps_tong_ambiguous_acquisition.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/acquisition/adapters/galileo_e1_pcps_tong_ambiguous_acquisition.h) developed during GSoC 2013.
      - `GalileoE1PcpsQuickSyncAmbiguousAcquisitionGSoC2014Test`: set of test cases for [galileo_e1_pcps_quicksync_ambiguous_acquisition.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/acquisition/adapters/galileo_e1_pcps_quicksync_ambiguous_acquisition.h) developed during GSoC 2014.
      - `GalileoE5aPcpsAcquisitionGSoC2014GensourceTest`: set of test cases for [galileo_e5a_noncoherent_iq_acquisition_caf.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/acquisition/adapters/galileo_e5a_noncoherent_iq_acquisition_caf.h) developed during GSoC 2014.
      - `GlonassL1CaPcpsAcquisitionGSoC2017Test`: set of test cases for [glonass_l1_ca_pcps_acquisition.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/acquisition/adapters/glonass_l1_ca_pcps_acquisition.h) developed during GSoC 2017.

 * Tracking
      - `CpuMulticorrelatorTest`: set of test cases for
      [cpu_multicorrelator.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/tracking/libs/cpu_multicorrelator.h)
      that measure the execution time for multi-correlations of size $$ 2048 $$, $$
      4096 $$ and $$ 8192 $$. By default, the measurements average $$ 1000 $$
      independent realizations, a value that can be changed by the flag
      `--cpu_multicorrelator_iterations_test`. You can also set the number of
      threads spawned by this program with the flag
      `--cpu_multicorrelator_max_threads_test`. A possible call for this test
      could be:

      ```console
      $ ./run_tests --gtest_filter=Cpu* --cpu_multicorrelator_iterations_test=10000 --cpu_multicorrelator_max_threads_test=2
      ```
      - `GpuMulticorrelatorTest`: set of test cases for
      [cuda_multicorrelator.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/tracking/libs/cuda_multicorrelator.h)
      that measure the execution time for multi-correlations of size $$ 2048 $$, $$
      4096 $$ and $$ 8192 $$ executed in the GPU. The availability of this test
      suite requires the [CUDA
      Toolkit](https://developer.nvidia.com/cuda-downloads) installed in your
      system, a GPU [supporting CUDA](https://developer.nvidia.com/cuda-gpus),
      and have passed the option `-DENABLE_CUDA=ON` to CMake. By default, the
      measurements average $$ 1000 $$ independent realizations, a value that can
      be changed by the flag `--gpu_multicorrelator_iterations_test`. You can
      also set the number of threads spawned by this program with the flag
      `--gpu_multicorrelator_max_threads_test`. A possible call for this test
      could be:

      ```console
      $ ./run_tests --gtest_filter=Gpu* --gpu_multicorrelator_iterations_test=10000 --gpu_multicorrelator_max_threads_test=2
      ```
      - `GalileoE1DllPllVemlTrackingInternalTest`: set of test cases for [galileo_e1_dll_pll_veml_tracking.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/tracking/adapters/galileo_e1_dll_pll_veml_tracking.h)
      - `GlonassL1CaDllPllTrackingTest`: set of test cases for [glonass_l1_ca_dll_pll_tracking.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/tracking/adapters/glonass_l1_ca_dll_pll_tracking.h)  
      - `GlonassL1CaDllPllCAidTrackingTest`: set of test cases for [glonass_l1_ca_dll_pll_c_aid_tracking.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/tracking/adapters/glonass_l1_ca_dll_pll_tracking.h)
      - `GalileoE5aTrackingTest`: set of test cases for [galileo_e5a_dll_pll_tracking.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/tracking/adapters/galileo_e5a_dll_pll_tracking.h)    
      - `TrackingLoopFilterTest`: set of test cases for [tracking_loop_filter.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/tracking/libs/tracking_loop_filter.h)

 * Telemetry Decoder
      - `Galileo_FNAV_INAV_test`: set of test cases for [galileo_inav_message.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/core/system_parameters/galileo_inav_message.h) and [galileo_fnav_message.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/core/system_parameters/galileo_fnav_message.h)

 * Observables
      - -

 * PVT
      - `RinexPrinterTest`: set of test cases for [rinex_printer.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/PVT/libs/rinex_printer.h)
      - `RtcmTest`: set of test cases for [rtcm.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/PVT/libs/rtcm.h)
      - `RtcmPrinterTest`: set of test cases for [rtcm_printer.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/PVT/libs/rtcm_printer.h)

 * System parameters:
     - `GlonassGnavEphemerisTest`: set of test cases for [glonass_gnav_ephemeris.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/core/system_parameters/glonass_gnav_ephemeris.h)
     - `GlonassGnavNavigationMessageTest`: set of test cases for [glonass_gnav_navigation_message.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/core/system_parameters/glonass_gnav_navigation_message.h)

## Extra Unit Tests

This option builds some extra unit test cases that require external tools not
included in the GNSS-SDR source tree. It can be activated by:

```console
$ cmake -DENABLE_UNIT_TESTING_EXTRA=ON ..
$ make
```

This option will download, build and link (at building time) the following tools
and files:

 * A basic software-defined GNSS signal generator based on
 [gps-sdr-sim](https://github.com/osqzss/gps-sdr-sim) and available at
 [https://bitbucket.org/jarribas/gnss-simulator](https://bitbucket.org/jarribas/gnss-simulator),
 which includes some sample RINEX and trajectory (.csv) files used by optional
 tests.
 * The [GPSTk project](https://github.com/SGL-UT/GPSTk), an open-source library
 and suite of applications for the satellite navigation community. GPSTk is
 sponsored by the [Space and Geophysics
 Laboratory](https://www.arlut.utexas.edu/sgl.shtml), within the [Applied
 Research Laboratories](https://www.arlut.utexas.edu/) at the [University of
 Texas at Austin](https://www.utexas.edu) (ARL:UT). GPSTk is the by-product of
 GPS research conducted at ARL:UT since before the first satellite launched in
 1978; it is the combined effort of many software engineers and scientists. In
 2003, the research staff at ARL:UT decided to open-source much of their basic
 GNSS processing software as the GPSTk. The source code is currently available
 from [https://github.com/SGL-UT/GPSTk](https://github.com/SGL-UT/GPSTk).
 * It downloads `gps_l2c_m_prn7_5msps.dat` and
 `Glonass_L1_CA_SIM_Fs_62Msps_4ms.dat`, files containing raw GNSS signal samples
 that are used by some tests as input data.


The following Unit Test Suites are added to the executable `run_tests`:

**Extra Unit Tests for Acquisition blocks**

  * `GpsL2MPcpsAcquisitionTest`: set of test cases for
  [gps_l2_m_pcps_acquisition.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/acquisition/adapters/gps_l2_m_pcps_acquisition.h)
  that make use of the `gps_l2c_m_prn7_5msps.dat` raw sample file downloaded
  with the `ENABLE_UNIT_TESTING_EXTRA=ON` option.

  * `GlonassL1CaPcpsAcquisitionTest`: set of test cases for
  [glonass_l1_ca_pcps_acquisition.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/acquisition/adapters/glonass_l1_ca_pcps_acquisition.h)
  that make use of the `Glonass_L1_CA_SIM_Fs_62Msps_4ms.dat` raw sample file
  downloaded with the `ENABLE_UNIT_TESTING_EXTRA=ON` option.

### `AcquisitionPerformanceTest`

This test computes the Receiver Operation Characteristic (ROC), that is,
Probability of detection vs Probability of false alarm, generated by an
Acquisition block. This test accepts the following flags:

|----------
|  **Flag**  |  **Default value** | **Description** |
|:--|:-:|:--|
| `--acq_test_implementation` | `GPS_L1_CA_PCPS_Acquisition` | Acquisition block implementation under test. Alternatives: `GPS_L1_CA_PCPS_Acquisition`, `GPS_L1_CA_PCPS_Acquisition_Fine_Doppler`, `Galileo_E1_PCPS_Ambiguous_Acquisition`, `GLONASS_L1_CA_PCPS_Acquisition`, `GLONASS_L2_CA_PCPS_Acquisition`, `GPS_L2_M_PCPS_Acquisition`, `Galileo_E5a_Pcps_Acquisition`, `GPS_L5i_PCPS_Acquisition`. |
| `--fs_gen_sps` | `2600000` | Sampling rate, in Samples/s. |
| `--config_file_ptest` | empty | File containing alternative configuration parameters for the acquisition performance test. |
| `--acq_test_input_file` | empty | File containing raw signal data, must be in int8_t format. If set, the signal generator will not be used and no CN0 sweep will be done. |
| `--acq_test_doppler_max` | `5000` | Maximum Doppler, in Hz |
| `--acq_test_doppler_step` | `125` | Doppler step, in Hz. |
| `--acq_test_coherent_time_ms` | `1` | Acquisition coherent time, in ms. |
| `--acq_test_max_dwells` | `1` | Number of non-coherent integrations. |
| `--acq_test_make_two_steps` | `false` | Perform second step in a thinner grid. |
| `--acq_test_second_nbins` | `4` | If `--acq_test_make_two_steps` is set to `true`, this parameter sets the number of bins done in the acquisition refinement stage. |
| `--acq_test_second_doppler_step` | `10` | If `--acq_test_make_two_steps` is set to true, this parameter sets the Doppler step applied in the acquisition refinement stage, in Hz. |
| `--acq_test_bit_transition_flag` | `false` | Bit transition flag. |
| `--acq_test_signal_duration_s` | `2` | Generated signal duration, in s. |
| `--acq_test_num_meas` | `0` | Number of measurements per run. 0 means the complete file. |
| `--acq_test_cn0_init` | `30.0` | Initial CN0, in dBHz. |
| `--acq_test_cn0_final` | `45.0` | Final CN0, in dBHz. |
| `--acq_test_cn0_step` | `3.0` | CN0 step, in dB. |
| `--acq_test_threshold_init` | `3.0` | Initial acquisition threshold. |
| `--acq_test_threshold_final` | `4.0` | Final acquisition threshold. |
| `--acq_test_threshold_step` | `0.5` | Acquisition threshold step. |
| `--acq_test_pfa_init` | `1e-5` | Set initial threshold via probability of false alarm. To disable Pfa setting and set threshold values, set this to `-1.0`. |
| `--acq_test_skiphead` | `0` | Number of samples to skip in the input file. |
| `--acq_test_PRN` | `1` | PRN number of a present satellite. |
| `--acq_test_fake_PRN` | `33` | PRN number of a non-present satellite. |
| `--acq_test_iterations` | `1` | Number of iterations (same signal, different noise realization). |
| `--plot_acq_test` | `false` | Plots results with gnuplot, if available. |
| `--show_plots` | `true` | Shows plots on screen. Set it to `false` for non-interactive testing. |
|--------------


**Extra Unit Tests for Tracking blocks**

  * `GpsL1CADllPllTrackingTest`: set of test cases for
  [gps_l1_ca_dll_pll_tracking.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/tracking/adapters/gps_l1_ca_dll_pll_tracking.h)
  that make use of the software-defined signal generator. This test plots the
  correlators' outputs with the flag `--plot_gps_l1_tracking_test`. For long
  tests, data can be decimated with the flag `--plot_decimate`. For not showing
  the plots in the screen, but still get the figures in PDF and PS file formats,
  use `--noshow_plots`. Example:
    ```console
    $ ./run_tests --gtest_filter=GpsL1CADllPllTrackingTest* --plot_gps_l1_tracking_test --plot_decimate=10
    ```

  * `GpsL1CAKfTrackingTest`: set of test cases for
  [gps_l1_ca_kf_tracking.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/tracking/adapters/)
  that make use of the software-defined signal generator. This test plots the
  correlators' outputs with the flag `--plot_gps_l1_kf_tracking_test`. For long
  tests, data can be decimated with the flag `--plot_decimate`. For not showing
  the plots in the screen, but still get the figures in PDF and PS file formats,
  use `--noshow_plots`. Example:
    ```console
    $ ./run_tests --gtest_filter=GpsL1CAKfTrackingTest* --plot_gps_l1_kf_tracking_test --plot_decimate=10
    ```

  * `GpsL2MDllPllTrackingTest`: set of test cases for
  [gps_l2_m_dll_pll_tracking.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/tracking/adapters/gps_l2_m_dll_pll_tracking.h)
  that make use of the `gps_l2c_m_prn7_5msps.dat` raw sample file downloaded
  with the `ENABLE_UNIT_TESTING_EXTRA=ON` option.


### `TrackingPullInTest`

Tracking pull-in test for several Tracking block implementations. It can make
use of the software-defined signal generator to produce GPS L1 CA signals at
different CN0 levels and to obtain the true synchronization parameters, or to
use an external file with any of the supported GNSS signals. The test performs a
two-dimensional sweep of Doppler errors and code delay errors for each CN0 to
emulate an imperfect signal acquisition in the pull-in tracking step. The test
output is a 2D grid plot showing those combinations of Doppler and Code delay
errors that produced a valid tracking (green dots) and those that produced a
loss of lock (black dots). The criterium to decide a valid tracking is a correct
CRC in the demodulation of the navigation message. Example:

```console
$ ./run_tests --gtest_filter=TrackingPullInTest* --plot_detail_level=0 --duration=4 --CN0_dBHz_start=45 CN0_dBHz_stop=35
```

This test accepts the following flags:

|----------
|  **Flag**  |  **Default value** | **Description** |
|:--|:-:|:--|
| `--trk_test_implementation` | `GPS_L1_CA_DLL_PLL_Tracking` | Tracking block implementation under test. |
| `--fs_gen_sps` | `2600000` | Sampling rate, in Samples/s. |
| `--enable_external_signal_file` | `false` | Use an external signal file capture instead of the software-defined signal generator. NOTICE: when an external file is selected, the test will try to perform a high sensitivity acquisition with an enhanced Doppler estimation to estimate the *true* signal synchronization parameters for all the satellites present in the signal. |
| `--signal_file` | `signal_out.bin` | Path of the external signal capture file, must be in int8_t format. If set, the signal generator will not be used and no CN0 sweep will be done. |
| `--disable_generator` | `false` | Disable the signal generator (the pre-generated signal file set must be available for the test, i.e. by running the test without disabling the generator previously). |
| `--duration` | `100` | Duration of the experiment [in seconds, max = 300]. For this test, the recommended signal duration is 4 seconds. |
| `--test_satellite_PRN` | `1` | PRN of the satellite under test (must be visible during the observation time). |
| `--acq_Doppler_error_hz_start` | `1000` | Acquisition Doppler error start sweep value [Hz]. |
| `--acq_Doppler_error_hz_stop` | `-1000` | Acquisition Doppler error stop sweep value [Hz]. |
| `--acq_Doppler_error_hz_step` | `-50` | Acquisition Doppler error sweep step value [Hz]. |
| `--acq_Delay_error_chips_start` | `2.0` | Acquisition Code Delay error start sweep value [chips]. |
| `--acq_Delay_error_chips_stop` |  `-2.0` | Acquisition Code Delay error stop sweep value [chips]. |
| `--acq_Delay_error_chips_step` | `-0.1` | Acquisition Code Delay error sweep step value [chips]. |
| `--PLL_bw_hz_start` | `40.0` | PLL Wide configuration value [Hz]. |
| `--DLL_bw_hz_start` | `1.5` | DLL Wide configuration value [Hz]. |
| `--extend_correlation_symbols` | `1` | Set the tracking coherent correlation to N symbols (up to 20 for GPS L1 C/A). |
| `--PLL_narrow_bw_hz` | `5.0` | PLL Narrow configuration value [Hz]. |
| `--DLL_narrow_bw_hz` | `0.75` | DLL Narrow configuration value [Hz]. |
| `--CN0_dBHz_start` | (noise disabled) | Enable noise generator and set the CN0 start sweep value [dB-Hz]. |
| `--CN0_dBHz_stop` | (noise disabled) | Enable noise generator and set the CN0 stop sweep value [dB-Hz]. |
| `--CN0_dB_step` | `3.0` | Noise generator CN0 sweep step value [dB]. |
| `--acq_to_trk_delay_s` | `0.0` | Acquisition to Tracking delay value [s] |
| `--plot_detail_level` | `0` | Specify the desired plot detail (0,1,2): 0 - Minimum plots (default) 2 - Plot all tracking parameters. |
| `--show_plots` | `true` | Shows plots on screen. Set it to `false` for non-interactive testing. |
|--------------



**Extra Unit Tests for Telemetry Decoder blocks**

  * `GpsL1CATelemetryDecoderTest`: set of test cases for
  [gps_l1_ca_telemetry_decoder.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/telemetry_decoder/adapters/gps_l1_ca_telemetry_decoder.h)
  that make use of the software-defined signal generator.

**Extra Unit Tests for Observables blocks**

### `HybridObservablesTest`

Unit test for
[hybrid_observables.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/observables/adapters/hybrid_observables.h)
that makes use of the software-defined signal generator or an external file.
This test accepts the following flags:

|----------
|  **Flag**  |  **Default value** | **Description** |
|:--|:-:|:--|
| `--fs_gen_sps` | `2600000` | Sampling rate, in Samples/s. |
| `--disable_generator` | `false` | Disable the signal generator (the pre-generated signal file set must be available for the test, i.e. by running the test without disabling the generator previously). |
| `--duration` | `100` | Duration of the experiment [in seconds, max = 300]. |
| `--enable_external_signal_file` | `false` | Use an external signal file capture instead of the software-defined signal generator. |
| `--signal_file` | `signal_out.bin` | Path of the external signal capture file, must be in int8_t format. If set, the signal generator will not be used. |
| `--static_position` | `30.286502,120.032669,100` | Static receiver position [lat,log,height]. |
| `--dynamic_position` | empty | Observer positions file, in .csv or .nmea format. |
| `--rinex_nav_file` | `brdc3540.14n` | Input RINEX navigation file. |
| `--filename_rinex_obs` | `sim.16o` | Filename of output RINEX navigation file. |
| `--filename_raw_data` |  `signal_out.bin` | Filename of output raw data file. |
| `--test_satellite_PRN_list` | `1,2,3,6,9,10,12,17,20,23,28` | List of PRN of the satellites under test (must be visible during the observation time). |
| `--external_signal_acquisition_dwells` | `5` | Maximum dwells count for satellite acquisition when an external file is used. |
| `--external_signal_acquisition_doppler_max_hz` | `5000.0` | Doppler max for satellite acquisition when an external file is used, in Hz. |
| `--external_signal_acquisition_doppler_step_hz` |  `125` | Doppler step for satellite acquisition when an external file is used, in Hz. |
| `--external_signal_acquisition_threshold` | `2.5` | Threshold for satellite acquisition when an external file is used. |
| `--trk_test_implementation` | `GPS_L1_CA_DLL_PLL_Tracking` | Tracking block implementation under test. |
| `--PLL_bw_hz_start` | `40.0` | PLL Wide configuration value [Hz]. |
| `--DLL_bw_hz_start` | `1.5` | DLL Wide configuration value [Hz]. |
| `--extend_correlation_symbols` | `1` | Set the tracking coherent correlation to N symbols (up to 20 for GPS L1 C/A). |
| `--PLL_narrow_bw_hz` | `5.0` | PLL Narrow configuration value [Hz]. |
| `--DLL_narrow_bw_hz` | `0.75` | DLL Narrow configuration value [Hz]. |
| `--skip_samples` | `0` | Skip an initial transitory in the processed signal file capture [samples]. |
| `--skip_obs_transitory_s` | `30.0` | Skip the initial observable outputs to avoid transitory results [s]. |
| `--compute_single_diffs` | `false` | Compute also the single difference errors for Accumulated Carrier Phase and Carrier Doppler (requires LO synchronization between receivers). |
| `--compare_with_5X` | `false` | Compare the E5a Doppler and Carrier Phases with the E5 full bw in RINEX (expect discrepancy due to the center frequencies differences). |
| `--show_plots` | `true` | Shows plots on screen. Set it to `false` for non-interactive testing. |
|--------------


## System Tests

This option builds some extra system test programs that require external tools
not included in the GNSS-SDR source tree. It can be activated by:

```console
$ cmake -DENABLE_SYSTEM_TESTING=ON ..
$ make
```

This option generates the following system test program:

### `ttff`

This test program computes the Time-To-First-Fix (TTFF), as defined [here]({{
"/design-forces/availability/#time-to-first-fix-ttff" | relative_url }}). The
TTFF indicator provides a measurement of the time required for a static receiver
to provide a valid position fix after the receiver is started. This program
accepts the following command-line flags:

|----------
|  **Flag**  |  **Default value** | **Description** |
|:--|:-:|:--|
| `--fs_in` | `4000000` | Sampling rate, in Samples/s. |
| `--max_measurement_duration` | `90` | Maximum time waiting for a position fix, in seconds. |
| `--num_measurements` | `2` | Number of measurements (M). |
| `--device_address` | `192.168.40.2` | USRP device IP address. |
| `--subdevice` | `A:0` | USRP subdevice. |
| `--config_file_ttff` | empty | File containing the configuration parameters for the TTFF test. |
|--------------

For TTFF measurements, it makes sense to use real-life GNSS signals. Just
prepare a configuration file according to your hardware setup and pass it to the
receiver with the `--config_file_ttff` file, in the same way that you invoke
`gnss-sdr` with `--config_file`.

Each TTFF sample is computed as the time interval starting with the invocation
of the receiver's executable and ending with the first valid navigation data
point derived from live or simulated satellite signals. The start times of the
test samples are not synchronized to any UTC time boundary and they should be
randomly spread within the 24 hour UTC day and within the GNSS data collection
interval. The program starts the receiver, processes the signal until the first
fix, and then annotates the elapsed time, shuts down the receiver, waits for a
random number of seconds (from 5 to 30 s), and starts the receiver again. This
is done a total of M times, and this number can be controlled by the
`--num_measurements` flag.

So an example of running this test could be:

```console
$ ./ttff --config_file_ttff=my_GPS_rx.conf --num_measurements=50
```


The results of the experiment are reported as follows:

|----------
|  **Reported parameter**  |  **Description** |
|:-:|:--|
|--------------
| **Mean TTFF** | Average of the $$ L $$ obtained valid measurements, computed as $$ \frac{1}{L}\sum_{j=1}^L TTFF_j $$. Units: seconds. |
| **Max TTFF**  | Maximum of the obtained valid measurements. Units: seconds |
| **Min TTFF**  | Minimum of the obtained valid measurements. Units: seconds |
| **Sample Dev / Size** |  The standard deviation of the sample set is computed as $$ \sigma_{TTFF} = \sqrt{\frac{1}{L-1}\sum_{i=1}^L \left( TTFF_i - \frac{1}{L}\sum_{j=1}^L TTFF_j \right)^2 } $$, in seconds. / Number of valid measurements (L) over the total number of measurements (M), expressed as (L of M). |
| **Init. status** | [`cold`, `warm`, `hot`]: Initial receiver status, as defined [here]({{ "/design-forces/availability/#time-to-first-fix-ttff" | relative_url }}).  |
| **Nav. mode** | [`2D`, `3D`]: `3D` Navigation mode in which at least four satellite signals are received and are used to compute positioning data containing as a minimum: time-tagged latitude, longitude, and altitude referenced to a given coordinate system.  / `2D` Navigation mode in which no fewer than three satellite signals and fixed altitude are received and used to compute positioning data containing as a minimum: time-tagged latitude, longitude, and fixed altitude referenced to a given system.    |
| **DGNSS**  | [`Y`, `N`]: `Y` if an external system is providing ephemeris data, `N` if the receiver is not receiving external information. |
| **Signal** | Targeted GNSS signal(s) during the test. |
| **Source** | [`Live`, `Sim`, `File`]: `Live` for GNSS signals from space, `Sim` for or simulated GNSS signals generated at RF, `File` for a pre-defined set of signal inputs, stored in files. |
| **Processing platform** | Brand and model of the processing platform performing the test. |
| **Operating system** | Brand and release of the operating system in which the software receiver undergoing the test was executed. |
| **Source code unique ID** | Software release version, D.O.I., Git hash, or any other unique identifier. |
|--------------


## Extra System Tests

This option builds some extra system test programs that require external tools
not included in the GNSS-SDR source tree. It can be activated by:

```console
$ cmake -DENABLE_SYSTEM_TESTING_EXTRA=ON ..
$ make
```

As in the case of the `-DENABLE_UNIT_TESTING_EXTRA=ON`, this option will also
download, build and link the software-defined GNSS signal generator and the
GPSTk library.

This option generates the following system test program:

### `position_test`

This test program computes metrics of static accuracy and precision. It can use
either a software-defined signal generator (GPS L1 only) or accept any other
receiver configuration obtaining PVT fixes. It accepts the following
command-line flags:

|----------
|  **Flag**  |  **Default value** | **Description** |
|:--|:-:|:--|
| `--rinex_nav_file` | `brdc3540.14n` | Input RINEX navigation file |
| `--filename_rinex_obs` | `sim.16o` | Filename of output RINEX navigation file. |
| `--filename_raw_data` | `signal_out.bin` | Filename of raw signal samples file (internally generated by software). |
| `--static_position` | `30.286502,120.032669,100` | Static receiver position [lat,log,height] |
| `--disable_generator` | `false` | If set to `true`, it disables the signal generator (so an external raw signal file must be available for the test). |
| `--duration` | `100` | Duration of the experiment [in seconds, max = $$ 300 $$]. |
| `--num_channels` | `11` | Number of channels in the default configuration. |
| `--config_file_ptest` | empty | File containing the configuration parameters for the position test. |
| `--static_scenario` | `true` | Compute figures of merit for static user position (DRMS, CEP, etc.). |
| `--use_ref_motion_file` | `false` | Enable or disable the use of a reference file containing the true receiver position, velocity, and acceleration. |
| `--ref_motion_file_type` | `1` | Type of reference motion file. 1: Spirent CSV motion file |
| `--ref_motion_filename` | `motion.csv` | Path and filename for the reference motion file. |
| `--static_2D_error_m` | `2.0` | Static scenario 2D (East, North) positioning error bias threshold [meters]. |
| `--static_3D_error_m` | `5.0` | Static scenario 3D (East, North, Up) positioning error bias threshold [meters]. |
| `--accuracy_CEP` | `2.0` | Static scenario 2D (East, North) accuracy Circular Error Position (CEP) threshold [meters]. |
| `--precision_SEP` | `10.0` | Static scenario 3D (East, North, Up) precision Spherical Error Position (SEP) threshold [meters]. |
| `--dynamic_3D_position_RMSE` | `10.0` | Dynamic scenario 3D (ECEF) accuracy RMSE threshold [meters] |
| `--dynamic_3D_velocity_RMSE` | `5.0` | Dynamic scenario 3D (ECEF) velocity accuracy RMSE threshold [meters/second] |
| `--pvt_solver_dump_filename` | `PVT.dat` | Path and filename for the PVT solver binary dump file |
| `--plot_position_test` | `false` | If set to `true`, and [Gnuplot](http://www.gnuplot.info/) is installed in your system, it generates some plots of the obtained results. It will display them in windows and will save them as .ps and .pdf files. |
| `--show_plots` | `true` | Show plots on screen. Set it to `false` for non-interactive testing. |
|----------



So an example of running this test could be:

```console
$ ./position_test
```

By default, the program triggers a software-defined GPS L1 C/A signal generator,
which takes the default RINEX navigation file (brdc3540.14n, already included in
the files automatically downloaded by CMake's `-DENABLE_SYSTEM_TESTING_EXTRA=ON`
option) and the default reference location (longitude $$30.286502^o $$, latitude
$$ 120.032669^o $$, height $$ 100 $$ m), and generates a RINEX observation file
and a raw signal sample file, with a duration of $$ 100 $$ s. Then, it triggers
the software receiver and processes such raw data file. At the end of the
processing, the program reports several metrics for accuracy and precision.
Since the generation of the raw samples file only needs to be executed once, the
next time you execute this program, the generation can be skipped by:

```console
$ ./position_test --disable_generator
```

If you have [Gnuplot](http://www.gnuplot.info/) installed in your system, you
can get some plots by adding the flag `--plot_position_test`:


```console
$ ./position_test --plot_position_test
```

You can use your own configuration file:

```console
$ ./position_test --config_file_ptest=my_GPS_rx.conf --static_position="0.000000,000000,0"
```

changing "0.000000,000000,0" by your reference longitude, latitude, and height
(expressed in WGS-84 coordinates). In case of processing live data, please
remember to terminate the receiver execution with key `q` and then `[Enter]`.


When the software receiver terminates, the program reports [accuracy]({{
"/design-forces/accuracy/" | relative_url }}) and [precision]({{
"/design-forces/repeatability/" | relative_url }}) metrics for 2D and 3D
positioning, expressed in a local ENU (East-North-Up) reference frame and
defined as:

|----------
|  **Measure**  |  **Formula** | **Confidence region probability** | **Definition** |
|:-:|:-:|:-:|:--|  
|--------------
|  **2DRMS** | $$ 2\sqrt{\sigma_E^2+\sigma_N^2} $$ | 95 % | Twice the DRMS of the horizontal position errors, defining the radius of a circle centered at the true position, containing the horizontal position estimate with a probability of 95 %. |
|  **DRMS**  | $$ \sqrt{\sigma_E^2+\sigma_N^2} $$  | 65 % | The square root of the average of the squared horizontal position errors, defining the radius of a circle centered at the true position, containing the horizontal position estimate with a probability of 65 %. |
|  **CEP**   | $$ 0.62\sigma_N+0.56\sigma_E $$, accurate if $$ \frac{\sigma_N}{\sigma_E}>0.3 $$ | 50 % | The radius of a circle centered at the true position, containing the horizontal position estimate with a probability of 50 %. |
|  **99 % Spherical Accuracy Standard** | $$ 1.122 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 99 % | The radius of a sphere centered at the true position, containing the position estimate in 3D with a probability of 99 %  |
|  **90 % Spherical Accuracy Standard** | $$ 0.833 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 90 % | The radius of a sphere centered at the true position, containing the position estimate in 3D with a probability of 90 %  |
|  **MRSE**  | $$ \sqrt{\sigma_E^2+\sigma_N^2+\sigma_U^2} $$ | 61 % | The radius of a sphere centered at the true position, containing the position estimate in 3D with a probability of 61 % |
|  **SEP**   | $$ 0.51 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 50 % | The radius of a sphere centered at the true position, containing the position estimate in 3D with a probability of 50 % |
|-----

For accuracy measurements, the standard deviation of the error in the three
local coordinates (in m) are computed as:

$$ \sigma_E^{(\text{static accuracy})} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(E[l]- E_{ref}\right)^2}~, $$

$$ \sigma_N^{(\text{static accuracy})} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(N[l]- N_{ref}\right)^2}~, $$

$$ \sigma_U^{(\text{static accuracy})} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(U[l]- U_{ref}\right)^2}~, $$

with $$ E_{ref} $$, $$ N_{ref} $$ and $$ U_{ref} $$ are the East, North and Up
coordinates of the reference location, respectively.

In case of precision measurements:

$$ \sigma_{E}^{(precision)} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(E[l]- \hat{E}\right)^2}~, $$

$$ \sigma_{N}^{(precision)} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(N[l]- \hat{N}\right)^2}~, $$

$$ \sigma_{U}^{(precision)} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(U[l]- \hat{U}\right)^2}~, $$

where $$ \hat{E} = \frac{1}{L}\sum_{l=1}^{L}E[l] $$,
$$ \hat{N} = \frac{1}{L}\sum_{l=1}^{L}N[l] $$, and
$$ \hat{U} = \frac{1}{L}\sum_{l=1}^{L}U[l] $$.

&nbsp;

# How to write a new test

Tests behave very much like system "clients": unit tests imitate the behavior of
a corresponding client-class or classes invoking target class methods, and
system tests imitate the user behavior. Thinking about how to test a class
_before_ actually writing it helps developers to focus on what really matters
and to design better interfaces. In other words, it enforces Design for
Testability.

The Google C++ Testing Framework provides an implementation of all those testing
concepts described in the [TDD process]({{
"/docs/tutorials/testing-software-receiver/#test-driven-development" |
relative_url }}), allowing developers to concentrate on the testing code.

In order to create a new test:

 1. Use the `TEST()` macro to define and name a test case. These are ordinary
 C++ functions that do not return a value.
 2. In this function, along with any valid C++ statements you want to include,
 use the various Google Test assertions to check values.
 3. The test's result is determined by the assertions; if any assertion in the
 test fails (either fatally or non-fatally), or if the test crashes, the entire
 test fails. Otherwise, it succeeds.

```cpp
TEST(test_suite_name, test_case_name)
{
    ... test body ...
}
```
{: class="no-copy"}

An example of this would be:

```cpp
#include <gtest/gtest.h>  // Include Google Test headers
#include "rtcm.h"         // Include header under test

TEST(RtcmTest, HexToInt)  // RtcmTest is the name of the Test Suite
                          // HexToInt is the name of this Test Case
{
    auto rtcm = std::make_shared<Rtcm>();  
    std::string test1 = "2A";
    long int test1_int = rtcm->hex_to_int(test1);
    long int expected1 = 42;
    EXPECT_EQ(expected1, test1_int);
}
```

This test constructs an object called `rtcm` of class `Rtcm` (defined in
[rtcm.h](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/algorithms/PVT/libs/rtcm.h))
and wraps it into a shared pointer that will deallocate memory at the end of the
test. Then, it tests the class member function `hex_to_int` and evaluates the
result in an assertion, checking that the obtained result is actually the
expected one.

For more details about the usage of the Google C++ Testing Framework and its
available features, please check out its [User's Guide](https://google.github.io/googletest/):

 * [Primer](https://google.github.io/googletest/primer.html) -- start here if you are new to googletest.
 * [Advanced Topics](https://google.github.io/googletest/advanced.html) -- learn some new tricks.
 * [Frequently-Asked Questions](https://google.github.io/googletest/faq.html) -- maybe your question is answered here.


The existing tests are also a source of examples on how to write tests. Please
place your testing code in an adequate folder from the GNSS-SDR source tree:

```
├── src
│   ├── tests
│   │   ├── CMakeLists.txt
│   │   ├── common-files
│   │   ├── data
│   │   ├── signal_samples
│   │   ├── single_test_main.cc
│   │   ├── system-tests
│   │   ├── test_main.cc
│   │   └── unit-tests
│   │       ├── arithmetic
│   │       ├── control-plane
│   │       └── signal-processing-blocks
│   │           ├── acquisition
│   │           ├── adapter
│   │           ├── filter
│   │           ├── libs
│   │           ├── observables
│   │           ├── pvt
│   │           ├── resampler
│   │           ├── sources
│   │           ├── telemetry_decoder
│   │           └── tracking
```
{: class="no-copy"}

Once the test code is written, you need to build and link it against the Google
Test library. This process is managed in the file
[gnss-sdr/src/tests/CMakeLists.txt](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/tests/CMakeLists.txt).
You will need to list your new test in the appropriate place in order to include
it in the building:

 * If your test is a Unit Test, please `#include` it in the file
 [gnss-sdr/src/tests/test_main.cc](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/tests/test_main.cc)
 and rebuild the source code. It should be getting included in the test program
 `run_tests`.

 * If your test is a System Test, please modify accordingly the file
 [gnss-sdr/src/tests/CMakeLists.txt](https://github.com/gnss-sdr/gnss-sdr/blob/next/src/tests/CMakeLists.txt)
 to define a new target and then rebuild the source code to get the new
 executable.


At the end of the building, we should be able to run your new test. In the
example provided above, this would be:

```console
$ ./run_tests --gtest_filter=RtcmTest.HexToInt*
```

with the following output:

```
Running GNSS-SDR Tests...
Note: Google Test filter = RtcmTest.HexToInt*
[==========] Running 1 test from 1 test suite.
[----------] Global test environment set-up.
[----------] 1 test from RtcmTest
[ RUN      ] RtcmTest.HexToInt
[       OK ] RtcmTest.HexToInt (1 ms)
[----------] 1 test from RtcmTest (1 ms total)

[----------] Global test environment tear-down
[==========] 1 test from 1 test suite ran. (2 ms total)
[  PASSED  ] 1 test.
```
{: class="no-copy"}

&nbsp;

Happy testing!

------

---
title: "Testing the software receiver"
permalink: /docs/tutorials/testing-software-receiver/
excerpt: "Software testing concepts and their implementation in GNSS-SDR."
author_profile: false
header:
  teaser: /assets/images/PDCA.png
tags:
  - tutorial
  - Git
sidebar:
  nav: "docs"
last_modified_at: 2017-06-23T09:37:02+02:00
---

{% include toc %}

Testing is a concept intimately related to inquiry, creativity, design, methodology, tools, best practices and, ultimately, quality. People from Design Thinking[^Plattner11]$$ ^, $$[^Cross11] understand testing in the sense of prototyping, of trying out something that could be useful for someone else whose needs we have empathized with, and as a source of innovation.  People from Quality Assurance[^Beck02]$$ ^, $$[^IEEE730] understand testing as the detailed procedure that leads to a pass/fail decision based upon some pre-defined requirements. A <strike>humble</strike>distinguished developer just wants to know if his or her code works as expected.  Hence, it is important to recognize that _the code developed to test the functionality of a given piece of source code is as valuable as the implementation itself_, constituting an inalienable part of the project's source code tree. This page provides an overview on the philosophy behind the approach undertaken by the GNSS-SDR project, it documents the currently available testing procedures, and describes how to add new ones.

# The Science of Improvement

Improvement has meaning only in terms of observation based on a given criteria. That is, improvement is useful and has meaning when it is defined by characteristics such as more efficient, more accurate, more reliable, and so on. Thus, we need to identify the dimensions (or _design forces_) in which a software-defined GNSS receiver can be improved, and to define adequate metrics, measurement procedures and feedback mechanisms for each of those dimensions, in order to objectively assess improvement.

A proposal of an open discussion about the definition of quality metrics and testing procedures for _any_ software-defined GNSS receiver is available at [**16 Design Forces for software-defined GNSS receivers**]({{ "/design-forces/" | absolute_url }}). Based on that taxonomy, this page describes GNSS-SDR's particular approach and implementation.
{: .notice--info}

The concepts of improvement and change are strongly connected. Although change will not always result in improvement, all improvement requires change.

Langley _et al._[^Langley09] described the principles to maximize the results of improvement efforts as:

  * Knowing why you need to improve (focused aim).
  * Having a feedback mechanism to tell you if improvements are occurring.
  * Developing effective ideas for changes that will result in improvement.
  * Testing and adapting changes before attempting to implement.
  * Knowing when and how to make changes sustainable through effective implementation to integrate the changes in the system of interest.

It is then of the utmost importance to define a development methodology and adequate tools to measure improvement and to integrate changes into the system in a transparent, controlled and distributed fashion.

Authors in Langley _et al._[^Langley09] claim that the Plan-Do-Study-Act (PDSA) cycles constitute an approach that is aligned with the scientific method. Those cycles were made popular by W. E. Deming in the early 1950s as PDCA (Plan-Do-Check-Act), and at a later stage the same author replaced "Check" by "Study" to emphasize the importance of observing and learning from the “Do” step results[^Deming93]. Those four steps are described as:

 * **PLAN**: Establish the objectives and processes necessary to deliver results in accordance with the expected output (the target or goals). By establishing output expectations, the completeness and accuracy of the spec is also a part of the targeted improvement. When possible start on a small scale to test possible effects.
 * **DO**: Implement the plan, execute the process, make the product. Collect data for charting and analysis in the following "CHECK" and "ACT" steps.
 * **CHECK**: Study the actual results (measured and collected in "DO" above) and compare against the expected results (targets or goals from the "PLAN") to ascertain any differences. Look for deviation in implementation from the plan and also look for the appropriateness and completeness of the plan to enable the execution, i.e., "DO". Emphasize the **STUDY** of the results: What did we learn? What went wrong?
 * **ACT**: If the "CHECK" shows that the "PLAN" that was implemented in "DO" is an improvement to the prior standard (baseline), then that becomes the new standard (baseline) for how the project should "ACT" going forward (new standards are enACTed). If the "CHECK" shows that the "PLAN" that was implemented in "DO" is not an improvement, then the existing standard (baseline) will remain in place.


![PDCA and Git]({{ "/assets/images/PDCA-Git.png" | absolute_url }})
_A graphical representation of Git and PDCA cycles integration_.
{: style="text-align: center;"}

As shown in the figure above, [Git](https://git-scm.com/){:target="_blank"} integrates PDCA cycles in the development process in a seamless and natural way. The PLAN step begins by creating a new branch of development from the current baseline (that is, the `next` branch). This new branch accommodates testing code for the new improvement, the actual new development work, and eventual test passing and code refactoring in the DO step. Then, CHECK/STUDY step is related to merging the new code with the existing baseline and run all the existing tests, in order to ensure that no integration issues arise. In the case they exist, there is a step back to the DO step and fix the integration issues. In the case that the taken approach in the particular PDCA cycle results in not contributing to an actual improvement, the development branch can be kept for documentation purposes without affecting the baseline. Once the developer has absolute confidence that the change is an objective improvement, he or she ACTs and pushes the change to the reference repository, and the new version incorporating the improvement becomes the new current baseline.

{% capture pdca_cycles %}
By engaging rapid cycles of the PDCA workflow, the GNSS-SDR project aims to learn fast, fail fast, and improve quickly. That failures may occur is not the problem; that we fail to learn from them is. Rate of change, that is, rate of improvement, is a key competitive factor in today's world. PDCA cycles allow for:
  * major "jumps" in performance ("breakthroughs," as the addition of a new GNSS signal receiver chain or an important new feature), which are very much appreciated in the Western culture,
  * as well as Kaizen (Japanese for “improvement”, frequent small improvements such as fixes enhancing correctness in the usage of the programming language, small bug fixes and typos, code cleaning and refactoring, small changes in the building system to extend portability, etc.), which is a key concept about quality deeply rooted in the Eastern culture.
{% endcapture %}

 <div class="notice--info">
   {{ pdca_cycles | markdownify }}
 </div>

This means that all kind of contributions, from fixing a typo in a source code's comment to the addition of a whole new GNSS signal processing chain, are very welcome and greatly appreciated since all of them point towards improved quality, no matter the step size. More details on the _howtos_ in the context of GNSS-SDR are available in our [Git tutorial]({{ "/docs/tutorials/using-git/" | absolute_url }}) and in the [CONTRIBUTING.md](https://github.com/gnss-sdr/gnss-sdr/blob/master/CONTRIBUTING.md){:target="_blank"} file.

# Test Driven Development

Test-driven development (TDD) is a software development process that relies on the repetition of a very short development cycle: first the developer writes an (initially failing) automated test case that defines a desired improvement or new function, then produces the minimum amount of code to pass that test, and finally refactors the new code to acceptable standards. It is an Agile-based approach to building complex systems where unit test (and in some cases inter-component integration tests) are built in advance of the product software and are used exercised upon component implementation. This methodology is claimed to offer valuable benefits to software development: it facilitates change, simplifies integration, automatizes documentation, helps separate the interface from the implementation, increases developers productivity, and plays a central role in the software quality assurance process[^Shore08].

![TDD lifecycle]({{ "/assets/images/TDD_Global_Lifecycle.png" | absolute_url }})
_A graphical representation of the Test-Driven Development lifecycle. Source: [Wikipedia](https://en.wikipedia.org/wiki/Test-driven_development){:target="_blank"}. Author: Xavier Pigeon_.
{: style="text-align: center;"}

A typical test-driven development cycle, as described by Beck[^Beck02], can be summarized as:

 1. **Add a test**: In test-driven development, each new feature begins with writing a test. To write a test, the developer must clearly understand the feature’s specification and requirements. This is a differentiating feature of test-driven development versus writing unit tests after the code is written: it makes the developer focus on the requirements before writing the code, a subtle but important difference.

 2. **Run all tests and see if the new one fails**: This validates that the test harness is working correctly, that the new test does not mistakenly pass without requiring any new code, and that the required feature does not already exist. This step also tests the test itself, in the negative: it rules out the possibility that the new test always passes, and therefore is worthless. The new test should also fail for the expected reason. This step increases the developer's confidence that the unit test is testing the correct constraint, and passes only in intended cases.

 3. **Write some code**: The next step is to write some code that causes the test to pass. The new code written at this stage is not perfect and may, for example, pass the test in an inelegant way. That is acceptable because it will be improved and honed in Step 5. At this point, the only purpose of the written code is to pass the test; no further (and therefore untested) functionality should be predicted nor 'allowed for' at any stage.

 4. **Run the automated tests and see them succeed**: If all test cases now pass, the programmer can be confident that the new code meets the test requirements, and does not break or degrade any existing features. If they do not, the new code must be adjusted until they do.

 5. **Refactor code**: The growing code base must be cleaned up regularly during test-driven development. New code can be moved from where it was convenient for passing a test to where it more logically belongs. Duplication must be removed, documentation added, inheritance hierarchies may be rearranged to be more logical and helpful, and perhaps to benefit from recognized design patterns, and adhere to a defined set of coding style rules. There are specific and general guidelines for refactoring and for creating clean code[^Beck99]. By continually re-running the test cases throughout each refactoring phase, the developer can be confident that process is not altering any existing functionality.

 6. **Repeat (go to step 1)**: Starting with another new test, the cycle is then repeated to push forward the functionality.


According to Beck[^Beck02], software tests must be:

 * **Easy to write for programmers**: Test tools that require unfamiliar environments or languages will be less likely to be used, even if they are technically superior.
 * **Easy to read for programmers**: The tests will be more valuable if they are readable, giving an interesting second perspective on the messages hidden in the source code.
 * **Quick to execute**: If the tests do not run fast, they will not get run. If they do not get run, they will not be valuable. If they are not valuable, they will not continue to be written.
 * **Order independent**: If one test breaks, we would like the other to succeed or fail independently.
 * **Deterministic**: Tests that run one time and do not run the next give negative information. The times they run you have unwarranted confidence in the system. This implies that TDD as described in this Deliverable is not suitable for the synchronization parts of multi-thread programming.
 * **Piecemeal**: We would like to be able to write the tests a few at a time.
 * **Composable**: We would like to be able to run tests in any combination.
 * **Versionable**: The source of the tests should play nicely with the rest of the source in the
system.
 * _**A priori**_: We should be able to write the tests before they can possibly run.
 * **Automatic**: The tests should run with no human intervention.


Software tests have some additional constraints and recommended patterns:

 * Tests must be expressed in ordinary source code.
 * The execution of each test is centered on an instance of a _Test Case_ object.
 * Each _Test Case_, before it executes the test, has the opportunity to create an environment for the test, and to destroy that environment when the test finishes.
 * Groups of tests can be collected together, and their results of running them all will be reported collectively.
 * Use of the language's exception handling mechanism to catch and report errors.


The key areas in which this approach can contribute are:

 * Definition of a flexible and durable software architecture.
 * A consistent and well-documented development process.
 * Manage overall problem space complexity.
 * Ease deployment and manage target environment complexity.
 * Direct facilitation of development team communication and coordination.

# The Testing Framework

GNSS-SDR uses the [Google C++ Testing Framework](https://github.com/google/googletest){:target="_blank"} (usually referred to as Google Test) for its testing code. This framework provides the following features:

 * **Tests should be independent and repeatable**. It is a pain to debug a test that succeeds or fails as a result of other tests. Google C++ Testing Framework isolates the tests by running each of them on a different object. When a test fails, Google C++ Testing Framework allows you to run it in isolation for quick debugging.
 * **Tests should be well organized and reflect the structure of the tested code**. Google C++ Testing Framework groups related tests into test cases that can share data and subroutines. This common pattern is easy to recognize and makes tests easy to maintain. Such consistency is especially helpful when people switch projects and start to work on a new code base.
 * **Tests should be portable and reusable**. The open-source community has a lot of code that is platform-neutral; its tests should also be platform-neutral. Google C++ Testing Framework works on different Operating Systems, with different compilers (gcc, llvm, and others), with or without exceptions, so Google C++ Testing Framework tests can easily work with a variety of configurations.
 * **When tests fail, they should provide as much information about the problem as possible**. Google C++ Testing Framework does not stop at the first test failure. Instead, it only stops the current test and continues with the next. You can also set up tests that report non-fatal failures after which the current test continues. Thus, you can detect and fix multiple bugs in a single run-edit-compile cycle.
 * **The testing framework should liberate test writers from housekeeping chores and let them focus on the test content**. Google C++ Testing Framework automatically keeps track of all tests defined, and does not require the user to enumerate them in order to run them.
 * **Tests should be fast**. With Google C++ Testing Framework, you can reuse shared resources across tests and pay for the set-up/tear-down only once, without making tests depend on each other.

When using Google Test, developers write [_assertions_](https://github.com/google/googletest/blob/master/googletest/docs/Primer.md#assertions){:target="_blank"}, which are statements that check whether a condition is true. An assertion's result can be _success_, _nonfatal failure_, or _fatal failure_. If a fatal failure occurs, it aborts the current function; otherwise the program continues normally.

_Tests_ use assertions to verify the tested code's behavior. If a test crashes or has a failed assertion, then it _<span style="color: #E74C3C">fails</span>_; otherwise it _<span style="color: #2ECC71">succeeds</span>_.

A _Test Case_ contains one or many tests. You should group your tests into test cases that reflect the structure of the tested code. When multiple tests in a test case need to share common objects and subroutines, you can put them into a [_Test Fixture_](https://github.com/google/googletest/blob/master/googletest/docs/Primer.md#test-fixtures-using-the-same-data-configuration-for-multiple-tests){:target="_blank"} class.

A _Test Program_ can contain multiple test cases.



# Running GNSS-SDR Tests

In order to execute the tests, you must build GNSS-SDR from source. If the Google C++ Testing Framework source code is not already present in your system (and pointing the `GTEST_DIR` environment variable to the root of the souce code tree or, on Debian-based GNU/Linux distributions, doing `sudo apt-get install libgtest-dev`), it will be automatically downloaded from its Git repository, compiled and linked to GNSS-SDR at building time. The CMake script automatizes all those steps for you.

GNSS-SDR are divided in two categories:

 * **Unit Tests**: checking of certain functions and areas - or _units_ - of the source code.
 * **System Tests**: checking conducted on a complete, integrated system to evaluate the system's compliance with its specified requirements.

By default, only (a large) subset of unit tests are compiled. So, when doing:

```
$ cd gnss-sdr/build
$ git checkout next
$ cmake ..
$ make
```

this process will end up generating some executables at the `gnss-sdr/install` folder. Among them, a test program called `run_tests`. This executable gathers all the available GNSS-SDR's unit tests. It can be run by doing:

```
$ cd ../install
$ ./run_tests
```

The output of this program should be similar to:

```

Running GNSS-SDR Tests...
[==========] Running 164 tests from 38 test cases.
[----------] Global test environment set-up.

...

[----------] Global test environment tear-down
[==========] 164 tests from 38 test cases ran. (69412 ms total)
[  PASSED  ] 164 tests.

```


Other unit and system tests require from external tools, libraries and data files not included in the GNSS-SDR's source tree. As in the case of the Google C++ Testing Framework source code, they can be automatically downloaded and built by passing the following option flags to CMake:

|----------
|  **Variable passed to CMake**  |  **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|
|--------------
| &#x2011;DENABLE_UNIT_TESTING | ON / OFF | ON  |  If set to OFF, it disables the building of unit tests. This can be useful in memory-limited systems. |
| &#x2011;DENABLE_UNIT_TESTING_EXTRA | ON / OFF | OFF  | If set to ON, it downloads external raw sample files files and other software tools (among them, [GPSTk](http://www.gpstk.org/){:target="_blank"}, if it is not already found in your system), and builds some extra unit tests that are added to the ```run_tests``` executable.  |
| &#x2011;DENABLE_SYSTEM_TESTING | ON / OFF |  OFF |  If set to ON, it builds system tests (each one with its own executable test program) at the ```gnss-sdr/install``` folder, unless otherwise indicated by the ENABLE_INSTALL_TESTS option.  |
| &#x2011;DENABLE_SYSTEM_TESTING_EXTRA | ON / OFF | OFF  | If set to ON, it downloads external software tools (among them, [GPSTk](http://www.gpstk.org/){:target="_blank"}, if it is not already found in your system) and builds some extra system tests. The generated binaries are copied to the ```gnss-sdr/install``` folder, unless otherwise indicated by the ENABLE_INSTALL_TESTS option. |
| &#x2011;DENABLE_OWN_GPSTK | ON / OFF |  OFF | If set to ON, it forces to download, build and link [GPSTk](http://www.gpstk.org/){:target="_blank"} for system tests, even if it is already installed. This can be useful if you have an old version of GPSTk (older than 2.9) already installed in your system and you do not want to remove it, but you still want the QA code to use a more recent version. |
| &#x2011;DENABLE_INSTALL_TESTS | ON / OFF | OFF | By default, generated test binaries are not installed system-wide but placed in the local folder ```gnss-sdr/install```. If this option is set to ON, test binaries and auxiliary files will not be copied to  ```gnss-sdr/install``` but installed in the system path when doing ```make install```.  |
|----------

Those extra tests are described below.

Tests programs generated with the Google C++ Testing Framework accepts a number of interesting commandline flags. Hereafer we describe some of the most relevant.

## Listing Tests names

Sometimes it is necessary to list the available tests in a program before running them so that a filter may be applied if needed. Including the flag `--gtest_list_tests` overrides all other flags and lists tests in the following format:

```
TestCase1.
  TestName1
  TestName2
TestCase2.
  TestName
```

So, running:

```
$ ./run_tests --gtest_list_tests
```

will get the currently available unit Test Cases and unit Test Names.

##  Running a Subset of the Tests

By default, a Google Test program runs all tests the user has defined. Sometimes, you want to run only a subset of the tests (e.g. for debugging or quickly verifying a change). If you set the `GTEST_FILTER` environment variable or the `--gtest_filter` flag to a filter string, Google Test will only run the tests whose full names (in the form of TestCaseName.TestName) match the filter.

The format of a filter is a '`:`'-separated list of wildcard patterns (called the positive patterns) optionally followed by a '`-`' and another '`:`'-separated pattern list (called the negative patterns). A test matches the filter if and only if it matches any of the positive patterns but does not match any of the negative patterns.

A pattern may contain '`*`' (matches any string) or '`?`' (matches any single character). For convenience, the filter '`*-NegativePatterns`' can be also written as '`-NegativePatterns`'.

For example:

 * `$ ./run_tests` Has no flag, and thus runs all its tests.
 * `$ ./run_tests --gtest_filter=*` Also runs everything, due to the single match-everything * value.
 * `$ ./run_tests --gtest_filter=GpsL1CaPcpsAcquisitionTest.*` Runs everything in test case GpsL1CaPcpsAcquisitionTest.
 * `$ ./run_tests --gtest_filter=*Gps*:*Acquisition*` Runs any test whose full name contains either "Gps" or "Acquisition".
 * `$ ./run_tests --gtest_filter=-*Acquisition*` Runs all non-Acquisition tests.
 * `$ ./run_tests --gtest_filter=GpsL1CaPcpsAcquisitionTest.*-GpsL1CaPcpsAcquisitionTest.ValidationOfResults` Runs everything in test case GpsL1CaPcpsAcquisitionTest except GpsL1CaPcpsAcquisitionTest.ValidationOfResults.

## Repeating the Tests

The `--gtest_repeat` flag allows you to repeat all (or selected) test methods in a program many times.

For example:

```
$ ./run_tests --gtest_filter=CpuMulticorrelatorTest.* --gtest_repeat=10
```

executes all the tests in the Test Case CpuMulticorrelatorTest ten times.


## Generating an XML Report

Google Test can emit a detailed XML report to a file in addition to its normal textual output. To generate the XML report, set the `GTEST_OUTPUT` environment variable or the `--gtest_output` flag to the string "`xml:_path_to_output_file_`", which will create the file at the given location. You can also just use the string "`xml`", in which case the output can be found in the `test_detail.xml` file in the current directory.

If you specify a directory (for example, "`xml:output/directory/`"), Google Test will create the XML file in that directory, named after the test executable (e.g. `run_tests.xml` for test program `run_tests`). If the file already exists (perhaps left over from a previous run), Google Test will pick a different name (e.g. `run_tests_1.xml`) to avoid overwriting it.

The format of the report is as follows:

```
<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="AllTests" ...>
  <testsuite name="test_case_name" ...>
    <testcase name="test_name" ...>
      <failure message="..."/>
      <failure message="..."/>
      <failure message="..."/>
    </testcase>
  </testsuite>
</testsuites>
```

 * The root `<testsuites>` element corresponds to the entire test program.
 * `<testsuite>` elements correspond to Google Test test cases.
 * `<testcase>` elements correspond to Google Test test functions.


For example:

```
$ ./run_tests --gtest_filter=CpuMulticorrelatorTest.* --gtest_output=xml
```

generates a report called `test_detail.xml` in the current directory;

```
$ ./run_tests --gtest_filter=CpuMulticorrelatorTest.* --gtest_output=xml:./test_results/
```

generates a report called `run_tests.xml` in a newly created `./test_results` directory; and

```
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


# Description of available tests

## Unit Tests

The generation of some unit test cases are enabled by default, and gathered in the test program `run_tests`.

 * Unit Test Cases for arithmetics:
    - CodeGenerationTest
    - ComplexCarrierTest
    - ConjugateTest
    - FFTLengthTest
    - MagnitudeSquaredTests
    - MultiplyTests

* Unit Test Cases for the control plane:
    - ControlMessageFactoryTest
    - ControlThreadTest
    - FileConfigurationTest
    - GNSSBlockFactoryTest
    - GNSSFlowgraph
    - InMemoryConfiguration
    - StringConverterTest

 * Unit Test Cases for signal processing blocks:
    - Signal sources
      - FileSignalSource
      - ValveTest
    - Data Type Adapter
      - PassThroughTest
    - Input filter
      - FirFilterTest
    - Resampler
      - DirectResamplerConditionerCcTest
    - Acquisition
      - GpsL1CaPcpsAcquisitionTest
      - GpsL1CaPcpsAcquisitionGSoC2013Test
      - GpsL1CaPcpsTongAcquisitionGSoC2013Test
      - GpsL1CaPcpsQuickSyncAcquisitionGSoC2014Test
      - GalileoE1PcpsAmbiguousAcquisitionTest
      - GalileoE1PcpsAmbiguousAcquisitionGSoCTest
      - GalileoE1PcpsAmbiguousAcquisitionGSoC2013Test
      - GalileoE1Pcps8msAmbiguousAcquisitionGSoC2013Test
      - GalileoE1PcpsTongAmbiguousAcquisitionGSoC2013Test
      - GalileoE1PcpsCccwsrAmbiguousAcquisitionTest
      - GalileoE1PcpsQuickSyncAmbiguousAcquisitionGSoC2014Test
      - GalileoE5aPcpsAcquisitionGSoC2014GensourceTest
    - Tracking
      - CpuMulticorrelatorTest
      - GalileoE1DllPllVemlTrackingInternalTest
      - GalileoE5aTrackingTest
      - TrackingLoopFilterTest
    - Telemetry Decoder
      - InstantiateGpsL1CaTelemetryDecoder
    - Observables
      - HybridObservablesTest
    - PVT
      - RinexPrinterTest
      - RtcmTest
      - RtcmPrinterTest

## Extra Unit Tests

This option builds some extra unit tests cases that require external tools not included in the GNSS-SDR source tree. It can be activated by:

```
$ cmake -DENABLE_UNIT_TESTING_EXTRA=ON ..
$ make
```

This option will download, build and link (at building time) the following tools and files:

 * A basic software-defined GNSS signal generator based on [gps-sdr-sim](https://github.com/osqzss/gps-sdr-sim){:target="_blank"} and available at [https://bitbucket.org/jarribas/gnss-simulator](https://bitbucket.org/jarribas/gnss-simulator){:target="_blank"}, which includes some sample RINEX and trajectory (.csv) files used by optional tests.
 * The [GPSTk project](http://www.gpstk.org){:target="_blank"}, an open source library and suite of applications for the satellite navigation community. GPSTk is sponsored by [Space and Geophysics Laboratory](http://sgl.arlut.utexas.edu){:target="_blank"}, within the [Applied Research Laboratories](http://www.arlut.utexas.edu){:target="_blank"} at the [University of Texas at Austin](https://www.utexas.edu){:target="_blank"} (ARL:UT). GPSTk is the by-product of GPS research conducted at ARL:UT since before the first satellite launched in 1978; it is the combined effort of many software engineers and scientists. In 2003, the research staff at ARL:UT decided to open source much of their basic GNSS processing software as the GPSTk. The source code is currently available from [https://github.com/SGL-UT/GPSTk](https://github.com/SGL-UT/GPSTk){:target="_blank"}.
 * It downloads `gps_l2c_m_prn7_5msps.dat`, a file containing raw GNSS signal samples that is used by some tests as input data.


The following Unit Test Cases are added to the executable `run_tests`:

* Extra Unit Test Cases
  - Acquisition
    - GpsL2MPcpsAcquisitionTest
  - Tracking
    - GpsL1CADllPllTrackingTest
    - GpsL2MDllPllTrackingTest
  - Telemetry Decoder
    - GpsL1CATelemetryDecoderTest
  - Observables
    - HybridObservablesTest


## System Tests

This option builds some extra system test programs that require external tools not included in the GNSS-SDR source tree. It can be activated by:

```
$ cmake -DENABLE_SYSTEM_TESTING=ON ..
$ make
```

This option generates the following system test program:

### `ttff`

This test program computes the Time-To-First-Fix (TTFF), as defined [here]({{ "/design-forces/availability/#time-to-first-fix-ttff" | absolute_url }}). The TTFF indicator provides a measurement of the time required for a static receiver to provide a valid position fix after the receiver is started. This program accepts the following commandline flags:

|----------
|  **Flag**  |  **Default value** | **Description** |
|:--|:-:|:--|
| &#x2011;&#x2011;fs_in | $$ 4000000 $$ | Sampling rate, in Samples/s. |
| &#x2011;&#x2011;max_measurement_duration | $$ 90 $$ | Maximum time waiting for a position fix, in seconds. |
| &#x2011;&#x2011;num_measurements | $$ 2 $$ | Number of measurements (M). |
| &#x2011;&#x2011;device_address | 192.168.40.2 | USRP device IP address. |
| &#x2011;&#x2011;subdevice | A:0 | USRP subdevice. |
| &#x2011;&#x2011;config_file_ttff | empty | File containing the configuration parameters for the TTFF test. |
|--------------

For TTFF measurements, it makes sense to use real-life GNSS signals. Just prepare a configuration file according to your hardware setup and pass it to the receiver with the `--config_file_ttff` file, in the same way that you invoke `gnss-sdr` with `--config_file`.

Each TTFF sample is computed as the time interval starting with the invocation of the receiver's executable and ending with the first valid navigation data point derived from live or simulated satellite signals. The start times of the test samples are not synchronized to any UTC time boundary and they should be randomly spread within the 24 hour UTC day and within the GNSS data collection interval. The program starts the receiver, it processes signal until the first fix, and then annotates the elapsed time, shuts down the receiver, waits for a random number of seconds (from 5 to 30 s), and starts the receiver again. This is done a total of M times, and this number can be controlled by the `--num_measurements` flag.

So an example of running this test could be:

```
$ ./ttff --config_file_ttff=my_GPS_rx.conf --num_measurements=50
```


The results of the experiment are reported as follows:

|----------
|  **Reported parameter**  |  **Description** |
|:-:|:--|
|--------------
|  **Mean TTFF**  | Average of the obtained measurements, computed as $$  \frac{1}{L}\sum_{j=1}^L TTFF_j $$. Units: seconds. |
|  **Max TTFF**  | Maximum of the obtained valid measurements. Units: seconds |
|  **Min TTFF**  | Minimum of the obtained valid measurements. Units: seconds |
|  **Sample Dev / Size** |  The standard deviation of the sample set is computed as $$ \sigma_{TTFF} = \sqrt{\frac{1}{L-1}\sum_{i=1}^L \left( TTFF_i - \frac{1}{L}\sum_{j=1}^L TTFF_j \right)^2 } $$, in seconds. / Number of valid measurements (L) over the total number of measurements (M), expressed as (L of M). |
| **Init. status** | [`cold`, `warm`, `hot`]: Initial receiver status, as defined above.  |
| **Nav. mode** | [`2D`, `3D`]: `3D` Navigation mode in which at least four satellite signals are received and are used to compute positioning data containing as a minimum: time tagged latitude, longitude, and altitude referenced to a given coordinate system.  / `2D` Navigation mode in which no fewer than three satellite signals and fixed altitude are received and used to compute positioning data containing as a minimum: time tagged latitude, longitude, and fixed altitude referenced to a given system.    |
|  **DGNSS**  | [`Y`, `N`]: `Y` if an external system is providing ephemeris data, `N` if the receiver is not receiving external information. |
| **Signal** | Targeted GNSS signal(s) during the test. |
| **Source** | [`Live`, `Sim`, `File`]: `Live` for GNSS signals from space, `Sim` for or simulated GNSS signals generated at RF, `File` for a pre-defined set of signal inputs, stored in files. |
| **Processing platform**  | Brand and model of the processing platform performing the test. |
| **Operating system**  | Brand and release of the operating system in which the software receiver undergoing the test was executed. |
| **Source code unique ID** | Software release version, D.O.I., Git hash, or any other unique identifier. |
|--------------


## Extra System Tests

This option builds some extra system test programs that require external tools not included in the GNSS-SDR source tree. It can be activated by:

```
$ cmake -DENABLE_SYSTEM_TESTING_EXTRA=ON ..
$ make
```

As in the case of the `-DENABLE_UNIT_TESTING_EXTRA=ON`, this option will also download, build and link the software-defined GNSS signal generator and the GPSTk library.

This option generates the following system test programs:

### `obs_gps_l1_system_test`

This test program calls the software-defined signal generator, which generates a file of raw GNSS signals based on the passed RINEX navigation file and a given receiver position. Then, the software receiver processes it, generating its own RINEX observbles and navigation files. Then, the program compares the observables obtained by the software receiver to the ones in a RINEX observation file, making use of the GPSTK library. This program accepts the following commandline flags:

|----------
|  **Flag**  |  **Default value** | **Description** |
|:--|:-:|:--|
| &#x2011;&#x2011;rinex_nav_file| "brdc3540.14n" | Input RINEX navigation file |
| &#x2011;&#x2011;filename_rinex_obs | "sim.16o" | Filename of output RINEX navigation file. |
| &#x2011;&#x2011;filename_raw_data | "signal_out.bin" | Filename of raw signal samples file (internally genetaed by software). |
| &#x2011;&#x2011;static_position | "30.286502,120.032669,100" | Static receiver position [log,lat,height] |
| &#x2011;&#x2011;dynamic_position | -- | Observer positions file, in .csv or .nmea format. |
| &#x2011;&#x2011;duration | $$ 100 $$ | Duration of the experiment [in seconds, max = 300]. |
| &#x2011;&#x2011;disable_generator | false | If set to "true", it disables the signal generator (so a external raw signal file must be available for the test). |
|----------

So an example of running this test could be:

```
$ ./obs_gps_l1_system_test
```

The first run will generate a `signal_out.bin` file (taking some time). The next time you execute this test, signal generation cam be skipped by:

```
$ ./obs_gps_l1_system_test --disable_generator
```

If you have a professional GNSS signal receiver that generates RINEX files, or you download them from a server, you can use the RINEX navigation file and your best guess of your position:

```
$ ./obs_gps_l1_system_test --rinex_nav_file=my_RINEX.17n --static_position="0.000000,000000,0"
```

This expects a `my_RINEX.17n` and a `my_RINEX.17o` files and a valid position.

### `position_test`

This test program computes metrics of static accuracy and precision. It can use either a software-defined signal generator (GPS L1 only) or accept any other receiver configuration obtaining PVT fixes. It accepts the following commandline flags:

|----------
|  **Flag**  |  **Default value** | **Description** |
|:--|:-:|:--|
| &#x2011;&#x2011;rinex_nav_file| "brdc3540.14n" | Input RINEX navigation file |
| &#x2011;&#x2011;filename_rinex_obs | "sim.16o" | Filename of output RINEX navigation file. |
| &#x2011;&#x2011;filename_raw_data | "signal_out.bin" | Filename of raw signal samples file (internally genetaed by software). |
| &#x2011;&#x2011;static_position | "30.286502,120.032669,100" | Static receiver position [log,lat,height] |
| &#x2011;&#x2011;disable_generator | false | If set to "true", it disables the signal generator (so a external raw signal file must be available for the test). |
| &#x2011;&#x2011;duration | $$ 100 $$ | Duration of the experiment [in seconds, max = 300]. |
| &#x2011;&#x2011;config_file_ptest | empty | File containing the configuration parameters for the position test. |
|----------

So an example of running this test could be:

```
$ ./position_test
```

By default, the program triggers a software-defined GPS L1 C/A signal generator, which takes the default RINEX navigation file (brdc3540.14n, already included in the files automatically downloaded by CMake's `-DENABLE_SYSTEM_TESTING_EXTRA=ON` option) and the default reference location (longitude $$30.286502^o $$, latitude $$ 120.032669^o $$, height $$ 100 $$ m), and generates a RINEX observation file and a raw signal sample file, with a duration of $$ 100 $ s. Then, it triggers the software receiver and processes such raw data file. At the end of the processing, the program reports several metrics for accuracy and precision. Since the generation of the raw samples file only needs to be executed once, the next time you execute this program, the generation can be skipped by:

```
$ ./position_test --disable_generator
```


You can use your own configuration file:

```
$ ./position_test --config_file_ptest=my_GPS_rx.conf --static_position="0.000000,000000,0"
```

changing "0.000000,000000,0" by your reference longitude, latitude and height (expressed in WGS-84 coordinates). In case of processing live data, please remember to terminate the receiver execution with key `q` and then `[Enter]`.


When the software receiver terminates, the program reports [Accuracy]({{ "/design-forces/accuracy/" | absolute_url }}) and [precision]({{ "/design-forces/repeatability/" | absolute_url }}) metrics for 2D and 3D positioning, expressed in a local ENU (East-North-Up) reference frame and defined as:

|----------
|  **Measure**  |  **Formula** | **Confidence region probability** | **Definition** |
|:-:|:-:|:-:|:--|  
|--------------
|  **2DRMS** | $$ 2\sqrt{\sigma_E^2+\sigma_N^2} $$ | 95 % | Twice the DRMS of the horizontal position errors, defining the radius of circle centered at the true position, containing the horizontal position estimate with probability of 95 %. |
|  **DRMS**  | $$ \sqrt{\sigma_E^2+\sigma_N^2} $$  | 65 % | The square root of the average of the squared horizontal position errors, defining the radius of circle centered at the true position, containing the horizontal position estimate with probability of 65 %. |
|  **CEP**   | $$ 0.62\sigma_N+0.56\sigma_E $$, accurate if $$ \frac{\sigma_N}{\sigma_E}>0.3 $$ | 50 % | The radius of circle centered at the true position, containing the horizontal position estimate with probability of 50 %. |
|  **99 % Spherical Accuracy Standard** | $$ 1.122 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 99 % | The radius of sphere centered at the true position, containing the position estimate in 3D with probability of 99 %  |
|  **90 % Spherical Accuracy Standard** | $$ 0.833 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 90 % | The radius of sphere centered at the true position, containing the position estimate in 3D with probability of 90 %  |
|  **MRSE**  | $$ \sqrt{\sigma_E^2+\sigma_N^2+\sigma_U^2} $$ | 61 % | The radius of sphere centered at the true position, containing the position estimate in 3D with probability of 61 % |
|  **SEP**   | $$ 0.51 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 50 % | The radius of sphere centered at the true position, containing the position estimate in 3D with probability of 50 % |
|-----

For accuracy measurements, the standard deviation of the error in the three local coordinates (in m) are computed as:

$$ \sigma_E^{(\text{static accuracy})} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(E[l]- E_{ref}\right)^2} ,$$

$$ \sigma_N^{(\text{static accuracy})} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(N[l]- N_{ref}\right)^2} ,$$

$$ \sigma_U^{(\text{static accuracy})} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(U[l]- U_{ref}\right)^2} ,$$

with $$ E_{ref} $$, $$ N_{ref} $$ and $$ U_{ref} $$ are the East, North and Up coordinates of the reference location, respectively.

In case of precision measurements:

$$ \sigma_{E}^{(precision)} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(E[l]- \hat{E}\right)^2} , $$

$$ \sigma_{N}^{(precision)} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(N[l]- \hat{N}\right)^2} , $$

$$ \sigma_{U}^{(precision)} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(U[l]- \hat{U}\right)^2} , $$

where $$ \hat{E}=\frac{1}{L}\sum_{l=1}^{L}E[l] $$, $$ \hat{N}=\frac{1}{L}\sum_{l=1}^{L}N[l] $$, and $$ \hat{U}=\frac{1}{L}\sum_{l=1}^{L}U[l] $$.


# How to write a new test

For more details, check out the Google C++ Testing Framework [Documentation](https://github.com/google/googletest/blob/master/googletest/docs/Documentation.md){:target="_blank"}


## Tests in the source tree

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



## Writing a test




## Listing the test

## Running the test

------

# References

[^Beck99]: K. Beck, C. Andres, [Extreme Programming Explained: Embrace Change](http://www.goodreads.com/book/show/67833.Extreme_Programming_Explained){:target="_blank"}, Addison-Wesley Professional, Boston, MA, 1999.

[^Beck02]: K. Beck, [Test Driven Development: By Example](http://www.eecs.yorku.ca/course_archive/2003-04/W/3311/sectionM/case_studies/money/KentBeck_TDD_byexample.pdf){:target="_blank"}, Addison-Wesley Professional, Boston, MA, 2002.

[^Shore08]: J. Shore and S. Warden, [The Art of Agile Development](http://www.jamesshore.com/Agile-Book/){:target="_blank"}, O'Really, Sebastopol, CA, 2008.

[^Langley09]: G. J. Langley, R. D. Moen, K. M. Nolan, T. W. Nolan, C. L. Norman and L. P. Provost, [The Improvement Guide](http://www.wiley.com/WileyCDA/WileyTitle/productCd-0470192410.html){:target="_blank"}, Jossey-Bass, San Francisco, CA, 2009.

[^Deming93]: W. E. Deming, [The new economics for industry, government, education](https://mitpress.mit.edu/books/new-economics-industry-government-education){:target="_blank"}, MIT Press, Cambridge, MA, 1993.

[^Plattner11]: H. Plattner, C. Meinel, L. Leifer (Eds.), [Design Thinking: Understand - Improve - Apply](http://www.springer.com/gp/book/9783642137563){:target="_blank"}, Springer-Verlag, Berlin, Germany, 2011.

[^Cross11]: N. Cross, [Design Thinking: Understanding How Designers Think and Work](https://books.google.es/books/about/Design_Thinking.html?id=F4SUVT1XCCwC){:target="_blank"}, Berg Publishers, Oxford, UK, 2011.

[^IEEE730]: IEEE Computer Society, [730-2014 - IEEE Standard for Software Quality Assurance Processes](http://ieeexplore.ieee.org/document/6835311/){:target="_blank"}, New York, NY, 2014.

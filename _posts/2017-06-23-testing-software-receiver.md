---
title: "Testing the software receiver"
permalink: /docs/tutorials/testing-software-receiver/
excerpt: "Software testing concepts and their implementation in GNSS-SDR."
author_profile: false
header:
  teaser: /assets/images/PDCA.png
tags:
  - tutorial
sidebar:
  nav: "docs"
last_modified_at: 2017-06-23T09:37:02+02:00
---

{% include toc %}


## Test Driven Development

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

## The Testing Framework

GNSS-SDR uses the [Google C++ Testing Framework](https://github.com/google/googletest){:target="_blank"} (usually referred to as Google Test) for its testing code. This framework provides the following features:

 * **Tests should be independent and repeatable**. It is a pain to debug a test that succeeds or fails as a result of other tests. Google C++ Testing Framework isolates the tests by running each of them on a different object. When a test fails, Google C++ Testing Framework allows you to run it in isolation for quick debugging.
 * **Tests should be well organized and reflect the structure of the tested code**. Google C++ Testing Framework groups related tests into test cases that can share data and subroutines. This common pattern is easy to recognize and makes tests easy to maintain. Such consistency is especially helpful when people switch projects and start to work on a new code base.
 * **Tests should be portable and reusable**. The open-source community has a lot of code that is platform-neutral; its tests should also be platform-neutral. Google C++ Testing Framework works on different Operating Systems, with different compilers (gcc, llvm, and others), with or without exceptions, so Google C++ Testing Framework tests can easily work with a variety of configurations.
 * **When tests fail, they should provide as much information about the problem as possible**. Google C++ Testing Framework does not stop at the first test failure. Instead, it only stops the current test and continues with the next. You can also set up tests that report non-fatal failures after which the current test continues. Thus, you can detect and fix multiple bugs in a single run-edit-compile cycle.
 * **The testing framework should liberate test writers from housekeeping chores and let them focus on the test content**. Google C++ Testing Framework automatically keeps track of all tests defined, and does not require the user to enumerate them in order to run them.
 * **Tests should be fast**. With Google C++ Testing Framework, you can reuse shared resources across tests and pay for the set-up/tear-down only once, without making tests depend on each other.

When using Google Test, developers write [_assertions_](https://github.com/google/googletest/blob/master/googletest/docs/Primer.md#assertions){:target="_blank"}, which are statements that check whether a condition is true. An assertion's result can be _success_, _nonfatal failure_, or _fatal failure_. If a fatal failure occurs, it aborts the current function; otherwise the program continues normally.

_Tests_ use assertions to verify the tested code's behavior. If a test crashes or has a failed assertion, then it _fails_; otherwise it _succeeds_.

A _Test Case_ contains one or many tests. You should group your tests into test cases that reflect the structure of the tested code. When multiple tests in a test case need to share common objects and subroutines, you can put them into a [_Test Fixture_](https://github.com/google/googletest/blob/master/googletest/docs/Primer.md#test-fixtures-using-the-same-data-configuration-for-multiple-tests){:target="_blank"} class.

A _Test Program_ can contain multiple test cases.



## Running GNSS-SDR Tests

In order to execute the tests, you must build GNSS-SDR from source. If the Google C++ Testing Framework source code is not already present in your system (and pointing the `GTEST_DIR` environment variable to the root of the souce code tree or, on Debian-based GNU/Linux distributions, doing `sudo apt-get install libgtest-dev`), it will be automatically downloaded from its Git repository, compiled and linked to GNSS-SDR at building time.

GNSS-SDR are divided in two categories:

 * Unit Tests:
 * System Tests:

By default, only (a large) subset of unit tests are compiled by default. So, when doing:

```
$ cd gnss-sdr/build
$ git checkout next
$ cmake ..
$ make
```

this process will end up generating some executables at the `gnss-sdr/install` folder. Among them, a test program called `run_tests`. This executable gathers most of the GNSS-SDR available unit tests. It can be run by doing:

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

----------] Global test environment tear-down
[==========] 164 tests from 38 test cases ran. (69412 ms total)
[  PASSED  ] 164 tests.

```


Other unit and system tests require from external tools, libraries and data files not included in the GNSS-SDR's source tree. They can be build by passing options to CMake:

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

### Listing Tests names

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

###  Running a Subset of the Tests

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

### Repeating the Tests

The `--gtest_repeat` flag allows you to repeat all (or selected) test methods in a program many times.

For example:

```
$ ./run_tests --gtest_filter=CpuMulticorrelatorTest.* --gtest_repeat=10
```

executes all the tests in the Test Case CpuMulticorrelatorTest ten times.


### Generating an XML Report

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



## Description of available tests



### Unit Tests


### Extra Unit Tests

```
$ cmake -DENABLE_UNIT_TESTING_EXTRA=ON ..
$ make
```

### System Tests

```
$ cmake -DENABLE_SYSTEM_TESTING=ON ..
$ make
```

### Extra System Tests

```
$ cmake -DENABLE_SYSTEM_TESTING_EXTRA=ON ..
$ make
```

## How to write a new test

For more details, check out the Google C++ Testing Framework [Documentation](https://github.com/google/googletest/blob/master/googletest/docs/Documentation.md){:target="_blank"}


### Tests in the source tree

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



### Writing a test




### Listing the test

### Running the test

------

## References

[^Beck99]: K. Beck, C. Andres, [Extreme Programming Explained: Embrace Change](http://www.goodreads.com/book/show/67833.Extreme_Programming_Explained){:target="_blank"}, Addison-Wesley Professional, Boston, MA, 1999.

[^Beck02]: K. Beck, [Test Driven Development: By Example](http://www.eecs.yorku.ca/course_archive/2003-04/W/3311/sectionM/case_studies/money/KentBeck_TDD_byexample.pdf){:target="_blank"}, Addison-Wesley Professional, Boston, MA, 2002.

[^Shore08]: J. Shore and S. Warden, [The Art of Agile Development](http://www.jamesshore.com/Agile-Book/){:target="_blank"}, O'Really, Sebastopol, CA, 2008.

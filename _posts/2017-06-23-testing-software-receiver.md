---
title: "Testing the software receiver, Part I: Methodology"
permalink: /docs/tutorials/testing-software-receiver/
excerpt: "Software testing concepts and their implementation in GNSS-SDR."
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
last_modified_at: 2018-06-29T11:37:02+02:00
---


Testing is a concept intimately related to inquiry, creativity, design, methodology, tools, best practices and, ultimately, quality. People from Design Thinking[^Plattner11]$$ ^, $$[^Cross11] understand testing in the sense of prototyping, of trying out something that could be useful for someone else whose needs we have empathized with, and as a source of innovation.  People from Quality Assurance[^Beck02]$$ ^, $$[^IEEE730] understand testing as the detailed procedure that leads to a pass/fail decision based upon some pre-defined requirements. A <s>humble</s> distinguished developer just wants to know if his or her code works as expected.  Hence, it is important to recognize that _the code developed to test the functionality of a given piece of source code is as valuable as the implementation itself_, constituting an inalienable part of the project's source code tree. This page provides an overview on the philosophy behind the approach undertaken by the GNSS-SDR project, it documents the currently available testing procedures, and describes how to add new ones.

# The Science of Improvement

Improvement has meaning only in terms of observation based on a given criteria. That is, improvement is useful and has meaning when it is defined by characteristics such as more efficient, more accurate, more reliable, and so on. Thus, we need to identify the dimensions (or _design forces_) in which a software-defined GNSS receiver can be improved, and to define adequate metrics, measurement procedures and feedback mechanisms for each of those dimensions, in order to objectively assess improvement.

A proposal of an open discussion about the definition of quality metrics and testing procedures for _any_ software-defined GNSS receiver is available at [**16 Design Forces for software-defined GNSS receivers**]({{ "/design-forces/" | relative_url }}). Based on that taxonomy, this page describes GNSS-SDR's particular approach and implementation.
{: .notice--info}

The concepts of improvement and change are strongly connected. Although change will not always result in improvement, all improvement requires change.

Langley _et al._[^Langley09] described the principles to maximize the results of improvement efforts as:

  * Knowing why you need to improve (focused aim).
  * Having a feedback mechanism to tell you if improvements are occurring.
  * Developing effective ideas for changes that will result in improvement.
  * Testing and adapting changes before attempting to implement.
  * Knowing when and how to make changes sustainable through effective implementation to integrate the changes in the system of interest.

It is then of the utmost importance to define a development methodology and adequate tools to measure improvement and to integrate changes into the system in a transparent, controlled and distributed fashion.

Authors in Langley _et al._[^Langley09] claim that the Plan-Do-Study-Act (PDSA) cycles constitute an approach that is aligned with the scientific method. Those cycles were made popular by W. E. Deming in the early 1950s as PDCA (Plan-Do-Check-Act), and at a later stage the same author replaced "Check" by "Study" to emphasize the importance of observing and learning from the "Do" step results[^Deming93]. Those four steps are described as:

 * **PLAN**: Establish the objectives and processes necessary to deliver results in accordance with the expected output (the target or goals). By establishing output expectations, the completeness and accuracy of the spec is also a part of the targeted improvement. When possible, start on a small scale to test possible effects.
 * **DO**: Implement the plan, execute the process, make the product. Collect data for charting and analysis in the following "CHECK" and "ACT" steps.
 * **CHECK**: Study the actual results (measured and collected in "DO" above) and compare against the expected results (targets or goals from the "PLAN") to ascertain any differences. Look for deviation in implementation from the plan and also look for the appropriateness and completeness of the plan to enable the execution, i.e., "DO". Emphasize the **STUDY** of the results: What did we learn? What went wrong?
 * **ACT**: If the "CHECK" shows that the "PLAN" that was implemented in "DO" is an improvement to the prior standard (baseline), then that becomes the new standard (baseline) for how the project should "ACT" going forward (new standards are enACTed). If the "CHECK" shows that the "PLAN" that was implemented in "DO" is not an improvement, then the existing standard (baseline) will remain in place.


![PDCA and Git]({{ "/assets/images/PDCA-Git.png" | relative_url }})
_A graphical representation of Git and PDCA cycles integration_.
{: style="text-align: center;"}

As shown in the figure above, [Git](https://git-scm.com/) integrates PDCA cycles in the development process in a seamless and natural way. The PLAN step begins by creating a new branch of development from the current baseline (that is, the `next` branch). This new branch accommodates testing code for the new improvement, the actual new development work, and eventual test passing and code refactoring in the DO step. Then, CHECK/STUDY step is related to merging the new code with the existing baseline and run all the existing tests, in order to ensure that no integration issues arise. In the case they exist, there is a step back to the DO step and fix the integration issues. In the case that the taken approach in the particular PDCA cycle results in not contributing to an actual improvement, the development branch can be kept for documentation purposes without affecting the baseline. Once the developer has absolute confidence that the change is an objective improvement, he or she ACTs and pushes the change to the reference repository, and the new version incorporating the improvement becomes the new current baseline.

{% capture pdca_cycles %}
By engaging rapid cycles of the PDCA workflow, the GNSS-SDR project aims to learn fast, fail fast, and improve quickly. That failures may occur is not the problem; that we fail to learn from them is. Rate of change, that is, rate of improvement, is a key competitive factor in today's world. PDCA cycles allow for:
  * major "jumps" in performance ("breakthroughs," as the addition of a new GNSS signal receiver chain or an important new feature), which are very much appreciated in the Western culture,
  * as well as Kaizen (Japanese for “improvement”, frequent small improvements such as fixes enhancing correctness in the usage of the programming language, small bug fixes and typos, code cleaning and refactoring, small changes in the building system to extend portability, etc.), which is a key concept about quality deeply rooted in the Eastern culture.
{% endcapture %}

 <div class="notice--info">
   {{ pdca_cycles | markdownify }}
 </div>

This means that all kind of contributions, from fixing a typo in a source code's comment to the addition of a whole new GNSS signal processing chain, are very welcome and greatly appreciated since all of them point towards improved quality, no matter the step size. More details on the _howtos_ in the context of GNSS-SDR are available in our [Git tutorial]({{ "/docs/tutorials/using-git/" | relative_url }}) and in the [CONTRIBUTING.md](https://github.com/gnss-sdr/gnss-sdr/blob/master/CONTRIBUTING.md) file.

&nbsp;

# Test Driven Development

Test-driven development (TDD) is a software development process that relies on the repetition of a very short development cycle: first the developer writes an (initially failing) automated test suite that defines a desired improvement or new function, then produces the minimum amount of code to pass that test, and finally refactors the new code to acceptable standards. It is an Agile-based approach to building complex systems where unit test (and in some cases inter-component integration tests) are built in advance of the product software and are used exercised upon component implementation. This methodology is claimed to offer valuable benefits to software development: it facilitates change, simplifies integration, automates documentation, helps separate the interface from the implementation, increases developers productivity, and plays a central role in the software quality assurance process[^Shore08].

![TDD lifecycle]({{ "/assets/images/TDD_Global_Lifecycle.png" | relative_url }})
_A graphical representation of the Test-Driven Development lifecycle. Source: [Wikipedia](https://en.wikipedia.org/wiki/Test-driven_development)_.
{: style="text-align: center;"}

A typical test-driven development cycle, as described by Beck[^Beck02], can be summarized as:

 1. **Add a test**: In test-driven development, each new feature begins with writing a test. To write a test, the developer must clearly understand the feature’s specification and requirements. This is a differentiating feature of test-driven development versus writing unit tests after the code is written: it makes the developer focus on the requirements before writing the code, a subtle but important difference.

 2. **Run all tests and see if the new one fails**: This validates that the test harness is working correctly, that the new test does not mistakenly pass without requiring any new code, and that the required feature does not already exist. This step also tests the test itself, in the negative: it rules out the possibility that the new test always passes, and therefore is worthless. The new test should also fail for the expected reason. This step increases the developer's confidence that the unit test is testing the correct constraint, and passes only in intended cases.

 3. **Write some code**: The next step is to write some code that causes the test to pass. The new code written at this stage is not perfect and may, for example, pass the test in an inelegant way. That is acceptable because it will be improved and honed in Step 5. At this point, the only purpose of the written code is to pass the test; no further (and therefore untested) functionality should be predicted nor 'allowed for' at any stage.

 4. **Run the automated tests and see them succeed**: If all test suites now pass, the programmer can be confident that the new code meets the test requirements, and does not break or degrade any existing features. If they do not, the new code must be adjusted until they do.

 5. **Refactor code**: The growing code base must be cleaned up regularly during test-driven development. New code can be moved from where it was convenient for passing a test to where it more logically belongs. Duplication must be removed, documentation added, inheritance hierarchies may be rearranged to be more logical and helpful, and perhaps to benefit from recognized design patterns, and adhere to a defined set of coding style rules. There are specific and general guidelines for refactoring and for creating clean code[^Beck99]. By continually re-running the test suites throughout each refactoring phase, the developer can be confident that process is not altering any existing functionality.

 6. **Repeat (go to step 1)**: Starting with another new test, the cycle is then repeated to push forward the functionality.


According to Beck[^Beck02], software tests must be:

 * **Easy to write for programmers**: Test tools that require unfamiliar environments or languages will be less likely to be used, even if they are technically superior.
 * **Easy to read for programmers**: The tests will be more valuable if they are readable, giving an interesting second perspective on the messages hidden in the source code.
 * **Quick to execute**: If the tests do not run fast, they will not get run. If they do not get run, they will not be valuable. If they are not valuable, they will not continue to be written.
 * **Order independent**: If one test breaks, we would like the other to succeed or fail independently.
 * **Deterministic**: Tests that run one time and do not run the next give negative information. The times they run you have unwarranted confidence in the system. This implies that TDD as described in this page is not suitable for the synchronization parts of multi-thread programming.
 * **Piecemeal**: We would like to be able to write the tests a few at a time.
 * **Composable**: We would like to be able to run tests in any combination.
 * **Versionable**: The source of the tests should play nicely with the rest of the source in the
system.
 * _**A priori**_: We should be able to write the tests before they can possibly run.
 * **Automatic**: The tests should run with no human intervention.


Software tests have some additional constraints and recommended patterns:

 * Tests must be expressed in ordinary source code.
 * The execution of each test is centered on an instance of a _Test Suite_ object.
 * Each _Test Suite_, before it executes the test, has the opportunity to create an environment for the test, and to destroy that environment when the test finishes.
 * Groups of tests can be collected together, and their results of running them all will be reported collectively.
 * Use of the language's exception handling mechanism to catch and report errors.


The key areas in which this approach can contribute are:

 * Definition of a flexible and durable software architecture.
 * A consistent and well-documented development process.
 * Manage overall problem space complexity.
 * Ease deployment and manage target environment complexity.
 * Direct facilitation of development team communication and coordination.

&nbsp;

# The Testing Framework

GNSS-SDR uses the [Google C++ Testing Framework](https://github.com/google/googletest) (usually referred to as Google Test) for its testing code. This framework is based on the following premises:

 * **Tests should be independent and repeatable**. It is a pain to debug a test that succeeds or fails as a result of other tests. Google C++ Testing Framework isolates test cases by running each of them on a different object. When a test case fails, Google C++ Testing Framework allows you to run it in isolation for quick debugging.
 * **Tests should be well organized and reflect the structure of the tested code**. Google C++ Testing Framework groups related test cases into test suites that can share data and subroutines. This common pattern is easy to recognize and makes tests easy to maintain. Such consistency is especially helpful when people switch projects and start to work on a new code base.
 * **Tests should be portable and reusable**. The open-source community has a lot of code that is platform-neutral; its tests should also be platform-neutral. Google C++ Testing Framework works on different Operating Systems, with different compilers (gcc, llvm, and others), with or without exceptions, so Google C++ Testing Framework test cases can easily work with a variety of configurations.
 * **When tests fail, they should provide as much information about the problem as possible**. Google C++ Testing Framework does not stop at the first test failure. Instead, it only stops the current test and continues with the next. You can also set up test cases that report non-fatal failures after which the current test continues. Thus, you can detect and fix multiple bugs in a single run-edit-compile cycle.
 * **The testing framework should liberate test writers from housekeeping chores and let them focus on the test content**. Google C++ Testing Framework automatically keeps track of all tests defined, and does not require the user to enumerate them in order to run them.
 * **Tests should be fast**. With Google C++ Testing Framework, you can reuse shared resources across test cases and pay for the set-up/tear-down only once, without making tests depend on each other.

When using Google Test, developers write [_assertions_](https://github.com/google/googletest/blob/master/googletest/docs/primer.md#assertions), which are statements that check whether a condition is true. An assertion's result can be _success_, _nonfatal failure_, or _fatal failure_. If a fatal failure occurs, it aborts the current function; otherwise the program continues normally.

_Test Cases_ use assertions to verify the tested code's behavior. If a test case crashes or has a failed assertion, then it _<span style="color: #E74C3C">fails</span>_; otherwise it _<span style="color: #2ECC71">succeeds</span>_.

A _Test Suite_ contains one or many test cases. You should group your test cases into test suites that reflect the structure of the tested code. When multiple test cases in a test suite need to share common objects and subroutines, you can put them into a [_Test Fixture_](https://github.com/google/googletest/blob/master/googletest/docs/primer.md#test-fixtures-using-the-same-data-configuration-for-multiple-tests) class.

A _Test Program_ can contain multiple test suites.

&nbsp;

For details about the available _Test Suites_ and how to build and run them, please check [Testing the software receiver, Part II: Test Execution]({{ "/docs/tutorials/testing-software-receiver-2/" | relative_url }}).
{: .notice--info}

------

# References

[^Beck99]: K. Beck, C. Andres, [Extreme Programming Explained: Embrace Change](https://www.goodreads.com/book/show/67833.Extreme_Programming_Explained), Addison-Wesley Professional, Boston, MA, 1999.

[^Beck02]: K. Beck, [Test Driven Development: By Example](http://www.eecs.yorku.ca/course_archive/2003-04/W/3311/sectionM/case_studies/money/KentBeck_TDD_byexample.pdf), Addison-Wesley Professional, Boston, MA, 2002.

[^Shore08]: J. Shore and S. Warden, [The Art of Agile Development](http://www.jamesshore.com/Agile-Book/), O'Reilly, Sebastopol, CA, 2008.

[^Langley09]: G. J. Langley, R. D. Moen, K. M. Nolan, T. W. Nolan, C. L. Norman and L. P. Provost, [The Improvement Guide](https://www.wiley.com/WileyCDA/WileyTitle/productCd-0470192410.html), Jossey-Bass, San Francisco, CA, 2009.

[^Deming93]: W. E. Deming, [The new economics for industry, government, education](https://mitpress.mit.edu/books/new-economics-industry-government-education-second-edition), MIT Press, Cambridge, MA, 1993.

[^Plattner11]: H. Plattner, C. Meinel, L. Leifer (Eds.), [Design Thinking: Understand - Improve - Apply](https://www.springer.com/gp/book/9783642137563), Springer-Verlag, Berlin, Germany, 2011.

[^Cross11]: N. Cross, [Design Thinking: Understanding How Designers Think and Work](https://books.google.es/books/about/Design_Thinking.html?id=F4SUVT1XCCwC), Berg Publishers, Oxford, UK, 2011.

[^IEEE730]: IEEE Computer Society, [730-2014 - IEEE Standard for Software Quality Assurance Processes](https://ieeexplore.ieee.org/document/6835311/), New York, NY, 2014.

---
title: "14.- Testability"
permalink: /design-forces/testability/
excerpt: "The degree to which a software artefact supports testing in a given test context."
modified: 2016-07-29T15:54:02-04:00
---

When referred to software, _testability_ is the degree to which a software artefact (_i.e._, a software system, software module, requirements, or design document) supports testing in a given test context. Testability is not an intrinsic property of a software artefact and cannot be measured directly (such as software size). Instead, testability is an extrinsic property that results from interdependency of the software to be tested and the test goals, test methods used, and test resources (_i.e._, the test context).

Testability can be understood as visibility and control:

 * **Visibility** is our ability to observe the states, outputs, resource usage and other side effects of the software under test.
 * **Control** is our ability to apply inputs to the software under test or place it in specified states.


_Design for Testability_ is a concept used in electronic hardware design for over 50 years, driven by the obvious fact that in order to be able to test an integrated circuit both during the design stage and later in production, it has to be designed so it _can_ be tested. The testing points, procedures and testing equipment requirements must be taken into account in the design, since testability cannot be added in a later stage, as the circuit is already in silicon. Testability is a critical non-functional requirement that affects most every aspect of electronic hardware design. In a similar way, complex software systems require testing both during design and production, and the same principles apply. A software-defined GNSS receiver must be designed for testability.

Software tests have the following desirable features:

* Tests should be _independent_ and _repeatable_.
* Tests should be well organized and reflect the structure of the tested code.
* Tests should be _portable_ and _reusable_.
* When tests fail, they should provide as much information about the problem as possible.
* The testing framework should liberate test writers from housekeeping chores and let them focus on the test _content_.
* Tests should be _fast_.
* Tests should be _deterministic_.
* Tests should be _automatic_, they should run with no human intervention.


## Indicators of Testability

* Unit testing
  - Availability of a software testing framework.
  - Number of available unit tests.

* Integration testing
  - Availability of automated building tools.

* System testing
  - Time To First Fix (TTFF) testability:
    * Possibility to set up the receiver in cold, warm and hot starts.
  - Acquisition sensitivity testability:
    * Possibility to set up the receiver to acquire a single signal and report time-tagged $$ C/N_0 $$ and acquisition status.
  - Tracking sensitivity testability:
    * Possibility to set up the receiver to track a single signal and report time-tagged $$ C/N_0 $$ and tracking status.

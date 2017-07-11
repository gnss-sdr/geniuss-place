---
title: "14.- Testability"
permalink: /design-forces/testability/
excerpt: "The degree to which a software artifact supports testing in a given test context."
header:
  teaser: /assets/images/design-force-teaser.png
last_modified_at: 2016-07-29T15:54:02-04:00
---

When referred to software, _testability_ is the degree to which a software artifact (_i.e._, a software system, software module, requirements, or design document) supports testing in a given test context. Testability is not an intrinsic property of a software artifact and cannot be measured directly (such as software size). Instead, testability is an extrinsic property that results from interdependency of the software to be tested and the test goals, test methods used, and test resources (_i.e._, the test context).

Testability can be understood as visibility and control:

 * **Visibility** is our ability to observe the states, outputs, resource usage and other side effects of the software under test.
 * **Control** is our ability to apply inputs to the software under test or place it in specified states.


_Design for Testability_ is a concept used in electronic hardware design for over 50 years, driven by the obvious fact that in order to be able to test an integrated circuit both during the design stage and later in production, it has to be designed so it _can_ be tested. The testing points, procedures and testing equipment requirements must be taken into account in the design, since testability cannot be added in a later stage, as the circuit is already in silicon. Testability is a critical non-functional requirement that affects most every aspect of electronic hardware design. In a similar way, complex software systems require testing both during design and production, and the same principles apply. A software-defined GNSS receiver must be designed for testability.

A primary purpose of testing is to detect software failures so that defects may be discovered and corrected. Testing cannot establish that a product functions properly under all conditions but can only establish that it does not function properly under specific conditions.

But such design for testability has also an impact on System Architecture design, since it typically drives a clear separation of concerns, layered architecture or service orientation, and high cohesiveness of entities in the code. Tests behave very much like system "clients": unit tests imitate the behaviour of a corresponding client-class or classes invoking target class methods; component test imitate the behaviour of client-components; functional tests imitate the end user[^Yakima]. Designing for testability implies providing for clear and understandable interfaces between classes, components, services, and, ultimately, the user interface and the rest of the system. Design patterns[^GoF94]$$ ^{,} $$[^Fowler02] as [fa&ccedil;ade](https://en.wikipedia.org/wiki/Facade_pattern){:target="_blank"}, [gateway](http://martinfowler.com/eaaCatalog/gateway.html){:target="_blank"}, or [observer](https://en.wikipedia.org/wiki/Observer_pattern){:target="_blank"} foster testability. Logging, abstract interfaces, verbose output modes and a flexible configuration system are other desirable features that enable testability.

Software tests have the following desirable features[^Whittaker12]:

* Tests should be _independent_ and _repeatable_.
* Tests should be well organized and reflect the structure of the tested code.
* Tests should be _portable_ and _reusable_.
* When tests fail, they should provide as much information about the problem as possible.
* The testing framework should liberate test writers from housekeeping chores and let them focus on the test _content_.
* Tests should be _fast_.
* Tests should be _deterministic_.
* Tests should be _automatic_, they should run with no human intervention.


## Indicators of Testability

It follows a list of possible testability indicators for a software-defined GNSS receiver:

* Unit / component / integration testing:
  - Availability of a software testing framework.
  - Number of available unit / component / integration tests.
  - Availability of an automated building tool.

* System testing:
  - Time To First Fix (TTFF) testability:
    * Possibility to set up the receiver in cold, warm and hot starts.
  - Acquisition sensitivity testability:
    * Possibility to set up the receiver to acquire a single signal and report time-tagged $$ C/N_0 $$ and acquisition status.
  - Tracking sensitivity testability:
    * Possibility to set up the receiver to track a single signal and report time-tagged $$ C/N_0 $$ and tracking status.


-----

## References

[^Yakima]: A. Yakima, [_Design for Testability: A Vital Aspect of the System Architect Role in SAFe._](http://scaledagileframework.com/design-for-testability-a-vital-aspect-of-the- system-architect-role-in-safe/){:target="_blank"}, Scaled Agile, Inc., 2015.

[^Whittaker12]: J. Whittaker, J. Arbon, J. Carollo, _How Google Tests Software_, Westford, Massachusetts: Pearson Education, 2012.

[^GoF94]: E. Gamma, R. Helm, R. Johnson, J. Vlissides, _Design Patterns: Elements of Reusable Object-Oriented Software_, Addison-Wesley Professional, 1994.

[^Fowler02]: M. Fowler, [_Patterns of Enterprise Application Architecture_](http://martinfowler.com/books/eaa.html){:target="_blank"}, Addison-Wesley Professional; 1 edition (November 15, 2002).

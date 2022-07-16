---
title: "6.- Maintainability"
permalink: /design-forces/maintainability/
excerpt:
  "The ease with which a product can be maintained in order to isolate and
  correct defects and cope with a changing environment."
header:
  teaser: /assets/images/radar-chart.png
last_modified_at: 2021-02-09T14:54:02+02:00
---

_Maintainability_ refers to the ease with which a product can be maintained in
order to isolate and correct defects or their cause, repair or replace faulty or
worn-out components without having to replace still working parts, prevent
unexpected breakdowns, maximize a product's useful life, maximize efficiency,
reliability, and safety, meet new requirements, make future maintenance easier,
or cope with a changing environment.

Depending on the used programming language, maintainability is also related to
the adherence to the official language programming standards. Examples:

- For C:
  - **C18**: The international standard which defines the C programming language
    is officially known as _ISO/IEC 9899:2018 &ndash; Information technology
    &ndash; Programming languages &ndash; C_, and it is available
    from [ISO](https://www.iso.org/standard/74528.html),
    [IEC](https://webstore.iec.ch/publication/63478), and
    [ANSI](https://webstore.ansi.org/Standards/ISO/ISOIEC98992018). You can
    obtain something very close to the standard for free because of the working
    drafts available, the closest
    is [N2176](https://web.archive.org/web/20181230041359if_/http://www.open-std.org/jtc1/sc22/wg14/www/abq/c17_updated_proposed_fdis.pdf).
    It introduces no new language features, only technical corrections and
    clarifications to defects in C11.
  - **C11**: The former international standard which defined the C programming
    language, ISO/IEC 9899:2011, is available
    from [ISO](https://www.iso.org/standard/57853.html). You can obtain
    something very close to the standard for free because of the working drafts
    available, the closest
    is [N1570](https://www.open-std.org/jtc1/sc22/WG14/www/docs/n1570.pdf).
  - **C99**: An older standard ISO/IEC 9899:1999 is unavailable from official
    sources, due to the ISO adoption of C11. The closest free working draft is
    [N1256](https://www.open-std.org/jtc1/sc22/WG14/www/docs/n1256.pdf).
- For C++:
  - **Draft C++23**: Check the
    [C++ standard draft sources at GitHub](https://github.com/cplusplus/draft).
  - **C++20**: The current ISO C++ standard is officially known as _ISO
    International Standard ISO/IEC 14882:2020(E) &ndash; Programming Languages
    &ndash; C++_. You can get it from
    [ISO](https://www.iso.org/standard/79358.html),
    [IEC](https://webstore.iec.ch/publication/68285), or
    [ANSI](https://webstore.ansi.org/Standards/ISO/ISOIEC148822020). The closest
    free working document available is
    [N4868](https://github.com/cplusplus/draft/releases/download/n4868/n4868.pdf).
  - **C++17**: The former ISO C++ standard was officially known as
    _ISO International Standard ISO/IEC 14882:2017 &ndash; Programming languages
    &ndash; C++_. You can get it from
    [ISO](https://www.iso.org/standard/68564.html),
    [IEC](https://webstore.iec.ch/publication/62162), or
    [ANSI](https://webstore.ansi.org/Standards/ISO/ISOIEC148822017). The closest
    free working document available is
    [N4659](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2017/n4659.pdf).
  - **C++14**: An older ISO C++ standard was officially known as
    _ISO International Standard ISO/IEC 14882:2014 &ndash; Programming languages
    &ndash; C++_. You can get it from
    [ISO](https://www.iso.org/standard/64029.html), or
    [ANSI](<https://webstore.ansi.org/Standards/INCITS/INCITSISOIEC1488220142016>).
    The closest free working document available is
    [N4296](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2014/n4296.pdf).
  - **C++11**: An older ISO C++ standard was ISO/IEC 14882:2011. You can get it
    from [ISO](https://www.iso.org/standard/50372.html). The closest free
    working document available is
    [N3337](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2012/n3337.pdf).

In other programming languages, this could refer to the minimum (oldest) /
maximum (most recent) working version(s) of the corresponding compiler or
interpreter. Examples:

- Python interpreter above 2.7 and/or 3.4+.
- Matlab version above Release R2017a.
- The [Java Language Specification](https://docs.oracle.com/javase/specs/).

Ideally, a given software should be executable in a broad range of platforms,
even in those yet-to-be-released at the time the software was released. However,
this is not straightforward. For instance, Ubuntu (one of the most popular
GNU/Linux distributions) releases a new version of the OS every 6 months. Other
distributions such as Arch Linux and Gentoo Linux are rolling release systems,
making packages available to the distribution a short time (days or weeks) after
they are released upstream. Libraries' API change over time and, as a
consequence, software environments are constantly mutating and software building
or execution is likely to fail due to the API-breaking features introduced in
different OS versions. This also holds in the case of using scripting languages
(such as Matlab/Octave or Python), where this step is recommended in order to
check whether the code runs as expected in the different versions of the
language interpreter and associated packages shipped with different OS.

This issue can be addressed with
[Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration),
a concept firstly introduced by Booch[^Booch91] which consists of automating the
build and testing of code every time a researcher commits changes to the version
control system[^Duvall07]$$ ^{,} $$[^Humble11]$$ ^{,} $$[^Shanin17]. Continuous
Integration encourages developers to share their code and unit tests by merging
their changes into a shared version control repository after every small task
completion. Committing code triggers an automated build system to grab the
latest code from the shared repository and to build, test, and validate the
obtained numerical results. This helps to identify integration and
backward/forward compatibility problems as soon as the offending instruction is
committed or a new OS version appears, so they are easier to fix, and ensures
that code performs as expected in different environments.

In addition to the adherence to programming language standards and the set up of
a Continuous Integration system, maintainability in open source projects is also
related to the consistent observance of well-defined code formatting guidelines,
which help other developers to read and understand the source code without the
hassle of changing formatting styles along pieces written by different authors.
Automated tools for code formatting such as
[clang-format](https://clang.llvm.org/docs/ClangFormat.html) are highly
recommended.

## Indicators of Maintainability

It follows a list of possible maintainability indicators for a software-defined
GNSS receiver:

- Time to Fix Defects.
- Source code under a version control system.
- Well--established programming language.
- Availability of a Continuous Integration system.
- Availability of an issue tracking system.
- Availability of "debugging modes" and tools.
- Availability of static and dynamic code analysis tools.
- Definition of a source tree structure.
- Automated documentation system.
- Availability and observance of a coding style guide.
  - Availability of automated code formatting tools and corresponding
    configuration (_e.g._, availability of a `.clang-format` file).
- Availability of required and optional software dependencies (type of license,
  pricing, maintenance / development status).

## References

[^Booch91]: G. Booch, _Object Oriented Design With Applications_. New York, NY: Benjamin/Cummings Pub., 1991.

[^Duvall07]: P. Duvall, S. Matyas, and A. Glover, _Continuous Integration Improving Software Quality and Reducing Risk_. Upper Saddle River, NJ: Addison Wesley, 2007.

[^Humble11]: J. Humble and D. Farley, _Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation_. Upper Saddle River, NJ: Addison Wesley, 2011.

[^Shanin17]: M. Shanin, M. Ali Babar, and L. Zhu, [Continuous integration, delivery and deployment: A systematic review on approaches, tools, challenges and practices](https://ieeexplore.ieee.org/document/7884954/), IEEE Access, vol. 5, pp. 3909–3943, Mar. 2017, DOI: 10.1109/ACCESS.2017.2685629.

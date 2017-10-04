---
title: "6.- Maintainability"
permalink: /design-forces/maintainability/
excerpt: "The ease with which a product can be maintained in order to isolate and correct defects and cope with a changing environment."
header:
  teaser: /assets/images/design-force-teaser.png
last_modified_at: 2017-08-09T15:54:02-04:00
---

_Maintainability_ refers to the ease with which a product can be maintained in order to isolate and correct defects or their cause, repair or replace faulty or worn-out components without having to replace still working parts, prevent unexpected breakdowns, maximize a product's useful life, maximize efficiency, reliability, and safety, meet new requirements, make future maintenance easier, or cope with a changed environment.

Depending on the used programming language, maintainability is also related to the adherence to the official language programming standards. Examples:

  * For C:
    * **C11**: The international standard which defines the C programming language is available from [ISO](https://www.iso.org/standard/57853.html).  The current revision is ISO/IEC 9899:2011.  You can obtain something very close to the standard for free because of the working drafts available, the latest is [N1570](http://www.open-std.org/jtc1/sc22/WG14/www/docs/n1570.pdf).
    * **C99**: The former standard ISO/IEC 9899:1999 is unavailable from official sources, due to the ISO adoption of C11. The closest free working draft is [N1256](http://www.open-std.org/jtc1/sc22/WG14/www/docs/n1256.pdf).
  * For C++:
    * **Draft C++17**: Check the [C++ standard draft sources at Github](https://github.com/cplusplus/draft).
    * **C++14**: The current ISO C++ standard is officially known as _ISO International Standard ISO/IEC 14882:2014(E) – Programming Language C++_. You can get it from [ISO](https://www.iso.org/standard/64029.html) or [ANSI](https://webstore.ansi.org/RecordDetail.aspx?sku=INCITS/ISO/IEC+14882:2014+(2016)). The latest free working document available is [N4296](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2014/n4296.pdf).
    * **C++11**: The former ISO C++ standard was ISO/IEC 14882:2011. You can get it from [ISO](https://www.iso.org/standard/50372.html). The closest free working document available is [N3337](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2012/n3337.pdf).

In other programming languages, this could refer to the minimum (oldest) / maximum (most recent) working version(s) of the corresponding compiler or interpreter. Examples:
  * Python interpreter above 2.7 and/or 3.4.
  * Matlab version above Release R2017a.
  * The [Java Language Specification](https://docs.oracle.com/javase/specs/).

## Indicators of Maintainability

It follows a list of possible maintainability indicators for a software-defined GNSS receiver:

* Time to Fix Defects.
* Source code under a version control system.
* Well--established programming language.
* Automated build environments.
* Availability of an issue tracking system.
* Availability of "debugging modes" and tools.
* Availability of static and dynamic code analysis tools.
* Definition of a source tree structure.
* Automated documentation system.
* Availability and observance of a coding style guide.
* Availability of required and optional software dependencies (type of license, pricing, maintenance / development status).

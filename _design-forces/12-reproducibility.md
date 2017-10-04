---
title: "12.- Reproducibility"
permalink: /design-forces/reproducibility/
excerpt: "The ability of an entire experiment or study to be reproduced, either by the researcher or by someone else working independently."
header:
  teaser: /assets/images/design-force-teaser.png
last_modified_at: 2016-07-29T15:54:02-04:00
---

_Reproducibility_ refers to the ability of an entire experiment or study to be reproduced, either by the researcher or by someone else working independently. It is one of the main principles of the scientific method and relies on _ceteris paribus_ (other things being equal). When applied to software engineering, it has other additional implications such as in security (_i.e._, gaining confidence that a distributed binary code is indeed coming from a given verified source code).

## Indicators of Reproducibility

It follows a list of possible reproducibility indicators for a software-defined GNSS receiver:

* Meet the requirements of [Reproducible Builds](https://reproducible-builds.org), a set of software development practices which create a verifiable path from human readable source code to the binary code used by computers. This includes[^Bobbio15]:
  - The build system needs to be made entirely deterministic: transforming a given source must always create the same result. Typically, the current date and time must not be recorded and output always has to be written in the same order.
  - The set of tools used to perform the build and more generally the build environment should either be recorded or pre-defined.
  - Users should be given a way to recreate a close enough build environment, perform the build process, and verify that the output matches the original build.

* Availability of unique identifiers for each source code snapshot.
* Availability of a Digital Object Identifier (DOI) for source code releases.
* Uniquely identifiable and reportable receiver configuration.

-------



## References

[^Bobbio15]: J. Bobbio, [How to make your software build reproducibly](https://reproducible.alioth.debian.org/presentations/2015-08-13-CCCamp15.pdf), in Chaos Communication Camp, Mildenberg, Germany, 2015.

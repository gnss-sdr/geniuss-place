---
title: "12.- Reproducibility"
permalink: /design-forces/reproducibility/
excerpt:
  "The ability of an entire experiment or study to be reproduced, either by the
  researcher or by someone else working independently."
header:
  teaser: /assets/images/radar-chart.png
last_modified_at: 2018-04-06T15:54:02-04:00
---


An experiment involving a software-defined GNSS receiver is an experiment that
occurs in a computer system. A key aspect in order to obtain meaningful
conclusions from the experiments is _reproducibility_, which refers to the
ability of an entire experiment or study to be reproduced, either by the
researcher or by someone else working independently. It is one of the main
principles of the scientific method and relies on _ceteris paribus_ (other
things being equal). Publication of scientific theories, including experimental
and observational data on which they are based, permits others to scrutinize
them, replicate experiments, identify errors, support, reject or refine
theories, and reuse data for further understanding and knowledge. Facilitating
sustained and rigorous analysis of evidence and theory is the most rigorous form
of peer review, and contributes to science's powerful capacity for
self-correction[^Royal12]. However, it is well-known that today's computational
environments are complex, and accounting for all the possible effects of changes
within and across systems is a challenging task[^Vandewalle09]$$ ^{,}
$$[^Peng11].

In computer systems research, an experiment is defined by the workload, the
specific system where the workload runs, and the results from a particular
execution. Hence, reproducibility can be classified into:

  * **Workload reproducibility**, which requires access to the original code
  and the particular workload that was used to obtain the original experimental
  results;
  * **System reproducibility**, which requires access to hardware and software
  resources that resemble the original dependencies, including the set of
  hardware devices involved in the experiment such as the antenna, the radio
  frequency front-end, specific CPU models, possible computing off-loading
  devices and network elements, system configuration, as well as the entire
  software stack, from the firmware/kernel version up to the libraries used by
  the original experiment; and
  * **Results reproducibility**, the degree to which the results of the
  re-execution of an experiment are valid with respect to the original. This
  mainly depends on the specific nature of the experiment.

When applied to software engineering, reproducibility has other additional
implications such as in security (_i.e._, gaining confidence that a distributed
binary code is indeed coming from a given verified source code).


## Indicators of Reproducibility

It follows a list of possible reproducibility indicators for a software-defined
GNSS receiver[^Fernandez18]:

### Workload reproducibility

* For the source code:
  * Source code released under an [Open Source license](https://opensource.org/licenses).
  * Availability of a version control system providing a unique identifier to
  each source code snapshot (_e.g._, Git).
  * Public reading access to the upstream repository (for instance, via
  [GitHub](https://github.com) or [BitBucket](https://bitbucket.com)).
  * Availability of a Digital Object Identifier (DOI) for source code releases
  (for instance, provided by [Zenodo.org](https://zenodo.org/)).
  * Meet the requirements of [Reproducible Builds](https://reproducible-builds.org),
  a set of software development practices that create a verifiable path from
  human-readable source code to the binary code used by computers. This
  includes[^Bobbio15]:
    - The build system needs to be made entirely deterministic: transforming a
    given source must always create the same result. Typically, the current date
    and time must not be recorded and output always has to be written in the
    same order.
    - The set of tools used to perform the build and more generally the
    building environment should either be recorded or pre-defined.
    - Users should be given a way to recreate a close enough build environment,
    perform the build process, and verify that the output matches the original
    build.

* For the data set of signal samples:
  * Availability of data set(s).
  * Include a description of the location and date in which the GNSS signals
  were captured and a description of the surroundings as needed (nearby
  buildings and other scatterers, the possible presence of interference sources,
  and any other information considered relevant for the interpretation of the
  results).
    * A 360-degree picture taken from the antenna location for static
    receivers, or a 360-degree, time-tagged video for moving platforms could be
    informative in certain scenarios.
  * Description of datasets: see the metadata standard by the [ION GNSS SDR
  Standard Working Group](https://github.com/IonMetadataWorkingGroup).
    * Data collection topology (single/multi band, single/multi stream,
    single/multi file),
    * Sample resolution (number of bits per sample),
    * Encoding (sign, sign-magnitude, signed integer, offset binary, or
    floating-point),
    * Sampling frequency, possible intermediate frequency, and inverted
    spectrum indicator.

### System reproducibility

* Hardware description:
  * The antenna should be described by:
     * its manufacturer, identification number and type. In the case of
     multiple antennas, its geometrical arrangement must be provided;
     * the average antenna phase center relative to the antenna reference point
     (ARP) for each specific frequency band and satellite system,
     * the orientation of the antenna zero-direction as well as the direction
     of its vertical axis (bore-sight), if mounted tilted on a fixed station, or
     XYZ vector in a body-fixed system, in case of mounted on a moving platform
     (all units in meters).
     * If the antenna is physically apart from the front-end the cable category
     and length, as well as the connectors type, should be reported.
  * In the case of using an RF signal generator instead of live GNSS signals,
  its brand and model, as well as the complete set of configuration parameters,
  should be included in the experiment description.
  * The radio-frequency front-end:
    * In Open Design: sharing of schematics, bill of materials, printed circuit
    board layout data, etc.
    * When using commercial devices: report the brand, model and configuration.
    * If custom modifications were made to a commercially available front-end
    (for instance, replacing and/or disciplining the shipped local oscillator
    with a more stable clock), those modifications should be also clearly
    described.
  * In the case of using a sample set produced by a software-defined generator,
  its version and configuration should be included in the experiment
  description.
  * The processing platform:
     * Report of the processor architecture (_e.g._, i386, x86_64/amd64, armhf
     or arm64), manufacturer and type; the available RAM memory and, when
     relevant, the storage capacity.
     * If computing off-loading devices were used (such as FPGAs or GPUs), its
     vendor and model should be also specified.

* Software stack description:
  * Operating system (name and version).
  * Required, optional, and supporting libraries and binaries (name and
  version).
  * Uniquely identifiable and reportable receiver configuration.
  * Availability of virtualized images containing the whole software stack (can
  include data and scripts to generate figures):
    * Virtual machines.
    * Software containers (_e.g._, [Docker](https://www.docker.com/)).
  * Continuous analysis[^Beaulieu17]: process combining Docker containers with
  continuous integration to automatically re-run computational analysis whenever
  relevant changes are made to the source code.
  * Continuous reproducibility[^Fernandez18]: an automated pipeline that
  regenerates results described in a document (research paper, case study, etc.)
  whenever changes are made to the source code. This includes sharing the data
  set on which the experiments were done (usually, files containing raw GNSS
  signal samples and possibly other sensors), the full experiment configuration,
  and the scripts used to analyze the results and generate the figures or tables
  appearing in the document in which the results were presented.

### Results reproducibility

* Availability of measurements from external information sources (DGNSS,
A-GNSS, other sensors). Should be stored as part of workload data.

* When relevant, and in order to make the measurements as independent as
possible from the satellite geometry, measurements should be spread in an
interval of 8 hours.



-------



## References

[^Bobbio15]: J. Bobbio, [How to make your software build reproducibly](https://reproducible-builds.org/_lfs/presentations/2015-08-13-CCCamp15.pdf), in Chaos Communication Camp, Zehdenick, Germany, 2015.

[^Royal12]: The Royal Society, [Science as an open enterprise](https://royalsociety.org/topics-policy/projects/science-public-enterprise/report/), Report 02/12. London, UK, June 2012.

[^Vandewalle09]: P. Vandewalle, J. Kova&#x010D;evi‌&#263;, and M. Vetterli, [Reproducible research in signal processing](https://ieeexplore.ieee.org/document/4815541/). IEEE Signal Processing Magazine, Vol. 26, no. 3, pp. 37-47, May 2009.

[^Peng11]: R. D. Peng, [Reproducible research in computational science](https://www.science.org/doi/10.1126/science.1213847). Science, Vol. 334, no. 6060, pp. 1226–1227, Dec. 2011. DOI: 10.1126/science.1213847

[^Beaulieu17]: B. K. Beaulieu-Jones and C. S. Greene, [Reproducibility of computational workflows is automated using continuous analysis](https://www.biorxiv.org/content/early/2016/08/11/056473). Nature Biotechnology, Vol. 35, no. 4, pp. 342–346, Apr. 2017.

[^Fernandez18]: C. Fern&aacute;ndez-Prades, J. Vil&agrave;-Valls, J. Arribas and A. Ramos, [Continuous Reproducibility in GNSS Signal Processing](https://ieeexplore.ieee.org/document/8331069/), IEEE Access, Vol. 6, no. 1, pp. 20451-20463, Apr. 2018. DOI: 10.1109/ACCESS.2018.2822835

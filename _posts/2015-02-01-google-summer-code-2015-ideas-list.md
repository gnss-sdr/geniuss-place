---
title: "Google Summer of Code 2015 ideas list"
excerpt: "Ideas page for GSoC 2015."
header:
  teaser: /assets/images/logo-gsoc.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
redirect_from:
  - /documentation/google-summer-code-2015-ideas-list
  - /node/57
---

This year, GNSS-SDR is serving again as a mentoring organization for [Google Summer of Code](https://summerofcode.withgoogle.com/) (also known as GSoC), a global program that offers students stipends to write code for open source projects. In order to participate in the program, you must be a student. Google defines a student as an individual enrolled in or accepted into an accredited institution including (but not necessarily limited to) colleges, universities, masters programs, PhD programs and undergraduate programs. You should be prepared, upon request, to provide Google with transcripts or other documentation from your accredited institution as proof of enrollment or admission status. Computer Science does not need to be your field of study in order to participate in the program. You may be enrolled as a full-time or part-time student, and must be 18 years of age or older oon or before April 27, 2015 to be eligible to participate in Google Summer of Code in 2015.

If you are an eligible and interested student, read through the list and note the projects you are interested in. You, as the student programmer, then submit a proposal to Google, using the [GSoC 2015 website](https://summerofcode.withgoogle.com/). The application form will be open from March 16, 19:00 UTC until March 27, 16:00 UTC. We recommend you to submit your application early. By doing so, it will be given a greater share of attention than is possible for applications submitted at the last minute.

You might submit a proposal following the guidelines below, or you might want to adapt it. Changes to the proposal could include:

  * You think the project as suggested is too large and you can only feasibly complete part of it; if so, make sure your proposal covers a reasonable subset of the functionality (that is, something which is useful without the rest of the project being implemented).
  * You think the project as suggested is too small; in this case you might want to extend the idea, combine projects, etc.
  * You like the basic idea of the project but it is not such a good fit for the skills that you have; in this case please feel free to suggest an alternative, but try to remember that the idea is for the software to be useful for its existing and potential users.

Your proposal should include the following: your project proposal, why you would like to execute on this particular project, and the reason you are the best individual to do so. Your proposal should also include details of your academic, industry, and/or open source development experience, and other details as you see fit. An explanation of your development methodology and schedule is a good idea, as well. It is always helpful to include your contact information, as it will not be automatically shared with your would-be mentors as part of the proposal process.

Hereafter we list, in no particular order, some proposals for projects to be carried out by the students participating in GSoC 2015. This is by no means a closed list, so the students can feel free to propose alternative activities related to the project.



## GNSS SDR Metadata Standard implementation for automatic receiver configuration

### Description:

The past several years has seen a proliferation of software-defined radio (SDR) data collection systems and processing platforms that are particularly designed for Global Navigation Satellite System (GNSS) receiver applications or those that support GNSS bands. For post-processing, correctly interpreting the GNSS SDR sampled datasets produced or consumed by these systems has historically been a cumbersome and error-prone process. This is because these systems necessarily produce datasets of various formats, the subtleties of which are often lost in translation when communicating between the producer and consumer of these datasets. This specification standardizes the metadata associated with GNSS SDR sampled data files. The GNSS SDR Metadata Standard defines parameters and schema to fully express the contents of SDR sampled data files. The standard is designed to promote the interoperability of GNSS SDR data collection systems and processors. The standard includes a formal XML schema definition (XSD). A fully compliant open source C++ API is also officially supported to promote ease of integration into existing SDR systems (see [this presentation](https://www.ion.org/governance/upload/SDRWG-Report-1-25-15.pdf) and this [GitHub repository](https://github.com/IonMetadataWorkingGroup)). The work proposed here comprises the implementation of the required blocks in the GNSS-SDR architecture (i.e. a custom signal source and a custom set of signal conditioner) to enable the receiver to read both the signal files and the metadata information and automatically configure the signal parameters (i.e. sample rate, sample resolution and format, number of RF channels, center frequency and bandwidth). Currently these parameters are manually specified in configuration files.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework and/or the Universal Hardware Driver is a plus).

### Potential mentor(s):

Dr. Javier Arribas, Dr. Carle Fern&aacute;ndez-Prades



## BeiDou signal generation and acquisition

### Description:

Implementation of the signal generation and acquisition algorithms for BeiDou open service signals (B1I), following the examples already implemented for GPS L1 C/A and Galileo E1. This would set the basis of a multi-constellation receiver GPS+Galileo+BeiDou.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus, but not a requirement).

### Potential mentor(s):

Dr. Javier Arribas, Mr. Luis Esteve, Dr. Carles Fern&aacute;ndez-Prades

## Graphical User Interface for GNSS-SDR configuration

The configuration mechanism of GNSS-SDR allows users to define and configure each of the receiver's signal processing blocks in a single file. Those configuration files constitute full receiver definitions, since they specify the implementation and parameters to be used in the receiver chain. However, the configuration process is poorly documented and only few baseline examples are provided. The objective of this project is to create a Graphical User Interface for the generation of such configuration files, allowing for an intuitive, user-friendly software receiver definition.

### Skills required:

Good understanding of digital signal processing and C++ programming (familiarity with the GNU Radio framework and Qt is a plus).

### Potential mentor(s):

Dr. Javier Arribas, Mr. Luis Esteve, Dr. Carles Fern&aacute;ndez-Prades


## Tracking test cases and performance evaluation

### Description:

GNSS signal tracking is a complex process involving correlation, delay locked loops (DLLs), phase locked loops (PLL), lock detectors, etc. The objective of this project is the implementation of a set of test cases for the assessment of signal tracking blocks, including functional validation and performance assessment.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework and GoogleTest is a plus).

### Potential mentor(s):

Dr. Carles Fern&aacute;ndez-Prades, Dr. Javier Arribas, Mr. Luis Esteve


## Run-time partitioning of functions at an embedded SDR framework featuring hardware accelerators

### Description:

The FPGA-based System-On-Chip (SoC) devices is a powerful technology solution that combines an embedded microprocessor with FPGA-based logic and other hardened I/O peripherals at the same chip. Likewise, bit-intensive functions can be accelerated at the programmable logic area of the SoC device, whereas functions requiring programming flexibility are implemented at the embedded microprocessor . This type of devices has been evolving since their introduction over a decade ago and are able to host nowadays an embedded or real-time OS. The objective of this project will be to develop a flexible HW-SW function split at run-time targeting FPGA-based SoC devices (e.g., Xilinx Zynq) that takes advantage of pre-compiled SDR libraries (e.g., GNU Radio) and vendor specific pre-compiled FPGA processing blocks (e.g., Xilinx IPs) or open source cores (e.g., from the opencores project). The dynamic partitioning controller will (most likely) be a Linux kernel space application that defines which function is executed at the embedded microprocessor and which at the programmable logic area of the FPGA-based SoC device, according to instantaneous performance requirements or energy consumption constraints. These (emulated) decisions would be generated at a remote location and send via a secure connection to the SoC platform. Remote access to a Zynq-based hardware platform might be given for testing-debugging purposes if the candidate is not having one available. This idea can be considered an incremental one, since it is inspired by this GSoC'13 project, its continuation, and (possibly) its current status.


### Skills required:

Considering that this is a more multidisciplinary project idea, it will be required a good understanding of digital signal processing, exposure at an HDL language (Xilinx design-implementation flow preferred) , and very good embedded C/C++ programming skills (familiarity with the GNU Radio framework and Linux kernel programming will be highly desirable).

### Potential mentor(s):

Dr. Nikolaos Bartzoudis, Dr. Oriol Font


## Direct Position Estimation implementation

### Description:

Direct Position Estimation (DPE) is a new paradigm in the design of GNSS receivers. It mainly consists of solving the position fix by performing an optimization in the position domain, instead of the classical two-step approach in which the receiver computes a position after estimating the relative distance to a set of visible satellites, i.e., after synchronization. The objective of this project is to design and implement an open-loop variant of the DPE concept (if time allows, closing the loop would be considered). A legacy DLL/PLL-based receiver will coexist and a module computing the DPE solution should be implemented and validated. This would constitute the first attempt to implement DPE in a real GNSS receiver and has a novelty potential on its own. The main challenges in the implementation are in the algorithm implementation and the state-machine controlling the overall receiver. More information about DPE can be found at [this PhD Thesis](https://theses.eurasip.org/theses/310/bayesian-signal-processing-techniques-for-gnss/download/).

### Skills required:

Good understanding of digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus).


### Potential mentor(s):

Dr. Pau Closas, Dr. Carles Fern&aacute;ndez-Prades,

--------


## Proposal template:

  1. **Student's Name**
  2. **Email Address**
  3. **Name of the Project**
  4. **Summary**: Short statement about your intents (100 words approx.).
  5. **Benefits**: What are the benefits of your proposal?
  6. **Plan**: Describe your work plan in detail (tasks and schedule). Would there be blackout days (vacations, short jobs, etc.)?
  7. **Deliverables**: What are you going to deliver and when?
  8. **Communication**: How will you communicate with your mentor and the developers community?
  9. **Qualification**: Why you are the best candidate for this project?

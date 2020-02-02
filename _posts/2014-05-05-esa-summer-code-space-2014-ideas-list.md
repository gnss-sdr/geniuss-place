---
title: "ESA Summer of Code in Space 2014 ideas list"
excerpt: "Ideas page for SOCIS 2014."
header:
  teaser: http://www.esa.int/var/esa/storage/images/esa_multimedia/images/2015/03/socis/15309314-1-eng-GB/SOCIS_large.jpg
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
redirect_from:
  - /documentation/esa-summer-code-space-2014-ideas-list
---

ESA Summer of Code in Space 2014 ([SOCIS 2014](https://socis.esa.int/about/)) is a program run by the European Space Agency. It aims at offering student developers stipends to write code for various space-related open source software projects. Through SOCIS, accepted student applicants are paired with a mentor or mentors from the participating projects, thus gaining exposure to real-world software development scenarios. In turn, the participating projects are able to more easily identify and bring in new developers. To learn more about the program, check out the [timeline](https://socis.esa.int/timeline/), visit the [documentation center](https://socis.esa.int/frequently-asked-questions/), or head to its [mailing list](https://groups.google.com/forum/#!forum/esa-socis).

If you are an [eligible](https://socis.esa.int/frequently-asked-questions/#socis_elig_student_who) and interested student, read through the list and note the projects you are interested in. You, as the student programmer, then submit a proposal to ESA using the SOCIS 2014 website. The application form will be open until May 15. We recommend you to submit your application early. By doing so, it will be given a greater share of attention than is possible for applications submitted at the last minute.

You might submit a proposal following the guidelines below, or you might want to adapt it. Changes to the proposal could include:

  * You think the project as suggested is too large and you can only feasibly complete part of it; if so, make sure your proposal covers a reasonable subset of the functionality (that is, something which is useful without the rest of the project being implemented).
  * You think the project as suggested is too small; in this case you might want to extend the idea, combine projects, etc.
  * You like the basic idea of the project but it is not such a good fit for the skills that you have; in this case please feel free to suggest an alternative, but try to remember that the idea is for the software to be useful for its existing and potential users.

Your proposal should include the following: your project proposal, why you would like to execute on this particular project, and the reason you are the best individual to do so. Your proposal should also include details of your academic, industry, and/or open source development experience, and other details as you see fit. An explanation of your development methodology and schedule is a good idea, as well. It is always helpful to include your contact information, as it will not be automatically shared with your would-be mentors as part of the proposal process.

Hereafter we list, in no particular order, some proposals for projects to be carried out by the students participating in SOCIS 2014. This is by no means a closed list, so the students can feel free to propose alternative activities related to the project.

## Acceleration with VOLK

### Description:

The Vector-Optimized Library of Kernels ([VOLK](http://libvolk.org/)) is a software library introduced into GNU Radio in December, 2010 that provides developers with an interface to use Single Input - Multiple Data (SIMD) instructions, which are of special interest for operations that are in the receiver's critical path of processing load. In a nutshell, VOLK implements in assembly language optimized versions of computationally-intensive operations for different SIMD architectures commonly found in modern processors. Those processors providing SIMD instruction sets compute with multiple processing elements that perform the same operation on multiple data points simultaneously, thus exploiting data-level parallelism, and can be found in most desktop and laptop personal computers. The aim of this project is the implementation and validation of some particular operations that constitute the computational bottleneck for the execution of GNSS-SDR in real-time. The current implementations of Signal Acquisition and Tracking blocks work with VOLK proto-kernels defined with 32 bits per sample (_e.g._ `volk_32fc_x2_multiply_32fc.h`, `volk_32fc_conjugate_32fc.h`, etc), but it is well known that GNSS receivers can work with 8, 4, 2 and even 1 bit per sample. It is expected that implementations for such bit depths will dramatically alleviate the computational load and will accelerate the signal processing of the whole receiver, with an impact in the number of satellites that can be tracked in real-time.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus, but not a requirement).

### Potential mentor(s):

Dr. Carles Fern&aacute;ndez-Prades, Dr. Javier Arribas


## EGNOS/WAAS compatibility

### Description:

The European Geostationary Navigation Overlay Service ([EGNOS](http://www.egnos-portal.eu/)) and the North American Wide Area Augmentation System (WAAS) are Satellite Based Augmentation Systems (SBAS) that provide supplementary information for GPS, Glonass and Galileo systems by reporting on the reliability and accuracy of the positioning data. By receiving the SBAS information coming from EGNOS or WAAS satellites, a GNSS receiver can improve the position accuracy to 7.6 meters or better (for both lateral and vertical measurements), at least 95% of the time. The SBAS signals were designed for the compatibility with the existing GNSS hardware-based receivers by sharing the same Code Division Multiple Access (CDMA) modulation techniques. GNSS-SDR software receiver architecture allows the support of SBAS signals by adapting the existing acquisition, tracking, and telemetry decoding modules for GPS L1 (and thus obtain the SBAS navigation message). The goal of this project is twofold: _i_) the development of a [SISNeT](http://www.egnos-pro.esa.int/sisnet/index.html) client to retrieve EGNOS data in real-time form the Internet, and _ii_) to integrate such information in the PVT solution, taking advantage of SBAS-assisted navigation.


### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus, but not a requirement).

### Potential mentor(s):

Dr. Javier Arribas, Dr. Carles Fern&aacute;ndez-Prades


## Adaptive and robust tracking techniques

Tracking of synchronization parameters (i.e., time-delay and carrier phase) is a key stage in the core of any GNSS receiver. The current tracking block implementations, which are fully operational for both GPS L1 and Galileo E1 bands, are based on traditional tracking architectures (e.g., DLL, PLL and FLL). These techniques are prone to fail in non-nominal propagation conditions such as high-dynamics, shadowing, strong fadings, multipath effects or ionospheric scintillation.

The main goal of this project is twofold: _i_) to develop and integrate into the GNSS-SDR core efficient and robust tracking techniques, ranging from advanced and cooperative loops to adaptive Kalman filters for joint time-delay/carrier phase estimation; and _ii_) to test and compare the performance of these techniques using real signals with the traditional architectures.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus, but not a requirement).

### Potential mentor(s):

Dr. Jordi Vil&agrave;-Valls, Dr. Pau Closas



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

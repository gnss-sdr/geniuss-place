---
title: "Google Summer of Code 2014 ideas list"
excerpt: "Ideas page for GSoC 2014."
header:
  teaser: logo-gsoc.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
redirect_from:
  - /documentation/g​oogle-summer-code-2014-ideas-list
  - /node/55
---

This year, GNSS-SDR is serving again as a mentoring organization for [Google Summer of Code](https://www.google-melange.com/archive/gsoc/2014){:target="_blank"} (also known as GSoC), a global program that offers students stipends to write code for open source projects. In order to participate in the program, you must be a student. Google defines a student as an individual enrolled in or accepted into an accredited institution including (but not necessarily limited to) colleges, universities, masters programs, PhD programs and undergraduate programs. You should be prepared, upon request, to provide Google with transcripts or other documentation from your accredited institution as proof of enrollment or admission status. Computer Science does not need to be your field of study in order to participate in the program. You may be enrolled as a full-time or part-time student, and must be 18 years of age or older oon or before April 21, 2014 to be eligible to participate in Google Summer of Code in 2014.

If you are an eligible and interested student, read through the list and note the projects you are interested in. You, as the student programmer, then submit a proposal to Google, using the [GSoC 2014 website](https://www.google-melange.com/archive/gsoc/2014){:target="_blank"}. The application form will be open from March 10, 19:00 UTC until March 21, 19:00 UTC. We recommend you to submit your application early. By doing so, it will be given a greater share of attention than is possible for applications submitted at the last minute.

You might submit a proposal following the guidelines below, or you might want to adapt it. Changes to the proposal could include:

  * You think the project as suggested is too large and you can only feasibly complete part of it; if so, make sure your proposal covers a reasonable subset of the functionality (that is, something which is useful without the rest of the project being implemented).
  * You think the project as suggested is too small; in this case you might want to extend the idea, combine projects, etc.
  * You like the basic idea of the project but it is not such a good fit for the skills that you have; in this case please feel free to suggest an alternative, but try to remember that the idea is for the software to be useful for its existing and potential users.

Your proposal should include the following: your project proposal, why you would like to execute on this particular project, and the reason you are the best individual to do so. Your proposal should also include details of your academic, industry, and/or open source development experience, and other details as you see fit. An explanation of your development methodology and schedule is a good idea, as well. It is always helpful to include your contact information, as it will not be automatically shared with your would-be mentors as part of the proposal process.

Hereafter we list, in no particular order, some proposals for projects to be carried out by the students participating in GSoC 2014. This is by no means a closed list, so the students can feel free to propose alternative activities related to the project.



## Receiver buffer overrun protection and accurate signal sample timestamping using VITA 49 protocol

### Description:

TOne of the most common and undesirable event in a real-time software defined receiver is the sample buffer overrun situation. The problem occurs when the host machine eventually consumes signal samples at a lower speed than the hardware driver produces. If the sample buffer fills up, then the hardware driver start to discard signal samples. This transitory event can be caused by the multitasking nature of the host operating system, specially in slow machines when they are also used to concurrently run other user programs, such as GPS navigation displays and mapping software. The immediate effect of discarding a sample is that all the signal tracking loops in the GNSS-SDR receiver loss their lock to the satellite signals due to an unexpected shift in the CDMA synchronization process. The [VITA 49](http://www.vita.com/) Radio Transport (VRT) is an emerging standard for SDR signal samples transport protocol. Prior to the development of the VRT standard, each SDR RF front-end manufacturer developed custom and proprietary digitized data formats and metadata formats. A remarkable feature of the VRT protocol is the ability to provide accurate timestamping of the signal samples. The idea behind this project is to exploit the sample timestamp information provided by VRT 49 protocol to detect buffer overruns and feed the tracking loops with a prediction of the CDMA synchronization parameters shift according to the amount of missed samples, and thus providing continuity to the tracking process without falling back again into signal acquisition. The goal is to implement the support for the GNU Radio Universal Hardware Driver (UHD) with VRT sample streaming in GNSS-SDR and the buffer overrun protection algorithm.

Student tasks:

  * Understand the GNSS-SDR architecture: Signal source, signal conditioner and tracking blocks.
  * Understand the GNU Radio support for VRT 49 protocol and the sample metadata [API](http://gnuradio.org/doc/doxygen/page_metadata.html) using the Universal Hardware Driver (UHD).
  * Write a new GNSS-SDR file signal source with sample metadata support for post processing.
  * Write a new GNSS-SDR UHD signal source with sample metadata support for real-time operation.
  * Update the existing tracking blocks to include the buffer overrun situation detector and implement the protection algorithm.
  * Evaluate the performance.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus, but not a requirement).

### Potential mentor(s):

Dr. Javier Arribas


## Expanding the receiver to GLONASS and BeiDou

### Description:

Objective by the end of the summer: To provide a working implementation of a GNSS receiver (working with GLONASS or COMPASS signals), delivering RINEX files (the standard input of geodesic software libraries for high—accuracy positioning) and an on-the-fly navigation solution (that is, computation of position, velocity and time of the user’s receiver).

  * Implementation of acquisition algorithms for either GLONASS or BeiDou, following the examples already implemented for GPS L1 C/A and Galileo E1. This would facilitate research on truly multi-constellation receivers (e.g., GPS+GLONASS) working with real signals.
  * Demodulation of the navigation message for either GLONASS / COMPASS, opening the door to open innovation in multi-constellation receivers and addressing topics such as integrity, reliability, robustness, enhanced coverage, and high-accuracy positioning.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework and/or the Universal Hardware Driver is a plus).

### Potential mentor(s):

Dr. Javier Arribas, Dr. Pau Closas, Dr. Jordi Vil&agrave;



## Acceleration with VOLK

### Description:

The Vector-Optimized Library of Kernels ([VOLK](http://gnuradio.org/redmine/projects/gnuradio/wiki/Volk)) is a software library introduced into GNU Radio in December, 2010 that provides developers with an interface to use Single Input - Multiple Data (SIMD) instructions, which are of special interest for operations that are in the receiver's critical path of processing load. In a nutshell, VOLK implements in assembly language optimized versions of computationally-intensive operations for different SIMD architectures commonly found in modern processors. Those processors providing SIMD instruction sets compute with multiple processing elements that perform the same operation on multiple data points simultaneously, thus exploiting data-level parallelism, and can be found in most desktop and laptop personal computers. The aim of this project is the implementation and validation of some particular operations that constitute the computational bottleneck for the execution of GNSS-SDR in real-time. The current implementations of Signal Acquisition and Tracking blocks work with VOLK proto-kernels defined with 32 bits per sample (_e.g._ `volk_32fc_x2_multiply_32fc.h`, `volk_32fc_conjugate_32fc.h`, etc), but it is well known that GNSS receivers can work with 8, 4, 2 and even 1 bit per sample. It is expected that implementations for such bit depths will dramatically alleviate the computational load and will accelerate the signal processing of the whole receiver, with an impact in the number of satellites that can be tracked in real-time.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus, but not a requirement).

### Potential mentor(s):

Dr. Carles Fern&aacute;ndez-Prades, Dr. Javier Arribas


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

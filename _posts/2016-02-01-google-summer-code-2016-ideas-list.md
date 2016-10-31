---
title: "Google Summer of Code 2016 ideas list"
excerpt: "Ideas page for GSoC 2016"
header:
  teaser: logo-gsoc.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
redirect_from:
  - /documentation/g​oogle-summer-code-2016-ideas-list
  - /node/59
---

This year, GNSS-SDR is serving again as a mentoring organization for [Google Summer of Code](https://developers.google.com/open-source/gsoc/){:target="_blank"} (also known as GSoC), a global program that offers students stipends to write code for open source projects. In order to participate in the program, you must be a student. Google defines a student as an individual enrolled in or accepted into an accredited institution including (but not necessarily limited to) colleges, universities, masters programs, PhD programs and undergraduate programs. You should be prepared, upon request, to provide Google with transcripts or other documentation from your accredited institution as proof of enrollment or admission status. Computer Science does not need to be your field of study in order to participate in the program. You may be enrolled as a full-time or part-time student, and must be 18 years of age or older oon or before April 27, 2015 to be eligible to participate in Google Summer of Code in 2015.

If you are an eligible and interested student, read through the list and note the projects you are interested in. You, as the student programmer, then submit a proposal to Google, using the [GSoC 2016 website](https://summerofcode.withgoogle.com/){:target="_blank"}. The application form will be open from March 14, 19:00 UTC until March 25, 19:00 UTC. We recommend you to submit your application early. By doing so, it will be given a greater share of attention than is possible for applications submitted at the last minute.

You might submit a proposal following the guidelines below, or you might want to adapt it. Changes to the proposal could include:

  * You think the project as suggested is too large and you can only feasibly complete part of it; if so, make sure your proposal covers a reasonable subset of the functionality (that is, something which is useful without the rest of the project being implemented).
  * You think the project as suggested is too small; in this case you might want to extend the idea, combine projects, etc.
  * You like the basic idea of the project but it is not such a good fit for the skills that you have; in this case please feel free to suggest an alternative, but try to remember that the idea is for the software to be useful for its existing and potential users.

Your proposal should include the following: your project proposal, why you would like to execute on this particular project, and the reason you are the best individual to do so. Your proposal should also include details of your academic, industry, and/or open source development experience, and other details as you see fit. An explanation of your development methodology and schedule is a good idea, as well. It is always helpful to include your contact information, as it will not be automatically shared with your would-be mentors as part of the proposal process.

Hereafter we list, in no particular order, some proposals for projects to be carried out by the students participating in GSoC 2016. This is by no means a closed list, so the students can feel free to propose alternative activities related to the project.



## GNSS-SDR portability to Android devices

### Description:

he GNSS-SDR software receiver is swiftly reaching a mature state. The current stable version fully support the most popular GNSS systems such as GPS and Galileo and it can be compiled in both Intel and ARM platforms. Lately, efforts have been made on optimizing some specific signal processing functions by using vector operators (SIMD instructions). In that sense, besides the Intel accelerators (i.e. SSE2, SSE3, AVX), we developed ARM NEON accelerators that enables GNSS-SDR run in real-time on embedded devices for the first time. This was an important milestone because it enables the use of GNSS-SDR when a high precision solution is required in lightweight, low-cost, and low-powered devices for embedded applications such as vehicle tracking, UAV positioning, and IoT devices positioning. With state-of-the-art technology platforms, specially multicore ARM processors, now it is time to go further and port GNSS-SDR to the Android operating system, and evaluate the possibilities of the revolutionary SDR technology in the most popular mass market devices.

The project main goals are:

  1. Explore the Android NDK toolset to evaluate the available options to compile GNSS-SDR on the Android ARM-based platform without losing the current NEON accelerators. Perform the required modifications on CMake and/or the GNSS-SDR source code. Check the compatibility and portability of the library dependences and, if there is broken dependencies, then disable the affected (hopefully non-essential) features in GNSS-SDR.
  2. Create a basic Android app wrapping GNSS-SDR and providing a simple GUI interface to run the receiver, showing basic reception parameters such as the real-time position or number of available satellites and its signal level.
  3. In order to bring real-time GNSS signal samples to the receiver, the student will explore the options to communicate GNSS-SDR running in Android with front-end devices such as RTLSDR and USRPs using the USB On the Go (OTG) port available on the smartphone or via wireless.
  4. Additionally, explore the options to link GNSS-SDR with Real Time Kinematic libraries (i.e. RTKLIB) to enable high precision positioning.

### Skills required:

Good understanding of Android’s architecture and the NDK toolset. Familiarity with CMake and C++ programming skills are essential. Familiarity with the GNU Radio framework is a plus.

### Potential mentor(s):

Dr. Javier Arribas, Dr. Carle Fern&aacute;ndez-Prades



## BeiDou signal tracking

### Description:

Implementation of the signal tracking algorithms for BeiDou open service signals (B1I), following the examples already implemented for GPS L1 C/A and Galileo E1. This would set the basis of a multi-constellation receiver GPS+Galileo+BeiDou.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus, but not a requirement).

### Potential mentor(s):

Dr. Javier Arribas, Mr. Luis Esteve, Dr. Carles Fern&aacute;ndez-Prades

## Graphical User Interface for GNSS-SDR configuration

The configuration mechanism of GNSS-SDR allows users to define and configure each of the receiver’s signal processing blocks in a single file. Those configuration files constitute full receiver definitions, since they specify the implementation and parameters to be used in the receiver chain. However, the configuration process is poorly documented and only few baseline examples are provided. The objective of this project is to create a Graphical User Interface for the generation of such configuration files, allowing for an intuitive, user-friendly software receiver definition.

### Skills required:

Good understanding of digital signal processing and C++ programming (familiarity with the GNU Radio framework and Qt is a plus).

### Potential mentor(s):

Dr. Javier Arribas, Mr. Luis Esteve, Dr. Carles Fern&aacute;ndez-Prades


## GLONASS signal generation and acquisition

### Description:

Implementation of the signal generation and acquisition algorithms for GLONASS, following the examples already implemented for GPS L1 C/A and Galileo E1. This would set the basis of a multi-constellation receiver GPS+Galileo+BeiDou+GLONASS.


### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework and/or the Universal Hardware Driver is a plus).

### Potential mentor(s):

Dr. Javier Arribas, Mr. Luis Esteve, Dr. Carles Fern&aacute;ndez-Prades


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

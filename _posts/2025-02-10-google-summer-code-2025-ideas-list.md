---
title: "Google Summer of Code 2025 ideas list"
excerpt: "Ideas page for GSoC 2025."
header:
  teaser: /assets/images/logo-gsoc.png
tags:
  - news  
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2025-02-09T06:08:02+02:00
---

This year, GNSS-SDR is serving again as a mentor organization for [Google
Summer of Code](https://summerofcode.withgoogle.com/) (also known as GSoC), a
global program that offers contributors stipends to write code for open source
projects. You must be at least 18 years old and must be eligible
to work in your country of residence during the duration of the program to be
eligible to participate in Google Summer of Code in 2025.

If you are an eligible and interested contributor, read through the list and note
the projects you are interested in. You, as the contributor programmer, then submit
a proposal to Google, using the [GSoC 2025
website](https://summerofcode.withgoogle.com/). The application form for
contributors will be open from March 24, 18:00 UTC, until April 8 at 18:00 UTC. We recommend
you to submit your application early. By doing so, it will be given a greater
share of attention than is possible for applications submitted at the last
minute.

You might submit a proposal following the guidelines below, or you might want to
adapt them to your needs. Changes to the proposal could include:

  * You think the project as suggested is too large and you can only feasibly
  complete part of it; if so, make sure your proposal covers a reasonable subset
  of the functionality (that is, something which is useful without the rest of
  the project being implemented).

  * You think the project as suggested is too small; in this case, you might
  want to extend the idea, combine projects, etc.

  * You like the basic idea of the project but it is not such a good fit for
  the skills that you have; in this case please feel free to suggest an
  alternative, but try to remember that the idea is for the software to be
  useful for its existing and potential users.

Your proposal should include the following: your project proposal, why you would
like to execute on this particular project, and the reason you are the best
individual to do so. Your proposal should also include details of your academic,
industry, and/or open-source development experience, and other details as you
see fit. An explanation of your development methodology and schedule is a good
idea, as well. It is always helpful to include your contact information, as it
will not be automatically shared with your would-be mentors as part of the
proposal process.

  Hereafter we list, in no particular order, some proposals for projects to be
  carried out by the contributors participating in GSoC 2025. **This is by no means
  a closed list, so the contributors can feel free to propose alternative activities
  related to GNSS-SDR. Original topics for proposals are especially welcome and
  use to be highly ranked.**
  {: .notice--info}

-------

&nbsp;

&nbsp;

## Project Title: WAAS
### Description:

**Large-sized project (350 h)**

This Google Summer of Code (GSoC) project focuses on advancing the functionalities of GNSS-SDR receivers related to WAAS.

The primary goal for the summer is to provide a working implementation of a GNSS-SDR receiver working with WAAS signals: Signal acquisition and tracking algorithms for their specific signals. The outcome should be a robust GNSS receiver capable of delivering RINEX-B files and real-time navigation solutions including SBAS information.

Implement acquisition and tracking algorithms for WAAS signals, following the examples already implemented for other GNSS signals. This would facilitate research on precise positioning, safety positioning and drone-related activities working with real signals. Demodulation of the navigation message, opening the door to open innovation in multi-constellation receivers.

### Required skills:
Basic knowledge of digital signal processing and proficiency in C++ programming are essential. Familiarity with the GNU Radio framework or GNSS-SDR is considered a valuable plus.

### Potential mentor(s):
Miguel Ángel Gómez, Luis Esteve, Javier Arribas.

-------


&nbsp;

&nbsp;
## Project Title: Sensor Fusion
### Description:

**Large-sized project (350 h)**

This Google Summer of Code initiative aims to enhance sensor fusion capabilities between GNSS (Global Navigation Satellite System) and other sensors. The goal is to develop a functional GNSS receiver capable of integrating additional sensor data into its architecture, generating RINEX files, and enabling real-time navigation solutions—providing on-the-fly computation of position, velocity, and time. The fusion of GNSS signals with data from new sensors will leverage state-of-the-art AI techniques, such as Bayesian filters (e.g., Kalman filters and particle filters), graph neural networks (GNNs), and transformers for spatiotemporal data modeling. These methods will enhance research on sensor fusion, precise positioning, and urban canyon navigation using real-world signals.

Integrating additional sensors into GNSS receivers is a key step in advancing next-generation multi-constellation systems. This innovation fosters open research and development while addressing critical challenges such as integrity, reliability, robustness, extended coverage, and high-accuracy positioning.

### Required skills:
Applicants should possess a fundamental understanding of digital signal processing and demonstrate proficiency in C++ programming. Knowledge of GNSS principles and prior experience with sensor fusion, particularly between GNSS and INS, will be advantageous.

### Potential mentor(s):
Miguel Ángel Gómez.

-------

&nbsp;

&nbsp;


## Project Title: Vector Tracking

### Description:

Large-sized project (350 h)

This Google Summer of Code initiative aims to enhance vector tracking capabilities between GNSS (Global Navigation Satellite System). The goal is to develop a functional GNSS-SDR receiver capable of performing Vector Tracking. It is well-known that the use of Vector Tracking Loops (VTL) in GNSS receivers can result in improved tracking performance and sensitivity, faster acquisition, and improved interference robustness. This project leads to a real-time SDR GNSS VTL receiver capable of working with different COTS front-ends.  These methods will enhance research on sensor fusion, precise positioning, and urban canyon navigation using real-world signals.

## Required skills:

Applicants should possess a fundamental understanding of digital signal processing and demonstrate proficiency in C++ programming. Knowledge of GNSS principles and prior experience with sensor fusion, particularly between GNSS and INS, will be advantageous.

## Potential mentor(s):

Miguel Ángel Gómez.

-------

&nbsp;

&nbsp;

## Project Title: Improving the volk-gnsssdr library
### Description:

**Medium project (175 h)**

This project aims to improve [volk-gnsssdr](https://github.com/gnss-sdr/gnss-sdr/tree/next/src/algorithms/libs/volk_gnsssdr_module/volk_gnsssdr), the Vector-Optimized Library of Kernels for GNSS-SDR. This library provides SIMD-optimized implementations of essential signal processing functions (named *kernels* in this context) for efficient execution on modern processors.


* **Objectives:** During the summer, the focus will be on:

  - Identifying performance-critical kernels that significantly impact GNSS-SDR execution speed.
  - Implementing missing SIMD optimizations by adding NEON (for ARM architectures) and RISC-V vector extensions to existing kernels.
  - Benchmarking and validating improvements to ensure enhanced performance and correctness across different hardware platforms. *No physical access to those hardware platforms is required.*
* **Expected outcomes:** By the end of the project, volk-gnsssdr will have broader SIMD coverage, improving the efficiency of GNSS-SDR on ARM and RISC-V architectures, making it more portable and performant for diverse GNSS applications.


### Required skills:
Applicants should have a solid understanding of numerical computations and be proficient in C programming.

### Potential mentor(s):
Carles Fernández-Prades.

---------

&nbsp;

&nbsp;

## Project Title: Galileo E5 implementation in GNSS-SDR with RFSoC front-end

### Description:

**Large-sized project (350 h)**

The Galileo E5 signal is one of the key signals used in the European Galileo Global Navigation Satellite System (GNSS). It operates in the 1164–1215 MHz frequency band and is divided into two main components:

  - E5a (1164–1189 MHz) – Aligned with GPS L5 for interoperability.
  - E5b (1189–1214 MHz) 

Currently GNSS-SDR is able to use only the E5a / E5b signal component as different signals. However, if both components are processed together, a number of benefits arise:

 1. **Higher Accuracy** – Utilizes a wide bandwidth (50 MHz), providing better resolution and positioning precision.
 2. **Robust Multipath Resistance** – Reduces signal reflection errors, making it more reliable in urban environments due to better autocorrelation properties.
 3. **Improved Signal Penetration** – Offers better performance in challenging environments (e.g., forests, cities).
 4. **Lower Noise and Jamming Resistance** – The AltBOC (Alternative Binary Offset Carrier) modulation adds resilience against interferences

This makes E5 ideal for high-precision applications, including aviation, geodesy, and autonomous navigation.

In order to implement a new signal processing chain in GNSS-SDR, it is required to create the following new GNSS-SDR processing blocks:

* Galileo E5 acquisition
* Galileo E5 tracking
* Galileo E5 telemetry decoding


### Required skills:
Basic knowledge of digital signal processing and proficiency in C++ programming are essential. Familiarity with the GNU Radio framework or GNSS-SDR is considered a valuable plus.

### Potential mentor(s):
Javier Arribas.

---------

&nbsp;

&nbsp;

## Project Title: Enhancing GNSS-SDR’s PVT engine with DGNSS support via RTCM corrections

### Description:

**Large-sized project (350 h)**

This project aims to enhance the Position, Velocity, and Time (PVT) engine of GNSS-SDR by improving its handling of Differential GNSS (DGNSS) corrections using RTCM messages. While GNSS-SDR already integrates RTKLIB, its real-time correction capabilities can be expanded to process RTCM-based corrections more efficiently, improving positioning accuracy in degraded GNSS environments.

* Benefits to the Community
  - Accurate positioning is critical for applications such as autonomous navigation, surveying, and georeferencing. By enhancing GNSS-SDR’s PVT engine to incorporate real-time RTCM corrections from base stations, users will gain access to a fully open-source software-defined radio (SDR) receiver capable of precise positioning without proprietary solutions. This will make GNSS-SDR a more competitive and accessible tool for research and development.

* Technical Details
  - Modify GNSS-SDR’s PVT engine to properly integrate real-time corrections from RTCM sources.
  - Implement support for key RTCM messages (e.g., MSM, ionospheric corrections, and base station coordinates).
  - Optimize the processing pipeline to minimize latency in differential corrections application.

* Expected Impact
  - This project will enable GNSS-SDR to function as a robust open-source DGNSS-capable receiver, improving its usability for high-precision GNSS applications.

### Required skills:
C++ and Python programming. GNSS signal processing and PVT computation. RTCM protocol and DGNSS principles. Software-defined radio (SDR) development.


### Potential mentor(s):
Javier Arribas, Carles Fernandez, Miguel Ángel Gómez


---------

&nbsp;

&nbsp;

# Proposal submission
Please provide in your proposal the information listed down below. Text
formatting is up to you, but be sure to include those sections. Other additions
are welcome if relevant.
{: .notice--info}

## Proposal template:

  1. **Student's Name**
  2. **Email Address**
  3. **Name of the Project**
  4. **Summary**: Short statement about your intents (100 words approx.).
  5. **Benefits**: What are the benefits of your proposal?
  6. **Plan**: Describe your work plan in detail (tasks and schedule). Would
  there be blackout days (vacations, short jobs, etc.)?
  7. **Deliverables**: What are you going to deliver and when?
  8. **Communication**: How will you communicate with your mentor and the
  developers community?
  9. **Qualification**: Why you are the best candidate for this project?

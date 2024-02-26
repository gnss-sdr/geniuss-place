---
title: "Google Summer of Code 2024 ideas list"
excerpt: "Ideas page for GSoC 2024."
header:
  teaser: /assets/images/logo-gsoc.png
tags:
  - news  
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2024-02-21T06:08:02+02:00
---


This year, GNSS-SDR is serving again as a mentor organization for [Google
Summer of Code](https://summerofcode.withgoogle.com/) (also known as GSoC), a
global program that offers contributors stipends to write code for open source
projects. You must be at least 18 years old and must be eligible
to work in your country of residence during duration of the program to be
eligible to participate in Google Summer of Code in 2024.

If you are an eligible and interested contributor, read through the list and note
the projects you are interested in. You, as the contributor programmer, then submit
a proposal to Google, using the [GSoC 2024
website](https://summerofcode.withgoogle.com/). The application form for
contributors will be open from March 18, 18:00 UTC, until April 2 at 19:00 UTC. We recommend
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
  carried out by the contributors participating in GSoC 2024. **This is by no means
  a closed list, so the contributors can feel free to propose alternative activities
  related to GNSS-SDR. Original topics for proposals are especially welcome and
  use to be highly ranked.**
  {: .notice--info}

-------


## Project Title: Integration of SBAS (EGNOS/WAAS) in GNSS-SDR
### Description:

**Large-sized project (350 h)**

This Google Summer of Code (GSoC) project focuses on advancing the
functionalities of GNSS receiver related to EGNOS (European Geostationary
Navigation Overlay Service).

The primary goal for the summer is to provide a working implementation of a GNSS
receiver working with EGNOS/WAAS signals: Signal acquisition and tracking
algorithms for their specific signals. The outcome should be a robust GNSS
receiver capable of delivering RINEX files and real-time navigation solutions.

Implement acquisition and tracking algorithms for EGNOS/WAAS signals, following
the examples already implemented for other GNSS signals. This would facilitate
research on the ionosphere, precise positioning and drone-related activities
working with real signals. Demodulation of the navigation message, opening the
door to open innovation in multi-constellation receivers. Integration of
EGNOS/WAAS observables into the PVT position.

### Required skills:
Basic knowledge of digital signal processing and
proficiency in C++ programming are essential. Familiarity with the GNU Radio
framework or GNSS-SDR is considered a valuable plus. 

### Potential mentor(s):
Miguel Ángel Gómez, Luis Esteve, Javier Arribas.

-------

## Project Title: Sensor Fusion
### Description:

**Large-sized project (350 h)**

This Google Summer of Code initiative focuses on advancing sensor fusion
capabilities between GNSS (Global Navigation Satellite System) and INS (Inertial
Navigation System). The objective is to develop a functional implementation of a
GNSS receiver capable of introducing another sensor information in the GNSS
receiver architecture, delivering RINEX files and enabling on-the-fly navigation
solutions, encompassing real-time computation of position, velocity, and time.
This data (new sensors and GNSS signal) would be fused using state of the art
methods, based in AI (*i.e.*, ANN and VAE for dimensionality reduction).  This would
facilitate research on sensor fusion, precise positioning and urban cannon,
working with real signals.

The addition of sensors to the receiver is a cornerstone in the development of
new receivers, opening the door to open innovation in multi-constellation
receivers and addressing topics such as integrity, reliability, robustness,
enhanced coverage, and high-accuracy positioning.

### Required skills:

Applicants should possess a fundamental understanding of
digital signal processing and demonstrate proficiency in C++ programming.
Knowledge of GNSS principles and prior experience with sensor fusion,
particularly between GNSS and INS, will be advantageous. 

### Potential mentor(s):
Miguel Ángel Gómez.

-------

## Project Title: GNSS-SDR with pynq RFSoC
### Description:

**Large-sized project (350 h)**

In recent years, Software Defined Radio (SDR) has gained significant momentum.
For the first time, there are fully functional commercial solutions for various
SDR systems in the fields of communications and positioning systems based
entirely on signal processing in a general-purpose Central Processing Unit
(CPU). The use of a direct conversion analog front-end (zero IF) to receive the
RF signal is still the most common solution to feed the SDR receiver with the
digitized baseband signal. The future of SDR involves a direct sampling of the
RF signal with extremely fast ADC converters (in the order of Giga Samples per
second) integrated into a System-on-Chip (SoC). This SoC consists of an FPGA
tightly coupled with a multi-core ARM CPU. The project proposed here aims to
explore the capabilities of an SDR system based on the Xilinx Zynq UltraScale+
RFSoC chip kit [1] with an innovative programming environment that blends Python
and synthesizable C++ modules on the FPGA using Xilinx's intelligent compiler
(Vitis_hls). The contributor work has a substantial practical component with the
RFSoC 4x2 board installed at the Telecommunications Technological Center of
Catalonia (CTTC) on the PMT campus in Castelldefels, capable of being operated
remotely.

The contributor will begin by familiarizing themselves with the Python
environment for RFSoC, C++ processing modules, and GNURadio. They will conduct
tests with real RF signals using available code examples. Once this is achieved,
the final objective of the project will be to achieve the reception and
processing of multi-band Global Navigation Satellite Systems (GNSS) signals with
the open-source GNSS-SDR software, taking the digital baseband from the RFSoC.
This is a research project with the potential to generate publishable results in
scientific conferences or journals. More information about the RFSoC Software
environment can be found here: http://www.rfsoc-pynq.io/

### Required skills:

- Basic knowledge of radio communications technologies and SDR.
- Knowledge of Python and C++.
- Basic knowledge of Linux OS.

[1] https://www.xilinx.com/support/university/xup-boards/RFSoC4x2.html 

### Potential mentor(s):
Javier Arribas.


-------

## Project Title: Expanding the receiver to BEIDOU B2a
### Description:

**Medium-sized project (175h)**

This is a continuation of efforts developed during GSoC 2019. The code needs
updates, some bug fixing, and improve over existing algorithms.

The objective by the end of the summer is to provide a working implementation of
a GNSS receiver working with [Beidou B2a
signals](https://gnss-sdr.org/docs/tutorials/gnss-signals/#beidou-b2a),
delivering RINEX files (the standard input of geodesic software libraries for
high—accuracy positioning) and an on-the-fly navigation solution (that is,
computation of position, velocity and time of the user’s receiver).

- Implementation of acquisition and tracking algorithms for Beidou B2a signals,
  following the examples already implemented for other GNSS signals. This would
  facilitate research on multi-constellation, multi-frequency receivers (*e.g.*,
  GPS + Galileo + Beidou) working with real signals.

- Demodulation of the navigation message, opening the door to open innovation in
  multi-constellation receivers and addressing topics such as integrity,
  reliability, robustness, enhanced coverage, and high-accuracy positioning.

- Integration of Beidou observables into the PVT position.

### Required skills:

Basic knowledge of digital signal processing and C++ programming (familiarity
with the GNU Radio framework or GNSS-SDR is a plus).

### Potential mentor(s):
Damian Miralles, Luis Esteve.

---------



## Project Title: Expanding the receiver to BEIDOU B1C
### Description:

**Medium-sized project (175h)**

This is a continuation of efforts developed during GSoC 2019. The code needs
updates, some bug fixing, and improve over existing algorithms.

The objective by the end of the summer is to provide a working implementation of
a GNSS receiver working with [Beidou B1C
signals](https://gnss-sdr.org/docs/tutorials/gnss-signals/#beidou-b1c),
delivering RINEX files (the standard input of geodesic software libraries for
high—accuracy positioning) and an on-the-fly navigation solution (that is,
computation of position, velocity and time of the user’s receiver).

- Implementation of acquisition and tracking algorithms for Beidou B1C signals, following the examples already implemented for other GNSS signals. This would facilitate research on multi-constellation, multi-frequency receivers (e.g., GPS + Galileo + Beidou) working with real signals.

- Demodulation of the navigation message, opening the door to open innovation in
  multi-constellation receivers and addressing topics such as integrity,
  reliability, robustness, enhanced coverage, and high-accuracy positioning.

- Integration of Beidou observables into the PVT position.

### Required skills:

Basic knowledge of digital signal processing and C++ programming (familiarity
with the GNU Radio framework or GNSS-SDR is a plus).

### Potential mentor(s):
Damian Miralles, Luis Esteve.


---------

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

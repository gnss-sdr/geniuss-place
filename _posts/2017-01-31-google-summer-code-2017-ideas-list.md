---
title: "Google Summer of Code 2017 ideas list"
excerpt: "Ideas page for GSoC 2017."
header:
  teaser: /assets/images/logo-gsoc.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
---

This year, GNSS-SDR is serving again as a mentoring organization for [Google Summer of Code](https://developers.google.com/open-source/gsoc/) (also known as GSoC), a global program that offers students stipends to write code for open source projects. In order to participate in the program, you must be a student. Google defines a student as an individual enrolled in or accepted into an accredited institution including (but not necessarily limited to) colleges, universities, masters programs, PhD programs and undergraduate programs. You should be prepared, upon request, to provide Google with transcripts or other documentation from your accredited institution as proof of enrollment or admission status. Computer Science does not need to be your field of study in order to participate in the program. You may be enrolled as a full-time or part-time student, and must be 18 years of age or older on or before April 3, 2017 to be eligible to participate in Google Summer of Code in 2017.

If you are an eligible and interested student, read through the list and note the projects you are interested in. You, as the student programmer, then submit a proposal to Google, using the [GSoC 2017 website](https://summerofcode.withgoogle.com/). The application form will be open from March 20, 2017 until April 3, 2017 18:00 (CEST). We recommend you to submit your application early. By doing so, it will be given a greater share of attention than is possible for applications submitted at the last minute.

You might submit a proposal following the guidelines below, or you might want to adapt it. Changes to the proposal could include:

  * You think the project as suggested is too large and you can only feasibly complete part of it; if so, make sure your proposal covers a reasonable subset of the functionality (that is, something which is useful without the rest of the project being implemented).

  * You think the project as suggested is too small; in this case you might want to extend the idea, combine projects, etc.

  * You like the basic idea of the project but it is not such a good fit for the skills that you have; in this case please feel free to suggest an alternative, but try to remember that the idea is for the software to be useful for its existing and potential users.

Your proposal should include the following: your project proposal, why you would like to execute on this particular project, and the reason you are the best individual to do so. Your proposal should also include details of your academic, industry, and/or open source development experience, and other details as you see fit. An explanation of your development methodology and schedule is a good idea, as well. It is always helpful to include your contact information, as it will not be automatically shared with your would-be mentors as part of the proposal process.

Hereafter we list, in no particular order, some proposals for projects to be carried out by the students participating in GSoC 2017. This is by no means a closed list, so the students can feel free to propose alternative activities related to the project.


## Implementation of Interference detection and Mitigation countermeasures for GNSS-SDR

The fact that most of high-accuracy positioning and distributed timing services rely on Global Navigation Satellite Systems (GNSS), including safety-critical operations, has raised the concern of possible denial-of-service situations.
It is known that the vulnerability of GNSS to Radio Frequency Interferences (RFI) is due to its low Signal to Noise ratio on the Earth surface. In that sense, with the proliferation of portable jamming devices, the evolution of spoofing or meaconing systems and other collateral interference effects coming from communication services, the inclusion of countermeasures in GNSS receivers is mandatory.
The work proposed here is the implementation of time and frequency countermeasures consisting of two interference detection and mitigation algorithms working in real-time as an enhanced signal conditioners in the signal processing chain of GNSS-SDR. The interference types that will address the new signal processing blocks are:

 * **Continuous Wave Interferences (CWI)**: The cancellation of CWI interferences are usually based on notch filters designed to track and excise the affected frequency from the baseband spectrum. The algorithm candidate to be implemented was published on the paper:

 D. Borio, "[A multi-state notch filter for GNSS jamming mitigation](http://www.danieleborio.altervista.org/papers/conferences/iclgnss14_MultiStateNotch_25Jun14.pdf)," International Conference on Localization and GNSS 2014 (ICL-GNSS 2014), Helsinki, 2014, pp. 1-6. DOI: 10.1109/ICL-GNSS.2014.693417


  * **Pulsed interferences**: A pulsed interference has an instantaneous bandwidth that usually covers the entire GNSS band. This feature prevents the implementation of a notch filter to remove the interference because the full spectrum is contaminated. Here it is possible to implement what is called a "pulse blanking" algorithm to remove the unwanted signal in time domain, as described in the following paper:

  D. Borio, "[Swept GNSS jamming mitigation through pulse blanking](https://www.researchgate.net/publication/305907284_Swept_GNSS_jamming_mitigation_through_pulse_blanking)," 2016 European Navigation Conference (ENC), Helsinki, 2016, pp. 1-8., DOI: 10.1109/EURONAV.2016.7530549


### Skills required:

Good understanding of digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus).


### Potential mentor(s):
Dr. Javier Arribas, Dr. Carles Fernández-Prades


## Graphical User Interface for GNSS-SDR configuration

### Description:

The configuration mechanism of GNSS-SDR allows users to define and configure each of the receiver's signal processing blocks in a single file. Those configuration files constitute full receiver definitions, since they specify the implementation and parameters to be used in the receiver chain. However, the configuration process is poorly documented and only few baseline examples are provided. The objective of this project is to create a Graphical User Interface for the generation of such configuration files, allowing for an intuitive, user-friendly software receiver definition.

### Skills required:

Good understanding of digital signal processing and C++ programming (familiarity with the [GNU Radio](https://www.gnuradio.org/) framework and [Qt](https://www.qt.io) is a plus).

### Potential mentor(s):

Dr. Javier Arribas,  Mr. Luis Esteve, Dr. Carles Fern&aacute;ndez-Prades



## Robust KF-based Tracking Techniques for Advanced GNSS Receivers

### Description:

Tracking of synchronization parameters (*i.e.*, time-delay and carrier phase) is a key step in the core of any GNSS receiver. The current tracking block implementations, which are fully operational in the GNSS-SDR for both GPS L1 and Galileo E1 bands, are based on traditional tracking loop architectures (*e.g.*, DLL and PLL). Those techniques are prone to fail in non-nominal propagation conditions such as high-dynamics, shadowing, strong fadings, multipath effects or ionospheric scintillation. It is known that Kalman filter (KF)-based techniques, which are formulated from an optimal filtering standpoint, are more robust to such harsh propagation conditions, thus being the methods of choice in advanced GNSS receivers.

The main goal of this project is twofold: *i*) to develop and integrate into the GNSS-SDR core efficient and robust KF-based tracking techniques; and *ii*) to test and compare the performance of these techniques with respect to traditional architectures using real signals.

### Skills required:

Good understanding of digital signal processing and C++ programming (familiarity with the [GNU Radio](https://www.gnuradio.org/) framework and Kalman filtering techniques is a plus).

### Potential mentor(s):

Dr. Jordi Vil&agrave;-Valls, Dr. Carles Fern&aacute;ndez-Prades



## Expanding the receiver to GLONASS

### Description:

Objective by the end of the summer: To provide a working implementation of a GNSS receiver working with [GLONASS L1 SP signals](https://gnss-sdr.org/docs/tutorials/gnss-signals/#glonass), delivering RINEX files (the standard input of geodesic software libraries for high—accuracy positioning) and an on-the-fly navigation solution (that is, computation of position, velocity and time of the user's receiver).

  * Implementation of acquisition algorithms for GLONASS, following the examples already implemented for GPS L1 C/A and Galileo E1. This would facilitate research on multi-constellation receivers (*e.g.*, GPS + Galileo + GLONASS) working with real signals.

  * Demodulation of the GNAV navigation message, opening the door to open innovation in multi-constellation receivers and addressing topics such as integrity, reliability, robustness, enhanced coverage, and high-accuracy positioning.

  * Integration of GLONASS observables into the PVT position.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the [GNU Radio](https://www.gnuradio.org/) framework is a plus).

### Potential mentor(s):

Dr. Carles Fern&aacute;ndez-Prades. Mr. Luis Esteve, Dr. Javier Arribas.



## Coding aspects of secure and robust GNSS receivers

### Description:

Applications that rely on accurate positioning are demanding higher security, reliability and resilience against possible attacks. Interference signals can cause GNSS signal degradation, denial of service, or mislead the receiver positioning solution with fake transmissions. Understanding jamming attacks and devising receiver algorithm against them has been an active area of research and development within GNSS community. The focus has primarily been on developing countermeasures addressing front-end receiver stages. In contrast, the effects of interferences on the decoding performance of the receiver have received less attention. However, explicitly exploiting the presence of channel coding and its properties can help to increase robustness against intentional and unintentional interferences.
The main goal of this project is to implement and characterize state-of-the art receiver algorithms for reliable message decoding under jamming attacks and propose improvements. Evaluation of these advanced techniques will be done using real signals.


### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the [GNU Radio](https://www.gnuradio.org/) framework is a plus).

### Potential mentor(s):

Dr. Monica Navarro, Dr. Pau Closas.


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

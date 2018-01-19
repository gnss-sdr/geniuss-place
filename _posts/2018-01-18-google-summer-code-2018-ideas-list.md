---
title: "Google Summer of Code 2018 ideas list"
excerpt: "Ideas page for GSoC 2018."
header:
  teaser: /assets/images/logo-gsoc.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
---

This year, GNSS-SDR is applying again to serve as a mentoring organization for [Google Summer of Code](https://summerofcode.withgoogle.com/) (also known as GSoC), a global program that offers students stipends to write code for open source projects. In order to participate in the program, you must be a student. Google defines a student as an individual enrolled in or accepted into an accredited institution including (but not necessarily limited to) colleges, universities, masters programs, PhD programs and undergraduate programs. You should be prepared, upon request, to provide Google with transcripts or other documentation from your accredited institution as proof of enrollment or admission status. Computer Science does not need to be your field of study in order to participate in the program. You may be enrolled as a full-time or part-time student for a time period that includes April 23, 2018, and must be at least 18 years old to be eligible to participate in Google Summer of Code in 2018.

If you are an eligible and interested student, read through the list and note the projects you are interested in. You, as the student programmer, then submit a proposal to Google, using the [GSoC 2018 website](https://summerofcode.withgoogle.com/). If GNSS-SDR is among the accepted mentoring organization, the application form for students will be open from March 12 16:00 UTC until March 27 16:00 UTC. We recommend you to submit your application early. By doing so, it will be given a greater share of attention than is possible for applications submitted at the last minute.

You might submit a proposal following the guidelines below, or you might want to adapt it. Changes to the proposal could include:

  * You think the project as suggested is too large and you can only feasibly complete part of it; if so, make sure your proposal covers a reasonable subset of the functionality (that is, something which is useful without the rest of the project being implemented).

  * You think the project as suggested is too small; in this case you might want to extend the idea, combine projects, etc.

  * You like the basic idea of the project but it is not such a good fit for the skills that you have; in this case please feel free to suggest an alternative, but try to remember that the idea is for the software to be useful for its existing and potential users.

Your proposal should include the following: your project proposal, why you would like to execute on this particular project, and the reason you are the best individual to do so. Your proposal should also include details of your academic, industry, and/or open source development experience, and other details as you see fit. An explanation of your development methodology and schedule is a good idea, as well. It is always helpful to include your contact information, as it will not be automatically shared with your would-be mentors as part of the proposal process.

Hereafter we list, in no particular order, some proposals for projects to be carried out by the students participating in GSoC 2018. This is by no means a closed list, so the students can feel free to propose alternative activities related to the project.


## Robust Kalman Filter-based Tracking Techniques for Advanced GNSS Receivers

### Description:

Tracking of synchronization parameters (*i.e.*, time-delay and carrier phase) is a key step in the core of any GNSS receiver. The current tracking block implementations, which are fully operational in GNSS-SDR for GPS L1, GPS L2, GPS L5, Galileo E1, Galileo E5a and GLONASS L1 bands, are based on traditional tracking loop architectures (e.g., DLL and PLL). Those techniques are prone to fail in non-nominal propagation conditions such as high-dynamics, shadowing, strong fadings, multipath effects or ionospheric scintillation. It is known that Kalman filter (KF)-based techniques, which are formulated from an optimal filtering standpoint, are more robust to such harsh propagation conditions, thus being the methods of choice in advanced GNSS receivers.

The main goals of this project are: *i*) to develop and integrate into the GNSS-SDR core standard (discriminator-based) KF tracking techniques for both (joint) code and phase tracking; *ii*) extend such standard KFs to adaptive KF tracking, for instance, sequentially adjusting the measurement covariance at the output of the discriminators; *iii*) implement discriminator-free extended KF (EKF) solutions, and *iv*) to test and compare the performance of these techniques with respect to traditional architectures using real signals.

### Skills required:

Good understanding of statistical signal processing and C++ programming (familiarity with the [GNU Radio](http://gnuradio.org) framework and Kalman filtering techniques is a plus).

### Potential mentor(s):

Dr. Jordi Vil&agrave;-Valls



## Graphical User Interface for GNSS-SDR configuration

### Description:

The configuration mechanism of GNSS-SDR allows users to define and configure each of the receiver's signal processing blocks in a single file. Those configuration files constitute full receiver definitions, since they specify the implementation and parameters to be used in the receiver chain. However, the configuration process is poorly documented and only few baseline examples are provided. The objective of this project is to continue the development started in GSoC 2017 on a Graphical User Interface for the generation of such configuration files, allowing for an intuitive, user-friendly software receiver definition. That work is now in the `gui` branch of the (upstream repository)[https://github/gnss-sdr/gnss-sdr].

### Skills required:

Good understanding of digital signal processing and C++ programming (familiarity with the [GNU Radio](http://gnuradio.org) framework and [Qt](https://www.qt.io) is a plus).

### Potential mentor(s):

Dr. Javier Arribas,  Mr. Luis Esteve, Dr. Carles Fern&aacute;ndez-Prades



## More ideas...

![Coming soon]({{ "/assets/images/coming-soon.jpg" | absolute_url }}){: .align-center}

{% comment %}


## Coding aspects of secure and robust GNSS receivers

### Description:

Applications that rely on accurate positioning are demanding higher security, reliability and resilience against possible attacks. Interference signals can cause GNSS signal degradation, denial of service, or mislead the receiver positioning solution with fake transmissions. Understanding jamming attacks and devising receiver algorithm against them has been an active area of research and development within GNSS community. The focus has primarily been on developing countermeasures addressing front-end receiver stages. In contrast, the effects of interferences on the decoding performance of the receiver have received less attention. However, explicitly exploiting the presence of channel coding and its properties can help to increase robustness against intentional and unintentional interferences.
The main goal of this project is to implement and characterize state-of-the art receiver algorithms for reliable message decoding under jamming attacks and propose improvements. Evaluation of these advanced techniques will be done using real signals.


### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the [GNU Radio](http://gnuradio.org) framework is a plus).

### Potential mentor(s):

Dr. Monica Navarro, Dr. Pau Closas.

{% endcomment %}

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

---
title: "ESA Summer of Code in Space 2013 ideas list"
excerpt: "Ideas page for SOCIS 2013"
header:
  teaser: http://www.esa.int/var/esa/storage/images/esa_multimedia/images/2015/03/socis/15309314-1-eng-GB/SOCIS_large.jpg
tags:
  - news
author_profile: false
---

ESA Summer of Code in Space 2013 ([SOCIS 2013](http://sophia.estec.esa.int/socis2013/){:target="_blank"}) is a program run by the European Space Agency. It aims at offering student developers stipends to write code for various space-related open source software projects. Through SOCIS, accepted student applicants are paired with a mentor or mentors from the participating projects, thus gaining exposure to real-world software development scenarios. In turn, the participating projects are able to more easily identify and bring in new developers. To learn more about the program, check out the [timeline](http://sophia.estec.esa.int/socis2013/timeline){:target="_blank"}, visit the [documentation center](http://sophia.estec.esa.int/socis2013/documentation_center){:target="_blank"}, or head to its [mailing list](https://groups.google.com/forum/#!forum/esa-socis){:target="_blank"}.

If you are an [eligible](http://sophia.estec.esa.int/socis2013/?q=faq#socis_elig_student_who){:target="_blank"} and interested student, read through the list and note the projects you are interested in. You, as the student programmer, then submit a proposal to ESA using the SOCIS 2013 website. The application form will be open from June 30 until July 15. We recommend you to submit your application early. By doing so, it will be given a greater share of attention than is possible for applications submitted at the last minute.

You might submit a proposal following the guidelines below, or you might want to adapt it. Changes to the proposal could include:

  * You think the project as suggested is too large and you can only feasibly complete part of it; if so, make sure your proposal covers a reasonable subset of the functionality (that is, something which is useful without the rest of the project being implemented).
  * You think the project as suggested is too small; in this case you might want to extend the idea, combine projects, etc.
  * You like the basic idea of the project but it is not such a good fit for the skills that you have; in this case please feel free to suggest an alternative, but try to remember that the idea is for the software to be useful for its existing and potential users.

Your proposal should include the following: your project proposal, why you would like to execute on this particular project, and the reason you are the best individual to do so. Your proposal should also include details of your academic, industry, and/or open source development experience, and other details as you see fit. An explanation of your development methodology and schedule is a good idea, as well. It is always helpful to include your contact information, as it will not be automatically shared with your would-be mentors as part of the proposal process.

Hereafter we list, in no particular order, some proposals for projects to be carried out by the students participating in SOCIS 2013. This is by no means a closed list, so the students can feel free to propose alternative activities related to the project.



## Integration of Inertial Measurement Unit (IMU)

Inertial Measurement Units (IMU) are electronic devices that measures velocity, orientation, and gravitational forces, using a combination of accelerometers and gyroscopes, sometimes also magnetometers. The integration of IMU measurements with the GNSS positioning systems has shown excellent results in terms of accuracy and reliability improvements.

The integration of the IMU information can be classified in three categories:

  * loose integration: IMU measurements integration at the Position, Velocity, and Time (PVT) solution.
  * tight integration: IMU measurements Integration at the pseudorange level.
  * ultra-tight integration: IMU measurements at the tracking loops level.

Due to the flexibility provided by the SDR architecture, it is feasible to improve GNSS-SDR by incorporating IMU information to the receiver chain, by implementing one or several integration methods.

The goals of this project are:

* Program a GNSS-SDR IMU signal source in charge of obtaining the access to the IMU information.
* Implement a loose integration algorithm at the PVT module using the Kalman filter algorithm.
* Implement a tight integration algorithm at the Pseudoranges module.


Skills required: Basic knowledge on digital signal processing, Kalman filtering and C++ programming.

Mentor: Dr. Pau Closas


## Exploiting VITA 49 protocol to protect GNSS-SDR from buffer overrun situations

The VITA 49 Radio Transport (VRT) is an emerging standard for SDR signal samples transport protocol. Prior to the development of the VRT standard, each SDR RF front-end manufacturer developed custom and proprietary digitized data formats and metadata formats. A remarkable feature of the VRT protocol is the ability to provide accurate timestamping of the signal samples.

One of the most common and undesirable event in a real-time software defined receiver is the sample buffer overrun situation. The problem occurs when the host machine eventually consumes signal samples at a lower speed than the hardware driver produces. If the sample buffer fills up, then the hardware driver start to discard signal samples. This transitory event can be caused by the multitasking nature of the host operating system, specially in slow machines when they are also used to concurrently run other user programs, such as GPS navigation displays and mapping software.

The immediate effect of discarding a sample is that all the signal tracking loops in the GNSS-SDR receiver loss their lock to the satellite signals due to an unexpected shift in the CDMA synchronization process.

The idea behind this project is to exploit the sample timestamp information provided by VRT 49 protocol to detect buffer overruns and feed the tracking loops with a prediction of the missing sample according to the expected pseudorandom noise code, and thus providing continuity to the tracking process without falling back again into signal acquisition.

The goal is to implement the support for the GNU Radio Universal Hardware Driver (UHD) with VRT sample streaming in GNSS-SDR and the buffer overrun protection algorithm.

Skills required: Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework and/or the Universal Hardware Driver is a plus).

Mentor: Dr. Javier Arribas

## Integration of open-source positioning libraries at observable level in real-time

Currently, the GNSS-SDR project focuses the main development activities to enhance the signal processing operations that occurs before the observable data is obtained (mainly code pseudorange and carrier phase observables). In this category fall the signal acquisition and tracking operations along with the corresponding navigation message decoding and the observable estimation. By the end of 2013, GNSS-SDR software will be capable of acquire, track and obtain combined observables of both GPS L1 C/A and Galileo E1b and E1c signals.

However, to obtain the final GNSS product, typically composed of the Position, Velocity and Time (PVT) solution, there is still much work to do. GNSS-SDR provides an internal satellite orbital model that uses the broadcast ephemeris to estimate the satellite positions. It is complemented with a basic Least Squares (LS) solver that obtains the PVT solution.

In the open-source community, there are several libraries that provide high quality implementations of advanced positioning algorithms such as differential positioning, Precise Point Positioning (PPP) and the use of both Ground and Satellite Based Augmentation System (GBAS and SBAS) data. The most representative libraries are the well-known GPS Toolkit ([GPSTk](http://www.gpstk.org/bin/view/Documentation/WebHome){:target="_blank"}), sponsored by Space and Geophysics Laboratory, within the Applied Research Laboratories at the University of Texas at Austin, and the [RTKLIB](http://www.rtklib.com/){:target="_blank"} suite maintained by Tomoji Takasu. Both libraries are mainly oriented to use GNSS observable data in post-processing mode using Receiver INdependent EXchange (RINEX) files and other binary manufacturer proprietary formats.

The goal of this project is the integration of both the GPSTk and the RTKLIB PVT solvers in the GNSS-SDR receiver at observable level. The positioning libraries will be tightly coupled with the signal processing blocks in order to operate in real-time.

As a result of the project, the GNSS-SDR receiver will increase dramatically its real-time PVT precision and accuracy up to centimeter-level. This performance will enable the use of GNSS-SDR in geodesy applications among other scientific uses of GNSS.

Skills required: Basic knowledge on C++ programming (familiarity with the GNU Radio framework is recommended). Basic knowledge of GNSS operation at observable level and the use of open-source GNSS libraries (GPSTk and RTKLIB) is a plus.

Mentor: Dr. Javier Arribas.

## Improve testing infrastructure

For unit and integration testing GNSS-SDR uses the [Google C++ Testing Framework](https://github.com/google/googletest){:target="_blank"}, a library that takes care of all the testing infrastructure, letting the developer focus in the content of the test. In order to verify the tested code's behavior, Google Test allows to write assertions, which are statements that check whether a condition is true. An assertion's result can be success, nonfatal failure, or fatal failure. If a fatal failure occurs, it aborts the current function; otherwise the program continues normally. If a test crashes or has a failed assertion, then it fails; otherwise it succeeds. Google Test assertions are macros that resemble function calls: you test a class or function by making assertions about its behavior. The aim of this project is to improve project's quality assessment code by developing generic tests and improving existing ones for signal acquisition, tracking, decoding of the navigation messages and PVT solution, as well as performance tests.

Skills required: Basic knowledge on C++ programming. Familiarity with the Google C++ Testing Framework is a plus.

Mentor: Dr. Carles Fern&aacute;ndez-Prades.



--------

Finally, remember that if you are interested in contributing to the GNSS-SDR project, there is no need to wait for SOCIS 2013 to start; you can contact the developer team right now through the mailing list, take a look through the documentation, source code and bug tracker, suggest new features, etc. Check out how can you [participate in GNSS-SDR]({{ site.url }}{{ site.baseurl }}/contribute/).

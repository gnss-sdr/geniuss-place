---
title: "Google Summer of Code 2013 ideas list"
excerpt: "Ideas page for GSoC 2013."
header:
  teaser: /assets/images/logo-gsoc.png
tags:
  - news
author_profile: false
sidebar:
  nav: "news"
redirect_from:
  - /documentation/g​oogle-summer-code-2013-ideas-list
  - /node/52
---

[Global Navigation Satellite System (GNSS)](https://en.wikipedia.org/wiki/Satellite_navigation) is the general concept used to identify those systems that allow user positioning based on a constellation of satellites. Specific GNSS are the well-known American [GPS](https://www.gps.gov/), the Russian [GLONASS](https://www.glonass-iac.ru/en/) or the forthcoming European [Galileo](https://ec.europa.eu/growth/sectors/space/galileo_en) and Chinese [BeiDou](http://beidou.gov.cn/). Governments around the World are spending billions of dollars of tax payers' money in building and maintaining an infrastructure with explicitly free civilian usage. However, users only have access to a small fraction of the full capability of GNSS in terms of accuracy, robustness and reliability of the provided service at a reasonable cost. Professional, full-featured receivers are expensive, and even in those cases the users have limited access (if any) to know exactly how position and time information were computed.

Some commercial, industrial and scientific applications of GNSS signals and data require non-standard features of the receiver. Access to intermediate signals is not possible in mass-market receivers, and professional equipment is costly and often a ‘black box’ that does not offer exact information about how signals are being processed. Since all the processing is done in [ASICs](https://en.wikipedia.org/wiki/Application-specific_integrated_circuit) or [SoCs](https://en.wikipedia.org/wiki/System_on_a_chip), one cannot change the implementation of a certain functional block and assess the impact of that change on the whole receiver performance.

As a matter of fact, the landscape of GNSS is going to change rapidly in the following years (modernization of GPS and GLONASS, advent of Galileo and COMPASS). A bunch of new signals will be readily available for navigation, providing means to determine position and time with an unforeseen degree of performance. Nevertheless, the multi-constellation, multi-frequency approach poses several technological challenges. In that sense, the flexibility provided by the software defined radio approach (and, specifically, the GNU Radio framework) appears as an ideal environment for rapid prototyping and testing of new receiver architectures.

GNSS-SDR implements a generic architecture of a GNSS software defined receiver and already provides a working implementation of a whole processing chain of a GPS L1 C/A receiver, from the output of a RF front-end to the computation of position, velocity and time. It also provides outputs in standard formats ([KML](https://www.opengeospatial.org/standards/kml), [RINEX](https://en.wikipedia.org/wiki/RINEX)). The software allows an arbitrary number of different algorithms and implementations for each required processing block functionality (signal conditioning, acquisition, tracking and so on, see the general overview), allowing the definition of completely customized receiver flowgraph by choosing one of the existing alternatives for each block. This modular nature of the receiver allows the definition of clearly-specified, scoped activities (interface to different front-ends, new synchronization algorithms, interfaces to other sources of information, a multi-frequency / multi-constellation approach, the addition of new cool features, etc.), that can be completed in a summer time frame.

This year, GNSS-SDR is serving as a mentoring organization for [Google Summer of Code](https://www.google-melange.com/archive/gsoc/2013) (also known as GSoC), a global program that offers students stipends to write code for open source projects. In order to participate in the program, you must be a student. Google defines a student as an individual enrolled in or accepted into an accredited institution including (but not necessarily limited to) colleges, universities, masters programs, PhD programs and undergraduate programs. You should be prepared, upon request, to provide Google with transcripts or other documentation from your accredited institution as proof of enrollment or admission status. Computer Science does not need to be your field of study in order to participate in the program. You may be enrolled as a full-time or part-time student, and must be 18 years of age or older on or before May 27, 2013 to be eligible to participate in Google Summer of Code in 2013.

If you are an eligible and interested student, read through the list and note the projects you are interested in. You, as the student programmer, then submit a proposal to Google, using the [GSoC 2013 website](https://www.google-melange.com/archive/gsoc/2013). The application form will be open from April 22, 19:00 UTC until May 3, 19:00 UTC. We recommend you to submit your application early. By doing so, it will be given a greater share of attention than is possible for applications submitted at the last minute.

You might submit a proposal following the guidelines below, or you might want to adapt it. Changes to the proposal could include:

  * You think the project as suggested is too large and you can only feasibly complete part of it; if so, make sure your proposal covers a reasonable subset of the functionality (that is, something which is useful without the rest of the project being implemented).
  * You think the project as suggested is too small; in this case you might want to extend the idea, combine projects, etc.
  * You like the basic idea of the project but it is not such a good fit for the skills that you have; in this case please feel free to suggest an alternative, but try to remember that the idea is for the software to be useful for its existing and potential users.

Your proposal should include the following: your project proposal, why you would like to execute on this particular project, and the reason you are the best individual to do so. Your proposal should also include details of your academic, industry, and/or open source development experience, and other details as you see fit. An explanation of your development methodology and schedule is a good idea, as well. It is always helpful to include your contact information, as it will not be automatically shared with your would-be mentors as part of the proposal process.

Hereafter we list, in no particular order, some proposals for projects to be carried out by the students participating in GSoC 2013. This is by no means a closed list, so the students can feel free to propose alternative activities related to the project.



## Galileo E1 basic positioning

### Description:

The European contribution to Global Navigation Satellite Systems (GNSS) is now in its first in-orbit validation tests with a constellation of four satellites. This minimum set of satellites enables users to obtain a 3D position fix, and thus to test a complete Galileo receiver.

GNSS-SDR already implemented Galileo E1 signal acquisition and tracking in the 2012 GSoC program. Now it is time to step up and complete the receiver chain by implementing the decoding of the navigation message[^1] and obtaining a basic Position Velocity and Time (PVT) solution (both Galileo-only or in combination with GPS satellites). The goal of this project is to write the missing processing blocks (demodulation and decoding of the navigation message, and a PVT module) to receive Galileo signals and compute the receiver position fix.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus, but not a requirement).

### Mentor:

Dr. Javier Arribas, Dr. Carles Fern&aacute;ndez-Prades, Dr. Pau Closas, Mr. Luis Esteve

## EGNOS/WAAS compatibility

### Description:

The European Geostationary Navigation Overlay Service (EGNOS) and the North American Wide Area Augmentation System (WAAS) are Satellite Based Augmentation Systems (SBAS) that provide supplementary information for GPS, Glonass and Galileo systems by reporting on the reliability and accuracy of the positioning data[^2]$$ ^{,} $$[^3]. By receiving the SBAS information coming from EGNOS or WAAS satellites, a GNSS receiver can improve the position accuracy to 7.6 meters or better (for both lateral and vertical measurements), at least 95% of the time. The SBAS signals were designed for the compatibility with the existing GNSS hardware-based receivers by sharing the same Code Division Multiple Access (CDMA) modulation techniques.

GNSS-SDR software receiver architecture allows the support of SBAS signals by adapting the existing acquisition, tracking, and telemetry decoding modules for GPS L1 (and thus obtain the SBAS navigation message). The goal of this project is to exploit the modular structure of GNSS-SDR and implement the support of GPS SBAS-assisted navigation.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus, but not a requirement).

### Mentor:

Dr. Javier Arribas, Dr. Carles Fern&aacute;ndez-Prades, Dr. Pau Closas, Mr. Luis Esteve



## Exploiting VITA 49 protocol to protect GNSS-SDR from buffer overrun situations

### Description:

The VITA 49 Radio Transport (VRT)[^4] is an emerging standard for SDR signal samples transport protocol. Prior to the development of the VRT standard, each SDR RF front-end manufacturer developed custom and proprietary digitized data formats and metadata formats. A remarkable feature of the VRT protocol is the ability to provide accurate timestamping of the signal samples.

One of the most common and undesirable event in a real-time software defined receiver is the sample buffer overrun situation. The problem occurs when the host machine eventually consumes signal samples at a lower speed than the hardware driver produces. If the sample buffer fills up, then the hardware driver start to discard signal samples. This transitory event can be caused by the multitasking nature of the host operating system, specially in slow machines when they are also used to concurrently run other user programs, such as GPS navigation displays and mapping software.

The immediate effect of discarding a sample is that all the signal tracking loops in the GNSS-SDR receiver loss their lock to the satellite signals due to an unexpected shift in the CDMA synchronization process.

The idea behind this project is to exploit the sample timestamp information provided by VRT 49 protocol to detect buffer overruns and feed the tracking loops with a prediction of the missing sample according to the expected pseudorandom noise code, and thus providing continuity to the tracking process without falling back again into signal acquisition.

The goal is to implement the support for the GNU Radio Universal Hardware Driver (UHD) with VRT sample streaming in GNSS-SDR and the buffer overrun protection algorithm.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework and/or the Universal Hardware Driver is a plus).

### Mentor:

Dr. Javier Arribas, Dr. Carles Fern&aacute;ndez-Prades, Dr. Pau Closas, Mr. Luis Esteve



## Improve the acquisition sensitivity

### Description:

The GNSS’ signal acquisition process in is charge of obtaining the set of visible satellites, which involves two steps for each of them:

Detect the presence of a specific signal that belongs to a particular GNSS satellite, and
provide a coarse estimation of their current synchronization parameters.
It is known that signal acquisition has the lowest sensitivity of the whole receiver operation, and, consequently, it becomes the performance bottleneck when there is high signal attenuation, such as in the urban canyon environments or in the presence of interfering signals[^5]. The goal of this project is to implement high sensitivity acquisition algorithms for both GPS L1 and Galileo E1 signals, using longer signal integration time. In order to reach real-time operation, the implementation should use the Single Instruction Multiple Data (SIMD) instruction set of the host machine and evaluate the possibility to use the Graphics Processing Unit (GPU) for the vector operations.

### Skills required:

Basic knowledge on digital signal processing (Fast Fourier Transform (FFT), correlators, and filters), and C++ programming (familiarity with the GNU Radio framework is a plus, as well as knowledge of SIMD instructions and Cuda).

### Mentor:

Dr. Javier Arribas, Dr. Carles Fern&aacute;ndez-Prades, Dr. Pau Closas, Mr. Luis Esteve


## Integration of Inertial Measurement Unit (IMU)

### Description:

Inertial Measurement Units (IMU) are electronic devices that measures velocity, orientation, and gravitational forces, using a combination of accelerometers and gyroscopes, sometimes also magnetometers. The integration of IMU measurements with the GNSS positioning systems has shown excellent results in terms of accuracy and reliability improvements[^6].

The integration of the IMU information can be classified in three categories:

  * loose integration: IMU measurements integration at the Position, Velocity, and Time (PVT) solution.
  * tight integration: IMU measurements Integration at the pseudorange level.
  * ultra-tight integration: IMU measurements integration at the code acquisition and tracking loops directly at signal sample level, using Doppler and carrier phase estimations.

Due to the flexibility provided by the SDR architecture, it is feasible to improve GNSS-SDR by incorporating IMU information to the receiver chain, by implementing one or several integration methods.

The goals of this project are:

Program a GNSS-SDR IMU signal source in charge of obtaining the access to the IMU information. A very popular IMU is available as a part of Wii Mote remote control and there are several open source projects that implements the required device drivers to access to the IMU information.
Implement a loose integration algorithm at the PVT module using the Kalman filter algorithm.
Implement a tight integration algorithm at the pseudorange level.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus).

### Mentor:

Dr. Javier Arribas, Dr. Carles Fern&aacute;ndez-Prades, Dr. Pau Closas, Mr. Luis Esteve



## Integrated GNSS/WiFi positioning

### Description:

GNSS outstanding performances are obtained in open sky environments, but in much more challenging scenarios, such as low visibility or indoor positioning, GNSS provides a limited benefit. In order to create a hybrid, heterogeneous positioning receiver able to operate seamlessly in indoor/outdoor scenarios, ubiquitous solutions require combining GNSS with other non-GNSS means. One popular approach (followed by most cell phone manufacturers) is to integrate GNSS with WiFi-based navigation, typically selecting one or the other depending on availability of GNSS satellites.

The goal of this project is to implement an hybrid GNSS/WiFi receiver, able to seamlessly provide position in indoor and outdoor situations. To that aim, specific tasks are:

  * Program a signal source for WiFi front-ends, which will differ from GNSS signal sources we already have in GNSS-SDR. Then, implement a driver for the specific WiFi front-end we will use for the overall validation.
  * Implement the algorithms to extract the ranging information, and node location from the WiFi nodes.
  * Implement the coupling scheme to fuse the data from GNSS and WiFi sources. This algorithm could range from a simple ‘one or the other’ approach to a more sophisticated Kalman filtering.

### Skills required:

Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus).

### Mentor:

Dr. Javier Arribas, Dr. Carles Fern&aacute;ndez-Prades, Dr. Pau Closas, Mr. Luis Esteve



--------------


Finally, remember that if you are interested in contributing to the GNSS-SDR project, there is no need to wait for Google Summer of Code to start; you can contact the developer team right now through the mailing list, take a look through the documentation, source code and bug tracker, suggest new features, etc. Check out how can you [participate in GNSS-SDR]({{ "/contribute/" | relative_url }}).


## References

[^1]: Galileo Joint Undertaking, "[Galileo Open Service. Signal In Space Interface Control Document (OS SIS ICD)](https://ec.europa.eu/growth/sectors/space/galileo_en)", Tech. rep., European Space Agency / European GNSS Supervisory Authority, September 2010.

[^2]: European Commission Directorate-General for Energy, and Transport, "[EGNOS Service Definition Document: Open Service EGN-SDD OS V1.0](https://ec.europa.eu/growth/sectors/space/egnos_en)", Tech. rep., 2009.

[^3]: "[Global Positioning System Wide Area Augmentation System (WAAS) Performance Standard GPS WAAS PS v1.0](https://www.gps.gov/technical/ps/2008-WAAS-performance-standard.pdf)", Tech. rep., US Department of transportation and Federal Aviation Administration, 2008.

[^4]: VITA Standards Organization. (2009, May 26). VITA Radio Transport (VRT) Standard, NSI/VITA 49.0-2009. Available from [vita.com](https://www.vita.com/).

[^5]: J. Arribas, [GNSS Array-based Acquisition: Theory and Implementation](https://theses.eurasip.org/theses/449/gnss-array-based-acquisition-theory-and/), PhD Thesis, Universitat Politècnica de Catalunya, Barcelona, Spain, June 2012.

[^6]: J. A. Farrell, and M. Barth, The Global Positioning System & Inertial Navigation, McGraw-Hill, 1999.

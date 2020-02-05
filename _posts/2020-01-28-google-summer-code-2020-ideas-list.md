---
title: "Google Summer of Code 2020 ideas list"
excerpt: "Ideas page for GSoC 2020."
header:
  teaser: /assets/images/logo-gsoc.png
tags:
  - news  
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2020-01-28T12:08:02+02:00
---


This year, GNSS-SDR is applying again as a mentoring organization for [Google Summer of Code](https://summerofcode.withgoogle.com/) (also known as GSoC), a global program that offers students stipends to write code for open source projects. In order to participate in the program, you must be a student. Google defines a student as an individual enrolled in or accepted into an accredited institution including (but not necessarily limited to) colleges, universities, masters programs, PhD programs and undergraduate programs. You should be prepared, upon request, to provide Google with transcripts or other documentation from your accredited institution as proof of enrollment or admission status. Computer Science does not need to be your field of study in order to participate in the program. You may be enrolled or accepted as a full-time or part-time student into an accredited institution including (but not necessarily limited to) colleges, universities, masters programs, PhD programs and undergraduate programs, for a time period that includes April 27, 2020, must be at least 18 years old, and must be eligible to work in your country of residence during duration of program to be eligible to participate in Google Summer of Code in 2020.

If you are an eligible and interested student, read through the list and note the projects you are interested in. You, as the student programmer, then submit a proposal to Google, using the [GSoC 2020 website](https://summerofcode.withgoogle.com/). The application form for students will be open from March 16, 2020 until March 31, 2020 at 20:00 (Central European Summer Time). We recommend you to submit your application early. By doing so, it will be given a greater share of attention than is possible for applications submitted at the last minute.

You might submit a proposal following the guidelines below, or you might want to adapt them to your needs. Changes to the proposal could include:

  * You think the project as suggested is too large and you can only feasibly complete part of it; if so, make sure your proposal covers a reasonable subset of the functionality (that is, something which is useful without the rest of the project being implemented).

  * You think the project as suggested is too small; in this case you might want to extend the idea, combine projects, etc.

  * You like the basic idea of the project but it is not such a good fit for the skills that you have; in this case please feel free to suggest an alternative, but try to remember that the idea is for the software to be useful for its existing and potential users.

Your proposal should include the following: your project proposal, why you would like to execute on this particular project, and the reason you are the best individual to do so. Your proposal should also include details of your academic, industry, and/or open source development experience, and other details as you see fit. An explanation of your development methodology and schedule is a good idea, as well. It is always helpful to include your contact information, as it will not be automatically shared with your would-be mentors as part of the proposal process.

Hereafter we list, in no particular order, some proposals for projects to be carried out by the students participating in GSoC 2020. **This is by no means a closed list, so the students can feel free to propose alternative activities related to GNSS-SDR. Original topics for proposals are specially welcome and use to be highly ranked.**

-------


## Project Title: Robust Interference Mitigation for anti-jamming

### Description:
Although strong jamming can overwhelm much weaker GNSS signals, receiver performance can be significantly improved by implementing interference mitigation techniques. Robust statistics was recently explored as a mitigation technique that requires minimal receiver modifications, while providing unprecedented anti-jamming rejection capabilities. The main required modification is on the generation of a robust cross-ambiguity function (CAF) which is later used in the correlation process, both in acquisition and tracking modes. This project would encompass implementation and testing of such approach, including some of the variants and real signal processing. A reference article might be downloaded from [here](https://www.insidegnss.com/auto/sepoct17-BORIO_0.pdf)    

### Skills required:
Good understanding of statistical signal processing and C++ programming (familiarity with the [GNU Radio](https://gnuradio.org) framework is a plus).

### Potential mentor(s):
Dr. Pau Closas, Mr. Gerald LaMountain, Dr. Carles Fern&aacute;ndez-Prades


---------

## Project Title: Paving the way to Galileo E6

The Galileo High Accuracy Service (HAS) will allow users to obtain a positioning error below two decimeters in nominal conditions of use, worldwide. The Galileo HAS will be based on the free transmission of Precise Point Positioning (PPP) corrections through the Galileo E6 signal data component E6B by the Galileo satellites. Currently, only the [spreading codes have been made public](https://www.gsc-europa.eu/sites/default/files/sites/all/files/E6BC_SIS_Technical_Note.pdf), so it is already possible to implement Acquisition and Tracking blocks for those signals. This project will address those implementations, based on the existing examples for other GNSS signals, hence paving the way to new Galileo accuracy and authentication services in GNSS-SDR.


### Skills required:
Good understanding of statistical signal processing and C++ programming (familiarity with the [GNU Radio](https://gnuradio.org) framework is a plus).

### Potential mentor(s):
Dr. Javier Arribas, Dr. Jordi Vil&agrave;-Valls.

---------

## Project Title: Porting GNSS-SDR to Microsoft Windows

### Description:
Currently, GNSS-SDR can only be built on GNU/Linux and macOS, but not on Microsoft Windows. This project addresses the portability to Microsoft Windows 10. Basically, it consists of creating (and documenting) an environment for Microsoft Windows containing all the required dependencies, modifying GNSS-SDR CMake scripts in order to build the software with Microsoft Visual Studio 2019, detecting and providing an alternative for those parts of the code that use UNIX-specific stuff, and implementing a Continuous Integration job at GitHub Actions.

### Skills required:
Familiarity with CMake and the Windows programming environment are strongly recommended.

### Potential mentor(s):
Dr. Carles Fern&aacute;ndez-Prades


-------

## Project Title: Expanding the receiver to Galileo E5b

### Description:
Objective by the end of the summer: To provide a working implementation of a GNSS receiver working with Galileo E5b signals, delivering RINEX files (the standard input of geodesic software libraries for high—accuracy positioning) and an on-the-fly navigation solution (that is, computation of position, velocity and time of the user’s receiver).

 * Implementation of acquisition algorithms for Galileo E5b, following the examples already implemented for and Galileo E5a.

 * Demodulation of the INAV navigation message.

 * Integration of Galileo E5b observables into the PVT position.

Given the similarity of the E5b signal with the E5a signal, we will try to reuse (as much as possible) the code blocks already implemented.

### Skills required:
Basic knowledge on digital signal processing and C++ programming (familiarity with the GNU Radio framework is a plus).

### Potential mentor(s):
Mr. Luis Esteve, Dr. Javier Arribas.

---------


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

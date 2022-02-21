---
title: "Google Summer of Code 2022 ideas list"
excerpt: "Ideas page for GSoC 2022."
header:
  teaser: /assets/images/logo-gsoc.png
tags:
  - news  
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2022-02-21T12:08:02+02:00
---


This year, GNSS-SDR is applying again as a mentoring organization for [Google
Summer of Code](https://summerofcode.withgoogle.com/) (also known as GSoC), a
global program that offers students stipends to write code for open source
projects. In order to participate in the program, you must be a student. Google
defines a student as an individual enrolled in or accepted into an accredited
institution including (but not necessarily limited to) colleges, universities,
masters programs, PhD programs and undergraduate programs. You should be
prepared, upon request, to provide Google with transcripts or other
documentation from your accredited institution as proof of enrollment or
admission status. Computer Science does not need to be your field of study in
order to participate in the program. You may be enrolled or accepted as a
full-time or part-time student into an accredited institution including (but not
necessarily limited to) colleges, universities, masters programs, PhD programs,
and undergraduate programs, must be at least 18 years old and must be eligible
to work in your country of residence during duration of the program to be
eligible to participate in Google Summer of Code in 2022.

If you are an eligible and interested student, read through the list and note
the projects you are interested in. You, as the student programmer, then submit
a proposal to Google, using the [GSoC 2022
website](https://summerofcode.withgoogle.com/). The application form for
students will be open from April 4, until April 19 at 18:00 UTC. We recommend
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
  carried out by the students participating in GSoC 2022. **This is by no means
  a closed list, so the students can feel free to propose alternative activities
  related to GNSS-SDR. Original topics for proposals are especially welcome and
  use to be highly ranked.**
  {: .notice--info}

-------


## Project Title: Integration of anti-spoofing techniques in GNSS-SDR

### Description:

This is a continuation of the work developed during GSoC 2021.

GNSS technology is vulnerable to spoofing attacks, in which a malicious agent
imitates genuine GNSS signals in order to feed a false location to a target
user. Spoofing detection and mitigation has been a topic of significant interest
in the GNSS community for decades. Recent developments have resulted in GPS
receiver architectures which are capable of identifying and rejecting spoofed
signals, allowing the receiver to obtain estimates of the true receiver location
even during a spoofing attack.

 * **Medium sized project (175 h)**
   * Objective by the end of the summer: integration of the spoofing detection
     techniques developed during GSoC 2021 in GNSS-SDR and developing some new
     techniques. Implementation of acquisition/tracking anti-spoofing algorithms
     based on the signal’s physical characteristics like the power level and
     cross-ambiguity function matrix.
   * Implementation of PVT anti-spoofing algorithms based on the consistency of
     receiver observables and calculated PVT solutions with configurable
     threshold values. This branch has been partially developed, and efforts
     should be a continuation of previous work.

* **Large sized project (350 h)**
   * This is an extension of the medium size project.
   * Objective by the end of November: Implementation of some techniques to
     reject/mitigate the spoofing signals and recover the legitimate signal. The
     goal of this project would be selection of promising anti-spoofing
     techniques, as well as implementation of the individual data processing
     components for that methodology and testing within the overall receiver
     pipeline.


### Skills required:

Good understanding of spoofing detection and mitigation methods, GNSS signal
processing and C++ programming (familiarity with the GNU Radio framework is a
plus).

### Potential mentor(s):

Mr. Luis Esteve, Mr. Carles Fern&aacute;ndez-Prades.

---------

## Project Title: Completing processing of Beidou B2a signals

### Description:
This is a continuation of the work developed during previous GSoC editions, and some
additional voluntary efforts by the mentor. The code is almost complete, but
some additional bug fixing and refinement is needed.

The objective by the end of the summer is to provide a working implementation of
a GNSS receiver working with [Beidou B2a signals]({{
"/docs/tutorials/gnss-signals/#beidou-b2a" | relative_url }}), delivering RINEX
files (the standard input of geodesic software libraries for high—accuracy
positioning) and an on-the-fly navigation solution (that is, computation of
position, velocity and time of the user's receiver).

 * Improve acquisition and tracking algorithms for Beidou B2a signals,
 following the examples already implemented for other GNSS signals. This would
 facilitate research on multi-constellation, multi-frequency receivers (_e.g._,
 GPS + Galileo + Beidou) working with real signals.
 * Demodulation of the navigation message, opening the door to open innovation
 in multi-constellation receivers.
 * Integration of Beidou B2a observables into the PVT position.
 * Note: this branch have been partially developed, and efforts should be a
 continuation of previous work that includes:
    - Update code to absorb the latest changes from `next`.
    - Improve tracking techniques option, i.e add pilot tracking, or pilot +
    data, etc.
    - Adjust code to allow B2A + GPS L5, + Galileo, etc.

### Skills required:
Basic knowledge of digital signal processing and C++ programming (familiarity
with the GNU Radio framework or GNSS-SDR is a plus).


### Potential mentor(s):
Mr. Damian Miralles, Mr. Luis Esteve.


---------

## Project Title: Completing processing of Beidou B1C signals

### Description:
This is a continuation of efforts developed during previous GSoC editions. The code needs
updates, some bug fixing, and improve over existing algorithms.

The objective by the end of the summer is to provide a working implementation of
a GNSS receiver working with [Beidou B1C signals]({{
"/docs/tutorials/gnss-signals/#beidou-b1c" | relative_url }}), delivering RINEX
files (the standard input of geodesic software libraries for high—accuracy
positioning) and an on-the-fly navigation solution (that is, computation of
position, velocity and time of the user's receiver). Implementation of
acquisition and tracking algorithms for Beidou B1C signals, following the
examples already implemented for other GNSS signals. This would facilitate
research on multi-constellation, multi-frequency receivers (_e.g._, GPS +
Galileo + Beidou) working with real signals. Demodulation of the navigation
message, opening the door to open innovation in multi-constellation receivers
and addressing topics such as integrity, reliability, robustness, enhanced
coverage, and high-accuracy positioning. Integration of Beidou observables into
the PVT position.


### Skills required:

Basic knowledge of digital signal processing and C++ programming (familiarity
with the GNU Radio framework or GNSS-SDR is a plus).

### Potential mentor(s):
Mr. Damian Miralles, Mr. Luis Esteve.



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

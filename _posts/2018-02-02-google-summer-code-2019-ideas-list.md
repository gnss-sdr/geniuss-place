---
title: "Google Summer of Code 2019 ideas list"
excerpt: "Ideas page for GSoC 2019."
permalink: /google-summer-code-2019-ideas-list/
header:
  teaser: /assets/images/logo-gsoc.png
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2019-01-31T12:08:02+02:00
---

This year, GNSS-SDR is applying as a mentoring organization for [Google Summer of Code](https://summerofcode.withgoogle.com/) (also known as GSoC), a global program that offers students stipends to write code for open source projects. In order to participate in the program, you must be a student. Google defines a student as an individual enrolled in or accepted into an accredited institution including (but not necessarily limited to) colleges, universities, masters programs, PhD programs and undergraduate programs. You should be prepared, upon request, to provide Google with transcripts or other documentation from your accredited institution as proof of enrollment or admission status. Computer Science does not need to be your field of study in order to participate in the program. You may be enrolled as a full-time or part-time student for a time period that includes May 6, 2019, and must be at least 18 years old to be eligible to participate in Google Summer of Code in 2019.

If you are an eligible and interested student, read through the list and note the projects you are interested in. You, as the student programmer, then submit a proposal to Google, using the [GSoC 2019 website](https://summerofcode.withgoogle.com/). The application form for students will be open from March 25 18:00 UTC until April 9 18:00 UTC. We recommend you to submit your application early. By doing so, it will be given a greater share of attention than is possible for applications submitted at the last minute.

You might submit a proposal following the guidelines below, or you might want to adapt them to your needs. Changes to the proposal could include:

  * You think the project as suggested is too large and you can only feasibly complete part of it; if so, make sure your proposal covers a reasonable subset of the functionality (that is, something which is useful without the rest of the project being implemented).

  * You think the project as suggested is too small; in this case you might want to extend the idea, combine projects, etc.

  * You like the basic idea of the project but it is not such a good fit for the skills that you have; in this case please feel free to suggest an alternative, but try to remember that the idea is for the software to be useful for its existing and potential users.

Your proposal should include the following: your project proposal, why you would like to execute on this particular project, and the reason you are the best individual to do so. Your proposal should also include details of your academic, industry, and/or open source development experience, and other details as you see fit. An explanation of your development methodology and schedule is a good idea, as well. It is always helpful to include your contact information, as it will not be automatically shared with your would-be mentors as part of the proposal process.

Hereafter we list, in no particular order, some proposals for projects to be carried out by the students participating in GSoC 2019. **This is by no means a closed list, so the students can feel free to propose alternative activities related to GNSS-SDR.**

-------


## SDR GNSS Reflectometry (GNSS-R)

### Description:

GNSS Reflectometry (GNSS-R) is the application of GNSS signals to determine geophysical parameters of the Earth's surface, as well as the atmospheric layer. The idea is to jointly exploit the direct and reflected GNSS signals. These reflected signals are particularly interesting on water or ice surfaces. The receiver can be located at all altitudes: from the ground to low Earth orbit (LEO) satellites. Two major types of measurements can be made: _i_) relative power measurements between direct and reflected signals from which we can derive, for instance, the surface roughness, and by extension the surface wind (this is the [mission CYGNSS](http://clasp-research.engin.umich.edu/missions/cygnss/)), and _ii_) measurements of relative delay between direct and reflected signals. For more details see [1-3].

![GNSS-R]({{ "/assets/images/GNSS-R.jpg" | relative_url }}){:width="800x"}
{: style="text-align: center;"}
_Figure 1 (from [1]): Basic idea behind GNSS reflectometry and GNSS radio occultation._
{: style="text-align: center;"}

The goal of this project is to implement a basic GNSS-R architecture, that is, the lower blocks (reflected signal processing) in Figure 2. The detailed objectives of the project are: _i_) understand the signal processing principles of a GNSS Rx (ACQ, TRK and PVT - upper blocks in Figure 2) and the corresponding implementation in GNSS-SDR, _ii_) implement the reflected signal processing within GNSS-SDR (lower blocks in Figure 2), and _iii_) test the GNSS-R architecture using real signals.

![GNSS-R-SP]({{ "/assets/images/GNSS-R-Architecture.jpg" | relative_url }}){:width="800x"}
{: style="text-align: center;"}
_Figure 2 (from [2]):  Signal processing architecture. The same carrier replica is used for direct and reflected carrier wipe-off. PVT is Position Velocity, Time, PPP is Precise Point Positioning, and NTM is Numerical Terrain Model._
{: style="text-align: center;"}

References:

[1] K. Yu et al., "[An overview of GNSS remote sensing](https://link.springer.com/article/10.1186/1687-6180-2014-134)", EURASIP Journal on Advances in Signal Processing, August 2014.

[2] L. Lestarquit et al, "[Reflectometry With an Open-Source Software GNSS Receiver: Use Case With Carrier Phase Altimetry](https://ieeexplore.ieee.org/document/7501832)", IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing, Vol. 9, no 10, pp. 4843-4853, Oct. 2016

[3] V. U. Zavorotny et al., "[Tutorial on Remote Sensing Using GNSS Bistatic Radar of Opportunity](https://ieeexplore.ieee.org/document/6985926)", IEEE Geoscience and Remote Sensing Magazine, Vol. 2 , no 4, pp. 8-45, Dec. 2014.



### Skills required:

Good understanding of GNSS signal processing and C++ programming (familiarity with the [GNU Radio](https://gnuradio.org) framework is a plus).

### Potential mentor(s):

Dr. Jordi Vil&agrave;-Valls, Dr. Javier Arribas.

-------



-------


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

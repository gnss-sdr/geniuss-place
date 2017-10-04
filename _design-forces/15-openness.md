---
title: "15.- Openness"
permalink: /design-forces/openness/
excerpt: "The degree to which something is accessible to be viewed, modified, distributed and used."
header:
  teaser: /assets/images/design-force-teaser.png
last_modified_at: 2016-07-29T15:54:02-04:00
---

Openness is a relative characteristic that refers to the degree to which something is accessible to view, modify and use. From a social perspective, openness is a core characteristic of an infrastructure that conveys and reinforces sharing, reciprocity, collaboration, tolerance, equality, justice and freedom.

According to Tapscott[^Tapscott13], openness is based on four fundamental principles:

* **Collaboration**: The boundaries of organizations are becoming more porous.
* **Transparency**: This is about communication of pertinent information to stakeholders of organizations: employees, customers, business partners, shareholders, and so on.
You also need to have values in order to build trust upon them.
* **Sharing**: This is about giving up assets, intellectual property. We need to reinvent the whole model of scientific research. There is a need to place assets in a commons, a need to share pre-competitive research.
* **Empowerment**: Knowledge and intelligence is power. As it becomes more distributed, there is a distribution, decentralization and disaggregation of power.


The application of openness, as implied by various accessibility features, to a growing number of central ubiquitous practices that drive the human enterprise, has turned into a _megatrend_ that has been labelled "_the Rise of Open-X_"[^Avital11]. Open-X has materialized in various configurations that can be classified according to three archetypes: open source, open design and open innovation.

The value proposition and thrust of **[Free and Open Source Software (FOSS)](https://en.wikipedia.org/wiki/Free_and_open-source_software)** resides in distributed development processes that emphasize the _modification-related_ capabilities of openness. Everyone can freely access the source code, and can modify and redistribute it under the same terms, thus nourishing continuous cycles of improvement, adaptation, and extension in a distributed fashion. For more details, please check out [this guide on Open-Source Software Licenses](http://wiht.link/OS-licenses), which describes the most popular open-source licenses currently available and provides further reading (guides, tutorials, and infographics).

The value proposition and thrust of **[Open Design](https://github.com/OpenDesign-WorkingGroup/Open-Design-Definition)** resides in distributed manufacturing processes that emphasize the _use-related_ capabilities of openness.  It is a trend that is product of current technological development, specifically the easy access to computer-aided production tools and the Internet.

> Open Design is a design artifact project whose source documentation is made publicly available so that anyone can study, modify, distribute, make, prototype and sell the artifact based on that design. The artifact's source, the design documentation from which it is made, is available in the preferred format for making modifications to it.
> <cite><a href="https://github.com/OpenDesign-WorkingGroup/Open-Design-Definition">Open Design Working Group</a></cite>

The value proposition and thrust of **[Open Innovation](https://en.wikipedia.org/wiki/Open_innovation)** resides in distributed knowledge processes that emphasize the _view-related_ capabilities of openness. According to open innovation, industry leaders make the best use of internal and external ideas to develop better business models.

## Indicators of Openness

It follows a list of possible openness indicators for a software-defined GNSS receiver:

* Software released under a [free and open source license](https://opensource.org/licenses).
  - Allowing derivative works under the same license terms.
  - Allowing its commercial usage.
  - Dual licensing schemes.

* Availability of a technical report on algorithms and parameters used for:
  - Signal conditioning (possible digital down--conversion, filtering, decimation, sample format).
  - Signal acquisition.
  - Signal tracking.
  - Demodulation/decoding of navigation message.
  - PVT computation.

* In case of assisted / differential GNSS, reporting of the accessability of the assistance / differential sources and nature of the delivered data.


-------

## References

[^Tapscott13]: Tapscott, D., Williams, A.D.: Radical Openness: Four Unexpected Principles for Success. [TED Conference](https://www.ted.com/talks/don_tapscott_four_principles_for_the_open_world_1?language=en), LLC, New York, NY (2013).

[^Avital11]: Avital, M.: The generative bedrock of open design. In: B. van Abel, L. Evers, R. Klaassen, P. Troxler (eds.) [Open design now: why design cannot remain exclusive](http://opendesignnow.org/), pp. 48– 58. BIS Publishers, Amsterdam, The Netherlands (2011)

---
title: "16 Design Forces for software-defined GNSS receivers"
excerpt: "A discussion on how to assess software-defined GNSS receivers."
permalink: "/design-forces/"
comments: true
header:
  image: /assets/images/kpi-header.jpg
  teaser: /assets/images/kpi-header.jpg
sidebar:
  nav: "geniuss-place"
---

A GNSS receiver is a complex device which performance is affected by a wide range of internal and external factors. To the best of the authors' knowledge, the first formal effort to define testing procedures for GPS receivers is found in the paper by Teasley[^Teasley95], a work that anticipated the key concepts of the Standard 101 published by the Institute of Navigation in 1997[^ION97]. Such procedures have been widely accepted by the GNSS industry and, two decades later, world-class testing firms are still referencing them in their white papers. In summary, the set of those proposed testing procedures measure receiver's sensitivity in acquisition and tracking, diverse time-to-first-fix and reacquisition times, static and dynamic location accuracy and robustness to multipath and radio frequency interferences.


The very nature of software-defined radio technology requires a broader approach. A GNSS receiver in which the baseband processing chain is implemented in software and executed by a general-purpose processor in a computer system has other design forces equally important and clue for real impact and to reach technical, market and social success, but they are usually not captured by _traditional_ GNSS testing procedures and quality metrics.


**Key  Performance  Indicators  (KPIs)**  are  goals  or  targets  that  measure  how  well  a given activity  is  doing  on achieving  its  overall  operational  objectives  or  critical  success  factors.  KPIs  must  be  objectively defined in order to provide a quantifiable and measurable indication of the product or service development progress towards achieving its goals.
{: .notice--info}


S.M.A.R.T.  is  an  acronym mentioned  for  the  first  time  in  1981[^Doran81],  and  it  is  usually  referred to  when identifying  and defining KPIs, in order to remind their desirable features:

  * **Specific**: Is this KPI too broad, or is it clearly defined and identified?
  * **Measurable**: Can the measure be easily quantified?
  * **Attainable**:  Is  it  realistic  for  us  to  obtain  this  measure  within  the given project  framework?  Can  we take the appropriate measures to implement this KPI and see changes?
  * **Realistic**: Is our measure practical and pragmatic?
  * **Timely**: How often are we going to be able to look at data for its measure?
{: .notice--info}

Hence, KPIs are not universal but based on the very single project, product or service in which they are going to be applied. This page suggests a wide list of indicators derived from a list of Design Forces, defined below, to be considered when assessing the quality of a software-defined GNSS receiver. Its degree of _S.M.A.R.T.-ness_ in every particular context may vary.

The design of a GNSS software-defined receiver needs to resolve some design forces that could appear as antithetical, (_e.g._, portability _vs._ efficiency, openness _vs._ marketable product), and a "sweet spot" must be identified according to the targeted user and application. Hereafter, we identify 16 dimensions in which the performance and features of a software-defined GNSS receiver can be evaluated[^Fernandez16]. Click on their names to see a discussion of the concept and some possible metrics, indicators and check points:


<html> <body> <table> <tr> <td id="forcetable2">  
{% for post in site.design-forces %}
   {% include archive-single.html %}
{% endfor %}
</td> </tr> </table> </body> </html>

---

## References

[^Fernandez16]: C. Fern&aacute;ndez-Prades, J. Arribas, P. Closas, [_Assessment of software-defined GNSS receivers_](https://zenodo.org/record/266524#.WJR5AbbhB88){:target="_blank"}, in Proc. of [Navitec 2016](http://esaconferencebureau.com/2016-events/16c10/){:target="_blank"}, ESA-ESTEC, Noordwijk, The Netherlands, 14-16 Dec. 2016, pp. 1-9.

[^Teasley95]: J. B. S. Teasley, [_Summary of the initial GPS Test Standards Document: ION STD-101_](https://www.ion.org/publications/abstract.cfm?articleID=2506){:target="_blank"}, in Proc. of 8th International Technical Meeting of the Satellite Division of The Institute of Navigation, Palm Springs, CA, Sep. 1995, pp. 1645–1653.

[^ION97]: Institute of Navigation, _ION STD 101 recommended test procedures for GPS receivers_. Revision C, Manassas, VA, 1997.

[^Doran81]: G. Doran, _There's a S.M.A.R.T. way to write management's goals and objectives,_ Management Review, vol. 70, no. 11, pp. 35–36, 1981.

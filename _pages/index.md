---
layout: splash
permalink: /
date:
header:
  overlay_color: "#3399cc"
  overlay_image: mm-home-page-feature.jpg
  # cta_label: "<i class='fa fa-download'></i> Install Now"
  # cta_url: "/docs/quick-start-guide/"
  caption:
excerpt: 'An open source Global Navigation Satellite Systems software-defined receiver.' #<br /> <small>Currently at Version 3.2.7</small><br /><br /> {::nomarkdown}<iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=mmistakes&repo=minimal-mistakes&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe> <iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=mmistakes&repo=minimal-mistakes&type=fork&count=true&size=large" frameborder="0" scrolling="0" width="158px" height="30px"></iframe>{:/nomarkdown}'
feature_row:
  - image_path: pcb.png
    alt: "RF front-ends"
    title: "RF front-ends"
    excerpt: "Open Designs of radio frequency front-ends."
    url: "/rf-frontends/"
    btn_label: "See an example"
  - image_path: makers.png
    alt: "Enclosures"
    title: "Enclosures"
    excerpt: "Nice enclosures for your gear that you can print in 3D."
    url: "/enclosures/"
    btn_label: "See an example"
  - image_path: radar-chart.png
    alt: "KPIs"
    title: "Key Performance Indicators"
    excerpt: "A discussion on the assessment of software-defined GNSS receivers."
    url: "/docs/license/"
    btn_label: "Learn More"
#github:
#  - excerpt: '{::nomarkdown}<iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=mmistakes&repo=minimal-mistakes&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe> <iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=mmistakes&repo=minimal-mistakes&type=fork&count=true&size=large" frameborder="0" scrolling="0" width="158px" height="30px"></iframe>{:/nomarkdown}'
intro:
#  - excerpt: 'Get notified when I add new stuff &nbsp; [<i class="fa fa-twitter"></i> @mmistakes](https://twitter.com/mmistakes){: .btn .btn--twitter}'
---

{% include feature_row id="intro" type="center" %}

{% include feature_row %}

![GeNiuSS]({{ site.url }}{{ site.baseurl }}/images/geniuss.jpg){: width="300px"}
{: style="text-align: center;"}
[![Icon]({{ site.url }}{{ site.baseurl }}/images/icon-gnss-sdr-white.png){: width="36px"} Get Started]({{ site.url }}{{ site.baseurl }}/quick-start-guide/){: .btn .btn--geniuss .btn--x-large}
{: style="text-align: center;"}

---

<p>&nbsp;</p>

# Latest news
{: style="text-align: center;"}

<p>&nbsp;</p>

<html> <body > <table> <tr> <td id="gridtable">  
<div class="grid__wrapper">

{% include group-by-array collection=site.posts field="tags" %}

{% for tag in group_names %}
  {% if tag == "news" %}
    {% assign posts = group_items[forloop.index0] %}
    {% for post in posts limit:4 %}
      {% include archive-single.html type="grid" %}
    {% endfor %}
  {% endif %}
{% endfor %}

</div>
</td></tr></table></body></html>


---

<p>&nbsp;</p>

# Tutorials
{: style="text-align: center;"}

<p>&nbsp;</p>

<html> <body > <table> <tr> <td id="gridtable">  
<div class="grid__wrapper">
{% for tag in group_names %}
  {% if tag == "tutorial" %}
    {% assign posts = group_items[forloop.index0] %}
    {% for post in posts limit:4 %}
      {% include archive-single.html type="grid" %}
    {% endfor %}
  {% endif %}
{% endfor %}
</div>
</td></tr></table></body></html>


[![Icon]({{ site.url }}{{ site.baseurl }}/images/icon-gnss-sdr-white.png){: width="36px"} Learn more]({{ site.url }}{{ site.baseurl }}/docs/){: .btn .btn--geniuss .btn--x-large}
{: style="text-align: center;"}

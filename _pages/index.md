---
layout: splash
permalink: /
date:
header:
  overlay_color: "#000000" # "#3399cc"
  overlay_image: /assets/images/main-page-header.jpg
  cta_label: "<i class='fa fa-download'></i> Install Now"
  cta_url: "/build-and-install/"
  caption:
excerpt: 'An open source Global Navigation Satellite Systems software-defined receiver. <br /> <small>Current release: [v0.0.9](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.9){:target="_blank"}</small> <br /><br /> ' # {::nomarkdown}<iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=gnss-sdr&repo=gnss-sdr&type=watch&count=true&size=large&v=2" frameborder="0" scrolling="0" width="160px" height="30px"></iframe> <iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=gnss-sdr&repo=gnss-sdr&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe> <iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=gnss-sdr&repo=gnss-sdr&type=fork&count=true&size=large" frameborder="0" scrolling="0" width="158px" height="30px"></iframe>{:/nomarkdown}'
feature_row:
  - image_path: /assets/images/pcb.png
    alt: "RF front-ends"
    title: "Open Design of RF front-ends"
    excerpt: "Filling the gap between the antenna and the software receiver."
    url: "/rf-frontends/"
    btn_label: "Read more"
  - image_path: /assets/images/binder.png
    alt: "Enclosures"
    title: "Configuring processing blocks"
    excerpt: "Documentation on available signal processing blocks' configuration options."
    url: "/docs/sp-blocks/"
    btn_label: "Read more"
  - image_path: /assets/images/radar-chart.png
    alt: "KPIs"
    title: "Key Performance Indicators"
    excerpt: "A discussion on the assessment of software-defined GNSS receivers."
    url: "/design-forces/"
    btn_label: "Read more"
# github:
#  - excerpt: '{::nomarkdown}<iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=gnss-sdr&repo=gnss-sdr&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe> <iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=gnss-sdr&repo=gnss-sdr&type=watch&count=true&size=large&v=2" frameborder="0" scrolling="0" width="158px" height="30px"></iframe> <iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=gnss-sdr&repo=gnss-sdr&type=fork&count=true&size=large" frameborder="0" scrolling="0" width="158px" height="30px"></iframe>{:/nomarkdown}'
intro:
  - excerpt: '{::nomarkdown} <iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=gnss-sdr&repo=gnss-sdr&type=watch&count=true&size=large&v=2" frameborder="0" scrolling="0" width="160px" height="30px"></iframe> <iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=gnss-sdr&repo=gnss-sdr&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe> <iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=gnss-sdr&repo=gnss-sdr&type=fork&count=true&size=large" frameborder="0" scrolling="0" width="158px" height="30px"></iframe>{:/nomarkdown}'
---

{% include feature_row id="intro" type="center" %}

{% include feature_row %}

![GeNiuSS]({{ "/assets/images/geniuss.jpg" | absolute_url }}){: width="300px"}
{: style="text-align: center;"}
[![Icon]({{ "/assets/images/icon-gnss-sdr-white.png" | absolute_url }}){: width="36px"} Get Started]({{ "/quick-start-guide/" | absolute_url }}){: .btn .btn--geniuss .btn--x-large}
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


[![Icon]({{ "/assets/images/icon-gnss-sdr-white.png" | absolute_url }}){: width="36px"} Learn more]({{ "/docs/" | absolute_url }}){: .btn .btn--geniuss .btn--x-large}
{: style="text-align: center;"}

<link rel="prefetch" href="{{ "/assets/js/main.min.js" | absolute_url }}">
<link rel="prefetch" href="{{ "/assets/tipuesearch/css/normalize.css" | absolute_url }}">
<link rel="prefetch" href="{{ "/assets/tipuesearch/tipuesearch_content.js" | absolute_url }}">
<link rel="prefetch" href="{{ "/assets/tipuesearch/tipuesearch_set.js" | absolute_url }}">
<link rel="prefetch" href="{{ "/assets/tipuesearch/tipuesearch.min.js" | absolute_url }}">
<link rel="prerender" href="{{ "/search/" | absolute_url }}">
<link rel="prerender" href="{{ "/quick-start-guide/" | absolute_url }}">
<link rel="prerender" href="{{ "/docs/" | absolute_url }}">
<link rel="prerender" href="{{ "/build-and-install/" | absolute_url }}">
<link rel="prerender" href="{{ "/rf-frontends/" | absolute_url }}">
<link rel="prerender" href="{{ "/docs/sp-blocks/" | absolute_url }}">
<link rel="prerender" href="{{ "/design-forces/" | absolute_url }}">

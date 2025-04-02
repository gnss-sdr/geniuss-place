---
layout: splash
permalink: /
redirect_from:
  - /documentation/about-project
date:
header:
  overlay_color: "#000000" # "#3399cc"
  overlay_image: /assets/images/main-page-header.jpg
  actions:
    - label: "<i class='fas fa-download'></i> Install Now"
      url: "/build-and-install/"
  caption:
  teaser: /assets/images/logo-gnss-sdr.png
feature_row:
  - image_path: /assets/images/fix.png
    alt: "Using the software-defined receiver"
    title: "Using the software receiver"
    excerpt: "Get your first position fix using GNSS-SDR and a file containing raw signal samples."
    url: "/my-first-fix/"
    btn_class: "btn--geniuss"
    btn_label: "Read more"
  - image_path: /assets/images/binder.png
    alt: "Documentation"
    title: "Configuring processing blocks"
    excerpt: "Documentation on available signal processing blocks' configuration options."
    url: "/docs/sp-blocks/"
    btn_class: "btn--geniuss"
    btn_label: "Read more"
  - image_path: /assets/images/radar-chart.png
    alt: "KPIs"
    title: "Key Performance Indicators"
    excerpt: "A discussion on the assessment of software-defined GNSS receivers."
    url: "/design-forces/"
    btn_class: "btn--geniuss"
    btn_label: "Read more"
intro:
  - excerpt: '<big>An open-source Global Navigation Satellite Systems<br />software-defined receiver.</big><br /> <small>Current release: [v0.0.20](https://github.com/gnss-sdr/gnss-sdr/releases/tag/v0.0.20)</small> <br /><br /> {::nomarkdown} <iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=gnss-sdr&repo=gnss-sdr&type=watch&count=true&size=large&v=2" frameborder="0" scrolling="0" width="160" height="30" title="Watch counter"></iframe> <iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=gnss-sdr&repo=gnss-sdr&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160" height="30" title="Star counter"></iframe> <iframe style="display: inline-block;" src="https://ghbtns.com/github-btn.html?user=gnss-sdr&repo=gnss-sdr&type=fork&count=true&size=large" frameborder="0" scrolling="0" width="158" height="30" title="Fork counter"></iframe>{:/nomarkdown}'

---

{% include feature_row id="intro" type="center" %}

{% include feature_row %}

![GeNiuSS]({{ "/assets/images/geniuss.png" | relative_url }}){: width="300px"}
{: style="text-align: center;"}
[![Icon]({{ "/assets/images/icon-gnss-sdr-white.png" | relative_url }}){: width="36px"} Get Started]({{ "/quick-start-guide/" | relative_url }}){: .btn .btn--geniuss .btn--x-large}
{: style="text-align: center;"}

---

<p>&nbsp;</p>

# Latest news
{: style="text-align: center;"}

<p>&nbsp;</p>

<table> <tr> <td class="gridtable">
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
</td></tr></table>


---

<p>&nbsp;</p>

# Tutorials
{: style="text-align: center;"}

<p>&nbsp;</p>

<table> <tr> <td class="gridtable">
<div class="grid__wrapper">
{% for tag in group_names %}
  {% if tag == "tutorial" %}
    {% assign posts = group_items[forloop.index0] %}
    {% for post in posts limit:8 %}
      {% include archive-single.html type="grid" %}
    {% endfor %}
  {% endif %}
{% endfor %}
</div>
</td></tr></table>


[![Icon]({{ "/assets/images/icon-gnss-sdr-white.png" | relative_url }}){: width="36px"} Read the Documentation]({{ "/docs/" | relative_url }}){: .btn .btn--geniuss .btn--x-large}
{: style="text-align: center;"}

<link rel="prerender" href="{{ "/quick-start-guide/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/" | relative_url }}" />
<link rel="prerender" href="{{ "/build-and-install/" | relative_url }}" />
<link rel="prerender" href="{{ "/my-first-fix/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/sp-blocks/" | relative_url }}" />
<link rel="prerender" href="{{ "/design-forces/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/tutorials/gnss-signals/" | relative_url }}" />

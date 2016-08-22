---
layout: archive
title: "Documentation"
permalink: /docs/
excerpt: "Organization of the documentation"
related: true
modified: 2016-04-13T15:54:02-04:00
---

{% include base_path %}

Here you will find:

<html> <body > <table> <tr> <td id="gridtable">  
<div class="grid__wrapper">
  {% for post in site.docs %}
    {% if post.title == "Documentation" %} {% else %}
      {% include archive-single.html type="grid" %}
    {% endif %}
  {% endfor %}
</div>
</td></tr></table></body></html>


----

# Tutorials

In addition, there is a set of tutorials providing more information in particular topics or examples of use:

{% include group-by-array collection=site.posts field="tags" %}

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

... and [many more]({{ site.url }}{{ site.baseurl }}/docs/tutorials/)!

[![Icon]({{ site.url }}{{ site.baseurl }}/images/icon-gnss-sdr-white.png){: width="36px"} Check the full list of Tutorials]({{ site.url }}{{ site.baseurl }}/docs/tutorials/){: .btn .btn--geniuss .btn--x-large}
{: style="text-align: center;"}

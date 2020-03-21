---
layout: archive
title: "Documentation"
permalink: /docs/
excerpt: "Organization of the documentation"
related: true
comments: false
last_modified_at: 2016-04-13T15:54:02-04:00
redirect_from:
  - /documents
---

Here you will find:

<table> <tr> <td class="gridtable">
<div class="grid__wrapper">
  {% for post in site.docs %}
    {% if post.title == "Documentation" %} {% else %}
      {% include archive-single.html type="grid" %}
    {% endif %}
  {% endfor %}
</div>
</td></tr></table>


----

# Tutorials

In addition, there is a set of tutorials providing more information in particular topics or examples of use:

{% include group-by-array collection=site.posts field="tags" %}

<table> <tr> <td class="gridtable">
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
</td></tr></table>

... and [many more]({{ "/docs/tutorials/" | relative_url }})!

[![Icon]({{ "/assets/images/icon-gnss-sdr-white.png" | relative_url }}){: width="36px"} Check the full list of Tutorials]({{ "/docs/tutorials/" | relative_url }}){: .btn .btn--geniuss .btn--x-large}
{: style="text-align: center;"}

<link rel="prerender" href="{{ "/docs/sp-blocks/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/overview/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/fundamentals/" | relative_url }}" />
<link rel="prerender" href="{{ "/docs/control-plane/" | relative_url }}" />
<link rel="prerender" href="{{ "/quick-start-guide/" | relative_url }}" />

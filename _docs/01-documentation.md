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


<div class="grid__wrapper">
  {% for post in site.docs %}
    {% if post.title == "Documentation" %} {% else %}
      {% include archive-single.html type="grid" %}
    {% endif %}
  {% endfor %}
</div>

<p> &nbsp; </p>
<p>  &nbsp; </p>
<p>  &nbsp; </p>
<p>  &nbsp; </p>
<p>  &nbsp; </p>
<p>  &nbsp; </p>


----

# Tutorials

In addition, there is a set of tutorials providing more information in particular topics or examples of use:

{% include group-by-array collection=site.posts field="tags" %}


{% for tag in group_names %}
  {% if tag == "tutorial" %}
    {% assign posts = group_items[forloop.index0] %}
    {% for post in posts limit:4 %}
      {% include archive-single.html type="grid" %}
    {% endfor %}
  {% endif %}
{% endfor %}

<p> &nbsp; </p>
<p>  &nbsp; </p>
<p>  &nbsp; </p>
<p>  &nbsp; </p>
<p>  &nbsp; </p>
<p>  &nbsp; </p>

... and [many more]({{ site.url }}{{ site.baseurl }}/docs/tutorials/)!

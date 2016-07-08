---
layout: archive
title: "Documentation"
permalink: /docs/
excerpt: "Organization of the documentation"
related: true
modified: 2016-04-13T15:54:02-04:00
---

{% include base_path %}

Documentation. Here we explain how it is organized.

**Note:** We explain a lot of things here.
{: .notice--warning}


{% for post in site.docs %}
  {% if post.title == "Documentation" %} {% else %}
  {% include archive-single.html %}
  {% endif %}
{% endfor %}

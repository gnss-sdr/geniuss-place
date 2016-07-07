---
permalink: /team/
title: "Team"
comments: false
excerpt: "Team members profiles"
sidebar:
  nav: "about"
author:
- usman
- someone_else
role_main:
  - "Carles Fernandez"
  - "Javier Arribas"
---
{% include base_path %}


## Main Developer Team

<html> <body > <table>
 <tr>
     <td id="authortable">  
        {% assign pauthor = "Carles Fernandez" %}
        {% include author-profile.html %}
     </td>
     <td id="authortable">
        {% assign pauthor = "Javier Arribas" %}
        {% include author-profile.html %}
     </td>
     <td id="authortable">
        {% assign pauthor = "Luis Esteve" %}
        {% include author-profile.html %}
    </td>
    <td id="authortable">
    {% assign pauthor = "Pau Closas" %}
    {% include author-profile.html %}
   </td>
  </tr>
</table> </body> </html>

## Artwork

<html> <body > <table>
  <tr>
     <td id="authortable">  
        {% assign pauthor = "Ignacio Paniego" %}
        {% include author-profile.html %}
     </td>
  </tr>
</table> </body> </html>

---
title: "7.- Marketability"
permalink: /design-forces/marketability/
excerpt: "A measure of the ability of a security to be bought and sold."
last_modified_at: 2016-07-29T15:54:02-04:00
---

_Marketability_ is a measure of the ability of a security to be bought and sold. If there is an active marketplace for a security, it has good marketability. Producing higher quality products and pricing them competitively can increase marketability, attracting consumers wanting to choose our product over an equally priced item with less quality. But marketability can be also increased by radically changing the features of existing products by means of a technology shift, attracting customers with new product/service benefits (lower prices, openness, usefulness, sense of community, closer interaction between users and the actors of the value chain) while approaching quality of well-established products on the market, as well as opening blue oceans of market space.


## Indicators of Marketability

For every instantiation of a product or service based on a software-defined GNSS receiver, managers should identify the (minimal) viable product, for which the organization will be continuously delivering (minimal) marketable features (MF) to create or maintain a (minimal) marketable product or service. From those definitions, possible marketability indicators for a software-defined GNSS receiver are:

* **Business impact**: Savings obtained from the product or service with respect to a traditional (_i.e._, integrated circuit based) approach.
* **Defect Ratio**: Percentage of the total MF which are defects.
* **Work In Progress (WIP)**: From a cumulative flow diagram (CFD), compute the ratio between the MF WIP slope and closed MF slope. Both slopes should be the same to ensure optimal WIP limits are in place. That means the ratio should be 1. Forcing developers' personal WIP limit to 1 is ideal, beyond 3 is chaotic.
*  **Delivery Frequency**: From a CFD, compute the closed-issues slope. The slope should be either constant or increasing, never decreasing. Deployments (or licenses sold) per period could provide a good measure of how often the organization delivers.
* **Throughput**: Number of MF completed.
* **Demand versus throughput balance**: Open issues divided by target issues. This ratio should be maintained or decreasing, never increasing.
* **Variability**: From a control chart, compute the standard deviation of cycle and lead times. The objective is to narrow them.
* **Productivity effectiveness**: Ratio between current hours spent in the value stream and total hours paid.
* **Productivity efficiency**: Ratio between expected hours per MF and actual spent hours per MF.
* **Knowledge capture**: Number of final technical reports, which include recommendations, problems encountered, failure, success, learned lessons, etc. These documents have no value unless further accessed and re-used.

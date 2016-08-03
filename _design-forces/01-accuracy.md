---
title: "1.- Accuracy"
permalink: /design-forces/accuracy/
excerpt: "How close a Position-Velocity-Time (PVT) solution is to the true position."
modified: 2016-07-29T15:54:02-04:00
---

In this context, it refers to how close a Position-Velocity-Time (PVT) solution is to the true (actual) position (that is, a measure of the bias or systematic error). Its measurement requires a reference (fiducial) position in the case of static positioning, and a controlled mobile platform in the case of dynamic positioning.


|----------
|  **Measure**  |  **Formula** | **Confidence region probability** |
|:-:|:-:|:-:|    
|--------------
|  **2D DRMS**  | $$ \sqrt{\sigma_E^2+\sigma_N^2} $$  | 65 % |
|  **2D 2DRMS** | $$ 2\sqrt{\sigma_E^2+\sigma_N^2} $$ | 95 % |
|  **2D CEP**   | $$ 0.62\sigma_N+0.56\sigma_E $$, if $$ \frac{\sigma_N}{\sigma_E}>0.3 $$ | 50 % |
|  **3D MRSE**  | $$ \sqrt{\sigma_E^2+\sigma_N^2+\sigma_U^2} $$ | 61 % |
|  **3D SEP**   | $$ 0.51 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 50 % |
|-----

with the standard deviations computed as:

$$ \sigma_E^{(accuracy)} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(E[l]- E_{ref}\right)^2} $$

where $$ E_{ref} $$ is the East coordinate of the reference location. Similar expressions can be defined for the North and Up coordinates:

$$ \sigma_N^{(accuracy)} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(N[l]- N_{ref}\right)^2} $$

$$ \sigma_E^{(accuracy)} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(U[l]- U_{ref}\right)^2} $$


## Indicators of Accuracy

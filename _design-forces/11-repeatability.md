---
title: "11.- Repeatability"
permalink: /design-forces/repeatability/
excerpt: "How close a position solution is to the mean of all the obtained solutions. It is related to the spread of a measure, also referred to as precision."
modified: 2016-07-29T15:54:02-04:00
---

_Repeatability_ is related to the spread of a measure, also referred to as _precision_. It refers to how close a position solution is to the mean of all the obtained solutions, in a static location scenario.


 |----------
 |  **Measure**  |  **Formula** | **Confidence region probability** |
 |:-:|:-:|:-:|    
 |--------------
 |  **2D DRMS**      | $$ \sqrt{\sigma_E^2+\sigma_N^2} $$  | 65 % |
 |  **2D 2DRMS**      | $$ 2\sqrt{\sigma_E^2+\sigma_N^2} $$ | 95 % |
 |  **2D CEP**      | $$ 0.62\sigma_N+0.56\sigma_E $$, if $$ \frac{\sigma_N}{\sigma_E}>0.3 $$ | 50 % |
 |  **3D MRSE**  | $$ \sqrt{\sigma_E^2+\sigma_N^2+\sigma_U^2} $$ | 61 % |
 |  **3D SEP**   | $$ 0.51 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 50 % |
 |-----



$$ \sigma_{E}^{(precision)} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(E[l]- \hat{E}\right)^2} $$

where $$ \hat{E}=\frac{1}{L}\sum_{l=1}^{L}E[l] $$ is the mean of all the $$ E $$ coordinates of the obtained positioning solutions, $$ E[l] $$ are the East coordinates of the obtained positioning solutions, and $$ L $$ is the number of available position fixes. Similar expressions can be defined for the North and Up coordinates:

$$ \sigma_{N}^{(precision)} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(N[l]- \hat{N}\right)^2} $$, where $$ \hat{N}=\frac{1}{L}\sum_{l=1}^{L}N[l] $$, and

$$ \sigma_{U}^{(precision)} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(U[l]- \hat{U}\right)^2} $$, where $$ \hat{U}=\frac{1}{L}\sum_{l=1}^{L}U[l] $$.


## Indicators of Repeatability

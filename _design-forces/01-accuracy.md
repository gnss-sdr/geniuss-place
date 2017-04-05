---
title: "1.- Accuracy"
permalink: /design-forces/accuracy/
excerpt: "How close a Position-Velocity-Time (PVT) solution is to the true position."
last_modified_at: 2016-07-29T15:54:02-04:00
---

In this context, it refers to how close a position solution delivered by the software-defined GNSS receiver is to the _true_ (actual) position. Hence, it is a measure of the _bias_ or systematic error. Its measurement requires a reference (also known as _fiducial_) position in the case of static positioning, and a controlled mobile platform in the case of dynamic positioning.

The definition of the reference point implies the agreement on some reference coordinate systems for the satellite system and the reference position:

*  GNSS satellite coordinate reference system: The International Earth Rotation and Reference Sytems Service ([IERS](https://www.iers.org/IERS/EN/Home/home_node.html){:target="_blank"}) recommend to express it as "ITRFyy at epoch yyyy.y"[^Petit10]
* A local geographic coordinate reference system (providing transformation parameters, if applicable).
* An East-North-Up (ENU) reference frame with origin in the _reference point_.
* In case of differential GNSS configurations, datum of the differential source.

Upon those definitions, most common position accuracy metrics for 2D and 3D positioning, expressed in a local ENU reference frame, are defined below:

|----------
|  **Measure**  |  **Formula** | **Confidence region probability** | **Definition** |
|:-:|:-:|:-:|:--|  
|--------------
|  **2DRMS** | $$ 2\sqrt{\sigma_E^2+\sigma_N^2} $$ | 95 % | Twice the DRMS of the horizontal position errors, defining the radius of circle centered at the true position, containing the horizontal position estimate with probability of 95 %. |
|  **DRMS**  | $$ \sqrt{\sigma_E^2+\sigma_N^2} $$  | 65 % | The square root of the average of the squared horizontal position errors, defining the radius of circle centered at the true position, containing the horizontal position estimate with probability of 65 %. |
|  **CEP**   | $$ 0.62\sigma_N+0.56\sigma_E $$, accurate if $$ \frac{\sigma_N}{\sigma_E}>0.3 $$ | 50 % | The radius of circle centered at the true position, containing the horizontal position estimate with probability of 50 %. |
|  **99 % Spherical Accuracy Standard** | $$ 1.122 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 99 % | The radius of sphere centered at the true position, containing the position estimate in 3D with probability of 99 %  |
|  **90 % Spherical Accuracy Standard** | $$ 0.833 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 90 % | The radius of sphere centered at the true position, containing the position estimate in 3D with probability of 90 %  |
|  **MRSE**  | $$ \sqrt{\sigma_E^2+\sigma_N^2+\sigma_U^2} $$ | 61 % | The radius of sphere centered at the true position, containing the position estimate in 3D with probability of 61 % |
|  **SEP**   | $$ 0.51 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 50 % | The radius of sphere centered at the true position, containing the position estimate in 3D with probability of 50 % |
|-----

with the standard deviations, in the case of a static receiver, computed as:

$$ \sigma_E^{(\text{static accuracy})} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(E[l]- E_{ref}\right)^2} ,$$

where $$ E_{ref} $$ is the East coordinate of the reference location. Similar expressions can be defined for the North and Up coordinates:

$$ \sigma_N^{(\text{static accuracy})} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(N[l]- N_{ref}\right)^2} ,$$

$$ \sigma_E^{(\text{static accuracy})} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(U[l]- U_{ref}\right)^2} .$$

Ideally, static position measurements should be averaged over 24 hours and performed on a clear-sky environment.

In the case of a dynamic receiver, position measurements and references will have a time index. In order to mitigate differences due to satellite visibility and geometry, averaging on different trajectories and locations, performed at different time schedules, is encouraged.

For collections of $$ K_r $$ position measurements delivered at instants $$ t_{k_r} $$, and performed over $$ r=0,...,R-1 $$ different trajectories and time schedules:

$$ \sigma_E^{(\text{dynamic accuracy})} = \frac{1}{R}\sum_{r=0}^{R-1} \sqrt{\frac{1}{K_r-1}\sum_{k=0}^{K_r-1} \left(E_r(t_{k_r})- E_{r_{ref}}(t_{k_r})\right)^2} ,$$

where $$ E_{r_{ref}}(t_{k_r}) $$ is the East reference position of trajectory $$ r $$ at time $$ t_{k_r} $$, and $$ E_r(t_{k_r}) $$ is the position measurement in the East coordinate for trajectory $$ r $$ collected at time $$ t_{k_r} $$.  Similar expressions can be defined for the North and Up coordinates:

$$ \sigma_N^{(\text{dynamic accuracy})} = \frac{1}{R}\sum_{r=0}^{R-1} \sqrt{\frac{1}{K_r-1}\sum_{k=0}^{K_r-1} \left(N_r(t_{k_r})- N_{r_{ref}}(t_{k_r})\right)^2} ,$$

$$ \sigma_U^{(\text{dynamic accuracy})} = \frac{1}{R}\sum_{r=0}^{R-1} \sqrt{\frac{1}{K_r-1}\sum_{k=0}^{K_r-1} \left(U_r(t_{k_r})- U_{r_{ref}}(t_{k_r})\right)^2} .$$


## Indicators of Accuracy

Upon the definition of:

  -  The GNSS satellite coordinate reference system (expressed as "ITRFyy at epoch yyyy.y"[^Petit10]) and ellipsoid (_e.g._, WGS 84);
  -  The local geographic coordinate reference system (providing transformation parameters, if applicable) and ellipsoid;
  -  In the case of static accuracy, a _reference point_, adequately surveyed and expressed in a well--defined coordinate reference system, and in which the Antenna Reference Point (ARP) is placed when collecting raw signal data, or as defined by the synthetic generator tool;
  -  In the case of dynamic accuracy, one or more _reference timed trajectories_, in which the Antenna Reference Point (ARP) was mechanically moved when collecting raw signal data, or as defined by the synthetic generator tool;
  -  In case of differential GNSS configurations, the datum of the differential source;

it follows a list of possible accuracy indicators for a software-defined GNSS receiver:

* Stand-alone static position accuracy.
  -  Position accuracy results are given in meters of error with respect to a reference (fiducial)  point  previously  measured  in  a  geodetic  survey, or defined by the testing equipment. The most commonly used confidence measurements for 2D positioning are the Distance Root Mean Square (DRMS) and the Circular Error Probability (CEP); and the Mean Radial Spherical Error (MRSE), the Spherical Error Probable (SEP), and the 90 % and 99% Spherical Accuracy Standards when measures are expressed in 3D.

* Stand-alone dynamic position accuracy.
  - In this case, the reference is not a single point but a timed trajectory. Different trajectories and time schedules can be averaged to mitigate differences due to satellite visibility and geometry. Same metrics than for static positioning, where the position references might now have time and trajectory indeces.
  - Nominal mechanical accuracy of the controlled mobile platform moving the receiver while collecting measurements.

* Aided / DGNSS static position accuracy.
  - Same metrics than in stand-alone static scenarios.

* Aided / DGNSS dynamic position accuracy.
  - Same metrics than in stand-alone dynamic scenarios.
  - Nominal mechanical and time accuracies of the controlled mobile platform moving the antenna while collecting measurements.

----

## References

[^Petit10]: G. Petit and B. Luzum, Eds., [_IERS Conventions (2010)_](https://www.iers.org/SharedDocs/Publikationen/EN/IERS/Publications/tn/TechnNote36/tn36.pdf?__blob=publicationFile&v=1){:target="_blank"}, Verlag des Bundesamts f&uuml;r Kartographie und Geod&auml;sie, Frankfurt, Germany, 2010, IERS Technical Note 36. ISBN 3-89888-989-6.

---
title: "1.- Accuracy"
permalink: /design-forces/accuracy/
excerpt: "How close a Position-Velocity-Time (PVT) solution is to the true position."
modified: 2016-07-29T15:54:02-04:00
---

In this context, it refers to how close a position solution delivered by the software-defined GNSS receiver is to the true (actual) position. Hence, it is a measure of the _bias_ or systematic error. Its measurement requires a reference (fiducial) position in the case of static positioning, and a controlled mobile platform in the case of dynamic positioning.

The definition of the reference point implies the agreement on some reference coordinate systems:

*  GNSS satellite coordinate reference system: The International Earth Rotation and Reference Sytems Service ([IERS](https://www.iers.org/IERS/EN/Home/home_node.html){:target="_blank"}) recommend to express it as "ITRFyy at epoch yyyy.y"[^Petit10]
* A local geographic coordinate reference system (providing transformation parameters, if applicable), preferrably expressed on an East-North-Up (ENU) reference frame.
* In case of differential GNSS configurations, datum of the differential source.

Upon those definitions, most common position accuracy metrics for 2D and 3D positioning, expressed in a local reference frame, are defined below:

|----------
|  **Measure**  |  **Formula** | **Confidence region probability** | **Definition** |
|:-:|:-:|:-:|:--|  
|--------------
|  **2DRMS** | $$ 2\sqrt{\sigma_E^2+\sigma_N^2} $$ | 95 % | The square root of the average of the squared horizontal position errors. |
|  **DRMS**  | $$ \sqrt{\sigma_E^2+\sigma_N^2} $$  | 65 % | Twice the DRMS of the horizontal position errors. |
|  **CEP**   | $$ 0.62\sigma_N+0.56\sigma_E $$, accurate if $$ \frac{\sigma_N}{\sigma_E}>0.3 $$ | 50 % | The radius of circle centered at the true position, containing the horizontal position estimate with probability of 50 %. |
|  **99 % Spherical Accuracy Standard** | $$ 1.122 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 99 % | The radius of sphere centered at the true position, containing the position estimate in 3D with probability of 99 %  |
|  **90 % Spherical Accuracy Standard** | $$ 0.833 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 90 % | The radius of sphere centered at the true position, containing the position estimate in 3D with probability of 90 %  |
|  **MRSE**  | $$ \sqrt{\sigma_E^2+\sigma_N^2+\sigma_U^2} $$ | 61 % | The radius of sphere centered at the true position, containing the position estimate in 3D with probability of 61 % |
|  **SEP**   | $$ 0.51 \left(\sigma_E^2+\sigma_N^2+\sigma_U^2\right) $$ | 50 % | The radius of sphere centered at the true position, containing the position estimate in 3D with probability of 50 % |
|-----

with the standard deviations, in case of a static receiver, computed as:

$$ \sigma_E^{(\text{static accuracy})} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(E[l]- E_{ref}\right)^2} ,$$

where $$ E_{ref} $$ is the East coordinate of the reference location. Similar expressions can be defined for the North and Up coordinates:

$$ \sigma_N^{(\text{static accuracy})} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(N[l]- N_{ref}\right)^2} ,$$

$$ \sigma_E^{(\text{static accuracy})} = \sqrt{\frac{1}{L-1}\sum_{l=1}^L \left(U[l]- U_{ref}\right)^2} .$$

In case of a dynamic receiver, position measurements and references will have a time index. In order to mitigate differences due to satellite visibility and geometry, averaging on different trajectories and locations, performed at different time schedules, is encouraged.

## Indicators of Accuracy

Upon the definition of:

  -  GNSS satellite coordinate reference system (expressed as "ITRFyy at epoch yyyy.y"[^Petit10]) and ellipsoid (_e.g._, WGS 84);
  -  The local geographic coordinate reference system (providing transformation parameters, if applicable) and ellipsoid;
  -  In case of differential GNSS configurations, the datum of the differential source.

possible indicators of accuracy are:

* Stand-alone static position accuracy.
  -  Position accuracy results are given in meters of error with respect to a reference (fiducial)  point  previously  measured  in  a  geodetic  survey, or defined by the testing equipment. The most commonly used confidence measurements for 2D positioning are the Distance Root Mean Square (DRMS) and the Circular Error Probability (CEP); and the Mean Radial Spherical Error (MRSE), the Spherical Error Probable (SEP), and the 90 % and 99% Spherical Accuracy Standards when measures are expressed in 3D.

* Stand-alone dynamic position accuracy.
  - In this case, the reference  is not a single point but a timed trajectory. Different trajectories and locations can be averaged to mitigate differences due to satellite visibility and geometry. Same metrics than for static positioning, where the position references will now have a time index.

* Aided / DGNSS static position accuracy.
  - Same metrics than in stand-alone configurations.

* Aided / DGNSS dynamic position accuracy.
  - Same metrics than in stand-alone configurations.


----

## References

[^Petit10]: G. Petit and B.Luzum, Eds., [_IERS Conventions (2010)_](https://www.iers.org/SharedDocs/Publikationen/EN/IERS/Publications/tn/TechnNote36/tn36.pdf?__blob=publicationFile&v=1){:target="_blank"}, Verlag des Bundesamts f&uuml;r Kartographie und Geod&auml;sie, Frankfurt, Germany, 2010, IERS Technical Note 36. ISBN 3-89888-989-6.

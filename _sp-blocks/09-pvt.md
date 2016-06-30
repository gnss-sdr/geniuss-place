---
title: "PVT"
permalink: /docs/sp-blocks/pvt/
excerpt: "Documentation for the PVT block"
modified: 2016-04-13T15:54:02-04:00
---
{% include toc %}

### Implementation: `GPS_L1_CA_PVT`

```ini
;######### PVT CONFIG ############
PVT.implementation=GPS_L1_CA_PVT
PVT.nmea_dump_filename=./gnss_sdr_pvt.nmea ; NMEA log path and filename
PVT.flag_nmea_tty_port=true ; Enable the NMEA log to a serial TTY port 
PVT.nmea_dump_devname=/dev/pts/4 ;serial device descriptor for NMEA log
PVT.dump=false ; Enables the PVT internal binary data file logging
```

### Implementation: `Galileo_E1_PVT`

### Implementation: `Hybrid_PVT`

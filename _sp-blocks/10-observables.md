---
title: "Observables"
permalink: docs/sp-blocks/observables/
excerpt: "Documentation for the Observables block"
sidebar:
  nav: "sp-block"
modified: 2016-04-13T15:54:02-04:00
---
{% include toc %}

### Implementation: `GPS_L1_CA_Observables`

Parameters:

|----------
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `flag_averaging` |  . It defaults to `false`. | Optional |
| `output_rate_ms` |  . It defaults to 500 ms. | Optional |
| `dump` |  . It defaults to `false`. | Optional |
| `dump_filename` |  . It defaults to `./navigation.dat` | Optional |
|--------------

  _Observables implementation:_ **`GPS_L1_CA_Observables`**.
  {: style="text-align: center;"}

Example:

```ini
    ;######### OBSERVABLES CONFIG ############
    Observables.implementation=GPS_L1_CA_Observables
    Observables.dump=false
    Observables.dump_filename=./observables.dat
```

### Implementation: `Galileo_E1B_Observables`

Parameters:

|----------
|  **Parameter**  |  **Description** | **Type** |
|:-:|:--|:-:|    
|--------------
| `flag_averaging` |  . It defaults to `false`. | Optional |
| `output_rate_ms` |  . It defaults to 500 ms. | Optional |
| `dump` |  . It defaults to `false`. | Optional |
| `dump_filename` |  . It defaults to `./navigation.dat` | Optional |
|--------------

  _Observables implementation:_ **`Galileo_E1B_Observables`**.
  {: style="text-align: center;"}

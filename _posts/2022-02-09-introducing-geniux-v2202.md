---
title: "Introducing Geniux v22.02"
excerpt: "Geniux v22.02: a GNU/Linux custom distribution for running GNSS-SDR on embedded devices."
header:
  teaser: /assets/images/geniux-teaser.png
tags:
  - news
  - embedded
author_profile: false
sidebar:
  nav: "news"
toc: true
toc_sticky: true
last_modified_at: 2022-02-18T11:54:02+02:00  
---

![Geniux logo]({{ "/assets/images/geniux-logo.png" | relative_url }}){:width="500px"}{: .align-center .invert-colors}

Geniux (<span style="color: DarkOrange">**G**</span>NSS-SDR for <span
style="color: DarkOrange">**E**</span>mbedded G<span style="color:
DarkOrange">**N**</span>U/L<span style="color: DarkOrange">**i**</span>n<span
style="color: DarkOrange">**ux**</span>) is a customized GNU/Linux distribution
for developing and running GNSS-SDR on embedded devices, based on the [Yocto
Project](https://www.yoctoproject.org/). This Operating System includes a
specific set of popular tools, libraries, and device drivers tailored for
supporting an extended range of Software Defined Radio applications, helping to
bring them to production-ready deployments with an approach [widely adopted
throughout the embedded/IoT
industry](https://www.yoctoproject.org/is-yocto-project-for-you/).

The Geniux distribution comes in different version names, following [those of
the Yocto Project](https://wiki.yoctoproject.org/wiki/Releases), being Rocko the
oldest supported version. Each version name is tagged with a timestamp, so
Geniux versions can evolve in time, but tagged versions can be reproduced at any
time in the future. In addition, each version and each time tag can be built for
a particular board or machine. This is expressed in the figure below:

![Geniux evolution]({{ "/assets/images/geniux-evolution.png" | relative_url }}){:width="800px"}{: .align-center .invert-colors}
_Geniux keeps the pace of the software ecosystem evolution, but older versions
are still reproducible. Virtualization technology allows reproducing images
regardless of the software stack running at the host system building it_.
{: style="text-align: center;"}

Those names (Rocko, Sumo, Thud, Warrior, Zeus, etc.) represent major Geniux
versions. Then, each named version can have time tags (in the figure above,
`20.09` and `20.10`). All versions have a `latest` tag pointing to the latest
commit. Each named version with a time tag can be built for different
boards or machines (in the figure above, `zedboard-zynq7` and `rasperrypi3`).


## Version naming

The Geniux distribution follows the versioning format
`VERSION_NAME-MANIFEST_DATE.CONF_NUMBER`, where:

* VERSION_NAME follows those of the [Yocto Project
  releases](https://wiki.yoctoproject.org/wiki/Releases).
  - `rocko`, `sumo`, `thud`, `warrior`, `zeus`, `dunfell`, `gatesgarth`,
    `hardknott`, `honister`.
* MANIFEST_DATE follows the tag names at
  [https://github.com/carlesfernandez/oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest).
  The time tag `latest` always exists for each version name, and points to the
  latest release.
  - `20.09`, `21.02`, ..., `21.08`, `22.02`, `latest`.
* CONF_NUMBER: minor version number.
  - `0`, `1`, ...

Example of version name: `rocko-22.02.0`.


## Generating Geniux images for a specific version, time tag, and machine

The generation of images and SDKs for a given Geniux version, time tag, and
machine in a virtualized environment is automated by the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) repository. With
[Docker](https://www.docker.com/) already installed and running on your system,
clone the Git repository and go to its base path:

```console
$ git clone https://github.com/carlesfernandez/yocto-geniux
$ cd yocto-geniux
```

Now you are ready to build Geniux images for the release you want with a single
command, by using the `geniux-builder.sh` script. Taking a look at its help
message:

```console
$ ./geniux-builder.sh --help
```

You should get:
```
This script builds and stores Geniux images.

Usage:
./geniux-builder.sh [version] [manifest] [machine] (--image-only / -i)

Options:
 version   Geniux version: rocko, sumo, thud, warrior, zeus,
           dunfell, gatesgarth, hardknott, honister. Default: dunfell
           Check available branches at https://github.com/carlesfernandez/meta-gnss-sdr
 manifest  Geniux version manifest: 21.02, 21.08, 22.02, latest. Default: latest
           Dated manifests available at https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tags
 machine   Specify your (list of) MACHINE here. By default, zedboard-zynq7 and raspberrypi3 are built.
           If more than one, surround it with quotes, e.g.: "raspberrypi4-64 intel-corei7-64"
 --image-only / -i  (optional) Build the image but do not execute the container.

Environment variables that affect behavior:
 GENIUX_MIRROR_PATH          Base path to local mirror. Only used if set.
                             e.g.: 'export GENIUX_MIRROR_PATH=/home/carlesfernandez/mirror'
                             The mirror is expected to be at '$GENIUX_MIRROR_PATH/sources/$version'
 GENIUX_STORE_PATH           Path in which products will be stored. Only used if set.
                             e.g.: 'export GENIUX_STORE_PATH=/home/carlesfernandez/geniux-releases'
 GENIUX_STORE_REQUIRES_SUDO  If set, the script will ask for super-user privileges to write in the store.
                             You will be asked only once at the beginning. The password will not be revealed.
                             e.g.: 'export GENIUX_STORE_REQUIRES_SUDO=1'
```
{: class="no-copy"}

You can find specific examples of how to use this script below. For more
advanced usage modes (*e.g.*, an interactive mode that allows you to make
changes and experiment), check the [instructions
here](https://github.com/carlesfernandez/yocto-geniux/blob/main/README.md).

The building process takes several hours and requires a powerful host system
with at least 120 GB of free space in the hard disk and 32 GB of RAM. When
finished, you will get your products in the `output/` folder (or wherever the
`GENIUX_STORE_PATH` environment variable points to). Among others:

* gnss-sdr-demo-image: an image containing gnss-sdr, ready to go. It defines the
  "root" and "geniux" users, both with default password "geniux".
* gnss-sdr-dev-image: a development image with everything required for gnss-sdr,
  **but without gnss-sdr**. You can cross-compile the binary and copy it to the
  target filesystem. No password.
* Starting from Zeus v21.08, `wic.xz` and `wic.bmap` image files ready to de
  deployed on an SD card.
* gnss-sdr-dev-docker: a Docker development image archive file for the target
  architecture.
* A script that installs a software development kit (SDK) for
  [cross-compiling]({{ "docs/tutorials/cross-compiling/" | relative_url }}).

Please note that if the automated building process fails for some reason
(failing network connection, misconfiguration, disappeared source repositories,
shortage of free hard disk space, RAM memory or CPU resources, etc.) before it
finishes, the running container will be deleted and you will lose everything, so
you will need to start over again. For a safer procedure, you can use the
[interactive
mode](https://github.com/carlesfernandez/yocto-geniux/blob/main/README.md#interactive-method)
of the Docker image, which allows you to make changes, retry after a failure,
build other images, and save your products to `/home/geniux/yocto/output/` when
done, so _outside_ the Docker container. The container itself will be deleted at
exit.
{: .notice--info}


## Main features

### Geniux Rocko 22.02.0

* Operating System based on the Yocto Project version 2.4.4.
* It brings, among many others, the following software packages:
  * Development tools: Automake v1.15.1, CMake v3.8.2, GCC v7.3.0
    (+&nbsp;libgfortran), make v4.2.1, ninja v1.7.2, Python v2.7.14 and v3.5.3.
  * Goodies for signal processing:
    - GNSS-SDR v0.0.16.
    - SDR framework: GNU Radio v3.7.13.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.6, Lapack v3.7.0,
      VOLK v1.4.0.
    - C++ supporting libraries: Boost v1.64.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.11.0, Matio v1.5.21, Protocol Buffers v3.4.1, Pugixml
      v1.11.4.
    - Graphical representation: Gnuplot v5.0.5.
    - Additional Python modules (_e.g._, Scipy, Matplotlib) can be installed
      with `pip3`.
  * Software drivers and tools for RF front-ends: UHD v3.10.2.0 (+ gr-uhd),
    gr-osmosdr v0.1.4.1 (+ rtl-sdr, airspy, hackrf, and rfspace), gr-iio v0.3,
    libiio v2019_R1, libad9361-iio v2019_R1, iio-oscilloscope v2019_R1.
* It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/rocko/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=rocko),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=rocko),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/rocko/meta/conf/machine)
  layers.
* The
  [`meta-gnss-sdr`](https://github.com/carlesfernandez/meta-gnss-sdr/tree/rocko)
  layer is compatible with Xilinx PetaLinux Tools v2018.3.

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) repo:

```console
$ ./geniux-builder.sh rocko 22.02 zedboard-zynq7
```

```console
$ ./geniux-builder.sh rocko 22.02 zcu102-zynqmp
```

```console
$ ./geniux-builder.sh rocko 22.02 raspberrypi3
```

```console
$ ./geniux-builder.sh rocko 22.02 intel-corei7-64
```

```console
$ ./geniux-builder.sh rocko 22.02 qemuarm
```

You can replace `22.02` by `latest` in order to get the latest developments.

### Geniux Sumo 22.02.0

* Operating System based on the Yocto Project version 2.5.3.
* It brings, among many others, the following software packages:
  * Development tools: Automake v1.15.1, CMake v3.10.3, GCC v7.3.0
    (+&nbsp;libgfortran), make v4.2.1, ninja v1.8.2, Python v2.7.15 and v3.5.5.
  * Goodies for signal processing:
    - GNSS-SDR v0.0.16.
    - SDR framework: GNU Radio v3.7.13.5.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.7, Lapack v3.7.0,
      VOLK v1.5.0.
    - C++ supporting libraries: Boost v1.66.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.11.0, Matio v1.5.21, Protocol Buffers v3.5.1, Pugixml
      v1.11.4.
    - Graphical representation: Gnuplot v5.2.2.
    - Additional Python modules (_e.g._, Scipy, Matplotlib) can be installed
      with `pip3`.
  * Software drivers and tools for RF front-ends: gr-osmosdr v0.1.4.1 (+ rtl-sdr
    and hackrf), gr-iio v0.3, libiio v2019_R1, libad9361-iio v2019_R1,
    iio-oscilloscope v2019_R1.
* It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/sumo/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=sumo),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=sumo),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/sumo/meta/conf/machine)
  layers.

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) repo:

```console
$ ./geniux-builder.sh sumo 22.02 zedboard-zynq7
```

```console
$ ./geniux-builder.sh sumo 22.02 raspberrypi3
```

```console
$ ./geniux-builder.sh sumo 22.02 intel-corei7-64
```

```console
$ ./geniux-builder.sh sumo 22.02 qemuarm64
```

You can replace `22.02` by `latest` in order to get the latest developments.

### Geniux Thud 22.02.0

* Operating System based on the Yocto Project version 2.6.4.
* It brings, among many others, the following software packages:
  * Development tools: Automake v1.16.1, CMake v3.12.2, GCC v8.2.0
    (+&nbsp;libgfortran), make v4.2.1, ninja v1.8.2, Python v2.7.16 and v3.5.6.
  * Goodies for signal processing:
    - GNSS-SDR v0.0.16.
    - SDR framework: GNU Radio v3.7.14.0.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.8, Lapack v3.7.0,
      VOLK v2.2.1.
    - C++ supporting libraries: Boost v1.64.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.11.0, Matio v1.5.21, Protocol Buffers v3.6.1, Pugixml
      v1.11.4.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.2.2.
    - Additional Python modules (_e.g._, Scipy, Matplotlib) can be installed
      with `pip3`.
  * Software drivers and tools for RF front-ends: UHD v3.13.0.1 (+ gr-uhd),
    libiio v2019_R2, libad9361-iio v2019_R2, iio-oscilloscope v2019_R2.
* It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/rel-v2019.2/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=thud),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=thud),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/thud/meta/conf/machine)
  layers.
* The `meta-xilinx` layer points to the `rel-v2019.2` branch.
* The
  [`meta-gnss-sdr`](https://github.com/carlesfernandez/meta-gnss-sdr/tree/thud)
  layer is compatible with Xilinx PetaLinux Tools v2019.2.

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) repo:

```console
$ ./geniux-builder.sh thud 22.02 zedboard-zynq7
```

```console
$ ./geniux-builder.sh thud 22.02 zcu102-zynqmp
```

```console
$ ./geniux-builder.sh thud 22.02 raspberrypi3
```


```console
$ ./geniux-builder.sh thud 22.02 intel-corei7-64
```

```console
$ ./geniux-builder.sh thud 22.02 qemuarm64
```

You can replace `22.02` by `latest` in order to get the latest developments.

### Geniux Warrior 22.02.0

* Operating System based on the Yocto Project version 2.7.4.
* It brings, among many others, the following software packages:
  * Development tools: Automake v1.16.1, CMake v3.14.1, GCC v8.3.0
    (+&nbsp;libgfortran), make v4.2.1, ninja v1.9.0, Python v2.7.18 and v3.7.7.
  * Goodies for signal processing:
    - GNSS-SDR v0.0.16.
    - SDR framework: GNU Radio v3.8.2.0.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.9, Lapack v3.7.0,
      VOLK v2.3.0.
    - C++ supporting libraries: Boost v1.69.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.11.0, Matio v1.5.21, Protocol Buffers v3.6.1, Pugixml
      v1.11.4.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.2.2.
    - Additional Python modules (_e.g._, Scipy, Matplotlib) can be installed
      with `pip3`.
  * Software drivers and tools for RF front-ends: UHD v3.15.LTS (+ gr-uhd),
    gr-osmosdr v0.2.3 (+ rtl-sdr and hackrf), gr-iio v0.3, libiio v0.23,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
* It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/warrior/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=warrior),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=warrior),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/warrior/meta/conf/machine)
  layers.

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) repo:

```console
$ ./geniux-builder.sh warrior 22.02 zedboard-zynq7
```

```console
$ ./geniux-builder.sh warrior 22.02 raspberrypi4-64
```

```console
$ ./geniux-builder.sh warrior 22.02 intel-corei7-64
```

```console
$ ./geniux-builder.sh warrior 22.02 qemuarm64
```

You can replace `22.02` by `latest` in order to get the latest developments.

### Geniux Zeus 22.02.0

* Operating System based on the Yocto Project version 3.0.4.
* It brings, among many others, the following software packages:
  * Development tools: Automake v1.16.1, CMake v3.15.3, GCC v9.2.0
    (+&nbsp;libgfortran), make v4.2.1, ninja v1.9.0, Python v2.7.18 and v3.7.8.
  * Goodies for signal processing:
    - GNSS-SDR v0.0.16.
    - SDR framework: GNU Radio v3.8.2.0.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.9, Lapack v3.7.0,
      VOLK v2.3.0.
    - C++ supporting libraries: Boost v1.71.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.11.0, Matio v1.5.21, Protocol Buffers v3.9.2, Pugixml
      v1.11.4.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.2.2,
      Matplotlib v3.1.1.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  * Software drivers and tools for RF front-ends: UHD v3.15.LTS (+ gr-uhd),
    gr-osmosdr v0.2.3 (+ rtl-sdr and hackrf), gr-iio v0.3, libiio v0.23,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
* It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/rel-v2020.3/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=zeus),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=zeus),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/zeus/meta/conf/machine)
  layers.
* The `meta-xilinx` layer points to `rel-v2020.3` branch.

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) repo:

```console
$ ./geniux-builder.sh zeus 22.02 zedboard-zynq7
```

```console
$ ./geniux-builder.sh zeus 22.02 raspberrypi4-64
```

```console
$ ./geniux-builder.sh zeus 22.02 intel-skylake-64
```

```console
$ ./geniux-builder.sh zeus 22.02 qemuarm64
```

You can replace `22.02` by `latest` in order to get the latest developments.

### Geniux Dunfell 22.02.0

* Operating System based on the Yocto Project version 3.1.14 LTS.
* It brings, among many others, the following software packages:
  * Development tools: Automake v1.16.1, CMake v3.16.5, GCC v9.3.0
    (+&nbsp;libgfortran), make v4.3, ninja v1.10.0, Python v3.8.12.
  * Goodies for signal processing:
    - GNSS-SDR v0.0.16.
    - SDR framework: GNU Radio v3.8.5.0.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.9, Lapack v3.7.0,
      VOLK v2.4.1.
    - C++ supporting libraries: Boost v1.72.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.11.0, Matio v1.5.21, Protocol Buffers v3.11.4, Pugixml
      v1.11.4.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.2.8,
      Matplotlib v3.2.1.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  * Software drivers and tools for RF front-ends: UHD v3.15.LTS (+ gr-uhd),
    gr-osmosdr v0.2.3 (+ rtl-sdr and hackrf), gr-iio v0.3, libiio v0.23,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
* It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/gatesgarth/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=dunfell),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=dunfell),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/dunfell/meta/conf/machine)
  layers.

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) repo:

```console
$ ./geniux-builder.sh dunfell 22.02 zedboard-zynq7
```

```console
$ ./geniux-builder.sh dunfell 22.02 raspberrypi4-64
```

```console
$ ./geniux-builder.sh dunfell 22.02 intel-corei7-64
```

```console
$ ./geniux-builder.sh dunfell 22.02 qemuarm64
```

You can replace `22.02` by `latest` in order to get the latest developments.

### Geniux Gatesgarth 22.02.0

* Operating System based on the Yocto Project version 3.2.4.
* It brings, among many others, the following software packages:
  * Development tools: Automake v1.16.2, CMake v3.18.2, GCC v10.2.0
    (+&nbsp;libgfortran), make v4.3, ninja v1.10.1, Python v3.8.5.
  * Goodies for signal processing:
    - GNSS-SDR v0.0.16.
    - SDR framework: GNU Radio v3.9.5.0.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.9, Lapack v3.9.0,
      VOLK v2.5.0.
    - C++ supporting libraries: Boost v1.74.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.11.0, Matio v1.5.21, Protocol Buffers v3.13.0, Pugixml
      v1.11.4.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.2.8,
      Matplotlib v3.3.2.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  * Software drivers and tools for RF front-ends: UHD v3.15.LTS (+ gr-uhd),
    gr-osmosdr v0.2.3 (+ rtl-sdr and hackrf), gr-iio v0.3, libiio v0.23,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
* It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/rel-v2021.1/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=gatesgarth),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=gatesgarth),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/gatesgarth/meta/conf/machine)
  layers.
* The `meta-xilinx` layer points to the `rel-v2021.1` branch.
* Use `linux-xlnx` kernel for `zedboard-zynq7` machine, based on Linux kernel
  5.10.


Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) repo:

```console
$ ./geniux-builder.sh gatesgarth 22.02 zedboard-zynq7
```

```console
$ ./geniux-builder.sh gatesgarth 22.02 raspberrypi4-64
```

```console
$ ./geniux-builder.sh gatesgarth 22.02 intel-skylake-64
```

```console
$ ./geniux-builder.sh gatesgarth 22.02 qemuarm64
```

You can replace `22.02` by `latest` in order to get the latest developments.

### Geniux Hardknott 22.02.0

* Operating System based on the Yocto Project version 3.3.4.
* It brings, among many others, the following software packages:
  * Development tools: Automake v1.16.3, CMake v3.19.5, GCC v10.3.0
    (+&nbsp;libgfortran), make v4.3, ninja v1.10.2, Python v3.9.9.
  * Goodies for signal processing:
    - GNSS-SDR v0.0.16.
    - SDR framework: GNU Radio v3.9.5.0.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.9, Lapack v3.9.0,
      VOLK v2.5.0.
    - C++ supporting libraries: Boost v1.75.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.11.0, Matio v1.5.21, Protocol Buffers v3.15.2, Pugixml
      v1.11.4.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.2.8,
      Matplotlib v3.4.1.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  * Software drivers and tools for RF front-ends: UHD v3.15.LTS (+ gr-uhd),
    gr-osmosdr v0.2.3 (+ rtl-sdr and hackrf), gr-iio v0.3, libiio v0.23,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
* It can be built for machines defined by the
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=hardknott),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=hardknott),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/hardknott/meta/conf/machine)
  layers.

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) repo:

```console
$ ./geniux-builder.sh hardknott 22.02 intel-corei7-64
```

```console
$ ./geniux-builder.sh hardknott 22.02 raspberrypi4-64
```

```console
$ ./geniux-builder.sh hardknott 22.02 qemuarm64
```

You can replace `22.02` by `latest` in order to get the latest developments.


### Geniux Honister 22.02.0

* Operating System based on the Yocto Project version 3.4.2.
* It brings, among many others, the following software packages:
  * Development tools: Automake v1.16.3, CMake v3.21.1, GCC v11.2.0
    (+&nbsp;libgfortran), make v4.3, ninja v1.10.2, Python v3.9.9.
  * Goodies for signal processing:
    - GNSS-SDR v0.0.16.
    - SDR framework: GNU Radio v3.10.1.1.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.9, Lapack v3.9.0,
      VOLK v2.5.0.
    - C++ supporting libraries: Boost v1.77.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.11.0, Matio v1.5.21, Protocol Buffers v3.18.0, Pugixml
      v1.11.4.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.4.1,
      Matplotlib v3.4.1.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  * Software drivers and tools for RF front-ends:  gr-osmosdr v0.2.0 (+ rtl-sdr
    and hackrf), gr-iio v0.3, libiio v0.23, libad9361-iio v0.2, iio-oscilloscope
    v0.14.
* It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/honister/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=hardknott),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=hardknott),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/hardknott/meta/conf/machine)
  layers.

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) repo:

```console
$ ./geniux-builder.sh honister 22.02 intel-corei7-64
```

```console
$ ./geniux-builder.sh honister 22.02 raspberrypi4-64
```

```console
$ ./geniux-builder.sh honister 22.02 zedboard-zynq7
```

```console
$ ./geniux-builder.sh honister 22.02 zcu102-zynqmp
```

You can replace `22.02` by `latest` in order to get the latest developments.


## Flashing images on an SD card

Starting from Geniux Zeus 21.08, the `geniux-builder.sh` script produces `.wic`
images that can be flashed on an SD card and your device will be ready to go.
For image flashing, we recommend using a software tool such as [Balena
Etcher](https://www.balena.io/etcher/). Just pick up the
`gnss-sdr-demo-image-$MACHINE-yyyymmddHHMMSS.rootfs.wic.xz` file, flash your SD
card, insert it in your device, and it will be ready to boot and run `gnss-sdr`.
Other flashing options [here]({{
"/docs/tutorials/cross-compiling/#copying-an-image-file-to-your-sd-card" |
relative_url }}).

## Key repositories

All the required information for building a Geniux release is contained in three
public repositories:

* **meta-gnss-sdr layer**: Yocto layer defining all the packages in the Geniux
  distribution, including the recipes for downloading and building them, their
  cryptographic hash, the way to create customized full-system images.
  * URL:
    [https://github.com/carlesfernandez/meta-gnss-sdr](https://github.com/carlesfernandez/meta-gnss-sdr)
  * Each Geniux version is defined in a different branch: `rocko`, `sumo`,
    `thud`, `warrior`, `zeus`, `dunfell`, `gatesgarth`, `hardknott`, `honister`. Those
    branches are updated as we learn more about the Yocto Project usage, so they
    evolve in time.
* **oe-gnss-sdr-manifest**: Manifest containing the specific commits of all
  the other Yocto layers required to build Geniux (notably,
  [openembedded-core](https://github.com/openembedded/openembedded-core),
  [meta-openembedded](https://github.com/openembedded/meta-openembedded),
  [meta-qt5](https://github.com/meta-qt5/meta-qt5),
  [meta-sdr](https://github.com/balister/meta-sdr),
  [meta-xilinx](https://github.com/Xilinx/meta-xilinx),
  [meta-rasperrypi](http://git.yoctoproject.org/cgit/cgit.cgi/meta-raspberrypi),
  [meta-intel](http://git.yoctoproject.org/cgit/cgit.cgi/meta-intel), etc.).
  * URL:
    [https://github.com/carlesfernandez/oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest)
  * Each Geniux version is defined in a different branch: `rocko`, `sumo`,
    `thud`, `warrior`, `zeus`, `dunfell`, `gatesgarth`, `hardknott`, `honister`.
  * Tags: each tag corresponds to a version of the manifest in which the
    `meta-gnss-sdr` has been pinned to a specific commit. This allows
    fully-reproducible buildings in the future since it defines a
    fully-specified software system set. Examples: `rocko-20.09`, `sumo-20.09`,
   `thud-20.09`, etc.
  * In the above instructions, when `MANIFEST_DATE` is set to `latest`, all the
    layers are pinned to a specific commit but except the `meta-gnss-sdr` layer,
    which points to whatever it is in the corresponding branch of that layer at
    that point of time.    
* **yocto-geniux**: Tool for the virtualization and automation of the building
  process.
  * URL:
    [https://github.com/carlesfernandez/yocto-geniux](https://github.com/carlesfernandez/yocto-geniux)

If you miss any feature on Geniux, or have an idea on how to make it better,
pull requests and issues are welcome on those repositories. Their contents are
released under the [MIT License](https://opensource.org/licenses/MIT).


## Disclaimer

Yocto Project and all related marks and logos are trademarks of The Linux
Foundation. This website is not, in any way, endorsed by the Yocto Project or
[The Linux Foundation](https://linuxfoundation.org/).

&nbsp;

&nbsp;

Enjoy Geniux!

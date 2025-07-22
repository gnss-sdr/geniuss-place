---
title: "Introducing Geniux v25.04"
excerpt:
  "Geniux v25.04: a GNU/Linux custom distribution for running GNSS-SDR on
  embedded devices."
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
last_modified_at: 2025-04-24T11:54:02+02:00
---

![Geniux logo]({{ "/assets/images/geniux-logo.png" | relative_url }}){:width="500px"}{:
.align-center .invert-colors}

Geniux (<span style="color: DarkOrange">**G**</span>NSS-SDR for <span
style="color: DarkOrange">**E**</span>mbedded G<span style="color:
DarkOrange">**N**</span>U/L<span style="color: DarkOrange">**i**</span>n<span
style="color: DarkOrange">**ux**</span>) is a customized GNU/Linux distribution
for developing and running GNSS-SDR on embedded devices, based on the
[Yocto Project](https://www.yoctoproject.org/). This Operating System includes a
specific set of popular tools, libraries, and device drivers tailored for
supporting an extended range of Software Defined Radio applications, helping to
bring them to production-ready deployments with an approach
[widely adopted throughout the embedded/IoT industry](https://www.yoctoproject.org/about/project-overview/).

The Geniux distribution comes in different version names, following
[those of the Yocto Project](https://wiki.yoctoproject.org/wiki/Releases), being
Rocko the oldest supported version. Each version name is tagged with a
timestamp, so Geniux versions can evolve in time, but tagged versions can be
reproduced at any time in the future. In addition, each version and each time
tag can be built for a particular board or machine. This is expressed in the
figure below:

![Geniux evolution]({{ "/assets/images/geniux-evolution.png" | relative_url }}){:width="800px"}{:
.align-center .invert-colors} _Geniux keeps the pace of the software ecosystem
evolution, but older versions are still reproducible. Virtualization technology
allows reproducing images regardless of the software stack running at the host
system building it_.
{: style="text-align: center;"}

Those names (Rocko, Sumo, Thud, Warrior, Zeus, etc.) represent major Geniux
versions. Then, each named version can have time tags (in the figure above,
`20.09` and `20.10`). All versions have a `latest` tag pointing to the latest
commit. Each named version with a time tag can be built for different boards or
machines (in the figure above, `zedboard-zynq7` and `rasperrypi3`).

## Version naming

The Geniux distribution follows the versioning format
`VERSION_NAME-MANIFEST_DATE.CONF_NUMBER`, where:

- VERSION_NAME follows those of the
  [Yocto Project releases](https://wiki.yoctoproject.org/wiki/Releases).
  - `rocko`, `sumo`, `thud`, `warrior`, `zeus`, `dunfell`, `gatesgarth`,
    `hardknott`, `honister`, `kirkstone`, `langdale`, `mickledore`, `nanbield`,
    `scarthgap`, `styhead`, `walnascar`.
- MANIFEST_DATE follows the tag names at
  [https://github.com/carlesfernandez/oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest).
  The time tag `latest` always exists for each version name, and points to the
  latest release.
  - `20.09`, `21.02`, ..., `21.08`, `22.02`, `22.06`, `23.04`, `24.02`, `25.04`,
    `latest`.
- CONF_NUMBER: minor version number.
  - `0`, `1`, ...

Example of version name: `gatesgarth-25.04.0`.

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
 version   Geniux version (from oldest to most recent):
             rocko, sumo, thud, warrior, zeus, dunfell, gatesgarth, hardknott, honister,
             kirkstone, langdale, mickledore, nanbield, scarthgap, styhead, walnascar.
             Default: scarthgap
           Check available branches at https://github.com/carlesfernandez/meta-gnss-sdr
 manifest  Geniux version manifest: 21.02, 21.08, 22.02, 22.06, 23.04, 24.02, 25.04, latest.
           Default: latest
           Dated manifests available at https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tags
 machine   Specify your (list of) MACHINE here. By default, zcu102-zynqmp and raspberrypi5 are built.
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
advanced usage modes (_e.g._, an interactive mode that allows you to make
changes and experiment), check the
[instructions here](https://github.com/carlesfernandez/yocto-geniux/blob/main/README.md).

The building process takes several hours and requires a powerful host system
with at least 120 GB of free space in the hard disk and 32 GB of RAM. When
finished, you will get your products in the `output/` folder (or wherever the
`GENIUX_STORE_PATH` environment variable points to). Among others:

- gnss-sdr-demo-image: an image containing gnss-sdr, ready to go. It defines the
  "root" and "geniux" users, both with default password "geniux".
- gnss-sdr-dev-image: a development image with everything required for gnss-sdr,
  **but without gnss-sdr**. You can cross-compile the binary and copy it to the
  target filesystem. No password.
- Starting from Zeus v21.08, `wic.xz` and `wic.bmap` image files ready to de
  deployed on an SD card.
- gnss-sdr-dev-docker: a Docker development image archive file for the target
  architecture.
- A script that installs a software development kit (SDK) for
  [cross-compiling]({{ "docs/tutorials/cross-compiling/" | relative_url }}).

Please note that if the automated building process fails for some reason
(failing network connection, misconfiguration, disappeared source repositories,
shortage of free hard disk space, RAM memory or CPU resources, etc.) before it
finishes, the running container will be deleted and you will lose everything, so
you will need to start over again. For a safer procedure, you can use the
[interactive mode](https://github.com/carlesfernandez/yocto-geniux/blob/main/README.md#interactive-method)
of the Docker image, which allows you to make changes, retry after a failure,
build other images, and save your products to `/home/geniux/yocto/output/` when
done, so _outside_ the Docker container. The container itself will be deleted at
exit.
{: .notice--info}

## Main features

Ordered from the most recent to the oldest version:

### Geniux Walnascar 25.04.0

Still on active development!

- Operating System based on the Yocto Project version 5.2.
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.7, CMake v3.31.6, GCC v14.2.0
    (+&nbsp;libgfortran), make v4.4.1, ninja v1.12.1, Python v3.13.2.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.10.12
    - Number crunching libraries: Armadillo v14.4.0, FFTW v3.3.10, Lapack
      v3.12.0, VOLK v3.1.1.
    - C++ supporting libraries: Boost v1.86.0, abseil v20250127, googletest
      v1.16, Matio v1.5.28, Protocol Buffers v5.29.4, Pugixml v1.15, OpenSSL
      3.4.1.
    - Graphical representation: Gnuplot v5.4.3, Matplotlib v3.7.2.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  - Software drivers and tools for RF front-ends: UHD 4.8 (+&nbsp;gr-uhd),
    gr-iio, gr-osmosdr v0.2.4 (+&nbsp;rtl-sdr and hackrf), libiio v0.25,
    libad9361-iio v0.2, iio-oscilloscope v0.17.
- It can be built for machines defined by the
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?id=3ba4438d9d209382d6afa914c70814205e8f93ac),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?id=6eeb304b095fba12287e92a39e83b772d2198413),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/walnascar/meta/conf/machine)
  layers.

- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/walnascar-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15274845.svg)](https://doi.org/10.5281/zenodo.15274845)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh walnascar 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh walnascar 25.04 raspberrypi5
```

You can replace `25.04` by `latest` in order to get the latest developments.
Very much recommended in this case, since Walnascar is still actively developed.

### Geniux Styhead 25.04.0

- Operating System based on the Yocto Project version 5.1.4.
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.7, CMake v3.30.2, GCC v14.2.0
    (+&nbsp;libgfortran), make v4.4.1, ninja v1.12.1, Python v3.12.9.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.10.12.
    - Number crunching libraries: Armadillo v14.4.0, FFTW v3.3.10, Lapack
      v3.12.0, VOLK v3.1.1.
    - C++ supporting libraries: Boost v1.86.0, abseil v20240722, googletest
      v1.16, Matio v1.5.28, Protocol Buffers v4.25.5, Pugixml v1.15, OpenSSL
      v3.3.1.
  - Software drivers and tools for RF front-ends: UHD 4.8 (+&nbsp;gr-uhd),
    gr-iio, gr-osmosdr v0.2.4 (+&nbsp;rtl-sdr and hackrf), libiio v0.25,
    libad9361-iio v0.2, iio-oscilloscope v0.17.
- It can be built for machines defined by the
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?styhead),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=styhead),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/styhead/meta/conf/machine)
  layers.

- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/styhead-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15277520.svg)](https://doi.org/10.5281/zenodo.15277520)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh styhead 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh styhead 25.04 raspberrypi5
```

You can replace `25.04` by `latest` in order to get the latest developments.

### Geniux Scarthgap 25.04.0

- Operating System based on the Yocto Project version 5.0.8 LTS (until April 2028).
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.16.5, CMake v3.28.3, GCC v13.3.0
    (+&nbsp;libgfortran), make v4.4.1, ninja v1.11.1, Python v3.12.9.
  - Goodies for signal processing:
    - SDR framework: GNU Radio v3.10.12.
    - Number crunching libraries: Armadillo v12.8.2, FFTW v3.3.10, Lapack
      v3.12.0, VOLK v3.1.1.
    - C++ supporting libraries: Boost v1.84.0, abseil v20240116, googletest
      v1.14, Matio v1.5.27, Protocol Buffers v4.25.3, Pugixml v1.13, OpenSSL
      v3.2.4.
  - Software drivers and tools for RF front-ends: UHD 4.6 (+&nbsp;gr-uhd),
    gr-iio, gr-osmosdr v0.2.4 (+&nbsp;rtl-sdr and hackrf), libiio v0.25,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
- It can be built for machines defined by the
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?scarthgap),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=scarthgap),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/scarthgap/meta/conf/machine)
  layers.

  - Experimentally, the `meta-gnss-sdr` layer is compatible with AMD/Xilinx
    PetaLinux Tools v2024.2.

- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/scarthgap-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15277487.svg)](https://doi.org/10.5281/zenodo.15277487)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh scarthgap 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh scarthgap 25.04 raspberrypi5
```

You can replace `25.04` by `latest` in order to get the latest developments.

### Geniux Nanbield 25.04.0

- Operating System based on the Yocto Project version 4.2.4.
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.16.5, CMake v3.27.0, GCC v13.2.0
    (+&nbsp;libgfortran), make v4.4.1, ninja v1.11.1, Python v3.11.5.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.10.12.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.10, Lapack
      v3.10.1, VOLK v3.1.1.
    - C++ supporting libraries: Boost v1.83.0, gflags v2.2.2, glog v0.6.0,
      googletest v1.14.0, Matio v1.5.27, Protocol Buffers v3.23.5, Pugixml
      v1.13, OpenSSL v3.1.5.
    - Graphical representation: Gnuplot v5.4.3, Matplotlib v3.5.3.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  - Software drivers and tools for RF front-ends: UHD 4.6 (+&nbsp;gr-uhd),
    gr-iio, gr-osmosdr v0.2.0 (+&nbsp;rtl-sdr and hackrf), libiio v0.24,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
- It can be built for machines defined by the
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=nanbield),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=nanbield),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/nanbield/meta/conf/machine)
  layers.

- Changes with respect to the former release (Geniux Nanbield 24.02):

  - Updated `meta-gnss-sdr` layer. See the
    [`meta-gnss-sdr` layer changelog](https://github.com/carlesfernandez/meta-gnss-sdr/compare/5a10cdf6753d4712f9ce4bce9f233c2b955e6040..f0c8cc26678b7d0bab6f58f160fdb762e85f2836).
  - Updated `openembedded-core` layer. See the
    [`openembedded-core` layer changelog](https://github.com/openembedded/openembedded-core/compare/0584d01f623e1f9b0fef4dfa95dd66de6cbfb7b3..d0e68072d138ccc1fb5957fdc46a91871eb6a3e1).
  - Updated `meta-qt5` layer. See the
    [`meta-qt5` layer changelog](https://git.yoctoproject.org/meta-raspberrypi/diff/?id=28016af353053537b846121dd14c6609abab935f&id2=25d86278e4e8b277e9d3c88061c1a2268a20082a).
  - Updated `meta-sdr` layer. See the
    [`meta-sdr` layer changelog](https://github.com/balister/meta-sdr/compare/2c41e0eac99d826d92d2ebe43ca5d2c4499d76ef..329d5ba03820b724fb8d6434bac715a95231afbb).
  - Updated `meta-raspberrypi` layer. See the
    [`meta-raspberrypi` layer changelog](https://git.yoctoproject.org/meta-raspberrypi/diff/?id=fd79e74cbc112aca09c449b80aaa076a21f99ef5&id2=fde68b24f08b0eac4ad4bfd3c461dc17fe3a263c).
  - Updated `meta-intel` layer. See the
    [`meta-intel` layer changelog](https://git.yoctoproject.org/meta-intel/diff/?id=e0c541c10f561b9c0087fd07ad5b79b0a534dab1&id2=8d633bd01e20e31c0dae58cf3cd41eddb2f712c7).
  - Updated developer scripts and CI jobs.
  - Updated GNSS-SDR to v0.0.20.
  - Manifest
    [full changelog](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/compare/nanbield-24.02..nanbield-25.04).

- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/nanbield-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15260134.svg)](https://doi.org/10.5281/zenodo.15260134)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh nanbield 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh nanbield 25.04 raspberrypi4-64
```

You can replace `25.04` by `latest` in order to get the latest developments.

### Geniux Mickledore 25.04.0

- Operating System based on the Yocto Project version 4.2.4.
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.16.5, CMake v3.25.2, GCC v12.3.0
    (+&nbsp;libgfortran), make v4.4.1, ninja v1.11.1, Python v3.11.5.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.10.12.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.10, Lapack
      v3.10.1, VOLK v3.1.1.
    - C++ supporting libraries: Boost v1.81.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.14.0, Matio v1.5.27, Protocol Buffers v3.21.5, Pugixml
      v1.13, OpenSSL v3.1.4.
    - Graphical representation: Gnuplot v5.4.3, Matplotlib v3.5.3.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  - Software drivers and tools for RF front-ends: UHD 4.3 (+&nbsp;gr-uhd),
    gr-iio, gr-osmosdr v0.2.0 (+&nbsp;rtl-sdr and hackrf), libiio v0.23,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
- It can be built for machines defined by the
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=mickledore),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=mickledore),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/mickledore/meta/conf/machine)
  layers.

- Changes with respect to the former release (Geniux Mickledore 24.02):

  - Updated `meta-gnss-sdr` layer. See the
    [`meta-gnss-sdr` layer changelog](https://github.com/carlesfernandez/meta-gnss-sdr/compare/a8bafe4bb0b1e0daf22cd0b3083a1545be127f6d..a24740b2a507fb027f5e161f8f352c121a008844).
  - Updated `meta-sdr` layer. See the
    [`meta-sdr` layer changelog](https://github.com/balister/meta-sdr/compare/2c41e0eac99d826d92d2ebe43ca5d2c4499d76ef..329d5ba03820b724fb8d6434bac715a95231afbb).
  - Updated `meta-raspberrypi` layer. See the
    [`meta-raspberrypi` layer changelog](https://git.yoctoproject.org/meta-raspberrypi/diff/?id=7a21646e7d547eb3f1d9bf8f045f2be3627b36bc&id2=9c81413d0b6f41f14f0f9c504d19e312c5b9958f).
  - Updated developer scripts and CI jobs.
  - Updated GNSS-SDR to v0.0.20.
  - Manifest
    [full changelog](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/compare/mickledore-24.02..mickledore-25.04).

- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/mickledore-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15259778.svg)](https://doi.org/10.5281/zenodo.15259778)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh mickledore 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh mickledore 25.04 raspberrypi4-64
```

You can replace `25.04` by `latest` in order to get the latest developments.

### Geniux Langdale 25.04.0

- Operating System based on the Yocto Project version 4.1.4.
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.16.5, CMake v3.24.0, GCC v12.2.0
    (+&nbsp;libgfortran), make v4.3, ninja v1.11.1, Python v3.10.6.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.10.12.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.10, Lapack
      v3.10.1, VOLK v3.1.1.
    - C++ supporting libraries: Boost v1.80.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.14.0, Matio v1.5.27, Protocol Buffers v3.21.5, Pugixml
      v1.13, OpenSSL v3.0.8.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.4.3,
      Matplotlib v3.5.3.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  - Software drivers and tools for RF front-ends: UHD 4.3 (+&nbsp;gr-uhd),
    gr-iio, gr-osmosdr v0.2.0 (+&nbsp;rtl-sdr and hackrf), libiio v0.23,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
- It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/langdale/meta-xilinx-bsp/conf/machine/),
  [`meta-xilinx-vendor`](https://github.com/Xilinx/meta-xilinx/tree/langdale/meta-xilinx-vendor/conf/machine),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=langdale),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=langdale),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/langdale/meta/conf/machine)
  layers.

  - The `meta-xilinx` layer points to the `rel-v2023.2` branch.
  - The `meta-adi` layer points to the `2023_R2` branch.
  - The `hdl` repo points to the `hdl_2023_r2` branch.
  - Experimentally, the `meta-gnss-sdr` layer is compatible with AMD/Xilinx
    PetaLinux Tools v2023.2.

- Changes with respect to the former release (Geniux Langdale 24.02):

  - Updated `meta-gnss-sdr` layer. See the
    [`meta-gnss-sdr` layer changelog](https://github.com/carlesfernandez/meta-gnss-sdr/compare/831b3e8375333b2d8d9def3fe347a8c06d718f73..5642a6e05321838ce3cbb5fc240101dcbff8af79).
  - Updated `meta-sdr` layer. See the
    [`meta-sdr` layer changelog](https://github.com/balister/meta-sdr/compare/2c41e0eac99d826d92d2ebe43ca5d2c4499d76ef..329d5ba03820b724fb8d6434bac715a95231afbb).
  - Updated `meta-xilinx` layer. See the
    [`meta-xilinx` layer changelog](https://github.com/Xilinx/meta-xilinx/compare/0879fa02f63a815a38ee404f285e5da3d48fedf2..d0672f5ee00c551d897b9c1f88be9d8093043269).
  - Updated `meta-xilinx-tools` layer. See the
    [`meta-xilinx-tools` layer changelog](https://github.com/Xilinx/meta-xilinx-tools/compare/351d5790c96b0da5ebc42a672d1debdcea6d0b0e..67a09a08886a7c2e23bc1f78ba327a400c55ef20).
  - Added `meta-adi` layer and set to the
    [`2023_R2` branch](https://github.com/analogdevicesinc/meta-adi/tree/2023_R2).
  - Added `hdl` repo and set to the
    [`hdl_2023_r2` branch](https://github.com/analogdevicesinc/hdl/tree/hdl_2023_r2).
  - Updated developer scripts and CI jobs.
  - Updated GNSS-SDR to v0.0.20.
  - Manifest
    [full changelog](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/compare/langdale-24.02..langdale-25.04).

- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/langdale-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15277423.svg)](https://doi.org/10.5281/zenodo.15277423)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh langdale 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh langdale 25.04 raspberrypi4-64
```

```console
$ ./geniux-builder.sh langdale 25.04 zedboard-zynq7
```

```console
$ ./geniux-builder.sh langdale 25.04 zcu208-zynqmp
```

You can replace `25.04` by `latest` in order to get the latest developments.

### Geniux Kirkstone 25.04.0

- Operating System based on the Yocto Project version 4.0.16 LTS (until April 2026).
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.16.5, CMake v3.22.3, GCC v11.2.0
    (+&nbsp;libgfortran), make v4.3, ninja v1.10.2, Python v3.10.4.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.10.12.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.9, Lapack v3.9.0,
      VOLK v3.1.1.
    - C++ supporting libraries: Boost v1.77.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.12.1, Matio v1.5.23, Protocol Buffers v3.19.4, Pugixml
      v1.13, OpenSSL v3.0.16.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.4.3,
      Matplotlib v3.5.1.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  - Software drivers and tools for RF front-ends: UHD 4.3 (+&nbsp;gr-uhd),
    gr-iio, gr-osmosdr v0.2.0 (+&nbsp;rtl-sdr and hackrf), libiio v0.24,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
- It can be built for machines defined by the
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=kirkstone),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=kirkstone),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/kirkstone/meta/conf/machine)
  layers.

- Changes with respect to the former release (Geniux Kirkstone 24.02):
  - Updated `meta-gnss-sdr` layer. See the
    [`meta-gnss-sdr` layer changelog](https://github.com/carlesfernandez/meta-gnss-sdr/compare/ddd14fb49aee7ca584a51d21732d414c6e754ad4..e591ee3c54179caebebf0a326ecea568d9dda032).
  - Updated `openembedded-core` layer. See the
    [`openembedded-core` layer changelog](https://github.com/openembedded/openembedded-core/compare/60d88989698968c13f8e641f0ba1a82fcf700fb7..f23d1bfca0ea57150c397bc2e495191fb61423d0).
  - Updated `meta-openembedded` layer. See the
    [`meta-openembedded` layer changelog](https://github.com/openembedded/meta-openembedded/compare/ce9c0d76171ce9d07e4bcb702b750416b265562a..f8dddbfcbfe502cb71375a7a907e61a92e8d4474).
  - Updated `meta-qt5` layer. See the
    [`meta-qt5` layer changelog](https://github.com/meta-qt5/meta-qt5/compare/fe0bf7f0e5408aac6cc89ff3b19b1b1941df4f64..644ebf220245bdc06e7696ccc90acc97a0dd2566).
  - Updated `meta-sdr` layer. See the
    [`meta-sdr` layer changelog](https://github.com/balister/meta-sdr/compare/382a4c6534832ad47fab417305ffb0f38bf88a7d..b032daf0b9cdaecf85857ded05a88d80fd55b396).
  - Updated `meta-raspberrypi` layer. See the
    [`meta-raspberrypi` layer changelog](https://git.yoctoproject.org/meta-raspberrypi/diff/?id=9e12ad97b4c95772c6f403b9318f2bec2ab09e53&id2=e6d2ff0b0cbb925157c95b07327c2a7dc145fabe).
  - Updated `meta-intel` layer. See the
    [`meta-intel` layer changelog](https://git.yoctoproject.org/meta-intel/diff/?id=dc0948200594dacece4da91f4c501e9a9fb0394f&id2=f932ebb2544170f43edd22739f44307809bf8cfb).
  - Updated developer scripts and CI jobs.
  - Updated GNSS-SDR to v0.0.20.
  - Manifest
    [full changelog](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/compare/kirkstone-24.02..kirkstone-25.04).
- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/kirkstone-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15259634.svg)](https://doi.org/10.5281/zenodo.15259634)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh kirkstone 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh kirkstone 25.04 raspberrypi4-64
```

You can replace `25.04` by `latest` in order to get the latest developments.

### Geniux Honister 25.04.0

- Operating System based on the Yocto Project version 3.4.4.
- It brings, among many others, the following software packages:

  - Development tools: Automake v1.16.3, CMake v3.21.1, GCC v11.2.0
    (+&nbsp;libgfortran), make v4.3, ninja v1.10.2, Python v3.9.9.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.10.2.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.9, Lapack v3.9.0,
      VOLK v2.5.1.
    - C++ supporting libraries: Boost v1.77.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.12.1, Matio v1.5.23, Protocol Buffers v3.18.0, Pugixml
      v1.13, OpenSSL v1.1.1o.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.4.1,
      Matplotlib v3.4.1.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  - Software drivers and tools for RF front-ends: UHD 4.3 (+&nbsp;gr-uhd),
    gr-iio, gr-osmosdr v0.2.0 (+&nbsp;rtl-sdr and hackrf), libiio v0.24,
    libad9361-iio v0.2, iio-oscilloscope v0.14.

- It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/rel-v2022.2/meta-xilinx-bsp/conf/machine/),
  [`meta-xilinx-vendor`](https://github.com/Xilinx/meta-xilinx/tree/rel-v2022.2/meta-xilinx-vendor/conf/machine),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=honister),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=honister),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/honister/meta/conf/machine)
  layers.

  - The `meta-xilinx` layer points to the `rel-v2022.2` branch.
  - The `meta-adi` layer points to the `2022_R2` branch.
  - The `hdl` repo points to the `hdl_2022_r2` branch.
  - The
    [`meta-gnss-sdr`](https://github.com/carlesfernandez/meta-gnss-sdr/tree/honister)
    layer is compatible with Xilinx PetaLinux Tools v2022.2.

- Changes with respect to the former release (Geniux Honister 24.02):

  - Updated `meta-gnss-sdr` layer. See the
    [`meta-gnss-sdr` layer changelog](https://github.com/carlesfernandez/meta-gnss-sdr/compare/d9e9c4397f60f6c84dd9f9b998bc6fc66b0612c7..90309dea3c9a0fb48c2654476824ff3021be811e).
  - Added `meta-adi` layer and set to the
    [`2022_R2` branch](https://github.com/analogdevicesinc/meta-adi/tree/2022_R2).
  - Added `hdl` repo and set to the
    [`hdl_2022_r2` branch](https://github.com/analogdevicesinc/hdl/tree/hdl_2022_r2).
  - Updated developer scripts and CI jobs.
  - Updated GNSS-SDR to v0.0.20.
  - Manifest
    [full changelog](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/compare/honister-24.02..honister-25.04).

- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/honister-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15277264.svg)](https://doi.org/10.5281/zenodo.15277264)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh honister 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh honister 25.04 raspberrypi4-64
```

```console
$ ./geniux-builder.sh honister 25.04 zedboard-zynq7
```

```console
$ ./geniux-builder.sh honister 25.04 zc706-zynq7
```

```console
$ ./geniux-builder.sh honister 25.04 zcu102-zynqmp
```

```console
$ ./geniux-builder.sh honister 25.04 zcu208-zynqmp
```

You can replace `25.04` by `latest` in order to get the latest developments.

### Geniux Hardknott 25.04.0

- Operating System based on the Yocto Project version 3.3.6.
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.16.3, CMake v3.19.5, GCC v10.3.0
    (+&nbsp;libgfortran), make v4.3, ninja v1.10.2, Python v3.9.9.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.8.0.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.9, Lapack v3.9.0,
      VOLK v2.5.0.
    - C++ supporting libraries: Boost v1.75.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.12.1, Matio v1.5.23, Protocol Buffers v3.15.2, Pugixml
      v1.13, OpenSSL v1.1.1n.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.2.8,
      Matplotlib v3.4.1.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  - Software drivers and tools for RF front-ends: UHD v3.15.LTS (+&nbsp;gr-uhd),
    gr-osmosdr v0.2.3 (+&nbsp;rtl-sdr and hackrf), gr-iio v0.3, libiio v0.23,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
- It can be built for machines defined by the
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=hardknott),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=hardknott),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/hardknott/meta/conf/machine)
  layers.

- Changes with respect to the former release (Geniux Hardknott 24.02):

  - Updated `meta-gnss-sdr` layer. See the
    [`meta-gnss-sdr` layer changelog](https://github.com/carlesfernandez/meta-gnss-sdr/compare/1774549861b46eaea473fca93e4d9428a6a92ad9..1cc5388b3df78c3fdcffd14fe64945ebaeaaca29).
  - Updated developer scripts and CI jobs.
  - Updated GNSS-SDR to v0.0.20.
  - Manifest
    [full changelog](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/compare/hardknott-24.02..hardknott-25.04).

- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/hardknott-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15277261.svg)](https://doi.org/10.5281/zenodo.15277261)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh hardknott 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh hardknott 25.04 raspberrypi4-64
```

```console
$ ./geniux-builder.sh hardknott 25.04 qemuarm64
```

You can replace `25.04` by `latest` in order to get the latest developments.

### Geniux Gatesgarth 25.04.0

- Operating System based on the Yocto Project version 3.2.4.
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.16.2, CMake v3.18.2, GCC v10.2.0
    (+&nbsp;libgfortran), make v4.3, ninja v1.10.1, Python v3.8.5.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.8.5.0.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.9, Lapack v3.9.0,
      VOLK v2.4.1.
    - C++ supporting libraries: Boost v1.74.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.12.1, Matio v1.5.23, Protocol Buffers v3.13.0, Pugixml
      v1.13, OpenSSL v1.1.1k.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.2.8,
      Matplotlib v3.3.2.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  - Software drivers and tools for RF front-ends: UHD v3.15.LTS (+&nbsp;gr-uhd),
    gr-osmosdr v0.2.3 (+&nbsp;rtl-sdr and hackrf), gr-iio v0.3, libiio v0.23,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
- It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/rel-v2021.2/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=gatesgarth),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=gatesgarth),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/gatesgarth/meta/conf/machine)
  layers.

  - The `meta-xilinx` layer points to the `rel-v2021.2` branch.
  - Use `linux-xlnx` kernel for `zedboard-zynq7` machine, based on Linux kernel
    5.10.
  - The
    [`meta-gnss-sdr`](https://github.com/carlesfernandez/meta-gnss-sdr/tree/gatesgarth)
    layer is compatible with Xilinx PetaLinux Tools v2021.2.

- Changes with respect to the former release (Geniux Gatesgarth 24.02):

  - Updated `meta-gnss-sdr` layer. See the
    [`meta-gnss-sdr` layer changelog](https://github.com/carlesfernandez/meta-gnss-sdr/compare/71f89516fd90fbcb907a6f47977c963472daa883..622d72d8c2cb9ee75457912bbc4848c9362a8c87).
  - Updated developer scripts and CI jobs.
  - Updated GNSS-SDR to v0.0.20.
  - Manifest
    [full changelog](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/compare/gatesgarth-24.02..gatesgarth-25.04).

- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/gatesgarth-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15277142.svg)](https://doi.org/10.5281/zenodo.15277142)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh gatesgarth 25.04 zedboard-zynq7
```

```console
$ ./geniux-builder.sh gatesgarth 25.04 zc706-zynq7
```

```console
$ ./geniux-builder.sh gatesgarth 25.04 raspberrypi4-64
```

```console
$ ./geniux-builder.sh gatesgarth 25.04 intel-skylake-64
```

```console
$ ./geniux-builder.sh gatesgarth 25.04 qemuarm64
```

You can replace `25.04` by `latest` in order to get the latest developments.

### Geniux Dunfell 25.04.0 (End-of-Life)

**IMPORTANT NOTE: End-of-Life (EOL)** This is the last release of the Geniux
Dunfell manifest. From now on, only the `latest` Dunfell manifest could be
occasionally updated, but no more tagged versions for Geniux Dunfell will be
published.
{: .notice--warning}

- Operating System based on the Yocto Project version 3.1.33 LTS.
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.16.1, CMake v3.16.5, GCC v9.5.0
    (+&nbsp;libgfortran), make v4.3, ninja v1.10.0, Python v3.8.12.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.8.5.0.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.9, Lapack v3.7.0,
      VOLK v2.4.1.
    - C++ supporting libraries: Boost v1.72.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.12.1, Matio v1.5.23, Protocol Buffers v3.11.4, Pugixml
      v1.11.4.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.2.8,
      Matplotlib v3.2.1.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  - Software drivers and tools for RF front-ends: UHD v3.15.LTS (+&nbsp;gr-uhd),
    gr-osmosdr v0.2.3 (+&nbsp;rtl-sdr and hackrf), gr-iio v0.3, libiio v0.23,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
- It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/gatesgarth/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=dunfell),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=dunfell),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/dunfell/meta/conf/machine)
  layers.

- Changes with respect to the former release (Geniux Dunfell 24.02):

  - Updated `meta-gnss-sdr` layer. See the
    [`meta-gnss-sdr` layer changelog](https://github.com/carlesfernandez/meta-gnss-sdr/compare/9e88e99ef90b09c39df765766c2f369b2b3a9fc8..6a6d6bec3df32bad5301764c9d77e68754d93de2).
  - Updated `openembedded-core` layer. See the
    [`openembedded-core` layer changelog](https://github.com/openembedded/openembedded-core/compare/18ae4fea4bf8681f9138d21124589918e336ff6b..c4fb7d1f0f157ffafd9f907f49ea74b93b2c1d40).
  - Updated `meta-openembedded` layer. See the
    [`meta-openembedded` layer changelog](https://github.com/openembedded/meta-openembedded/compare/daa4619fe3fbf8c28f342c4a7163a84a330f7653..01358b6d705071cc0ac5aefa7670ab235709729a).
  - Updated `meta-intel` layer. See the
    [`meta-intel` layer changelog](https://git.yoctoproject.org/meta-intel/diff/?id=bab936cb4ae5671ceaccf50305a6c0515e6f0222&id2=e482213f37828216c7a7df68ff353652cc865ec1).
  - Updated developer scripts and CI jobs.
  - Updated GNSS-SDR to v0.0.20.
  - Manifest
    [full changelog](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/compare/dunfell-24.02..dunfell-25.04).

- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/dunfell-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15255855.svg)](https://doi.org/10.5281/zenodo.15255855)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh dunfell 25.04 zedboard-zynq7
```

```console
$ ./geniux-builder.sh dunfell 25.04 raspberrypi4-64
```

```console
$ ./geniux-builder.sh dunfell 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh dunfell 25.04 qemuarm64
```

You can replace `25.04` by `latest` in order to get the latest developments, but
please consider that this Geniux version has reached its End-of-Life and it will
not be actively maintained anymore.

### Geniux Zeus 25.04.0 (End-of-Life)

**IMPORTANT NOTE: End-of-Life (EOL)** This is the last release of the Geniux
Zeus manifest. From now on, only the `latest` Zeus manifest could be
occasionally updated, but no more tagged versions for Geniux Zeus will be
published.
{: .notice--warning}

- Operating System based on the Yocto Project version 3.0.4.
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.16.1, CMake v3.15.3, GCC v9.2.0
    (+&nbsp;libgfortran), make v4.2.1, ninja v1.9.0, Python v2.7.18 and v3.7.8.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.8.2.0.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.9, Lapack v3.7.0,
      VOLK v2.3.0.
    - C++ supporting libraries: Boost v1.71.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.12.0, Matio v1.5.23, Protocol Buffers v3.9.2, Pugixml
      v1.11.4.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.2.2,
      Matplotlib v3.1.1.
    - Additional Python modules (_e.g._, Scipy) can be installed with `pip3`.
  - Software drivers and tools for RF front-ends: UHD v3.15.LTS (+&nbsp;gr-uhd),
    gr-osmosdr v0.2.3 (+&nbsp;rtl-sdr and hackrf), gr-iio v0.3, libiio v0.23,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
- It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/rel-v2020.3/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=zeus),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=zeus),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/zeus/meta/conf/machine)
  layers.

  - The `meta-xilinx` layer points to `rel-v2020.3` branch.

- Changes with respect to the former release (Geniux Zeus 24.02):
  - Updated `meta-gnss-sdr` layer. See the
    [`meta-gnss-sdr` layer changelog](https://github.com/carlesfernandez/meta-gnss-sdr/compare/135ced26d1c0faa1a5e640357d16f81c250b8202..c8eebaac68032b93d455dda4e5df6e96872f82aa).
  - Updated developer scripts and CI jobs.
  - Updated GNSS-SDR to v0.0.20.
  - Manifest
    [full changelog](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/compare/zeus-24.02..zeus-25.04).
- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/zeus-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15255794.svg)](https://doi.org/10.5281/zenodo.15255794)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh zeus 25.04 zedboard-zynq7
```

```console
$ ./geniux-builder.sh zeus 25.04 raspberrypi4-64
```

```console
$ ./geniux-builder.sh zeus 25.04 intel-skylake-64
```

```console
$ ./geniux-builder.sh zeus 25.04 qemuarm64
```

You can replace `25.04` by `latest` in order to get the latest developments, but
please consider that this Geniux version has reached its End-of-Life and it will
not be actively maintained anymore.

### Geniux Warrior 25.04.0 (End-of-Life)

**IMPORTANT NOTE: End-of-Life (EOL)** This is the last release of the Geniux
Warrior manifest. From now on, only the `latest` Warrior manifest could be
occasionally updated, but no more tagged versions for Geniux Warrior will be
published.
{: .notice--warning}

- Operating System based on the Yocto Project version 2.7.4.
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.16.1, CMake v3.14.1, GCC v8.3.0
    (+&nbsp;libgfortran), make v4.2.1, ninja v1.9.0, Python v2.7.18 and v3.7.7.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.8.2.0.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.9, Lapack v3.7.0,
      VOLK v2.3.0.
    - C++ supporting libraries: Boost v1.69.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.12.0, Matio v1.5.23, Protocol Buffers v3.6.1, Pugixml
      v1.11.4.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.2.2.
    - Additional Python modules (_e.g._, Scipy, Matplotlib) can be installed
      with `pip3`.
  - Software drivers and tools for RF front-ends: UHD v3.15.LTS (+&nbsp;gr-uhd),
    gr-osmosdr v0.2.3 (+&nbsp;rtl-sdr and hackrf), gr-iio v0.3, libiio v0.23,
    libad9361-iio v0.2, iio-oscilloscope v0.14.
- It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/warrior/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=warrior),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=warrior),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/warrior/meta/conf/machine)
  layers.

- Changes with respect to the former release (Geniux Warrior 24.02):
  - Updated `meta-gnss-sdr` layer. See the
    [`meta-gnss-sdr` layer changelog](https://github.com/carlesfernandez/meta-gnss-sdr/compare/836312c4ef5cc5f1552b341ee61d3c43360b101e..e18c5ab2401790626b2be0cbee53dde2a7740a8).
  - Updated developer scripts and CI jobs.
  - Updated GNSS-SDR to v0.0.20.
  - Manifest
    [full changelog](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/compare/warrior-24.02..warrior-25.04).
- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/warrior-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15255750.svg)](https://doi.org/10.5281/zenodo.15255750)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh warrior 25.04 zedboard-zynq7
```

```console
$ ./geniux-builder.sh warrior 25.04 raspberrypi4-64
```

```console
$ ./geniux-builder.sh warrior 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh warrior 25.04 qemuarm64
```

You can replace `25.04` by `latest` in order to get the latest developments, but
please consider that this Geniux version has reached its End-of-Life and it will
not be actively maintained anymore.

### Geniux Thud 25.04.0 (End-of-Life)

**IMPORTANT NOTE: End-of-Life (EOL)** This is the last release of the Geniux
Thud manifest. From now on, only the `latest` Thud manifest could be
occasionally updated, but no more tagged versions for Geniux Thud will be
published.
{: .notice--warning}

- Operating System based on the Yocto Project version 2.6.4.
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.16.1, CMake v3.12.2, GCC v8.2.0
    (+&nbsp;libgfortran), make v4.2.1, ninja v1.8.2, Python v2.7.16 and v3.5.6.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.7.14.0.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.8, Lapack v3.7.0,
      VOLK v2.2.1.
    - C++ supporting libraries: Boost v1.64.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.12.0, Matio v1.5.23, Protocol Buffers v3.6.1, Pugixml
      v1.11.4.
    - Graphical representation: gnss-sdr-monitor v1.0, Gnuplot v5.2.2.
    - Additional Python modules (_e.g._, Scipy, Matplotlib) can be installed
      with `pip3`.
  - Software drivers and tools for RF front-ends: UHD v3.13.0.1 (+&nbsp;gr-uhd),
    libiio v2019_R2, libad9361-iio v2019_R2, iio-oscilloscope v2019_R2.
- It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/rel-v2019.2/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=thud),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=thud),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/thud/meta/conf/machine)
  layers.
  - The `meta-xilinx` layer points to the `rel-v2019.2` branch.
- The
  [`meta-gnss-sdr`](https://github.com/carlesfernandez/meta-gnss-sdr/tree/thud)
  layer is compatible with Xilinx PetaLinux Tools v2019.2.

- Changes with respect to the former release (Geniux Thud 24.02):
  - Updated `meta-gnss-sdr` layer. See the
    [`meta-gnss-sdr` layer changelog](https://github.com/carlesfernandez/meta-gnss-sdr/compare/c113ecdcc5fd3c766d5abee43d104893a3dd9655..02c1ca5ac385d8ddb9b681735c114fbee3465ea8).
  - Updated developer scripts and CI jobs.
  - Updated GNSS-SDR to v0.0.20.
  - Manifest
    [full changelog](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/compare/thud-24.02..thud-25.04).
- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/thud-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15255735.svg)](https://doi.org/10.5281/zenodo.15255735)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh thud 25.04 zedboard-zynq7
```

```console
$ ./geniux-builder.sh thud 25.04 zcu102-zynqmp
```

```console
$ ./geniux-builder.sh thud 25.04 raspberrypi3
```

```console
$ ./geniux-builder.sh thud 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh thud 25.04 qemuarm64
```

You can replace `25.04` by `latest` in order to get the latest developments, but
please consider that this Geniux version has reached its End-of-Life and it will
not be actively maintained anymore.

### Geniux Sumo 25.04.0 (End-of-Life)

**IMPORTANT NOTE: End-of-Life (EOL)** This is the last release of the Geniux
Sumo manifest. From now on, only the `latest` Sumo manifest could be
occasionally updated, but no more tagged versions for Geniux Sumo will be
published.
{: .notice--warning}

- Operating System based on the Yocto Project version 2.5.3.
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.15.1, CMake v3.10.3, GCC v7.3.0
    (+&nbsp;libgfortran), make v4.2.1, ninja v1.8.2, Python v2.7.15 and v3.5.5.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.7.13.5.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.7, Lapack v3.7.0,
      VOLK v1.5.0.
    - C++ supporting libraries: Boost v1.66.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.12.0, Matio v1.5.23, Protocol Buffers v3.5.1, Pugixml
      v1.11.4.
    - Graphical representation: Gnuplot v5.2.2.
    - Additional Python modules (_e.g._, Scipy, Matplotlib) can be installed
      with `pip3`.
  - Software drivers and tools for RF front-ends: gr-osmosdr v0.1.4.1
    (+&nbsp;rtl-sdr and hackrf), gr-iio v0.3, libiio v2019_R1, libad9361-iio
    v2019_R1, iio-oscilloscope v2019_R1.
- It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/sumo/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=sumo),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=sumo),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/sumo/meta/conf/machine)
  layers.

- Changes with respect to the former release (Geniux Sumo 24.02):
  - Updated `meta-gnss-sdr` layer. See the
    [`meta-gnss-sdr` layer changelog](https://github.com/carlesfernandez/meta-gnss-sdr/compare/ead6e32b99a0f70cf3521b44092e1e1d9cc27bf7..68e8e3661a05af6051783a2844142acbee73497e).
  - Updated developer scripts and CI jobs.
  - Updated GNSS-SDR to v0.0.20.
  - Manifest
    [full changelog](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/compare/sumo-24.02..sumo-25.04).
- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/sumo-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15255727.svg)](https://doi.org/10.5281/zenodo.15255727)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh sumo 25.04 zedboard-zynq7
```

```console
$ ./geniux-builder.sh sumo 25.04 raspberrypi3
```

```console
$ ./geniux-builder.sh sumo 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh sumo 25.04 qemuarm64
```

You can replace `25.04` by `latest` in order to get the latest developments, but
please consider that this Geniux version has reached its End-of-Life and it will
not be actively maintained anymore.

### Geniux Rocko 25.04.0 (End-of-Life)

**IMPORTANT NOTE: End-of-Life (EOL)** This is the last release of the Geniux
Rocko manifest. From now on, only the `latest` Rocko manifest could be
occasionally updated, but no more tagged versions for Geniux Rocko will be
published.
{: .notice--warning}

- Operating System based on the Yocto Project version 2.4.4.
- It brings, among many others, the following software packages:
  - Development tools: Automake v1.15.1, CMake v3.8.2, GCC v7.3.0
    (+&nbsp;libgfortran), make v4.2.1, ninja v1.7.2, Python v2.7.14 and v3.5.3.
  - Goodies for signal processing:
    - GNSS-SDR v0.0.20.
    - SDR framework: GNU Radio v3.7.13.
    - Number crunching libraries: Armadillo v10.8.0, FFTW v3.3.6, Lapack v3.7.0,
      VOLK v1.4.0.
    - C++ supporting libraries: Boost v1.64.0, gflags v2.2.2, glog v0.5.0,
      googletest v1.12.1, Matio v1.5.23, Protocol Buffers v3.4.1, Pugixml
      v1.11.4.
    - Graphical representation: Gnuplot v5.0.5.
    - Additional Python modules (_e.g._, Scipy, Matplotlib) can be installed
      with `pip3`.
  - Software drivers and tools for RF front-ends: UHD v3.10.2.0 (+&nbsp;gr-uhd),
    gr-osmosdr v0.1.4.1 (+&nbsp;rtl-sdr, airspy, hackrf, and rfspace), gr-iio
    v0.3, libiio v2019_R1, libad9361-iio v2019_R1, iio-oscilloscope v2019_R1.
- It can be built for machines defined by the
  [`meta-xilinx-bsp`](https://github.com/Xilinx/meta-xilinx/tree/rocko/meta-xilinx-bsp/conf/machine/),
  [`meta-raspberrypi`](https://git.yoctoproject.org/meta-raspberrypi/tree/conf/machine?h=rocko),
  [`meta-intel`](https://git.yoctoproject.org/meta-intel/tree/conf/machine?h=rocko),
  and
  [`openembedded-core/meta`](https://github.com/openembedded/openembedded-core/tree/rocko/meta/conf/machine)
  layers.
- The
  [`meta-gnss-sdr`](https://github.com/carlesfernandez/meta-gnss-sdr/tree/rocko)
  layer is compatible with Xilinx PetaLinux Tools v2018.3.

- Changes with respect to the former release (Geniux Rocko 24.02):

  - Updated `meta-gnss-sdr` layer. See the
    [`meta-gnss-sdr` layer changelog](https://github.com/carlesfernandez/meta-gnss-sdr/compare/9219c7553347dfd19db17d0bc0fab1ba351bb7ec..b5c1a74fc3a79248fb107b4d98ae1b82677a706d).
  - Updated developer scripts and CI jobs.
  - Updated GNSS-SDR to v0.0.20.
  - Manifest
    [full changelog](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/compare/rocko-24.02..rocko-25.04).

- If you find this release useful for your research, please cite this work using
  the corresponding
  [oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/tree/rocko-25.04)
  Digital Object Identifier
  [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15271315.svg)](https://doi.org/10.5281/zenodo.15271315)

Examples on how to generate images and the SDK using the
[yocto-geniux](https://github.com/carlesfernandez/yocto-geniux) tool:

```console
$ ./geniux-builder.sh rocko 25.04 zedboard-zynq7
```

```console
$ ./geniux-builder.sh rocko 25.04 zcu102-zynqmp
```

```console
$ ./geniux-builder.sh rocko 25.04 raspberrypi3
```

```console
$ ./geniux-builder.sh rocko 25.04 intel-corei7-64
```

```console
$ ./geniux-builder.sh rocko 25.04 qemuarm
```

You can replace `25.04` by `latest` in order to get the latest developments, but
please consider that this Geniux version has reached its End-of-Life and it will
not be actively maintained anymore.

## Flashing images on an SD card

Starting from Geniux Zeus 21.08, the `geniux-builder.sh` script produces `.wic`
images that can be flashed on an SD card and your device will be ready to go.
For image flashing, we recommend using a software tool such as
[Balena Etcher](https://etcher.balena.io/). Just pick up the
`gnss-sdr-demo-image-$MACHINE-yyyymmddHHMMSS.rootfs.wic.xz` file, flash your SD
card, insert it in your device, and it will be ready to boot and run `gnss-sdr`.
Other flashing options [here]({{
"/docs/tutorials/cross-compiling/#copying-an-image-file-to-your-sd-card" |
relative_url }}).

## Key repositories

All the required information for building a Geniux release is contained in three
public repositories:

- **meta-gnss-sdr layer**: Yocto layer defining all the packages in the Geniux
  distribution, including the recipes for downloading and building them, their
  cryptographic hash, the way to create customized full-system images.
  - URL:
    [https://github.com/carlesfernandez/meta-gnss-sdr](https://github.com/carlesfernandez/meta-gnss-sdr)
  - Each Geniux version is defined in a different branch: `rocko`, `sumo`,
    `thud`, `warrior`, `zeus`, `dunfell`, `gatesgarth`, `hardknott`, `honister`,
    `kirkstone`, `langdale`, `mickledore`, `nanbield`, `scarthgap`, `styhead`,
    `walnascar`. Those branches are updated as we learn more about the Yocto Project usage,
    so they evolve in time.
- **oe-gnss-sdr-manifest**: Manifest containing the specific commits of all the
  other Yocto layers required to build Geniux (notably,
  [openembedded-core](https://github.com/openembedded/openembedded-core),
  [meta-openembedded](https://github.com/openembedded/meta-openembedded),
  [meta-qt5](https://github.com/meta-qt5/meta-qt5),
  [meta-sdr](https://github.com/balister/meta-sdr),
  [meta-xilinx](https://github.com/Xilinx/meta-xilinx),
  [meta-raspberrypi](https://git.yoctoproject.org/meta-raspberrypi),
  [meta-intel](https://git.yoctoproject.org/meta-intel), etc.).
  - URL:
    [https://github.com/carlesfernandez/oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest)
  - Each Geniux version is defined in a different branch: `rocko`, `sumo`,
    `thud`, `warrior`, `zeus`, `dunfell`, `gatesgarth`, `hardknott`, `honister`,
    `kirkstone`, `langdale`, `mickledore`, `nanbield`, `scarthgap`, `styhead`,
    `walnascar`.
  - Tags: each tag corresponds to a version of the manifest in which the
    `meta-gnss-sdr` has been pinned to a specific commit. This allows
    fully-reproducible buildings in the future since it defines a
    fully-specified software system set. Examples: `rocko-25.04`, `sumo-25.04`,
    `thud-25.04`, etc.
  - In the above instructions, when `MANIFEST_DATE` is set to `latest`, all the
    layers are pinned to a specific commit but except the `meta-gnss-sdr` layer,
    which points to whatever it is in the corresponding branch of that layer at
    that point of time.
- **yocto-geniux**: Tool for the virtualization and automation of the building
  process.
  - URL:
    [https://github.com/carlesfernandez/yocto-geniux](https://github.com/carlesfernandez/yocto-geniux)
  - Version: v3.5 [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15255140.svg)](https://doi.org/10.5281/zenodo.15255140)


If you miss any feature on Geniux, or have an idea on how to make it better,
pull requests and issues are welcome on those repositories. Their contents are
released under the [MIT License](https://opensource.org/license/MIT).

## Disclaimer

Yocto Project and all related marks and logos are trademarks of The Linux
Foundation. This website is not, in any way, endorsed by the Yocto Project or
[The Linux Foundation](https://www.linuxfoundation.org/).

&nbsp;

&nbsp;

Enjoy Geniux!

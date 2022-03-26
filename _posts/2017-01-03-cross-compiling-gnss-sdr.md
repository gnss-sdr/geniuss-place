---
title: "Cross-compiling GNSS-SDR"
permalink: /docs/tutorials/cross-compiling/
excerpt: "A guide to cross-compile GNSS-SDR for embedded platforms."
author_profile: false
header:
  teaser: /assets/images/oe-logo.png
tags:
  - tutorial
  - embedded
sidebar:
  nav: "docs"
toc: true
toc_sticky: true
show_date: false
last_modified_at: 2022-03-25T02:11:02+02:00
---

An **embedded system** is defined as a computer system with a specific function
within a larger mechanical or electrical system. Examples of properties of
embedded computers, when compared with general-purpose counterparts, are low
power consumption, small size, rugged operating ranges, and low per-unit cost,
at the price of limited processing resources.

This page is devoted to the development cycle for building and executing
GNSS-SDR in an embedded computer. In this example, we are working with a
[Zedboard](https://www.xilinx.com/products/boards-and-kits/1-elhabt.html) (a
development board that ships a [Xilinx
Zynq-7000](https://www.xilinx.com/products/silicon-devices/soc/zynq-7000.html)
all-programmable [SoC](https://en.wikipedia.org/wiki/System_on_a_chip), which
houses two ARM and one FPGA processor in a single chip), but this procedure is
applicable to other embedded platforms without much modification.

Once all the required dependencies are already installed, GNSS-SDR can be built
from source in ARM processors without hassle. However, this building process can
easily take more than 10 hours if it is executed on the Zynq device. Thus, in
order to speed up the development cycle from a change in the source code to the
execution in an embedded platform, we need to resort to cross-compilation.

**Cross-compilation** consists of a building framework capable of creating
executable code for a platform other than the one on which the compiler is
running. In our example, we would like to build GNSS-SDR with the powerful, fast
processor of a general-purpose desktop computer, and to generate binaries that
can be directly executed by the Zynq device.

  By using cross-compilation, we can shorten the building time from more than 10
  hours to less than 10 minutes. This improves [**Testability**]({{
  "/design-forces/testability/" | relative_url }}), as one of its requirements
  is that a testing cycle has to be *fast*.
  {: .notice--success}

The cross-compilation environment proposed here is based on
[OpenEmbedded](http://www.openembedded.org), a building framework for embedded
Linux. OpenEmbedded offers a best-in-class cross-compile environment, allowing
developers to create a complete, custom GNU/Linux distribution for embedded
systems.

Below we provide a software developer kit (SDK) that installs a ready-to-use
cross-compilation environment in your computer.

Getting the SDK
----------------

We offer two options here: you can either download a script that will install
the full SDK on your computer, or you can customize and build your own SDK. Both
options are described below:

### Option 1: Downloading the SDK

You can download a Software Development Kit built for the Zedboard platform from
the links below. Version names (Jethro, Krogoth, Morty, ..., up to Gatesgarth)
follow those of the
[Yocto Project Releases](https://wiki.yoctoproject.org/wiki/Releases).

The following table lists the available SDK versions. To download one of them,
right-click on the SDK link and choose "Save link as ...".

<a name="sdk-table"></a>

| Yocto version | SDK version | Download | Size | MD5 checksum | Manifest |
|:-|:-:|:-:|:-:|:-|:-:|
| Gatesgarth | [v21.08](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/releases/tag/gatesgarth-21.08) | [SDK](https://sites.cttc.es/gnss_files/SDK/Gatesgarth/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-gatesgarth-21.08.0.sh){:download="geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-gatesgarth-21.08.0.sh"} | 2.13 GB | b71e8608d246fc2bf1d8e0535e0b0c1d | [Host](https://sites.cttc.es/gnss_files/SDK/Gatesgarth/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-gatesgarth-21.08.0.host.manifest), [Target](https://sites.cttc.es/gnss_files/SDK/Gatesgarth/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-gatesgarth-21.08.0.target.manifest) |
| Dunfell | [v21.08](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/releases/tag/dunfell-21.08) | [SDK](https://sites.cttc.es/gnss_files/SDK/Dunfell/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-dunfell-21.08.0.sh){:download="geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-dunfell-21.08.0.sh"} | 2.14 GB | 93b54c322c6595c09278216972bfca04 | [Host](https://sites.cttc.es/gnss_files/SDK/Dunfell/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-dunfell-21.08.0.host.manifest), [Target](https://sites.cttc.es/gnss_files/SDK/Dunfell/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-dunfell-21.08.0.target.manifest) |
| Zeus | [v21.08](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/releases/tag/zeus-21.08) | [SDK](https://sites.cttc.es/gnss_files/SDK/Zeus/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-zeus-21.08.0.sh){:download="geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-zeus-21.08.0.sh"} | 2.04 GB | 8c201b971d541596f3f21a52cc0849e3 | [Host](https://sites.cttc.es/gnss_files/SDK/Zeus/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-zeus-21.08.0.host.manifest), [Target](https://sites.cttc.es/gnss_files/SDK/Zeus/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-zeus-21.08.0.target.manifest) |
| Warrior | [v21.08](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/releases/tag/warrior-21.08) | [SDK](https://sites.cttc.es/gnss_files/SDK/Warrior/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-warrior-21.08.0.sh){:download="geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-warrior-21.08.0.sh"} | 2.10 GB | 931fa513cc26c268b25b6bfd4e12de2e | [Host](https://sites.cttc.es/gnss_files/SDK/Warrior/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-warrior-21.08.0.host.manifest), [Target](https://sites.cttc.es/gnss_files/SDK/Warrior/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-warrior-21.08.0.target.manifest) |
| Thud | [v21.08](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/releases/tag/thud-21.08) | [SDK](https://sites.cttc.es/gnss_files/SDK/Thud/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-thud-21.08.0.sh){:download="geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-thud-21.08.0.sh"} | 2.06 GB | 79f00e47ba437fb73afaf4937dbea3d8 | [Host](https://sites.cttc.es/gnss_files/SDK/Thud/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-thud-21.08.0.host.manifest), [Target](https://sites.cttc.es/gnss_files/SDK/Thud/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-thud-21.08.0.target.manifest) |
| Sumo | [v21.08](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/releases/tag/sumo-21.08) | [SDK](https://sites.cttc.es/gnss_files/SDK/Sumo/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-sumo-21.08.0.sh){:download="geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-sumo-21.08.0.sh"} | 1.54 GB | 118968d0194718ccdbdff8122eea210d | [Host](https://sites.cttc.es/gnss_files/SDK/Sumo/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-sumo-21.08.0.host.manifest), [Target](https://sites.cttc.es/gnss_files/SDK/Sumo/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-sumo-21.08.0.target.manifest) |
| Rocko | [v21.08](https://github.com/carlesfernandez/oe-gnss-sdr-manifest/releases/tag/rocko-21.08) | [SDK](https://sites.cttc.es/gnss_files/SDK/Rocko/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-rocko-21.08.0.sh){:download="geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-rocko-21.08.0.sh"} | 1.24 GB | 12d1eb7fb3a2446e03325ddb12adf4c4 | [Host](https://sites.cttc.es/gnss_files/SDK/Rocko/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-rocko-21.08.0.host.manifest), [Target](https://sites.cttc.es/gnss_files/SDK/Rocko/geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-rocko-21.08.0.target.manifest) |
| Pyro | Abandoned | [SDK](https://sites.cttc.es/gnss_files/SDK/Pyro/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.sh){:download="oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.sh"} | 1.1 GB | 8ce7c2a732884e5487f592ae102780f1 | [Host](https://sites.cttc.es/gnss_files/SDK/Pyro/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.host.manifest), [Target](https://sites.cttc.es/gnss_files/SDK/Pyro/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.target.manifest) |
| Morty | Abandoned | [SDK](https://sites.cttc.es/gnss_files/SDK/Morty/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.sh){:download="oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.sh"} | 1.0 GB | b2eb36d4ef2838586afa1bc6b44dc0f4 | [Host](https://sites.cttc.es/gnss_files/SDK/Morty/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.host.manifest), [Target](https://sites.cttc.es/gnss_files/SDK/Morty/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.target.manifest) |
| Krogoth | Abandoned | [SDK](https://sites.cttc.es/gnss_files/SDK/Krogoth/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.sh){:download="oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.sh"} | 920 MB | 16af7ab553a0c8f553ba4d6ccc5d6bfe | [Host](https://sites.cttc.es/gnss_files/SDK/Krogoth/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.host.manifest), [Target](https://sites.cttc.es/gnss_files/SDK/Krogoth/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.target.manifest) |
| Jethro | Abandoned | [SDK](https://sites.cttc.es/gnss_files/SDK/Jethro/oecore-x86_64-armv7ahf-vfp-neon-toolchain-nodistro.0.sh){:download="oecore-x86_64-armv7ahf-vfp-neon-toolchain-nodistro.0.sh"} | 1.6 GB | d0419e9c1e0894a327af4d9560cf0294 | [Host](https://sites.cttc.es/gnss_files/SDK/Jethro/oecore-x86_64-armv7ahf-vfp-neon-toolchain-nodistro.0.host.manifest), [Target](https://sites.cttc.es/gnss_files/SDK/Jethro/oecore-x86_64-armv7ahf-vfp-neon-toolchain-nodistro.0.target.manifest) |


Releases are listed from the most recent (top) to the oldest (bottom). All the
stable SDK versions (that is, starting from Rocko) incorporate all the required
dependency packages for cross-compiling GNSS-SDR in your own machine, including
software drivers for a wide range of RF front-ends such as
[UHD](https://github.com/EttusResearch/uhd),
[gr-osmosdr](https://github.com/osmocom/gr-osmosdr), and
[gr-iio](https://github.com/analogdevicesinc/gr-iio). Check out the target
manifest files to see the full list of packages and versions each particular SDK
will install in the root filesystem of your target device.


### Option 2: Building your own SDK

Head to
[https://github.com/carlesfernandez/oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest)
and follow instructions there. Make sure you have plenty of space in your hard
drive (25 GB minimum). In summary, the process is as follows:

1) Install `repo`:

```console
$ curl https://storage.googleapis.com/git-repo-downloads/repo > repo
$ chmod a+x repo
$ sudo mv repo /usr/local/bin/
```

2) Create a folder in which all the process will take place:

```console
$ mkdir oe-repo
$ cd oe-repo
```

3) Initialize `repo`, download the required tools and prepare your building environment:

```console
$ repo init -u https://github.com/carlesfernandez/oe-gnss-sdr-manifest.git -b thud
$ repo sync
$ TEMPLATECONF=`pwd`/meta-gnss-sdr/conf source ./oe-core/oe-init-build-env ./build ./bitbake
```

This last command copies default configuration information into the
`./build/conf` directory and sets up some environment variables for
OpenEmbedded.

{% capture branches_info %}
Please note that the name of the oe-gnss-sdr-manifest branch passed to `repo`
will determine the version of the SDK to be built. For instance,

```console
$ repo init -u https://github.com/carlesfernandez/oe-gnss-sdr-manifest.git -b sumo
```

will generate the Sumo release of the SDK (see the manifest for a list of
installed packages and their respective versions), while

```console
$ repo init -u https://github.com/carlesfernandez/oe-gnss-sdr-manifest.git -b thud
```

will generate the Thud release.
{% endcapture %}

<div class="notice--warning">
  {{ branches_info | markdownify }}
</div>


4) OPTIONAL: at this point, you can configure your building by editing the file
`./conf/conf.local`. If you do nothing and leave the configuration by default,
the next step will generate an image for a Zedboard. Other platforms can be
selected by changing the value of the MACHINE variable. Read the comments at
`./conf/conf.local` for more options.

5) Build the image and the toolchain installer:

```console
$ bitbake gnss-sdr-dev-image
$ bitbake -c populate_sdk gnss-sdr-dev-image
```

This process downloads several gigabytes of source code and then proceeds to
compile all the required packages for the host and native targets, so **it will
take time**. The first command constructs a complete Linux image for your target
device. The second command generates the toolchain installer, a script that
installs a cross-compiler, a cross-linker, and a cross-debugger, forming a
completely self-contained toolchain that allows you to cross-develop on the host
machine for the target hardware. The generated script will be found under
`./tmp-glibc/deploy/sdk/`.

For building an image with the [Xfce](https://www.xfce.org/) desktop environment
and `gnss-sdr` already included:

```console
$ bitbake gnss-sdr-demo-image
```

If you are using Rocko or above, you can create a Docker image of the target
environment by doing:

```console
$ bitbake gnss-sdr-dev-docker
```

This will create a `.docker` file under `./tmp-glibc/deploy/images/` that can be
ingested by Docker as:

```console
$ docker load -i /path/to/file.docker
```

For your convenience, you can also directly pull and run this image from an
arm32v7-based device:

```console
$ docker run -it carlesfernandez/gnsssdr-dev-arm32v7:rocko-21.08 /bin/bash
```

(or `carlesfernandez/gnsssdr-dev-arm32v7:sumo-21.08` for the Sumo image, and so
on).

Copy the results of your cross-compilation there and you are ready to go. Please
note that this image can only be executed by an arm32v7-based system.

  If you are going to build images and the SDK in your own machine, you could be
  interested in the
  [https://github.com/carlesfernandez/yocto-geniux](https://github.com/carlesfernandez/yocto-geniux)
  repo. It provides a `Dockerfile` that defines a Docker container for building
  everything in a virtualized environment (including an interactive mode in
  which you can make changes and experiment), and a script that automates the
  whole process, so you can build the version you want with a single command
  line. Check the [README.md](https://github.com/carlesfernandez/yocto-geniux/blob/main/README.md)
  file on that repo for instructions.
  {: .notice--success}


Using the SDK
--------------

### Installing the SDK

Install some basic packages required by the SDK:

```console
$ sudo apt-get install xz-utils python3
```

Then, download an SDK shell script from the [table above](#sdk-table) (or use
your own-generated SDK) and install it:

```console
$ sh ./geniux-x86_64-gnss-sdr-dev-image-zedboard-zynq7-toolchain-rocko-21.08.0.sh
```

This will ask you what directory to install the SDK into. Which directory does
not matter, just make sure wherever it goes that you have enough disk space. The
default is `/usr/local/oecore-x86_64/`.

The SDK comes with everything you need to build GNSS-SDR. Its main contents are:

* An "`environment-setup-...`" script that sets up all the required
  environmental variables, like editing PATH, CC, CXX, etc.
* Two sysroots; one for the host machine and one for the target device
  (both installed by default at `/usr/local/oecore-x86_64/sysroots/`).

### Setting up the cross-compiling environment

Running the environment script will set up all the variables needed for
cross-compiling. You will need to do this each time you want to run the SDK (and
since the environment variables are only set for the current shell, you need to
source it for every console you run the SDK from):

```console
$ . /usr/local/oecore-x86_64/environment-setup-armv7ahf-neon-geniux-linux-gnueabi
```

### Cross-compiling GNSS-SDR and installing it on the target filesystem

Once the environment script has been run, you can cross-compile GNSS-SDR as:

```console
$ git clone https://github.com/gnss-sdr/gnss-sdr.git
$ cd gnss-sdr
$ git checkout next
$ cd build
$ cmake -DCMAKE_TOOLCHAIN_FILE=../cmake/Toolchains/oe-sdk_cross.cmake -DCMAKE_INSTALL_PREFIX=/usr ..
$ make
$ sudo make install DESTDIR=/usr/local/oecore-x86_64/sysroots/armv7ahf-neon-geniux-linux-gnueabi/
```

Please note that we set the install prefix to `/usr`. That will be the
installation location of the project on the embedded device. We use this because
all links and references within the file system will be based on this prefix,
but it is obviously not where we want to install these files on our own host
system. Instead, we use the `make` program's `DESTDIR` directive. On the device
itself, however, the file system would have this installed onto `/usr`, which
means all the links and references are correct as far as the device is
concerned.



Copying an image file to your SD card
-------------------------------------

We have several options here:

### Using `dd`

```console
$ mkdir myimage
$ tar -xvzf gnss-sdr-dev-image-zedboard-zynq7-20170103150322.rootfs.tar.gz -C myimage
$ sudo dd status=progress bs=4M if=myimage of=/dev/sdX
```

where `/dev/sdX` is the device the card is mounted at. This works, but can be
slow.

### Using `bmaptool`

This option is faster:

```console
$ git clone https://github.com/01org/bmap-tools.git
$ cd bmap-tools
$ sudo python setup.py install
$ sudo bmaptool copy gnss-sdr-dev-image-zedboard-zynq7-20170103150322.rootfs.tar.gz /dev/sdX --nobmap
```

Starting from Zeus v21.08, it is possible to flash bootable images from
`*.rootfs.wic.xz` and `*.rootfs.wic.bmap` files:

```console
$ sudo bmaptool copy gnss-sdr-demo-image-zedboard-zynq7-20170103150322.rootfs.wic.xz \
  --bmap gnss-sdr-demo-image-zedboard-zynq7-20170103150322.rootfs.wic.bmap \
  /dev/sdX
```

For `*.rootfs.wic.xz` files, another interesting choice for flashing images is
[Balena Etcher](https://www.balena.io/etcher/), a tool that works in GNU/Linux,
Microsoft Windows and macOS.

### Copying only the sysroot to the SD card using `cp`

For systems with a dedicated u-boot, devicetree and Kernel, it is possible to
copy only the cross-compiled sysroot to the SD ext4 partition. Mount the SD card
partition and extract the root filesystem to the mounted root directory (in this
example, `sdb2` is the SD card device and the ext4 partition is the second
partition in the SD partition table), and then use `cp` with the `-a` option,
which preserves the same directory tree, same file types, same contents, same
metadata (times, permissions, extended attributes, etc.) and same symbolic
links:

```console
$ mkdir ./mounted_SD
$ sudo mount -rw /dev/sdb2 ./mounted_SD
$ cd ./mounted_SD
$ sudo rm -rf *
$ cd ..
$ sudo cp /usr/local/oecore-x86_64/sysroots/armv7ahf-neon-geniux-linux-gnueabi/* -a ./mounted_SD
```

### Copying only GNSS-SDR executables to the device over the network using `sshfs`

For example, let's assume that we can address the device by a network name or IP
address. Let's say it's called "mydevice" and it has an ip address of
192.168.2.2. We would use a mount point created in your home directory. To
install sshfs and mount mydevice locally:

```console
$ sudo apt-get install sshfs
$ sudo gpasswd -a $USER fuse
$ cd
$ mkdir mydevice
$ sshfs -o allow_root root@192.168.2.2:/ mydevice
```

You should be able to `ls mydevice` and see the contents of mydevice's file
system. Then you can cross-compile GNSS-SDR as before, changing the last command
by:

```console
$ sudo make install DESTDIR=~/mydevice
```

in order to install the GNSS-SDR binary directly in your device. To unmount:

```console
$ fusermount -u ~/mydevice
```


## Disclaimer

Yocto Project and all related marks and logos are trademarks of The Linux
Foundation. This website is not, in any way, endorsed by the Yocto Project or
[The Linux Foundation](https://linuxfoundation.org/).


References
--------

 * More information about the development environment and the usage of BitBake
 can be found in the [Yocto Project
 Documentation](https://www.yoctoproject.org/documentation).

 * This work is heavily based on [Embedded Developments with GNU
 Radio](https://wiki.gnuradio.org/index.php/Embedded_Development_with_GNU_Radio)
 and the work by Philip Balister (and others) on the
 [oe-gnuradio-manifest](https://github.com/balister/oe-gnuradio-manifest) and
 the [meta-sdr](https://github.com/balister/meta-sdr) layer.

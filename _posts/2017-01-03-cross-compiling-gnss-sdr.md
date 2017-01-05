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
---
{% include toc %}

An **embedded system** is defined as a computer system with a specific function within a larger mechanical or electrical system. Examples of properties of embedded computers when compared with general-purpose counterparts are low power consumption, small size, rugged operating ranges, and low per-unit cost, at the price of limited processing resources.

This page is devoted to the development cycle for building and executing GNSS-SDR in an embedded computer. In this example we are working with a [Zedboard](https://www.xilinx.com/products/boards-and-kits/1-elhabt.html){:target="_blank"} (a development board that ships a [Xilinx Zynq-7000](https://www.xilinx.com/products/silicon-devices/soc/zynq-7000.html){:target="_blank"} all-programmable [SoC](https://en.wikipedia.org/wiki/System_on_a_chip){:target="_blank"}, which houses two ARM and two FPGA processors), but this procedure is applicable to other embedded platforms without much modification.

Once all the required dependencies are already installed, GNSS-SDR can be built from source in ARM devices without hassle. However, this building process can easily take more than 10 hours if it is executed on the Zynq device. Thus, in order to speed up the development cycle from a change in the source code to the execution in an embedded platform, we need to resort to cross-compilation.

**Cross-compilation** consists of a building framework capable of creating executable code for a platform other than the one on which the compiler is running. In our example, we would like to build GNSS-SDR with the powerful, fast processor of a general-purpose desktop computer, and to generate binaries that can be directly executed by the Zynq device.

  By using cross-compilation, we can shorten the building time from more than 10 hours to less than 10 minutes. This improves [**Testability**](http://gnss-sdr.org/design-forces/testability/){:target="_blank"}, as one of its requirements is that a testing cycle has to be *fast*.
  {: .notice--success}

The cross-compilation environment proposed here is based on [OpenEmbedded](http://www.openembedded.org){:target="_blank"}, a building framework for embedded Linux. OpenEmbedded offers a best-in-class cross-compile environment, allowing developers to create a complete, custom GNU/Linux distribution for embedded systems.

Below we provide a software developer kit (SDK) that installs a ready-to-use cross-compilation environment in your computer.

Getting the SDK
----------------

We offer two options here: you can either download a script that will install the full SDK in your computer, or you can customise and build your own SDK. Both options are described below:

### Option 1: Downloading the SDK

You can download the SDK from the links below. Version names (Jethro, Krogoth, Morty, ...) follow those of the [Yocto Project Releases](https://wiki.yoctoproject.org/wiki/Releases){:target="_blank"}.

The following table lists the available SDK versions:


| Version | Status | Download | md5 | Manifest |
|:-|:-:|:-:|:-|:-:|
| Morty | Development | [SDK](http://sites.cttc.es/gnss_files/SDK/Morty/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.sh) | f2abf51e5f438dc30eb0261566f2066b | [Host](http://sites.cttc.es/gnss_files/SDK/Morty/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.host.manifest){:target="_blank"}, [Target](http://sites.cttc.es/gnss_files/SDK/Morty/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.target.manifest){:target="_blank"} |
| Krogoth | Development | [SDK](http://sites.cttc.es/gnss_files/SDK/Krogoth/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.sh) | 837044c6d475d8ffe21e73a5a7e2d2d4 | [Host](http://sites.cttc.es/gnss_files/SDK/Krogoth/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.host.manifest){:target="_blank"}, [Target](http://sites.cttc.es/gnss_files/SDK/Krogoth/oecore-x86_64-armv7ahf-neon-toolchain-nodistro.0.target.manifest){:target="_blank"} |
| Jethro | Stable | [SDK](http://sites.cttc.es/gnss_files/SDK/Jethro/oecore-x86_64-armv7ahf-vfp-neon-toolchain-nodistro.0.sh) | 81cba6254f63e23394edae847fd60e0a | [Host](http://sites.cttc.es/gnss_files/SDK/Jethro/oecore-x86_64-armv7ahf-vfp-neon-toolchain-nodistro.0.host.manifest){:target="_blank"}, [Target](http://sites.cttc.es/gnss_files/SDK/Jethro/oecore-x86_64-armv7ahf-vfp-neon-toolchain-nodistro.0.target.manifest){:target="_blank"} |



Please note that the SDK scripts provided in this table take about 1.5 GB. Check out the manifest files to see the full list of packages and versions each SDK will install in the root filesystem of your device. Releases are listed from the most recent (top) to the oldest (bottom). For a smoother, more tested experience, pick a stable release.


### Option 2: Building your own SDK

Head to [https://github.com/carlesfernandez/oe-gnss-sdr-manifest](https://github.com/carlesfernandez/oe-gnss-sdr-manifest){:target="_blank"} and follow instructions there. Make sure you have plenty of space in your hard drive (25 GB minimum). In summary, the process is as follows:

1) Install ```repo```:

     $ curl http://commondatastorage.googleapis.com/git-repo-downloads/repo > repo
     $ chmod a+x repo
     $ sudo mv repo /usr/local/bin/

2) Create a folder in which all the process will take place:

     $ mkdir oe-repo
     $ cd oe-repo

3) Initialize ```repo```, download the required tools and prepare your building environment:

     $ repo init -u git://github.com/carlesfernandez/oe-gnss-sdr-manifest.git -b jethro
     $ repo sync
     $ TEMPLATECONF=`pwd`/meta-gnss-sdr/conf source ./oe-core/oe-init-build-env ./build ./bitbake

This last command copies default configuration information into the ```./build/conf``` directory and sets up some environment variables for OpenEmbedded.

{% capture branches_info %}
Please note that the name of the oe-gnss-sdr-manifest branch passed to ```repo``` will determine the version of the SDK to be built. For instance,

     $ repo init -u git://github.com/carlesfernandez/oe-gnss-sdr-manifest.git -b jethro


will generate the Jethro release of the SDK (see the manifest for a list of installed packages and their respective versions), while

     $ repo init -u git://github.com/carlesfernandez/oe-gnss-sdr-manifest.git -b morty

will generate the Morty release.
{% endcapture %}

<div class="notice--warning">
  {{ branches_info | markdownify }}
</div>


4) OPTIONAL: at this point, you can configure your building by editing the file ```./conf/conf.local```. If you do nothing and leave the configuration by default, the next step will generate an image for a Zedboard. Other platforms can be selected by changing the value of the MACHINE variable. Read the comments at ```./conf/conf.local``` for more options.

5) Build the image:

     $ bitbake gnss-sdr-dev-image
     $ bitbake -c populate_sdk gnss-sdr-dev-image


This process will generate a script (such as the ones linked above) which will install the SDK in your system. Such script will be found under ```./tmp-glibc/deploy/sdk/```.


Using the SDK
--------------

### Installing the SDK

Download the SDK shell script (or use a locally created SDK, as explained above) and install it:

     $ sudo sh oecore-x86_64-armv7ahf-vfp-neon-toolchain-nodistro.0.sh

This will ask you what directory to install the SDK into. Which directory does not matter, just make sure wherever it goes that you have enough disk space. The default is ```/usr/local```.

The SDK comes with everything you need to build GNSS-SDR. The main contents it has are:

* An "```environment-setup-...```" script that sets up our environmental variables, like editing PATH, CC, CXX, etc.
* Two sysroots; one for the host machine and one for the target device (installed by default at ```/usr/local/oecore-x86_64/sysroots/```).

### Setting up the cross-compiling environment
Running the environment script will set up most of the variables you'll need to compile. You will need to do this each time you want to run the SDK (and since the environment variables are only set for the current shell, you need to source it for every console you will run the SDK from):

     $ . /usr/local/oecore-x86_64/environment-setup-armv7ahf-vfp-neon-oe-linux-gnueabi


### Cross-compiling GNSS-SDR and installing it on the target filesystem

Once the environment script has been run, you can cross-compile GNSS-SDR as:

     $ git clone https://github.com/gnss-sdr/gnss-sdr.git
     $ cd gnss-sdr
     $ git checkout next
     $ cd build
     $ cmake -DCMAKE_TOOLCHAIN_FILE=../cmake/Toolchains/oe-sdk_cross.cmake -DCMAKE_INSTALL_PREFIX=/usr ..
     $ make
     $ sudo make install DESTDIR=/usr/local/oecore-x86_64/sysroots/armv7ahf-vfp-neon-oe-linux-gnueabi/

Please note that we set the install prefix to ```/usr```. That will be the installation location of the project on the embedded device. We use this because all links and references within the file system will be based on this prefix, but it is obviously not where we want to install these files on our own host system. Instead, we use the ```make``` program's ```DESTDIR``` directive. On the device itself, however, the file system would have this installed onto ```/usr```, which means all our links and references are correct as far as the device is concerned.



Copying an image file to your SD card
-------------------------------------

We have several options here:

### Using ```dd```

     $ mkdir myimage
     $ tar -xvzf gnss-sdr-dev-image-zedboard-zynq7-20170103150322.rootfs.tar.gz -C myimage
     $ sudo dd status=progress bs=4M if=myimage of=/dev/sdX

where ```/dev/sdX``` is the device the card is mounted as. This works, but can be slow.

### Using ```bmaptool```

This option is faster:

     $ git clone https://github.com/01org/bmap-tools.git
     $ cd bmap-tools
     $ sudo python setup.py install
     $ sudo bmaptool copy gnss-sdr-dev-image-zedboard-zynq7-20170103150322.rootfs.tar.gz /dev/sdX --nobmap


### Using ```sshfs```

For example, let's assume that we can address the device by a network name or IP address. Let's say it's called "mydevice" and it has an ip address of 192.168.2.2. We would use a mount point created in your home directory. To install sshfs and mount mydevice locally:

     $ sudo apt-get install sshfs
     $ sudo gpasswd -a $USER fuse
     $ cd
     $ mkdir mydevice
     $ sshfs -o allow_root root@192.168.2.2:/ mydevice

You should be able to ```ls mydevice``` and see the contents of mydevice's file system. Then you can cross-compile GNSS-SDR as before, changing the last command by:

     $ sudo make install DESTDIR=~/mydevice

in order to install the GNSS-SDR binary directly in your device. To unmount:

     $ fusermount -u ~/mydevice


References
--------

This work is heavily based on [Embedded Developments with GNU Radio](http://gnuradio.org/redmine/projects/gnuradio/wiki/Embedded){:target="_blank"} and the work by Philip Balister (and others) on the [oe-gnuradio-manifest](https://github.com/balister/oe-gnuradio-manifest){:target="_blank"} and the [meta-sdr](https://github.com/balister/meta-sdr){:target="_blank"} layer.

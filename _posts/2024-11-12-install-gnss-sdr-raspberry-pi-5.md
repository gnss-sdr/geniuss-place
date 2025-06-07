---
title: Cross-compilation of GNSS-SDR for a Raspberry Pi 5
permalink: /docs/tutorials/raspberrypi5-cross-compilation/
excerpt: "Example on cross compilation GNSS-SDR for a Raspberry Pi 5"
author_profile: false
header:
  teaser: /assets/images/logo-git.png
tags:
  - raspberrypi
  - Git
sidebar:
  nav: "docs"
toc: true
toc_sticky: true
show_date: false
last_modified_at: 2024-11-12T09:54:02+02:00
---

This tutorial is to show the steps to cross-compile and install gnss-sdr to a Raspberry Pi 5 from the scratch. \
At the end of this tutorial you will (hopefully) have gnss-sdr up and running in a Raspberry Pi 5.

## Before you start

Make sure that in the machine you are going to cross-compile:
* You have installed repo (https://git-repo.info/en/) 
* You dispose a LOT of free space (135GB)
* The whole process will probably take 3-4 hours

## 1. Download the OpenEmbedded build system for gnss-sdr

**1.1** Create a oe-repo directory:
```console
$ mkdir oe-repo
$ cd oe-repo
```

**1.2** Use repo to download the gnss-sdr dependencies and scarthgap:
```console
$ repo init -u https://github.com/carlesfernandez/oe-gnss-sdr-manifest.git -b scarthgap
$ repo sync
```
**Note**: repo is used to manage the repository dependencies of a project. They are specified in the manifest file.   

You can see which layers are going to be downloaded in  
https://github.com/carlesfernandez/oe-gnss-sdr-manifest/blob/scarthgap/default.xml  


## 2. Create the image which will be the base of the Raspberry Pi 5

**2.1** In order to use the OpenEmbedded commands, you have to be inside the OpenEmbedded environment:
```console
$ TEMPLATECONF=$(pwd)/meta-gnss-sdr/conf/templates/default source ./oe-core/oe-init-build-env ./build ./bitbake
```

**Important**:

- In paragraphs 2 and 3, all commands are assumed to be executed in the oe-repo/build directory.
- The result files of the build system will be created in the *oe-repo/build/tmp-glibc* directory.

**2.2** Append the following lines to *conf/local.conf* to configure the build system:
```json
MACHINE = "raspberrypi5";
IMAGE_FSTYPES += "wic.gz";
```
This lines mean:
- Set the target machine to be a Raspberry Pi 5.
- Set the output image to be a compressed wic file (which will contain the partitions and the partition table for the Raspberry Pi).

**2.3** Generate a compressed image (wic.gz) which will be installed into the SD card in the Raspberry Pi:

```console
$ bitbake gnss-sdr-dev-image
```
<span style="color: DarkRed">**Note**</span> Depending on your system this process might take some time (3-4 hours).  
However, if you need to repeat this command it will go much faster as it will not repeat the work it has already done (such as downloading the packages, cross-compiling them, etc.).

The output of this process is the compressed image to be written into the Raspberry Pi:
```text
tmp-glibc/deploy/images/raspberrypi5/gnss-sdr-dev-image-raspberrypi5.rootfs-<date>.wic.gz
```

**2.4** Copy the image (wic.gz file) to the SD card which will be inserted in the Raspberry Pi:

```console
$ gzip -dc tmp-glibc/deploy/images/raspberrypi5/gnss-sdr-dev-image-raspberrypi5.rootfs-20241108090015.wic.gz | ssh user@remote-host sudo dd of=/dev/sdc bs=4M status=progress
14252376064 bytes (14 GB, 13 GiB) copied, 3349 s, 4.3 MB/s
0+433964 records in
0+433964 records out
14253922304 bytes (14 GB, 13 GiB) copied, 3354.68 s, 4.2 MB/s
```

This command does:  
a. It uncompresses the image (wic.gz file) and sends it to a remote host via ssh.  
b. It writes the image in the SD card (using dd) in a remote host.  

**Notes**:
* Copy the public key of your system to the remote host to avoid being prompted for the password when connecting via ssh in the remote host.  
* You might need to configure the remote system in order to allow the user to execute dd without root permissions (or don't ask for a password when executing the dd command).  
* The image will have two partitions:
    - The first one will be used for booting (500 MB)
    - The second one will contain the operating system (16GB)
* If the space of the SD is bigger than 16GB, the unused space will be assigned as non-formatted.

## 3. Generate the SDK to cross-compile gnss-sdr

We need to cross-compile gnss-sdr for the aarch64 architecture in order to use it in the Raspberry Pi.

**3.1** Generate the SDK (Software Development Kit). This comprises the tools we need to cross-compile gnss-sdr (compiler, linker, etc.).

```console
$ bitbake -c populate_sdk gnss-sdr-dev-image
```

The result is the SDK bundled into an installer file *tmp-glibc/deploy/sdk/geniux-x86\_64-gnss-sdr-dev-image-raspberrypi5-toolchain-scarthgap-24.02.1.sh*.

**3.2** Extract the SDK from the installer file to a folder (it will be created if it does not exist):
```console
$ cd tmp-glibc/deploy/sdk
$ ./geniux-x86_64-gnss-sdr-dev-image-raspberrypi5-toolchain-scarthgap-24.02.1.sh -y -d ~/raspberrypi-sdk
```

## 4. Cross-compile gnss-sdr using the SDK

**4.1** Open a new clean bash with (almost) no environment variables:
```console
$ env -i bash
```

**4.2** Using the SDK, configure the shell so it will recognize the compiler, linker, etc. for the architecture of the Raspberry Pi 5 (aarch64):
```console
$ . ~/raspberrypi-sdk/environment-setup-cortexa76-geniux-linux
```
    
You can see all the environment variables (CC, LD, etc.) have been set to cross-compile:
```console
$ env|grep -e "^LD" -e "^CC" -e "^AR"
LDFLAGS=-Wl,-O1 -Wl,--hash-style=gnu -Wl,--as-needed
LD=aarch64-geniux-linux-ld  --sysroot=/home/xavier/sdk/sysroots/cortexa76-geniux-linux
AR=aarch64-geniux-linux-ar
ARCH=arm64
CC=aarch64-geniux-linux-gcc  -mcpu=cortex-a76+crypto -mbranch-protection=standard --sysroot=/home/xavier/sdk/sysroots/cortexa76-geniux-linux
```

**4.3** Download the gnss-sdr code:
```console
$ git clone https://github.com/gnss-sdr/gnss-sdr.git
$ cd gnss-sdr
$ git checkout next
```

**4.4** Configure the gnss-sdr code, cmake will detect the cross-compile tools from the environment variables:
```console
$ cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE=cmake/Toolchains/oe-sdk_cross.cmake -DCMAKE_INSTALL_PREFIX=/usr
```

It should work fine, however if the connection fails during the process the following message will appear.  
```
Configuring incomplete, errors occurred!
It could be that the connection was lost when it tried to download some files:
[download 0% complete]
CMake Error at tests/CMakeLists.txt:498 (file):
  file DOWNLOAD cannot compute hash on failed download

status: [HTTP response code said error]
```
In this case repeat the command and eventually it will succeed.

**4.5** **FINALLY** you can cross-compile gnss-sdr to make it work on the Raspberry Pi:

```console
$ cmake --build build -j
```

The option **-j** is to accelerate the process. The system will use all its CPUs to compile the code files in parallel.
If you prefer not to use all the CPUs, you can use -jN to use N CPUs (i.e. -j4 will use 4 CPUs to compile at the same time).

You can check the generated gnss-sdr file is an ARM aarch64 file:
```console
$ file build/src/main/gnss-sdr
```
```text
build/src/main/gnss-sdr: ELF 64-bit LSB executable, ARM aarch64, version 1 (GNU/Linux), dynamically linked, interpreter /lib/ld-linux-aarch64.so.1, BuildID[sha1]=e64db7946321179fdf87276872c723b906d6fda2, for GNU/Linux 5.15.0, with debug_info, not stripped
```

**4.6** Mount the second partition of the SD card (where the Operating System resides) and install the cross-compiled gnss-sdr in it:

```console
$ mount /dev/sdc2 /mnt/sd_disk2
$ cmake --install build/ --prefix /mnt/sd_disk2/
```
```text
-- Install configuration: "Release"
-- Installing: /mnt/sd_disk2/bin/gnss-sdr
-- Installing: /mnt/sd_disk2/share/gnss-sdr/conf
-- Installing: /mnt/sd_disk2/share/gnss-sdr/conf/gnss-sdr.conf
-- Installing: /mnt/sd_disk2/share/gnss-sdr/conf/Nsr_input
...
```

## 5. Example of an execution of the cross-compiled gnss-sdr in the Raspberry Pi 5

We are going to execute gnss-sdr in a Raspberry Pi 5 using a dat file as the input instead of a front-end. 

**5.1** Put the SD card in the Raspberry Pi, plug it into your LAN, and turn it on.
Then, copy your gnss-sdr configuration file from your local machine into the Raspberry Pi (in my case the IP of the Raspberry is 10.42.0.163):
```console
$ rsync -av gnss-sdr.conf root@10.42.0.163:~
```

**Note**: All the following commands are executed in the Raspberry Pi.

**5.2** Enter the Raspberry Pi and execute volk\_profile and volk\_gnsssdr_profile (it will take 3-5 minutes).
```console
$ ssh root@10.42.0.163
(no password)

$ volk_profile
$ volk_gnsssdr_profile
```

**5.3** As the dat files are very big (4GB), it is advisable to mount them from the Raspberry Pi to a remote directory in order to avoid copying the files around:
```console
$ sshfs user@ip_host:<directory-where-dat-is-located>  <my-local-path>
```

As an example, in my local computer the directory  
*/home/user/Work/gnss-sdr-examples/2013\_04\_04\_GNSS\_SIGNAL\_at\_CTTC\_SPAIN/* contains the file *2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.dat*  
We can mount */home/user/Work/gnss-sdr-examples/2013\_04\_04\_GNSS\_SIGNAL\_at\_CTTC\_SPAIN/* from our local system to */mnt/outside-computer* in the Raspberry Pi:

```console
$ sshfs user@ip_host:/home/user/Work/gnss-sdr-examples/2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN/  /mnt/outside-computer
```

**5.4** Change "SignalSource.filename" in the gnss-sdr.conf so it will read from the file and not from any front-end:
```text
SignalSource.filename=/mnt/outside-computer/2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.dat
```


**5.5** Execute gnss-sdr from the Raspberry Pi!

```console
root@raspberrypi5:~# gnss-sdr -c ./gnss-sdr.conf
Initializing GNSS-SDR v0.0.19.git-next-7cd99e4b2 ... Please wait.
Logging will be written at "/tmp"
Use gnss-sdr --log_dir=/path/to/log to change that.
RF Channels: 1
Starting a TCP/IP server of RTCM messages on port 2101
The TCP/IP server of RTCM messages is up and running. Accepting connections ...
Processing file /mnt/outside-computer/2013_04_04_GNSS_SIGNAL_at_CTTC_SPAIN.dat, which contains 800000000 samples (1600000000 bytes)
GNSS signal recorded time to be processed: 99.95 [s]
buffer_double_mapped :warning: allocate_buffer: tried to allocate   431 items of size 152. Due to alignment requirements   2048 were allocated.  If this isn't OK, consider padding   your structure to a power-of-two bytes.   On this platform, our allocation granularity is 16384 bytes.
buffer_double_mapped :warning: allocate_buffer: tried to allocate   431 items of size 152. Due to alignment requirements   2048 were allocated.  If this isn't OK, consider padding   your structure to a power-of-two bytes.   On this platform, our allocation granularity is 16384 bytes.

...
First position fix at 2032-Nov-18 06:23:48.160000 UTC is Lat = 41.2748 [deg], Long = 1.9877 [deg], Height= 70.014 [m]
Position at 2032-Nov-18 06:23:48.500000 UTC using 5 observations is Lat = 41.274846 [deg], Long = 1.987710 [deg], Height = 69.60 [m]
Velocity: East: -0.60 [m/s], North: -0.39 [m/s], Up = 0.77 [m/s]
Current receiver time: 45 s
Position at 2032-Nov-18 06:23:49.000000 UTC using 5 observations is Lat = 41.274836 [deg], Long = 1.987700 [deg], Height = 74.77 [m]
...

```

That's it! **HOORAY!!**

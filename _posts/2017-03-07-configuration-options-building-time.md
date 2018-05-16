---
title: "Configuration options at building time"
permalink: /docs/tutorials/configuration-options-building-time/
excerpt: "Description of the available GNSS-SDR configuration options at building time."
author_profile: false
header:
  teaser: /assets/images/Cmake-logo.png
tags:
  - tutorial
sidebar:
  nav: "docs"
toc: true
last_modified_at: 2018-03-27T09:37:02+02:00
---


GNSS-SDR's building system is based on [CMake](https://cmake.org/), a cross-platform, free and open-source software for managing the build process of software using a compiler-independent method. CMake supports directory hierarchies and applications that depend on multiple libraries.  It can locate executables, files, and libraries to be linked against, generating [makefiles](https://en.wikipedia.org/wiki/Makefile) for many platforms and IDEs (such as [Eclipse](https://www.eclipse.org), [Codeblocks](http://www.codeblocks.org/) and [Xcode](https://developer.apple.com/xcode/)), and liberating users from choosing the adequate flags for their compiler. CMake is used in conjunction with native build environments such as [make](https://en.wikipedia.org/wiki/Make_(software)) or Apple's [Xcode](https://en.wikipedia.org/wiki/Xcode).


CMake allows GNSS-SDR to be effortlessly built in a wide range of operating systems and processor architectures, constituting a key tool for its [**portability**]({{ "/design-forces/portability/" | relative_url }}).
{: .notice--info}

CMake can handle in-place and out-of-place builds, enabling several builds from the same source tree, and [cross-compilation](https://en.wikipedia.org/wiki/Cross_compiler). The ability to build a directory tree outside the source tree is a key feature, ensuring that if a build directory is removed, the source files remain unaffected. This approach is highly recommended when building GNSS-SDR, and you will get a warning message if you try an in-place build.


The ```cmake``` executable is the CMake command-line interface. When ```cmake``` is first run in an empty build tree, it creates a ```CMakeCache.txt``` file and populates it with customizable settings for the project.

Once all the required dependencies are installed in your system, the default building process is:

```bash
$ cd gnss-sdr/build
$ cmake ..
$ make
$ sudo make install
```

CMake's defaults and GNSS-SDR project configuration settings can be overridden on the command line with the -D option, with the following syntax:

```bash
cmake -D<variable_name>=<value>
```

Thus, if you want to set the variable named ```CMAKE_BUILD_TYPE``` to the ```Debug``` value, you can write in your command line:

```bash
$ cmake -DCMAKE_BUILD_TYPE=Debug ..
```

You can specify any number of variables:

```bash
$ cmake -DCMAKE_BUILD_TYPE=Debug -DENABLE_OSMOSDR=ON ..
```

This page documents the available GNSS-SDR configuration options at building time.


**NOTE**: Options in orange are currently available only in the ```next``` branch of GNSS-SDR, and they will be part of the next stable release. More info on how to access the ```next``` branch can be found in our brief [Git tutorial]({{ "/docs/tutorials/using-git/" | relative_url }}).
{: .notice--warning}


## General CMake variables

The building system honors the usual [CMake variables](https://cmake.org/cmake/help/latest/manual/cmake-variables.7.html). Most relevant are:


|----------
|  **Variable passed to CMake**  |  **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|
|--------------
| &#x2011;DCMAKE_BUILD_TYPE |  None / Debug / Release / RelWithDebInfo / MinSizeRel | Release | A variable which controls the type of build and some of the flags passed to the compiler. The default values for these flags change with different compilers. If CMake does not know your compiler, the contents will be empty. See the [CMake documentation](https://cmake.org/cmake/help/v3.0/variable/CMAKE_BUILD_TYPE.html) for more details. |
| &#x2011;DCMAKE_INSTALL_PREFIX | System path | System-dependent. In most systems, this use to be ```/usr/local```. | Specifies the path in which GNSS-SDR will be installed when doing ```make install```. The content of this variable is prepended onto all install directories. On UNIX systems, one can use the ```DESTDIR``` mechanism in order to relocate the whole installation (see below). |
| &#x2011;DCMAKE_INCLUDE_PATH  | System path | System-dependent. | This is used when searching for include files *e.g.* using the FIND_PATH() command in the CMakeLists.txt files. If you have headers in non-standard locations, it may be useful to set this variable to this directory. If you need several directories, separate them by the platform specific separators (*e.g.* ":" on UNIX). |
| &#x2011;DCMAKE_LIBRARY_PATH  | System path | System-dependent. | This is used when searching for libraries *e.g.* using the FIND_LIBRARY() command in the CMakeLists.txt files. If you have libraries in non-standard locations, it may be useful to set this variable to this directory. If you need several directories, separate them by the platform specific separators (*e.g.* ":" on UNIX). |
| &#x2011;DCMAKE_PREFIX_PATH  | System path | System-dependent. | This is used when searching for include files, binaries, or libraries using either the FIND_PACKAGE(), FIND_PATH(), FIND_PROGRAM(), or FIND_LIBRARY() commands in the CMakeLists.txt files. For each path in the CMAKE_PREFIX_PATH list, CMake will check "PATH/include" and "PATH" when FIND_PATH() is called, "PATH/bin" and "PATH" when FIND_PROGRAM() is called, and "PATH/lib" and "PATH" when FIND_LIBRARY() is called. |
| &#x2011;DCMAKE_TOOLCHAIN_FILE |  Path to a CMake toolchain file  | None | This variable is specified on the command line when cross-compiling with CMake. It is the path to a file which is read early in the CMake run and which specifies locations for compilers and toolchain utilities, and other target platform and compiler related information. For an example of usage, see [cross-compiling GNSS-SDR]({{ "/docs/tutorials/cross-compiling/" | relative_url }}). |
| <span style="color: DarkOrange">&#x2011;GNinja</span> | <span style="color: DarkOrange">-</span> | <span style="color: DarkOrange">-</span> | <span style="color: DarkOrange">If ```-GNinja``` is passed to CMake, it generates input files for [Ninja](https://ninja-build.org/), a small build system designed for speed that can be seen as a replacement for ```make```. Thus, the code will be compiled by doing ```ninja``` in the command line after running CMake, and the program will be installed by doing ```sudo ninja install```.</span> |
|----------

In addition, if the ```DESTDIR``` environment variable is set, it will be prefixed to ```CMAKE_INSTALL_PREFIX``` in places where it is used to access files during installation. This allows the files to be installed in an intermediate directory tree without changing the final installation path name. For instance:

```bash
$ make DESTDIR=/home/carles install
```

will install the software using the installation prefix, *e.g.*  ```/usr/local``` prepended with the ```DESTDIR``` value which
finally gives ```/home/carles/usr/local```, so binaries will be under ```/home/carles/usr/local/bin```.

Since the value of ```CMAKE_INSTALL_PREFIX``` may be included in installed files, it is important to use ```DESTDIR``` rather than changing ```CMAKE_INSTALL_PREFIX``` when it is necessary to install to a intermediate staging directory. See a practical example of its usage at [cross-compiling GNSS-SDR]({{ "/docs/tutorials/cross-compiling/" | relative_url }}).

For more details, the [CMake official documentation](https://cmake.org/documentation/) is home of the authoritative guide to all CMake variables, commands, and properties.

## Optional drivers for RF front-ends

|----------
|  **Variable passed to CMake**  |  **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|
|--------------
| <span style="color: DarkOrange">&#x2011;DENABLE_UHD</span> | <span style="color: DarkOrange">ON / OFF</span> | <span style="color: DarkOrange">ON</span>  | <span style="color: DarkOrange">If set to ON, it enables the use of the [USRP Hardware Driver (UHD)](https://www.ettus.com/sdr-software/detail/usrp-hardware-driver), a software API that supports application development on all USRP SDR products. This option requires [gr-uhd](https://github.com/gnuradio/gnuradio/tree/master/gr-uhd) already installed in your system. Specifically, the [`UHD_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-uhd_signal_source" | relative_url }}) implementation of a [Signal Source]({{ "/docs/sp-blocks/signal-source/" | relative_url }}) block becomes available. </span>
| &#x2011;DENABLE_OSMOSDR | ON / OFF | OFF  | If set to ON, it enables the use of [OsmoSDR](https://sdr.osmocom.org/trac/) and other front-ends ([RTL-based dongles](https://www.rtl-sdr.com/), [HackRF](https://greatscottgadgets.com/hackrf/), [BladeRF](https://nuand.com), etc.) as a signal source. Specifically, the [`Osmosdr_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-osmosdr_signal_source" | relative_url }}) and [`RtlTcp_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-rtltcp_signal_source" | relative_url }}) implementations of [Signal Source]({{ "/docs/sp-blocks/signal-source/" | relative_url }}) blocks become available. This option requires [gr-osmosdr](https://osmocom.org/projects/sdr/wiki/GrOsmoSDR) already installed in your system.  See an example of use at the [Realtek RTL2832U USB dongle tutorial]({{ "/docs/tutorials/gnss-sdr-operation-realtek-rtl2832u-usb-dongle-dvb-t-receiver/" | relative_url }}). |
| &#x2011;DENABLE_GN3S | ON / OFF | OFF  |  If set to ON, it enables the use of the [SiGe GN3S Sampler v2](https://www.sparkfun.com/products/retired/8238) as signal source (experimental). Specifically, the ```Gn3sSignalSource``` implementation of a [Signal Source]({{ "/docs/sp-blocks/signal-source/" | relative_url }}) block becomes available. This option requires [gr-gn3s](https://github.com/gnss-sdr/gr-gn3s) already installed in your system. See the [SiGe GN3S Sampler v2 USB front-end tutorial]({{ "/docs/tutorials/sige-gn3s-sampler-v2-usb-front-end/" | relative_url }}) for an example of its usage with GNSS-SDR. |
| <span style="color: DarkOrange">&#x2011;DENABLE_FMCOMMS2</span> | <span style="color: DarkOrange">ON / OFF</span> | <span style="color: DarkOrange">OFF</span>  | <span style="color: DarkOrange">If set to ON, it enables the use of [AD-FMCOMMS2-EBZ](http://www.analog.com/en/design-center/evaluation-hardware-and-software/evaluation-boards-kits/EVAL-AD-FMCOMMS2.html), an FPGA Mezzanine Card (FMC) board for the Analog Devices' [AD9361](http://www.analog.com/en/products/rf-microwave/integrated-transceivers-transmitters-receivers/wideband-transceivers-ic/ad9361.html), a highly integrated RF transceiver. This option requires [gr-iio](https://github.com/analogdevicesinc/gr-iio) >= 0.3 already installed in your system. Specifically, the [`Fmcomms2_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-fmcomms2_signal_source" | relative_url }}) implementation of a [Signal Source]({{ "/docs/sp-blocks/signal-source/" | relative_url }}) block becomes available. </span> |
| <span style="color: DarkOrange">&#x2011;DENABLE_PLUTOSDR</span> | <span style="color: DarkOrange">ON / OFF</span> | <span style="color: DarkOrange">OFF</span>  | <span style="color: DarkOrange">If set to ON, it enables the use of [ADALM-Pluto](http://www.analog.com/en/design-center/evaluation-hardware-and-software/evaluation-boards-kits/adalm-pluto.html), a learning module based on Analog Devices' [AD9363](http://www.analog.com/en/products/rf-microwave/integrated-transceivers-transmitters-receivers/wideband-transceivers-ic/AD9363.html), a highly integrated RF agile transceiver. This option requires [gr-iio](https://github.com/analogdevicesinc/gr-iio) >= 0.3 already installed in your system. Specifically, the [`Plutosdr_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-plutosdr_signal_source" | relative_url }}) implementation of a [Signal Source]({{ "/docs/sp-blocks/signal-source/" | relative_url }}) block becomes available. </span> |
| <span style="color: DarkOrange">&#x2011;DENABLE_AD9361</span> | <span style="color: DarkOrange">ON / OFF</span> | <span style="color: DarkOrange">OFF</span>  | <span style="color: DarkOrange">If set to ON, it enables the use of signal source for Analog Devices front-end AD9361 connected directly to an FPGA processor. This option requires [libiio](https://github.com/analogdevicesinc/libiio) >= 0.14 already installed in your system. Specifically, the [`Ad9361_Fpga_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-plutosdr_signal_source" | relative_url }}) implementation of a [Signal Source]({{ "/docs/sp-blocks/signal-source/" | relative_url }}) block becomes available. </span> |
| <span style="color: DarkOrange">&#x2011;ENABLE_RAW_UDP</span> | <span style="color: DarkOrange">ON / OFF</span> | <span style="color: DarkOrange">OFF</span>  | <span style="color: DarkOrange">If set to ON, it enables the reception of IP frames containing samples in UDP frame encapsulation using a high performance packet capture library. This option requires [libpcap](https://github.com/the-tcpdump-group/libpcap) already installed in your system. Specifically, the [`Custom_UDP_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-plutosdr_signal_source" | relative_url }}) implementation of a [Signal Source]({{ "/docs/sp-blocks/signal-source/" | relative_url }}) block becomes available. </span> |
|----------

Please note that if you installed GNSS-SDR in Debian or Ubuntu through a .deb package (```sudo apt-get install gnss-sdr```), the option ```ENABLE_OSMOSDR``` is set to ON, and the required drivers are already installed.


## GPU off-loading and SIMD-related options

|----------
|  **Variable passed to CMake**  |  **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|
|--------------
| &#x2011;DENABLE_OPENCL | ON / OFF | OFF | If set to ON, it enables building of processing blocks implemented with OpenCL (experimental). Specifically, the ```GPS_L1_CA_PCPS_OpenCl_Acquisition``` implementation of an [Acquisition]({{ "/docs/sp-blocks/acquisition/" | relative_url }}) block becomes available. This option requires the [OpenCL library](https://www.khronos.org/opencl/) and a compatible Graphic Processing Unit (GPU). |
| &#x2011;DENABLE_CUDA |  ON / OFF | OFF  |  If set to ON, it enables building of processing blocks implemented with CUDA (experimental). Specifically, the ```GPS_L1_CA_DLL_PLL_Tracking_GPU``` implementation of a [Tracking]({{ "/docs/sp-blocks/tracking/" | relative_url }}) block becomes available. This option requires the [CUDA Toolkit](https://developer.nvidia.com/cuda-downloads) and a compatible Graphic Processing Unit (GPU). |
| <span style="color: DarkOrange">&#x2011;DENABLE_FPGA</span> |  <span style="color: DarkOrange">ON / OFF</span> | <span style="color: DarkOrange">OFF</span>  |  <span style="color: DarkOrange">If set to ON, it enables building of processing blocks implemented in VHDL and executed in a FGPA device (experimental).</span> |
| &#x2011;DENABLE_PROFILING |  ON / OFF | OFF  | If set to ON, it enables  automatic execution of ```volk_gnsssdr_profile``` at the end of the building process. This program tests all known [VOLK_GNSSSDR](https://github.com/gnss-sdr/gnss-sdr/tree/master/src/algorithms/libs/volk_gnsssdr_module/volk_gnsssdr) kernels (that is, basic processing components like adders, multipliers, correlators, and much more) for each SIMD architecture supported by the host machine, measuring their performance. When finished, the profiler writes to ```$HOME/.volk_gnsssdr/volk_gnsssdr_config``` the fastest implementation for each VOLK_GNSSSDR function. This file is read when using a function to know the best version to execute. |
|----------


## Binary portability and packaging options

|----------
|  **Variable passed to CMake**  |  **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|
|--------------
| &#x2011;DENABLE_GENERIC_ARCH | ON / OFF |  OFF |  If set to ON, it builds portable binaries which are non-dependent of the SIMD technologies present in the building machine. |
| &#x2011;DENABLE_PACKAGING | ON / OFF | OFF  |  If set to ON, it enables software packaging flags (for instance, it removes inessential information from executable binary programs and object files, thus potentially resulting in better performance and sometimes significantly less disk space usage) and sets automatically the variable ENABLE_GENERIC_ARCH to ON. |
| &#x2011;DENABLE_OWN_ARMADILLO | ON / OFF |  OFF |  If set to ON, it forces to download, build and link a working version of [Armadillo](http://arma.sourceforge.net/) locally, even if it is already installed. |
| &#x2011;DENABLE_OWN_GLOG | ON / OFF |  OFF | If set to ON, it forces to download, build and link a working version of [glog](https://github.com/google/glog) locally, even if it is already installed. If [GFlags](https://github.com/gflags/gflags) is not found, it will also download, build and link it.  |
| &#x2011;DENABLE_LOG | ON / OFF |  ON |  If set to OFF, it disables runtime logging with [glog](https://github.com/google/glog). This can be useful in storage-limited systems. GNSS-SDR will still produce outputs such as RINEX or KML files. |
|----------



## QA code building options

|----------
|  **Variable passed to CMake**  |  **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|
|--------------
| &#x2011;DENABLE_UNIT_TESTING | ON / OFF | ON  |  If set to OFF, it disables the building of unit tests. This can be useful in memory-limited systems. |
| &#x2011;DENABLE_UNIT_TESTING_EXTRA | ON / OFF | OFF  | If set to ON, it downloads external raw sample files and other software tools (among them, [GPSTk](http://www.gpstk.org/), if it is not already found in your system), and builds some extra unit tests that are added to the ```run_tests``` executable.  |
| &#x2011;DENABLE_SYSTEM_TESTING | ON / OFF |  OFF |  If set to ON, it builds system tests. The binary ```ttff```, a tool for Time-To-First-Fix measurement, is generated at the ```gnss-sdr/install``` folder, unless otherwise indicated by the ENABLE_INSTALL_TESTS option.  |
| &#x2011;DENABLE_SYSTEM_TESTING_EXTRA | ON / OFF | OFF  | If set to ON, it downloads external software tools (among them, [GPSTk](http://www.gpstk.org/), if it is not already found in your system) and builds some extra system tests. The generated binaries are copied to the ```gnss-sdr/install``` folder, unless otherwise indicated by the ENABLE_INSTALL_TESTS option. |
| &#x2011;DENABLE_OWN_GPSTK | ON / OFF |  OFF | If set to ON, it forces to download, build and link [GPSTk](http://www.gpstk.org/) for system tests, even if it is already installed. This can be useful if you have an old version of GPSTk already installed in your system and you do not want to remove it, but you still want the QA code to use a more recent version. |
| <span style="color: DarkOrange">&#x2011;DENABLE_INSTALL_TESTS</span> | <span style="color: DarkOrange">ON / OFF</span> |  <span style="color: DarkOrange">OFF</span> | <span style="color: DarkOrange">By default, generated test binaries are not installed system-wide but placed in the local folder ```gnss-sdr/install```. If this option is set to ON, test binaries and auxiliary files will not be copied to  ```gnss-sdr/install``` but installed in the system path when doing ```make install```.</span>  |
|----------

If all these options are set to OFF (so, ```-DENABLE_UNIT_TESTING=OFF``` in a fresh start), then [Google Test](https://github.com/google/googletest) is not a required dependency anymore.


## Performance analysis tools

Some statistical profiling tools require the software under analysis to be compiled and linked with certain profiling options enabled. GNSS-SDR provides some options for that:

|----------
|  **Variable passed to CMake**  |  **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|
|--------------
| &#x2011;DENABLE_GPERFTOOLS | ON / OFF | OFF | If set to ON, it enables linking to [gperftools](https://github.com/gperftools/gperftools) libraries (tcmalloc and profiler). This option requires gperftools to be already installed in your system. Check out [how to profile GNSS-SDR]({{ "/how-profile-code/" | relative_url }}) for more details on gperftools usage.  |
| &#x2011;DENABLE_GPROF | ON / OFF | OFF  |  If set to ON, it enables the use of the GNU profiler tool [gprof](https://sourceware.org/binutils/docs/gprof/). Specifically, it adds ```-pg``` to the list of flags passed to the compiler and the linker. If the compiler is not GNU, this option has no effect. |
|----------

--------

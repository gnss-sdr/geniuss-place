---
title: "Configuration options at building time"
permalink: /docs/tutorials/configuration-options-building-time/
excerpt:
  "Description of the available GNSS-SDR configuration options at building time."
author_profile: false
header:
  teaser: /assets/images/Cmake-logo.png
tags:
  - tutorial
sidebar:
  nav: "docs"
toc: true
toc_sticky: true
show_date: false
last_modified_at: 2025-04-01T11:07:02+02:00
---


GNSS-SDR's building process is managed by [CMake](https://cmake.org/), a
cross-platform, compiler-independent, free, and open-source software tool. CMake
supports directory hierarchies and applications that depend on multiple
libraries. It can locate executables, files, and libraries to be linked against,
generating [makefiles](https://en.wikipedia.org/wiki/Makefile) for many
platforms and IDEs (such as [Eclipse](https://www.eclipse.org),
[Codeblocks](https://www.codeblocks.org/), and
[Xcode](https://developer.apple.com/xcode/)), and liberating users from choosing
the adequate flags for their compiler. CMake is used in conjunction with native
build systems such as [make](https://en.wikipedia.org/wiki/Make_(software)),
[ninja](https://ninja-build.org/), or Apple's
[Xcode](https://en.wikipedia.org/wiki/Xcode).


CMake allows GNSS-SDR to be effortlessly built on a wide range of operating
systems and processor architectures, constituting a key tool for its
[**portability**]({{ "/design-forces/portability/" | relative_url }}).
{: .notice--info}

CMake can handle in-place and out-of-place builds, enabling several builds from
the same source tree, and
[cross-compilation](https://en.wikipedia.org/wiki/Cross_compiler). The ability
to build a directory tree outside the source tree is a key feature, ensuring
that if a build directory is removed, the source files remain unaffected. This
approach is mandatory when building GNSS-SDR, and you will get an error message
if you try an in-place build.


The `cmake` executable is the CMake command-line interface. When `cmake` is
first run in an empty build tree, it creates a `CMakeCache.txt` file and
populates it with customizable settings for the project.

Once all the required dependencies are installed in your system, the default
building process is:

```console
$ cd gnss-sdr && git checkout next
$ mkdir -p build && cd build
$ cmake ..
$ make
$ sudo make install
```

or, alternatively:

```console
$ cd gnss-sdr && git checkout next
$ cmake -S . -B build
$ cmake --build build
$ sudo cmake --install build
```

CMake's defaults and GNSS-SDR project configuration settings can be overridden
on the command line with the -D option, with the following syntax:

```console
$ cmake -D<variable_name>=<value>
```
{: class="no-copy"}

or, if you are using CMake's binary options:

```console
$ cmake -S . -B build -D<variable_name>=<value>
```

Thus, if you want to set the variable named `CMAKE_BUILD_TYPE` to the `Debug`
value, you can write in your command line:

```console
$ cmake -DCMAKE_BUILD_TYPE=Debug ..
```

You can specify any number of variables:

```console
$ cmake -DCMAKE_BUILD_TYPE=Debug -DENABLE_OSMOSDR=ON ..
```

This page documents the available GNSS-SDR configuration options at building
time.



## General CMake variables

The building system honors the usual [CMake
variables](https://cmake.org/cmake/help/latest/manual/cmake-variables.7.html).
Most relevant are:


|----------
| **Variable passed to CMake** |                                              **Possible values**                                              |                       **Default**                       | **Effect**                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :--------------------------- | :-----------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --------------               |
| `-DCMAKE_BUILD_TYPE`         | None / Debug / Release / RelWithDebInfo / MinSizeRel / Coverage / NoOptWithASM / O2WithASM / O3WithASM / ASAN |                         Release                         | A variable which controls the type of build and some of the flags passed to the compiler. The default values for these flags change with different compilers. If CMake does not know your compiler, the contents will be empty. See the [CMake documentation about this variable](https://cmake.org/cmake/help/latest/variable/CMAKE_BUILD_TYPE.html) and the note below for more details.                                                      |
| `-DCMAKE_INSTALL_PREFIX`     |                                                  System path                                                  | System-dependent. In most systems, this is `/usr/local` | Specifies the path in which GNSS-SDR will be installed when doing `make install`. The content of this variable is prepended onto all install directories. On UNIX systems, one can use the `DESTDIR` mechanism in order to relocate the whole installation (see below).                                                                                                                                                                         |
| `-DCMAKE_CXX_COMPILER`       |                                                  System path                                                  |                    System-dependent                     | Specifies a non-default C++ compiler. Example: `/usr/bin/clang++`.                                                                                                                                                                                                                                                                                                                                                                              |
| `-DCMAKE_C_COMPILER`         |                                                  System path                                                  |                    System-dependent                     | Specifies a non-default C compiler. Example: `/usr/bin/clang`.                                                                                                                                                                                                                                                                                                                                                                                  |
| `-DCMAKE_INCLUDE_PATH`       |                                                  System path                                                  |                    System-dependent                     | This is used when searching for include files *e.g.* using the `FIND_PATH()` command in the `CMakeLists.txt` files. If you have headers in non-standard locations, it may be useful to set this variable to this directory. If you need several directories, separate them by the platform-specific separators (*e.g.* ":" on UNIX).                                                                                                            |
| `-DCMAKE_LIBRARY_PATH`       |                                                  System path                                                  |                    System-dependent                     | This is used when searching for libraries *e.g.* using the `FIND_LIBRARY()` command in the `CMakeLists.txt` files. If you have libraries in non-standard locations, it may be useful to set this variable to this directory. If you need several directories, separate them by the platform-specific separators (*e.g.* ":" on UNIX).                                                                                                           |
| `-DCMAKE_PREFIX_PATH`        |                                                  System path                                                  |                    System-dependent                     | This is used when searching for include files, binaries, or libraries using either the `FIND_PACKAGE()`, `FIND_PATH()`, `FIND_PROGRAM()`, or `FIND_LIBRARY()` commands in the `CMakeLists.txt` files. For each path in the `CMAKE_PREFIX_PATH` list, CMake will check `PATH/include` and `PATH` when `FIND_PATH()` is called, `PATH/bin` and `PATH` when `FIND_PROGRAM()` is called, and `PATH/lib` and `PATH` when `FIND_LIBRARY()` is called. |
| `-DCMAKE_TOOLCHAIN_FILE`     |                                        Path to a CMake toolchain file                                         |                          None                           | This variable is specified on the command line when cross-compiling with CMake. It is the path to a file which is read early in the CMake run and which specifies locations for compilers and toolchain utilities, and other target platform and compiler related information. For an example of usage, see [cross-compiling GNSS-SDR]({{ "/docs/tutorials/cross-compiling/"                                                                    | relative_url }}). |
| `-GNinja`                    |                                                       -                                                       |                            -                            | If `-GNinja` is passed to CMake, it generates input files for [Ninja](https://ninja-build.org/), a small build system designed for speed that can be seen as a replacement for `make`. Thus, the code will be compiled by doing `ninja` in the command line after running CMake, and the program will be installed by doing `sudo ninja install`.                                                                                               |
| `-GXcode`                    |                                                       -                                                       |                            -                            | If `-GXcode` is passed to CMake, it generates a `gnss-sdr.xcodeproj` project that can be opened by [Xcode](https://developer.apple.com/xcode/).                                                                                                                                                                                                                                                                                                 |
| `-DPYTHON_EXECUTABLE`        |                                                  System path                                                  |                    System-dependent                     | Path to the Python interpreter. By default, GNSS-SDR searches for Python  >= 3.4 and, if not found, it searches for Python 2.7 at standard locations in your system. You can specify the path of the Python interpreter by setting this variable (*e.g.* `/path/to/python`).                                                                                                                                                                    |
| ----------                   |

In addition, if the `DESTDIR` environment variable is set, it will be prefixed
to `CMAKE_INSTALL_PREFIX` in places where it is used to access files during
installation. This allows the files to be installed in an intermediate directory
tree without changing the final installation path name. For instance:

```console
$ make DESTDIR=/home/carles install
```

will install the software using the installation prefix, *e.g.* `/usr/local`
prepended with the `DESTDIR` value which finally gives `/home/carles/usr/local`,
so binaries will be under `/home/carles/usr/local/bin`.

Since the value of `CMAKE_INSTALL_PREFIX` may be included in installed files, it
is important to use `DESTDIR` rather than changing `CMAKE_INSTALL_PREFIX` when
it is necessary to install to an intermediate staging directory. See a practical
example of its usage at [cross-compiling GNSS-SDR]({{
"/docs/tutorials/cross-compiling/" | relative_url }}).

The value of `CMAKE_BUILD_TYPE` determines the flags passed to the compiler. In
addition to those build types offered by CMake by default, GNSS-SDR offers other
extra build types for debugging and profiling purposes. The possible options and
the flags passed to the compiler are listed below:

 - None: nothing set
 - Debug: `-O2 -g`
 - Release: `-O3`
 - RelWithDebInfo: `-O3 -g`
 - MinSizeRel: `-Os`
 - Coverage: `-Wall -pedantic -pthread -g -O0 -fprofile-arcs -ftest-coverage`
 - NoOptWithASM: `-O0 -g -save-temps`
 - O2WithASM: `-O2 -g -save-temps`
 - O3WithASM: `-O3 -g -save-temps`
 - ASAN: `-Wall -Wextra -g -O2 -fsanitize=address -fno-omit-frame-pointer`


For more details, the [CMake official
documentation](https://cmake.org/documentation/) is home of the authoritative
guide to all CMake variables, commands, and properties.

## Optional drivers for RF front-ends

|----------
| **Variable passed to CMake** | **Possible values** | **Default** | **Effect**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :--------------------------- | :-----------------: | :---------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --------------               |
| `-DENABLE_UHD`               |    `ON` / `OFF`     |    `ON`     | If set to `ON`, it enables the use of the [USRP Hardware Driver (UHD)](https://www.ettus.com/sdr-software/uhd-usrp-hardware-driver/), a software API that supports application development on all USRP SDR products. This option requires [gr-uhd](https://github.com/gnuradio/gnuradio/tree/master/gr-uhd) already installed in your system. Specifically, the [`UHD_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-uhd_signal_source"                                                                                                                                                                                                                                                               | relative_url }}) implementation of a [Signal Source]({{ "/docs/sp-blocks/signal-source/"                              | relative_url }}) block becomes available.                                                                                                                                                                           |
| `-DENABLE_OSMOSDR`           |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables the use of [OsmoSDR](https://osmocom.org/projects/gr-osmosdr/wiki/GrOsmoSDR) and other front-ends ([RTL-based dongles](https://www.rtl-sdr.com/), [HackRF](https://greatscottgadgets.com/hackrf/), [BladeRF](https://www.nuand.com/), etc.) as a signal source. Specifically, the [`Osmosdr_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-osmosdr_signal_source"                                                                                                                                                                                                                                                                                                          | relative_url }}) and [`RtlTcp_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-rtltcp_signal_source" | relative_url }}) implementations of [Signal Source]({{ "/docs/sp-blocks/signal-source/"                                                                                                                             | relative_url }}) blocks become available. This option requires [gr-osmosdr](https://osmocom.org/projects/gr-osmosdr/wiki/GrOsmoSDR) already installed in your system.  See an example of use at the [Realtek RTL2832U USB dongle tutorial]({{ "/docs/tutorials/gnss-sdr-operation-realtek-rtl2832u-usb-dongle-dvb-t-receiver/" | relative_url }}). |
| `-DENABLE_FMCOMMS2`          |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables the use of [AD-FMCOMMS2-EBZ](https://www.analog.com/en/resources/evaluation-hardware-and-software/evaluation-boards-kits/EVAL-AD-FMCOMMS2.html), an FPGA Mezzanine Card (FMC) board for the Analog Devices' [AD9361](https://www.analog.com/en/products/ad9361.html), a highly integrated RF transceiver. This option requires [gr-iio](https://github.com/analogdevicesinc/gr-iio) >= 0.3 or the [gr-iio native GNU Radio component](https://github.com/gnuradio/gnuradio/tree/main/gr-iio) (starting from GNU Radio v3.10.1.0) already installed in your system. Specifically, the [`Fmcomms2_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-fmcomms2_signal_source" | relative_url }}) implementation of a [Signal Source]({{ "/docs/sp-blocks/signal-source/"                              | relative_url }}) block becomes available.                                                                                                                                                                           |
| `-DENABLE_PLUTOSDR`          |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables the use of [ADALM-Pluto](https://www.analog.com/en/resources/evaluation-hardware-and-software/evaluation-boards-kits/adalm-pluto.html), a learning module based on Analog Devices' [AD9363](https://www.analog.com/en/products/AD9363.html), a highly integrated RF agile transceiver. This option requires [gr-iio](https://github.com/analogdevicesinc/gr-iio) >= 0.3 or the [gr-iio native GNU Radio component](https://github.com/gnuradio/gnuradio/tree/main/gr-iio) (starting from GNU Radio v3.10.1.0) already installed in your system. Specifically, the [`Plutosdr_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-plutosdr_signal_source"                    | relative_url }}) implementation of a [Signal Source]({{ "/docs/sp-blocks/signal-source/"                              | relative_url }}) block becomes available.                                                                                                                                                                           |                                                                                                                                                                           |
| `-DENABLE_AD936X_SDR`          |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables the use of [ADALM-Pluto](https://www.analog.com/en/resources/evaluation-hardware-and-software/evaluation-boards-kits/adalm-pluto.html) boards with customized firmware via the `Ad936x_Custom_Signal_Source` signal source. |
| `-DENABLE_LIMESDR`           |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables the use of [LimeSDR](https://limemicro.com/products/boards/limesdr/). This option requires [gr-limesdr](https://github.com/myriadrf/gr-limesdr) already installed in your system. Specifically, the [`Limesdr_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-limesdr_signal_source"                                                                                                                                                                                                                                                                                                                                                                                        | relative_url }}) implementation of a [Signal Source]({{ "/docs/sp-blocks/signal-source/"                              | relative_url }}) block becomes available.                                                                                                                                                                           |
| `-DENABLE_RAW_UDP`           |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables the reception of IP frames containing samples in UDP frame encapsulation using a high-performance packet capture library. This option requires [libpcap](https://github.com/the-tcpdump-group/libpcap) already installed in your system. Specifically, the [`Custom_UDP_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-plutosdr_signal_source"                                                                                                                                                                                                                                                                                                                             | relative_url }}) implementation of a [Signal Source]({{ "/docs/sp-blocks/signal-source/"                              | relative_url }}) block becomes available.                                                                                                                                                                           |
| `-DENABLE_ZMQ`               |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables the reception of sample streams published via [ZeroMQ](https://zeromq.org/). Specifically, the [`ZMQ_Signal_Source`]({{ "/docs/sp-blocks/signal-source/#implementation-zmq_signal_source"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | relative_url }}) implementation of a [Signal Source]({{ "/docs/sp-blocks/signal-source/"                              | relative_url }}) block becomes available. |
| ----------                   |

Please note that if you installed GNSS-SDR in Debian or Ubuntu through a .deb
package (`sudo apt install gnss-sdr`), the option `ENABLE_OSMOSDR` is set to
`ON`, and the required drivers are already installed.


## FPGA / GPU off-loading and SIMD-related options

|----------
| **Variable passed to CMake** | **Possible values** | **Default** | **Effect**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :--------------------------- | :-----------------: | :---------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --------------               |
| `-DENABLE_FPGA`              |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables the building of processing blocks implemented in VHDL, which are executed on a SoC FPGA device, allowing for FPGA-based off-loading. |
| `-DENABLE_MAX2771`           |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it checks if the SPIdev driver is installed and builds the `MAX2771_EVKIT_Signal_Source_FPGA` source, which makes use of an Analog Devices' [MAX2771](https://www.analog.com/en/products/max2771.html) RF front-end connected directly to an FPGA processor. Requires `-DENABLE_FPGA=ON`.  |
| `-DENABLE_AD9361`            |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it checks if the IIO driver [libiio](https://github.com/analogdevicesinc/libiio) >= 0.14 is installed and builds the `ADRV9361_Z7035_Signal_Source_FPGA` and the `FMCOMMS5_Signal_Source_FPGA` sources, which make use of Analog Devices' [AD9361](https://www.analog.com/en/products/ad9361.html) RF front-end connected directly to an FPGA processor. Requires `-DENABLE_FPGA=ON`. |
| `-DENABLE_DMA_PROXY` |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it checks if the DMA proxy driver is installed for controlling the DMA in the FPGA and enables its usage via the `DMA_Signal_Source_FPGA` source. Requires `-DENABLE_FPGA=ON`. |
| `-DENABLE_OPENCL`            |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables the building of processing blocks implemented with OpenCL (experimental). Specifically, the `GPS_L1_CA_PCPS_OpenCl_Acquisition` implementation of an [Acquisition]({{ "/docs/sp-blocks/acquisition" | relative_url }}) block becomes available. This option requires the [OpenCL library](https://www.khronos.org/opencl/) and a compatible Graphic Processing Unit (GPU).           |
| `-DENABLE_CUDA`              |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables the building of processing blocks implemented with CUDA (experimental). Specifically, the `GPS_L1_CA_DLL_PLL_Tracking_GPU` implementation of a [Tracking]({{ "/docs/sp-blocks/tracking" | relative_url }}) block becomes available. This option requires the [CUDA Toolkit](https://developer.nvidia.com/cuda-downloads) and a compatible Graphic Processing Unit (GPU). |
| `-DENABLE_PROFILING`         |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables  automatic execution of `volk_gnsssdr_profile` at the end of the building process. This program tests all known [VOLK_GNSSSDR](https://github.com/gnss-sdr/gnss-sdr/tree/main/src/algorithms/libs/volk_gnsssdr_module/volk_gnsssdr) kernels (that is, basic processing components like adders, multipliers, correlators, and much more) for each SIMD architecture supported by the host machine, measuring their performance. When finished, the profiler writes to `$HOME/.volk_gnsssdr/volk_gnsssdr_config` the fastest implementation for each VOLK_GNSSSDR function. This file is read when using a function to know the best version to execute. |
| ----------                   |


## Binary portability and packaging options

|----------
| **Variable passed to CMake** | **Possible values** | **Default** | **Effect**                                                                                                                                                                                                                                                                                               |
| :--------------------------- | :-----------------: | :---------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --------------               |
| `-DENABLE_PACKAGING`         |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables software packaging flags (for instance, it removes inessential information from executable binary programs and object files, thus potentially resulting in better performance and sometimes significantly less disk space usage).                                             |
| `-DENABLE_OWN_ARMADILLO`     |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it forces to download, build and link a working version of [Armadillo](https://arma.sourceforge.net/) locally, even if it is already installed.                                                                                                                                           |
| `-DENABLE_ARMA_NO_DEBUG`     |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it defines the macro `ARMA_NO_DEBUG`, which disables all run-time checks, such as bounds checking, in the [Armadillo](https://arma.sourceforge.net/) library. This will result in a faster executable. This option is set automatically to `ON` if `ENABLE_PACKAGING` is `ON`.            |
| `-DENABLE_OWN_GLOG`          |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it forces to download, build and link a working version of [glog](https://github.com/google/glog) locally, even if it is already installed. If [GFlags](https://github.com/gflags/gflags) is not found, it will also download, build and link it.                                        |
| `-DENABLE_GLOG_AND_GFLAGS`          |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it forces to use Glog and GFlas, even if a valid version of Abseil is present in the system. |
| `-DENABLE_OWN_ABSEIL`          |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it forces to download, build and link a working version of [Abseil](https://github.com/abseil/abseil-cpp) locally, even if it is already installed. It supersedes `ENABLE_GLOG_AND_GFLAGS` and `ENABLE_OWN_GLOG`. Requires CMake >= 3.24. |
| `-DENABLE_LOG`               |    `ON` / `OFF`     |    `ON`     | If set to `OFF`, it disables runtime logging. This can be useful in storage-limited systems. GNSS-SDR will still produce outputs such as RINEX or KML files.                                                                                                 |
| `-DENABLE_GNUTLS`             |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it forces linking against GnuTLS instead of OpenSSL. |
| `-DENABLE_STRIP`             |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it activates the generation of stripped binaries (without debugging information), smaller in size and potentially providing better performance than non-stripped counterparts. Only valid when using the `Release` build mode and `ENABLE_PACKAGING` is set to `OFF`, otherwise ignored. |
| `-DENABLE_CPUFEATURES`       |    `ON` / `OFF`     |    `ON`     | The building makes use of the `cpu_features` library unless this option is set to `OFF`.                                                                                                                                                                                                                 |
| ----------                   |



## QA code building options

|----------
| **Variable passed to CMake**    | **Possible values** | **Default** | **Effect**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :------------------------------ | :-----------------: | :---------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --------------                  |
| `-DENABLE_UNIT_TESTING`         |    `ON` / `OFF`     |    `ON`     | If set to `OFF`, it disables the building of unit tests. This can be useful in memory-limited systems.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `-DENABLE_UNIT_TESTING_MINIMAL` |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it builds a minimal subset of unit tests. This can be useful in memory-limited systems.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `-DENABLE_UNIT_TESTING_EXTRA`   |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it downloads external raw sample files and other software tools (among them, [GNSSTk](https://github.com/SGL-UT/gnsstk/), if it is not already found in your system), and builds some extra unit tests that are added to the `run_tests` executable.                                                                                                                                                                                                                                                             |
| `-DENABLE_SYSTEM_TESTING`       |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it builds system tests. The binary `ttff`, a tool for Time-To-First-Fix measurement, is generated at the `gnss-sdr/install` folder, unless otherwise indicated by the `ENABLE_INSTALL_TESTS` option.                                                                                                                                                                                                                                                                                                             |
| `-DENABLE_SYSTEM_TESTING_EXTRA` |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it downloads external software tools (among them, [GNSSTk](https://github.com/SGL-UT/gnsstk/), if it is not already found in your system) and builds some extra system tests. The generated binaries are copied to the `gnss-sdr/install` folder, unless otherwise indicated by the `ENABLE_INSTALL_TESTS` option.                                                                                                                                                                                               |
| `-DENABLE_OWN_GPSTK`            |    `ON` / `OFF`      |    `OFF`     | If set to ON, it forces to download, build and link [GPSTk](https://github.com/SGL-UT/gnsstk/) for system tests, even if it is already installed. This can be useful if you have an old version of GPSTk (older than 2.10) already installed in your system and you do not want to remove it, but you still want the QA code to use a more recent version. NOTE: This option is DEPRECATED, in favour of `-DENABLE_OWN_GNSSTK`.                                           |
| `-DENABLE_OWN_GNSSTK`           |     `ON` / `OFF`      |    `OFF`      | If set to ON, it forces to download, build and link [GNSSTk](https://github.com/SGL-UT/gnsstk/) for system tests, even if it is already installed. This can be useful if you have an old version of GPSTk (older than 2.10) already installed in your system and you do not want to remove it, but you still want the QA code to use a recent version. |
| `-DENABLE_BENCHMARKS`           |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables the building of benchmarks for small code snippets, based on the [Benchmark](https://github.com/google/benchmark) library. It requires CMake > 3.5.1.                                                                                                                                                                                                                                                                                                                                                 |
| `-DENABLE_INSTALL_TESTS`        |    `ON` / `OFF`     |    `OFF`    | By default, generated test binaries are not installed system-wide but placed in the local folder `gnss-sdr/install`. If this option is set to `ON`, test binaries and auxiliary files will not be copied to `gnss-sdr/install` but installed in the system path when doing `make install`.                                                                                                                                                                                                                                       |
| ----------                      |

If all these options are set to `OFF` (so, `-DENABLE_UNIT_TESTING=OFF` in a
fresh start), then [Google Test](https://github.com/google/googletest) is not a
required dependency anymore.


## Performance analysis tools

Some statistical profiling tools require the software under analysis to be
compiled and linked with certain profiling options enabled. GNSS-SDR provides
some options for that:

|----------
| **Variable passed to CMake** | **Possible values** | **Default** | **Effect**                                                                                                                                                                                                                                                          |
| :--------------------------- | :-----------------: | :---------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| --------------               |
| `-DENABLE_GPERFTOOLS`        |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables linking to [gperftools](https://github.com/gperftools/gperftools) libraries (tcmalloc and profiler). This option requires gperftools to be already installed in your system. Check out [how to profile GNSS-SDR]({{ "/how-profile-code/" | relative_url }}) for more details on gperftools usage. |
| `-DENABLE_GPROF`             |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, it enables the use of the GNU profiler tool [gprof](https://sourceware.org/binutils/docs/gprof/). Specifically, it adds `-pg` to the list of flags passed to the compiler and the linker. If the compiler is not GNU, this option has no effect.    |
| ----------                   |


## Static analysis

[clang-tidy](https://clang.llvm.org/extra/clang-tidy/) is a clang-based C++
"linter" tool. Its purpose is to provide an extensible framework for diagnosing
and fixing typical programming errors, like style violations, interface misuse,
or bugs that can be deduced via static analysis.

|----------
| **Variable passed to CMake** | **Possible values** | **Default** | **Effect**                                                                                                                                                                                                                                                                                                                                                                                                     |
| :--------------------------- | :-----------------: | :---------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --------------               |
| `-DENABLE_CLANG_TIDY`        |    `ON` / `OFF`     |    `OFF`    | If set to `ON`, clang-tidy is executed along with compilation, performing the checks defined in the [.clang-tidy](https://github.com/gnss-sdr/gnss-sdr/blob/next/.clang-tidy) file and applying fixes into the source code, when available. After compilation completion, please check your source tree with `git status` and `git diff` to review the applied changes and, if you agree, add and commit them. |
| ----------                   |

Please note that you can also use the `run-clang-tidy` script (called
`run-clang-tidy.py` in some platforms) to perform checks over all files in the
compilation database:

```console
$ run-clang-tidy -checks='-*,modernize-use-nullptr' -fix
```

You can examine the full [list of clang-tidy
checks](https://clang.llvm.org/extra/clang-tidy/checks/list.html) and their
definitions.

In Debian and Ubuntu machines, clang-tidy can be installed with:

```console
$ sudo apt install clang clang-tidy
```

Example of usage:
```console
$ cmake -DCMAKE_CXX_COMPILER=/usr/bin/clang++ \
        -DCMAKE_C_COMPILER=/usr/bin/clang \
        -DENABLE_CLANG_TIDY=ON ..
$ make        
```

Check the [coding style guide]({{ "/coding-style/#use-code-linters" |
relative_url }}) for more information on how to use clang-tidy in your system.


## Documentation

GNSS-SDR can generate documentation from its source code in HTML (by doing `make
doc`) or PDF (by doing `make pdfmanual`) formats. Generating the documentation
requires [Doxygen](https://www.doxygen.nl/) installed in your system. The PDF
generation also requires $$ \LaTeX $$ already installed.

By default, the HTML output makes use of [MathJax](https://www.mathjax.org/)
loaded from a public <abbr title="Content Delivery Network">CDN</abbr> for
equations rendering in your browser, so you do not need to have MathJax locally
installed. If you want to enjoy MathJax rendering in offline mode, you can use a
local installation of MathJax (version 2.x) by disabling the option below.

|----------
| **Variable passed to CMake** | **Possible values** | **Default** | **Effect**                                                                                                                                                                                                                                                                                                                          |
| :--------------------------- | :-----------------: | :---------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --------------               |
| `-DENABLE_EXTERNAL_MATHJAX`  |    `ON` / `OFF`     |    `ON`     | If set to `ON`, doing `make doc` generates HTML documentation using MathJax loaded from an external public CDN. If this option is set to `OFF`, MathJax is looked for in the system and used if found, so the documentation can be checked offline. If MathJax is not found, equations will still be rendered but at lower quality. |
| ----------                   |

For instance, in Debian/Ubuntu systems MathJax can be installed as:

```console
$ sudo apt install libjs-mathjax
```

--------

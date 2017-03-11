---
title: "Configuration options at building time"
permalink: /docs/tutorials/configuration-options-building-time/
excerpt: "Description of the available GNSS-SDR configuration options at bulding time."
author_profile: false
header:
  teaser: /assets/images/Cmake-logo.png
tags:
  - tutorial
sidebar:
  nav: "docs"
modified: 2017-03-07T09:37:02+02:00
---

{% include toc %}

GNSS-SDR's building system is based on [CMake](https://cmake.org/), a cross-platform, free and open-source software for managing the build process of software using a compiler-independent method. CMake supports directory hierarchies and applications that depend on multiple libraries.  It can locate executables, files, and libraries to be linked against, generating [makefiles](https://en.wikipedia.org/wiki/Makefile) for many platforms and IDEs (such as [Eclipse](http://www.eclipse.org), [Codeblocks](http://www.codeblocks.org/) and [Xcode](https://developer.apple.com/xcode/)), and liberating users from choosing the adequate flags for their compiler. CMake is used in conjunction with native build environments such as [make](https://en.wikipedia.org/wiki/Make_(software)) or Apple's [Xcode](https://en.wikipedia.org/wiki/Xcode).


CMake allows GNSS-SDR to be effortlessly built in a wide range of operating systems and processor architectures, constituting a key tool for its [**portability**]({{ "/design-forces/portability/" | absolute_url }}).
{: .notice--info}

CMake can handle in-place and out-of-place builds, enabling several builds from the same source tree, and [cross-compilation](https://en.wikipedia.org/wiki/Cross_compiler). The ability to build a directory tree outside the source tree is a key feature, ensuring that if a build directory is removed, the source files remain unaffected. This approach is highly recommended when building GNSS-SDR, and you will get a warning message if you try an in-place build.


The ```cmake``` executable is the CMake command-line interface. When ```cmake``` is first run in an empty build tree, it creates a ```CMakeCache.txt``` file and populates it with customizable settings for the project.

Once all the required dependencies are installed in your system, the default building process is:

    $ cd gnss-sdr/build
    $ cmake ..
    $ make
    $ sudo make install

CMake's defaults and GNSS-SDR project configuration settings can be overridden on the command line with the -D option, with the following syntax:

    cmake -D<var>=<value>

Thus, if you want to set the variable named ```CMAKE_BUILD_TYPE``` to the ```Debug``` value, you can write in your command line:

    $ cmake -DCMAKE_BUILD_TYPE=Debug ..

You can specify any number of variables:

    $ cmake -DCMAKE_BUILD_TYPE=Debug -DENABLE_OSMOSDR=ON ..


This page documents the available GNSS-SDR configuration options at bulding time.


## General CMake variables

The building system honors the usual [CMake variables](https://cmake.org/cmake/help/latest/manual/cmake-variables.7.html). Most relevant are:


|----------
|  **Variable passed to CMake**  |  **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|   
|--------------
| &#x2011;DCMAKE_BUILD_TYPE |  None / Debug / Release / RelWithDebInfo / MinSizeRel | Release | A variable which controls the type of build and some of the flags passed to the compiler. The default values for these flags change with different compilers. If CMake does not know your compiler, the contents will be empty. See the [CMake documentation](https://cmake.org/cmake/help/v3.0/variable/CMAKE_BUILD_TYPE.html) for more details. |
| &#x2011;DCMAKE_INSTALL_PREFIX | System path | System-dependant. In most systems, this use to be ```/usr``` or ```/usr/local```. | Specifies the path in which GNSS-SDR will be installed when doing ```make install```.   |
| &#x2011;DCMAKE_INCLUDE_PATH  | System path | System-dependant. | This is used when searching for include files *e.g.* using the FIND_PATH() command in the CMakeLists.txt files. If you have headers in non-standard locations, it may be useful to set this variable to this directory. If you need several directories, separate them by the platform specific separators (*e.g.* ":" on UNIX). |
| &#x2011;DCMAKE_LIBRARY_PATH  | System path | System-dependant. | This is used when searching for libraries *e.g.* using the FIND_LIBRARY() command in the CMakeLists.txt files. If you have libraries in non-standard locations, it may be useful to set this variable to this directory. If you need several directories, separate them by the platform specific separators (*e.g.* ":" on UNIX). |
| &#x2011;DCMAKE_PREFIX_PATH  | System path | System-dependant. | This is used when searching for include files, binaries, or libraries using either the FIND_PACKAGE(), FIND_PATH(), FIND_PROGRAM(), or FIND_LIBRARY() commands in the CMakeLists.txt files. For each path in the CMAKE_PREFIX_PATH list, CMake will check "PATH/include" and "PATH" when FIND_PATH() is called, "PATH/bin" and "PATH" when FIND_PROGRAM() is called, and "PATH/lib" and "PATH" when FIND_LIBRARY() is called. |
| &#x2011;DCMAKE_TOOLCHAIN_FILE |  Path to a CMake toolchain file  | None | This variable is specified on the command line when cross-compiling with CMake. It is the path to a file which is read early in the CMake run and which specifies locations for compilers and toolchain utilities, and other target platform and compiler related information. For an example of usage, see [cross-compiling GNSS-SDR]({{ "/docs/tutorials/cross-compiling/" | absolute_url }}). |
|----------

In addition, if the ```DESTDIR``` environment variable is set, it will be prefixed to ```CMAKE_INSTALL_PREFIX``` in places where it is used to access files during installation. This allows the files to be installed in an intermediate directory tree without changing the final installation path name. Since the value of ```CMAKE_INSTALL_PREFIX``` may be included in installed files it is important to use ```DESTDIR``` rather than changing ```CMAKE_INSTALL_PREFIX``` when it is necessary to install to a intermediate staging directory. See an example of its usage at [cross-compiling GNSS-SDR]({{ "/docs/tutorials/cross-compiling/" | absolute_url }}).

For more details, the [CMake official documentation](https://cmake.org/documentation/) is home of the authoritative guide to all CMake variables, commands, and properties.

## Optional drivers for RF front-ends

|----------
|  **Variable passed to CMake**  |  **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|   
|--------------
| &#x2011;DENABLE_OSMOSDR | ON / OFF | OFF  | If set to ON, it enables the use of [OsmoSDR](http://sdr.osmocom.org/trac/) and other front-ends ([RTL-based dongles](http://www.rtl-sdr.com/), [HackRF](https://greatscottgadgets.com/hackrf/), [BladeRF](http://nuand.com), etc.) as a signal source. Specifically, the ```Osmosdr_Signal_Source``` and ```RtlTcp_Signal_Source``` implementations of [Signal Source]({{ "/docs/sp-blocks/signal-source/" | absolute_url }}) blocks become available. This option requires [gr-osmosdr](http://osmocom.org/projects/sdr/wiki/GrOsmoSDR) already installed in your system.  |
| &#x2011;DENABLE_GN3S | ON / OFF | OFF  |  If set to ON, it enables the use of the GN3S dongle as signal source (experimental). Specifically, the ```Gn3sSignalSource``` implementation of a [Signal Source]({{ "/docs/sp-blocks/signal-source/" | absolute_url }}) block becomes available. This option requires [gr-gn3s](https://github.com/gnss-sdr/gr-gn3s) already installed in your system. |
|----------

Please note that if you installed GNSS-SDR in Debian or Ubuntu through a .deb package (```sudo apt-get install gnss-sdr```), the option ENABLE_OSMOSDR is set to ON, and the required drivers are automatically installed.

## Performance analysis tools

|----------
|  **Variable passed to CMake**  |  **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|   
|--------------
| &#x2011;DENABLE_GPERFTOOLS | ON / OFF | OFF | If set to ON, it enables linking to [Gperftools](https://github.com/gperftools/gperftools) libraries (tcmalloc and profiler). This option requires Gperftools to be already installed in your system.  |
| &#x2011;DENABLE_GPROF | ON / OFF | OFF  |  If set to ON, it enables the use of the GNU profiler tool [gprof](https://en.wikipedia.org/wiki/Gprof).  |
|----------

## GPU off-loading and SIMD-related options

|----------
|  **Variable passed to CMake**  |  **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|   
|--------------
| &#x2011;DENABLE_OPENCL | ON / OFF | OFF | If set to ON, it enables building of processing blocks implemented with OpenCL (experimental). Specifically, the ```GPS_L1_CA_PCPS_OpenCl_Acquisition``` implementation of an [Acquisition]({{ "/docs/sp-blocks/acquisition/" | absolute_url }}) block becomes available. This option requires the [OpenCL library](https://www.khronos.org/opencl/) and a compatible Graphic Processing Unit (GPU). |
| &#x2011;DENABLE_CUDA |  ON / OFF | OFF  |  If set to ON, it enables building of processing blocks implemented with CUDA (experimental). Specifically, the ```GPS_L1_CA_DLL_PLL_Tracking_GPU``` implementation of a [Tracking]({{ "/docs/sp-blocks/tracking/" | absolute_url }}) block becomes available. This option requires the [CUDA Toolkit](https://developer.nvidia.com/cuda-downloads) and a compatible Graphic Processing Unit (GPU). |
| <span style="color: DarkOrange">&#x2011;DENABLE_FPGA</span> |  <span style="color: DarkOrange">ON / OFF</span> | <span style="color: DarkOrange">OFF</span>  |  <span style="color: DarkOrange">If set to ON, it enables building of processing blocks implemented in VHDL and executed in a FGPA device (experimental).</span> |
| &#x2011;DENABLE_PROFILING |  ON / OFF | OFF  | If set to ON, it enables  automatic execution of ```volk_gnsssdr_profile``` at the end of the building process. |
|----------


## Binary portability and packaging options

|----------
|  **Variable passed to CMake**  |  **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|   
|--------------
| &#x2011;DENABLE_GENERIC_ARCH | ON / OFF |  OFF |  If set to ON, it builds portable binaries which are non-dependant of the SIMD technologies present in the building machine. |
| &#x2011;DENABLE_PACKAGING | ON / OFF | OFF  |  If set to ON, it enables software packaging flags (for instance, it removes inessential information from executable binary programs and object files, thus potentially resulting in better performance and sometimes significantly less disk space usage) and sets automatically the variable ENABLE_GENERIC_ARCH to ON. |
| &#x2011;DENABLE_OWN_GLOG | ON / OFF |  OFF | If set to ON, it forces to download, build and link a working version of [glog](https://github.com/google/glog) locally, even if it is already installed. If [GFlags](https://github.com/gflags/gflags) is not found, it will also download, build and link it.  |
| &#x2011;DENABLE_OWN_ARMADILLO | ON / OFF |  OFF |  If set to ON, it forces to download, build and link a working version of [Armadillo](http://arma.sourceforge.net/) locally, even if it is already installed. |
| &#x2011;DENABLE_LOG | ON / OFF |  ON |  If set to OFF, it disables runtime logging with [glog](https://github.com/google/glog). This can be useful in storage-limited systems. GNSS-SDR will still produce outputs such as RINEX or KML files. |
|----------



## QA code building options

|----------
|  **Variable passed to CMake**  |  **Possible values** | **Default** | **Effect** |
|:--|:-:|:-:|:--|   
|--------------
| &#x2011;DENABLE_UNIT_TESTING | ON / OFF | ON  |  If set to OFF, it disables the building of unit tests. This can be useful in memory-limited systems. |
| &#x2011;DENABLE_UNIT_TESTING_EXTRA | ON / OFF | OFF  | If set to ON, it downloads external raw sample files files and other software tools (among them, [GPSTk](http://www.gpstk.org/), if it is not already found in your system), and builds some extra unit tests.  |
| &#x2011;DENABLE_SYSTEM_TESTING | ON / OFF |  OFF |  If set to ON, it builds system tests. The binary ```ttff```, a tool for Time-To-First-Fix measurement, is generated at the ```gnss-sdr/install``` folder, unless otherwise indicated by the ENABLE_INSTALL_TESTS option.  |
| &#x2011;DENABLE_SYSTEM_TESTING_EXTRA | ON / OFF | OFF  | If set to ON, it downloads external software tools (among them, [GPSTk](http://www.gpstk.org/), if it is not already found in your system) and builds some extra system tests.  |
| &#x2011;DENABLE_OWN_GPSTK | ON / OFF |  OFF | If set to ON, it forces to download, build and link [GPSTk](http://www.gpstk.org/) for system tests, even if it is already installed. This can be useful if you have an old version of GPSTk already installed in your system and you do not want to remove it, but you still want the QA code to use a more recent version. |
| <span style="color: DarkOrange">&#x2011;DENABLE_INSTALL_TESTS</span> | <span style="color: DarkOrange">ON / OFF</span> |  <span style="color: DarkOrange">OFF</span> | <span style="color: DarkOrange">By default, generated test binaries are not installed system-wide but placed in the local folder ```gnss-sdr/install```. If this option is set to ON, test binaries and auxiliary files will not be copied to  ```gnss-sdr/install``` but installed in the system path when doing ```make install```.</span>  |
|----------

If all these options are set to OFF (so, ```-DENABLE_UNIT_TESTING=OFF``` in a fresh start), then [Google Test](https://github.com/google/googletest) is not a required dependency anymore.

--------


**NOTE**: Options in orange are currently available only in the ```next``` branch of GNSS-SDR, and will be part of the next release. More info on how to access the ```next``` branch can be found in our brief [Git tutorial]({{ "/docs/tutorials/using-git/" | absolute_url }}).
{: .notice--warning}

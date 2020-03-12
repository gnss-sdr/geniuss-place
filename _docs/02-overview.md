---
title: "Overview"
permalink: /docs/overview/
excerpt: "A brief introduction to GNSS-SDR, a free and open source Global Navigation Satellite System software-defined receiver."
header:
  teaser: /assets/images/what-is-gnss-sdr.jpg
last_modified_at: 2017-08-11T05:34:02+02:00
redirect_from:
  - /documentation/general-overview
  - /project
---

![What is GNSS-SDR]({{ "/assets/images/what-is-gnss-sdr.jpg" | relative_url }})
{: style="text-align: center;"}

GNSS-SDR is an open source project that implements a global navigation satellite system software defined receiver in C++. With GNSS-SDR, users can build a GNSS software receiver by creating a graph where the nodes are signal processing blocks and the lines represent the data flow between them. The software provides an interface to different suitable RF front-ends and implements all the receiver’s chain up to the navigation solution. Its design allows any kind of customization, including interchangeability of signal sources, signal processing algorithms, interoperability with other systems, output formats, and offers interfaces to all the intermediate signals, parameters and variables.

The goal is to provide efficient and truly reusable code, easy to read and maintain, with fewer bugs, and producing highly optimized executables in a variety of hardware platforms and operating systems. In that sense, the challenge consists of defining a gentle balance between level of abstraction and performance, addressing:

 * Concurrency (take advantage of multicore processors).
 * Efficiency (take advantage of the specific processor architecture).
 * Performance (and how to measure it!).
 * Portability (should live in a complex, dynamic ecosystem of operating systems and processor architectures).
 * Ability to run in real-time or in post-processing (real-time is only for the chosen ones).
 * Extendibility (easy addition and test of new algorithms and implementations).

The proposed software receiver runs in a common personal computer and provides interfaces through USB and Ethernet buses to a variety of either commercially available or custom-made RF front-ends, adapting the processing algorithms to different sampling frequencies, intermediate frequencies and sample resolutions. It also can process raw data samples stored in a file. The software performs signal acquisition and tracking of the available satellite signals, decodes the navigation message and computes the observables needed by positioning algorithms, which ultimately compute the navigation solution. It is designed to facilitate the inclusion of new signal processing techniques, offering an easy way to measure their impact in the overall receiver performance. Testing of all the processes is conducted both by the systematic functional validation of every single software block and by experimental validation of the complete receiver using both real and synthetic signals. The processing output can be stored in Receiver Independent Exchange Format ([RINEX](https://en.wikipedia.org/wiki/RINEX)), used by most geodetic processing software for GNSS, or transmitted as RTCM 3.2 messages through a TCP/IP server in real-time. Navigation results are stored in [KML](https://www.opengeospatial.org/standards/kml) and [GeoJSON](https://geojson.org/) formats.


![](https://raw.githubusercontent.com/gnss-sdr/gnss-sdr/master/docs/doxygen/images/GeneralBlockDiagram.png)
{: style="text-align: center; width: 800px;"}


A GNSS software receiver is a complex system, which description needs to be addressed at different abstraction layers. Hereafter, we describe the software architecture implemented in GNSS-SDR, which is based on [GNU Radio](https://www.gnuradio.org), a well-established framework that provides the signal processing runtime and processing blocks to implement software radio applications.

Frameworks are a special case of software libraries. They are reusable abstractions of code wrapped in a well-defined API, yet they contain some key distinguishing features that separate them from normal libraries: the overall program’s flow of control is not dictated by the caller, but by the framework; and it can be extended by the user usually by selective overriding or specialized by user code providing specific functionality. Software frameworks aim to facilitate software development by allowing designers and programmers to devote their time to meeting software requirements rather than dealing with the more standard low-level details of providing a working system, thereby reducing overall development time. GNSS-SDR proposes a software architecture that builds upon the [GNU Radio](https://www.gnuradio.org) framework in order to implement a GNSS software-defined receiver.
{: .notice--info}

The view from ten thousand meters is as follows:

* **The Control Plane** is in charge of creating a _flow graph_ in which a sample stream goes through a network of connected signal processing blocks up to the position fix. The nature of a GNSS receiver imposes some requirements in the architecture design: since the composition of the received GNSS signals will change over time (initially, some satellites will be visible, and after a while, some satellites will not be visible anymore and new ones will show up), some channels will lose track of their signals and some new channels will have to be instantiated to process the new signals. This means that the receiver must be able to activate and deactivate the channels dynamically, and it also needs to detect these changes during runtime. Section [Control Plane]({{ "/docs/control-plane/" | relative_url }}) describes how this is implemented in GNSS-SDR.
* **The Signal Processing Plane**, consisting of a collection of blocks that actually implement digital signal processing algorithms. Efficiency is specially critical before and during correlations (the most complex operation in terms of processing load, but from which sample rate decreases three orders of magnitude), and even a modern multi-purpose processor must be properly programmed in order to attain real-time. Section [Signal Processing Blocks]({{ "/docs/sp-blocks/" | relative_url }}) describes actual signal processing implementations in GNSS-SDR.


Watching it more closely, GNSS-SDR is a C++ program. When running, it reads samples from a _Signal Source_ (an abstract concept that can represent a radio frequency front-end, or a file, or a combination of them) of GNSS signals, and performs all the signal processing up to the computation of a position fix.

As in any C++ program, the ```main``` method is called at program start up, after initialization of the non-local objects with static storage duration. It is the designated entry point to a program that is executed in a hosted environment (that is, with an operating system). An excerpt of such ```main``` method (its actual implementation is at [gnss-sdr/src/main/main.cc](https://github.com/gnss-sdr/gnss-sdr/blob/master/src/main/main.cc)) is as follows:

```cpp
int main(int argc, char** argv)
{
    // Parse command line flags
    google::ParseCommandLineFlags(&argc, &argv, true);

    // Say hello
    std::cout << "Initializing GNSS-SDR v" << GNSS_SDR_VERSION
              << " ... Please wait." << std::endl;

    // Logging library initialization
    google::InitGoogleLogging(argv[0]);

    // Smart pointer to a ControlThread object
    std::unique_ptr<ControlThread> control_thread(new ControlThread());

    // record startup time
    std::chrono::time_point<std::chrono::system_clock> start, end;
    start = std::chrono::system_clock::now();

    // run the software receiver until it stops
    try
    {
        control_thread->run();
    }
    catch( ... )
    {
        // ...
    }

    // report the elapsed time
    end = std::chrono::system_clock::now();
    std::chrono::duration<double> elapsed_seconds = end - start;
    std::cout << "Total GNSS-SDR run time: "
              << elapsed_seconds.count()
              << " [seconds]" << std::endl;

    // Say goodbye
    google::ShutDownCommandLineFlags();
    std::cout << "GNSS-SDR program ended." << std::endl;
    return 0;
}
```

GNSS-SDR's ```main``` method processes the command line flags, if any, provided by the user, and initializes the logging library. Then, it records the starting time and instantiates a smart pointer to a ```ControlThread``` object. Its constructor reads the configuration file, creates a control queue and creates a flow graph according to the configuration. Then, the program's main method calls the ```run()``` method of the instantiated object, an action that connects the flow graph and starts running it. After that, and until a ```stop``` message generated by some processing block is received, it reads control messages sent by the receiver's modules through a safe-thread queue and processes them. Finally, when a ```stop``` message is actually received, the main method reports the execution time, does some clean up and exits the program. The destructor of the ```ControlThread``` object, which deallocates memory, is automatically executed at the end of the method.

Hence, all the magic happens when we call the ```run()``` method of an instantiation of a  ```ControlThread``` object. If you are impatient to see what this method does, you can jump to the [Control Plane]({{ "/docs/control-plane/" | relative_url }}) section. Before that, however, we highly recommend going through the [Fundamentals]({{ "/docs/fundamentals/" | relative_url }}) section, which describes GNSS-SDR's internal software architecture and underlying key concepts.


<link rel="prerender" href="{{ "/docs/fundamentals/" | relative_url }}">

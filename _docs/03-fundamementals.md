---
title: "Fundamentals"
permalink: /docs/fundamentals/
excerpt: "Fundamentals"
modified: 2016-04-13T15:54:02-04:00
---

A GNSS software receiver is a complex system, which description needs to be addressed at different abstraction layers. Hereafter we describe the software architecture implemented in GNSS-SDR, that is based on [GNU Radio](http://gnuradio.org){:target="_blank"}, a well-established framework that provides the signal processing runtime and processing blocks to implement software radio applications. Frameworks are a special case of software libraries -- they are reusable abstractions of code wrapped in a well-defined API, yet they contain some key distinguishing features that separate them from normal libraries: the overall program’s flow of control is not dictated by the caller, but by the framework; and it can be extended by the user usually by selective overriding or specialized by user code providing specific functionality. Software frameworks aim to facilitate software development by allowing designers and programmers to devote their time to meeting software requirements rather than dealing with the more standard low-level details of providing a working system, thereby reducing overall development time. GNSS-SDR proposes a software architecture that builds upon the GNU Radio framework in order to implement a GNSS receiver.

The view from ten thousand meters is as follows:

* **The Control Plane** is in charge of creating a _flow graph_ in which a sample stream goes through a network of connected signal processing blocks up to the position fix. The nature of a GNSS receiver imposes some requirements in the architecture design: since the composition of the received GNSS signals will change over time (initially, some satellites will be visible, and after a while, some satellites will not be visible anymore and new ones will show up), some channels will lose track of their signals and some new channels will have to be instantiated to process the new signals. This means that the receiver must be able to activate and deactivate the channels dynamically, and it also needs to detect these changes during runtime. Section [Control Plane]({{ site.url }}{{ site.baseurl }}/docs/control-plane/){:target="_blank"} describes how this is implemented in GNSS-SDR.
* **The Signal Processing Plane**, consisting of a collection of blocks that actually implement digital signal processing algorithms. Efficiency is specially critical before and during correlations (the most complex operation in terms of processing load, but from which sample rate decreases three orders of magnitude), and even a modern multi-purpose processor must be properly programmed in order to attain real-time. Section [Signal Processing Blocks]({{ site.url }}{{ site.baseurl }}/docs/sp-blocks/){:target="_blank"} describes how signal processing is implemented in GNSS-SDR.


Watching it more closely, GNSS-SDR is a C++ program. When running, it reads samples from a _Signal Source_ (an abstract concept that can represent a radio frequency front-end, or a file, or a combination of them) of GNSS signals, and performs all the signal processing up to the computation of a position fix.

As in any C++ program, the ```main``` method is called at program start up, after initialization of the non-local objects with static storage duration. It is the designated entry point to a program that is executed in a hosted environment (that is, with an operating system).

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
    struct timeval tv;
    gettimeofday(&tv, NULL);
    long long int begin = tv.tv_sec * 1000000 + tv.tv_usec;

    // run the software receiver
    try
    {
        control_thread->run();
    }
    catch( ... )
    {
        // ...
    }

    // report the elapsed time
    gettimeofday(&tv, NULL);
    long long int end = tv.tv_sec * 1000000 + tv.tv_usec;
    std::cout << "Total GNSS-SDR run time "
              << (static_cast<double>(end - begin)) / 1000000.0
              << " [seconds]" << std::endl;

    // Say goodbye
    google::ShutDownCommandLineFlags();
    std::cout << "GNSS-SDR program ended." << std::endl;
}
```

GNSS-SDR's ```main``` method processes the command line flags, if any, provided by the user, and initializes the logging library. Then, it records the starting time   and instantiates a ```ControlThread``` object. Its constructor reads the configuration file, creates a control queue and creates a flow graph according to the configuration. Then, the program's main method calls the ```run()``` method of the instantiated object, an action that connects the flow graph and starts running it. After that, and until a ```stop``` message generated by some processing block is received, it reads control messages sent by the receiver's modules through a safe-thread queue and processes them. Finally, when a ```stop``` message is actually received, the main method executes the destructor of the ```ControlThread``` object, which deallocates memory, does other cleanup and exits the program.

---
title: "How to profile the code"
excerpt: "This tutorial describes what is probably one of the cheapest ways for experimenting with real-life signals and GNSS-SDR."
author_profile: false
header:
  teaser: Rtlsdr_with_lna_patch_GA27.jpg
tags:
  - news
---

Profiling is a dynamic program analysis that measures the usage of memory, the usage of particular instructions, and frequency and duration of function calls during the execution. It is important for identifying computational bottlenecks, and helps the developers to focus their optimization efforts by spotting the critical sections of code. We suggest the use of a couple of open source tools for software profiling that use different techniques, in the hope of taking advantage of their complementary nature and obtain a better insight about how the code is performing.

## Statistical profilers

GNSS-SDR can use [gperftools](https://github.com/gperftools/gperftools){:target="_blank"}, a set of performance analysis tools for multi-threaded application developments in C++. Gperftools includes a high-performance, multi-threaded memory allocation implementation called thread-caching malloc (tcmalloc), plus a CPU profiler (measures CPU time consumption), a heap profiler (measures memory usage) and heap checker (detects memory leaks).

A cool feature of these tools is that they are non code-intrusive, in the sense that they do not require modifications in the source code. In fact, the CPU profiler, the heap checker, and the heap profiler will remain inactive, using no memory or CPU, until you turn them on by defining certain environment variables.

In order to build GNSS-SDR with the appropriate compiler flags required by gperftools, configure it with the flag `ENABLE_GPERFTOOLS` enabled:

```
cmake -DENABLE_GPERFTOOLS=ON .. && make && sudo make install
```


### CPU Profiling

A profiler needs to record what functions were invoked and how many times it took to execute a function. The simplest way of obtaining this data is sampling. When using this method, a profiler interrupts program execution at specified intervals and logs the state of program's call stack.  Thus, when we define the `CPUPROFILE` variable and run the program, the profiling library will periodically pause the program, take a peak at its stack to see what functions are on the stack, making a note of this, and then returning to the program. This Monte-Carlo style analysis provides with an estimate of where the code is spending its time, without adding the overhead of forcing every function to track its own time usage.

```
$ CPUPROFILE=/tmp/gnss-sdr-cpu.prof /path/to/gnss-sdr
```

And a graphical output of the analysis can be invoked by:

```
$ pprof --gv /path/to/gnss-sdr /tmp/gnss-sdr-cpu.prof
```

You can display a larger fraction of nodes (procedures) and edges (caller to callee relationships) by doing:

```
$ CPUPROFILE_FREQUENCY=100000000000 CPUPROFILE=/tmp/gnss-sdr-cpu.prof /path/to/gnss-sdr
$ pprof --gv --nodefraction=0.000000000001 --edgefraction=0.000000000001 ./gnss-sdr /tmp/gnss-sdr-cpu.prof
```

Please see more details on fine control of the [CPU profiler’s behavior and output analysis options](http://htmlpreview.github.io/?https://github.com/gperftools/gperftools/blob/master/doc/cpuprofile.html){:target="_blank"}.

### Heap checker

The operating system owns and manages the amount of memory that is not used by programs, which is collectively known as _the heap_. The heap is an area of pre-reserved computer main storage (memory) that a program process can use to store data in some variable amount that will not be known until the program is running.

The heap is extremely important because it is available for use by applications during execution using the C functions `malloc` (memory allocate) and `free`. The heap allows programs to allocate memory exactly when they need it during the execution of a program, rather than pre-allocating it with a specifically-sized array declaration. Having a certain amount of heap storage already obtained from the operating system makes it easier for processes to manage storage and is generally faster than asking the operating system for storage every time it is needed.

However, shoddy implementations can lead to memory leaks, that is, the program could consume memory but be unable to release it back to the operating system. In object-oriented programming terminology, a memory leak happens when an object is stored in memory but cannot be accessed by the running code. This can diminish the performance of the computer by reducing the amount of available memory. Eventually, in the worst case, too much of the available memory may become allocated and all or part of the system or device stops working correctly, the application fails, or the system slows down unacceptably due to thrashing, the situation found when large amounts of computer resources are used to do a minimal amount of work, with the system in a continual state of resource contention. To conclude: memory leaks are something to avoid.

```
$ HEAPCHECK=1 /path/to/gnss-sdr
```

Other values for HEAPCHECK: `normal` (equivalent to `1`), `strict`, `draconian`.

Please see more details on the [heap checker options](http://htmlpreview.github.io/?https://github.com/gperftools/gperftools/blob/master/doc/heap_checker.html){:target="_blank"}.


### Heap profiler

The heap profiler is used to explore how C++ programs manage memory. This facility can be useful for

  * Figuring out what is in the program heap at any given time
  * Locating memory leaks
  * Finding places that do a lot of allocation

The profiling system instruments all allocations and frees. It keeps track of various pieces of information per allocation site. An allocation site is defined as the active stack trace at the call to `malloc`, `calloc`, `realloc`, or `new`. Note that since the heap-checker uses the heap-profiling framework internally, it is not possible to run both the heap-checker and heap profiler at the same time.

```
$ HEAPPROFILE=/tmp/gnss-sdr.heap.prof <path/to/gnss-sdr> [binary args]
$ pprof <path/to/binary> /tmp/gnss-sdr.heap.prof.0045.heap # run 'ls' to see options
$ pprof --gv <path/to/binary> /tmp/gnss-sdr.heap.prof.0045.heap
```

Please see more details on the [heap profiler options](http://htmlpreview.github.io/?https://github.com/gperftools/gperftools/blob/master/doc/heapprofile.html){:target="_blank"}.

### A quick note about how to use it

Script for profiling (run this as root from the same directory where the executable gnss-sdr is located):

```
#!/bin/bash
# This script, due to the usage of "nice", must be run as root.
if [ $EUID -ne 0 ];
   then echo "you must run the script as root user" 2>&1
   exit 1
fi
export CPUPROFILE=/tmp/gnss-sdr.cpu.prof
export CPUPROFILE_FREQUENCY=100000000000
export HEAPPROFILE=/tmp/prof.gnss-sdr
export HEAPCHECK=normal
nice -n -20 gnss-sdr
```

Save it in the same directory where the executable gnss-sdr is (for instance, name it profiler), make the script executable:

```
$ chmod a+x profiler
```

and launch the executable with CPU and heap profiling activated:

```
$ sudo ./profiler
```

Then, the command line for displaying the results:

```
$ pprof --gv --nodefraction=0.000000000001 --edgefraction=0.000000000001 ./gnss-sdr /tmp/gnss-sdr-cpu.prof
$ pprof --gv ./gnss-sdr /tmp/prof.gnss-sdr.0045.heap
```


## Instrumenting profilers

Another king of profilers instrument (that is, monitor or measure) the target program with additional instructions to collect the required information about software performace. [Valgrind](http://valgrind.org/){:target="_blank"} is an instrumentation framework for building dynamic analysis tools. There are Valgrind tools that can automatically detect many memory management and threading bugs, and profile  programs in detail. One of these tools is Callgrind, a cache profiler. Available separately is an amazing visualisation tool, [KCachegrind](https://kcachegrind.github.io/html/Home.html){:target="_blank"}, which gives a much better overview of the data that Callgrind collects.

When you use Callgrind to profile an application, your application is transformed in an intermediate language and then ran in a virtual processor emulated by Valgrind. This has a huge run-time overhead, but the precision is really good and your profiling data is complete. An application running in Callgrind can be 10 to 50 times slower than normally. The output of Callgrind is flat cal graph that is not really usable directly, but we can use KCachegrind to display the informations about the profiling of the analyzed application.

### Installation and usage

First of all, you need to install Callgrind and KCachegrind. In Ubuntu, you can install everything by doing

```
$ sudo apt-get install valgrind kcachegrind
```

in a terminal. To profile an application with Callgrind, you just have to prepend the Callgrind invocation in front of your normal program invocation:

```
$ valgrind --tool=callgrind ./gnss-sdr
```

The profiling result will be stored in a `callgrind.out.XXX` text file where `XXX` will be the process identifier. The content is not human-readable, but here is where a profile data visualization tool as KCacheGrind comes into play. It can be launched from the command line, by doing

```
$ kcachegrind &
```

and then we have to open the file `callgrind.out.XXX` we obtained before.

The Valgrind framework offers other interesting tools such as Memcheck, a memory error detector. See the [Memcheck manual](http://valgrind.org/docs/manual/mc-manual.html){:target="_blank"} for more details.

To know more, a good place to start is the [Valgrind homepage](http://valgrind.org/){:target="_blank"} and a list of [research papers about Valgrind](http://valgrind.org/docs/pubs.html){:target="_blank"}.

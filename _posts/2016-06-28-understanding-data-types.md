---
title: "Understanding Data Types"
permalink: /docs/tutorials/understanding-data-types/
excerpt: "How GNSS-SDR handles data types."
author_profile: false
header:
  teaser: /assets/images/lego.jpg
tags:
  - tutorial
sidebar:
  nav: "docs"
toc: true
toc_sticky: true
show_date: false
---


## Data ingestion in GNSS-SDR

The input of a software receiver are the raw bits that come out from the
front-end’s analog-to-digital converter (ADC), as shown below. Those bits can be read from a file stored in the hard
disk or directly in real-time from a hardware device through USB or
Ethernet buses.

![Block diagram of a RF front-end]({{ "/assets/images/frontend.png" | relative_url }}){: .align-center .invert-colors}

This is a simplified block diagram of a generic radio frequency front-end,
consisting of an antenna, an amplification stage, downshifting from RF
to an intermediate frequency, filtering, sampling, and an interface to a
host computer for real-time processing mode, or to a storage device for
post-processing.

GNSS-SDR is designed to work with a wide range of radiofrequency
front-ends, each one with its own parameters of sampling frequency,
number of bits per sample, signal format (baseband or passband), etc.
When the sample stream enters the host computer, there is a first
processing block, called *Signal Conditioner*, which is in charge of accommodate the sample stream
in a format tractable by a computer. The containers of data in a
computer system are called **data types**.


### Data type definition

A *type* is a set of possible values which an object, reference,
function or expression can possess, and it is defined as its
representation and a set of operators manipulating these
representations. The type is a property which both restricts the
operations that are permitted for those entities and provides semantic
meaning to the otherwise generic sequences of bits.
{: .notice--info}

### Fundamental data types in C++

The C++ type system defines the following fundamental types:

-   The type `void` specifies that the function does not return a value.
-   The null-pointer type `std::nullptr_t`
-   Arithmetic types:
    -   Floating-point types (`float`, `double`, `long double`)
    -   Integral types
        -   The type `bool`
        -   Character types
            -   Narrow character types (`char`, `signed char`,
                `unsigned char`)
            -   Wide character types (`char16_t`, `char32_t`, `wchar_t`)
        -   Signed integer types (`short`, `int`, `long`, `long long`)
        -   Unsigned integer types (`unsigned short`, `unsigned int`,
            `unsigned long`, `unsigned long long`)


The following Table lists the fundamental data types in C++. Within each of the groups, the difference between types is only their size (i.e., how much they occupy in memory): the first type in each group is the smallest, and the last is the largest, with each type being at least as large as the one preceding it in the same group. Other than that, the types in a group have the same properties. The names of certain integer types can be abbreviated without their signed and int components - only the part not in italics is required to identify the type, the part in italics is optional. I.e., `signed short int` can be abbreviated as `signed short`, `short int`, or simply `short`; they all identify the same fundamental type.

|----------
|:-|:-|:-|
|  **Group**       |  **Type names**          | **Notes on size / precision**
|  --------------
|  Void type       | void                     | no storage
|  Null pointer    | decltype(nullptr)        |
|  Boolean type    | bool                     |
|  Character types | char                     |  Exactly one byte in size. At least 8 bits.
|                  | char16\_t                |  Not smaller than char. At least 16 bits.
|                  | char32\_t                |  Not smaller than char16\_t. At least 32 bits.
|                  | wchar\_t                 |  Can represent the largest supported character set.
|                  | signed char              |  Same size as char. At least 8 bits.
| Integer types (signed)| *signed* short *int* |  Not smaller than char. At least 16 bits.
|                  | *signed* int             |  Not smaller than short. At least 16 bits.
|                  | *signed* long *int*      |  Not smaller than int. At least 32 bits.
|                  | signed long long *int*   |  Not smaller than long. At least 64 bits.
| Integer types (unsigned)   | unsigned char  |  Exactly one byte in size. At least 8 bits.
|                  | unsigned short *int*     |  Not smaller than char. At least 16 bits.
|                  | unsigned *int*           |  Not smaller than short. At least 16 bits.
|                  | unsigned long *int*      |  Not smaller than int. At least 32 bits.
|                  | unsigned long long *int* |  Not smaller than long. At least 64 bits.
| Floating point types | float                |
|                  | double                   |  Precision not less than float
|                  | long double              |  Precision not less than double
|---



Note that
other than `char` (which has a size of exactly one byte), none of the
fundamental types has a standard size specified (but a minimum size, at
most). Therefore, the type is not required (and in many cases is not)
exactly this minimum size. This does not mean that these types are of an
undetermined size, but that there is no standard size across all
compilers and machines; each compiler implementation may specify the
sizes for these types that fit the best the architecture where the
program is going to run.

In C++, the `typedef` keyword allows the programmer to create new names
for types, as shown below:

```cpp
// simple typedef
typedef unsigned long ulong;

// the following two objects have the same type
unsigned long l1;
ulong l2;
```
**Idea to take home:** If your GNSS front-end is delivering samples of 2-bit length, a computer does not know how to handle them. A data type for that length is not defined, so there are no operations defined upon it. Even if you define a specific data type and its related operations, processors and compilers will likely not be optimized for such non-standard type. You need to bring whatever format your _Signal Source_ is delivering to a format that is understandable by the processing environment (processor, operating system, compiler, etc.) in charge of executing GNSS-SDR. Luckily, it is easy to define new formats converters, and they need to be placed at the first processing block that receives the incoming sample stream: the _Data Type_Adapter_.
{: .notice--info}


## Data types in GNSS-SDR

In the C and C++ programming languages, [`stdint.h`](https://en.wikibooks.org/wiki/C_Programming/C_Reference/stdint.h) (or its [`cstdint`](https://en.cppreference.com/w/cpp/header/cstdint) counterpart for C++) is the name of the
header file that allows programmers to write more portable code by
providing a set of typedefs that specify exact-width integer types,
together with the defined minimum and maximum allowable values for each
type. This header is particularly useful for embedded programming which
often involves considerable manipulation of hardware specific I/O
registers requiring integer data of fixed widths, specific locations and
exact alignments. The naming convention for exact-width integer types is
`intN_t` for `signed int` and `uintN_t` for `unsigned int`. Among
others, both [`stdint.h`](https://en.wikibooks.org/wiki/C_Programming/C_Reference/stdint.h) and [`cstdint`](https://en.cppreference.com/w/cpp/header/cstdint) define the following typedefs:

-   `int8_t` Signed integer type with a width of *exactly* 8 bits.

-   `int16_t` Signed integer type with a width of *exactly* 16 bits.

-   `int32_t` Signed integer type with a width of *exactly* 32 bits.

Building upon these definitions, the [Vector-Optimized Library of Kernels
(VOLK)](https://www.libvolk.org/) library defines complex data types. As shown below, it loads the header [`<complex>`](https://en.cppreference.com/w/cpp/header/complex), a file that defines
functionality for complex arithmetic (i.e. basic, arithmetic,
trigonometric and hyperbolic operations, but only for floating-point
data types: `float`, `double` and `long double`. This means that complex
operations are not defined for integer data types, and for instance the
instantiation of an object of type `std::complex<int8_t>` has undefined
behavior. The VOLK library provides definitions for those data types
that are missing in C++ in a portable manner.

Those data type definitions can be seen at [volk/include/volk/volk_complex.h](https://github.com/gnuradio/volk/blob/master/include/volk/volk_complex.h). We reproduce here a snippet to make those definitions more obvious:

```cpp
...
#include <complex>
#include <stdint.h>
...
typedef std::complex<int8_t>  lv_8sc_t;
typedef std::complex<int16_t> lv_16sc_t;
typedef std::complex<int32_t> lv_32sc_t;
typedef std::complex<int64_t> lv_64sc_t;
typedef std::complex<float>   lv_32fc_t;
typedef std::complex<double>  lv_64fc_t;

template <typename T> inline std::complex<T> lv_cmake(const T &r, const T &i){
    return std::complex<T>(r, i);
}
...
```


As shown in the typedefs listed above, VOLK defines
type names for objects holding complex numbers in which their real and
imaginary parts are integers of exactly 8, 16, 32 or 64 bits, or floating
point numbers of 32 or 64 bits. It also provides a template constructor
for them.


Internally, GNSS-SDR makes use of the complex data types defined by
VOLK. They are fundamental for handling sample streams in which samples
are complex numbers with real and imaginary components of 8, 16 or 32
bits, common formats delivered by GNSS radio frequency front-ends. Next Table shows the data type names that GNSS-SDR exposes through the configuration file.

|----------
| **Type name in GNSS-SDR conf files** | **Identifier in VOLK kernels** | **Definition** | **Sample stream**
|:-:|:-:|:-|:-|
|----------
| byte | 8i | Signed integer, 8-bit two’s complement number ranging from -128 to 127. C++ type name: `int8_t`| $$ [ S_0 ], [S_1 ], [S_2], ... $$
| short |  16i | Signed integer, 16-bit two’s complement number ranging from -32768 to 32767. C++ type name: `int16_t` | $$ [ S_0 ], [S_1 ], [S_2], ... $$
| float | 32f | Defines numbers with fractional parts, can represent values ranging from approx. $$ 1.5 \times 10^{-45} $$ to $$ 3.4 \times 10^{38} $$ with a precision of 7 digits (32 bits). C++ type name: `float` | $$ [ S_0 ], [S_1 ], [S_2], ... $$
| ibyte |  8i | Interleaved (I&Q) stream of samples of type `byte`. C++ type name: `int8_t` | $$ [ S_0^{I} ], [ S_0^{Q} ], [S_1^{I} ], [S_1^{Q}], [ S_2^{I} ], [S_2^{Q}], ... $$
| ishort |  16i | Interleaved (I&Q) samples of type `short`. C++ type name: `int16_t` | $$ [ S_0^{I} ], [ S_0^{Q} ], [S_1^{I} ], [S_1^{Q}], [ S_2^{I} ], [S_2^{Q}], ... $$
| cbyte |  8ic | Complex samples, with real and imaginary parts of type `byte`. C++ type name: `lv_8sc_t` | $$ [S_0^{I}+jS_0^{Q}],[S_1^{I}+jS_1^{Q}],[S_2^{I}+jS_2^{Q}],... $$
| cshort |  16ic | Complex samples, with real and imaginary parts of type `short`. C++ type name: `lv_16sc_t` | $$ [S_0^{I}+jS_0^{Q}],[S_1^{I}+jS_1^{Q}],[S_2^{I}+jS_2^{Q}],... $$
| gr\_complex | 32fc | Complex samples, with real and imaginary parts of type `float`.  C++ type name: `std::complex<float>` | $$ [S_0^{I}+jS_0^{Q}],[S_1^{I}+jS_1^{Q}],[S_2^{I}+jS_2^{Q}],... $$
|----------


### From the Signal Source to the processing Channels

A _Signal Conditioner_ block is in charge of adapting the sample bit depth to a data type tractable at the host computer running the software receiver, and optionally intermediate frequency to baseband conversion, resampling, and filtering. Regardless the selected signal source features, the _Signal Conditioner_ interface delivers in a unified format a sample data stream to the receiver downstream processing channels, acting as a facade between the signal source and the synchronization channels, providing a simplified interface to the input signal at a reference, _internal_ sample rate. This signal stream feeds a set of parallel _Channels_.

![Signal Conditioner]( {{ "/assets/images/SignalConditioner2.png" | relative_url }}){: .align-center .invert-colors}

This is an example of _Signal Conditioner_ configuration, in which the _Signal Source_ is delivering samples of type `ishort`. We convert them to `gr_complex` with the _Data Type Adapter_, and then all the downstream processing (filtering and resampling) is also performed on `gr_complex` data. Hence, in this example the data stream delivered to _Channels_ is of type `gr_complex`:


```ini
; ...

;######### SIGNAL_CONDITIONER CONFIG ############
; It holds blocks to change data type, filter and resample input data.
; Can be by-passed by setting its implementation to Pass_Through
SignalConditioner.implementation=Signal_Conditioner

;######### DATA_TYPE_ADAPTER CONFIG ############
; Changes the type of input data.
; implementation: Pass_Through by-passes this block
DataTypeAdapter.implementation=Ishort_To_Complex

;######### INPUT_FILTER CONFIG ############
; Filters the input data.
; implementation: Pass_Through by-passes this block
InputFilter.implementation=Fir_Filter
InputFilter.input_item_type=gr_complex
InputFilter.output_item_type=gr_complex
; ... other parameters

;######### RESAMPLER CONFIG ############
; Resamples the input data.
; implementation: Pass_Through by-passes this block
Resampler.implementation=Direct_Resampler
Resampler.item_type=gr_complex
Resampler.sample_freq_in=8000000
Resampler.sample_freq_out=4000000

; ...
```

The data type expected by _Channels_ actually depends on the specific implementations chosen for _Acquisition_ and _Tracking_ blocks. Currently, all the available implementations admit `gr_complex` at its input, and some of them also `cshort`. But maybe in the future there will be other implementations working with `cbyte`, so there is a need for flexibility when bringing the data stream from _Signal Source_ to the _Channels_. The following guidelines could help you to choose the right path for your setup:


* In a processing flow graph, the data type used by a processing block to write at its output buffer(s) must be the same as the downstream processing blocks which are consuming data from its input buffer(s). Please check that the implementation of the immediately next processing nodes accepts that specific output data format.
* **The less processing, the faster**. If your _Signal Source_ already delivers samples in a format that _Channels_ admits, setting ```SignalConditioner.implementation=Pass_Through``` (that is, a direct wire between the _Signal Source_ and _Channels_) is probably the best choice. Unnecessary filtering or data format conversion will always consume processing cycles, and given that those operations are performed at the sample rate provided by the signal source, this is specially critical if you are working with a real-time configuration. If you are reading samples from a file, there is no more constraint here that the required processing time.
* In general, **the smaller the data type, the faster**. Intuitively, the fewer bits the processor needs to operate with, the faster it can perform the given instruction. That is, multiplying a pair of 8-bit integers should be faster than multiplying a pair of 32-bit floating-point values. However, in practice this not always holds. Processor manufacturers have spent a lot of effort in optimizing floating-point operations and, when combined with the inherent saturation problem in integer arithmetics (which proper management use to consume a non-negligible amount of cycles), it turns out that sometimes a floating-point operation can be done as fast as  its 8 or 16 bit integer counterpart, or even faster. We have found widely different results when using different computing platforms, so specific testing in _your_ machine is always recommended.
* If your _Signal Source_ is delivering a format which is not defined in the Table above (for instance, a specific mapping of signed samples of 2-bit length, which is usual in GNSS-specific front-ends, or any other combination), you need a specific _Data Type Adapter_ for such format.  
* If your _Signal Source_ is delivering signal at some Intermediate Frequency instead of baseband, use the `Freq_Xlating_Fir_Filter` implementation for _Filter_ and bring it down to a baseband signal (_i.e._, complex format).


The following Table shows some of the possible configurations when bringing samples from your  _Signal Source_ to the processing _Channels_:


![Signal Conditioner options]( {{ "/assets/images/signal-conditioner-options.png" | relative_url }}){: .align-center .invert-colors}


### What happens after Channels?

Your duty as user when configuring GNSS-SDR, in the matters related to data types, ends when delivering samples to _Channels_. After that, all the information is handled by an object of an internal class ([check out its API](https://github.com/gnss-sdr/gnss-sdr/blob/master/src/core/system_parameters/gnss_synchro.h) if you are curious) and the results of the whole processing are then delivered in standard formats such as [RINEX](https://en.wikipedia.org/wiki/RINEX), [RTCM 104](https://en.wikipedia.org/wiki/RTCM) or [KML](https://en.wikipedia.org/wiki/Keyhole_Markup_Language), among others.

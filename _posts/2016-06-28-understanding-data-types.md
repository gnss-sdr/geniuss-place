---
title: "Understanding Data Types"
permalink: /docs/tutorials/understanding-data-types/
excerpt: "How GNSS-SDR handles data types."
author_profile: false
header:
  teaser: git-logo.png
tags:
  - tutorial
  - Git
sidebar:
  nav: "docs"
---
{% include base_path %}
{% include toc %}



## Data ingestion in GNSS-SDR


The input of a software receiver are the raw bits that come out from the
front-end’s analog-to-digital converter (ADC), as shown below. Those bits can be read from a file stored in the hard
disk or directly in real-time from a hardware device through USB or
Ethernet buses.

![Block diagram]( {{ base_path }}/images/Frontend.png)

This is a simplified block diagram of a generic radio frequency front-end,
consisting of an antenna, an amplification stage, downshifting from RF
to an intermediate frequency, filtering, sampling, and an interface to a
host computer for real-time processing mode, or to an storage device for
post-processing.

GNSS-SDR is designed to work with a wide range of radiofrequency
front-ends, each one with its own parameters of sampling frequency,
number of bits per sample, signal format (baseband or passband), etc.
When the sample stream enters the host computer, there is a first
processing block, called *Signal Conditioner* (see Section
[sec:conditioner]), which is in charge of accommodate the sample stream
in a format tractable by a computer. The containers of data in a
computer system are called data types.

### Data type definition


A *type* is a set of possible values which an object, reference,
function or expression can possess, and it is defined as its
representation and a set of operators manipulating these
representations. The type is a property which both restricts the
operations that are permitted for those entities and provides semantic
meaning to the otherwise generic sequences of bits.


### Fundamental data types in C++

The C++ type system defines the following fundamental types:

-   The type `void` specifies that the function does not return a value.
-   The null-pointer type `std::nullptr_t`
-   Arithmetic types
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



This Table  shows a list fundamental types in C++. Note that
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


## Data types in GNSS-SDR


In the C and C++ programming languages, [`stdint.h`](https://en.wikibooks.org/wiki/C_Programming/C_Reference/stdint.h){:target="_blank"} is the name of the
header file that allows programmers to write more portable code by
providing a set of typedefs that specify exact-width integer types,
together with the defined minimum and maximum allowable values for each
type. This header is particularly useful for embedded programming which
often involves considerable manipulation of hardware specific I/O
registers requiring integer data of fixed widths, specific locations and
exact alignments. The naming convention for exact-width integer types is
`intN_t` for `signed int` and `uintN_t` for `unsigned int`. Among
others, [`stdint.h`](https://en.wikibooks.org/wiki/C_Programming/C_Reference/stdint.h){:target="_blank"} defines the following typedefs:

-   `int8_t` Signed integer type with a width of *exactly* 8 bits.

-   `int16_t` Signed integer type with a width of *exactly* 16 bits.

-   `int32_t` Signed integer type with a width of *exactly* 32 bits.

Building upon these definitions, the Vector-Optimized Library of Kernels
(VOLK) library[^3] defines complex data types. As shown below, it loads the header [`complex.h`](https://en.wikibooks.org/wiki/C_Programming/C_Reference/complex.h){:target="_blank"}, a file that defines
functionality for complex arithmetic (i.e. basic, arithmetic,
trigonometric and hyperbolic operations, but only for floating-point
data types: `float`, `double` and `long double`. This means that complex
operations are not defined for integer data types, and for instance the
instantiation of an object of type `std::complex<int8>` has undefined
behavior. The VOLK library provides definitions for those data types
that are missing in C++ in a portable manner.

```cpp
...
#include <complex>
#include <stdint.h>

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
imaginary parts are integers of exactly 8, 16, 32 or bits, or floating
point numbers of 32 or 64 bits. It also provides a template constructor
for them. VOLK is also instrumental in squeezing the processor
capabilities by providing with an interface to use Single Input -
Multiple Data (SIMD) instructions, which are of special interest for
operations that are in the receiver’s critical path of processing load.
Processors providing SIMD instruction sets compute with multiple
processing elements that perform the same operation on multiple data
points simultaneously, thus exploiting data-level parallelism, an can be
found in most modern desktop and laptop personal computers. In a
nutshell, VOLK implements in assembly language optimized versions of
computationally-intensive operations for different processor
architectures that are commonly found in modern computers. In order to
use the most optimized version for the specific processor(s) of the host
machine running the software receiver (that is, the implementation than
runs the fastest), VOLK provides `volk_profile`, a program that tests
all known VOLK kernels (that is, basic processing components like
adders, multipliers, correlators, and much more) for each architecture
supported by the host machine, measuring their performance. When
finished, the profiler writes to `$HOME/.volk/volk_config` the best
architecture for each VOLK function. This file is read when using a
function to know the best version to execute. In this way, portability
is always ensured, since VOLK always provide a generic C implementation
that is executed when no SIMD instructions are available at the host
machine executing the software receiver, but takes advantage of those
instructions when they are actually present. By using VOLK, GNSS-SDR
ensures that it will produce optimized executables for a wide range of
processors and low-level instruction sets.

Internally, GNSS-SDR makes use of the complex data types defined by
VOLK. They are fundamental for handling sample streams in which samples
are complex numbers with real and imaginary components of 8, 16 or 32
bits, common formats delivered by GNSS radio frequency front-ends. Next Table shows the data type names that GNSS-SDR exposes through
the configuration file.

|----------
|:-|:-|:-|
| **Type name in conf file** | **Definition** | **Sample stream** 
|----------
| byte | Signed integer, 8-bit two’s complement numberranging from -128 to 127. C++ type name: `int8_t`| $$ [ S_0 ], [S_1 ], S_3],... $$
| short | Signed integer, 16-bit two’s complement number ranging from -32768 to 32767. C++ type name: `int16_t` | $$ [ S_0 S_1 ] $$
| float | Defines numbers with fractional parts, can represent values ranging from approx. $$ 1.5 \times 10^{-45} $$ to $$ 3.4 \times 10^{38} $$ with a precision of 7 digits (32 bits). C++ type name: `float` | $$ [ S_0 ], [S_1 ], [S_3],... $$
| ibyte | Interleaved (I&Q) stream of samples of type `byte`. C++ type name: `int8_t` | ...
| ishort | Interleaved (I&Q) samples of type `short`. C++ type name: `int16_t` | ...
| cbyte | Complex samples, with real and imaginary parts of type `byte`. C++ type name: `lv_8sc_t` | ...
| cshort | Complex samples, with real and imaginary parts of type `short`. C++ type name: `lv_16sc_t` | ...
| gr\_complex | Complex samples, with real and imaginary parts of type `float`.  C++ type name: `std::complex<float>` | $$ [S_0^{I}+jS_0^{Q}],[S_1^{I}+jS_1^{Q}],[S_2^{I}+jS_2^{Q}],... $$
|----------





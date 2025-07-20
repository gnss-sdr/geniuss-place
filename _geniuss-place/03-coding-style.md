---
title: "Coding Style"
permalink: /coding-style/
excerpt: "Coding style for GNSS-SDR source code development."
last_modified_at: 2022-09-27T03:20:02+02:00
header:
  teaser: /assets/images/geniuss-painting.jpg
comments: false
toc: true
toc_sticky: true
toc_h_max: 2
---


Since the seminal work by Kernighan _et al_. in 1974[^Kernighan74], there is a
clear concern on the style in writing software and its impact on the final
quality of the product. Following programming guidelines and code conventions
not only helps to avoid introducing errors but cuts maintenance costs and favors
effective code reuse.

[^Kernighan74]: B. W. Kernighan and P. J. Plauger, The Elements of Programming
    Style, McGraw-Hill, New York, 1974.

{% capture notice-text %}
The following rules capture the most important aspects of coding style:

1. All should be as understandable as possible.
2. All should be as readable as possible, except when it would conflict with the
previous rule.
3. All should be as simple as possible, except when it would conflict with the
previous rules.
{% endcapture %}

<div class="notice--info">
  <h4>Definition:</h4>
  {{ notice-text | markdownify }}
</div>


The best way to look at these rules is to make everything as simple as possible
unless understandability or readability suffers. As a programmer, you must
always try to respect the above rules, even if you do not follow our suggested
style of coding.

Any violation of the guide is allowed if it enhances readability. The main goal
of the recommendation is to improve readability and thereby the understanding
and the maintainability and general quality of the code. It is impossible to
cover all the specific cases in a general guide and the programmer should be
flexible.

The rules can be violated if there are strong personal objections against them.
The attempt is to make a guideline, not to force a particular coding style onto
individuals. Experienced programmers normally want to adopt a style like this
anyway, but having one, and at least requiring everyone to get familiar with it,
usually makes people start thinking about programming styling and evaluate their
own habits in this area. On the other hand, new and inexperienced programmers
normally use a style guide as a convenience of getting into the programming
jargon more easily.


**Not invented here!** This coding style guide was written based on this [Coding
Style Generator](http://www.rosvall.ie/cgi-bin/genCodeStd.pl). Some ideas were
borrowed from the [Google C++ Style
Guide](https://google.github.io/styleguide/cppguide.html) and the [High
Integrity C++ Coding Standard Version
4.0](https://www.perforce.com/resources/qac/high-integrity-cpp-coding-standard)
Guidelines for the use of the C++ language in critical systems.
{: .notice--primary}

**Interested in doing a pull-request? Go straight to the point!** The
application of some of the rules described in this page can be automated with
tools such as [clang-format](https://clang.llvm.org/docs/ClangFormat.html) and
[clang-tidy](https://clang.llvm.org/extra/clang-tidy/), which can help you to
meet the project conventions (automatically changing the code for you!) and
integrate well with many other tools such as code editors and building systems.
If you want to do a pull-request, please apply these tools to your code before
doing it. [Scroll down <i class="fas fa-arrow-circle-down"></i>]({{
"/coding-style/#final-recommendations" | relative_url }}) to read about how to
install and use them. Do not forget to [sign your commits]({{
"/docs/tutorials/using-git/#sign-your-commits" | relative_url }}) as an
indication of [Developer's Certificate of
Origin](https://github.com/gnss-sdr/gnss-sdr/blob/next/.github/DCO.txt)
fulfillment.
{: .notice--success}
-------

## Naming conventions

### Naming rules for variables
Variables are named using lower-case letters and words are separated using
under-score. Abbreviations, when used in variable names, are also written in
lower-case letters. Examples:

```cpp
fft_size
my_variable_name
```
{: class="no-copy"}

### Naming rules for files
Files are named using lower-case letters and words are separated using
under-score. Abbreviations, when used in file names, are also written in
lower-case letters. Source files are named using `.cc` suffix, whereas header
files end with `.h` extension. Examples:

```cpp
my_file.h
my_file.cc
```
{: class="no-copy"}

### Naming rules for functions
Function names are named using lower-case letters and words are separated using
under-score. Abbreviations, when used in function names, are also written in
lower-case letters. This rule applies both to stand-alone functions as well as
to member functions of classes. Example:

```cpp
do_something( with, these, parameters );
```
{: class="no-copy"}

When function calls get too long, you will have to split them up into several
lines. Align the following lines with the previous ones so the structure becomes
obvious, and go to the next line after the comma.

```cpp
Channel(ConfigurationInterface *configuration,
    unsigned int channel,
    std::shared_ptr<GNSSBlockInterface> pass_through,
    std::shared_ptr<AcquisitionInterface> acq,
    std::shared_ptr<TrackingInterface> trk,
    std::shared_ptr<TelemetryDecoderInterface> nav,
    std::string role,
    std::string implementation,
    boost::shared_ptr<gr::msg_queue> queue);
```
{: class="no-copy"}


### Naming rules for classes and structures
Each new word in a class or structure name should always start with a capital
letter and the words should be separated with an under-score. Abbreviations are
written in capital letters. Examples:

```cpp
My_Class_Name
My_Struct_Name
BPSK
```
{: class="no-copy"}

### Use sensible, descriptive names
Do not use short cryptic names or names based on internal jokes. It should be
easy to type a name without looking up how it is spelled. Exception: Loop
variables and variables with a small scope (less than 20 lines) may have short
names to save space if the purpose of that variable is obvious.

### Only use English names
It is confusing when mixing languages for names. English is the preferred
language because of its spread in research and software development and because
most libraries already used are in English.


### Variables with a large scope should have long names, variables with a small scope can have short names

Scratch variables used for temporary storage or indices are best kept short. A
programmer reading such variables should be able to assume that its value is not
used outside a few lines of code. Common scratch variables for integers are `i`,
`j`, `k`, `m`, `n`, and for characters `c` and `d`.

### Use namespaces for identifiers declared in different modules

This avoids name clashes.

### Use name prefixes for identifiers declared in different modules

This avoids name clashes.

### Do not use magic numbers

Unnamed or ill–documented numerical constant values make the code difficult to
follow.

## Indentation and Spacing

### Braces should follow the GNU style

The GNU Bracing Style means that the curly brace pairs are indented from the
surrounding statement. Statements and declarations between the braces are
indented relative to the braces. Braces should be indented 4 columns to the
right of the starting position of the enclosing statement or declaration.
Example:

```cpp
void f(int a)
{
    int i;
    if (a > 0)
        {
            i = a;
        }
    else
        {
            i = a;
        }
}

class A
{
};
```
{: class="no-copy"}

### Function parameters should be lined up with one parameter per line

This allows enough space for Short comments after each parameter. Loop and
conditional statements should always have brace enclosed sub-statements. The
code looks more consistent if all conditional and loop statements have braces.

Even if there is only a single statement after the condition or loop statement
today, there might be a need for more code in the future.

### Braces without any contents may be placed on the same line

The only time when two braces can appear on the same line is when they do not
contain any code. Example:

```cpp
while (...) {}
```
{: class="no-copy"}

### Each statement should be placed on a line on its own

There is no need to make code compact. Putting several statements on the same
line only makes the code cryptic to read.

### Declare each variable in a separate declaration

This makes it easier to see all variables. It also avoids the problem of knowing
which variables are pointers. (Bad) example:

```cpp
int* p, i;
```
{: class="no-copy"}


It is easy to forget that the star belongs to the declared name, not the type,
and look at it and assume that the type is "pointer to int" and both p and i are
declared to this type.

### For declaring pointers and reference the "`*`" and "`&`" should be surrounded by spaces on both sides

### All binary arithmetic, bitwise and assignment operators and the ternary conditional operator (`?:`) should be surrounded by spaces

The comma operator should be followed by a space but not preceded by one; all
other operators should not be used with spaces.

### Lines should not exceed 78 characters

Even if your editor handles long lines, other people may have set up their
editors differently. Long lines in the code may also cause problems for other
programs and printers.

### Do not use tabs

Tabs make the source code difficult to read because different programs treat the
tabs differently. The same code can look very different in different viewers.
Avoid using tabs in your source code to avoid this problem. Use spaces instead.

## Comments

### Comments should be written in English

### Comments should use the C++-style

Be consistent and use the `// ...` style comments.

### Use JavaDoc style comments

The comment styles `///` and `/** ... */` are used by JavaDoc, Doxygen and some
other code documenting tools.

For a complete description of how to document the code, see the [Doxygen
Manual](https://www.doxygen.nl/manual/docblocks.html)

All classes in GNSS-SDR should be properly documented with Doxygen comments in
include (`.h`) files. Source (`.cc`) files should be documented according to a
normal standard for well documented C++ code.

An example of how the interface of a class should be documented in GNSS-SDR is
shown here:

```cpp
/*!
 * \brief Brief description of My_Class here
 *
 * Detailed description of My_Class here. With example code, if needed.
 */
class My_Class
{
public:
    //! Default constructor
    My_Class(void)
    {
        setup_done = false;
    }

    /*!
     * \brief Constructor that initializes the class with parameters
     *
     * Detailed description of the constructor here if needed
     *
     * \param[in] param1 Description of \a param1 here
     * \param[in] param2 Description of \a param2 here
     */
    My_Class(TYPE1 param1, TYPE2 param2)
    {
        setup(param1, param2);
    }

    /*!
     * \brief Setup function for My_Class
     *
     * Detailed description of the setup function here if needed
     *
     * \param[in] param1 Description of \a param1 here
     * \param[in] param2 Description of \a param2 here
     */
    void setup(TYPE1 param1, TYPE2 param2);

    /*!
     * \brief Brief description of member_function1
     *
     * Detailed description of member_function1 here if needed
     *
     * \param[in]     param1 Description of \a param1 here
     * \param[in]     param2 Description of \a param2 here
     * \param[in,out] param3 Description of \a param3 here
     * \return Description of the return value here
     */
    TYPE4 member_function1(TYPE1 param1, TYPE2 param2, TYPE3 &param3);

private:
    bool setup_done;         // Checks if the class is properly initialized
    TYPE1 private_variable1; // Short description of private_variable1 here
    TYPE2 private_variable2; // Short description of private_variable2 here
};
```
{: class="no-copy"}

### Include formulae

Follow this link to see how can [include
formulae](https://www.doxygen.nl/manual/formulas.html).

### Multiple line comments should be split in one comment per line, each having the `/*` and `*/` markers on the same line

Long comments which span several lines are difficult to follow. Having each line
in the comment begin with `/*` makes the comment much clearer and easier to
identify. This also avoids problems where comments contain code and possibly
nested comments.

### All comments should be placed above the line the comment describes, indented identically

Being consistent on the placement of comments removes any question on what the
comment refers to.

Use `#ifdef` instead of `/* ... */` to comment out blocks of code. The code that
is commented out may already contain comments which then terminate the comment
block and causes lots of compile errors or other harder to find errors.

## Files

### There should only be one externally visible class defined in each header file

Having as few declarations as possible in a header file reduces header
dependencies.

The header file should have the same name as the class plus extension `.h`.

External non-member functions that belong to the class interface may also be
declared in the same header file.

### There should only be one externally visible function defined in each header file

Having as few declarations as possible in a header file reduces header
dependencies.

The header file should have the same name as the function plus extension `.h`.

Overloaded functions count as a single function here.

### File name should be treated as case sensitive

### C++ source files should have extension "`.cc`"

### C++ header files should have extension "`.h`"

### Inline functions should be declared in header files and defined in inline definition files

The keyword `inline` should be used in both places.

Using a separate inline file is useful to keep the header files clean and small.
The separation is also useful where the inlining is disabled in debug builds.
The inline file is then included from the source file instead of the header file
to reduce compile time.

### Header files must have include guards

The include guard protects against the header file being included multiple
times. The format of the symbol name should be `<PROJECT>_<FILE>_H`. For
example, the file `gnss-sdr/src/bar_baz.h` should have the following guard:

```cpp
#ifndef GNSS_SDR_BAR_BAZ_H
#define GNSS_SDR_BAR_BAZ_H
...
#endif  // GNSS_SDR_BAR_BAZ_H
```
{: class="no-copy"}

### The name of the macro used in the include guard should have the same name as the file (excluding the extension) followed by the suffix "`_H`"

This avoids clashing with other names.

### Header files should be self-contained

No missing `#include`s.

### When a header is included, there should not be a need to include any other headers first

A simple way to make sure that a header file does not have any dependencies is
to include it first in the corresponding source file. Example:

```cpp
// foobar.cc
#include "foobar.h"
#include <cmath>
...
```
{: class="no-copy"}

### System header files should be included with `<>` and project headers with `""`

### Put \#include directives at the top of files

Having all `#include` directives in one place makes it easy to find them.

### Do not use absolute directory names in `#include` directives

The directory structure may be different on other systems.

### Do not use relative directory names in `#include` directives

The directory structure of the project may change in the future. It is then
difficult to correct all the directory names.

### Preferred order for `#include` directives

Immediately after the header file comment (and include guards if working on a
header file), the minimal list of `#includes` required by the file should be
listed. We suggest this order:

  1. Main Module Header.
  2. Local headers.
  3. Third-party library headers.
  4. System headers.

and each category should be sorted lexicographically by the full path.

The Main Module Header file applies to `.cc` files which implement an interface
defined by a `.h` file. This `#include` should always be included first
regardless of where it lives on the file system. By including a header file
first in the `.cc` files that implement the interfaces, we ensure that the
header does not have any hidden dependencies which are not explicitly
`#include`d in the header, but should be. It is also a form of documentation in
the `.cc` file to indicate where the interfaces it implements are defined. Other
headers should be grouped from most specific to least specific, for the same
reasons described above.

Example:

```cpp
// foobar.cc
#include "foobar.h"
#include "GPS_L1_CA.h"
#include <gnuradio/io_signature.h>
#include <cmath>
...
```
{: class="no-copy"}


### Use `const` instead of \#define in header files

`#define` is a preprocessor directive. Before compiling, the middle symbol is
replaced by the right-hand symbol(s). The preprocessor does nothing but text
replacement, so `#define`s have no respect for the usual C++ scoping rules. In
other words, `#define` is not type-safe.

When replacing `#defines` with constants, two special cases are worth
mentioning. The first is defining constant pointers. Because constant
definitions are typically put in header files (where many different source files
will include them), it is important that the pointer be declared `const`,
usually in addition to what the pointer points to. To define a constant
char\*-based string in a header file, for example, you have to write `const`
twice:

```cpp
const char * const authorName = "Carlos Aviles";
```
{: class="no-copy"}

However, it is worth reminding you here that string objects are generally
preferable to their `char*`-based progenitors, so `authorName` is often better
defined this way:

```cpp
const std::string authorName("Carlos Aviles");  
```
{: class="no-copy"}

The second special case concerns class-specific constants. To limit the scope of
a constant to a class, you must make it a member, and to ensure there is at most
one copy of the constant, you must make it a static member:

```cpp
class My_Acquisition_Algorithm
{
private:
    static const int num_dwells = 5; // constant declaration
    int scores[num_dwells];      // use of constant
    ...
};  
```
{: class="no-copy"}

In general, use `const` whenever possible. The wonderful thing about `const` is
that it allows you to specify a semantic constraint — a particular object should
not be modified — and compilers will enforce that constraint. It allows you to
communicate to both compilers and other programmers that a value should remain
invariant. Whenever that is true, you should be sure to say so, because that way
you enlist your compilers’ aid in making sure the constraint is not violated.

### Each file must start with a copyright notice

Please use the following template at the header of all files:

```cpp
/*!
 * \file filename
 * \brief Brief description of the file here
 * \author Names of the authors who contributed to this code
 *
 * Detailed description of the file here if needed.
 *
 *
 * -----------------------------------------------------------------------------
 *
 * GNSS-SDR is a Global Navigation Satellite System software-defined receiver.
 * This file is part of GNSS-SDR.
 *
 * Copyright (C) 2022  (see AUTHORS file for a list of contributors)
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * -----------------------------------------------------------------------------
 */
```

This Project follows the [REUSE](https://reuse.software/) recommendations and it
is compliant with the [REUSE Specification](https://reuse.software/spec/).
Please check the details in [this tutorial](https://reuse.software/tutorial/).

## Declarations

### Provide names of parameters in function declarations

Parameter names are useful to document what the parameter is used for.

### The parameter names should be the same in all declarations and definitions of the function

Use a `typedef` to define a pointer to a function. Pointers to functions have a
strange syntax. The code becomes much clearer if you use a `typedef` for the
pointer to function type. This `typedef` name can then be used to declare
variables etc.

```cpp
double sin(double arg);
typedef double (*Trigfunc)(double arg);

// Usage examples
Trigfunc myfunc = sin;
void callfunc(Trigfunc callback);
Trigfunc functable[10];
```
{: class="no-copy"}

### Do not use exception specifications

Exception specifications in C++ are not as useful as they look. The compiler
does not make the code more efficient. On the contrary, the compiler has to
insert code to check that called functions do not violate the specified
exception specification at runtime.

### Declare inherited functions virtual

An inherited function is implicitly virtual if it is declared virtual in the
base class. Repeat the virtual keyword when declaring an inherited function in a
derived class to make it clear that this function is virtual.

### Do not use global variables

Use singleton objects instead.

Global variables are initialized when the program starts whether it will be used
or not. A singleton object is only initialized when the object is used the first
time.

If global variables are using other global variables for their initialization
there may be a problem if the dependent variables are not initialized yet. The
initialization order of global variables in different object files is not
defined. Singleton objects do not have this problem as the dependent object will
be initialized when it is used. However, watch out for cyclic dependencies in
singleton object initializations.

### Do not use global variables or singleton objects

Global variables and singleton objects break visibility of what functions do as
these can only be used as invisible side effects of functions. To make it clear
what inputs and outputs a function has, pass these objects as parameters to the
functions.

### Do not use global using declarations and using directives in headers

Bringing in names from a `namespace` to the global `namespace` may cause
conflicts with other headers. The author of a header does not know in which
context the header is used and should avoid polluting the global namespace.
Instead, only use using declarations in the source files.

Do not use `using` directives. Bringing in names from a `namespace` can cause
all sorts of problems as the `namespace` might contain more names than you would
expect. Use them carefully.

```cpp
#include <iostream>

// Bring in names from the std namespace.
using namespace std;

// Declaring an object with the same name as
// a function in the std namespace.
int dec(int);

void f()
{
    // Now we can use iostream names lazily.
    cout << "Hello world.\n";

    // Error: Ambiguous reference to dec.
    cout << "Decimal base is " << dec << '\n';
}
```
{: class="no-copy"}

### The parts of a class definition must be `public`, `protected` and `private`

This makes it easy to read the class definition as the public interface is of
interest to most readers.

### Declare class data private

Classes should encapsulate their data and only provide access to this data by
member functions to ensure that data in class objects are consistent.

The exception to the rule is C type `struct` that only contains data members.

### Functions that can be implemented using the public interface of a class should not be members

A class definition can be kept small and less prone to change if it only defines
the core functionality. Any other functions that can be implemented with this
minimal class definition should be implemented as non-member functions. They are
still seen as part of the interface of the class.

Example:

```cpp
class T
{
    T operator+=(const T & right);
};

T operator+(const T & left, const T & right)
{
    T temp(left);
    temp += right;
    return temp;
}
```
{: class="no-copy"}

## Statements

### Never use gotos

`goto`s break structured coding.

### Do not use `break` in loops

A `break` statement is a `goto` statement in disguise and makes code less
readable. A `break` statement is still acceptable in switch statements.

### Do not use `continue` in loops

A `continue` statement is a goto statement in disguise and makes code less
readable.

### Only have one `return` in a function

It is confusing when there is more than one `return` statement in a function.
Having only one exit point of a function makes it easy to have a single place
for post-conditions and invariant check. When debugging it is useful to have a
single exit point of a function where you can put a single breakpoint or trace
output. It is sometimes necessary to introduce a result variable to carry the
function return value to the end of the function. This is an acceptable
compromise for structured code.

### All `switch` statements should have a `default` label

Even if there is no action for the `default` label, it should be included to
show that the programmer has considered values not covered by `case` labels. If
the case labels cover all possibilities, it is useful to put an assertion there
to document the fact that it is impossible to get here. An assertion also
protects from a future situation where a new possibility is introduced by
mistake.

### Do not use `do-while` loops

`do-while` loops are less readable than ordinary while loops and for loops since
the conditional is at the bottom of the loop. The reader must scan the entire
loop in order to understand the scope of the loop. In addition, `do-while` loops
are not needed. Any `do-while` loop can easily be rewritten into a `while` loop
or a `for` loop. Reducing the number of constructs used enhances readability.

## Other typographical issues

### Avoid macros

Most macros can be replaced by constants, enumerations, or inline functions. As
macros are not part of the C++ language, they do not provide type safety and
debugger support.

### Do not use literal numbers other than 0 and 1

Use constants instead of literal numbers to make the code consistent and easy to
maintain. The name of the constant is also used to document the purpose of the
number.

### Use plenty of assertions

Assertions are useful to verify pre-conditions, post-conditions, and any other
conditions that should never happen. Pre-conditions are useful to verify that
functions are called with valid arguments. They are also useful as documentation
of what argument value ranges a function is designed to work with.

Assertions are macros that print error messages when the condition is not met.
The macros are disabled in release mode and do not cost anything in performance
or used memory in the end product.

Example: This square root function is only designed to work with positive
numbers.

```cpp
#include <assert.h>

double sqrt(double x)
{
    // precondition: x is positive
    assert(x > 0);
    double result;
    ...
    // postcondition: result^2 ~= x
    assert(abs(result*result-x)/x < 1E-8) ;
}
```
{: class="no-copy"}

### Use prefix increment/decrement instead of postfix increment/decrement when the value of the variable is not used

For class objects, there may be two different member functions for the postfix
and prefix operations. The postfix operation has to keep a temporary return
value of the object before changing the object. For built-in objects, this does
not matter as the compiler will be able to optimize away the temporary value
when it is not used.

Even if this only matters for class objects, it is a good habit to use prefix
increment/decrement at all times.

### Write conditional expressions like: if ( 6 == errorNum ) ...

This style avoids accidental assignments of the variable when the comparison
operator is written with only one equal sign (=). Do not rely on implicit
conversion to bool in conditions.

```cpp
if (ptr) // wrong
if (ptr != NULL) // wrong
if (ptr != nullptr) // ok (C++11)
```
{: class="no-copy"}

### Use the new cast operators

Use `dynamic_cast`, `const_cast`, `reinterpret_cast` and `static_cast` instead
of the traditional C cast notation. These document better what is being
performed.

-   Use `static_cast` as the equivalent of a C-style cast that does value
    conversion, or when you need to explicitly up-cast a pointer from a class to
    its superclass.

-   Use `const_cast` to remove the `const` qualifier.

-   Use `reinterpret_cast` to do unsafe conversions of pointer types to and from
    integer and other pointer types. Use this only if you know what you are
    doing and you understand the aliasing issues.

-   Do not use `dynamic_cast` except in test code. If you need to know type
    information at runtime in this way outside of a unittest, you probably have
    a design flaw.

## Language support library

### The C library should not be used.

Some C++ libraries (*e.g.*, `<cstdio>`) also have corresponding C versions
(*e.g.*, `<stdio.h>`). This rule requires that the C++ version is used.

### The library functions `atof`, `atoi` and `atol` from library `<cstdlib>` should not be used.

These functions have _undefined behavior_ associated with them when the string
cannot be converted.

Example:
```cpp
#include <cstdlib>
int32_t f ( const char_t * numstr )
{
    return atoi ( numstr );  // Non-compliant
}
```
{: class="no-copy"}

### The library functions `abort`, `exit`, `getenv` and `system` from library `<cstdlib>` should not be used.

The use of these functions leads to _implementation-defined behavior_.

Example:
```cpp
#include <cstdlib>
void f ( )
{
    exit(0); // Non-compliant
}
```
{: class="no-copy"}

### The time handling functions of library `<ctime>` should not be used.

Various aspects are _implementation-defined_ or _unspecified_, such as the
formats of times.

Example:
```cpp
#include <ctime>
void f ( )
{
    clock(); // Non-compliant
}
```
{: class="no-copy"}

### The unbounded functions of library `<cstring>` should not be used.

The `strcpy`, `strcmp`, `strcat`, `strchr`, `strspn`, `strcspn`, `strpbrk`,
`strrchr`, `strstr`, `strtok` and `strlen` functions within the `<cstring>`
library can read or write beyond the end of a buffer, resulting in _undefined
behavior_.

Ideally, a safe string handling library should be used.

Example:
```cpp
#include <cstring>
void fn ( const char_t * pChar )
{
    char_t array [ 10 ];
    strcpy ( array, pChar );  // Non-compliant
}
```
{: class="no-copy"}

### The macro `offsetof` should not be used.

Use of this macro can lead to _undefined behavior_ when the types of the
operands are incompatible, or when bit fields are used.

Example:
```cpp
#include <cstddef>
struct A
{
    int32_t i;
};
void f1 ( )
{
    offsetof ( A, i );  // Non-compliant
}
```
{: class="no-copy"}

### Dynamic heap memory allocation should not be used.

The use of dynamic memory can lead to out-of-storage run-time failures, which
are undesirable. The built-in `new` and `delete` operators, other than the
placement versions, use dynamic heap memory. The functions `calloc`, `malloc`,
`realloc` and `free` also use dynamic heap memory.

There is a range of _unspecified_, _undefined_, and _implementation-defined
behavior_ associated with dynamic memory allocation, as well as a number of
other potential pitfalls. Dynamic heap memory allocation may lead to memory
leaks, data inconsistency, memory exhaustion, non-deterministic behavior, etc.

Note that some implementations may use dynamic heap memory allocation to
implement other functions (for example, functions in the library `cstring`). If
this is the case, then these functions should also be avoided.

Example:
```cpp
void f1 ( )
{
    int32_t * i = new int32_t;  // Non-compliant
    delete i;
}
```
{: class="no-copy"}

### The signal handling facilities of `<csignal>` should not be used.

Signal handling contains _implementation-defined_ and _undefined behavior_.

Example:
```cpp
#include <csignal>
void my_handler ( int32_t );
void f1 ( )
{
    signal ( 1, my_handler );   // Non-compliant
}
```
{: class="no-copy"}

### Do not use `std::vector<bool>`

The `std::vector<bool>` specialization does not conform to the requirements of a
container and does not work as expected in all STL algorithms.

In particular `&v[0]` does not return a contiguous array of elements as it does
for other vector types. Additionally, the C++ Language Standard guarantees that
different elements of an STL container can safely be modified concurrently,
except for a container of `std::vector<bool>` type.

Example:
```cpp
#include <cstdint>
#include <vector>
void foo ()
{
    std::vector <int32_t> vi; // Compliant
    std::vector <bool> vb;    // Non-Compliant
}
```
{: class="no-copy"}

### The error indicator errno should not be used.

`errno` is a facility of C++ which should in theory be useful, but which in
practice is poorly defined by ISO/IEC 14882:2014.  A non-zero value may or may
not indicate that a problem has occurred; therefore `errno` should not be used.

Even for those functions for which the behavior of `errno` is well defined, it
is preferable to check the values of inputs before calling the function rather
than relying on using `errno` to trap errors.

Example:

```cpp
#include <cstdlib>
#include <cerrno>
void f1 ( const char_t * str )
{
    errno = 0;          // Non-compliant
    int32_t i = atoi ( str );
    if ( 0 != errno )   // Non-compliant
        {
            // handle error case???
        }
}
```
{: class="no-copy"}

### The stream input/output library `<cstdio>` should not be used.

This includes file and I/O functions `fgetpos`, `fopen`, `ftell`, `gets`,
`perror`, `remove`, `rename`, etc. Streams and file I/O have a large number of
_unspecified_, _undefined_, and _implementation-defined_ behaviors associated
with them.

Example:
```cpp
#include <cstdio>     // Non-compliant
void fn ( )
{
    char_t array [ 10 ];
    gets ( array );   // Can lead to buffer over-run
}
```
{: class="no-copy"}


## Final recommendations

### Use tools for automated code formatting

As the code base and the number of contributors grows, maintaining a consistent
code formatting is difficult and creates a lot of noise in commits. In order to
handle this issue, GNSS-SDR uses
[clang-format](https://clang.llvm.org/docs/ClangFormat.html), a set of tools for
automated code formatting. It can be used as a standalone tool and supports a
number of editor integrations.  

The rules for code formatting are configured in the file
[.clang-format](https://github.com/gnss-sdr/gnss-sdr/blob/next/.clang-format) at
the root of the source tree. The style options are described in [Clang-Format
Style Options](https://clang.llvm.org/docs/ClangFormatStyleOptions.html).

You can use clang-format in two simple steps:

**Step 1.- Install clang-format**

  * **In GNU/Linux using Debian / Ubuntu distributions:**
```console
$ sudo apt install clang-format
```

  * **In GNU/Linux using Fedora / CentOS distributions:**
```console
$ sudo yum install clang-tools-extra
```

  * **In GNU/Linux using ArchLinux:**
```console
$ sudo pacman -S clang
```

  * **In GNU/Linux using openSUSE:**
```console
$ sudo zypper -n install llvm-clang
```

  * **In macOS using Homebrew:**
```console
$ brew install clang-format
```

  * **In macOS using Macports:**
  ```console
$ sudo port install clang-19
  ```
  NOTE: You can see all available choices with `port select --list` for clang:
    ```console
$ port select --list clang
Available versions for clang:
        mp-clang-19
        none (active)
    ```
    {: class="no-copy"}
  With `sudo port select --set clang <version>` you choose one of them as the
  new default, which will create symlinks in `/opt/local/bin` without the
  version suffix.
    ```console
$ sudo port select --set clang mp-clang-19
selecting 'mp-clang-19' for 'clang' succeeded. 'mp-clang-19' is now active.
    ```
    {: class="no-copy"}
  You can confirm this change by looking at the version of the tool:
    ```console
$ clang-format --version
clang-format version 19.1.6
    ```
    {: class="no-copy"}
  If you later wish to remove these symlinks in order to avoid hiding tools
  installed by Xcode, just select the `none` version.



**Step 2.- Apply clang-format**

  * **Tell your favorite editor to use clang-format.** You can use it in Eclipse
  via [CppStyle](https://github.com/wangzw/CppStyle), in Visual Studio Code via
  the [Clang-Format
  Extension](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format),
  and in [many other
  editors](https://clang.llvm.org/docs/ClangFormat.html#vim-integration). Once
  the corresponding plugin or module is installed, configure your editor to run
  clang-format on every file save.

  * For applying code formatting from the command line:
    ```console
$ clang-format -i <file>
    ```
    {: class="no-copy"}
  or for a folder and its subfolders:
```console
$ find src/algorithms/conditioner/ -iname *.h -o -iname *.cc | xargs clang-format -i
```
  For each input file, clang-format will try to find the `.clang-format` file
  located in the closest parent directory of the input file, so [the one in the
  root folder](https://github.com/gnss-sdr/gnss-sdr/blob/next/.clang-format)
  will apply. Please do not modify that file, but feel free to propose changes
  (that would be applied to the whole source tree) by [filling an issue at
  GitHub](https://github.com/gnss-sdr/gnss-sdr/issues/new) in order to let other
  developers to discuss them.

You can disable the automatic formatting of a piece of code by using comments:

```cpp
// clang-format off
... code here will not be formatted.
// clang-format on  
```
{: class="no-copy"}

Note the space in between the comment start (`//`) and `clang-format`. This
space is required for the comment to be successfully detected.

**Please apply clang-format to your changes before any pull request.**
{: .notice--danger}

**Step 3.- Check Markdown formatting**

If you have modified markdown files (ended in `.md`), please apply
[prettier](https://prettier.io).

  * Install prettier:
```console
$ sudo npm install --global prettier
```

  * Run it from the root of the source code tree:
```console
$ find . -iname "*.md" | xargs prettier --parser markdown --print-width 80 --prose-wrap always --write
```

  **Please apply prettier to your changes before any pull request if you changed
  and/or created markdown files.**
  {: .notice--danger}


{% capture notice-maintainability %}
Automated code formatting tools help to
improve [**Maintainability**]({{ "/design-forces/maintainability/" |
relative_url }}).
{% endcapture %}

<div class="notice--success">
  {{ notice-maintainability | markdownify }}
</div>

### Use code linters

In this context, _linting_ refers to the process of running a program that
analyzes code for potential errors.

[clang-tidy](https://clang.llvm.org/extra/clang-tidy/) is a clang-based C++
"linter" tool. Its purpose is to provide an extensible framework for diagnosing
and fixing typical programming errors, like style violations, interface misuse,
or bugs that can be deduced via static analysis.

The checks performed by clang-tidy are configured in the
[.clang-tidy](https://github.com/gnss-sdr/gnss-sdr/blob/next/.clang-tidy) file
at the root of the source tree. Definitions and rationale are available at the
[list of clang-tidy
checks](https://clang.llvm.org/extra/clang-tidy/checks/list.html).

You can use clang-tidy in two simple steps:

**Step 1.- Install clang-tidy**

* **In GNU/Linux using Debian / Ubuntu distributions:**
```console
$ sudo apt install clang clang-tidy
```

* **In GNU/Linux using Fedora / CentOS distributions:**
```console
$ sudo yum install clang clang-tools-extra
```

* **In GNU/Linux using ArchLinux:**
```console
$ sudo pacman -S clang
```

* **In GNU/Linux using openSUSE:**
```console
$ sudo zypper -n install llvm-clang
```

* **In macOS using Homebrew:**
```console
$ brew install llvm
$ ln -s $(brew --prefix llvm)/bin/clang-tidy /usr/local/bin /usr/local/bin
$ ln -s $(brew --prefix llvm)/bin/clang-apply-replacements /usr/local/bin
$ ln -s $(brew --prefix llvm)/bin/run-clang-tidy /usr/local/bin
```

* **In macOS using Macports:**
```console
$ sudo port install clang-19
```

**Step 2.- Apply clang-tidy**

This tool integrates nicely with CMake >= 3.6. In GNSS-SDR, all you need to do
is to tell CMake to use clang. From an empty build folder (so if you have
leftovers from previous buildings with GCC, please delete them out before
switching to clang), write:

```console
$ cmake -DCMAKE_CXX_COMPILER=/usr/bin/clang++ \
        -DCMAKE_C_COMPILER=/usr/bin/clang ..
$ make volk_gnsssdr_module core_monitor core_libs pvt_libs
```

(pointing `CMAKE_CXX_COMPILER` and `CMAKE_C_COMPILER` to the actual location of
the clang binaries in your machine). The first command line will create a file
named `compile_commands.json` in your build folder containing the exact compiler
calls for all translation units of the project in machine-readable form. Then,
you need to build some libraries (_i.e._, `volk_gnsssdr_module`, `core_monitor`,
`core_libs`, and `pvt_libs`) that require some building steps not supported by
clang-tidy. After that, you can use the `run-clang-tidy` script (called
`run-clang-tidy.py` in some platforms) to perform the project default checks
over all files in the compilation database:

```console
$ run-clang-tidy -fix
```

or you can apply specific checks by doing:

```console
$ run-clang-tidy -header-filter='.*' -checks='-*,modernize-use-nullptr' -fix
```

An alternative choice is to run clang-tidy along with the building process, by
activating the building option `ENABLE_CLANG_TIDY`:

```console
$ cmake -DCMAKE_CXX_COMPILER=/usr/bin/clang++ \
        -DCMAKE_C_COMPILER=/usr/bin/clang \
$ make volk_gnsssdr_module core_monitor core_libs pvt_libs
$ cmake -DENABLE_CLANG_TIDY=ON ..
$ make  
```

In this latter case, please do not use parallel building (_e.g._, `make -j4`).
Be aware that this process can take a long time.

You can read more about the usage of this tool in the [clang-tidy
documentation](https://clang.llvm.org/extra/clang-tidy/).

{% capture use-clang-tidy %}
With clang and clang-tidy already installed, please do:
```console
$ cmake -DCMAKE_CXX_COMPILER=/usr/bin/clang++ \
        -DCMAKE_C_COMPILER=/usr/bin/clang ..
$ make volk_gnsssdr_module core_monitor core_libs pvt_libs
$ run-clang-tidy -fix
```
or
```console
$ cmake -DCMAKE_CXX_COMPILER=/usr/bin/clang++ \
        -DCMAKE_C_COMPILER=/usr/bin/clang \
$ make volk_gnsssdr_module core_monitor core_libs pvt_libs
$ cmake -DENABLE_CLANG_TIDY=ON ..
$ make   
```
and check if there are warnings and/or fixes related to your code (use `git
status` and `git diff`). If you agree with the changes, add and commit them in
order to be included in your pull request. Otherwise, discard the changes with
`git checkout -- /path/to/changed_file`.
{% endcapture %}

<div class="notice--danger">
  <h4>Please apply clang-tidy to your changes before any pull request</h4>
  {{ use-clang-tidy | markdownify }}
</div>

{% capture notice-tidy %}
An automated code linter helps to improve
[**Efficiency**]({{ "/design-forces/efficiency/" | relative_url }}),
[**Reliability**]({{ "/design-forces/reliability/" | relative_url }}), and
[**Maintainability**]({{ "/design-forces/maintainability/" | relative_url }}).
{% endcapture %}

<div class="notice--success">
  {{ notice-tidy | markdownify }}
</div>

### Learn from the best

Take a look at the [C++ Core
Guidelines](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md)
edited by [Bjarne Stroustrup](https://www.stroustrup.com/) and [Herb
Sutter](https://herbsutter.com/).


### Use of Boost libraries

[Boost](https://www.boost.org) is a set of free, expertly designed,
peer-reviewed portable C++ source libraries. Boost libraries are intended to be
widely useful, and usable across a broad spectrum of applications. However,
Boost regularly makes backward-incompatible changes, making supporting a wide
range of Boost versions hard. All things equal, prefer standard C++ constructs
over Boost constructs.

### Use common sense and BE CONSISTENT

The point of having style guidelines is to have a common vocabulary of coding so
people can concentrate on what you are saying, rather than on how you are saying
it. We present global style rules here so people know the vocabulary. But local
style is also important. If the code you add to a file looks drastically
different from the existing code around it, the discontinuity throws readers out
of their rhythm when they go to read it. Try to avoid this.

![Coding Style]({{ "/assets/images/geniuss-painting.jpg" | relative_url }}
"GeNiuSS is a stylish character. Be like GeNiuSS."){: .align-center}

-------

## References

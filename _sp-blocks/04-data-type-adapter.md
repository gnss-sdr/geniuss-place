---
title: "Data Type Adapter"
permalink: /docs/sp-blocks/data-type-adapter/
excerpt: "Documentation for the Data Type Adapter block."
sidebar:
  nav: "sp-block"
toc: true
toc_sticky: true
last_modified_at: 2024-09-30T12:54:02-04:00
---


The _Data Type Adapter_ is the first processing block inside a _Signal
Conditioner_ when the latter is using a [**`Signal_Conditioner`**]({{
"/docs/sp-blocks/signal-conditioner/#signal-conditioner" | relative_url }})
implementation.


The role of a _Data Type Adapter_ block is to perform a conversion of the data
type in the sample stream.
{: .notice--info}

This is the first processing block after the Signal Source, and each
kind of source can deliver data in different formats.

- If the _Signal Source_ is delivering samples at a given intermediate
  frequency, the _native_ data types can be:

    - Real samples: <abbr id="data-type" title="Signed integer, 8-bit two's
    complement number ranging from -128 to 127. C++ type name:
    int8_t">`byte`</abbr>, <abbr id="data-type" title="Signed integer, 16-bit
    two's complement number ranging from -32768 to 32767. C++ type name:
    int16_t">`short`</abbr>, <abbr id="data-type" title="Defines numbers with
    fractional parts, can represent values ranging from approx. 1.5e-45 to
    3.4e38 with a precision of 7 digits (32 bits). C++ type name:
    float">`float`</abbr> (8, 16, and 32 bits, respectively).

    - Interleaved (I&Q) samples: <abbr id="data-type" title="Interleaved (I&Q)
    stream of samples of type signed 8-bit integer. C++ name:
    int8_t">`ibyte`</abbr>, <abbr id="data-type" title="Interleaved (I&Q) stream
    of samples of type signed 16-bit integer. C++ name:
    int16_t">`ishort`</abbr>, <abbr id="data-type" title="Complex samples with
    real and imaginary parts of type 32-bit floating point. C++ name:
    std::complex<float>">`gr_complex`</abbr> (8+8, 16+16, and 32+32 bits,
    respectively).

- If the _Signal Source_ is delivering samples at baseband, the _native_ data
types can be:

    - Interleaved (I&Q) samples: <abbr id="data-type" title="Interleaved (I&Q)
    stream of samples of type signed 8-bit integer. C++ name:
    int8_t">`ibyte`</abbr>, <abbr id="data-type" title="Interleaved (I&Q) stream
    of samples of type signed 16-bit integer. C++ name:
    int16_t">`ishort`</abbr>, <abbr id="data-type" title="Complex samples with
    real and imaginary parts of type 32-bit floating point. C++ name:
    std::complex<float>">`gr_complex`</abbr> (8+8, 16+16, and 32+32 bits,
    respectively).

    - Complex samples: <abbr id="data-type" title="Complex samples with real
    and imaginary parts of type signed 8-bit integer. C++ name: lv_8sc_t (custom
    definition of std::complex<int8_t>)">`cbyte`</abbr>, <abbr id="data-type"
    title="Complex samples with real and imaginary parts of type signed 16-bit
    integer. C++ name: lv_16sc_t (custom definition of
    std::complex<int16_t>)">`cshort`</abbr>, <abbr id="data-type" title="Complex
    samples with real and imaginary parts of type 32-bit floating point. C++
    name: std::complex<float>">`gr_complex`</abbr> (8+8, 16+16, and 32+32 bits,
    respectively).

This block has several implementations of data type conversions. For more
details about sample data types and their usage in GNSS-SDR, please check out
our [tutorial on data types]({{ "/docs/tutorials/understanding-data-types/" |
relative_url }}).

### Implementation: `Byte_To_Short`

This implementation takes samples of type <abbr id="data-type" title="Signed
integer, 8-bit two's complement number ranging from -128 to 127. C++ type name:
int8_t">`byte`</abbr> (8 bits, real samples) at its input and writes samples of
type <abbr id="data-type" title="Signed integer, 16-bit two's complement number
ranging from -32768 to 32767. C++ type name: int16_t">`short`</abbr> (16 bits,
real samples) at its output.

It accepts the following parameters:

|----------
|  **Parameter**   | **Description** | **Required** |
| :--------------: | :-------------- | :----------: |
|  --------------  |
| `implementation` | `Byte_To_Short` |  Mandatory   |
|     -------      |

  _Data Type Adapter implementation:_ **`Byte_To_Short`**.
  {: style="text-align: center;"}

Example:

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Byte_To_Short
```


### Implementation: `Ibyte_To_Cbyte`

This implementation takes samples of type <abbr id="data-type"
title="Interleaved (I&Q) stream of samples of type signed 8-bit integer. C++
name: int8_t">`ibyte`</abbr> (interleaved I&Q samples, 8 bits each) at its input
and writes samples of type <abbr id="data-type" title="Complex samples with real
and imaginary parts of type signed 8-bit integer. C++ name: lv_8sc_t (custom
definition of std::complex<int8_t>)">`cbyte`</abbr> (complex samples with real
and imaginary components of 8 bits each) at its output. This reduces the sample
rate by two.

It accepts the following parameters:

|----------
|    **Parameter**    | **Description**                                                                                | **Required** |
| :-----------------: | :--------------------------------------------------------------------------------------------- | :----------: |
|   --------------    |
|  `implementation`   | `Ibyte_To_Cbyte`                                                                               |  Mandatory   |
| `inverted_spectrum` | [`true`, `false`]: If set to `true`, it performs a spectrum inversion. It defaults to `false`. |   Optional   |
|       -------       |

  _Data Type Adapter implementation:_ **`Ibyte_To_Cbyte`**.
  {: style="text-align: center;"}

Example:

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Ibyte_To_Cbyte
```


### Implementation: `Ibyte_To_Cshort`

This implementation takes samples of type <abbr id="data-type"
title="Interleaved (I&Q) stream of samples of type signed 8-bit integer. C++
name: int8_t">`ibyte`</abbr> (interleaved I&Q samples, 8 bits each) at its input
and writes samples of type <abbr id="data-type" title="Complex samples with real
and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom
definition of std::complex<int16_t>)">`cshort`</abbr> (complex samples with real
and imaginary components of 16-bits integers each) at its output. This reduces
the sample rate by two.

It accepts the following parameters:

|----------
|    **Parameter**    | **Description**                                                                                | **Required** |
| :-----------------: | :--------------------------------------------------------------------------------------------- | :----------: |
|   --------------    |
|  `implementation`   | `Ibyte_To_Cshort`                                                                              |  Mandatory   |
| `inverted_spectrum` | [`true`, `false`]: If set to `true`, it performs a spectrum inversion. It defaults to `false`. |   Optional   |
|       -------       |

  _Data Type Adapter implementation:_ **`Ibyte_To_Cshort`**.
  {: style="text-align: center;"}

Example:

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Ibyte_To_Cshort
```


### Implementation: `Ibyte_To_Complex`

This implementation takes samples of type <abbr id="data-type"
title="Interleaved (I&Q) stream of samples of type signed 8-bit integer. C++
name: int8_t">`ibyte`</abbr> (interleaved I&Q samples, 8 bits each) at its input
and writes samples of type <abbr id="data-type" title="Complex samples with real
and imaginary parts of type 32-bit floating point. C++ name:
std::complex<float>">`gr_complex`</abbr> (complex samples with real and
imaginary components of 32 bits each) at its output. This reduces the sample
rate by two.

It accepts the following parameters:

|----------
|    **Parameter**    | **Description**                                                                                | **Required** |
| :-----------------: | :--------------------------------------------------------------------------------------------- | :----------: |
|   --------------    |
|  `implementation`   | `Ibyte_To_Complex`                                                                             |  Mandatory   |
| `inverted_spectrum` | [`true`, `false`]: If set to `true`, it performs a spectrum inversion. It defaults to `false`. |   Optional   |
|       -------       |

  _Data Type Adapter implementation:_ **`Ibyte_To_Complex`**.
  {: style="text-align: center;"}

Example:

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Ibyte_To_Complex
```

### Implementation: `Ishort_To_Cshort`

This implementation takes samples of type <abbr id="data-type"
title="Interleaved (I&Q) stream of samples of type signed 16-bit integer. C++
name: int16_t">`ishort`</abbr> (interleaved I&Q samples, 16 bits each) at its
input and writes samples of type <abbr id="data-type" title="Complex samples
with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t
(custom definition of std::complex<int16_t>)">`cshort`</abbr> (complex samples
with real and imaginary components of 16 bits each) at its output. This reduces
the sample rate by two.

It accepts the following parameters:

|----------
|    **Parameter**    | **Description**                                                                                | **Required** |
| :-----------------: | :--------------------------------------------------------------------------------------------- | :----------: |
|   --------------    |
|  `implementation`   | `Ishort_To_Cshort`                                                                             |  Mandatory   |
| `inverted_spectrum` | [`true`, `false`]: If set to `true`, it performs a spectrum inversion. It defaults to `false`. |   Optional   |
|       -------       |

  _Data Type Adapter implementation:_ **`Ishort_To_Cshort`**.
  {: style="text-align: center;"}

Example:

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Ishort_To_Cshort
```

### Implementation: `Ishort_To_Complex`

This implementation takes samples of type <abbr id="data-type"
title="Interleaved (I&Q) stream of samples of type signed 16-bit integer. C++
name: int16_t">`ishort`</abbr> (interleaved I&Q samples, 16 bits each) at its
input and writes samples of type <abbr id="data-type" title="Complex samples
with real and imaginary parts of type 32-bit floating point. C++ name:
std::complex<float>">`gr_complex`</abbr> (complex samples with real and
imaginary components of 32 bits each) at its output. This reduces the sample
rate by two.

It accepts the following parameters:

|----------
|    **Parameter**    | **Description**                                                                                | **Required** |
| :-----------------: | :--------------------------------------------------------------------------------------------- | :----------: |
|   --------------    |
|  `implementation`   | `Ishort_To_Complex`                                                                            |  Mandatory   |
| `inverted_spectrum` | [`true`, `false`]: If set to `true`, it performs a spectrum inversion. It defaults to `false`. |   Optional   |
|       -------       |

  _Data Type Adapter implementation:_ **`Ishort_To_Complex`**.
  {: style="text-align: center;"}

Example:

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Ishort_To_Complex
```

### Implementation: `Cshort_To_Gr_Complex`

This implementation takes samples of type <abbr id="data-type" title="Complex samples with real
and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom
definition of std::complex<int16_t>)">`cshort`</abbr> (complex samples with real
and imaginary components of 16-bits integers each) at its input and writes samples of type
<abbr id="data-type" title="Complex samples with real
and imaginary parts of type 32-bit floating point. C++ name:
std::complex<float>">`gr_complex`</abbr> (complex samples with real and
imaginary components of 32 bits each) at its output.

It accepts the following parameters:

|----------
|  **Parameter**   | **Description** | **Required** |
| :--------------: | :-------------- | :----------: |
|  --------------  |
| `implementation` | `Cshort_to_Gr_Complex` |  Mandatory   |
|     -------      |

  _Data Type Adapter implementation:_ **`Cshort_to_Gr_Complex`**.
  {: style="text-align: center;"}

Example:

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Cshort_to_Gr_Complex
```

Please note that this implementation is currently available only in the `next` branch
of the [upstream repository](https://github.com/gnss-sdr/gnss-sdr) and will be included
in the next stable release of GNSS-SDR.
{: .notice--warning}

### Implementation: `Pass_Through`

This implementation copies samples from its input to its output.

It accepts the following parameters:

|----------
|  **Parameter**   | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | **Required** |
| :--------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
|  --------------  |
| `implementation` | `Pass_Through`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |  Mandatory   |
|   `item_type`    | [<abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 16-bit integer. C++ name: lv_16sc_t (custom definition of std::complex<int16_t>)">`cshort`</abbr>, <abbr id="data-type" title="Complex samples with real and imaginary parts of type signed 8-bit integer. C++ name: lv_8sc_t (custom definition of std::complex<int8_t>)">`cbyte`</abbr>]: Format of data samples. It defaults to <abbr id="data-type" title="Complex samples with real and imaginary parts of type 32-bit floating point. C++ name: std::complex<float>">`gr_complex`</abbr>. |   Optional   |
|     -------      |

  _Data Type Adapter implementation:_ **`Pass_Through`**.
  {: style="text-align: center;"}


Examples:

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Pass_Through
```

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Pass_Through
DataTypeAdapter.item_type=cshort
```

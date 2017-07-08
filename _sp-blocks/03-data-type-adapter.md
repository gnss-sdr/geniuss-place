---
title: "Data Type Adapter"
permalink: /docs/sp-blocks/data-type-adapter/
excerpt: "Documentation for the Data Type Adapter block"
last_modified_at: 2016-04-13T15:54:02-04:00
sidebar:
  nav: "sp-block"
---

{% include toc %}

The _Data Type Adapter_ is the first processing block inside a _Signal Conditioner_ when the later is using a [**`Signal_Conditioner`**]({{ "/docs/sp-blocks/signal-conditioner/#signal-conditioner" | absolute_url }}){:target="_blank"} implementation.



The role of a _Data Type Adapter_  block is to perform a conversion of the data type in the sample stream.
{: .notice--info}

This is the first processing block after the Signal Source, and each
kind of source can deliver data in different formats.

-   If the _Signal Source_ is delivering samples at a given intermediate
    frequency, the _native_ data types can be:

    -   Real samples: `byte`, `short`, `float` (8, 16 and 32 bits,
        respectively).

    -   Intervealed (I&Q) samples: `ibyte`, `ishort`, `gr_complex` (8+8, 16+16 and 32+32 bits, respectively).

-   If the _Signal Source_ is delivering samples at baseband, the _native_ data types can be:

    -   Intervealed (I&Q) samples: `ibyte`, `ishort`, `gr_complex` (8+8, 16+16 and 32+32 bits, respectively).

    -   Complex samples: `cbyte`, `cshort`, `gr_complex` (8+8, 16+16 and 32+32 bits, respectively).

This block provide several implementations of data type conversions. Next table summarizes their characteristics:


|----------
| **Type name in GNSS-SDR conf files** |  **Definition** | **Sample stream** |
|:-:|:-|:-|
|----------
| `byte` | Signed integer, 8-bit two’s complement number ranging from -128 to 127. C++ type name: `int8_t`| $$ [ S_0 ], [S_1 ], S_2], ... $$
| `short` |   Signed integer, 16-bit two’s complement number ranging from -32768 to 32767. C++ type name: `int16_t` | $$ [ S_0 ], [S_1 ], S_2], ... $$
| `float` |  Defines numbers with fractional parts, can represent values ranging from approx. $$ 1.5 \times 10^{-45} $$ to $$ 3.4 \times 10^{38} $$ with a precision of 7 digits (32 bits). C++ type name: `float` | $$ [ S_0 ], [S_1 ], [S_2], ... $$
| `ibyte` |   Interleaved (I&Q) stream of samples of type `byte`. C++ type name: `int8_t` | $$ [ S_0^{I} ], [ S_0^{Q} ], [S_1^{I} ], [S_1^{Q}], [ S_2^{I} ], [S_2^{Q}], ... $$
| `ishort` |  Interleaved (I&Q) samples of type `short`. C++ type name: `int16_t` | $$ [ S_0^{I} ], [ S_0^{Q} ], [S_1^{I} ], [S_1^{Q}], [ S_2^{I} ], [S_2^{Q}], ... $$
| `cbyte` |  Complex samples, with real and imaginary parts of type `byte`. C++ type name: `lv_8sc_t` | $$ [S_0^{I}+jS_0^{Q}],[S_1^{I}+jS_1^{Q}],[S_2^{I}+jS_2^{Q}],... $$
| `cshort` |  Complex samples, with real and imaginary parts of type `short`. C++ type name: `lv_16sc_t` | $$ [S_0^{I}+jS_0^{Q}],[S_1^{I}+jS_1^{Q}],[S_2^{I}+jS_2^{Q}],... $$
| `gr_complex` | Complex samples, with real and imaginary parts of type `float`.  C++ type name: `std::complex<float>` | $$ [S_0^{I}+jS_0^{Q}],[S_1^{I}+jS_1^{Q}],[S_2^{I}+jS_2^{Q}],... $$
|----------

For more details about sample data types and their usage in GNSS-SDR, please check out our [tutorial on data types]({{ "/docs/tutorials/understanding-data-types/" | absolute_url }}).

### Implementation: `Byte_To_Short`

This implementation takes samples of type `byte` (8 bits, real samples)
at its input and writes samples of type `short` (16 bits, real samples)
at its output.

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Byte_To_Short` | Mandatory |
|-------

  _Signal Conditioner implementation:_ **`Byte_To_Short`**.
  {: style="text-align: center;"}

Example:

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Byte_To_Short
```


### Implementation: `Ibyte_To_Cbyte`

This implementation takes samples of type `ibyte` (interleaved I&Q
samples, 8 bits each) at its input and writes samples of type `cbyte`
(complex samples with real and imaginary components of 8 bits each) at
its output. This reduces the sample rate by two.

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Ibyte_To_Cbyte` | Mandatory |
|-------

  _Signal Conditioner implementation:_ **`Ibyte_To_Cbyte`**.
  {: style="text-align: center;"}

Example:

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Ibyte_To_Cbyte
```

### Implementation: `Ibyte_To_Complex`

This implementation takes samples of type `ibyte` (interleaved I&Q
samples, 8 bits each) at its input and writes samples of type
`gr_complex` (complex samples with real and imaginary components of 32
bits each) at its output. This reduces the sample rate by two.

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Ibyte_To_Complex` | Mandatory |
|-------

  _Signal Conditioner implementation:_ **`Ibyte_To_Complex`**.
  {: style="text-align: center;"}

Example:

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Ibyte_To_Complex
```

### Implementation: `Ishort_To_Cshort`

This implementation takes samples of type `ishort` (interleaved I&Q
samples, 16 bits each) at its input and writes samples of type `cshort`
(complex samples with real and imaginary components of 16 bits each) at
its output. This reduces the sample rate by two.

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Ishort_To_Cshort` | Mandatory |
|-------

  _Signal Conditioner implementation:_ **`Ishort_To_Cshort`**.
  {: style="text-align: center;"}

Example:

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Ishort_To_Cshort
```

### Implementation: `Ishort_To_Complex`

This implementation takes samples of type `ishort` (interleaved I&Q
samples, 16 bits each) at its input and writes samples of type
`gr_complex` (complex samples with real and imaginary components of 32
bits each) at its output. This reduces the sample rate by two.

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Ishort_To_Complex` | Mandatory |
|-------

  _Signal Conditioner implementation:_ **`Ishort_To_Complex`**.
  {: style="text-align: center;"}

Example:

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Ishort_To_Complex
```

### Implementation: `Pass_Through`

This implementation copies samples from its input to its output.

It accepts the following parameters:

|----------
|  **Parameter**  |  **Description** | **Required** |
|:-:|:--|:-:|    
|--------------
| `implementation` | `Pass_Through` | Mandatory |
| `item_type` |  [`gr_complex`, `cshort`, `cbyte`]: Format of data samples. It defaults to `gr_complex`. | Optional |
|-------

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

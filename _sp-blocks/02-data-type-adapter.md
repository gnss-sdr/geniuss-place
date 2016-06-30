---
title: "Data Type Adapter"
permalink: /docs/sp-blocks/data-type-adapter/
excerpt: "Documentation for the Data Type Adapter block"
modified: 2016-04-13T15:54:02-04:00
---

{% include toc %}

The _Data Type Adapter_ is the first processing block inside a _Signal Conditioner_



This block is in charge of changing the data type of the sample stream.
This is the first processing block after the Signal Source, and each
king of source can deliver data in different formats.

-   Signal Source is delivering samples at a given intermediate
    frequency:

    -   Real samples: `byte`, `short`, `float` (8, 16 and 32 bits,
        respectively).

    -   Intervealed (I&Q) samples: `ibyte`, `ishort`, `gr_complex`

-   Signal Source is delivering samples at baseband:

    -   Intervealed (I&Q) samples: `ibyte`, `ishort`, `gr_complex`

    -   Complex samples: `cbyte`, `cshort`, `gr_complex`

### Implementation: `Byte_To_Short`

This implementation takes samples of type `byte` (8 bits, real samples)
at its input and writes samples of type `short` (16 bits, real samples)
at its output.

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Byte_To_Short
```


### Implementation: `Ibyte_To_Cbyte`

This implementation takes samples of type `ibyte` (interleaved I&Q
samples, 8 bits each) at its input and writes samples of type `cbyte`
(complex samples with real and imaginary components of 8 bits each) at
its output. This reduces the sample rate by two.

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Ibyte_To_Cbyte
```

### Implementation: `Ibyte_To_Complex`

This implementation takes samples of type `ibyte` (interleaved I&Q
samples, 8 bits each) at its input and writes samples of type
`gr_complex` (complex samples with real and imaginary components of 32
bits each) at its output. This reduces the sample rate by two.

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Ibyte_To_Complex
```

### Implementation: `Ishort_To_Cshort`

This implementation takes samples of type `ishort` (interleaved I&Q
samples, 16 bits each) at its input and writes samples of type `cshort`
(complex samples with real and imaginary components of 16 bits each) at
its output. This reduces the sample rate by two.

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Ishort_To_Cshort
```

### Implementation: `Ishort_To_Complex`

This implementation takes samples of type `ishort` (interleaved I&Q
samples, 16 bits each) at its input and writes samples of type
`gr_complex` (complex samples with real and imaginary components of 32
bits each) at its output. This reduces the sample rate by two.

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Ishort_To_Complex
```

### Implementation: `Pass_Through`

This implementation copies samples from its input to its output.

```ini
;######### DATA_TYPE_ADAPTER CONFIG ############
DataTypeAdapter.implementation=Pass_Through
```


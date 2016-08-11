---
title: "My first position fix"
permalink: /my-first-fix/
excerpt: "How to quickly get a position fix with GNSS-SDR."
modified: 2016-04-13T15:54:02-04:00
header:
  teaser: "gn3s_pvt_4_sats.jpg"
sidebar:
  nav: "start"
---

**This page is the "_Hello, world!_ " for GNSS-SDR**. It will guide you from the scratch up to getting position fixes with GNSS-SDR, in one of its simplest configurations. The signal source will be a file (freely available on the Internet) containing raw signal samples, so this procedure does not require the availability of a radio frequency front-end nor a powerful computer executing the software receiver. The only requirement is GNSS-SDR installed in your computer, and an Internet connection to download the file containing the signal samples.
{: .notice--info}

This guide assumes that GNSS-SDR and its software dependencies are already installed on you system. In order to check whether it is correctly installed, open a terminal and type:

```bash
$ gnss-sdr --version
```

you should see something similar to:

```bash
$ gnss-sdr --version
linux; GNU C++ version 4.9.2; Boost_105400; UHD_003.010

gnss-sdr version 0.0.8
$
```

If you see something like:

```
$ gnss-sdr --version
gnss-sdr: command not found
$
```

please check out the [building guide]({{ site.url }}{{ site.baseurl }}/build-and-install/) and the [README.md](https://github.com/gnss-sdr/gnss-sdr/blob/master/README.md){:target="_blank"} file for more details on how to install GNSS-SDR.

In order to take advantage of the SIMD instruction sets present in your processor, you will need to run the prolifer tools of the VOLK and VOLK_GNSSSDR libraries (these operations only need to be done once, and can take a while):

```bash
$ volk_profile
```

and

```bash
$ volk_gnsssdr_profile
```

Now it's time to download the file containing the GNSS raw signal samples. This can be done directly from the terminal:

```
$ mkdir work
$ cd work
$ wget ..
$ tar ...
```

or by opening this link in your browser and downloading the file.

Then, copy the GNSS-SDR configuration shown below and paste it into your favorite plain text editor:

```ini
...
```


Then, check that the line ... actually points to the path of your raw data file.

Save the file as ....

Ok, let's recap. We have:

* GNSS-SDR installed in our system.
* A signal source: A file containing 98 seconds of raw GPS signal samples, that were grabbed by a radio frequency front-end and stored in ... .dat
* A configuration file for a GPS L1 C/A receiver that will take ... as its signal source.

So, we are ready to run our software-defined GPS receiver. Type:

```bash
$ gnss-sdr --config_file=...
```

---
title: "Build and install GNSS-SDR"
permalink: /build-and-install/
excerpt: "How to quickly build and install GNSS-SDR in your system."
modified: 2016-04-13T15:54:02-04:00
sidebar:
  nav: "start"
---

# Installing everything through software package managers

## GNU/Linux distributions based on Debian

Starting from Debian 8 and Ubuntu 16.04, you can install GNSS-SDR just by doing:

    $ sudo apt-get install gnss-sdr


**The good part:**
This is the easiest and fastest way to get GNSS-SDR installed in your system. Just a single line in your terminal will do all the work for you.
{: .notice--success}

**The downside:**
GNSS-SDR package updates need to undergo an acceptance process before they are included in the different distributions, so it might not be the ultimate version of the source code.
{: .notice--warning}

## Mac OS X using Macports

If you are using Mac OS X 10.? or above, and the [Macports](https://www.macports.org/) package manager, GNSS-SDR can be installed by doing:

    $ sudo port install gnss-sdr

This will install the latest stable release of GNSS-SDR



{% capture mac-os-text %}
Instead of installing the latest stable release, you can install the code found on the `master` branch:

```
$ sudo port install gnss-sdr-devel
```

or the context of the `next` branch:

```
$ sudo port install gnss-sdr-next
```
{% endcapture %}

<div class="notice--info">
  <h4>You have more options here!</h4>
  {{ mac-os-text | markdownify }}
</div>



# Building from source


**Building from source or using packages?**
If you build a given software from its source code, all other softwares linking against it must be also be built from source.
{: .notice--info}

## Install dependencies

### Install dependencies using packages


### Install dependencies using [PyBOMBS](https://github.com/gnuradio/pybombs)


## Clone, build and install GNSS-SDR

Once all the dependencies are installed in your system, you are ready to clone the repository, build the source code and install the software in your system: 

    $ git clone https://github.com/gnss-sdr/gnss-sdr
    $ cd gnss-sdr/build
    $ cmake .. 
    $ make
    $ sudo make install

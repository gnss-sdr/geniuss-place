---
title: "Build and install GNSS-SDR"
permalink: /build-and-install/
excerpt: "How to quickly build and install GNSS-SDR in your system."
modified: 2016-04-13T15:54:02-04:00
sidebar:
  nav: "start"
---

{% include base_path %}
{% include toc %}

# Installing everything through software package managers

## GNU/Linux distributions based on Debian

Starting from Debian 8 and Ubuntu 16.04, you can install GNSS-SDR just by doing:

    $ sudo apt-get install gnss-sdr


**The good part:**
This is the easiest and fastest way to get GNSS-SDR installed in your system. Just a single line in your terminal will do all the work for you.
{: .notice--success}

**The downside:**
GNSS-SDR package updates need to undergo an acceptance process before they are included in the different distributions, so it might not be the ultimate version of the source code. The same applies for the dependency libraries.
{: .notice--danger}

If everything went fine, you can directly jump into how to get your [first position fix]({{ site.url }}{{ site.baseurl }}//first-position-fix/).

## Mac OS X using Macports

If you are using Mac OS X 10.9 or above, and the [Macports](https://www.macports.org/){:target="_blank"} package manager, GNSS-SDR can be installed by typing in a Terminal:

    $ sudo port install gnss-sdr

This will install the latest stable release of GNSS-SDR



{% capture mac-os-text %}
Instead of installing the latest stable release, you can install the code found on the `master` branch, which might contain some bug fixes with respect to the latest stable release:

```
$ sudo port install gnss-sdr-devel
```

or the context of the `next` branch, which might contain fixes and new features with respect to the latest stable release:

```
$ sudo port install gnss-sdr-next
```
{% endcapture %}

<div class="notice--success">
  <h4>You have more options here!</h4>
  {{ mac-os-text | markdownify }}
</div>

If everything went fine, you can directly jump into how to get your [first position fix]({{ site.url }}{{ site.baseurl }}//first-position-fix/).

# Building from source


**Building from source or using packages?**
If you build a given software from its source code, all other softwares linking against it must be also be built from source.
{: .notice--info}

## Install dependencies

### Install dependencies using packages

If you are using Debian 8, Ubuntu 14.10 or above, this can be done by copying and pasting the following line in a terminal:

~~~~~~
$ sudo apt-get install build-essential cmake git libboost-dev libboost-date-time-dev \
       libboost-system-dev libboost-filesystem-dev libboost-thread-dev libboost-chrono-dev \
       libboost-serialization-dev libboost-program-options-dev libboost-test-dev \
       liblog4cpp5-dev libuhd-dev gnuradio-dev gr-osmosdr libblas-dev liblapack-dev \
       libarmadillo-dev libgflags-dev libgoogle-glog-dev libgnutls-openssl-dev libgtest-dev
~~~~~~

**Note for Ubuntu 14.04 LTS users:**
you will need to build from source and install GNU Radio manually, as explained below, since GNSS-SDR requires gnuradio-dev >= 3.7.3, and Ubuntu 14.04 came with 3.7.2. Install all the packages above BUT EXCEPT ```libuhd-dev```, ```gnuradio-dev``` and ```gr-osmosdr``` (and remove them if they are already installed in your machine), and install those dependencies using PyBOMBS, as explained below.
{: .notice--warning}

Once you have installed these packages, you can jump directly to clone, build and install GNSS-SDR.

### Install dependencies using PyBOMBS

This option is adequate if you are interested in development, in working with the most recent versions of software dependencies, want more fine tuning on the installed versions, or simply in building everything from the scratch just for the fun of it. In such cases, we recommend to use [PyBOMBS](http://gnuradio.org/pybombs "Python Build Overlay Managed Bundle System wiki"){:target="_blank"} (Python Build Overlay Managed Bundle System), GNU Radio's meta-package manager tool that installs software from source, or whatever the local package manager is, that automatically does all the work for you. Please take a look at the [configuration options and general PyBOMBS usage](https://github.com/gnuradio/pybombs){:target="_blank"}. Here we provide a quick step-by-step tutorial.

First of all, install some basic packages:

~~~~~~
$ sudo apt-get install git python-pip
~~~~~~

Download, build and install PyBOMBS:

~~~~~~
$ sudo pip install git+https://github.com/gnuradio/pybombs.git
~~~~~~

Add some software recipes (i.e., instructions on how to install software dependencies):

~~~~~~
$ pybombs recipes add gr-recipes git+https://github.com/gnuradio/gr-recipes.git
$ pybombs recipes add gr-etcetera git+https://github.com/gnuradio/gr-etcetera.git
~~~~~~

Download, build and install GNU Radio, related drivers and some other extra modules into the directory ```/path/to/prefix``` (replace this path by your preferred one, for instance ```$HOME/sdr```):

~~~~~~
$ pybombs prefix init /path/to/prefix -a myprefix -R gnuradio-default
~~~~~~

This will perform a local installation of the dependencies under ```/path/to/prefix```, so they will not be visible when opening a new terminal. In order to make them available, you will need to set up the adequate environment variables:

~~~~~~
$ cd /path/to/prefix
$ . ./setup_env.sh
~~~~~~

Now you are ready to use GNU Radio and to jump into building GNSS-SDR after installing a few other dependencies. Actually, those are steps that PyBOMBS can do for you as well:

~~~~~~
$ pybombs install gnss-sdr
~~~~~~

By default, PyBOMBS installs the ‘next’ branch of GNSS-SDR development, which is the most recent version of the source code. This behaviour can be modified by altering the corresponding recipe at ```$HOME/.pybombs/recipes/gr-recipes/gnss-sdr.lwr```

In case you do not want to use PyBOMBS and prefer to build and install GNSS-SDR step by step (i.e., cloning the repository and doing the usual ```cmake .. && make && make install``` dance, as explained below), there are still some missing depenencies (_i.e._, Armadillo, GFlags, Glog and GunTLS) that can be installed either by using PyBOMBS:

~~~~~~
$ pybombs install armadillo gflags glog gnutls
~~~~~~

## Clone, build and install GNSS-SDR

Once all the dependencies are installed in your system, you are ready to clone the repository, build the source code and install the software in your system:

    $ git clone https://github.com/gnss-sdr/gnss-sdr
    $ cd gnss-sdr/build
    $ git checkout next
    $ cmake ..
    $ make
    $ sudo make install

The step `git checkout next` is optional, and sets the source tree pointing to the `next` branch, which is the most recent development snapshot. If this step is ommitted it takes the `master` branch by dafault, which contains the latest stable release, and maybe some bug fixes.

If everything went fine, now you can jump into how to get your [first position fix]({{ site.url }}{{ site.baseurl }}//first-position-fix/).

----

![GeNiuSS building]({{ site.url }}{{ site.baseurl }}/images/geniuss-building.png){:height="250px" width="250x"}
{: style="text-align: center;"}

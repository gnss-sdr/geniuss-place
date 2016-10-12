---
title: "Build and install GNSS-SDR"
permalink: /build-and-install/
excerpt: "How to quickly build and install GNSS-SDR in your system."
modified: 2016-04-13T15:54:02-04:00
header:
  teaser: "geniuss-building.png"
sidebar:
  nav: "start"
redirect_from:
  - /documentation/building-guide
  - /node/45
---

{% include base_path %}
{% include toc %}

This page describe several ways to build and install GNSS-SDR.

![GeNiuSS building]({{ site.url }}{{ site.baseurl }}/images/geniuss-building.png){:height="250px" width="250x"}
{: style="text-align: center;"}

# Installing everything through software package managers

## GNU/Linux distributions based on Debian

Starting from Debian 9 and Ubuntu 16.04, you can install GNSS-SDR just by doing:



```
$ sudo apt-get install gnss-sdr
```


**The good part:**
This is the easiest and fastest way to get GNSS-SDR installed in your system. Just a single line in your terminal will do all the work for you.
{: .notice--success}

**The downside:**
GNSS-SDR package updates need to undergo an acceptance process before they are included in the different distributions, so it might not be the ultimate version of the source code. The same applies for the dependency libraries.
{: .notice--danger}

If everything went fine, you can directly jump into how to get your [first position fix]({{ site.url }}{{ site.baseurl }}/my-first-fix/). If your Operating System release still does not include the GNSS-SDR package, you can [build it from source](#source).

## macOS / Mac OS X using Macports

If you are using macOS Sierra (or Mac OS X 10.9 and above), and the [Macports](https://www.macports.org/){:target="_blank"} package manager, GNSS-SDR can be installed by typing in a Terminal:

    $ sudo port install gnss-sdr

This will install the latest stable release of GNSS-SDR.



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

If everything went fine, you can directly jump into how to get your [first position fix]({{ site.url }}{{ site.baseurl }}/my-first-fix/). Or maybe you might prefer other options, such as using [Homebrew](http://brew.sh/){:target="_blank"} instead of Macports as a software package manager, or to build the source code manually. Fore more details of GNSS-SDR on macOS Sierra or Mac OS X, please check the [README.md](https://github.com/gnss-sdr/gnss-sdr/blob/master/README.md#macos-and-mac-os-x){:target="_blank"} file.

# Building from source

<a name="source"></a>

**Is it better to compile from source or to install from a package?** Here we provide some guidelines. The rule of thumb is: Always consider installing from standard packages of your Operating System first; only compile from sources if you know exactly why you need to do that.
{: .notice--info}

GNSS-SDR and its software dependencies can all be installed either by downloading their source code, building and installing them in your system, or by installing the corresponding software package. Under GNU/Linux, the package manager my vary according to the distribution you are using (```.deb``` for Debian-based distros, such as Ubuntu, Linaro and Raspbian; ```.rpm``` for Fedora / SUSE / Mandriva; etc.). In Mac OS X, most popular open source pacake managers are Macports and Homebrew. In all cases, a possible option for a quick jump into GNSS-SDR is to install all the dependencies from packages, and then building GNSS-SDR from the source code.

But maybe this approach does not fit your needs. Maybe you already have some dependency already built from source and want to use it, or your setup requires some specific flag somewhere. This is a building-time _vs_. fine-tuning trade-off. In order to take the adequate approach, just remember this basic rule:

![Install package or build from source?]({{ site.url }}{{ site.baseurl }}/images/deb-or-build-from-source.png){: .align-center}
_Software packages require that all its dependencies must be also installed from packages._
{: style="text-align: center;"}

and take into account the following considerations:

**The good part:** The advantage of compiling from source is that you can compile packages with certain flags/options which may be missing or disabled in standard packages. Also, it makes it easy to have multiple versions of the same program installed. Also, you can choose an exact version of a package which may be already removed from, or not yet present in, your OS repositories.
{: .notice--success}


**The downside:** The disadvantage of compiling from source is that the usual ```cmake .. && make && sudo make install``` procedure keeps your package manager completely unaware of the changes you are making, so you are not going to get any automatic updates for the manually-compiled software; and it is possible that package manager will later override/break your package if you are not careful to install it in a separate location.
{: .notice--danger}

Some highly automated tools that can do some of the work for you are described below.

## Install dependencies

### Install all dependencies using packages

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

Once you have installed these packages, you can jump directly to [clone, build and install GNSS-SDR](#build).

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

This will perform a local installation of the dependencies under ```/path/to/prefix```, so they will not be visible when opening a new terminal. In order to make them available, you will need to set up the adequate environment variables by sourcing the ```setup_env.sh``` script:

~~~~~~
$ cd /path/to/prefix
$ . ./setup_env.sh
~~~~~~

Now you are ready to use GNU Radio and to jump into [building GNSS-SDR](#build) after installing a few other dependencies. Actually, those are steps that PyBOMBS can do for you as well:

~~~~~~
$ pybombs install gnss-sdr
~~~~~~

By default, PyBOMBS installs the ‘next’ branch of GNSS-SDR development, which is the most recent version of the source code. This behaviour can be modified by altering the corresponding recipe at ```$HOME/.pybombs/recipes/gr-recipes/gnss-sdr.lwr```

In case you do not want to use PyBOMBS and prefer to build and install GNSS-SDR step by step (i.e., cloning the repository and doing the usual ```cmake .. && make && sudo make install``` dance, as explained below), there are still some missing depenencies (_i.e._, Armadillo, GFlags, Glog and GnuTLS) that can be installed either by using PyBOMBS:

~~~~~~
$ pybombs install armadillo gflags glog gnutls
~~~~~~

or manually, just donwloading, building and installing them. More details are available in the [README.md](https://github.com/gnss-sdr/gnss-sdr/blob/master/README.md#manual-installation-of-other-required-dependencies){:target="_blank"} file.

## Clone, build and install GNSS-SDR

<a name="build"></a>

Once all the dependencies are installed in your system, you are ready to clone the repository, build the source code and install the software in your system:

    $ git clone https://github.com/gnss-sdr/gnss-sdr
    $ cd gnss-sdr/build
    $ git checkout next
    $ cmake ..
    $ make
    $ sudo make install

The step `git checkout next` is optional, and sets the source tree pointing to the `next` branch, which is the most recent development snapshot. If this step is ommitted it takes the `master` branch by dafault, which contains the latest stable release, and maybe some bug fixes.

If everything went fine, now you can jump into how to get your [first position fix]({{ site.url }}{{ site.baseurl }}/my-first-fix/).

----

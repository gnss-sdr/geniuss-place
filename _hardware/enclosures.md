---
title: "Enclosures"
excerpt: "Enclosures for you gear."
comments: true
header:
  image: hw-header.jpg
  teaser: hw-header-th.jpg
sidebar:
  - title: "Role"
    image: http://placehold.it/350x250
    image_alt: "logo"
    text: "Designer, Front-End Developer"
  - title: "Responsibilities"
    text: "Reuters try PR stupid commenters should isn't a business model"
gallery:
  - url: hw-header.jpg
    image_path: hw-header-th.jpg
    alt: "placeholder image 1"
  - url: usrp-enclosure-1.jpg
    image_path: usrp-enclosure-1.jpg
    alt: "USRP enclosure"
  - url: hw-header.jpg
    image_path: hw-header-th.jpg
    alt: "placeholder image 3"
---
{% include base_path %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

{% include gallery caption="This is a sample gallery to go along with this case study." %}

## Stereolitografy example:

<script src="https://embed.github.com/view/3d/hectorbu/Prueba-2/master/USRP_Version4/USRP_Base1.4.stl">
</script>

## Code snippets:

### Code in C++

```cpp
double fll_four_quadrant_atan(gr_complex prompt_s1, gr_complex prompt_s2, double t1, double t2)
{
    double cross, dot;
    dot   = prompt_s1.real()*prompt_s2.real() + prompt_s1.imag()*prompt_s2.imag();
    cross = prompt_s1.real()*prompt_s2.imag() - prompt_s2.real()*prompt_s1.imag();
    return atan2(cross, dot) / (t2-t1);
}
```

### Configuration files

```ini
;######### SIGNAL_SOURCE CONFIG ############
SignalSource.implementation=UHD_Signal_Source
SignalSource.item_type=gr_complex
SignalSource.device_address=192.168.40.2 ; <- IP ADDRESS OF YOUR USRP HERE
SignalSource.sampling_frequency=4000000
SignalSource.freq=1575420000
SignalSource.gain=50
SignalSource.subdevice=A:0
SignalSource.samples=0
SignalSource.dump=false
SignalSource.dump_filename=../data/signal_source.dat
SignalSource.enable_throttle_control=false
```


### Terminal commands

```bash
$ git clone https://github.com/gnss-sdr/gnss-sdr
$ cd gnss-sdr/build
$ cmake ..
```


## Figures

![alt]({{ site.url }}{{ site.baseurl }}/images/hw-header.jpg)

![alt](http://www.navipedia.net/images/5/5b/Galileo_Signal_Plan_Fig_3.png)


## Equations

<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>


$$ e_{E1B}(t) = \sum_{l=-\infty}^{+\infty} D_{\text{I/NAV}} \Big[ [l]_{4092} \Big] \oplus C_{E1B} \Big[ |l|_{4092} \Big] p(t - lT_{c,E1B}) $$

## Notices

We can provide colorful notices:


**Changes in Service:** We just updated our [privacy policy](#) here to better service our customers. We recommend reviewing the changes.
{: .notice}

**Primary Notice:** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. [Praesent libero](#). Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
{: .notice--primary}

**Info Notice:** Lorem ipsum dolor sit amet, [consectetur adipiscing elit](#). Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
{: .notice--info}

**Warning Notice:** Lorem ipsum dolor sit amet, consectetur adipiscing elit. [Integer nec odio](#). Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
{: .notice--warning}

**Danger Notice:** Lorem ipsum dolor sit amet, [consectetur adipiscing](#) elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
{: .notice--danger}

**Success Notice:** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at [nibh elementum](#) imperdiet.
{: .notice--success}

## Quotes

> By denying scientific principles, one may maintain any paradox.
> <cite><a href=" http://www.brainyquote.com/quotes/quotes/g/galileogal381321.html">Galileo Galilei</a></cite>


## Text alignments

### Default

This is a paragraph. It should not have any alignment of any kind. It should just flow like you would normally expect. Nothing fancy. Just straight up text, free flowing, with love. Completely neutral and not picking a side or sitting on the fence. It just is. It just freaking is. It likes where it is. It does not feel compelled to pick a side. Leave him be. It will just be better that way. Trust me.

### Left Align

This is a paragraph. It is left aligned. Because of this, it is a bit more liberal in it's views. It's favorite color is green. Left align tends to be more eco-friendly, but it provides no concrete evidence that it really is. Even though it likes share the wealth evenly, it leaves the equal distribution up to justified alignment.
{: style="text-align: left;"}

### Center Align

This is a paragraph. It is center aligned. Center is, but nature, a fence sitter. A flip flopper. It has a difficult time making up its mind. It wants to pick a side. Really, it does. It has the best intentions, but it tends to complicate matters more than help. The best you can do is try to win it over and hope for the best. I hear center align does take bribes.
{: style="text-align: center;"}

### Right Align

This is a paragraph. It is right aligned. It is a bit more conservative in it's views. It's prefers to not be told what to do or how to do it. Right align totally owns a slew of guns and loves to head to the range for some practice. Which is cool and all. I mean, it's a pretty good shot from at least four or five football fields away. Dead on. So boss.
{: style="text-align: right;"}

### Justify Align

This is a paragraph. It is justify aligned. It gets really mad when people associate it with Justin Timberlake. Typically, justified is pretty straight laced. It likes everything to be in it's place and not all cattywampus like the rest of the aligns. I am not saying that makes it better than the rest of the aligns, but it does tend to put off more of an elitist attitude.
{: style="text-align: justify;"}



## Share and comment

And we can comment and share this page with our Google, Twitter, Facebook or Disqus account.

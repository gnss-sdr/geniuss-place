---
title: "How to contribute"
permalink: /contribute/
excerpt: "Contributing to the GNSS-SDR source code and to this website."
last_modified_at: 2018-03-03T08:54:02+02:00
header:
  teaser: "/assets/images/geniuss-contribute.png"
comments: true
toc: true
toc_sticky: true
redirect_from:
  - /node/19
  - /participate
  - /documentation/how-contribute-source-code
  - /documentation/how-report-bugs
---


![Contributing]({{ "/assets/images/geniuss-contribute.png" | relative_url }} "GeNiuSS contributing. Be like GeNiuSS."){:height="250px" width="250px"}
{: style="text-align: center;"}

## Contributing to GNSS-SDR

Found a bug in the code? Interested in adding a new feature or [fixing a known bug](https://github.com/gnss-sdr/gnss-sdr/issues)? Then by all means [submit an issue](https://github.com/gnss-sdr/gnss-sdr/issues/new) or [pull request](https://help.github.com/articles/using-pull-requests/). If this is your first pull request, it may be helpful to read up on the [GitHub Flow](https://guides.github.com/introduction/flow/) first. If you need a quick introduction to Git and its parlance (concepts such as _repository_, _commit_, _push_, _pull-request_, etc.), check our [Git tutorial]({{ "/docs/tutorials/using-git/" | relative_url }}). This project adheres to the [Contributor Covenant code of
conduct]({{ "/code-of-conduct/" | relative_url }}). By participating, you are expected to uphold this code.

The basic setup steps for a contribution to the source code are the following:

1. If you still have not done so, [create your personal account on GitHub](https://github.com/join).

2. [Fork the GNSS-SDR source code repository from GitHub](https://github.com/gnss-sdr/gnss-sdr/fork). This will copy the
whole source code repository into your personal account.

   [<i class="fab fa-github fa-lg"></i> Fork GNSS-SDR from GitHub](https://github.com/gnss-sdr/gnss-sdr/fork){: .btn .btn--geniuss .btn--x-large}
   {: style="text-align: center;"}

3. Then, clone your forked repository into your local machine, checkout the `next` branch, branch off from it, and start working on the source code.

4. When your contribution is ready, head your browser to your GitHub repository, switch to the branch where your contributions are, and click the **Pull Request** button.

More details are available in the [CONTRIBUTING.md](https://github.com/gnss-sdr/gnss-sdr/blob/master/CONTRIBUTING.md) file.

Before start working in GNSS-SDR source code, specially if you want to contribute your changes back to the _upstream_ repository, you may be interested in having a look at our [coding style guide]({{ "/coding-style/" | relative_url }}). The usage of clang-format for [automated code formatting]({{ "/coding-style/#use-tools-for-automated-code-formatting" | relative_url }}) is highly recommended.

## Contributing to this website

Found a typo in this website? Interested in giving your thoughts on existing pages, adding a post, tutorial, new feature or enhancement?

This website itself lives in a [GitHub repository](https://github.com/gnss-sdr/geniuss-place.git). You can contribute in several ways:

 * Commenting (through your Google, Facebook or Twitter account, or just open a new profile at [Disqus](https://disqus.com/)) in the boxes such as the one at the bottom of this page. Moderation will be applied only in cases of flagrant off-topic or unappropriated style (see our [code of conduct]({{ "/code-of-conduct/" | relative_url }})).

 * Sharing the content in your favorite social network.

 * Checking [existing open issues](https://github.com/gnss-sdr/geniuss-place/issues/) or submitting a [new one](https://github.com/gnss-sdr/geniuss-place/issues/new).

 * [Forking this web](https://github.com/gnss-sdr/geniuss-place/fork), cloning the repository, branching off from the `master` branch, working on the changes in your own repository, and making a pull request.

   [<i class="fab fa-github fa-lg"></i> Fork this website from GitHub](https://github.com/gnss-sdr/geniuss-place/fork){: .btn .btn--geniuss .btn--x-large}
   {: style="text-align: center;"}


## How to run this website locally

The required software can be installed through [RubyGems](https://rubygems.org/), which is probably already installed in your system.

Install [Jekyll](https://jekyllrb.com/):

```bash
$ sudo gem install jekyll
```

More information at [Jekyll's installation page](https://jekyllrb.com/docs/installation/). Then, install [Bundler](https://bundler.io/), a tool for managing the required dependencies:

```bash
$ sudo gem install bundler
```

Clone your forked repository of this website and install the required dependencies:

```bash
$ git clone https://github.com/YOUR_USERNAME/geniuss-place/
$ cd geniuss-place
$ bundler install
```

After all gems are installed, the following command will deploy the website and run a local server at http://127.0.0.1:4000/

```bash
$ bundle exec jekyll serve -w --config _config.yml,_config.dev.yml
```

You should see something as:

```
Configuration file: _config.yml
Configuration file: _config.dev.yml
            Source: /path_to_cloned_repo/geniuss-place
       Destination: /path_to_cloned_repo/geniuss-place/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts      
                    done in 4.017 seconds.
 Auto-regeneration: enabled for '/path_to_cloned_repo/geniuss-place'
Configuration file: _config.yml
Configuration file: _config.dev.yml
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```

Just point your browser to that [local direction](http://127.0.0.1:4000/) in order to enjoy this website without the need of Internet connection. Some features such as comments might not work.

{% capture protip %}
**Pro Tip**: if you want to modify JavaScript (under `assets/js`), you will need to install [Node.js](https://nodejs.org/en/), `cd` to the root of your project, and run `$ npm install` to get all the dependencies. If all gone well, then running `npm run build:js` will compress/concatenate `_main.js` and all plugin scripts into `main.min.js`. Thus, upon a change on JavaScript content, run:

```bash
$ npm run build:js
```

in order to update the `main.js` script and implement the changes on the website.
{% endcapture %}

<div class="notice--warning">
{{ protip | markdownify }}
</div>

**Note**: If you upgraded from a previous version of the website be sure you copied over `package.json` prior to running `npm install`.
{: .notice--warning}

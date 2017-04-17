# Contributing to this website

Found a typo in this website? Interested in giving your thoughts on
existing pages, adding a post, tutorial, new feature or enhancement?

The website http://gnss-sdr.org lives in a [GitHub
repository](https://github.com/gnss-sdr/geniuss-place.git). You can
contribute in several ways:

 * Commenting (through your Google, Facebook or Twitter account, or just
open a new profile at [Disqus](https://disqus.com/)) in the boxes such
as the one at the bottom of this page. Moderation will be applied only
in cases of flagrant off-topic or unappropriate style.

 * Sharing the content in your favorite social network.

 * Checking [existing open
issues](https://github.com/gnss-sdr/geniuss-place/issues/) or submitting
a [new one](https://github.com/gnss-sdr/geniuss-place/issues/new).

 * [Forking this web](https://github.com/gnss-sdr/geniuss-place/fork),
working on the changes in your own repository, and making a pull
request.

## Code of Conduct

This project adheres to the Contributor Covenant [code of
conduct](CODE_OF_CONDUCT.md). By participating, you are expected to
uphold this code. Please report unacceptable behavior.

## How to run this website locally

The required software can be installed through
[RubyGems](https://rubygems.org/), which is probably already installed
in your system.

Install [Jekyll](https://jekyllrb.com/):

```
$ sudo gem install jekyll
```

More information at [Jekyll's installation
page](https://jekyllrb.com/docs/installation/). Then, install
[Bundler](http://bundler.io/), a tool for managing the required
dependencies:

```
$ sudo gem install bundler
```

Clone your forked repository of this website and install the required
dependencies:

```
$ git clone https://github.com/YOUR_USERNAME/geniuss-place/
$ cd geniuss-place
$ bundler install
```

After all gems are installed, the following command will deploy the
website and run a local server at http://127.0.0.1:4000/

```
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
                    done in 4.017 seconds.
 Auto-regeneration: enabled for '/path_to_cloned_repo/geniuss-place'
Configuration file: _config.yml
Configuration file: _config.dev.yml
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```

Just point your browser to that [local
direction](http://127.0.0.1:4000/) in order to enjoy this website
without the need of Internet connection. Some features such as comments
might not work.

**Pro Tip**: if you want to modify JavaScript (under ```assets/js```),
you will need to install [Node.js](https://nodejs.org/en/), ```cd```to
the root of your project, and run ```$ npm install``` to get all the
dependencies. If all gone well, then running ```npm run build:js``` will
compress/concatenate ```_main.js``` and all plugin scripts into
```main.min.js```. Thus, upon a change on JavaScript content, run:

```
$ npm run build:js
```

in order to update the ```main.js``` script and implement the changes on
the website.

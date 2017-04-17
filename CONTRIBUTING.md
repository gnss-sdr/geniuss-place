# Contributing to this website

:+1::tada: Thanks for taking the time to contribute! :tada::+1:

Found a typo in this website? Interested in giving your thoughts on
existing pages, adding a post, tutorial, new feature or enhancement?

The website http://gnss-sdr.org lives in a [GitHub
repository](https://github.com/gnss-sdr/geniuss-place.git). You can
contribute in several ways:

 * Commenting (through your Google, Facebook or Twitter account, or just
open a new profile at [Disqus](https://disqus.com/)) in the boxes such
as the one at the bottom of this page. Moderation will be applied only
in cases of flagrant off-topic or unappropriate style. See our [code of
conduct](CODE_OF_CONDUCT.md).

 * Sharing the content in your favorite social network.

 * Checking [existing open
issues](https://github.com/gnss-sdr/geniuss-place/issues/) or submitting
a [new one](https://github.com/gnss-sdr/geniuss-place/issues/new).

 * [Forking this repo](https://github.com/gnss-sdr/geniuss-place/fork),
working on the changes in your own repository, and making a [pull
request](#how-to-submit-a-pull-request).

## Code of Conduct

This project adheres to the Contributor Covenant [code of
conduct](CODE_OF_CONDUCT.md). By participating, you are expected to
uphold this code. Please report unacceptable behavior to
carles.fernandez@cttc.es.


## How to run this website locally

### Preliminaries

   1. If you still have not done so, [create your personal account on
GitHub](https://github.com/join).

   2. [Fork this repository from
GitHub](https://github.com/gnss-sdr/geniuss-place/fork). This will copy the
whole website repository to your personal account.

   3. Then, go to your favourite working folder in your computer and
clone your forked repository by typing (replacing ```YOUR_USERNAME``` by
the actual username of your GitHub account):

          $ git clone https://github.com/YOUR_USERNAME/geniuss-place

   4. Your forked repository https://github.com/YOUR_USERNAME/geniuss-place
will receive the default name of `origin`. You can also add the original
website repository, which is usually called `upstream`:

          $ cd geniuss-place
          $ git remote add upstream https://github.com/gnss-sdr/geniuss-place.git

To verify the new upstream repository you have specified for your fork,
type `git remote -v`. You should see the URL for your fork as `origin`,
and the URL for the original repository as `upstream`:

```
$ git remote -v
origin    https://github.com/YOUR_USERNAME/geniuss-place.git (fetch)
origin    https://github.com/YOUR_USERNAME/geniuss-place.git (push)
upstream  https://github.com/gnss-sdr/geniuss-place.git (fetch)
upstream  https://github.com/gnss-sdr/geniuss-place.git (push)
```

### Install the required software and run a local copy of the website

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

in order to update the `main.js` script and implement the changes on
the website.


## Contributing to the source code of this website

When start working on a new improvement, please **always** branch off
from `master`. Open a new branch and start working on it:

```
$ git checkout -b my_feature
```

Now you can do changes, add files, do commits (please take a look at
[how to write good commit
messages](https://chris.beams.io/posts/git-commit/)!) and push them to
your repository:

```
$ git push origin my_feature
```

If there have been new pushes to the `master` branch of the `upstream`
repository since the last time you pulled from it, you might want to put
your commits on top of them (this is mandatory for pull requests):

```
$ git pull --rebase upstream master
```

### How to submit a pull request

When the contribution is ready, you can [submit a pull
request](https://github.com/gnss-sdr/geniuss-place/compare/). Head to your
GitHub repository, switch to your `my_feature` branch, and click the
_**Pull Request**_ button, which will do all the work for you.

Once a pull request is sent, the Developer Team can review the set of
changes, discuss potential modifications, and even push follow-up
commits if necessary.

For more details about Git usage, please check out [our
tutorial](http://gnss-sdr.org/docs/tutorials/using-git/).

------



![GeNiuSS
contributes](http://gnss-sdr.org/assets/images/geniuss-contribute.png)

Thanks for your contribution to GNSS-SDR!

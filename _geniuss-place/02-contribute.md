---
title: "How to contribute"
permalink: /contribute/
excerpt: "Contributing to the GNSS-SDR source code and to this website."
last_modified_at: 2021-03-22T08:54:02+02:00
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

Found a bug in the code? Interested in adding a new feature or [fixing a known
bug](https://github.com/gnss-sdr/gnss-sdr/issues)? Then by all means [submit an
issue](https://github.com/gnss-sdr/gnss-sdr/issues/new) or [pull
request](https://help.github.com/articles/using-pull-requests/). If this is your
first pull request, it may be helpful to read up on the [GitHub
Flow](https://guides.github.com/introduction/flow/) first. If you need a quick
introduction to Git and its parlance (concepts such as _repository_, _commit_,
_push_, _pull-request_, etc.), check our [Git tutorial]({{
"/docs/tutorials/using-git/" | relative_url }}). This project adheres to the
[Contributor Covenant code of conduct]({{ "/code-of-conduct/" | relative_url }}).
By participating, you are expected to uphold this code.

Any code contributions going into GNSS-SDR will become part of a GPL-licensed,
open-source repository. It is therefore imperative that code submissions belong
to the authors, and that submitters have the authority to merge that code into
the public GNSS-SDR codebase.

For that purpose, we use the [Developer's Certificate of
Origin](https://github.com/gnss-sdr/gnss-sdr/blob/next/.github/DCO.txt). It is
the same document used by other projects. Signing the DCO states that there are
no legal reasons to not merge your code.

To sign the DCO, suffix your git commits with a `Signed-off-by:` line. When
using the command line, you can use `git commit -s` to automatically add this
line. If there were multiple authors of the code, or other types of
stakeholders, make sure that all are listed, each with a separate
`Signed-off-by:` line.

The basic setup steps for a contribution to the source code are the following:

1. If you still have not done so, [create your personal account on
GitHub](https://github.com/join).

2. [Fork the GNSS-SDR source code repository from
GitHub](https://github.com/gnss-sdr/gnss-sdr/fork). This will copy the whole
source code repository into your personal account.

   [<i class="fab fa-github fa-lg"></i> Fork GNSS-SDR from GitHub](https://github.com/gnss-sdr/gnss-sdr/fork){: .btn .btn--geniuss .btn--x-large}
   {: style="text-align: center;"}

3. Then, clone your forked repository into your local machine, checkout the
`next` branch, branch off from it, and start working on the source code.

4. Be sure to [sign your commits]({{
"/docs/tutorials/using-git/#sign-your-commits" | relative_url }}) to indicate
that you fulfill the [Developer's Certificate of
Origin](https://github.com/gnss-sdr/gnss-sdr/blob/next/.github/DCO.txt).

5. When your contribution is ready, head your browser to your GitHub repository,
switch to the branch where your contributions are, and click the **Pull
Request** button.

More details are available in the
[CONTRIBUTING.md](https://github.com/gnss-sdr/gnss-sdr/blob/master/CONTRIBUTING.md)
file.

Before start working in GNSS-SDR source code, especially if you want to
contribute your changes back to the _upstream_ repository, you may be interested
in having a look at our [coding style guide]({{ "/coding-style/" | relative_url }}).
The usage of clang-format for [automated code formatting]({{
"/coding-style/#use-tools-for-automated-code-formatting" | relative_url }}) is
highly recommended.

## Contributing to this website

Found a typo on this website? Interested in giving your thoughts on existing
pages, adding a post, tutorial, new feature, or enhancement?

This website itself lives in a [GitHub
repository](https://github.com/gnss-sdr/geniuss-place.git). You can contribute
in several ways:

 * Commenting (through your Google, Facebook, or Twitter account, or just open
 a new profile at [Disqus](https://disqus.com/)) in the boxes such as the one at
 the bottom of this page. Moderation will be applied only in cases of flagrant
 off-topic or unappropriated style (see our [code of conduct]({{
 "/code-of-conduct/" | relative_url }})).

 * Sharing the content on your favorite social network.

 * Checking [existing open
 issues](https://github.com/gnss-sdr/geniuss-place/issues/) or submitting a [new
 one](https://github.com/gnss-sdr/geniuss-place/issues/new).

 * [Forking this web](https://github.com/gnss-sdr/geniuss-place/fork), cloning
 the repository, branching off from the `main` branch, working on the changes
 in your own repository, and making a pull request.

   [<i class="fab fa-github fa-lg"></i> Fork this website from GitHub](https://github.com/gnss-sdr/geniuss-place/fork){: .btn .btn--geniuss .btn--x-large}
   {: style="text-align: center;"}


## How to run this website locally

The required software can be installed through
[RubyGems](https://rubygems.org/), which is probably already installed in your
system. If this is not the case, please check [how to install
Ruby](https://www.ruby-lang.org/en/documentation/installation/).

Install [Bundler](https://bundler.io/), a tool for managing the required
dependencies:

```console
$ gem install bundler
```

Clone your forked repository of this website and install the required
dependencies (replacing `YOUR_USERNAME` by your actual GitHub user name):

```console
$ git clone https://github.com/YOUR_USERNAME/geniuss-place/
$ cd geniuss-place
$ bundle install
```

After all gems are installed, the following command will deploy the website and
run a local server at http://127.0.0.1:4000/

```console
$ bundle exec jekyll serve -w --config _config.yml,_config.dev.yml
```

You should see something as:

```console
Configuration file: _config.yml
Configuration file: _config.dev.yml
            Source: /path_to_cloned_repo/geniuss-place
       Destination: /path_to_cloned_repo/geniuss-place/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts      
                    done in 4.017 seconds.
 Auto-regeneration: enabled for '/path_to_cloned_repo/geniuss-place'
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```
{: class="no-copy"}

Just point your browser to http://127.0.0.1:4000/ in order to enjoy this website
without the need for an Internet connection. Some features such as comments
might not work.

If you already forked and cloned this repo before, and then have pulled from
upstream, be sure to keep your gems updated with the exact required versions by
re-running:

```console
$ bundle install
```

{% capture protip %}
**Pro Tip**: if you want to modify JavaScript (under `assets/js`), you will
need to install [Node.js](https://nodejs.org/en/), `cd` to the root of your
project, and run `$ npm install` to get all the dependencies. If all went well,
then running `npm run build:js` will compress/concatenate `_main.js` and all
plugin scripts into `main.min.js`. Thus, upon a change on JavaScript content,
run:

```console
$ npm run build:js
```

in order to update the `main.js` script and implement the changes on the
website.
{% endcapture %}

<div class="notice--warning">
{{ protip | markdownify }}
</div>

**Note**: If you upgraded from a previous version of the website be sure you
copied over `package.json` prior to running `npm install`.
{: .notice--warning}


{% capture mastermain %}
**Note: "master" to "main" transition**. In June 2020, GitHub
[announced](https://twitter.com/natfriedman/status/1271253144442253312) it would
start to remove references to the term "master" from GitHub services and
replacing it with a more neutral term like "main," a
[change](https://github.com/github/renaming) already adopted by many other
communities (see some media reports
[here](https://www.vice.com/en_us/article/k7qbyv/github-to-remove-masterslave-terminology-from-its-platform)
and
[here](https://www.theserverside.com/feature/Why-GitHub-renamed-its-master-branch-to-main)).
Moving to use "main" felt an appropriate way to honor our own
[code of conduct]({{ "/code-of-conduct/" | relative_url }}), so we implemented
this change on March 22, 2021. If you cloned or forked this repository before
that date, you can update your own repository by doing:

1. Fetch from the upstream repository:
```console
$ git fetch https://github.com/gnss-sdr/geniuss-place/
```
2. Checkout the newly fetched `main` branch and change the `HEAD` pointer to it:
```console
$ git checkout main
$ git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/main
```
If you only cloned the repository from upstream, then you are good to go.
3. If you forked from the upstream repo, push the local main branch to your own
repo:
```console
git push -u origin main
```
4.  Change the default branch name to "main" on your forked GitHub repository.
This is the only step that requires you to leave the Terminal and navigate in
your browser to your GitHub repository
`https://github.com/YOUR_USERNAME/geniuss-place/`. From there, click "Settings"
<i class="fas fa-long-arrow-alt-right"></i> "Branches" on the left rail and
change the default branch to "main".
5. Delete your `master` branch:
```console
$ git push origin --delete master
```
Now `main` is your new default branch, and you are ready to deploy the website
on a local server, and to branch-off from it if you are planning to make changes
and to submit a Pull Request. {% endcapture %}

<div class="notice--info">
{{ mastermain | markdownify }}
</div>

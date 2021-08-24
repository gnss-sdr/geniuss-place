---
title: "Master to main transition"
excerpt: "Renaming the default Git branch from master to main."
header:
  teaser: /assets/images/master-to-main-teaser.png
tags:
  - news
  - Git
author_profile: false
sidebar:
  nav: "news"
last_modified_at: 2021-08-23T12:08:02+02:00
---

![Master to main transition]({{ "/assets/images/master-to-main.png" | relative_url }}){: .align-center}
_The default Git branch name in the GNSS-SDR upstream repository changed from
"master" to "main"_.
{: style="text-align: center;"}

As you may be already aware, many communities, both on GitHub and in the wider
Git realm, are renaming the default branch name of their repository from
"master" to "main". This is due to the traditional default branch name "master"
being offensive in some cultural contexts, as it reminds of the master/slave
terminology.

The word "master" is derived from the Latin word "magester", meaning chief or
teacher, so it should not have racial connotations or be derogatory in any
context. However, in some communities and cultural backgrounds, it does.
Therefore, in alliance with these communities, implementing the change to use
"main" feels like an appropriate way to honor our own [Code of
Conduct](https://github.com/gnss-sdr/gnss-sdr/blob/next/CODE_OF_CONDUCT.md) as
we aim to be a community as respectful as possible. We understand that maybe you
do not feel offended by that word, but keep in mind that it might be because you
do not belong to the legitimately sensible communities. Of course, this change
is far from addressing any of the root problems that motivated it. It is just a
small and symbolic gesture to show empathy for those cultural backgrounds that
pushed for it. We explicitly denounce and reject racism in any form.

**The change is very simple, and it does not require any massive brain-burning
from contributors and users: the default branch that was previously known as
"master" is called "main" since June 17th, 2021.**
{: .notice--info}

The role of the "main" branch will be the same as it was for the former "master"
branch: a reference for the latest GNSS-SDR stable release. It is just a
renaming. The development branch will still be called "next".

We are committed to making the renaming process as seamless as possible for
project contributors and users. If you forked and cloned this repository before
June 17th, 2021, you can update your own repository by doing:

1. Fetch from the upstream repository:
```console
$ git fetch https://github.com/gnss-sdr/gnss-sdr/
```
2. Checkout the newly fetched `main` branch and change the `HEAD` pointer to it:
```console
$ git checkout main
$ git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/main
```
If you only cloned the repository from upstream, then you are good to go.
3. If you forked from upstream and then cloned your own repo, then there is some
more extra work. Push the local `main` branch to your own repo:
```console
git push -u origin main
```
4.  Change the default branch name to `main` on your forked GitHub repository.
This is the only step that requires you to leave the Terminal and navigate in
your browser to your GitHub repository
`https://github.com/YOUR_USERNAME/gnss-sdr/`. From there, click "Settings"
<i class="fas fa-long-arrow-alt-right"></i> "Branches" on the left rail, and
then change the default branch to `main`.
5. Delete your `master` branch:
```console
$ git push origin --delete master
```

Now `main` is your new default branch. Please remember to branch off from `next`
if you plan to make changes and to submit a Pull Request.

The transition policy is as follows:

- The default branch in the upstream repository
  [https://github.com/gnss-sdr/gnss-sdr](https://github.com/gnss-sdr/gnss-sdr)
  is called "main" since June 17th, 2021.

- A copy of the branch formerly known as "master" will be kept in the repository
  (although it will not be the default branch name anymore and will not receive
  further updates) until the forthcoming release of GNSS-SDR v0.0.15. Once
  v0.0.15 is released, the "master" branch will be deleted from the upstream
  repository.

  **Update**: the "master" branch was removed from the upstream repository on
  August 23rd, 2021, with the release of GNSS-SDR v0.0.15.
  {: .notice--info}


We are aware that this change could require modifications in your scripts
involving the upstream GNSS-SDR repository (although if you are using the `next`
branch, no change is needed!), so we urge you to update them as soon as possible
if required. We apologize for any inconvenience.

Read more about Git usage in the context of this project in our
[Git tutorial]({{ "/docs/tutorials/using-git/" | relative_url }}).

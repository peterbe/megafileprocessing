# megafileprocessing

An experiment to see the difference of using synchronous processing of
files in a `cli` program.

These files are the basis of this blog post:
[Avoid async when all you have is (SSD) disk I/O in NodeJS](https://www.peterbe.com/plog/avoid-async-disk-io-in-nodejs)

## Context

The context of the blog post is the challenge of processing large amounts of
little files. In my experimentation I have about 4,000 files averaging 50KB
each. The challenge is to travese the directory and visit each file.

This is all relevant to the Node `cli`s used by
[stumptown-content](https://github.com/mdn/stumptown-content) and
[stumptown-renderer](https://github.com/mdn/stumptown-renderer).

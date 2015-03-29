[![Build Status](https://travis-ci.org/umd-mith/csvwww.svg)](http://travis-ci.org/umd-mith/csvwww)

csvwww is a webapp that lets you load in [CSVW](http://www.w3.org/2013/csvw/wiki/Main_Page) datasets, and 
publish changes to them using [Web Annotation](http://www.w3.org/annotation/). It is a prototype 
created as part of a collaboration between MITH and the HTRC on the 
[Workset Creation for Scholarly Analysis](http://worksets.htrc.illinois.edu/worksets/).

## Install

csvwww is a Node/MongoDB web application. Here's how you install:

    % sudo apt-get install node mongodb gcc make build-essential
    % npm install -g gulp
    % npm install
    % gulp

## Run

    % cp config.json.template config.json 
    # and edit as appropriate
    % bin/www

## Test

    % gulp test

## Develop

    % gulp develop
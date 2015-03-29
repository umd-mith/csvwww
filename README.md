[![Build Status](https://travis-ci.org/umd-mith/csvwww.svg)](http://travis-ci.org/umd-mith/csvwww)

A webapp that lets you load in CSVW datasets, and publish changes to them. It requires 
[Node](http://nodejs.org) and [MongoDB](http://mongodb.org). It is a prototype meant for
research purposes, but it's here in case you might get some use and/or ideas from it.

## Install

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
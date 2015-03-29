[![Build Status](https://travis-ci.org/umd-mith/csvwww.svg)](http://travis-ci.org/umd-mith/csvwww)

A webapp that lets you load in CSVW datasets, and publish changes to them. It requires 
[Node](http://nodejs.org) and [MongoDB](http://mongodb.org). It is a prototype meant for
research purposes, but it's here in case you might get some use and/or ideas from it.

## Run

    % npm install -g gulp
    % npm install
    % gulp
    % cp config.json.template config.json # and edit as appropriate
    % bin/www

## Test

    % gulp test

## Develop

    % gulp develop
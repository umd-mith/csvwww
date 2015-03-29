[![Build Status](https://travis-ci.org/umd-mith/csvwww.svg)](http://travis-ci.org/umd-mith/csvwww)

A webapp that lets you load in CSVW datasets, and publish changes to them. It requires 
<a href="http://nodejs.org">Node</a>a> and <a href="http://mongodb.org">MongoDB</a>.

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
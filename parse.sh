#!/usr/bin/env bash

set -e

BASEDIR=$(cd $(dirname $0) && pwd)

node $BASEDIR/dojo/dojo.js load=parse $@

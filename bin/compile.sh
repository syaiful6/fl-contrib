#!/bin/sh

for f in packages/*; do
  if [ -d "$f/src" ]; then
    node_modules/.bin/cross-env BABEL_ENV=commonjs node_modules/.bin/babel $f/src --out-dir $f/lib
    node_modules/.bin/cross-env BABEL_ENV=es node_modules/.bin/babel $f/src --out-dir $f/jsnext
  fi
done

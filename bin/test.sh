#!/bin/sh
set -e

if [ -z "$TEST_GREP" ]; then
   TEST_GREP=""
fi
node_modules/.bin/cross-env BABEL_ENV=commonjs node node_modules/mocha/bin/_mocha `bin/grep-test.sh` --opts test/mocha.opts --grep "$TEST_GREP"

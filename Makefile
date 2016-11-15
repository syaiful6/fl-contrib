.DEFAULT_GOAL = help

.PHONY: lint test compile clean

bin        := $(shell npm bin)
babel      := $(bin)/babel
eslint     := $(bin)/eslint
mocha      := $(bin)/mocha

SRC_DIRS := $(shell find packages/*/src -name '*.js')

help:
	@echo ""
	@echo "AVAILABLE TASKS"
	@echo ""
	@echo "  compile ................ Compiles the project."
	@echo "  clean .................. Removes build artifacts."
	@echo "  test ................... Runs the tests for the project."
	@echo "  lint ................... Lints all source files."
	@echo ""

lint:
	$(eslint) $(SRC_DIRS)

test: compile
	./bin/test.sh

compile:
	./bin/compile.sh

clean:
	rm -r -f packages/*/lib
	rm -r -f packages/*/jsnext

bootstrap:
	npm install
	./node_modules/.bin/lerna bootstrap

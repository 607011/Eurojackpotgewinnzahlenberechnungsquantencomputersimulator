.PHONY: all

all: well.js

well.js: well.c Makefile
#   emcc well.c -o well.js -s EXPORTED_FUNCTIONS='["_WELL1024", "_fill_state_array", "_bufsize"]'
	emcc well.c -O2 -o well.js

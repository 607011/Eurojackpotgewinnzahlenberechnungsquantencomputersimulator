.PHONY: all clean

CFLAGS=-Os
EMCCFLAGS=--no-entry

all: mt.js

mt.js: mt19937.c Makefile
	emcc mt19937.c $(EMCCFLAGS) $(CFLAGS) -o mt.js

clean:
	rm -f mt.wasm mt.js

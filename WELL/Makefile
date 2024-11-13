.PHONY: all clean

CFLAGS=-O2
EMCCFLAGS=--no-entry

all: well.js

well.js: well.c Makefile
	emcc well.c $(EMCCFLAGS) $(CFLAGS) -o well.js

clean:
	rm -f well.wasm well.js

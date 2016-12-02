irt.js: irt.h irt.c
	python $(EMCC) -o $@ -s EXPORTED_FUNCTIONS="['_estimate', '_inv_logis']" --post-js post.js irt.c

irt_browser_test_built.js: irt_browser_test.js irt.js
	browserify irt_browser_test.js > $@

.PHONY: clean

clean:
	rm -f irt.js irt_browser_test_built.js
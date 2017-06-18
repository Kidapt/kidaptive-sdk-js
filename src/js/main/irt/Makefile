irt.js: irt.c
	python c2js.py < $< | uglifyjs -b > $@

.PHONY: clean

clean:
	rm -f irt.js
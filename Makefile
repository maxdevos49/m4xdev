BINARIES=m4xdev

CMD_DIR=cmd
BIN_DIR=bin
EMBED_DIR=internal/static/.embed

TEMPL_SRC_FILES=$(shell find . -name "*.templ" -type f)
TEMPL_GEN_FILES=$(patsubst %.templ, %_templ.go, $(TEMPL_SRC_FILES))
TAILWIND_GEN_FILES=$(EMBED_DIR)/tailwind.css

$(BINARIES): | $(TEMPL_GEN_FILES) $(TAILWIND_GEN_FILES) 
	go build -o ./$(BIN_DIR)/$@ ./$(CMD_DIR)/$@

$(TEMPL_GEN_FILES): $(TEMPL_SRC_FILES)
	templ generate $<

$(TAILWIND_GEN_FILES): $(TEMPL_SRC_FILES) internal/static/css/tailwind-input.css
	npx tailwind -i internal/static/css/tailwind-input.css -o $@ -m
	touch $@

.PHONY: build clean
build: $(BINARIES)

clean:
	rm -rf $(BIN_DIR)
	rm -rf $(EMBED_DIR)
	find ./ -name "*_templ.go" -delete
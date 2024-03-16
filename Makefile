BINARIES=m4xdev

CMD_DIR=cmd
BIN_DIR=bin

TEMPL_SRC_FILES=$(shell find . -name "*.templ" -type f)
TEMPL_GEN_FILES=$(patsubst %.templ, %_templ.go, $(TEMPL_SRC_FILES))

$(BINARIES): $(TEMPL_GEN_FILES)
	go build -o ./$(BIN_DIR)/$@ ./$(CMD_DIR)/$@

$(TEMPL_GEN_FILES): $(TEMPL_SRC_FILES)
	templ generate $<

.PHONY: build clean
build: $(BINARIES)

clean:
	rm -rf $(BIN_DIR)
	find ./ -name "*_templ.go" -delete
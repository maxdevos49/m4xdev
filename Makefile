.PHONY:

run: build
	./.bin/m4xdev

build:
	@npx tailwind -o internal/static/.dist/style.css -m
	@templ generate
	@go build -o ./.bin/m4xdev ./cmd/m4xdev

build-watch:
	@air

static-watch:
	@npx tailwind -o internal/static/.dist/style.css -m -w

clean:
	@rm -rf .bin internal/static/.dist
	@find ./ -name "*_templ.go" -delete
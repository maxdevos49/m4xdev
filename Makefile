AIR=github.com/air-verse/air@v1.61.5

.PHONY: watch/templ2
watch/templ:
	templ generate --watch --proxy="http://localhost:8000" --open-browser=false

.PHONY: watch/server
watch/server:
	go run $(AIR) \
	--build.cmd "go build -o bin/m4xdev cmd/m4xdev/main.go" \
	--build.bin "bin/m4xdev" --build.delay "100" \
	--build.exclude_dir "node_modules,wwwroot,bin" \
	--build.include_ext "go" \
	--build.stop_on_error "false" \
	--misc.clean_on_exit true

.PHONY: watch/wwwroot
watch/wwwroot:
	go run $(AIR) \
	--build.cmd "templ generate --notify-proxy" \
	--build.bin "true" \
	--build.delay "100" \
	--build.exclude_dir "" \
	--build.include_dir "wwwroot" \
	--build.include_ext "js,css,png,jpeg,ico,map"

.PHONY: watch
watch:
	make -j3 watch/templ watch/server watch/wwwroot

.PHONY: clean
clean:
	rm -rf bin
	find ./ -name "*_templ.go" -delete
	find ./ -name "*._templ.txt" -delete
	find ./ -name "*.fiber.gz" -delete

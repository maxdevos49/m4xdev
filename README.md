# M4XDEV\.com
---

### Required Dependencies

##### `go install github.com/cosmtrek/air@latest`
- Used for live reloading whenever a go file is changed

##### `go install github.com/a-h/templ/cmd/templ@latest`
- Used to generate `*_templ.go` files from `*.templ` files 

### Commands

##### `make`
Builds and runs the application
##### `make build`
Builds the application
##### `make build-watch`
Builds and runs the application whenever a file changes
##### `make static-watch`
Builds the static assets(Tailwind) whenever a .templ file is changed
##### `make clean`
Deletes all generated folders

### Stack:
- [Fiber](https://docs.gofiber.io/)
- [Templ](https://templ.guide/)
- [HTMX](https://htmx.org/docs/)
- [Tailwind](https://tailwindcss.com/docs/installation)
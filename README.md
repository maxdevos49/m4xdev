# M4XDEV\.com
---

Personal website written in Go. Goals for this site include low maintenance and ease of adding new content while being a joy to work on.

## Development dependencies

### [Templ](https://github.com/a-h/templ) - HTML templating language for Go
```sh
go install github.com/a-h/templ/cmd/templ@latest
```

### [Node + NPM](https://nodejs.org/en) - Used for JSDoc type validation
```sh
# Install node dependencies
npm ci
```

## Development Tools

### [Air](https://github.com/cosmtrek/air) - Live reload for Go apps
```sh
go install github.com/cosmtrek/air@latest
```

## Build project
```sh
make build
```

## JSDoc type checking
```sh
npm run check
```

## JS linting
```sh
npm run lint
```

## Run project
```sh
./bin/m4xdev
```

## Live rebuild and run
```sh
air
```

## Clean project
```sh
make clean
```

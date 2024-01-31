package main

import (
	"log"

	"github.com/gofiber/fiber/v2"

	"github.com/maxdevos49/m4xdev/internal/static"
	"github.com/maxdevos49/m4xdev/internal/handler"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	app := fiber.New()

	app.Get("/", handler.Home)
	app.Get("/blog", handler.Blog)

	app.Use("/static", static.Middleware())


	return app.Listen(":3002")
}

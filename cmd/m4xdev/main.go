package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/maxdevos49/m4xdev/handlers"
)

func main() {
	app := fiber.New()

	app.Use(helmet.New())
	app.Use(logger.New())

	app.Static("/", "./wwwroot", fiber.Static{
		Compress: true,
	})

	app.Get("/", handlers.Home)

	// TODO 404 page
	// TODO 500 page

	if err := app.Listen(":3002"); err != nil {
		log.Fatal(err)
	}
}

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
		// If a bundling step is added consider the following along with the use of utils.AssetURL
		// MaxAge:   60 * 60 * 24 * 30, // Cache static assets for 30 days
	})

	app.Get("/", handlers.Home)

	// TODO 404 page
	// TODO 500 page

	if err := app.Listen(":3002"); err != nil {
		log.Fatal(err)
	}
}

package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"github.com/maxdevos49/m4xdev/handlers"
	"github.com/maxdevos49/m4xdev/views"
)

func main() {
	app := fiber.New()

	app.Use(helmet.New())
	app.Use(logger.New())
	app.Use(recover.New())

	app.Static("/", "./wwwroot", fiber.Static{
		Compress: true,
		MaxAge:   60 * 60 * 12,
	})

	app.Get("/", handlers.Home)

	app.Use(func(c *fiber.Ctx) error {
		return handlers.Render(c, views.View404())
	})

	if err := app.Listen(":3002"); err != nil {
		log.Fatal(err)
	}
}

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
	})

	app.Get("/", handlers.Home)
	app.Get("/paint", handlers.Paint)

	// admin := app.Group("/admin")

	// admin.Get("/posts", handlers.Posts)
	// admin.Get("/post", handlers.)
	// admin.Post("/post", handlers.)
	// admin.Get("/post/:id", handlers.)
	// admin.Put("/post/:id", handlers.)
	// admin.Delete("/post/:id", handlers.)

	// admin.Get("/uploads", handlers.)
	// admin.Get("/upload", handlers.)
	// admin.Post("/upload", handlers.)
	// admin.Get("/upload/:id", handlers.)
	// admin.Put("/upload/:id", handlers.)
	// admin.Delete("/upload/:id", handlers.)

	app.Use(func(c *fiber.Ctx) error {
		return handlers.Render(c, views.View404())
	})

	if err := app.Listen(":3002"); err != nil {
		log.Fatal(err)
	}
}

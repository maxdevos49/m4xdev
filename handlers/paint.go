package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/maxdevos49/m4xdev/views"
)

func Paint(c *fiber.Ctx) error {
	return Render(c, views.Paint())
}

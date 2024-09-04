package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/maxdevos49/m4xdev/views"
)

func Posts(c *fiber.Ctx) error {
	return Render(c, views.Posts())
}

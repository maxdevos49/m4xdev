package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/maxdevos49/m4xdev/internal/view"
)

func Blog(c *fiber.Ctx) error {
	return Render(c, view.Blog())
}
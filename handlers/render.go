package handlers

import (
	"github.com/a-h/templ"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
)

/**
 * Helper function to allow writing the content from a templ template.
 */
func Render(c *fiber.Ctx, component templ.Component, options ...func(*templ.ComponentHandler)) error {
	componentHandler := templ.Handler(component, options...)
	return adaptor.HTTPHandler(componentHandler)(c)
}

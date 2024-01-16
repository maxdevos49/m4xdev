package static

import (
	"embed"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
)

//go:embed .dist/*
var embedDirStatic embed.FS

func Middleware() func(*fiber.Ctx) error {
	return filesystem.New(filesystem.Config{
		Root:       http.FS(embedDirStatic),
		PathPrefix: ".dist",
		Browse:     true,
	})
}

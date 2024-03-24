package utilities

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
)

func AssetURL(asset string) string {
	info, err := os.Stat(filepath.Join("./wwwroot/", asset))
	if err != nil {
		log.Fatal(err)
	}

	return fmt.Sprintf("%s?ver=%d", asset, info.ModTime().Unix())
}

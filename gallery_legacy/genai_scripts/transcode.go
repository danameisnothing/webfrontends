package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func main() {
	inputDir := flag.String("input", "", "Input directory containing source images")
	outputDir := flag.String("output", "", "Output directory for AVIF images")
	flag.Parse()

	if *inputDir == "" || *outputDir == "" {
		log.Fatal("Both --input and --output directories must be specified")
	}

	log.Printf("Starting transcoding process from %s to %s", *inputDir, *outputDir)

	// Walk through the input directory recursively
	err := filepath.Walk(*inputDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Skip directories
		if info.IsDir() {
			return nil
		}

		// Process only image files
		ext := strings.ToLower(filepath.Ext(path))
		validExtensions := map[string]bool{
			".png": true, ".jpg": true, ".jpeg": true, ".webp": true,
		}

		if !validExtensions[ext] {
			return nil
		}

		// Create the relative path from input directory
		relPath, err := filepath.Rel(*inputDir, path)
		if err != nil {
			return fmt.Errorf("error getting relative path for %s: %w", path, err)
		}

		// Create output path preserving directory structure
		outputPath := filepath.Join(*outputDir, "avif", strings.TrimSuffix(relPath, filepath.Ext(relPath))+".avif")

		// Create output directory if it doesn't exist
		outputDirPath := filepath.Dir(outputPath)
		if err := os.MkdirAll(outputDirPath, 0755); err != nil {
			return fmt.Errorf("error creating output directory %s: %w", outputDirPath, err)
		}

		// Process the file based on its type
		if ext == ".webp" {
			// For WebP files: convert to PNG first using FFmpeg
			tmpPNG := filepath.Join("/tmp", fmt.Sprintf("temp_%d_%s.png", os.Getpid(), filepath.Base(strings.TrimSuffix(relPath, ".webp"))))

			// Convert WebP to PNG
			log.Printf("Converting WebP to PNG: %s", relPath)
			ffmpegCmd := exec.Command("ffmpeg", "-i", path, "-c:v", "png", "-y", tmpPNG)
			ffmpegCmd.Stderr = os.Stderr

			if err := ffmpegCmd.Run(); err != nil {
				return fmt.Errorf("error converting WebP to PNG: %w", err)
			}

			// Convert the temporary PNG to AVIF
			log.Printf("Converting to AVIF: %s -> %s", filepath.Base(tmpPNG), filepath.Base(outputPath))
			avifCmd := exec.Command("avifenc", "--speed", "0", "--jobs", "all", "-a", "tune=ssim", "-a", "cq-level=18", tmpPNG, outputPath)
			avifCmd.Stderr = os.Stderr

			if err := avifCmd.Run(); err != nil {
				os.Remove(tmpPNG) // Cleanup temp file even on error
				return fmt.Errorf("error converting PNG to AVIF: %w", err)
			}

			// Remove temporary PNG file
			os.Remove(tmpPNG)
		} else {
			// For other formats: direct conversion to AVIF
			log.Printf("Converting to AVIF: %s -> %s", relPath, filepath.Base(outputPath))
			avifCmd := exec.Command("avifenc", "--speed", "0", "--jobs", "all", "-a", "tune=ssim", "-a", "cq-level=18", path, outputPath)
			avifCmd.Stderr = os.Stderr

			if err := avifCmd.Run(); err != nil {
				return fmt.Errorf("error converting to AVIF: %w", err)
			}
		}

		return nil
	})

	if err != nil {
		log.Fatalf("Error during processing: %v", err)
	}

	log.Println("Transcoding completed successfully!")
}

Images are lossily transcoded with these commands :
AVIF :
```
avifenc --speed 0 --jobs all -a tune=ssim -a cq-level=18 woolhaven-bg-poster.png woolhaven-bg-poster.avif
```
(the FFmpeg wiki says 23 is visually lossless, but not quite : https://trac.ffmpeg.org/wiki/Encode/AV1)

JPEG XL looks worse than AVIF :( (lossily at least)


Capturing the noise :
Recorded on a 4:1 aspect ratio
WARNING: GenAI-generated code (gemini-2.5-pro)!
"optimize" the page first
```js
const bodyChildren = document.body.children;
for (let i = bodyChildren.length - 1; i >= 0; i--) {
  const child = bodyChildren[i];
  if (child.id !== '__next') {
    child.remove();
  }
}

const nextDiv = document.getElementById('__next');
if (nextDiv) {
  const header = nextDiv.querySelector('header.css-ynbrw');
  if (header) {
    const headerChildren = header.children;
    for (let i = headerChildren.length - 1; i >= 0; i--) {
      headerChildren[i].remove();
    }
  }

  const pw7jstDiv = nextDiv.querySelector('div.css-pw7jst');
  if (pw7jstDiv) {
    const pw7jstChildren = pw7jstDiv.children;
    for (let i = pw7jstChildren.length - 1; i >= 0; i--) {
      const child = pw7jstChildren[i];
      if (child.tagName.toLowerCase() !== 'section' || (child.id !== 'trailer' && !child.classList.contains('css-lyef3h'))) {
        child.remove();
      }
    }
  }
}

const trailerSection = document.getElementById('trailer');
if (trailerSection) {
  const trailerChildren = trailerSection.children;
  for (let i = trailerChildren.length - 1; i >= 0; i--) {
    const child = trailerChildren[i];
    if (child.tagName.toLowerCase() === 'div' && !child.classList.contains('css-zjik7')) {
      child.remove();
    }
  }
}
```

capture in VP8 :
WARNING: Based on GenAI-generated code (Claude Sonnet 4.5)!
```js
// taken from Wikipedia en.wikipedia.org/wiki/Display_resolution#Common_display_resolutions

function recordCanvas(width, height, lengthSec) {
    console.log(`Setting up recording for ${width}x${height}...`);

    // Find the canvas
    const section = document.getElementById('trailer');
    if (!section) {
        console.error('Section with id "trailer" not found!');
        return;
    }

    const div = section.querySelector('.css-zjik7');
    if (!div) {
        console.error('Div with class "css-zjik7" not found!');
        return;
    }

    const span = div.querySelector('span');
    if (!span) {
        console.error('Span element not found!');
        return;
    }

    const canvas = span.querySelector('canvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    console.log('Canvas found!', canvas);

    const stream = canvas.captureStream(120);

    const mimeTypes = [
        'video/webm;codecs=vp8' // for lightweightness
    ];

    const supportedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));
    console.log('Using codec:', supportedMimeType);

    const recorder = new MediaRecorder(stream, {
        mimeType: supportedMimeType,
        videoBitsPerSecond: 30000000
    });

    const chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: supportedMimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fiery_gradient_divider_${width}x${height}_raw.webm`;
        a.click();
        console.log(`Download started for ${width}x${height}`);
    };

    recorder.start();
    console.log(`Recording started for ${width}x${height}...`);

    setTimeout(() => {
        console.log("Stopping recording...");
        recorder.stop();
    }, lengthSec * 1000);
}
```

Processing the video :
(we don't need these to be high-quality, nor particularly efficient)
VP8 -> VP8 (PowerShell syntax) : // https://www.webmproject.org/docs/encoder-parameters/,https://trac.ffmpeg.org/wiki/Encode/VP8
```powershell
$WIDTH="1920"
$INP="fiery_gradient_divider_$($WIDTH)x200_raw.webm"
$OUTP="fiery_gradient_divider_$($WIDTH)x200_final.webm"
ffmpeg -hide_banner -i "$($INP)" -vf "colorkey=black:0.02:0.15,format=yuva420p,select='not(eq(n\,0))'" -c:v libvpx -deadline best -crf 25 -qmin 0 -qmax 42 -b:v 7M -pix_fmt yuva420p -metadata:s:v:0 alpha_mode="1" -auto-alt-ref 0 -lag-in-frames 12 -pass 1 -f null NUL && ffmpeg -hide_banner -i "$($INP)" -vf "colorkey=black:0.02:0.15,format=yuva420p,select='not(eq(n\,0))'" -c:v libvpx -deadline best -crf 25 -qmin 0 -qmax 42 -b:v 7M -pix_fmt yuva420p -metadata:s:v:0 alpha_mode="1" -auto-alt-ref 0 -lag-in-frames 12 -pass 2 "$($OUTP)" && rm ffmpeg2pass-0.log
```
VP8 -> VP9 (PowerShell syntax) : // https://trac.ffmpeg.org/wiki/Encode/VP9, https://www.reddit.com/r/AV1/comments/k7colv/encoder_tuning_part_1_tuning_libvpxvp9_be_more/
```powershell
$WIDTH="1280"
$INP="fiery_gradient_divider_$($WIDTH)x200_raw.webm"
$OUTP="fiery_gradient_divider_$($WIDTH)x200_final.webm"
ffmpeg -hide_banner -i "$($INP)" -vf "select='not(eq(n\,0))'" -c:v libvpx-vp9 -deadline best -crf 20 -b:v 0 -metadata:s:v:0 alpha_mode="1" -auto-alt-ref 0 -lag-in-frames 12 -row-mt 1 -pass 1 -f null NUL && ffmpeg -hide_banner -i "$($INP)" -vf "select='not(eq(n\,0))'" -c:v libvpx-vp9 -deadline best -crf 20 -b:v 0 -metadata:s:v:0 alpha_mode="1" -auto-alt-ref 0 -lag-in-frames 12 -row-mt 1 -pass 2 "$($OUTP)" && rm ffmpeg2pass-0.log
```
https://jakearchibald.com/2024/video-with-transparency/
AV1 doesn't seem worth the hassle...

Conversion script:
WARNING: GenAI-generated code (Claude Sonnet 4.5)!
```powershell
# Configuration
$widths = @(640, 800, 1024, 1280, 1360, 1366, 1440, 1536, 1600, 1680, 1920, 2048, 2560, 3440, 3840)
$height = 200

# Create output directories if they don't exist
New-Item -ItemType Directory -Force -Path "processed\VP8" | Out-Null
New-Item -ItemType Directory -Force -Path "processed\VP9" | Out-Null

Write-Host "Starting batch conversion..." -ForegroundColor Green
Write-Host "Total resolutions to process: $($widths.Count)" -ForegroundColor Cyan

$totalFiles = $widths.Count * 2  # VP8 and VP9 for each width
$currentFile = 0

foreach ($width in $widths) {
    $inputFile = "fiery_gradient_divider_${width}x${height}_original.webm"

    # Check if input file exists
    if (-Not (Test-Path $inputFile)) {
        Write-Host "Warning: $inputFile not found! Skipping..." -ForegroundColor Yellow
        continue
    }

    Write-Host "`n=== Processing ${width}x${height} ===" -ForegroundColor Cyan

    # VP8 Conversion
    $currentFile++
    Write-Host "[$currentFile/$totalFiles] Converting to VP8..." -ForegroundColor Magenta
    $outputVP8 = "processed\VP8\fiery_gradient_divider_${width}x${height}_alpha_vp8.webm"

    & ffmpeg -hide_banner -i $inputFile `
        -vf "colorkey=black:0.02:0.15,format=yuva420p" `
        -c:v libvpx `
        -cpu-used 12 `
        -crf 12 `
        -qmin 0 `
        -qmax 12 `
        -b:v 10M `
        -pix_fmt yuva420p `
        -metadata:s:v:0 alpha_mode="1" `
        -auto-alt-ref 0 `
        $outputVP8

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ VP8 conversion complete: $outputVP8" -ForegroundColor Green
    } else {
        Write-Host "✗ VP8 conversion failed!" -ForegroundColor Red
    }

    # VP9 Conversion
    $currentFile++
    Write-Host "[$currentFile/$totalFiles] Converting to VP9..." -ForegroundColor Magenta
    $outputVP9 = "processed\VP9\fiery_gradient_divider_${width}x${height}_alpha_vp9.webm"

    & ffmpeg -hide_banner -i $inputFile `
        -vf "colorkey=black:0.02:0.15,format=yuva420p" `
        -c:v libvpx-vp9 `
        -cpu-used 8 `
        -crf 12 `
        -qmin 0 `
        -qmax 12 `
        -b:v 10M `
        -pix_fmt yuva420p `
        -row-mt 1 `
        $outputVP9

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ VP9 conversion complete: $outputVP9" -ForegroundColor Green
    } else {
        Write-Host "✗ VP9 conversion failed!" -ForegroundColor Red
    }
}

Write-Host "`n=== All conversions complete! ===" -ForegroundColor Green
Write-Host "VP8 files: processed\VP8\" -ForegroundColor Cyan
Write-Host "VP9 files: processed\VP9\" -ForegroundColor Cyan
```



```js


// Usage:
// recordCanvas(1600, 200);
// recordCanvas(3200, 200);
// etc.
```

// https://www.reddit.com/r/ffmpeg/comments/1lgj7cc/png_sequence_to_webm_preserving_transparency/
// https://stackoverflow.com/a/78094269
// either photo, picture, or default.
// claude.ai's landing video is ~8 secs
```
ffmpeg -hide_banner -i "fiery_gradient_divider_1920x200_raw.webm" -c:v libwebpw_anim -t 8 -loop 0 -vf "colorkey=black:0.02:0.15,fps=24,scale=1920:200,format=yuva420p" -pix_fmt yuva420p -preset photo -lossless 0 -compression_level 6 -quality 82 "fiery_gradient_divider_1920x200_q82_24fps_8s_p_photo_temp.webp"
```

// https://superuser.com/a/1765767
WARNING: Based on GenAI-generated command (claude-4.5-sonnet)!
getting the 1px image lmao :
apparently WebP (or libwebp) can't encode on resolution smaller than 2x2
3836 and 396 is from 3840x400 (the apparently actual resolution of the recorded video) - 4
100 is from the LLM lol idk
we have to use WebP here too, otherwise the colors look a bit different
```
ffmpeg -hide_banner -i "fiery_gradient_divider_1920x200_raw.webm" -c:v libaom-av1 -still-picture 1 -vf "select=eq(n\,100),crop=2:2:3836:396,colorkey=black:0.02:0.15,format=yuva420p" -frames:v 1 -pix_fmt yuva420p "card_bg_2x2.avif"
```
```
ffmpeg -hide_banner -i "fiery_gradient_divider_1920x200_raw.webm" -c:v libwebp -vf "select=eq(n\,100),crop=2:2:3836:396,colorkey=black:0.02:0.15,format=yuva420p" -frames:v 1 -pix_fmt yuva420p -preset photo -lossless 0 -compression_level 6 -quality 82 "card_bg_2x2.webp"
```

Making the favicon.ico
```
ffmpeg -hide_banner -i "favicon.png" -c:v webp -vf "colorkey=white:0.02:0.0,format=yuva420p" -pix_fmt yuva420p -preset photo -lossless 1 -compression_level 6 favicon.webp
```

creating the new anim :
```
ffmpeg -hide_banner -i "fiery_gradient_divider_1920x200_raw.webm" -r 24 -t 8 -vf "colorkey=black:0.02:0.15,fps=24,scale=1920:200" out/frame_%05d.png
```
WARNING: Based on GenAI-generated command (Perplexity) :
```
ffmpeg -hide_banner -framerate 24 -i "out/frame_%05d.png" -filter_complex "[0:v]alphaextract[a]" -map 0:v -map "[a]" -c:v libaom-av1 -crf 37 -crf:1 63 -row-mt 1 -cpu-used 8 "fiery_gradient_divider_1920x200_c37_24fps_8s.avif"
```
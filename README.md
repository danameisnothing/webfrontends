Some files are tracked via Git LFS!

```
git lfs track "*.ttf,*.woff2,*.png,*.jpg,*.jpeg,*.jxl,*.webp,*.avif,*.webm"
```
```
git lfs migrate import --include="*.ttf,*.woff2,*.png,*.jpg,*.jpeg,*.jxl,*.webp,*.avif,*.webm" --everything
```

Replit's Git GUI doesn't work with Git LFS...

temp to push to Git with LFS
```
git lfs migrate import --include="*.ttf,*.woff2,*.png,*.jpg,*.jpeg,*.jxl,*.webp,*.avif" --everything
```
and
```
git push --force
```

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
var width = "1600";
var height = "200";
var canvas = document.querySelector(`canvas[width="${width}"][height="${height}"]`);
var stream = canvas.captureStream(120);

var mimeTypes = [
    'video/webm;codecs=vp8' // for lightweightness
];

var supportedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));
console.log('Using codec:', supportedMimeType);

var recorder = new MediaRecorder(stream, {
    mimeType: supportedMimeType,
    videoBitsPerSecond: 30000000
});

var chunks = [];
recorder.ondataavailable = (e) => chunks.push(e.data);

recorder.onstop = () => {
    var blob = new Blob(chunks, { type: supportedMimeType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = `fiery_gradient_divider_${width}x${height}_original.webm`;
    a.click();
};

recorder.start();
setTimeout(() => {
    console.log("Stopping recording...");
    recorder.stop();
}, 1*60*1000);
```

Processing the video :
(we don't need these to be high-quality, nor particularly efficient)
VP8 -> VP8:
```
ffmpeg -hide_banner -i "fiery_gradient_divider_800x200_original.webm" -vf "colorkey=black:0.02:0.15,format=yuva420p" -c:v libvpx -cpu-used 12 -crf 12 -qmin 0 -qmax 12 -b:v 10M -pix_fmt yuva420p -metadata:s:v:0 alpha_mode="1" -auto-alt-ref 0 "processed/fiery_gradient_divider_800x200_alpha_vp8.webm"
```
VP8 -> VP9:
```
ffmpeg -hide_banner -i "fiery_gradient_divider_800x200_original.webm" -vf "colorkey=black:0.02:0.15,format=yuva420p" -c:v libvpx-vp9 -cpu-used 8 -crf 12 -qmin 0 -qmax 12 -b:v 10M -pix_fmt yuva420p -row-mt 1 "processed/fiery_gradient_divider_800x200_alpha_vp9.webm"
```
https://jakearchibald.com/2024/video-with-transparency/
AV1 doesn't seem worth the hassle...


New script :
WARNING: Based on GenAI-generated code (Claude Sonnet 4.5)!
```js
// taken from Wikipedia en.wikipedia.org/wiki/Display_resolution#Common_display_resolutions

function recordCanvas(width, height, lengthec) {
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
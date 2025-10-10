Some files are tracked via Git LFS!

```
git lfs track "*.ttf,*.woff2,*.png,*.jpg,*.jpeg,*.jxl,*.webp,*.avif"
```
```
git lfs migrate import --include="*.ttf,*.woff2,*.png,*.jpg,*.jpeg,*.jxl,*.webp,*.avif" --everything
```

Replit's Git GUI doesn't work with Git LFS...

Images are lossily transcoded with these commands :
AVIF :
```
avifenc --speed 0 --jobs all -a tune=ssim -a cq-level=18 woolhaven-bg-poster.png woolhaven-bg-poster.avif
```
(the FFmpeg wiki says 23 is visually lossless, but not quite : https://trac.ffmpeg.org/wiki/Encode/AV1)

JPEG XL looks worse than AVIF :( (lossily at least)


Capturing the noise :
Recorded on a 4:1 aspect ratio
WARNING: Based on GenAI-generated code (gemini-2.5-pro)!
"optimize" the page first
```js
// Select the body element
const body = document.body;

// Create a static list of top-level children to iterate over
const topLevelChildren = Array.from(body.children);

// Remove all top-level children except for the div with id "__next"
topLevelChildren.forEach(child => {
    if (child.id !== '__next') {
        body.removeChild(child);
    }
});

// Find the main container div
const nextDiv = document.getElementById('__next');

if (nextDiv) {
    // Find and remove the header with class "css-ynbrw"
    const header = nextDiv.querySelector('header.css-ynbrw');
    if (header) {
        header.parentNode.removeChild(header);
    }

    // Find the div with class "css-pw7jst"
    const containerDiv = nextDiv.querySelector('div.css-pw7jst');

    if (containerDiv) {
        // Create a static list of its children
        const containerChildren = Array.from(containerDiv.children);

        // Remove children unless they are the specified sections
        containerChildren.forEach(child => {
            const isTrailerSection = child.tagName === 'SECTION' && child.id === 'trailer';
            const isLyef3hSection = child.tagName === 'SECTION' && child.classList.contains('css-lyef3h');

            if (!isTrailerSection && !isLyef3hSection) {
                containerDiv.removeChild(child);
            }
        });
    }
}
```

capture in VP8 :
WARNING: Based on GenAI-generated code (Claude Sonnet 4.5)!
```js
var canvas = document.querySelector('canvas[width="1600"][height="400"]');
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
    a.download = 'up.webm';
    a.click();
};

recorder.start();
setTimeout(() => {
    console.log("Stopping recording...");
    recorder.stop();
}, 5*60*1000);
```
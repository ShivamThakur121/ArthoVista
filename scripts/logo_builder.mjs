import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/' || req.url === '/index.html') {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Logo Generator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=Mukta:wght@600;700;800&family=Noto+Sans+Devanagari:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Poppins', sans-serif; background: #0f172a; color: white; padding: 20px; }
    canvas { border: 1px solid #475569; margin: 10px 0; background: transparent; }
    .preview { background: #0b1329; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .preview-light { background: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>ArthoVista Logo Processor</h1>
  <div id="status">Loading fonts and source image...</div>

  <div class="preview">
    <h3>Dark Background Preview</h3>
    <div id="preview-dark"></div>
  </div>

  <div class="preview-light">
    <h3 style="color: black">Light Background Preview</h3>
    <div id="preview-light"></div>
  </div>

  <script>
    async function init() {
      await Promise.all([
        document.fonts.load("800 68px 'Poppins'"),
        document.fonts.load("700 38px 'Mukta'"),
        document.fonts.load("700 38px 'Noto Sans Devanagari'")
      ]);
      await document.fonts.ready;
      document.getElementById('status').innerText = 'Processing image...';

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = '/source-logo';
      
      img.onload = async () => {
        // 1. Crop emblem from source image (upper section, approx y < 460)
        const srcCanvas = document.createElement('canvas');
        srcCanvas.width = img.width;
        srcCanvas.height = img.height;
        const srcCtx = srcCanvas.getContext('2d');
        srcCtx.drawImage(img, 0, 0);

        const fullSrcData = srcCtx.getImageData(0, 0, img.width, Math.floor(img.height * 0.60));
        const fullPixels = fullSrcData.data;

        // Automatically find lowest point of the green leaf / swoosh of the emblem
        let maxLeafY = 0;
        for (let y = 0; y < fullSrcData.height; y++) {
          for (let x = 0; x < fullSrcData.width; x++) {
            const idx = (y * fullSrcData.width + x) * 4;
            const r = fullPixels[idx];
            const g = fullPixels[idx + 1];
            const b = fullPixels[idx + 2];
            // Green leaf signature: dominant green
            if (g > 110 && g > r * 1.15 && g > b * 1.15) {
              if (y > maxLeafY) maxLeafY = y;
            }
          }
        }

        const safeCutoffY = maxLeafY > 0 ? maxLeafY + 4 : Math.floor(img.height * 0.45);
        const srcData = srcCtx.getImageData(0, 0, img.width, safeCutoffY);
        const pixels = srcData.data;

        // Find bounding box of colored/dark pixels of the emblem in upper section
        let minX = img.width, maxX = 0, minY = img.height, maxY = 0;

        for (let y = 0; y < srcData.height; y++) {
          for (let x = 0; x < srcData.width; x++) {
            const idx = (y * srcData.width + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            
            const maxVal = Math.max(r, g, b);
            const minVal = Math.min(r, g, b);
            const saturation = maxVal - minVal;
            const brightness = (r + g + b) / 3;

            // Is actual logo element (vibrant orange/green/blue or shadow)
            if (saturation > 25 || brightness < 210) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        // Add 4px padding
        minX = Math.max(0, minX - 4);
        maxX = Math.min(srcData.width - 1, maxX + 4);
        minY = Math.max(0, minY - 4);
        maxY = Math.min(srcData.height - 1, maxY + 4);

        const emblemWidth = maxX - minX + 1;
        const emblemHeight = maxY - minY + 1;

        // Extract emblem and make background transparent
        const emblemCanvas = document.createElement('canvas');
        emblemCanvas.width = emblemWidth;
        emblemCanvas.height = emblemHeight;
        const emblemCtx = emblemCanvas.getContext('2d');

        const emblemImgData = emblemCtx.createImageData(emblemWidth, emblemHeight);
        const emblemPixels = emblemImgData.data;

        for (let y = 0; y < emblemHeight; y++) {
          for (let x = 0; x < emblemWidth; x++) {
            const srcIdx = ((minY + y) * srcData.width + (minX + x)) * 4;
            const dstIdx = (y * emblemWidth + x) * 4;

            const r = pixels[srcIdx];
            const g = pixels[srcIdx + 1];
            const b = pixels[srcIdx + 2];

            const maxVal = Math.max(r, g, b);
            const minVal = Math.min(r, g, b);
            const saturation = maxVal - minVal;
            const avgVal = (r + g + b) / 3;

            if (saturation < 20 && minVal > 215) {
              // Completely transparent background
              emblemPixels[dstIdx] = 255;
              emblemPixels[dstIdx + 1] = 255;
              emblemPixels[dstIdx + 2] = 255;
              emblemPixels[dstIdx + 3] = 0;
            } else if (saturation < 35 && minVal > 185) {
              // Soft anti-aliased edge
              const alpha = Math.max(0, Math.min(1, (255 - avgVal) / 60));
              const a255 = Math.floor(alpha * 255);
              
              const unR = Math.min(255, Math.max(0, Math.round((r - 255 * (1 - alpha)) / alpha)));
              const unG = Math.min(255, Math.max(0, Math.round((g - 255 * (1 - alpha)) / alpha)));
              const unB = Math.min(255, Math.max(0, Math.round((b - 255 * (1 - alpha)) / alpha)));

              emblemPixels[dstIdx] = unR;
              emblemPixels[dstIdx + 1] = unG;
              emblemPixels[dstIdx + 2] = unB;
              emblemPixels[dstIdx + 3] = a255;
            } else {
              // Solid colored pixel
              emblemPixels[dstIdx] = r;
              emblemPixels[dstIdx + 1] = g;
              emblemPixels[dstIdx + 2] = b;
              emblemPixels[dstIdx + 3] = 255;
            }
          }
        }

        emblemCtx.putImageData(emblemImgData, 0, 0);

        // Function to create full horizontal logo
        function createHorizontalLogo(isDark) {
          const hCanvas = document.createElement('canvas');
          const targetHeight = 180;
          const scale = targetHeight / emblemHeight;
          const targetEmblemWidth = emblemWidth * scale;

          // Compute canvas width
          const gap = 24;
          const textX = targetEmblemWidth + gap;

          // Temporary canvas to measure text
          const tempCtx = hCanvas.getContext('2d');
          tempCtx.font = "bold 68px 'Poppins', 'Inter', sans-serif";
          const titleMetrics = tempCtx.measureText("Artho Vista");
          
          tempCtx.font = "700 38px 'Mukta', 'Noto Sans Devanagari', 'Poppins', sans-serif";
          const subtitleMetrics = tempCtx.measureText("सपनों से समृद्धि तक");

          const textWidth = Math.max(titleMetrics.width, subtitleMetrics.width);
          const totalWidth = Math.ceil(textX + textWidth + 24);

          hCanvas.width = totalWidth;
          hCanvas.height = targetHeight + 10;
          const hCtx = hCanvas.getContext('2d');
          hCtx.imageSmoothingEnabled = true;
          hCtx.imageSmoothingQuality = 'high';

          // Draw emblem
          hCtx.drawImage(emblemCanvas, 0, 5, targetEmblemWidth, targetHeight);

          // Draw Title "Artho Vista"
          hCtx.font = "800 68px 'Poppins', 'Inter', sans-serif";
          hCtx.textBaseline = "top";
          if (isDark) {
            hCtx.fillStyle = "#FFFFFF";
          } else {
            hCtx.fillStyle = "#0f172a"; // Deep Slate
          }
          hCtx.fillText("Artho Vista", textX, 16);

          // Draw Subtitle "सपनों से समृद्धि तक"
          hCtx.font = "700 38px 'Mukta', 'Noto Sans Devanagari', 'Poppins', sans-serif";
          hCtx.fillStyle = isDark ? "#10b981" : "#059669"; // Emerald Green
          hCtx.fillText("सपनों से समृद्धि तक", textX, 100);

          return hCanvas;
        }

        const darkLogoCanvas = createHorizontalLogo(true);
        const lightLogoCanvas = createHorizontalLogo(false);

        // Create square icon canvas (for favicon & app icon)
        const iconCanvas = document.createElement('canvas');
        const iconSize = 512;
        iconCanvas.width = iconSize;
        iconCanvas.height = iconSize;
        const iconCtx = iconCanvas.getContext('2d');
        iconCtx.imageSmoothingEnabled = true;
        iconCtx.imageSmoothingQuality = 'high';

        const iconScale = Math.min((iconSize - 32) / emblemWidth, (iconSize - 32) / emblemHeight);
        const scaledW = emblemWidth * iconScale;
        const scaledH = emblemHeight * iconScale;
        const iconX = (iconSize - scaledW) / 2;
        const iconY = (iconSize - scaledH) / 2;
        iconCtx.drawImage(emblemCanvas, iconX, iconY, scaledW, scaledH);

        // Display previews
        document.getElementById('preview-dark').appendChild(darkLogoCanvas);
        document.getElementById('preview-light').appendChild(lightLogoCanvas);

        // Export PNG Data URLs
        const dataDark = darkLogoCanvas.toDataURL('image/png');
        const dataLight = lightLogoCanvas.toDataURL('image/png');
        const dataIcon = iconCanvas.toDataURL('image/png');
        const dataEmblemOnly = emblemCanvas.toDataURL('image/png');

        // Post to server
        document.getElementById('status').innerText = 'Saving generated assets...';
        const response = await fetch('/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            darkLogo: dataDark,
            lightLogo: dataLight,
            iconLogo: dataIcon,
            emblemOnly: dataEmblemOnly
          })
        });

        const resJson = await response.json();
        document.getElementById('status').innerHTML = '<h2 style="color:#22c55e">✅ Logos successfully created and saved!</h2>';
      };
    }
    window.onload = init;
  </script>
</body>
</html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  if (req.url === '/source-logo') {
    const filePath = path.join(rootDir, 'public', 'logo.jpg');
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(data);
    return;
  }

  if (req.url === '/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);

        function saveBase64(base64Str, relPath) {
          const raw = base64Str.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(raw, 'base64');
          const dest = path.join(rootDir, relPath);
          fs.writeFileSync(dest, buffer);
          console.log(`Saved: ${relPath} (${buffer.length} bytes)`);
        }

        // 1. Save dark horizontal logo (white text for dark headers / dark mode)
        saveBase64(payload.darkLogo, 'public/logo-white.png');
        saveBase64(payload.darkLogo, 'public/logo-dark.png'); // for dark backgrounds

        // 2. Save light horizontal logo (dark text for light headers)
        saveBase64(payload.lightLogo, 'public/logo-light.png');

        // 3. Save universal logo as default public/logo.png & src/assets/logo.png
        saveBase64(payload.darkLogo, 'public/logo.png');
        saveBase64(payload.darkLogo, 'src/assets/logo.png');

        // 4. Save clean emblem icon
        saveBase64(payload.emblemOnly, 'public/logo-emblem.png');
        saveBase64(payload.iconLogo, 'public/logo-icon.png');
        saveBase64(payload.iconLogo, 'public/favicon.png');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'All logo files saved!' }));

        console.log('🎉 Logo generator completed successfully!');
        setTimeout(() => {
          process.exit(0);
        }, 1500);
      } catch (err) {
        console.error('Save error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const PORT = 3998;
server.listen(PORT, () => {
  console.log(`Logo builder server listening at http://localhost:${PORT}`);
});

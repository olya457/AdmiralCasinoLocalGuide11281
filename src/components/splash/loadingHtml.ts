export const loadingHtml = `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<style>
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}
body {
  display: flex;
  align-items: center;
  justify-content: center;
}
.track {
  width: calc(100% - 16px);
  height: 7px;
  overflow: hidden;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 12px rgba(255, 213, 0, 0.18);
}
.fill {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f2b900, #ffda19, #fff19a);
  transform: scaleX(0);
  transform-origin: left center;
  animation: loading 4s linear forwards;
}
@keyframes loading {
  to { transform: scaleX(1); }
}
</style>
</head>
<body>
<div class="track" role="progressbar" aria-label="Loading">
  <div class="fill"></div>
</div>
<script>
document.querySelector('.fill').addEventListener('animationend', function () {
  window.ReactNativeWebView.postMessage('finished');
}, { once: true });
</script>
</body>
</html>`;

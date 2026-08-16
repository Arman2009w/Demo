/**
 * Shared image compression helper — used by any form that lets a visitor
 * upload a school photo (js/register.js, js/profile.js). Since this site
 * has no backend, images are stored as data URLs in localStorage, so this
 * resizes/compresses client-side to keep that reasonable.
 */

(function () {
  "use strict";

  function compressImage(file, maxDimension, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality || 0.82));
        };
        img.onerror = () => reject(new Error("Could not decode image"));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });
  }

  window.KnotImageUtils = { compressImage };
})();

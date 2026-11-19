import { fabric } from "fabric";

// Loads a gallery template (invitation / greeting / certificate) straight from the live site
// (https://eventcert.com/...). No backend and no proxy.
// The live server must send "Access-Control-Allow-Origin", otherwise the browser blocks the
// canvas. If it does not, the message below says so.

const diagnose = async (url) => {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return `HTTP ${res.status} - this image does not exist on the live site (${url}).`;
    return `The image downloaded but could not be opened (${url}).`;
  } catch {
    return "The live site (eventcert.com) is not allowing this page to use its images. Add the Access-Control-Allow-Origin header on eventcert.com (web.config), then hard-refresh.";
  }
};

export const loadTemplateImage = (url) =>
  new Promise((resolve, reject) => {
    fabric.Image.fromURL(
      url,
      async (img, isError) => {
        if (!isError && img && img.width) {
          resolve(img);
          return;
        }
        reject(new Error(await diagnose(url)));
      },
      { crossOrigin: "anonymous" }
    );
  });

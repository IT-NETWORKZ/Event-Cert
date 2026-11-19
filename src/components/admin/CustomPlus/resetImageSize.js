// Reset Image Size - works for every image source:
//   Upload Design, Recent, Invitation, Greeting, Certificate (and any other image on the canvas)
// The canvas is set back to the image's own shape and the image fills it edge to edge.

export const MAX_DESIGN_DIMENSION = 2000; // same limit Upload Design uses

const isImage = (o) => !!o && o.type === "image";
const isSmallItem = (o) => o.isLogoImage || o.isStickerImage;

// real (natural) pixel size of the picture, whatever flags it has
const naturalSize = (img) => {
  const el = img._originalElement || (img.getElement && img.getElement());
  const w = el?.naturalWidth || el?.width || img.originalWidth || img.width;
  const h = el?.naturalHeight || el?.height || img.originalHeight || img.height;
  return { w, h };
};

// 1. the template / design picture  2. the selected image  3. the biggest image on the canvas
export const findResetTarget = (canvas) => {
  const images = canvas.getObjects().filter(isImage);
  if (!images.length) return null;

  const template = images.find(
    (o) => o.isDesignImage || o.isInvitationImage || o.isCertificateImage
  );
  if (template) return template;

  const active = canvas.getActiveObject();
  if (isImage(active) && !isSmallItem(active)) return active;

  const area = (o) => o.getScaledWidth() * o.getScaledHeight();
  const big = images.filter((o) => !isSmallItem(o));
  return (big.length ? big : images).sort((a, b) => area(b) - area(a))[0];
};

// returns { width, height } or null when there is no image
export const resetImageSize = ({ canvas, setCanvasSize, setPages, activePage }) => {
  if (!canvas) return null;

  const image = findResetTarget(canvas);
  if (!image) return null;

  const { w, h } = naturalSize(image);
  if (!w || !h) return null;

  const ratio = Math.min(1, MAX_DESIGN_DIMENSION / Math.max(w, h));
  const width = Math.round(w * ratio);
  const height = Math.round(h * ratio);

  canvas.discardActiveObject();
  canvas.setDimensions({ width, height });
  if (typeof setCanvasSize === "function") setCanvasSize({ width, height });

  // keep the page record in sync so switching pages does not bring the old size back
  if (typeof setPages === "function") {
    setPages((prev) => prev.map((p) => (p.id === activePage ? { ...p, width, height } : p)));
  }

  image.set({
    left: 0,
    top: 0,
    angle: 0,
    flipX: false,
    flipY: false,
    scaleX: width / w,
    scaleY: height / h,
  });
  image.setCoords();
  image.sendToBack(); // text and logos stay on top
  canvas.requestRenderAll();
  canvas.__history?.save();

  return { width, height };
};

// Used when a picture is chosen (Invitation / Greeting / Certificate ...):
// the canvas takes the picture's shape automatically and the picture fills it edge to edge.
// Any earlier template / design picture on the page is replaced. Returns { width, height }.
const TEMPLATE_FLAGS = ["isInvitationImage", "isCertificateImage", "isDesignImage"];

export const fitCanvasToImage = ({ canvas, img, setCanvasSize, setPages, activePage, flags = {} }) => {
  const w = img.width;
  const h = img.height;
  const ratio = Math.min(1, MAX_DESIGN_DIMENSION / Math.max(w, h));
  const width = Math.round(w * ratio);
  const height = Math.round(h * ratio);

  canvas.discardActiveObject();
  canvas.setDimensions({ width, height });
  if (typeof setCanvasSize === "function") setCanvasSize({ width, height });
  if (typeof setPages === "function") {
    setPages((prev) => prev.map((p) => (p.id === activePage ? { ...p, width, height } : p)));
  }

  // one template picture per page: remove the previous one
  canvas
    .getObjects()
    .filter((o) => TEMPLATE_FLAGS.some((f) => o[f]))
    .forEach((o) => canvas.remove(o));

  img.set({
    left: 0,
    top: 0,
    scaleX: width / w,
    scaleY: height / h,
    selectable: true,
    evented: true,
    hasControls: true,
    hasBorders: true,
    originalWidth: w,
    originalHeight: h,
    ...flags,
  });

  canvas.add(img);
  img.sendToBack(); // text and logos stay on top
  canvas.setActiveObject(img);
  canvas.requestRenderAll();

  return { width, height };
};

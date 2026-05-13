import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Slider, Space, Spin, Upload, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getUploadErrorMessage, uploadProjectImage } from "../../services/media.api";
import { toBackendAssetUrl } from "../../utils/media";
import { notifyError } from "../../utils/notify";

const MAX_OUTPUT_WIDTH = 1920;
const MAX_PREVIEW_SIDE = 4096;
const LARGE_FILE_BYTES = 10 * 1024 * 1024;
const MAX_UPLOAD_BYTES = Math.max(1, Number(import.meta.env.VITE_MAX_UPLOAD_MB || 8)) * 1024 * 1024;
const ESTIMATE_QUALITY_STEPS = [100, 90, 80, 75, 70, 60, 50, 40, 30];

let encodeChain = Promise.resolve();

function runExclusiveEncode(task) {
  const result = encodeChain.then(task);
  encodeChain = result.catch(() => {});
  return result;
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Cannot load image"));
    image.src = src;
  });
}

async function canvasToBlobUrl(canvas, type = "image/jpeg", quality = 0.92) {
  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
  if (!blob) throw new Error("Cannot prepare image preview");
  return URL.createObjectURL(blob);
}

async function bitmapToBlobUrl(bitmap, type = "image/jpeg", quality = 0.92) {
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close?.();
    throw new Error("Cannot prepare image preview");
  }
  context.drawImage(bitmap, 0, 0);
  bitmap.close?.();
  return canvasToBlobUrl(canvas, type, quality);
}

async function prepareImageForCrop(file) {
  const shouldDownscale = file.size > LARGE_FILE_BYTES;

  if (!shouldDownscale) {
    const objectUrl = URL.createObjectURL(file);
    try {
      const image = await loadImageElement(objectUrl);
      if (image.naturalWidth <= MAX_PREVIEW_SIDE && image.naturalHeight <= MAX_PREVIEW_SIDE) {
        return objectUrl;
      }
    } catch {
      // Fall through to downscale path.
    }
    URL.revokeObjectURL(objectUrl);
  }

  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, {
        resizeWidth: MAX_PREVIEW_SIDE,
        resizeQuality: "high",
      });
      if (bitmap.width <= MAX_PREVIEW_SIDE && bitmap.height <= MAX_PREVIEW_SIDE) {
        return bitmapToBlobUrl(bitmap);
      }
      const scale = Math.min(MAX_PREVIEW_SIDE / bitmap.width, MAX_PREVIEW_SIDE / bitmap.height, 1);
      const resized = await createImageBitmap(bitmap, {
        resizeWidth: Math.max(1, Math.round(bitmap.width * scale)),
        resizeHeight: Math.max(1, Math.round(bitmap.height * scale)),
        resizeQuality: "high",
      });
      bitmap.close();
      return bitmapToBlobUrl(resized);
    } catch {
      // Fall through to canvas downscale.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImageElement(objectUrl);
    const scale = Math.min(
      MAX_PREVIEW_SIDE / image.naturalWidth,
      MAX_PREVIEW_SIDE / image.naturalHeight,
      1,
    );
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Cannot prepare image preview");
    context.drawImage(image, 0, 0, width, height);
    URL.revokeObjectURL(objectUrl);
    return canvasToBlobUrl(canvas);
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

function formatBytes(value) {
  const size = Number(value || 0);
  if (!size) return "0 B";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function cloneCanvas(sourceCanvas) {
  const canvas = document.createElement("canvas");
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Cannot clone canvas");
  context.drawImage(sourceCanvas, 0, 0);
  return canvas;
}

function resizeCanvasToMaxWidth(sourceCanvas, maxWidth) {
  if (!sourceCanvas?.width || !sourceCanvas?.height) {
    throw new Error("Invalid canvas");
  }

  const scale = Math.min(maxWidth / sourceCanvas.width, 1);
  if (scale >= 1) {
    return sourceCanvas;
  }

  const width = Math.max(1, Math.round(sourceCanvas.width * scale));
  const height = Math.max(1, Math.round(sourceCanvas.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Cannot resize canvas");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(sourceCanvas, 0, 0, width, height);
  return canvas;
}

function prefersJpegEncoding() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR|CriOS|FxiOS/i.test(ua);
}

function isEfficientWebpBlob(blob, width, height, quality) {
  if (!blob || blob.type !== "image/webp") return false;
  const pixels = Math.max(1, width * height);
  const normalizedQuality = Math.max(0.01, Math.min(1, quality / 100));
  const maxBytes = Math.max(512 * 1024, pixels * 0.45 * normalizedQuality);
  return blob.size <= maxBytes;
}

async function encodeCanvasBlob(canvas, quality) {
  const normalizedQuality = Math.max(0.01, Math.min(1, quality / 100));
  const outputCanvas = cloneCanvas(canvas);
  const tryEncode = (type) =>
    new Promise((resolve) => {
      outputCanvas.toBlob(resolve, type, normalizedQuality);
    });

  if (!prefersJpegEncoding()) {
    const webpBlob = await tryEncode("image/webp");
    if (isEfficientWebpBlob(webpBlob, outputCanvas.width, outputCanvas.height, quality)) {
      return { blob: webpBlob, mimeType: "image/webp", extension: "webp" };
    }
  }

  const jpegBlob = await tryEncode("image/jpeg");
  if (jpegBlob && (!jpegBlob.type || jpegBlob.type === "image/jpeg")) {
    return { blob: jpegBlob, mimeType: "image/jpeg", extension: "jpg" };
  }

  throw new Error("Cannot encode image");
}

async function buildEstimateProfile(canvas) {
  const profile = [];
  let bestSizeSoFar = Number.POSITIVE_INFINITY;

  for (const stepQuality of ESTIMATE_QUALITY_STEPS) {
    const encoded = await encodeCanvasBlob(canvas, stepQuality);
    let size = encoded.blob.size;
    if (size > bestSizeSoFar) {
      size = bestSizeSoFar;
    } else {
      bestSizeSoFar = size;
    }

    profile.push({
      quality: stepQuality,
      size,
      width: canvas.width,
      height: canvas.height,
      format: encoded.extension,
    });
  }

  return profile.sort((left, right) => left.quality - right.quality);
}

function lookupEstimateFromProfile(profile, quality) {
  if (!profile?.length) return null;

  const exact = profile.find((item) => item.quality === quality);
  if (exact) return exact;

  if (quality <= profile[0].quality) return { ...profile[0], quality };
  if (quality >= profile[profile.length - 1].quality) {
    return { ...profile[profile.length - 1], quality };
  }

  for (let index = 0; index < profile.length - 1; index += 1) {
    const lower = profile[index];
    const upper = profile[index + 1];
    if (quality < lower.quality || quality > upper.quality) continue;

    const ratio = (quality - lower.quality) / (upper.quality - lower.quality);
    const size = Math.round(lower.size + (upper.size - lower.size) * ratio);
    return {
      quality,
      size,
      width: upper.width,
      height: upper.height,
    };
  }

  return { ...profile[profile.length - 1], quality };
}

function getCroppedOutputCanvas(cropper) {
  const croppedCanvas = cropper.getCroppedCanvas({
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "high",
  });
  if (!croppedCanvas || !croppedCanvas.width || !croppedCanvas.height) {
    return null;
  }
  const resized = resizeCanvasToMaxWidth(croppedCanvas, MAX_OUTPUT_WIDTH);
  return cloneCanvas(resized);
}

async function canvasToUploadFile(canvas, baseName, quality) {
  const encoded = await encodeCanvasBlob(canvas, quality);
  return new File([encoded.blob], `${baseName}.${encoded.extension}`, { type: encoded.mimeType });
}

async function createCroppedUploadFile(canvas, baseName, quality) {
  const candidates = [];
  for (let nextQuality = quality; nextQuality >= 30; nextQuality -= 5) {
    candidates.push(nextQuality);
  }

  let bestFile = null;
  for (const nextQuality of candidates) {
    const file = await canvasToUploadFile(canvas, baseName, nextQuality);
    if (file.size > MAX_UPLOAD_BYTES) continue;
    if (!bestFile || nextQuality > bestFile.quality) {
      bestFile = { file, quality: nextQuality };
    }
  }
  if (bestFile) return bestFile.file;

  let smallestFile = null;
  for (const nextQuality of candidates) {
    const file = await canvasToUploadFile(canvas, baseName, nextQuality);
    if (!smallestFile || file.size < smallestFile.size) {
      smallestFile = file;
    }
  }
  if (smallestFile) return smallestFile;

  throw new Error(`Cannot compress image below ${formatBytes(MAX_UPLOAD_BYTES)}`);
}

function toFileList(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item, index) => ({
      uid: `${index}-${item.url || item}`,
      name: `image-${index + 1}`,
      status: "done",
      url: toBackendAssetUrl(item.url || item),
      response: { data: { url: item.url || item } },
    }));
  }
  const url = typeof value === "string" ? value : value.url;
  return [
    {
      uid: `single-${url}`,
      name: "image",
      status: "done",
      url: toBackendAssetUrl(url),
      response: { data: { url } },
    },
  ];
}

function parseAspectRatio(value) {
  if (!value || value === "free") return Number.NaN;
  if (typeof value === "number") return value > 0 ? value : Number.NaN;
  const parts = String(value).split(":").map((item) => Number(item.trim()));
  if (parts.length !== 2 || !parts[0] || !parts[1]) return Number.NaN;
  return parts[0] / parts[1];
}

function ImageUploader({ value, onChange, multiple = false, maxCount = 1, defaultRatio = "free" }) {
  const [quality, setQuality] = useState(75);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [sourceImage, setSourceImage] = useState("");
  const [sourceFile, setSourceFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preparingImage, setPreparingImage] = useState(false);
  const [estimatingSize, setEstimatingSize] = useState(false);
  const [liveCompressionInfo, setLiveCompressionInfo] = useState(null);
  const cropperRef = useRef(null);
  const estimateProfileRef = useRef([]);
  const estimateProfileSeqRef = useRef(0);
  const qualityRef = useRef(75);
  const previewUrlRef = useRef("");

  const revokePreviewUrl = () => {
    if (!previewUrlRef.current) return;
    URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = "";
  };

  useEffect(() => () => {
    revokePreviewUrl();
  }, []);

  const fileList = useMemo(() => toFileList(value), [value]);
  const aspectRatio = useMemo(() => parseAspectRatio(defaultRatio), [defaultRatio]);

  const pushUploadedUrl = (uploadedUrl) => {
    if (!uploadedUrl) return;
    if (!multiple) {
      onChange?.(uploadedUrl);
      return;
    }

    const current = Array.isArray(value) ? value : [];
    const next = [
      ...current,
      {
        url: uploadedUrl,
        crop_ratio: "",
        crop_mode: "free",
      },
    ].slice(0, maxCount);
    onChange?.(next);
  };

  const handleBeforeUpload = async (file) => {
    setPreparingImage(true);
    setCropModalOpen(true);
    setSourceFile(file);
    setSourceImage("");
    setLiveCompressionInfo(null);
    estimateProfileRef.current = [];
    revokePreviewUrl();

    try {
      const previewUrl = await prepareImageForCrop(file);
      previewUrlRef.current = previewUrl;
      setSourceImage(previewUrl);
    } catch (error) {
      setCropModalOpen(false);
      setSourceFile(null);
      notifyError(error?.message || "Cannot read image");
    } finally {
      setPreparingImage(false);
    }
    return Upload.LIST_IGNORE;
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setSourceImage("");
    setSourceFile(null);
    setLiveCompressionInfo(null);
    estimateProfileRef.current = [];
    setEstimatingSize(false);
    setPreparingImage(false);
    revokePreviewUrl();
  };

  const applyEstimateFromProfile = (nextQuality) => {
    const matched = lookupEstimateFromProfile(estimateProfileRef.current, nextQuality);
    if (!matched || !sourceFile) return;

    setLiveCompressionInfo({
      originalSize: sourceFile.size,
      outputSize: matched.size,
      quality: nextQuality,
      width: matched.width,
      height: matched.height,
      format: matched.format || "jpg",
    });
  };

  const rebuildEstimateProfile = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper || !sourceFile) return;

    estimateProfileSeqRef.current += 1;
    const runId = estimateProfileSeqRef.current;
    setEstimatingSize(true);

    await runExclusiveEncode(async () => {
      try {
        const outputCanvas = getCroppedOutputCanvas(cropper);
        if (!outputCanvas) return;

        const profile = await buildEstimateProfile(outputCanvas);
        if (runId !== estimateProfileSeqRef.current) return;

        estimateProfileRef.current = profile;
        applyEstimateFromProfile(qualityRef.current);
      } catch {
        // Ignore estimation failures; upload flow is still available.
      } finally {
        if (runId === estimateProfileSeqRef.current) {
          setEstimatingSize(false);
        }
      }
    });
  };

  const handleCropOk = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper || !sourceFile) return;

    setUploading(true);
    try {
      const outputCanvas = getCroppedOutputCanvas(cropper);
      if (!outputCanvas) {
        throw new Error("Cannot crop image");
      }

      const baseName = sourceFile.name.replace(/\.[^.]+$/, "") || "image";
      const croppedFile = await createCroppedUploadFile(outputCanvas, baseName, quality);
      const result = await uploadProjectImage(croppedFile);
      const uploadedUrl = result?.data?.url;

      pushUploadedUrl(uploadedUrl);
      handleCropCancel();
    } catch (error) {
      notifyError(getUploadErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (file) => {
    if (!multiple) {
      onChange?.("");
      return true;
    }

    const removedUrl = file?.response?.data?.url || file?.url;
    const current = Array.isArray(value) ? value : [];
    const next = current.filter((item) => (item.url || item) !== removedUrl);
    onChange?.(next);
    return true;
  };

  return (
    <Space orientation="vertical" style={{ width: "100%" }}>
      <Upload
        accept="image/*"
        listType="picture-card"
        fileList={fileList}
        beforeUpload={handleBeforeUpload}
        onRemove={handleRemove}
        multiple={multiple}
        maxCount={maxCount}
      >
        {fileList.length >= maxCount ? null : <PlusOutlined />}
      </Upload>

      <Modal
        title="Preview & Crop image"
        open={cropModalOpen}
        onCancel={handleCropCancel}
        onOk={handleCropOk}
        okButtonProps={{ loading: uploading, disabled: preparingImage || !sourceImage }}
        width={920}
      >
        <Space direction="vertical" size={12} style={{ width: "100%", marginBottom: 12 }}>
          <Space direction="vertical" size={2} style={{ width: "100%" }}>
            <Typography.Text type="secondary">Quality: {quality}%</Typography.Text>
            <Slider
              min={30}
              max={100}
              value={quality}
              onChange={(nextValue) => {
                const numericValue = Number(nextValue) || 75;
                qualityRef.current = numericValue;
                setQuality(numericValue);
                applyEstimateFromProfile(numericValue);
              }}
              onChangeComplete={(nextValue) => {
                const numericValue = Number(nextValue) || 75;
                qualityRef.current = numericValue;
                setQuality(numericValue);
                applyEstimateFromProfile(numericValue);
              }}
            />
          </Space>
          <Space direction="vertical" size={2}>
            <Typography.Text type="secondary">
              Original: {sourceFile ? formatBytes(sourceFile.size) : "0 B"}
            </Typography.Text>
            <Typography.Text type="secondary">
              Estimated: {estimatingSize
                ? "Calculating..."
                : liveCompressionInfo
                  ? `${formatBytes(liveCompressionInfo.outputSize)} (${liveCompressionInfo.width}x${liveCompressionInfo.height}, quality ${quality}%, ${String(liveCompressionInfo.format || "jpg").toUpperCase()})`
                  : "Preparing size estimate..."}
            </Typography.Text>
          </Space>
        </Space>
        <Spin spinning={preparingImage} tip="Preparing image preview...">
          <div style={{ minHeight: 460 }}>
            {sourceImage ? (
              <Cropper
                ref={cropperRef}
                src={sourceImage}
                style={{ height: 460, width: "100%" }}
                viewMode={1}
                autoCropArea={1}
                dragMode="move"
                aspectRatio={aspectRatio}
                guides
                cropBoxResizable
                cropBoxMovable
                responsive
                background={false}
                checkOrientation={false}
                ready={() => {
                  rebuildEstimateProfile();
                }}
                cropend={() => {
                  rebuildEstimateProfile();
                }}
              />
            ) : (
              <div style={{ height: 460 }} />
            )}
          </div>
        </Spin>
      </Modal>
    </Space>
  );
}

export { ImageUploader };

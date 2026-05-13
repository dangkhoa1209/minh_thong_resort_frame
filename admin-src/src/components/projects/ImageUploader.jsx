import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Slider, Space, Spin, Upload, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { uploadProjectImage } from "../../services/media.api";
import { toBackendAssetUrl } from "../../utils/media";
import { notifyError } from "../../utils/notify";

const MAX_OUTPUT_WIDTH = 1920;
const MAX_PREVIEW_SIDE = 4096;
const LARGE_FILE_BYTES = 10 * 1024 * 1024;

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

function getTargetDimensions(width, height) {
  if (!width || !height) return { width: 0, height: 0 };
  const scale = Math.min(MAX_OUTPUT_WIDTH / width, 1);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
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
  const [liveCompressionInfo, setLiveCompressionInfo] = useState(null);
  const cropperRef = useRef(null);
  const estimateRunRef = useRef(0);
  const previewUrlRef = useRef("");

  const revokePreviewUrl = () => {
    if (!previewUrlRef.current) return;
    URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = "";
  };

  useEffect(() => () => revokePreviewUrl(), []);

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
    setPreparingImage(false);
    revokePreviewUrl();
  };

  const estimateCompression = async (nextQuality) => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper || !sourceFile) return;

    const runId = Date.now();
    estimateRunRef.current = runId;

    try {
      const croppedCanvas = cropper.getCroppedCanvas();
      if (!croppedCanvas) return;

      const { width, height } = getTargetDimensions(croppedCanvas.width, croppedCanvas.height);
      if (!width || !height) return;

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = width;
      outputCanvas.height = height;

      const context = outputCanvas.getContext("2d");
      if (!context) return;
      context.drawImage(croppedCanvas, 0, 0, width, height);

      const blob = await new Promise((resolve) => {
        outputCanvas.toBlob(resolve, "image/webp", nextQuality / 100);
      });
      if (!blob) return;

      if (estimateRunRef.current !== runId) return;
      setLiveCompressionInfo({
        originalSize: sourceFile.size,
        outputSize: blob.size,
        quality: nextQuality,
        width,
        height,
      });
    } catch {
      // Ignore estimation failures; upload flow is still available.
    }
  };

  const handleCropOk = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper || !sourceFile) return;

    setUploading(true);
    try {
      const croppedCanvas = cropper.getCroppedCanvas();
      if (!croppedCanvas) throw new Error("Cannot crop image");

      const { width, height } = getTargetDimensions(croppedCanvas.width, croppedCanvas.height);
      if (!width || !height) throw new Error("Invalid cropped size");

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = width;
      outputCanvas.height = height;

      const context = outputCanvas.getContext("2d");
      if (!context) throw new Error("Cannot process image");
      context.drawImage(croppedCanvas, 0, 0, width, height);

      const blob = await new Promise((resolve) => {
        outputCanvas.toBlob(resolve, "image/webp", quality / 100);
      });

      if (!blob) throw new Error("Cannot create cropped image");

      const baseName = sourceFile.name.replace(/\.[^.]+$/, "") || "image";
      const outputName = `${baseName}.webp`;
      const croppedFile = new File([blob], outputName, { type: "image/webp" });
      const result = await uploadProjectImage(croppedFile);
      const uploadedUrl = result?.data?.url;

      pushUploadedUrl(uploadedUrl);
      handleCropCancel();
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || error?.message || "Upload failed");
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
                setQuality(numericValue);
                estimateCompression(numericValue);
              }}
            />
          </Space>
          <Space direction="vertical" size={2}>
            <Typography.Text type="secondary">
              Original: {sourceFile ? formatBytes(sourceFile.size) : "0 B"}
            </Typography.Text>
            <Typography.Text type="secondary">
              Estimated: {liveCompressionInfo
                ? `${formatBytes(liveCompressionInfo.outputSize)} (${liveCompressionInfo.width}x${liveCompressionInfo.height}, quality ${liveCompressionInfo.quality}%)`
                : "Move quality slider to preview size"}
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
                  estimateCompression(quality);
                }}
                cropend={() => {
                  estimateCompression(quality);
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

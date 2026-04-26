import { useMemo, useRef, useState } from "react";
import { Modal, Slider, Space, Upload, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { uploadProjectImage } from "../../services/media.api";
import { toBackendAssetUrl } from "../../utils/media";
import { notifyError } from "../../utils/notify";

const MAX_OUTPUT_WIDTH = 1920;

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

function ImageUploader({ value, onChange, multiple = false, maxCount = 1 }) {
  const [quality, setQuality] = useState(75);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [sourceImage, setSourceImage] = useState("");
  const [sourceFile, setSourceFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [lastCompressionInfo, setLastCompressionInfo] = useState(null);
  const [liveCompressionInfo, setLiveCompressionInfo] = useState(null);
  const cropperRef = useRef(null);
  const estimateRunRef = useRef(0);

  const fileList = useMemo(() => toFileList(value), [value]);

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

  const readAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Cannot read image"));
      reader.readAsDataURL(file);
    });

  const handleBeforeUpload = async (file) => {
    try {
      const dataUrl = await readAsDataUrl(file);
      setSourceImage(dataUrl);
      setSourceFile(file);
      setCropModalOpen(true);
    } catch (error) {
      notifyError(error?.message || "Cannot read image");
    }
    return Upload.LIST_IGNORE;
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setSourceImage("");
    setSourceFile(null);
    setLiveCompressionInfo(null);
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
    } catch (_error) {
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

      setLastCompressionInfo({
        originalSize: sourceFile.size,
        outputSize: blob.size,
        quality,
        width,
        height,
      });

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
        listType="picture-card"
        fileList={fileList}
        beforeUpload={handleBeforeUpload}
        onRemove={handleRemove}
        multiple={multiple}
        maxCount={maxCount}
      >
        {fileList.length >= maxCount ? null : <PlusOutlined />}
      </Upload>

      {lastCompressionInfo ? (
        <Space direction="vertical" size={2}>
          <Typography.Text type="secondary">
            Before: {formatBytes(lastCompressionInfo.originalSize)}
          </Typography.Text>
          <Typography.Text type="secondary">
            After: {formatBytes(lastCompressionInfo.outputSize)} ({lastCompressionInfo.width}x{lastCompressionInfo.height}, quality {lastCompressionInfo.quality}%)
          </Typography.Text>
        </Space>
      ) : null}
      <Modal
        title="Preview & Crop image"
        open={cropModalOpen}
        onCancel={handleCropCancel}
        onOk={handleCropOk}
        okButtonProps={{ loading: uploading }}
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
        {sourceImage ? (
          <Cropper
            ref={cropperRef}
            src={sourceImage}
            style={{ height: 460, width: "100%" }}
            viewMode={1}
            autoCropArea={1}
            dragMode="move"
            aspectRatio={Number.NaN}
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
        ) : null}
      </Modal>
    </Space>
  );
}

export { ImageUploader };

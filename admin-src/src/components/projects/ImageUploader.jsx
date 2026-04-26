import { useMemo, useRef, useState } from "react";
import { Modal, Select, Space, Upload, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { uploadProjectImage } from "../../services/media.api";
import { toBackendAssetUrl } from "../../utils/media";
import { notifyError } from "../../utils/notify";

const ratioOptions = [
  { label: "Banner 1366:778", value: "1366:778", aspect: 1366 / 778 },
  { label: "Banner 16:9", value: "16:9", aspect: 16 / 9 },
  { label: "Row 4:3", value: "4:3", aspect: 4 / 3 },
  { label: "Row 3:4", value: "3:4", aspect: 3 / 4 },
  { label: "Row 4:5", value: "4:5", aspect: 4 / 5 },
  { label: "Row 855:1068", value: "855:1068", aspect: 855 / 1068 },
  { label: "Free crop", value: "free", aspect: NaN },
];

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

function ImageUploader({ value, onChange, multiple = false, maxCount = 1, defaultRatio = "1366:778" }) {
  const [ratio, setRatio] = useState(defaultRatio);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [sourceImage, setSourceImage] = useState("");
  const [sourceFile, setSourceFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const cropperRef = useRef(null);

  const aspect = useMemo(() => {
    const found = ratioOptions.find((item) => item.value === ratio);
    if (!found) return 4 / 3;
    return found.aspect;
  }, [ratio]);

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
        crop_ratio: ratio,
        crop_mode: Number.isNaN(aspect) ? "free" : "preset",
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
  };

  const handleCropOk = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper || !sourceFile) return;

    setUploading(true);
    try {
      const canvas = cropper.getCroppedCanvas();
      if (!canvas) throw new Error("Cannot crop image");

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, sourceFile.type || "image/jpeg", 1);
      });

      if (!blob) throw new Error("Cannot create cropped image");

      const croppedFile = new File([blob], sourceFile.name, { type: blob.type || sourceFile.type });
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
      <Space>
        <Typography.Text type="secondary">Crop ratio</Typography.Text>
        <Select
          value={ratio}
          onChange={setRatio}
          options={ratioOptions}
          style={{ width: 160 }}
        />
      </Space>

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

      <Modal
        title="Preview & Crop image"
        open={cropModalOpen}
        onCancel={handleCropCancel}
        onOk={handleCropOk}
        okButtonProps={{ loading: uploading }}
        width={920}
      >
        {sourceImage ? (
          <Cropper
            ref={cropperRef}
            src={sourceImage}
            style={{ height: 460, width: "100%" }}
            viewMode={1}
            autoCropArea={1}
            dragMode="move"
            aspectRatio={aspect}
            guides
            cropBoxResizable
            cropBoxMovable
            responsive
            background={false}
            checkOrientation={false}
          />
        ) : null}
      </Modal>
    </Space>
  );
}

export { ImageUploader };

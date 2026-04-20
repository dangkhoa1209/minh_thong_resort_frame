import { useMemo, useState } from "react";
import { Select, Space, Upload, Typography } from "antd";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import { uploadProjectImage } from "../../services/media.api";
import { notifyError } from "../../utils/notify";

const ratioOptions = [
  { label: "1366:778", value: "1366:778", aspect: 1366 / 778 },
  { label: "16:9", value: "16:9", aspect: 16 / 9 },
  { label: "4:3", value: "4:3", aspect: 4 / 3 },
  { label: "3:4", value: "3:4", aspect: 3 / 4 },
  { label: "4:5", value: "4:5", aspect: 4 / 5 },
  { label: "855:1068", value: "855:1068", aspect: 855 / 1068 },
  { label: "Custom", value: "custom", aspect: 4 / 3 },
  { label: "Free crop", value: "free", aspect: 4 / 3 },
];

function toFileList(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item, index) => ({
      uid: `${index}-${item.url || item}`,
      name: `image-${index + 1}`,
      status: "done",
      url: item.url || item,
      response: { data: { url: item.url || item } },
    }));
  }
  const url = typeof value === "string" ? value : value.url;
  return [
    {
      uid: `single-${url}`,
      name: "image",
      status: "done",
      url,
      response: { data: { url } },
    },
  ];
}

function ImageUploader({ value, onChange, multiple = false, maxCount = 1, defaultRatio = "1366:778" }) {
  const [ratio, setRatio] = useState(defaultRatio);

  const aspect = useMemo(() => {
    const found = ratioOptions.find((item) => item.value === ratio);
    return found ? found.aspect : 4 / 3;
  }, [ratio]);

  const fileList = useMemo(() => toFileList(value), [value]);

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const result = await uploadProjectImage(file);
      onSuccess?.(result);
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Upload failed");
      onError?.(error);
    }
  };

  const handleUploadChange = ({ fileList: nextFileList }) => {
    const uploaded = nextFileList
      .filter((file) => file.status === "done")
      .map((file) => ({
        url: file.response?.data?.url || file.url || "",
        crop_ratio: ratio,
        crop_mode: ratio === "free" ? "free" : "preset",
      }))
      .filter((item) => item.url);

    if (multiple) {
      onChange?.(uploaded.slice(0, maxCount));
    } else {
      onChange?.(uploaded[0]?.url || "");
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space>
        <Typography.Text type="secondary">Crop ratio</Typography.Text>
        <Select
          value={ratio}
          onChange={setRatio}
          options={ratioOptions}
          style={{ width: 160 }}
        />
      </Space>

      <ImgCrop rotationSlider aspect={aspect} quality={1} modalTitle="Preview & Crop image" showGrid>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleUploadChange}
          customRequest={customRequest}
          multiple={multiple}
          maxCount={maxCount}
        >
          {fileList.length >= maxCount ? null : <PlusOutlined />}
        </Upload>
      </ImgCrop>
    </Space>
  );
}

export { ImageUploader, ratioOptions };

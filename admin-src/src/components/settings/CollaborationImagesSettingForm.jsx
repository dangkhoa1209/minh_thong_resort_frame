import { Button, Col, Form, Row, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  getCollaborationImages,
  updateCollaborationImages,
} from "../../services/setting.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import { ImageUploader } from "../projects/ImageUploader";

const COLLABORATION_IMAGE_SLOTS = [
  { label: "Gallery 1", ratio: "308:316" },
  { label: "Gallery 2", ratio: "413:316" },
  { label: "Gallery 3", ratio: "228:284" },
  { label: "Gallery 4", ratio: "386:284" },
  { label: "Gallery 5", ratio: "228:284" },
  { label: "Gallery 6", ratio: "372:259" },
  { label: "Gallery 7", ratio: "372:259" },
  { label: "Bottom banner", ratio: "717:259" },
];

function normalizeImages(value) {
  const source = Array.isArray(value) ? value : [];
  return COLLABORATION_IMAGE_SLOTS.map((_, index) => String(source[index] || "").trim());
}

function CollaborationImagesSettingForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await getCollaborationImages();
        form.setFieldsValue({
          images: normalizeImages(result?.data?.images || []),
        });
      } catch (error) {
        notifyError(error?.response?.data?.error?.message || "Cannot load collaboration images");
      } finally {
        setLoading(false);
      }
    })();
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await updateCollaborationImages({
        images: normalizeImages(values?.images || []),
      });
      notifySuccess("Collaboration images updated");
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot update collaboration images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Typography.Paragraph type="secondary">
        Upload replacement images for each Collaboration slot. Empty slots keep the default image.
      </Typography.Paragraph>
      <Row gutter={[16, 16]}>
        {COLLABORATION_IMAGE_SLOTS.map((slot, index) => (
          <Col xs={24} md={12} xl={8} key={slot.label}>
            <Form.Item
              label={`${slot.label} (${slot.ratio})`}
              name={["images", index]}
            >
              <ImageUploader defaultRatio={slot.ratio} />
            </Form.Item>
          </Col>
        ))}
      </Row>
      <Space>
        <Button htmlType="submit" type="primary" loading={loading}>
          Save Collaboration Images
        </Button>
      </Space>
    </Form>
  );
}

export { CollaborationImagesSettingForm, COLLABORATION_IMAGE_SLOTS };

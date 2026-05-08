import { Button, Card, Col, Divider, Form, Input, Row, Space, Typography } from "antd";
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

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function applyInlineFormatting(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function renderRichContent(content) {
  const lines = String(content || "").split(/\r?\n/);
  const blocks = [];
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    blocks.push(
      `<ul style="padding-left: 20px; margin: 0 0 12px 0;">${listBuffer
        .map((item) => `<li style="margin: 4px 0;"><span>${applyInlineFormatting(item)}</span></li>`)
        .join("")}</ul>`
    );
    listBuffer = [];
  };

  lines.forEach((rawLine) => {
    const line = String(rawLine || "").trim();
    if (!line) {
      flushList();
      return;
    }

    if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2).trim());
      return;
    }

    flushList();
    blocks.push(`<p style="margin: 0 0 12px 0;">${applyInlineFormatting(line)}</p>`);
  });

  flushList();
  return blocks.join("") || `<p style="margin: 0;">No content preview.</p>`;
}

function CollaborationImagesSettingForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const contentValue = Form.useWatch("content", form);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await getCollaborationImages();
        form.setFieldsValue({
          title: String(result?.data?.title || "").trim(),
          subtitle: String(result?.data?.subtitle || "").trim(),
          content: String(result?.data?.content || "").trim(),
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
        title: String(values?.title || "").trim(),
        subtitle: String(values?.subtitle || "").trim(),
        content: String(values?.content || "").trim(),
        images: normalizeImages(values?.images || []),
      });
      notifySuccess("Collaboration content updated");
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot update collaboration images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Typography.Paragraph type="secondary">
        You can customize title, subtitle and content for the Collaboration page.
      </Typography.Paragraph>
      <Typography.Paragraph type="secondary">
        Content supports lightweight formatting: use <Typography.Text code>**text**</Typography.Text> for bold, start line with <Typography.Text code>- </Typography.Text> for bullet list, and press Enter to create new lines.
      </Typography.Paragraph>
      <Typography.Paragraph type="secondary">
        Example:
        <br />
        <Typography.Text code>**At Abel Dang Production**</Typography.Text>
        <br />
        <Typography.Text code>- Highlight signature spaces</Typography.Text>
        <br />
        <Typography.Text code>- Reflect authentic guest experiences</Typography.Text>
        <br />
        <Typography.Text code>[abeldang@dangvuproduction.com](mailto:abeldang@dangvuproduction.com)</Typography.Text>
      </Typography.Paragraph>
      <Row gutter={[16, 0]}>
        <Col xs={24}>
          <Form.Item label="Title" name="title">
            <Input maxLength={150} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item label="Subtitle" name="subtitle">
            <Input maxLength={250} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item label="Content" name="content">
            <Input.TextArea rows={8} maxLength={5000} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Typography.Text type="secondary">Preview Content</Typography.Text>
          <Card size="small" style={{ marginTop: 8 }}>
            <div
              dangerouslySetInnerHTML={{
                __html: renderRichContent(String(contentValue || "")),
              }}
            />
          </Card>
        </Col>
      </Row>
      <Divider />
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
          Save Collaboration
        </Button>
      </Space>
    </Form>
  );
}

export { CollaborationImagesSettingForm, COLLABORATION_IMAGE_SLOTS };

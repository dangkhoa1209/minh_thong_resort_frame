import { Button, Form, Space } from "antd";
import { useEffect, useState } from "react";
import { getLogo, updateLogo } from "../../services/setting.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import { ImageUploader } from "../projects/ImageUploader";
import { DEFAULT_LOGOS, normalizeLogoData, writeLogoCache } from "../../utils/logo-cache";

function LogoSettingForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await getLogo();
        const normalized = normalizeLogoData(result?.data || {});
        form.setFieldsValue({
          logo_light_url: normalized.logo_light_url || DEFAULT_LOGOS.logo_light_url,
          logo_dark_url: normalized.logo_dark_url || DEFAULT_LOGOS.logo_dark_url,
        });
      } catch (error) {
        notifyError(error?.response?.data?.error?.message || "Cannot load logo");
      } finally {
        setLoading(false);
      }
    })();
  }, [form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={async (values) => {
        setLoading(true);
        try {
          const payload = normalizeLogoData(values);
          const result = await updateLogo(payload);
          const normalized = normalizeLogoData(result?.data || payload);
          form.setFieldsValue(normalized);
          writeLogoCache(normalized);
          notifySuccess("Logo updated");
        } catch (error) {
          notifyError(error?.response?.data?.error?.message || "Cannot update logo");
        } finally {
          setLoading(false);
        }
      }}
    >
      <Form.Item
        className="logo-light-uploader"
        label="Logo light (for dark background)"
        name="logo_light_url"
        rules={[{ required: true }]}
      >
        <ImageUploader defaultRatio="free" />
      </Form.Item>
      <Form.Item label="Logo dark (for light background)" name="logo_dark_url" rules={[{ required: true }]}>
        <ImageUploader defaultRatio="free" />
      </Form.Item>
      <Space>
        <Button htmlType="submit" type="primary" loading={loading}>
          Save Logo
        </Button>
      </Space>
      <style>
        {`
          .logo-light-uploader .ant-upload.ant-upload-select,
          .logo-light-uploader .ant-upload-list-item {
            background: #0f1012 !important;
            border-color: #2a2d33 !important;
          }
        `}
      </style>
    </Form>
  );
}

export { LogoSettingForm };

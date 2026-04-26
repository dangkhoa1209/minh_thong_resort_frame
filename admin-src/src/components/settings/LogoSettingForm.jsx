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
        form.setFieldsValue({
          logo_light_url: result.data.logo_light_url || DEFAULT_LOGOS.logo_light_url,
          logo_dark_url: result.data.logo_dark_url || DEFAULT_LOGOS.logo_dark_url,
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
          const result = await updateLogo(values);
          writeLogoCache(normalizeLogoData(result?.data || values));
          notifySuccess("Logo updated");
        } catch (error) {
          notifyError(error?.response?.data?.error?.message || "Cannot update logo");
        } finally {
          setLoading(false);
        }
      }}
    >
      <Form.Item label="Logo light (for dark background)" name="logo_light_url" rules={[{ required: true }]}>
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
    </Form>
  );
}

export { LogoSettingForm };

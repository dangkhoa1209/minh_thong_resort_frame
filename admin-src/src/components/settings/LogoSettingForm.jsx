import { Button, Form, Space } from "antd";
import { useEffect, useState } from "react";
import { getLogo, updateLogo } from "../../services/setting.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import { ImageUploader } from "../projects/ImageUploader";

function LogoSettingForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await getLogo();
        form.setFieldValue("logo_url", result.data.logo_url || "");
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
          await updateLogo(values);
          notifySuccess("Logo updated");
        } catch (error) {
          notifyError(error?.response?.data?.error?.message || "Cannot update logo");
        } finally {
          setLoading(false);
        }
      }}
    >
      <Form.Item label="Logo" name="logo_url" rules={[{ required: true }]}>
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

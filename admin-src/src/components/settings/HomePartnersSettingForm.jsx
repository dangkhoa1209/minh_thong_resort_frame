import { Button, Form, Space } from "antd";
import { useEffect, useState } from "react";
import { getHomePartners, updateHomePartners } from "../../services/setting.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import { ImageUploader } from "../projects/ImageUploader";

function normalizeLogos(value) {
  return (Array.isArray(value) ? value : [])
    .map((item) => {
      if (typeof item === "string") return item.trim();
      return String(item?.url || "").trim();
    })
    .filter((item) => item);
}

function HomePartnersSettingForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await getHomePartners();
        form.setFieldsValue({
          logos: normalizeLogos(result?.data?.logos || []),
        });
      } catch (error) {
        notifyError(error?.response?.data?.error?.message || "Cannot load home partners");
      } finally {
        setLoading(false);
      }
    })();
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await updateHomePartners({
        logos: normalizeLogos(values?.logos || []),
      });
      notifySuccess("Home partners updated");
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot update home partners");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label="Partner logos (loop slider)" name="logos">
        <ImageUploader multiple maxCount={20} defaultRatio="free" />
      </Form.Item>
      <Space>
        <Button htmlType="submit" type="primary" loading={loading}>
          Save Partner Logos
        </Button>
      </Space>
    </Form>
  );
}

export { HomePartnersSettingForm };

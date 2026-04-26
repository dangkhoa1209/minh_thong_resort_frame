import { Button, Form, Space } from "antd";
import { useEffect, useState } from "react";
import { getHomeBanner, updateHomeBanner } from "../../services/setting.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import { ImageUploader } from "../projects/ImageUploader";

function HomeBannerSettingForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await getHomeBanner();
        form.setFieldsValue({
          banner_image: result?.data?.banner_image || "",
        });
      } catch (error) {
        notifyError(error?.response?.data?.error?.message || "Cannot load home banner");
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
          await updateHomeBanner(values);
          notifySuccess("Home banner updated");
        } catch (error) {
          notifyError(error?.response?.data?.error?.message || "Cannot update home banner");
        } finally {
          setLoading(false);
        }
      }}
    >
      <Form.Item label="Home banner image (optional)" name="banner_image">
        <ImageUploader defaultRatio="16:9" />
      </Form.Item>
      <Space>
        <Button htmlType="submit" type="primary" loading={loading}>
          Save Home Banner
        </Button>
      </Space>
    </Form>
  );
}

export { HomeBannerSettingForm };

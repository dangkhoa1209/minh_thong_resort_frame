import { Button, Form, Input, Row, Col } from "antd";
import { useEffect, useState } from "react";
import { getContact, updateContact } from "../../services/setting.api";
import { notifyError, notifySuccess } from "../../utils/notify";

function ContactSettingForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await getContact();
        form.setFieldsValue(result.data || {});
      } catch (error) {
        notifyError(error?.response?.data?.error?.message || "Cannot load contact");
      } finally {
        setLoading(false);
      }
    })();
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await updateContact(values);
      notifySuccess("Contact updated");
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot update contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Company name" name="company_name">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item label="Facebook" name="facebook">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Instagram" name="instagram">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Website" name="website">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Button htmlType="submit" type="primary" loading={loading}>
        Save Contact
      </Button>
    </Form>
  );
}

export { ContactSettingForm };

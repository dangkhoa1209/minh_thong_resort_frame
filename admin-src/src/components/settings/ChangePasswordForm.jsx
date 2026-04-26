import { Button, Form, Input } from "antd";
import { useState } from "react";
import { changePassword } from "../../services/auth.api";
import { notifyError, notifySuccess } from "../../utils/notify";

function ChangePasswordForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await changePassword(values);
      notifySuccess("Password updated");
      form.resetFields();
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Current password"
        name="current_password"
        rules={[{ required: true, min: 8 }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="New password"
        name="new_password"
        rules={[{ required: true, min: 8 }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Confirm new password"
        name="confirm_password"
        dependencies={["new_password"]}
        rules={[
          { required: true, min: 8 },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("new_password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Password confirmation does not match"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Button htmlType="submit" type="primary" loading={loading}>
        Change Password
      </Button>
    </Form>
  );
}

export { ChangePasswordForm };

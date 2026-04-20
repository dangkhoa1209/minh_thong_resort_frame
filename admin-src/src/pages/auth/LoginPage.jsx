import { useState } from "react";
import { Button, Card, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.api";
import { useAuthStore } from "../../store/auth.store";
import { notifyError } from "../../utils/notify";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(values);
      setAuth({ token: result.data.access_token, user: result.data.user });
      navigate("/");
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <Card className="login-card">
        <Typography.Title level={3}>Admin Login</Typography.Title>
        <Form layout="vertical" onFinish={onFinish} initialValues={{ email: "", password: "" }}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="admin@example.com" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 8 }]}>
            <Input.Password placeholder="********" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export { LoginPage };

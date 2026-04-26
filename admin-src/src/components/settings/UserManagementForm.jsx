import { Button, Card, Col, Form, Grid, Input, Row, Select, Space, Switch, Table, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import { createUser, getUsers, updateUser } from "../../services/user.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import { useAuthStore } from "../../store/auth.store";

function UserManagementForm() {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const currentUser = useAuthStore((state) => state.user);
  const [createForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updatingPasswordId, setUpdatingPasswordId] = useState(null);
  const [passwordDrafts, setPasswordDrafts] = useState({});
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const isOwner = useMemo(() => {
    const role = String(currentUser?.role || "").toLowerCase();
    return role === "owner" || role === "admin";
  }, [currentUser?.role]);

  const loadUsers = async (page = pagination.current, limit = pagination.pageSize) => {
    setLoading(true);
    try {
      const result = await getUsers({ page, limit });
      const data = result?.data || {};
      setItems(Array.isArray(data.items) ? data.items : []);
      setPagination({
        current: data?.pagination?.page || page,
        pageSize: data?.pagination?.limit || limit,
        total: data?.pagination?.total || 0,
      });
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner) {
      queueMicrotask(() => {
        loadUsers(1, pagination.pageSize);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner]);

  const onCreate = async (values) => {
    setCreating(true);
    try {
      await createUser(values);
      notifySuccess("User created");
      createForm.resetFields();
      loadUsers(1, pagination.pageSize);
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot create user");
    } finally {
      setCreating(false);
    }
  };

  const onUpdateUser = async (record, patch) => {
    try {
      await updateUser(record.id, patch);
      notifySuccess("User updated");
      loadUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot update user");
    }
  };

  const onResetPassword = async (record) => {
    const password = String(passwordDrafts[record.id] || "");
    if (password.length < 8) {
      notifyError("Password must be at least 8 characters");
      return;
    }

    setUpdatingPasswordId(record.id);
    try {
      await onUpdateUser(record, { password });
      setPasswordDrafts((prev) => ({ ...prev, [record.id]: "" }));
    } finally {
      setUpdatingPasswordId(null);
    }
  };

  if (!isOwner) {
    return <Tag color="gold">Only owner can manage admin users.</Tag>;
  }

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      width: 240,
      ellipsis: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      width: 140,
      render: (value, record) => (
        <Select
          value={value}
          style={{ width: "100%", minWidth: 110 }}
          options={[
            { value: "owner", label: "Owner" },
            { value: "editor", label: "Editor" },
          ]}
          onChange={(nextRole) => onUpdateUser(record, { role: nextRole })}
        />
      ),
    },
    {
      title: "Active",
      dataIndex: "is_active",
      width: 110,
      render: (value, record) => (
        <Switch checked={Boolean(value)} onChange={(checked) => onUpdateUser(record, { is_active: checked })} />
      ),
    },
    {
      title: "Reset password",
      width: 320,
      render: (_, record) => (
        <Space.Compact style={{ width: "100%" }}>
          <Input.Password
            placeholder="New password"
            value={passwordDrafts[record.id] || ""}
            onChange={(event) =>
              setPasswordDrafts((prev) => ({
                ...prev,
                [record.id]: event.target.value,
              }))
            }
          />
          <Button
            type="primary"
            onClick={() => onResetPassword(record)}
            loading={updatingPasswordId === record.id}
            disabled={String(passwordDrafts[record.id] || "").length < 8}
          >
            Reset
          </Button>
        </Space.Compact>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={16}>
      <Card title="Create user">
        <Form
          form={createForm}
          layout="vertical"
          onFinish={onCreate}
          initialValues={{ role: "editor", is_active: true }}
        >
          <Row gutter={[12, 0]}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={7}>
              <Form.Item label="Password" name="password" rules={[{ required: true, min: 8 }]}>
                <Input.Password />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Role" name="role" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: "owner", label: "Owner" },
                    { value: "editor", label: "Editor" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={3}>
              <Form.Item label="Active" name="is_active" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={2}>
              <Form.Item label={isMobile ? null : " "}>
                <Button type="primary" htmlType="submit" loading={creating} block={isMobile}>
                  Create
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="Users">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={items}
          loading={loading}
          size={isMobile ? "small" : "middle"}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => loadUsers(page, pageSize),
            simple: isMobile,
            showSizeChanger: !isMobile,
          }}
          scroll={{ x: 860 }}
        />
      </Card>
    </Space>
  );
}

export { UserManagementForm };

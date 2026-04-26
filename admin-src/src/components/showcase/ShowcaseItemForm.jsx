import { Button, Form, Image, InputNumber, Select, Space, Switch, Typography } from "antd";
import { useMemo } from "react";
import { toBackendAssetUrl } from "../../utils/media";

function ShowcaseItemForm({ form, onSubmit, submitting, projects = [] }) {
  const selectedProjectId = Form.useWatch("project_id", form);
  const options = useMemo(
    () =>
      projects.map((item) => ({
        value: item.id,
        label: `${item.title} (${item.slug})`,
      })),
    [projects]
  );
  const selectedProject = useMemo(
    () => projects.find((item) => item.id === selectedProjectId),
    [projects, selectedProjectId]
  );

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Form.Item label="Project" name="project_id" rules={[{ required: true }]}>
        <Select
          options={options}
          showSearch
          optionFilterProp="label"
          placeholder="Select a project"
        />
      </Form.Item>

      {selectedProject?.image_1 ? (
        <Form.Item label="Project thumbnail">
          <Space align="start">
            <Image
              width={160}
              height={96}
              src={toBackendAssetUrl(selectedProject.image_1)}
              style={{ objectFit: "cover", borderRadius: 6 }}
            />
            <Typography.Text type="secondary">
              This image comes from the selected project. Edit the project if you need to change it.
            </Typography.Text>
          </Space>
        </Form.Item>
      ) : null}

      <Space>
        <Form.Item label="Sort order" name="sort_order" initialValue={0}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Active" name="is_active" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </Space>

      <Button type="primary" htmlType="submit" loading={submitting}>
        Save
      </Button>
    </Form>
  );
}

export { ShowcaseItemForm };

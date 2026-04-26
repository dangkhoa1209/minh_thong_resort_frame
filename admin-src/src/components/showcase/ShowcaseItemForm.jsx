import { Button, Form, InputNumber, Select, Space, Switch } from "antd";
import { useMemo } from "react";
import { ImageUploader } from "../projects/ImageUploader";

function ShowcaseItemForm({ form, onSubmit, submitting, projects = [] }) {
  const options = useMemo(
    () =>
      projects.map((item) => ({
        value: item.id,
        label: `${item.title} (${item.slug})`,
      })),
    [projects]
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

      <Form.Item label="Display image" name="display_image" rules={[{ required: true }]}>
        <ImageUploader defaultRatio="16:9" />
      </Form.Item>

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

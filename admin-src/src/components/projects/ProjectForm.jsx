import { Button, Card, Col, Form, Input, Row, Select, Space, Switch } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ImageUploader } from "./ImageUploader";

const rowRatioOptions = [
  { label: "16:9", value: "16:9" },
  { label: "4:3", value: "4:3" },
  { label: "3:4", value: "3:4" },
  { label: "4:5", value: "4:5" },
  { label: "855:1068", value: "855:1068" },
];

function ProjectForm({ form, onSubmit, submitting }) {
  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Location" name="location">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Year" name="year">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Active" name="is_active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Content" name="content">
        <Input.TextArea rows={5} />
      </Form.Item>

      <Card title="Banner">
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Banner image" name="banner_image" rules={[{ required: true }]}>
              <ImageUploader defaultRatio="1366:778" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Image Rows" style={{ marginTop: 16 }}>
        <Form.List name="image_rows">
          {(fields, { add, remove }) => (
            <Space orientation="vertical" style={{ width: "100%" }} size={16}>
              {fields.map((field) => {
                const layout = form.getFieldValue(["image_rows", field.name, "layout"]) || 1;
                return (
                  <Card
                    size="small"
                    key={field.key}
                    title={`Row ${field.name + 1}`}
                    extra={
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    }
                  >
                    <Row gutter={16}>
                      <Col xs={24} md={6}>
                        <Form.Item
                          label="Layout"
                          name={[field.name, "layout"]}
                          rules={[{ required: true }]}
                          initialValue={1}
                        >
                          <Input
                            type="number"
                            min={1}
                            max={2}
                            onChange={(event) => {
                              const value = Number(event.target.value) === 2 ? 2 : 1;
                              form.setFieldValue(["image_rows", field.name, "layout"], value);
                              form.setFieldValue(["image_rows", field.name, "images"], []);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={6}>
                        <Form.Item
                          label="Ratio (display only)"
                          name={[field.name, "ratio"]}
                          initialValue="4:3"
                        >
                          <Select options={rowRatioOptions} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label={`Images (${layout} item)`}
                          name={[field.name, "images"]}
                          rules={[{ required: true }]}
                        >
                          <ImageUploader
                            multiple
                            maxCount={layout}
                            defaultRatio="4:3"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                );
              })}

              <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ layout: 1, ratio: "4:3", images: [] })}>
                Add Row
              </Button>
            </Space>
          )}
        </Form.List>
      </Card>

      <div style={{ marginTop: 20 }}>
        <Button type="primary" htmlType="submit" loading={submitting}>
          Save Project
        </Button>
      </div>
    </Form>
  );
}

export { ProjectForm };

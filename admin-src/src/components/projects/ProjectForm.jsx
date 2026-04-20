import { Button, Card, Col, Form, Input, Row, Space, Switch } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ImageUploader } from "./ImageUploader";
import { slugify } from "../../utils/slug";

function ProjectForm({ form, onSubmit, submitting }) {
  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input
              onBlur={(event) => {
                const slug = form.getFieldValue("slug");
                if (!slug) {
                  form.setFieldValue("slug", slugify(event.target.value));
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, pattern: /^[a-z0-9-]+$/ }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Short Description" name="short_description">
        <Input.TextArea rows={2} />
      </Form.Item>

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
          <Col xs={24} md={8}>
            <Form.Item label="Banner title" name="banner_title">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Banner subtitle" name="banner_subtitle">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Home Card" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Image 1" name="image_1" rules={[{ required: true }]}>
              <ImageUploader defaultRatio="1366:778" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Show on Home" name="is_home_visible" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Show on Slide" name="is_slide_visible" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Image Rows" style={{ marginTop: 16 }}>
        <Form.List name="image_rows">
          {(fields, { add, remove }) => (
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
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
                      <Col xs={24} md={18}>
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

              <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ layout: 1, images: [] })}>
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

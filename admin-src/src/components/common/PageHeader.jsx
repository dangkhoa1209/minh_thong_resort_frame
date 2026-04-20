import { Space, Typography } from "antd";

function PageHeader({ title, extra = null }) {
  return (
    <div className="page-header">
      <Typography.Title level={3} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
      <Space>{extra}</Space>
    </div>
  );
}

export { PageHeader };

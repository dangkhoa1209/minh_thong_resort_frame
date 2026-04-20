import { Card, Col, Row, Typography } from "antd";

function DashboardPage() {
  return (
    <div>
      <Typography.Title level={3}>Dashboard</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Projects">Quan ly danh sach project, hien thi Home/Slide.</Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Logo">Cap nhat logo website tu admin.</Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Contact">Cap nhat thong tin lien he hien thi o footer/header.</Card>
        </Col>
      </Row>
    </div>
  );
}

export { DashboardPage };

import { useEffect, useState } from "react";
import { Button, Card, Col, List, Row, Space, Statistic, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getDashboardSummary } from "../../services/dashboard.api";
import { notifyError } from "../../utils/notify";
import { toBackendAssetUrl } from "../../utils/media";

function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await getDashboardSummary();
        setSummary(result.data);
      } catch (error) {
        notifyError(error?.response?.data?.error?.message || "Cannot load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const contacts = summary?.contacts || {};
  const projects = summary?.projects || {};
  const showcase = summary?.showcase || {};
  const analytics = summary?.analytics || {};

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Typography.Title level={3} style={{ margin: 0 }}>Dashboard</Typography.Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card loading={loading}>
            <Statistic title="Projects" value={projects.total || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card loading={loading}>
            <Statistic title="Home Highlights" value={showcase.home_highlights_active || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card loading={loading}>
            <Statistic title="Hero Slides" value={showcase.hero_slides_active || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card loading={loading}>
            <Statistic title="New Contact Requests" value={contacts.new || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card loading={loading}>
            <Statistic title="Project Views" value={analytics.total_views || 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button block type="primary" onClick={() => navigate("/projects/new")}>Add Project</Button>
              <Button block onClick={() => navigate("/showcase/home-highlights")}>Manage Home Highlights</Button>
              <Button block onClick={() => navigate("/showcase/hero-slides")}>Manage Hero Slides</Button>
              <Button block onClick={() => navigate("/contacts")}>Review Contact Requests</Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Contact Pipeline" loading={loading}>
            <Space direction="vertical">
              <Typography.Text><Tag color="blue">New</Tag> {contacts.new || 0}</Typography.Text>
              <Typography.Text><Tag color="gold">Contacted</Tag> {contacts.contacted || 0}</Typography.Text>
              <Typography.Text><Tag color="green">Closed</Tag> {contacts.closed || 0}</Typography.Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Needs Attention" loading={loading}>
            <Space direction="vertical">
              {(showcase.home_highlights_active || 0) === 0 ? <Typography.Text type="danger">Home Highlights is empty</Typography.Text> : null}
              {(showcase.hero_slides_active || 0) === 0 ? <Typography.Text type="danger">Hero Slides is empty</Typography.Text> : null}
              {(contacts.new || 0) > 0 ? <Typography.Text>{contacts.new} contact request(s) need follow-up</Typography.Text> : null}
              {(showcase.home_highlights_active || 0) > 0 && (showcase.hero_slides_active || 0) > 0 && (contacts.new || 0) === 0 ? (
                <Typography.Text type="secondary">No urgent content issues</Typography.Text>
              ) : null}
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Projects" loading={loading}>
            <List
              dataSource={projects.recent_items || []}
              renderItem={(item) => (
                <List.Item actions={[<Button key="edit" onClick={() => navigate(`/projects/${item.id}`)}>Edit</Button>]}>
                  <List.Item.Meta
                    avatar={<img src={toBackendAssetUrl(item.image_1)} alt="" style={{ width: 72, height: 44, objectFit: "cover", borderRadius: 4 }} />}
                    title={`${item.title || ""}${item.name ? ` - ${item.name}` : ""}`}
                    description={dayjs(item.updated_at).format("YYYY-MM-DD HH:mm")}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Recent Contact Requests" loading={loading}>
            <List
              dataSource={contacts.recent_items || []}
              renderItem={(item) => (
                <List.Item actions={[<Button key="view" onClick={() => navigate("/contacts")}>Open</Button>]}>
                  <List.Item.Meta
                    title={item.name || item.email}
                    description={`${item.source === "footer" ? "Footer" : "Contact page"} - ${dayjs(item.created_at).format("YYYY-MM-DD HH:mm")}`}
                  />
                  <Tag color={item.status === "new" ? "blue" : item.status === "contacted" ? "gold" : "green"}>{item.status}</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Top Viewed Projects" loading={loading}>
        <List
          dataSource={analytics.top_projects || []}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                title={`${index + 1}. ${item.title || "Untitled project"}${item.name ? ` - ${item.name}` : ""}`}
                description={`Last viewed ${dayjs(item.last_viewed_at).format("YYYY-MM-DD HH:mm")}`}
              />
              <Statistic value={item.views} suffix="views" />
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
}

export { DashboardPage };

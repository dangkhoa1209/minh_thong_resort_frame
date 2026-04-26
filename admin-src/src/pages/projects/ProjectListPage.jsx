import { useEffect, useMemo, useState } from "react";
import { Button, Grid, Input, Popconfirm, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { deleteProject, getProjects } from "../../services/project.api";
import { PageHeader } from "../../components/common/PageHeader";
import { toBackendAssetUrl } from "../../utils/media";
import { notifyError, notifySuccess } from "../../utils/notify";

function ProjectListPage() {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchData = async (page = 1, limit = 20, search = "") => {
    setLoading(true);
    try {
      const result = await getProjects({ page, limit, search });
      setItems(result.data.items);
      setPagination({
        current: result.data.pagination.page,
        pageSize: result.data.pagination.limit,
        total: result.data.pagination.total,
      });
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "Image",
        width: 120,
        render: (_, row) => (
          <img
            src={toBackendAssetUrl(row.banner_image || row.image_1)}
            alt=""
            style={{ width: 80, height: 50, objectFit: "cover" }}
          />
        ),
      },
      { title: "Title", dataIndex: "title", width: 280 },
      { title: "Name", dataIndex: "name", width: 240 },
      { title: "Location", dataIndex: "location", width: 180 },
      { title: "Year", dataIndex: "year", width: 100 },
      {
        title: "Updated",
        dataIndex: "updated_at",
        width: 170,
        render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
      },
      {
        title: "Action",
        width: 220,
        render: (_, row) => (
          <Space>
            <Button onClick={() => navigate(`/projects/${row.id}`)}>Edit</Button>
            <Popconfirm
              title="Delete project?"
              description="This action cannot be undone."
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={async () => {
                try {
                  await deleteProject(row.id);
                  notifySuccess("Deleted project successfully");
                  fetchData(pagination.current, pagination.pageSize, keyword);
                } catch (error) {
                  notifyError(error?.response?.data?.error?.message || "Cannot delete project");
                }
              }}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [keyword, navigate, pagination.current, pagination.pageSize]
  );

  return (
    <div style={{ height: "calc(100vh - 96px)", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <PageHeader
        title="Projects"
        extra={<Button type="primary" onClick={() => navigate("/projects/new")}>Create Project</Button>}
      />

      <Space style={{ marginBottom: 16, width: isMobile ? "100%" : undefined }}>
        <Input.Search
          placeholder="Search title/name/location"
          allowClear
          style={{ width: isMobile ? "100%" : 320 }}
          onSearch={(value) => {
            setKeyword(value);
            fetchData(1, pagination.pageSize, value);
          }}
        />
      </Space>

      <div style={{ flex: 1, minHeight: 0 }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={items}
          loading={loading}
          size={isMobile ? "small" : "middle"}
          scroll={{ x: "max-content", y: "calc(100vh - 300px)" }}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => fetchData(page, pageSize, keyword),
            simple: isMobile,
            showSizeChanger: !isMobile,
          }}
        />
      </div>
    </div>
  );
}

export { ProjectListPage };

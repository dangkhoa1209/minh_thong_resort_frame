import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Grid, Input, Popconfirm, Space, Switch, Table } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { deleteProject, getProjects, updateProjectActive } from "../../services/project.api";
import { PageHeader } from "../../components/common/PageHeader";
import { toBackendAssetUrl } from "../../utils/media";
import { notifyError, notifySuccess } from "../../utils/notify";

const CUSTOM_PROJECT_SLUGS = new Set([
  "ana-mandara-villas-dalat",
  "binh-an-village-dalat",
  "four-seasons-resort-the-nam-hai",
  "marriott-renaissance-hoi-an",
  "mercure-hotel-vung-tau",
  "pear-hoi-an",
]);

function getPublicProjectUrl(row) {
  const slug = String(row?.slug || "").trim();
  if (!slug) return "";
  if (CUSTOM_PROJECT_SLUGS.has(slug)) {
    return `/pages/project/${slug}.html`;
  }
  return `/pages/project/project-detail.html?slug=${encodeURIComponent(slug)}`;
}

function ProjectListPage() {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const currentPage = pagination.current;
  const currentPageSize = pagination.pageSize;

  const fetchData = useCallback(async (page = 1, limit = 20, search = "") => {
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
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchData());
  }, [fetchData]);

  const handleActiveChange = useCallback(async (row, checked) => {
    try {
      await updateProjectActive(row.id, checked);
      notifySuccess("Updated successfully");
      fetchData(currentPage, currentPageSize, keyword);
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot update project");
      fetchData(currentPage, currentPageSize, keyword);
    }
  }, [currentPage, currentPageSize, fetchData, keyword]);

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
        title: "Active",
        dataIndex: "is_active",
        width: 100,
        render: (value, row) => (
          <Switch checked={value !== false} onChange={(checked) => handleActiveChange(row, checked)} />
        ),
      },
      {
        title: "Updated",
        dataIndex: "updated_at",
        width: 170,
        render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
      },
      {
        title: "Action",
        width: 270,
        render: (_, row) => (
          <Space>
            <Button
              icon={<EyeOutlined />}
              href={getPublicProjectUrl(row)}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!row.slug}
            >
              View
            </Button>
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
                  fetchData(currentPage, currentPageSize, keyword);
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
    [currentPage, currentPageSize, fetchData, handleActiveChange, keyword, navigate]
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

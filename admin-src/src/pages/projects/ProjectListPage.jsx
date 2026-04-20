import { useEffect, useMemo, useState } from "react";
import { Button, Input, Space, Switch, Table } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getProjects, updateProjectDisplay } from "../../services/project.api";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusTag } from "../../components/common/StatusTag";
import { notifyError, notifySuccess } from "../../utils/notify";

function ProjectListPage() {
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
        dataIndex: "image_1",
        width: 120,
        render: (value) => <img src={value} alt="" style={{ width: 80, height: 50, objectFit: "cover" }} />,
      },
      { title: "Title", dataIndex: "title" },
      { title: "Slug", dataIndex: "slug" },
      { title: "Home", dataIndex: "is_home_visible", render: (value) => <StatusTag active={value} /> },
      { title: "Slide", dataIndex: "is_slide_visible", render: (value) => <StatusTag active={value} /> },
      {
        title: "Updated",
        dataIndex: "updated_at",
        render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
      },
      {
        title: "Action",
        render: (_, row) => (
          <Space>
            <Button onClick={() => navigate(`/projects/${row.id}`)}>Edit</Button>
            <Switch
              checked={row.is_home_visible}
              onChange={async (checked) => {
                await updateProjectDisplay(row.id, {
                  is_home_visible: checked,
                  is_slide_visible: row.is_slide_visible,
                });
                notifySuccess("Updated Home visibility");
                fetchData(pagination.current, pagination.pageSize, keyword);
              }}
            />
            <Switch
              checked={row.is_slide_visible}
              onChange={async (checked) => {
                await updateProjectDisplay(row.id, {
                  is_home_visible: row.is_home_visible,
                  is_slide_visible: checked,
                });
                notifySuccess("Updated Slide visibility");
                fetchData(pagination.current, pagination.pageSize, keyword);
              }}
            />
          </Space>
        ),
      },
    ],
    [keyword, navigate, pagination.current, pagination.pageSize]
  );

  return (
    <div>
      <PageHeader
        title="Projects"
        extra={<Button type="primary" onClick={() => navigate("/projects/new")}>Create Project</Button>}
      />

      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search title/slug"
          allowClear
          onSearch={(value) => {
            setKeyword(value);
            fetchData(1, pagination.pageSize, value);
          }}
        />
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchData(page, pageSize, keyword),
        }}
      />
    </div>
  );
}

export { ProjectListPage };

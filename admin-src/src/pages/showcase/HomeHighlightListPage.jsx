import { useEffect, useMemo, useState } from "react";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusTag } from "../../components/common/StatusTag";
import { toBackendAssetUrl } from "../../utils/media";
import { notifyError, notifySuccess } from "../../utils/notify";
import { deleteHomeHighlight, getHomeHighlights } from "../../services/showcase.api";

function HomeHighlightListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchData = async (page = 1, limit = 20, search = "") => {
    setLoading(true);
    try {
      const result = await getHomeHighlights({ page, limit, search });
      setItems(result.data.items);
      setPagination({
        current: result.data.pagination.page,
        pageSize: result.data.pagination.limit,
        total: result.data.pagination.total,
      });
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot load home highlights");
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
        dataIndex: "display_image",
        width: 120,
        render: (value) => <img src={toBackendAssetUrl(value)} alt="" style={{ width: 80, height: 50, objectFit: "cover" }} />,
      },
      { title: "Project", dataIndex: "project_title", width: 280 },
      { title: "Slug", dataIndex: "project_slug", width: 220 },
      { title: "Order", dataIndex: "sort_order", width: 100 },
      { title: "Active", dataIndex: "is_active", width: 90, render: (value) => <StatusTag active={value} /> },
      { title: "Updated", dataIndex: "updated_at", width: 170, render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm") },
      {
        title: "Action",
        width: 180,
        render: (_, row) => (
          <Space>
            <Button onClick={() => navigate(`/showcase/home-highlights/${row.id}`)}>Edit</Button>
            <Popconfirm
              title="Delete item?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={async () => {
                try {
                  await deleteHomeHighlight(row.id);
                  notifySuccess("Deleted successfully");
                  fetchData(pagination.current, pagination.pageSize, keyword);
                } catch (error) {
                  notifyError(error?.response?.data?.error?.message || "Cannot delete item");
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
        title="Home Highlights"
        extra={<Button type="primary" onClick={() => navigate("/showcase/home-highlights/new")}>Add Item</Button>}
      />

      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search project title/slug"
          allowClear
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
          scroll={{ x: "max-content", y: "calc(100vh - 300px)" }}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => fetchData(page, pageSize, keyword),
          }}
        />
      </div>
    </div>
  );
}

export { HomeHighlightListPage };

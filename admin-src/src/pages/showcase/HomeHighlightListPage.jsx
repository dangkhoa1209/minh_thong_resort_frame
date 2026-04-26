import { useEffect, useMemo, useState } from "react";
import { Button, Input, InputNumber, Popconfirm, Space, Switch, Table } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { PageHeader } from "../../components/common/PageHeader";
import { toBackendAssetUrl } from "../../utils/media";
import { notifyError, notifySuccess } from "../../utils/notify";
import { deleteHomeHighlight, getHomeHighlights, updateHomeHighlight } from "../../services/showcase.api";

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

  const handleQuickUpdate = async (row, patch) => {
    try {
      await updateHomeHighlight(row.id, {
        project_id: row.project_id,
        sort_order: row.sort_order,
        is_active: row.is_active,
        ...patch,
      });
      notifySuccess("Updated successfully");
      fetchData(pagination.current, pagination.pageSize, keyword);
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot update item");
      fetchData(pagination.current, pagination.pageSize, keyword);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "display_image",
        width: 120,
        render: (value) => <img src={toBackendAssetUrl(value)} alt="" style={{ width: 80, height: 50, objectFit: "cover" }} />,
      },
      {
        title: "Project",
        width: 320,
        render: (_, row) => `${row.project_title || ""}${row.project_name ? ` - ${row.project_name}` : ""}`,
      },
      {
        title: "Order",
        dataIndex: "sort_order",
        width: 120,
        render: (value, row) => (
          <InputNumber
            min={0}
            defaultValue={value}
            onPressEnter={(event) => handleQuickUpdate(row, { sort_order: Number(event.currentTarget.value) || 0 })}
            onBlur={(event) => {
              const nextValue = Number(event.currentTarget.value) || 0;
              if (nextValue !== value) {
                handleQuickUpdate(row, { sort_order: nextValue });
              }
            }}
          />
        ),
      },
      {
        title: "Active",
        dataIndex: "is_active",
        width: 100,
        render: (value, row) => (
          <Switch checked={value} onChange={(checked) => handleQuickUpdate(row, { is_active: checked })} />
        ),
      },
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
        extra={<Button type="primary" onClick={() => navigate("/showcase/home-highlights/new")}>Add Project</Button>}
      />

      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search project title/name"
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

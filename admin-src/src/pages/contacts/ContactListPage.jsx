import { useEffect, useMemo, useState } from "react";
import { Grid, Input, Select, Space, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { PageHeader } from "../../components/common/PageHeader";
import { getContacts, updateContactStatus } from "../../services/contact.api";
import { notifyError, notifySuccess } from "../../utils/notify";

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

function ContactListPage() {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchData = async (page = 1, limit = 20, nextSearch = keyword, nextStatus = status) => {
    setLoading(true);
    try {
      const result = await getContacts({ page, limit, search: nextSearch, status: nextStatus });
      setItems(result.data.items);
      setPagination({
        current: result.data.pagination.page,
        pageSize: result.data.pagination.limit,
        total: result.data.pagination.total,
      });
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (row, nextStatus) => {
    try {
      await updateContactStatus(row.id, nextStatus);
      notifySuccess("Status updated");
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot update status");
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Customer",
        width: 240,
        render: (_, row) => (
          <Space direction="vertical" size={0}>
            <Typography.Text strong>{row.name || "No name"}</Typography.Text>
            <Typography.Text type="secondary">{row.email}</Typography.Text>
          </Space>
        ),
      },
      {
        title: "Message",
        dataIndex: "description",
        width: 360,
        render: (value) => value || <Typography.Text type="secondary">Email-only request</Typography.Text>,
      },
      {
        title: "Source",
        dataIndex: "source",
        width: 130,
        render: (value) => (value === "contact_page" ? "Contact page" : value === "footer" ? "Footer" : "Unknown"),
      },
      {
        title: "Status",
        dataIndex: "status",
        width: 160,
        render: (value, row) => (
          <Select
            value={value}
            options={statusOptions}
            style={{ width: 130 }}
            onChange={(nextStatus) => handleStatusChange(row, nextStatus)}
          />
        ),
      },
      {
        title: "Mail",
        dataIndex: "mail_sent",
        width: 100,
        render: (value) => <Tag color={value ? "green" : "red"}>{value ? "Sent" : "Failed"}</Tag>,
      },
      {
        title: "Created",
        dataIndex: "created_at",
        width: 170,
        render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
      },
    ],
    [pagination.current, pagination.pageSize, keyword, status]
  );

  return (
    <div style={{ height: "calc(100vh - 96px)", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <PageHeader title="Contact Requests" />

      <Space style={{ marginBottom: 16, width: "100%" }} wrap>
        <Input.Search
          placeholder="Search name, email, message"
          allowClear
          style={{ width: isMobile ? "100%" : 320 }}
          onSearch={(value) => {
            setKeyword(value);
            fetchData(1, pagination.pageSize, value, status);
          }}
        />
        <Select
          value={status}
          style={{ width: isMobile ? "100%" : 180 }}
          options={[{ value: "", label: "All statuses" }, ...statusOptions]}
          onChange={(value) => {
            setStatus(value);
            fetchData(1, pagination.pageSize, keyword, value);
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
            onChange: (page, pageSize) => fetchData(page, pageSize),
            simple: isMobile,
            showSizeChanger: !isMobile,
          }}
        />
      </div>
    </div>
  );
}

export { ContactListPage };

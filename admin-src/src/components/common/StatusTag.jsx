import { Tag } from "antd";

function StatusTag({ active }) {
  return <Tag color={active ? "green" : "default"}>{active ? "Visible" : "Hidden"}</Tag>;
}

export { StatusTag };

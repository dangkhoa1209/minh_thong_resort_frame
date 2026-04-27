import { useEffect, useMemo, useState } from "react";
import { Button, Card, Form } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { ShowcaseItemForm } from "../../components/showcase/ShowcaseItemForm";
import { createHomeHighlight, getHomeHighlight, updateHomeHighlight } from "../../services/showcase.api";
import { getProjects } from "../../services/project.api";
import { notifyError, notifySuccess } from "../../utils/notify";

function HomeHighlightFormPage() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const isEdit = useMemo(() => Boolean(id), [id]);

  useEffect(() => {
    (async () => {
      try {
        const result = await getProjects({ page: 1, limit: 100 });
        setProjects(result.data.items || []);
      } catch (error) {
        notifyError(error?.response?.data?.error?.message || "Cannot load projects");
      }
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const result = await getHomeHighlight(id);
        form.setFieldsValue(result.data);
      } catch (error) {
        notifyError(error?.response?.data?.error?.message || "Cannot load item");
      } finally {
        setLoading(false);
      }
    })();
  }, [form, id]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateHomeHighlight(id, values);
      } else {
        await createHomeHighlight(values);
      }
      notifySuccess("Saved successfully");
      navigate("/showcase/home-highlights");
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot save item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Home Highlight" : "Add Project to Home Highlights"}
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/showcase/home-highlights")}>
            Back
          </Button>
        }
      />
      <Card>
        <ShowcaseItemForm form={form} onSubmit={handleSubmit} submitting={loading} projects={projects} />
      </Card>
    </div>
  );
}

export { HomeHighlightFormPage };

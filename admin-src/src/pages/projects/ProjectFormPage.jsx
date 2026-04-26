import { useEffect, useMemo, useState } from "react";
import { Button, Card, Form } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { ProjectForm } from "../../components/projects/ProjectForm";
import { createProject, getProject, updateProject } from "../../services/project.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import { slugify } from "../../utils/slug";

function normalizeRows(rows = []) {
  return rows.map((row) => ({
    ...row,
    images: (row.images || []).map((item) => (typeof item === "string" ? { url: item } : item)),
  }));
}

function ProjectFormPage() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isEdit = useMemo(() => Boolean(id), [id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const result = await getProject(id);
        const item = result.data;
        form.setFieldsValue({
          ...item,
          image_rows: normalizeRows(item.image_rows || []),
        });
      } catch (error) {
        notifyError(error?.response?.data?.error?.message || "Cannot load project");
      } finally {
        setLoading(false);
      }
    })();
  }, [form, id]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const autoSlug = slugify(`${values.title || ""} ${values.name || ""}`);
      const payload = {
        ...values,
        slug: autoSlug,
        short_description: values.title || "",
        banner_title: values.banner_title || values.title || "",
        banner_subtitle: values.banner_subtitle || values.name || "",
        image_1: values.banner_image || "",
        image_rows: (values.image_rows || []).map((row) => ({
          layout: Number(row.layout) === 2 ? 2 : 1,
          ratio: row.ratio || "4:3",
          images: (row.images || []).map((item) => ({
            url: item.url || item,
            crop_ratio: item.crop_ratio || "",
            crop_mode: item.crop_mode || "",
          })),
        })),
      };

      if (isEdit) {
        await updateProject(id, payload);
      } else {
        await createProject(payload);
      }
      notifySuccess("Saved successfully");
      navigate("/projects");
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Project" : "Create Project"}
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/projects")}>
            Back
          </Button>
        }
      />
      <Card>
        <ProjectForm form={form} onSubmit={handleSubmit} submitting={loading} />
      </Card>
    </div>
  );
}

export { ProjectFormPage };

import { useEffect, useMemo, useState } from "react";
import { Card, Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { ShowcaseItemForm } from "../../components/showcase/ShowcaseItemForm";
import { createHeroSlide, getHeroSlide, updateHeroSlide } from "../../services/showcase.api";
import { getProjects } from "../../services/project.api";
import { notifyError, notifySuccess } from "../../utils/notify";

function HeroSlideFormPage() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const isEdit = useMemo(() => Boolean(id), [id]);

  useEffect(() => {
    (async () => {
      try {
        const result = await getProjects({ page: 1, limit: 200 });
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
        const result = await getHeroSlide(id);
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
        await updateHeroSlide(id, values);
      } else {
        await createHeroSlide(values);
      }
      notifySuccess("Saved successfully");
      navigate("/showcase/hero-slides");
    } catch (error) {
      notifyError(error?.response?.data?.error?.message || "Cannot save item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title={isEdit ? "Edit Hero Slide" : "Create Hero Slide"} />
      <Card>
        <ShowcaseItemForm form={form} onSubmit={handleSubmit} submitting={loading} projects={projects} />
      </Card>
    </div>
  );
}

export { HeroSlideFormPage };

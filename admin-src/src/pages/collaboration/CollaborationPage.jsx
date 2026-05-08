import { Card } from "antd";
import { PageHeader } from "../../components/common/PageHeader";
import { CollaborationImagesSettingForm } from "../../components/settings/CollaborationImagesSettingForm";

function CollaborationPage() {
  return (
    <div>
      <PageHeader title="Collaboration" />
      <Card>
        <CollaborationImagesSettingForm />
      </Card>
    </div>
  );
}

export { CollaborationPage };

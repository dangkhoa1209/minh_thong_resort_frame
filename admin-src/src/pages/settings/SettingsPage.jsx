import { Card, Tabs } from "antd";
import { PageHeader } from "../../components/common/PageHeader";
import { LogoSettingForm } from "../../components/settings/LogoSettingForm";
import { ContactSettingForm } from "../../components/settings/ContactSettingForm";

function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" />
      <Card>
        <Tabs
          items={[
            { key: "logo", label: "Logo", children: <LogoSettingForm /> },
            { key: "contact", label: "Contact", children: <ContactSettingForm /> },
          ]}
        />
      </Card>
    </div>
  );
}

export { SettingsPage };

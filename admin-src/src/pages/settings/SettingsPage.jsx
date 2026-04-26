import { Card, Tabs } from "antd";
import { PageHeader } from "../../components/common/PageHeader";
import { LogoSettingForm } from "../../components/settings/LogoSettingForm";
import { ContactSettingForm } from "../../components/settings/ContactSettingForm";
import { HomeBannerSettingForm } from "../../components/settings/HomeBannerSettingForm";
import { HomePartnersSettingForm } from "../../components/settings/HomePartnersSettingForm";

function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" />
      <Card>
        <Tabs
          items={[
            { key: "logo", label: "Logo", children: <LogoSettingForm /> },
            { key: "home-banner", label: "Home Banner", children: <HomeBannerSettingForm /> },
            { key: "home-partners", label: "Home Partners", children: <HomePartnersSettingForm /> },
            { key: "contact", label: "Contact", children: <ContactSettingForm /> },
          ]}
        />
      </Card>
    </div>
  );
}

export { SettingsPage };

import { Card, Grid, Tabs } from "antd";
import { PageHeader } from "../../components/common/PageHeader";
import { LogoSettingForm } from "../../components/settings/LogoSettingForm";
import { ContactSettingForm } from "../../components/settings/ContactSettingForm";
import { HomeBannerSettingForm } from "../../components/settings/HomeBannerSettingForm";
import { HomePartnersSettingForm } from "../../components/settings/HomePartnersSettingForm";
import { UserManagementForm } from "../../components/settings/UserManagementForm";
import { ChangePasswordForm } from "../../components/settings/ChangePasswordForm";
import { useAuthStore } from "../../store/auth.store";

function SettingsPage() {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const user = useAuthStore((state) => state.user);
  const role = String(user?.role || "").toLowerCase();
  const isOwner = role === "owner" || role === "admin";

  const tabItems = [
    { key: "logo", label: "Logo", children: <LogoSettingForm /> },
    { key: "home-banner", label: "Home Banner", children: <HomeBannerSettingForm /> },
    { key: "home-partners", label: "Home Partners", children: <HomePartnersSettingForm /> },
    { key: "contact", label: "Contact", children: <ContactSettingForm /> },
    { key: "password", label: "Change Password", children: <ChangePasswordForm /> },
  ];

  if (isOwner) {
    tabItems.push({ key: "users", label: "Users", children: <UserManagementForm /> });
  }

  return (
    <div>
      <PageHeader title="Settings" />
      <Card>
        <Tabs items={tabItems} tabPosition={isMobile ? "top" : "left"} />
      </Card>
    </div>
  );
}

export { SettingsPage };

import { Outlet, NavLink } from "react-router-dom";
import { Avatar, Dropdown, Space, Typography, Modal } from "antd";
import {
  MdDashboard,
  MdPeople,
  MdSettings,
  MdLogout,
  MdPerson,
  MdOutlineInventory2,
} from "react-icons/md";
import { FaWpforms, FaRegCalendarCheck } from "react-icons/fa";
import { TbLogs } from "react-icons/tb";
import { RiListSettingsFill } from "react-icons/ri";
import { IoMdMore } from "react-icons/io";
import { GrSchedules, GrCatalog } from "react-icons/gr";
import { PiArticleMedium } from "react-icons/pi";
import { useAuth } from "../../context/AuthProvider";
import { ROUTES } from "../../lib/constants";
import { useState } from "react";
import AccountProfile from "../../pages/private/account-profile";
import AccountSettings from "../../pages/private/account-settings";

export default function PrivateLayout() {
  const { session, signOut } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const user = session?.user;

  // 🧠 Fix: roles is an array (e.g. ["ADMIN"])
  const userRoles = user?.roles?.map((r) => r.toUpperCase()) || [];
  const primaryRole = userRoles[0] || "MEMBER";

  const navItems = [
    {
      to: ROUTES.DASHBOARD,
      label: "Dashboard",
      icon: <MdDashboard className="w-6 h-6" />,
    },
    {
      to: ROUTES.APPOINTMENTS,
      label: "Appointments",
      icon: <FaRegCalendarCheck className="w-6 h-6" />,
    },
    {
      to: ROUTES.SCHEDULES,
      label: "Schedules",
      icon: <GrSchedules className="w-6 h-6" />,
    },
    {
      to: ROUTES.ACQUISITIONS,
      label: "Acquisitions",
      icon: <FaWpforms className="w-6 h-6" />,
    },
    {
      to: ROUTES.CATALOGS,
      label: "Catalogs",
      icon: <GrCatalog className="w-6 h-6" />,
    },
    {
      to: ROUTES.INVENTORY,
      label: "Inventory",
      icon: <MdOutlineInventory2 className="w-6 h-6" />,
    },

    {
      to: ROUTES.ARTICLES,
      label: "Articles",
      icon: <PiArticleMedium className="w-6 h-6" />,
    },

    // Restricted Routes
    {
      to: ROUTES.AUDIT_LOGS,
      label: "Audit Logs",
      icon: <TbLogs className="w-6 h-6" />,
      roles: ["ADMIN", "SUPERADMIN"],
    },
    {
      to: ROUTES.USERS,
      label: "Users",
      icon: <MdPeople className="w-6 h-6" />,
      roles: ["ADMIN", "SUPERADMIN"],
    },
    {
      to: ROUTES.CONFIGURATIONS,
      label: "Configurations",
      icon: <RiListSettingsFill className="w-6 h-6" />,
      roles: ["ADMIN", "SUPERADMIN"],
    },
  ];

  // 🧩 Filter based on user roles
  const filteredNavItems = navItems.filter(
    (item) =>
      !item.roles ||
      item.roles.some((role) => userRoles.includes(role.toUpperCase())),
  );

  // 🔒 Logout confirmation
  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to log out?",
      okText: "Yes, Logout",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        await signOut();
      },
    });
  };

  // ⚙️ Dropdown menu
  const userMenu = {
    items: [
      {
        key: "1",
        label: (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setOpenProfile(true)}
          >
            <MdPerson /> Profile
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setOpenSettings(true)}
          >
            <MdSettings /> Account Settings
          </div>
        ),
      },
      { type: "divider" },
      {
        key: "3",
        label: (
          <div
            className="flex items-center gap-2 text-red-500 cursor-pointer"
            onClick={handleLogout}
          >
            <MdLogout /> Logout
          </div>
        ),
      },
    ],
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-950 text-white flex flex-col">
        {/* Logo */}
        <div className="w-full h-fit p-4 flex items-center justify-start border-b border-neutral-800 gap-x-2">
          <img src="/LOGO.png" className="w-10 h-10" alt="App Logo" />
          <h1 className="text-2xl font-semibold">MIS</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 text-lg px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive
                    ? "!bg-white !text-black !font-semibold"
                    : "!text-gray-300 hover:!bg-neutral-800 hover:!text-white"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer (User Section) */}
        <div className="mt-auto w-full p-4 border-t border-neutral-800 bg-neutral-950">
          <Dropdown menu={userMenu} trigger={["click"]} placement="topRight">
            <button className="w-full flex items-center justify-between text-left">
              <Space>
                <Avatar
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${
                    user?.name || user?.email || "User"
                  }`}
                  size="large"
                />
                <div className="flex flex-col text-sm">
                  <Typography.Text strong className="!text-white">
                    {user?.name || "User"}
                  </Typography.Text>
                  <Typography.Text className="!text-gray-400 !text-xs">
                    {primaryRole}
                  </Typography.Text>
                </div>
              </Space>
              <IoMdMore />
            </button>
          </Dropdown>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-2 pb-4 px-4 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>

      {/* Profile Modal */}
      <Modal
        open={openProfile}
        onCancel={() => setOpenProfile(false)}
        footer={null}
        width="50%"
        centered
        destroyOnHidden
        maskClosable={false}
        title="Account Profile"
      >
        <div className="p-4">
          <AccountProfile />
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        open={openSettings}
        onCancel={() => setOpenSettings(false)}
        footer={null}
        width="60%"
        maskClosable={false}
        destroyOnHidden
        title="Account Settings"
      >
        <div className="p-4">
          <AccountSettings />
        </div>
      </Modal>
    </div>
  );
}

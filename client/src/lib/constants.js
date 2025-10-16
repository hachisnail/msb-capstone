// app routes
export const ROUTES = {
  // Public Routes
  HOME: "/",
  LOGIN: "/login",
  ACCEPT_INVITE: "/accept-invite",

  // Private routes
  DASHBOARD: "/app/dashboard",
  USERS: "/app/users",
  // converted to modal routes
  // ACCOUNT_PROFILE: "/app/account-profile",
  // ACCOUNT_SETTINGS: "/app/account-settings",
  CONFIGURATIONS: "/app/configurations",

  AUDIT_LOGS: "/app/audit-logs",
  INVENTORY: "/app/inventory",
  SCHEDULES: "/app/schedules",
  ARTICLES: "/app/articles",
  ARTICLE_BUILDER: "/app/articles/article-builder",
  APPOINTMENTS: "/app/appointments",
  ACQUISITIONS: "/app/acquisitions",
  CATALOGS: "/app/catalogs",
  WALKIN_APPOINTMENT: "/app/appointments/walk-in-appointment",
  // handlers
  FORBIDDEN: "/app/forbidden",
};

// antd theme overrides
export const theme = {
  token: {
    colorPrimary: "#0f172a",
    colorBgBase: "#f8fafc",
    colorTextBase: "#0f172a",
    colorBorder: "#9ca3af",
    borderRadius: 6,
    paddingSM: 8,
    paddingMD: 16,
    paddingLG: 24,
    marginSM: 8,
    marginMD: 16,
    marginLG: 24,
  },
  components: {
    Button: {
      colorPrimary: "#0f172a",
      colorPrimaryHover: "#1e293b",
      borderRadius: 5,
    },
    Input: {
      borderRadius: 5,
      colorBgContainer: "#ffffff",
      paddingBlock: 8,
      paddingInline: 12,
    },
    Card: {
      borderRadius: 6,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      colorBorderSecondary: "#9ca3af",
      padding: 12, // 🔹 Tighter overall padding
      paddingLG: 16, // 🔹 Smaller large variant padding
      headerHeight: 40, // 🔹 Slimmer header area
      marginSM: 8, // 🔹 Less outer spacing
    },
    Space: {
      size: 16,
    },
    Divider: {
      colorSplit: "#cbd5e1",
      marginLG: 24,
    },
    Alert: {
      borderRadius: 6,
      padding: 12,
    },
    Modal: {
      padding: 20,
      paddingContentHorizontal: 20,
      paddingContentVertical: 16,
      borderRadiusLG: 8,
    },
    Table: {
      // borderColor: "#9ca3af", // gray-400 border lines
      headerBorderRadius: 6,
      colorBorderSecondary: "#9ca3af", // matches divider tone
      rowHoverBg: "#d1d5db",
    },
  },
};

import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Form,
  Input,
  Button,
  Select,
  message,
  Space,
  Typography,
  Modal,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import axiosClient from "../../../lib/axiosClient";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import { useAuth } from "../../../context/AuthProvider";
import RequirePerm from "../../../components/RequirePerm"; // adjust path if needed

const { Title } = Typography;

export default function User() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [invites, setInvites] = useState([]);
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const { session } = useAuth();

  // Canonical role list (same order as seed)
  const roles = [
    "SUPERADMIN",
    "ADMIN",
    "APPOINTMENTS",
    "INVENTORY",
    "AUTHOR",
    "EDITOR",
    "ACQUISITIONS",
    "CATALOGS",
    "VIEWER",
  ];

  // ---- Restrict allowed invite targets ----
  const allowedRoles = session?.user?.roles?.includes("SUPERADMIN")
    ? roles
    : session?.user?.roles?.includes("ADMIN")
      ? roles.filter((r) => r !== "SUPERADMIN" && r !== "ADMIN")
      : [];

  // ---- Fetch data ----
  async function fetchData() {
    setLoading(true);
    try {
      const [invRes, userRes] = await Promise.all([
        axiosClient.get("/api/invites"),
        axiosClient.get("/api/users"),
      ]);
      setInvites(Array.isArray(invRes.data) ? invRes.data : []);
      setUsers(Array.isArray(userRes.data) ? userRes.data : []);
    } catch (err) {
      console.error("Data fetch error:", err);
      message.error(err.normalized?.data?.error || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ---- Invite handler ----
  async function handleInvite(values) {
    if (!allowedRoles.includes(values.roleName)) {
      return message.error("You are not allowed to invite this role.");
    }

    try {
      setLoading(true);
      await axiosClient.post("/api/invite", values);
      message.success(`Invite sent to ${values.email}`);
      form.resetFields();
      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Invite error:", err);
      message.error(err.normalized?.data?.error || "Failed to send invite");
    } finally {
      setLoading(false);
    }
  }

  // ---- Verified field ----
  const renderVerified = (verifiedAt) => {
    if (!verifiedAt) return <span style={{ color: "#888" }}>Not verified</span>;
    const d = new Date(verifiedAt);
    return (
      <span style={{ color: "green" }}>
        {d.toLocaleDateString()} {d.toLocaleTimeString()}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Breadcrumbs />

      {/* ---- Invite buttons ---- */}
      <RequirePerm perm="users.invite">
        {allowedRoles.length > 0 && (
          <Space style={{ marginBottom: 4 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
            >
              Invite New User
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchData}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
        )}
      </RequirePerm>

      {/* ---- Invite modal ---- */}
      <Modal
        title="Invite New User"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleInvite}>
          <Form.Item
            name="fname"
            label="First Name"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="John" />
          </Form.Item>

          <Form.Item
            name="lname"
            label="Last Name"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Valid email required",
              },
            ]}
          >
            <Input placeholder="john.doe@email.com" />
          </Form.Item>

          <Form.Item
            name="roleName"
            label="Role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select
              placeholder="Select a role"
              options={allowedRoles.map((r) => ({ label: r, value: r }))}
            />
          </Form.Item>

          <div className="flex justify-end">
            <Space>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Send Invite
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* ---- Active Invites ---- */}
      <Card
        title={
          <Space>
            <Title level={4} className="!mb-0">
              Active Invites
            </Title>
          </Space>
        }
      >
        <Table
          dataSource={invites}
          rowKey="email"
          columns={[
            { title: "Email", dataIndex: "email" },
            { title: "Name", render: (_, r) => `${r.fname} ${r.lname}` },
            {
              title: "Expires",
              dataIndex: "expires",
              render: (d) => new Date(d).toLocaleString(),
            },
          ]}
        />
      </Card>

      {/* ---- Current Users ---- */}
      <Card title={<Title level={4}>Current Users</Title>} loading={loading}>
        <Table
          dataSource={users}
          rowKey="id"
          columns={[
            { title: "Email", dataIndex: "email" },
            { title: "Name", render: (_, r) => `${r.fname} ${r.lname}` },
            {
              title: "Role(s)",
              dataIndex: "roles",
              render: (r) => r?.join(", "),
            },
            {
              title: "Verified",
              dataIndex: "emailVerified",
              render: renderVerified,
            },
          ]}
        />
      </Card>
    </div>
  );
}

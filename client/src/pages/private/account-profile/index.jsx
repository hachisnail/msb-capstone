// src/pages/private/account-profile/index.jsx
import { useEffect, useState } from "react";
import {
  Card,
  Tag,
  Spin,
  Typography,
  Divider,
  Space,
  Descriptions,
} from "antd";
import axiosClient from "../../../lib/axiosClient";
import { useAuth } from "../../../context/AuthProvider";

const { Title, Text } = Typography;

export default function AccountProfile() {
  const { session } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    async function fetchUser() {
      try {
        const res = await axiosClient.get(`/api/users/${session.user.id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <Text type="danger">No user data found.</Text>
      </div>
    );
  }

  return (
    <div className="py-2 px-1">
      <Card
        variant="borderless"
        className="shadow-none bg-transparent"
        styles={{
          body: { padding: 0 },
        }}
      >
        <Space direction="vertical" size="middle" className="w-full">
          <div className="text-center mb-2">
            <Title level={4} style={{ marginBottom: 0 }}>
              {`${user.fname || ""} ${user.lname || ""}`.trim() ||
                "User Profile"}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {user.email}
            </Text>
          </div>

          <Descriptions
            layout="vertical"
            column={2}
            colon={false}
            styles={{
              label: {
                fontWeight: 500,
                color: "rgba(0,0,0,0.65)",
              },
              content: {
                color: "rgba(0,0,0,0.88)",
              },
            }}
          >
            <Descriptions.Item label="Contact">
              {user.contact || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Birthdate">
              {user.birthdate || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Roles">
              {user.roles?.length ? (
                <Space size={[4, 4]} wrap>
                  {user.roles.map((r) => (
                    <Tag key={r} color="blue">
                      {r}
                    </Tag>
                  ))}
                </Space>
              ) : (
                "No roles"
              )}
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ margin: "8px 0" }} />

          <div>
            <Title level={5} style={{ marginBottom: 8 }}>
              Role-Based Access Summary
            </Title>
            <ul className="list-disc list-inside text-gray-600">
              <li>
                Has role <b>SUPERADMIN</b>?{" "}
                {user.roles?.includes("SUPERADMIN") ? "Yes" : "No"}
              </li>
              <li>
                Missing permission: <code>inventory.create</code>
              </li>
              <li>
                Missing permission: <code>articles.approve</code>
              </li>
            </ul>
          </div>
        </Space>
      </Card>
    </div>
  );
}

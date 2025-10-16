import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
  DatePicker,
  Spin,
} from "antd";
import axiosClient from "../../../lib/axiosClient";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;

export default function AcceptInvite() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const token = params.get("token");

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Load invite details
  useEffect(() => {
    async function fetchInvite() {
      if (!token) {
        setError("Missing or invalid invite token.");
        setLoading(false);
        return;
      }
      try {
        const res = await axiosClient.get(`/api/accept-invite?token=${token}`);
        setInvite(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Invalid or expired invite.");
        setLoading(false);
      }
    }
    fetchInvite();
  }, [token]);

  async function onFinish(values) {
    const { password, birthdate } = values;

    try {
      setSubmitting(true);
      await axiosClient.post("/api/accept-invite", {
        token,
        password,
        birthdate: birthdate?.format("YYYY-MM-DD"),
      });

      message.success("Account setup complete! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.error || "Failed to complete invite");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <Title level={3}>Invite Invalid</Title>
        <Paragraph type="danger">{error}</Paragraph>
        <Button type="primary" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card style={{ width: 420 }} bordered={false} className="shadow-lg">
        <Title level={3}>Complete Your Registration</Title>
        <Paragraph>
          Welcome, {invite.fname} {invite.lname}! You’ve been invited as a{" "}
          <strong>{invite.roleName}</strong>. Please set your password and
          confirm your details below.
        </Paragraph>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email">
            <Input value={invite.email} disabled />
          </Form.Item>

          <Form.Item
            name="birthdate"
            label="Birthdate"
            rules={[{ required: true, message: "Birthdate is required" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(d) => d && d > dayjs()}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Password required" },
              { min: 6, message: "At least 6 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value)
                    return Promise.resolve();
                  return Promise.reject("Passwords do not match");
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            block
            size="large"
          >
            Complete Registration
          </Button>
        </Form>
      </Card>
    </div>
  );
}

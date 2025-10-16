import { useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Modal, Card, Typography } from "antd";

export default function Login() {
  document.title = "Login";

  const { signIn } = useAuth();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const onFinish = async (values) => {
    const { identifier, password } = values;
    setErr("");
    setBusy(true);
    try {
      await signIn(identifier, password);
      nav("/app/dashboard", { replace: true });
    } catch (e2) {
      setErr(e2.normalized?.data?.error || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const handleCloseError = () => setErr("");

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm shadow-md shadow-gray-400 rounded-xl">
        <Typography.Title level={1} className="text-center mb-6">
          Sign In
        </Typography.Title>

        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            label="Email or Username"
            name="identifier"
            rules={[
              {
                required: true,
                message: "Please enter your email or username",
              },
            ]}
          >
            <Input placeholder="Enter your email or username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={busy}
              block
              className="!bg-slate-900 !hover:bg-slate-800"
            >
              {busy ? "Signing in…" : "Sign In"}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Compact Error Modal */}
      <Modal
        title="Login Error"
        open={!!err}
        onOk={handleCloseError}
        onCancel={handleCloseError}
        okText="Close"
        cancelButtonProps={{ style: { display: "none" } }}
        width={360} // 👈 Makes the modal narrower
        centered
        styles={{
          body: { textAlign: "left", fontSize: "14px", padding: "12px 8px" },
          header: { textAlign: "left", paddingBottom: "8px" },
        }}
      >
        <p>{String(err)}</p>
      </Modal>
    </main>
  );
}

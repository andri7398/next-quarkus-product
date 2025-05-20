"use client";

import { useState } from "react";
import { Form, Input, Button, Typography, message, Space } from "antd";
import api from "@/utils/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const onFinishLogin = async (values) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/login", values);
      Cookies.set("token", response.data.token);
      message.success("Login successful");
      router.push("/products");
    } catch (err) {
      message.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onFinishRegister = async (values) => {
    try {
      setLoading(true);
      await api.post("/auth/register", values);
      message.success("Registration successful. Please log in.");
      setIsLogin(true); 
    } catch (err) {
      console.log('Register error:', err.response?.data || err.message);
      message.error(
      `Registration failed: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} align="center">
      <Title level={2}>{isLogin ? "Login" : "Register"}</Title>

      {isLogin ? (
        <Form name="login" onFinish={onFinishLogin} style={{ maxWidth: 400 }}>
          <Form.Item name="username" rules={[{ required: true }]}>
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item style={{ color: 'blue' }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log In
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" onClick={() => setIsLogin(false)} block>
              Don't have an account? Register
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form name="register" onFinish={onFinishRegister} style={{ maxWidth: 400 }}>
          <Form.Item name="username" rules={[{ required: true }]}>
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item name="confirmPassword" rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}>
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" onClick={() => setIsLogin(true)} block>
              Already have an account? Log in
            </Button>
          </Form.Item>
        </Form>
      )}
    </Space>
  );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, UserAddOutlined } from '@ant-design/icons';
import api from '../lib/axios';

interface RegisterForm {
  email: string;
  password: string;
  full_name: string;
  contact_number: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: RegisterForm) => {
    try {
      setLoading(true);
      await api.post('/auth/register', {
        ...values,
        role: 'user'
      });
      message.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="full_name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input prefix={<UserAddOutlined />} placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="contact_number"
            rules={[{ required: true, message: 'Please input your contact number!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Contact Number" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              loading={loading}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
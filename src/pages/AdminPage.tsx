import React from 'react';
import { Tabs, Table, Button, Form, Input, InputNumber, Select, message } from 'antd';
import type { Room, Reservation } from '../types';
import api from '../lib/axios';
import { format } from 'date-fns';

const { TabPane } = Tabs;

export default function AdminPage() {
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [reservations, setReservations] = React.useState<Reservation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [form] = Form.useForm();

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, reservationsRes] = await Promise.all([
        api.get('/rooms'),
        api.get('/reservations')
      ]);
      setRooms(roomsRes.data.rooms);
      setReservations(reservationsRes.data.reservations);
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (values: any) => {
    try {
      await api.post('/rooms', values);
      message.success('Room added successfully');
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error('Failed to add room');
    }
  };

  const roomColumns = [
    {
      title: 'Room Number',
      dataIndex: 'room_number',
      key: 'room_number',
    },
    {
      title: 'Type',
      dataIndex: 'room_type',
      key: 'room_type',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`,
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Room) => (
        <Select
          defaultValue={status}
          onChange={async (value) => {
            try {
              await api.put(`/rooms/${record.id}/status`, { status: value });
              message.success('Room status updated successfully');
              fetchData(); // Refresh data
            } catch (error) {
              message.error('Failed to update room status');
            }
          }}
        >
          <Select.Option value="available">Available</Select.Option>
          <Select.Option value="occupied">Occupied</Select.Option>
        </Select>
      ),
    },
  ];

  const reservationColumns = [
    {
      title: 'User Name',
      dataIndex: 'user_name',  // New column for username
      key: 'user_name',
    },
    {
      title: 'Phone Number',
      dataIndex: 'user_phone',  // New column for phone number
      key: 'user_phone',
    },
    {
      title: 'Room ID',
      dataIndex: 'room_id',
      key: 'room_id',
    },
    {
      title: 'Check In',
      dataIndex: 'check_in_date',
      key: 'check_in_date',
      render: (date: string) => format(new Date(date), 'MMM dd, yyyy'),
    },
    {
      title: 'Check Out',
      dataIndex: 'check_out_date',
      key: 'check_out_date',
      render: (date: string) => format(new Date(date), 'MMM dd, yyyy'),
    },
    {
      title: 'Total Price',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price: number) => `$${price}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded ${status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Rooms" key="1">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Room</h2>
            <Form
              form={form}
              onFinish={handleAddRoom}
              layout="vertical"
              className="max-w-md"
            >
              <Form.Item
                name="room_number"
                label="Room Number"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="room_type"
                label="Room Type"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="Single">Single</Select.Option>
                  <Select.Option value="Double">Double</Select.Option>
                  <Select.Option value="Suite">Suite</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="price"
                label="Price per Night"
                rules={[{ required: true }]}
              >
                <InputNumber
                  prefix="$"
                  className="w-full"
                  min={0}
                />
              </Form.Item>

              <Form.Item
                name="capacity"
                label="Capacity"
                rules={[{ required: true }]}
              >
                <InputNumber className="w-full" min={1} />
              </Form.Item>

              <Form.Item
                name="amenities"
                label="Amenities"
                rules={[{ required: true }]}
              >
                <Input.TextArea />
              </Form.Item>

              <Form.Item
                name="image_url"
                label="Image URL (Optional)"
                rules={[{ type: 'url', warningOnly: true, message: 'Please enter a valid URL' }]}
              >
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Room
                </Button>
              </Form.Item>
            </Form>
          </div>

          <h2 className="text-xl font-semibold mb-4">Existing Rooms</h2>
          <Table
            columns={roomColumns}
            dataSource={rooms}
            loading={loading}
            rowKey="id"
          />
        </TabPane>

        <TabPane tab="Reservations" key="2">
          <h2 className="text-xl font-semibold mb-4">All Reservations</h2>
          <Table
            columns={reservationColumns}
            dataSource={reservations}
            loading={loading}
            rowKey="id"
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
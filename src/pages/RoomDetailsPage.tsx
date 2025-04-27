import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, DatePicker, message, Descriptions, Spin, Tag } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import type { Room } from '../types';
import api from '../lib/axios';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function RoomDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = React.useState<Room | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [bookingDates, setBookingDates] = React.useState<any>(null);
  const [bookingLoading, setBookingLoading] = React.useState(false);


  React.useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/rooms/${id}`);
      setRoom(response.data.room);
    } catch (error) {
      message.error('Failed to fetch room details');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      message.info('Please login to make a reservation');
      navigate('/login');
      return;
    }

    if (!bookingDates) {
      message.error('Please select check-in and check-out dates');
      return;
    }

    const [checkIn, checkOut] = bookingDates;

    try {
      setBookingLoading(true);
      await api.post('/reservations', {
        user_id: user.id,
        room_id: id,
        check_in_date: bookingDates[0].format('YYYY-MM-DD'),
        check_out_date: bookingDates[1].format('YYYY-MM-DD'),
        price: room?.price
      });

      message.success('Reservation created successfully!');
      // Refresh room status after booking
      await fetchRoomDetails();
      navigate('/reservations');
    } catch (error) {
      message.error('Failed to create reservation');
    } finally {
      setBookingLoading(false);
    }
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card
        cover={
          <img
            alt={`Room ${room.room_number}`}
            src={room.image_url || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'}
            className="h-96 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80';
            }}
          />
        }
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {room.room_type} - Room {room.room_number}
          </h1>

          <Descriptions bordered>
            <Descriptions.Item label="Price per night" span={3}>
              <span className="text-xl font-semibold text-indigo-600">
                ${room.price.toFixed(2)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Capacity" span={3}>
              {room.capacity}
            </Descriptions.Item>
            <Descriptions.Item label="Amenities" span={3}>
              {room.amenities}
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={3}>
              <Tag color={room.status === 'available' ? 'green' : room.status === 'occupied' ? 'red' : 'orange'}>
                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {room.status === 'available' ? (
          <div className="space-y-4">
            <RangePicker
              className="w-full"
              onChange={setBookingDates}
              disabledDate={disabledDate}
              disabled={bookingLoading}
              format="YYYY-MM-DD"
            />

            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={handleBooking}
              loading={bookingLoading}
              disabled={!bookingDates || bookingLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              size="large"
            >
              Book Now
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <Tag color="error" className="text-lg">
              This room is currently {room.status}
            </Tag>
          </div>
        )}
      </Card>
    </div>
  );
}
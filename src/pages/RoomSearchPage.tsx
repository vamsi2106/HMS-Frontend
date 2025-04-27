import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, DatePicker, Button, message } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Room } from '../types';
import api from '../lib/axios';
import RoomCard from '../components/RoomCard';

const { RangePicker } = DatePicker;

export default function RoomSearchPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filters, setFilters] = React.useState({
    type: '',
    capacity: '',
    dates: null
  });
  const [searched, setSearched] = React.useState(false);

  React.useEffect(() => {
    fetchRooms();
    // Set up interval to refresh rooms every 30 seconds
    const interval = setInterval(fetchRooms, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rooms');
      setRooms(response.data.rooms);
    } catch (error) {
      message.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearched(true);
  };

  const handleRefresh = () => {
    fetchRooms();
    message.success('Room list refreshed');
  };

  const filteredRooms = searched ? rooms.filter(room => {
    const typeMatch = !filters.type || room.room_type === filters.type;
    const capacityMatch = !filters.capacity || room.capacity >= parseInt(filters.capacity);
    return typeMatch && capacityMatch;
  }) : rooms;

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <Select
            placeholder="Room Type"
            onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
            className="w-full"
          >
            <Select.Option value="Single">Single</Select.Option>
            <Select.Option value="Double">Double</Select.Option>
            <Select.Option value="Suite">Suite</Select.Option>
          </Select>

          <Select
            placeholder="Capacity"
            onChange={(value) => setFilters(prev => ({ ...prev, capacity: value }))}
            className="w-full"
          >
            <Select.Option value="1">1 Person</Select.Option>
            <Select.Option value="2">2 People</Select.Option>
            <Select.Option value="4">4 People</Select.Option>
          </Select>

          {/* <RangePicker
            className="w-full"
            onChange={(dates) => setFilters(prev => ({ ...prev, dates }))}
          /> */}

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Search
          </Button>

          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
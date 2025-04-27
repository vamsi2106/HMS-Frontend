import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons';

export default function HomePage() {
  return (
    <div className="relative">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)',
          filter: 'brightness(0.6)'
        }}
      />
      
      <div className="relative z-10 min-h-[80vh] flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-5xl font-bold mb-6">Welcome to LuxStay</h1>
        <p className="text-xl mb-8 max-w-2xl">
          Experience luxury and comfort in our carefully curated selection of rooms.
          Book your perfect stay today.
        </p>
        
        <div className="flex gap-4">
          <Link to="/search">
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Search Rooms
            </Button>
          </Link>
          <Link to="/reservations">
            <Button
              size="large"
              icon={<CalendarOutlined />}
              className="border-white text-white hover:text-white"
              ghost
            >
              My Reservations
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative z-10 bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Luxury Rooms',
                description: 'Experience comfort in our well-appointed rooms',
                image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
              },
              {
                title: '24/7 Service',
                description: 'Round-the-clock support for all your needs',
                image: 'https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
              },
              {
                title: 'Fine Dining',
                description: 'Exquisite dining experiences at your service',
                image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
              }
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
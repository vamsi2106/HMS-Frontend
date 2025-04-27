import { Card, Button, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function RoomCard({ room }: { room: Room }) {
    const navigate = useNavigate();
    // Define default images
    const defaultRoomImages: Record<string, string> = {
        Single: 'https://images.unsplash.com/photo-1560067174-40f3b241c800?auto=format&fit=crop&w=800&q=60',
        Double: 'https://images.unsplash.com/photo-1600736276199-28f013cdd2b9?auto=format&fit=crop&w=800&q=60',
        Suite: 'https://images.unsplash.com/photo-1587676041643-8ec9596209a9?auto=format&fit=crop&w=800&q=60',
        default: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=60' // Generic fallback
    };

    // Use provided image_url or fallback to default based on type
    const imageUrl = room.image_url || defaultRoomImages[room.room_type] || defaultRoomImages.default;

    return (
        <Card
            hoverable
            cover={
                <img
                    alt={room.room_type}
                    src={imageUrl}
                    className="h-48 w-full object-cover"
                    // Add basic error handling for broken image links
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        target.src = defaultRoomImages.default; // Fallback to generic image
                    }}
                />
            }
            onClick={() => navigate(`/room/${room.id}`)}
            className="cursor-pointer"
        >
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                    {room.room_type} #{room.room_number}
                </h3>
                {/* Updated Tag logic based on backend status possibilities */}
                <Tag color={room.status === 'available' ? 'green' : room.status === 'occupied' ? 'red' : 'orange'}>
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </Tag>
            </div>
            <p className="mb-2">${room.price.toFixed(2)} per night</p>
            <p className="mb-4">Capacity: {room.capacity}</p>
            <Button type="primary" block>
                View Details
            </Button>
        </Card>
    );
} 
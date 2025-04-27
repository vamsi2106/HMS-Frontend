import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal, Tag, Space, Input, Select, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom'; // useNavigate might not be needed here now
import type { Reservation } from '../types';
// import type { Payment } from '../types'; // Payment type might be less relevant now
import api from '../lib/axios';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

export default function ReservationPage() {
  const { user } = useAuth();
  // const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPaymentId, setProcessingPaymentId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedReservationForPayment, setSelectedReservationForPayment] = useState<Reservation | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCVV, setCardCVV] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedReservationForDetails, setSelectedReservationForDetails] = useState<Reservation | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any[]>([]);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) { // Only fetch if user is loaded
      fetchReservations();

      // Set up auto-refresh interval (every 30 seconds)
      const interval = setInterval(fetchReservations, 30000);
      return () => clearInterval(interval);
    }
  }, [user]); // Refetch if user changes

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reservations');
      // Make sure we handle both response formats (object with reservations or direct array)
      const reservationData = response.data.reservations || response.data;
      setReservations(reservationData);
    } catch (error) {
      console.error("Fetch reservations error:", error);
      message.error('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchReservations();
    message.success('Reservations refreshed');
  };

  const handleCancel = async (id: number) => {
    try {
      setCancellingId(id);
      await api.delete(`/reservations/${id}`);
      message.success('Reservation cancelled successfully');
      fetchReservations(); // Refresh the list
    } catch (error: any) {
      message.error(error?.response?.data?.detail || 'Failed to cancel reservation');
    } finally {
      setCancellingId(null);
    }
  };

  const showPaymentModal = (reservation: Reservation) => {
    setSelectedReservationForPayment(reservation);
    // reset mock payment form
    setPaymentMethod('card');
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setUpiId('');
    setIsPaymentModalVisible(true);
  };

  const handlePaymentOk = async () => {
    if (!selectedReservationForPayment) return;
    // validate mock payment inputs
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCVV) {
        message.error('Please fill in all card details');
        return;
      }
    } else {
      if (!upiId) {
        message.error('Please enter UPI ID');
        return;
      }
    }
    const id = selectedReservationForPayment.id;
    try {
      setProcessingPaymentId(id);
      // simulate gateway processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await api.post(`/reservations/${id}/pay`);
      Modal.success({
        title: 'Payment Successful',
        content: (
          <div>
            <p><strong>Amount:</strong> ${selectedReservationForPayment?.total_price.toFixed(2)}</p>
            <p><strong>Method:</strong> {paymentMethod === 'card' ? 'Card' : 'UPI'}</p>
          </div>
        ),
      });
      message.success('Payment processed!');
      setIsPaymentModalVisible(false);
      setSelectedReservationForPayment(null);
      fetchReservations(); // Refresh the list
    } catch (error: any) {
      console.error("Payment error:", error);
      message.error(error?.response?.data?.detail || 'Payment failed. Please try again.');
    } finally {
      setProcessingPaymentId(null);
    }
  };

  const handlePaymentCancel = () => {
    setIsPaymentModalVisible(false);
    setSelectedReservationForPayment(null);
  };

  const showDetailsModal = async (reservation: Reservation) => {
    setSelectedReservationForDetails(reservation);
    setIsDetailsModalVisible(true);
    setDetailsLoading(true);
    try {
      const res = await api.get('/payments', { params: { reservation_id: reservation.id } });
      const details = res.data.payments || res.data || [];
      setPaymentDetails(details);
    } catch {
      message.error('Failed to load payment details');
    } finally {
      setDetailsLoading(false);
    }
  };

  // Filter logic is handled by the backend now, but double-check if needed
  // const userReservations = reservations.filter(
  //   (reservation) => reservation.user_id === user?.id
  // );

  const columns = [
    {
      title: 'Room',
      dataIndex: 'room_number',
      key: 'room_number',
      render: (roomNumber: string | undefined) => roomNumber || 'N/A',
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
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status: string, record: Reservation) => {
        if (status === 'completed') {
          return <Tag color="green">Completed</Tag>;
        }
        // Only show Pay Now if reservation is 'confirmed' and payment is 'pending'
        if (record.status === 'confirmed') {
          return (
            <Button
              type="primary"
              size="small"
              onClick={() => showPaymentModal(record)}
              loading={processingPaymentId === record.id}
            >
              Pay Now
            </Button>
          );
        }
        // Otherwise, just show pending status (e.g., if reservation was cancelled before payment)
        return <Tag color="orange">Pending</Tag>;
      },
    },
    {
      title: 'Booking Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'confirmed' ? 'blue' : 'red'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Reservation) => (
        <Space>
          {record.status === 'confirmed' && (
            <Button
              danger
              onClick={() => {
                Modal.confirm({
                  title: 'Cancel Reservation',
                  content: 'Are you sure you want to cancel this reservation?',
                  onOk: () => handleCancel(record.id),
                });
              }}
              loading={cancellingId === record.id}
              disabled={cancellingId === record.id}
            >
              Cancel
            </Button>
          )}
          {record.payment_status === 'completed' && (
            <Button type="link" onClick={() => showDetailsModal(record)}>
              Details
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Reservations</h1>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={reservations}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* Payment Simulation Modal */}
      <Modal
        title={`Pay for Reservation #${selectedReservationForPayment?.id}`}
        visible={isPaymentModalVisible}
        onOk={handlePaymentOk}
        onCancel={handlePaymentCancel}
        confirmLoading={processingPaymentId === selectedReservationForPayment?.id}
        okText="Confirm Payment"
        cancelText="Cancel"
      >
        <p>Room: {selectedReservationForPayment?.room_number}</p>
        <p>Dates: {selectedReservationForPayment ? format(new Date(selectedReservationForPayment.check_in_date), 'MMM dd') : ''} - {selectedReservationForPayment ? format(new Date(selectedReservationForPayment.check_out_date), 'MMM dd, yyyy') : ''}</p>
        <p>Total Amount: <strong>${selectedReservationForPayment?.total_price?.toFixed(2)}</strong></p>
        <p className="mt-4">Simulate Payment via:</p>
        {/* Mock payment gateway form */}
        <Space direction="vertical" className="w-full">
          <Select value={paymentMethod} onChange={setPaymentMethod}>
            <Select.Option value="card">Card</Select.Option>
            <Select.Option value="upi">UPI</Select.Option>
          </Select>
          {paymentMethod === 'card' ? (
            <>
              <Input
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={16}
              />
              <Input
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                maxLength={5}
              />
              <Input
                placeholder="CVV"
                value={cardCVV}
                onChange={(e) => setCardCVV(e.target.value)}
                maxLength={3}
              />
            </>
          ) : (
            <Input
              placeholder="UPI ID (e.g. username@bank)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          )}
        </Space>
        <p className="text-sm text-gray-500 mt-2">Click 'Confirm Payment' to simulate a successful transaction.</p>
      </Modal>

      {/* Payment Details Modal */}
      <Modal
        title={`Payment Details for Reservation #${selectedReservationForDetails?.id}`}
        visible={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={[<Button key="close" onClick={() => setIsDetailsModalVisible(false)}>Close</Button>]}
      >
        {detailsLoading ? (
          <Spin />
        ) : (
          <>
            <p><strong>Reservation ID:</strong> {selectedReservationForDetails?.id}</p>
            <p><strong>Room:</strong> {selectedReservationForDetails?.room_number}</p>
            <p><strong>Check In:</strong> {selectedReservationForDetails?.check_in_date ? format(new Date(selectedReservationForDetails.check_in_date), 'MMM dd, yyyy') : 'N/A'}</p>
            <p><strong>Check Out:</strong> {selectedReservationForDetails?.check_out_date ? format(new Date(selectedReservationForDetails.check_out_date), 'MMM dd, yyyy') : 'N/A'}</p>
            <p><strong>Total Price:</strong> {selectedReservationForDetails?.total_price != null ? `$${selectedReservationForDetails.total_price.toFixed(2)}` : 'N/A'}</p>
            <p><strong>Payment Status:</strong> {selectedReservationForDetails?.payment_status}</p>
            {paymentDetails.length > 0 && (
              <>
                <h4>Payment Records:</h4>
                {paymentDetails.map((pd) => (
                  <div key={pd.id} style={{ marginBottom: 8 }}>
                    <p><strong>Amount:</strong> ${pd.amount.toFixed(2)}</p>
                    <p><strong>Method:</strong> {pd.payment_method}</p>
                    <p><strong>Transaction ID:</strong> {pd.transaction_id}</p>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
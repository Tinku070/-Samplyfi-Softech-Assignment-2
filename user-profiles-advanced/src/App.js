import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Modal, Form, Input, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined, HeartOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const openEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      website: user.website,
      company: user.company?.name,
      street: user.address?.street,
      suite: user.address?.suite,
      city: user.address?.city,
      zipcode: user.address?.zipcode,
    });
    setIsModalOpen(true);
  };

  const onFinish = (values) => {
    const updated = users.map(u =>
      u.id === editingUser.id
        ? {
            ...u,
            name: values.name,
            email: values.email,
            phone: values.phone,
            website: values.website,
            company: { ...u.company, name: values.company },
            address: {
              ...u.address,
              street: values.street,
              suite: values.suite,
              city: values.city,
              zipcode: values.zipcode,
            },
          }
        : u
    );
    setUsers(updated);
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      onOk: () => setUsers(prev => prev.filter(u => u.id !== id)),
    });
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100">Loading...</div>;

  return (
    <div className="container py-4">
      <Row gutter={[16, 16]}>
        {users.map(user => (
          <Col key={user.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt={user.name} src={`https://avatars.dicebear.com/v2/avataaars/${encodeURIComponent(user.username)}.svg?options[mood][]=happy`} />}
              actions={[
                <EditOutlined key="edit" onClick={() => openEdit(user)} />,
                <DeleteOutlined key="delete" onClick={() => handleDelete(user.id)} />,
                <HeartOutlined key="like" />,
              ]}
            >
              <Card.Meta title={user.name} description={<div>{user.email}<br />{user.phone}</div>} />
              <div style={{ marginTop: 12 }}>
                <div><strong>Company:</strong> {user.company?.name}</div>
                <div><strong>Address:</strong> {user.address?.street}, {user.address?.city}</div>
                <a href={`http://${user.website}`} target="_blank" rel="noreferrer">Visit website</a>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal title="Edit user" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Full name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="website" label="Website">
            <Input />
          </Form.Item>

          <Form.Item name="company" label="Company">
            <Input />
          </Form.Item>

          <Form.Item name="street" label="Street">
            <Input />
          </Form.Item>

          <Form.Item name="suite" label="Suite">
            <Input />
          </Form.Item>

          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>

          <Form.Item name="zipcode" label="Zipcode">
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Save</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default App;

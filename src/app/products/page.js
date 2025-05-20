"use client";
import { useEffect, useRef, useState } from 'react';
import { Table, Button, Space, Form, Input, InputNumber, message } from 'antd';
import api from '@/utils/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const router = useRouter();
  const formRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) router.push('/');
    else fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      message.error('Failed to fetch products');
    }
  };

  const onFinish = async (values) => {
    try {
      const endpoint = '/products/insertOrUpdateProduct';
      const payload = editingProduct ? { ...values, id: editingProduct.id } : values;
      await api.post(endpoint, payload);
      message.success(editingProduct ? 'Updated successfully' : 'Created successfully');
      form.resetFields();
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      message.error('Failed to submit');
    }
  };

  const onEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);

  };

  useEffect(() => {
    if (editingProduct) {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [editingProduct]);

  const onDelete = async (product) => {
    try {
      await api.post('/products/deleteProduct', { id: product.id });
      message.success('Deleted successfully');
      fetchProducts();
    } catch (err) {
      message.error('Failed to delete');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Price (Rp)', dataIndex: 'price', key: 'price' },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Button danger onClick={() => onDelete(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleLogout = () =>{
    Cookies.remove("token");
    router.push("/");
  }

  return (
    <div style={{ maxWidth: 1000, margin: '50px auto', padding: 20 }}>
      <h1>Product List</h1>
      <Table dataSource={products} rowKey="id" columns={columns} pagination={false} />

      <div ref={formRef}>
      <h2 style={{ marginTop: 40 }}>{editingProduct ? 'Edit Product' : 'Create Product'}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ price: 0 }}
      >
        <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Price (Rp)" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {editingProduct ? 'Update' : 'Create'}
            </Button>
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields();
                setEditingProduct(null);
              }}
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
        <br></br>
        <Button onClick={handleLogout} type="primary" danger style={{ float: 'left' }}>
              Logout
        </Button>
      </Form>
    </div>
  </div>
  );
}
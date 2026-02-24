import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Tag, Modal, Form, Input, Select, message, Typography, Tabs, Grid } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getNotifications, createNotification, deleteNotification, type NotificationItem } from '@/services/notification';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

const NotificationList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({ page: 1, pageSize: 10, type: 0 }); // type 0 = all

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const screens = useBreakpoint();

  const fetchData = async () => {
    setLoading(true);
    try {
      const requestParams = {
        ...params,
        type: params.type === 0 ? undefined : params.type
      };
      const res: any = await getNotifications(requestParams);
      if (res.status === 'ok') {
        setData(res.data.list);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      const res: any = await createNotification(values);
      if (res.status === 'ok') {
        message.success('通知发布成功');
        setIsModalVisible(false);
        form.resetFields();
        fetchData(); // Refresh list
      }
    } catch (error) {
      console.error(error);
      message.error('发布失败');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认撤回',
      content: '确定要撤回这条通知吗？撤回后用户将无法查看。',
      okText: '确认撤回',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res: any = await deleteNotification(id);
          if (res.status === 'ok') {
            message.success('通知已撤回');
            fetchData();
          }
        } catch (error) {
          message.error('撤回失败');
        }
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      fixed: 'left' as const,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: 300,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: number) => {
        const config: Record<number, { color: string; text: string }> = {
          1: { color: 'blue', text: '系统更新' },
          2: { color: 'orange', text: '系统维护' },
          3: { color: 'red', text: '安全通知' },
          4: { color: 'green', text: '日常通知' },
        };
        const item = config[type] || { color: 'default', text: '未知' };
        return <Tag color={item.color}>{item.text}</Tag>;
      },
    },
    {
      title: '发布人',
      dataIndex: 'publisher_name',
      key: 'publisher_name',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '已发布' : '已撤回'}
        </Tag>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: NotificationItem) => (
        record.status === 1 ? (
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          >
            撤回
          </Button>
        ) : <span style={{ color: '#ccc', paddingLeft: 15 }}>已撤回</span>
      ),
    },
  ];

  const tabItems = [
    { key: '0', label: '全部通知' },
    { key: '1', label: '系统更新' },
    { key: '2', label: '系统维护' },
    { key: '3', label: '安全通知' },
    { key: '4', label: '日常通知' },
  ];

  return (
    <div>
      <div style={{ 
        marginBottom: 24, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: screens.xs ? 'flex-start' : 'center',
        flexDirection: screens.xs ? 'column' : 'row',
        gap: 16
      }}>
        <Title level={3} style={{ margin: 0 }}>官方通知发布</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalVisible(true)}
          size={screens.xs ? 'middle' : 'large'}
          style={{ width: screens.xs ? '100%' : 'auto' }}
        >
          发布新通知
        </Button>
      </div>

      <Card bordered={false} bodyStyle={{ padding: screens.xs ? 12 : 24 }}>
        <Tabs
          defaultActiveKey="0"
          items={tabItems}
          onChange={(key) => setParams({ ...params, type: Number(key), page: 1 })}
          style={{ marginBottom: 16 }}
          tabPosition={screens.xs ? 'top' : 'top'}
          size={screens.xs ? 'small' : 'default'}
        />
        
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: params.page,
            pageSize: params.pageSize,
            total: total,
            showTotal: (total) => `共 ${total} 条通知`,
            onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
            size: screens.xs ? 'small' : 'default',
            showSizeChanger: !screens.xs
          }}
        />
      </Card>

      <Modal
        title="发布官方通知"
        open={isModalVisible}
        onOk={handleCreate}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={screens.xs ? '90%' : 600}
        style={{ top: screens.xs ? 20 : 100 }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ type: 1 }}
        >
          <Form.Item
            name="title"
            label="通知标题"
            rules={[{ required: true, message: '请输入通知标题' }, { max: 50, message: '标题最多50个字符' }]}
          >
            <Input placeholder="请输入简明扼要的标题" maxLength={50} showCount />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="通知类型"
            rules={[{ required: true, message: '请选择通知类型' }]}
          >
            <Select>
              <Option value={1}>系统更新</Option>
              <Option value={2}>系统维护</Option>
              <Option value={3}>安全通知</Option>
              <Option value={4}>日常通知</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="通知内容"
            rules={[{ required: true, message: '请输入通知内容' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="请输入详细通知内容..." 
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NotificationList;

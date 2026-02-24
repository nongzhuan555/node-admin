import React, { useEffect, useState } from 'react';
import { Table, Card, Input, Button, Tag, Space, Modal, Select, message, Typography, Grid } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import { getUsers, updateUserRole } from '@/services/user';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const UserList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({ page: 1, pageSize: 10, keyword: '' });
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<number>(1);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const isSuperAdmin = userInfo?.role_code === 3;
  const screens = useBreakpoint();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await getUsers(params);
      setData(res.data.list);
      setTotal(res.data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleSearch = (value: string) => {
    setParams({ ...params, keyword: value, page: 1 });
  };

  const handleEditRole = (record: any) => {
    if (!isSuperAdmin) {
      message.warning('权限不足，需要超级管理员权限');
      return;
    }
    setCurrentUser(record);
    setNewRole(record.role_code);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (!currentUser) return;
    setConfirmLoading(true);
    try {
      await updateUserRole(currentUser.id, newRole);
      message.success('角色修改成功');
      setIsModalVisible(false);
      fetchData(); // Refresh list
    } catch (error) {
      message.error('修改失败');
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns = [
    {
      title: '学号',
      dataIndex: 'student_no',
      key: 'student_no',
      fixed: 'left' as const,
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '角色',
      dataIndex: 'role_code',
      key: 'role_code',
      width: 120,
      render: (role: number) => {
        const color = role === 3 ? 'gold' : role === 2 ? 'green' : 'blue';
        const text = role === 3 ? '超级管理员' : role === 2 ? '管理员' : '普通用户';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEditRole(record)}
            disabled={!isSuperAdmin}
          >
            修改
          </Button>
        </Space>
      ),
    },
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
        <Title level={3} style={{ margin: 0 }}>用户列表</Title>
        <Input.Search
          placeholder="搜索姓名或学号"
          allowClear
          onSearch={handleSearch}
          style={{ width: screens.xs ? '100%' : 300 }}
          enterButton={<Button icon={<SearchOutlined />} type="primary">搜索</Button>}
        />
      </div>

      <Card bordered={false} bodyStyle={{ padding: screens.xs ? 12 : 24 }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 800 }}
          pagination={{
            current: params.page,
            pageSize: params.pageSize,
            total: total,
            onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
            size: (screens.xs ? 'small' : 'default') as any,
            showSizeChanger: !screens.xs
          }}
        />
      </Card>

      <Modal
        title="修改用户角色"
        open={isModalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>当前用户: {currentUser?.name} ({currentUser?.student_no})</p>
        <div style={{ marginTop: 16 }}>
          <span>选择角色: </span>
          <Select 
            value={newRole} 
            onChange={(value) => setNewRole(value)} 
            style={{ width: 200, marginLeft: 8 }}
          >
            <Option value={1}>普通用户</Option>
            <Option value={2}>管理员</Option>
            <Option value={3}>超级管理员</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default UserList;

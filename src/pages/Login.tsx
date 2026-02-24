import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '@/store/slices/userSlice';
import { login as loginApi } from '@/services/auth';
import './Login.css';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values: { student_no: string }) => {
    setLoading(true);
    try {
      const res: any = await loginApi(values.student_no);
      if (res.status === 'ok') {
        message.success(res.message);
        dispatch(loginAction({ token: res.data.token, userInfo: res.data }));
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message);
      } else {
        message.error('登录失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <div className="logo-icon">N</div>
          <Title level={2} className="login-title">农屿 · 管理后台</Title>
        </div>
        
        <Card bordered={false} className="login-card" style={{ background: 'transparent', boxShadow: 'none' }}>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="student_no"
              rules={[{ required: true, message: '请输入您的学号' }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#11998e' }} />} 
                placeholder="请输入学号 (如: admin / super)" 
                className="custom-input"
                style={{ height: '52px', borderRadius: '12px' }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading}
                className="login-btn"
                style={{ 
                  borderRadius: '12px', 
                  marginTop: '16px',
                }}
              >
                登 录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;

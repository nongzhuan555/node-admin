import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, theme, Typography, Drawer, Grid } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  NotificationOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/userSlice';
import type { RootState } from '@/store';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const screens = useBreakpoint();
  const { userInfo } = useSelector((state: RootState) => state.user);
  
  // screens.md indicates width >= 768px.
  // If undefined (during initial render), assume desktop to avoid flash, or handle carefully.
  const isMobile = screens.md === false;

  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
  } = theme.useToken();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '数据大屏',
      onClick: () => handleMenuClick('/dashboard'),
    },
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: '用户管理',
      onClick: () => handleMenuClick('/users'),
    },
    {
      key: '/notifications',
      icon: <NotificationOutlined />,
      label: '官方通知',
      onClick: () => handleMenuClick('/notifications'),
    },
  ];

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout,
      },
    ],
  };

  const Logo = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div style={{ 
      height: 64, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      borderBottom: '1px solid #f0f0f0' 
    }}>
       <div style={{ 
         width: 32, 
         height: 32, 
         background: colorPrimary, 
         borderRadius: 6, 
         marginRight: collapsed ? 0 : 8,
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         color: '#fff',
         fontWeight: 'bold',
         fontSize: 18,
         flexShrink: 0
       }}>N</div>
       {!collapsed && <Title level={4} style={{ margin: 0, color: '#333', fontSize: 18, whiteSpace: 'nowrap' }}>农屿后台</Title>}
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sider */}
      {!isMobile && (
        <Sider trigger={null} collapsible collapsed={collapsed} theme="light" width={220} style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          zIndex: 10,
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0
        }}>
          <Logo collapsed={collapsed} />
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ borderRight: 0, marginTop: 16 }}
          />
        </Sider>
      )}

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        styles={{ body: { padding: 0 } }}
        width={220}
        closable={false}
      >
        <Logo />
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderRight: 0, marginTop: 16 }}
        />
      </Drawer>

      <Layout>
        <Header style={{ 
          padding: 0, 
          background: colorBgContainer, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          paddingRight: 24, 
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          position: 'sticky',
          top: 0,
          zIndex: 9,
          width: '100%'
        }}>
          <Button
            type="text"
            icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
            onClick={() => isMobile ? setMobileDrawerOpen(true) : setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             {!isMobile && (
               <span style={{ fontSize: 14, color: '#666' }}>
                 {userInfo?.role_code === 3 ? '超级管理员' : '管理员'} · {userInfo?.name || 'User'}
               </span>
             )}
             <Dropdown menu={userMenu} placement="bottomRight">
                <Avatar style={{ backgroundColor: colorPrimary, cursor: 'pointer' }} icon={<UserOutlined />} />
             </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto' 
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

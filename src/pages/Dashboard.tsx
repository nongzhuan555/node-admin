import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin } from 'antd';
import { UserOutlined, RiseOutlined, FireOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { getDashboardStats, getFeatureStats, getUserDistribution } from '@/services/stats';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [featureData, setFeatureData] = useState<any>(null);
  const [distData, setDistData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dash, feat, dist] = await Promise.all([
          getDashboardStats(),
          getFeatureStats(),
          getUserDistribution(),
        ]) as any;
        setDashboardData(dash.data);
        setFeatureData(feat.data);
        setDistData(dist.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Chart Options
  const growthOption = {
    title: { text: '近7日用户增长趋势' },
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: dashboardData?.growth_trend?.map((i: any) => i.date) },
    yAxis: { type: 'value' },
    series: [{
      data: dashboardData?.growth_trend?.map((i: any) => i.count),
      type: 'line',
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#52c41a' }, { offset: 1, color: '#fff' }]
        }
      },
      itemStyle: { color: '#52c41a' }
    }]
  };

  const featureOption = {
    title: { text: '热门功能访问量 (Top 5)' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: featureData?.pages?.slice(0, 5).map((i: any) => i.name) },
    yAxis: { type: 'value' },
    series: [{
      data: featureData?.pages?.slice(0, 5).map((i: any) => i.count),
      type: 'bar',
      itemStyle: { color: '#52c41a' },
      barWidth: '40%'
    }]
  };

  const collegeOption = {
    title: { text: '用户学院分布', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: distData?.college?.map((i: any) => ({ value: i.count, name: i.name })),
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
    }]
  };

  const campusOption = {
    title: { text: '校区分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false, position: 'center' },
      emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
      data: distData?.campus?.map((i: any) => ({ value: i.count, name: i.name }))
    }]
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>数据大屏概览</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} hoverable>
            <Statistic 
              title="总用户数" 
              value={dashboardData?.total_users} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#3f8600' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} hoverable>
            <Statistic 
              title="今日日活 (DAU)" 
              value={dashboardData?.dau} 
              prefix={<FireOutlined />} 
              valueStyle={{ color: '#cf1322' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} hoverable>
             <Statistic 
               title="昨日新增用户" 
               value={dashboardData?.growth_trend?.[dashboardData?.growth_trend?.length - 1]?.count || 0} 
               prefix={<RiseOutlined />} 
               valueStyle={{ color: '#1890ff' }}
             />
          </Card>
        </Col>

        <Col span={24}>
          <Card bordered={false} title="用户增长趋势">
            <ReactECharts option={growthOption} style={{ height: 350 }} />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card bordered={false} title="功能使用热度">
            <ReactECharts option={featureOption} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card bordered={false} title="学院分布">
            <ReactECharts option={collegeOption} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
           <Card bordered={false} title="校区分布">
            <ReactECharts option={campusOption} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

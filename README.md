# 农屿后台管理系统 (Nongyu Admin)

基于 React + Vite + TypeScript + Ant Design 开发的农屿后台管理系统。

## 功能模块

1.  **登录页**
    -   支持学号登录（模拟接口）。
    -   权限验证：普通用户禁止访问，管理员/超级管理员可访问。
    -   测试账号：
        -   `super`：超级管理员 (最高权限)
        -   `admin`：普通管理员
        -   `user`：普通用户 (登录失败)

2.  **数据大屏 (Dashboard)**
    -   核心指标展示 (总用户、DAU、新增)。
    -   用户增长趋势图 (折线图)。
    -   功能使用热度 (柱状图)。
    -   用户分布 (学院、校区 - 饼图)。

3.  **用户管理**
    -   用户列表展示。
    -   搜索功能 (姓名/学号)。
    -   修改角色 (仅超级管理员可用)。

## 技术栈

-   **核心**: React 19, TypeScript, Vite
-   **UI**: Ant Design 5 (绿色主题), @ant-design/icons
-   **状态管理**: Redux Toolkit
-   **路由**: React Router v7
-   **图表**: ECharts, echarts-for-react
-   **HTTP**: Axios (Mock数据模拟)

## 运行项目

1.  安装依赖
    ```bash
    npm install
    ```

2.  启动开发服务器
    ```bash
    npm run dev
    ```

3.  打包构建
    ```bash
    npm run build
    ```

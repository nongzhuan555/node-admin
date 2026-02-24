# 农屿后台管理系统 - CentOS Git 部署指南

本文档详细介绍如何在 CentOS 服务器上使用 **Git + Nginx** 部署本系统。
这种方式需要在服务器上安装 Node.js 进行在线构建。

## 1. 准备工作

登录到你的 CentOS 服务器，执行以下命令安装必要软件：

```bash
# 1. 安装 EPEL 源
sudo yum install epel-release -y

# 2. 安装 Nginx
sudo yum install nginx -y

# 3. 安装 Git
sudo yum install git -y

# 4. 安装 Node.js (推荐 v18+)
# 添加 NodeSource 源
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
# 安装 Node.js
sudo yum install nodejs -y

# 5. 启动 Nginx 并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx

# 6. 配置防火墙允许 HTTP 流量
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

---

## 2. 代码同步

### 2.1 本地推送
确保你的本地代码已经提交并推送到了远程仓库（如 GitHub、Gitee 或 GitLab）。

```bash
# 本地终端
git add .
git commit -m "Ready for deploy"
git push origin main
```

### 2.2 服务器拉取
登录服务器，将代码克隆到 `/opt` 或其他工作目录（不要直接克隆到 `/var/www`，因为那里只放构建产物）。

```bash
# 服务器终端
cd /opt
# 替换为你的实际仓库地址
git clone https://github.com/nongzhuan555/node-admin
cd nongyu-admin
```

---

## 3. 服务器构建与部署

在服务器的项目目录下执行构建：

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量 (如果需要)
# 创建 .env 文件并填入后端地址
echo "VITE_API_BASE_URL=http://8.137.82.17:3000/" > .env

# 3. 构建项目
npm run build
```

构建完成后，将生成的 `dist` 目录内容部署到 Nginx 目录：

```bash
# 创建部署目录
sudo mkdir -p /var/www/nongyu-admin

# 将 dist 下的所有文件复制到部署目录
sudo cp -r dist/* /var/www/nongyu-admin/

# 设置权限 (重要)
sudo chown -R nginx:nginx /var/www/nongyu-admin
sudo chcon -R -t httpd_sys_content_t /var/www/nongyu-admin
```

---

## 4. 配置 Nginx

### 4.1 编辑配置

在服务器上创建新的配置文件：

```bash
sudo vi /etc/nginx/conf.d/nongyu-admin.conf
```

将以下内容粘贴进去（注意 `root` 路径）：

```nginx
server {
    listen 80;
    server_name localhost; # 如果有域名请修改这里

    root /var/www/nongyu-admin;
    index index.html;

    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/javascript application/json application/javascript application/x-javascript application/xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 7d;
        add_header Cache-Control "public";
    }

    # 接口反向代理
    location /api {
        proxy_pass http://localhost:3000/; # 确保后端服务在此端口运行
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 4.2 重启服务

```bash
# 检查配置语法
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

## 5. 后续更新发布

以后每次代码更新，只需在服务器上执行：

```bash
cd /opt/nongyu-admin
git pull
npm install
npm run build
sudo cp -r dist/* /var/www/nongyu-admin/
```

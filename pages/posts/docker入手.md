---
title: Docker 快速入手
date: 2025-03-20
updated: 2025-03-20
categories: 运维部署
tags:
  - Docker
  - 容器化
  - 部署
  - Nginx
top: 1
---

## 简介

Docker 是一个开源的容器化平台，可以将应用程序及其依赖打包成轻量级、可移植的容器，实现"一次构建，到处运行"。

## Docker 安装部署

### Linux 安装

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
```

### macOS / Windows 安装

下载并安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)

### 配置镜像加速（可选）

```json
// /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

```bash
sudo systemctl restart docker
```

## Docker 常用命令

### 命令结构树状图

```
Docker 命令体系
│
├── 镜像管理 (Image)
│   ├── docker pull <image>          # 拉取镜像
│   ├── docker images                # 查看镜像列表
│   ├── docker rmi <image>           # 删除镜像
│   ├── docker build -t <name> .     # 构建镜像
│   └── docker tag <old> <new>       # 标记镜像
│
├── 容器管理 (Container)
│   ├── docker run <image>           # 运行容器
│   ├── docker ps                    # 查看运行中的容器
│   ├── docker ps -a                 # 查看所有容器
│   ├── docker stop <container>      # 停止容器
│   ├── docker start <container>     # 启动容器
│   ├── docker restart <container>   # 重启容器
│   ├── docker rm <container>        # 删除容器
│   ├── docker exec -it <id> bash    # 进入容器
│   └── docker logs <container>      # 查看日志
│
├── 网络管理 (Network)
│   ├── docker network ls            # 查看网络
│   ├── docker network create <name> # 创建网络
│   └── docker network rm <name>     # 删除网络
│
├── 数据卷管理 (Volume)
│   ├── docker volume ls             # 查看数据卷
│   ├── docker volume create <name>  # 创建数据卷
│   └── docker volume rm <name>      # 删除数据卷
│
└── Docker Compose
    ├── docker-compose up            # 启动服务
    ├── docker-compose down          # 停止服务
    ├── docker-compose ps            # 查看服务状态
    └── docker-compose logs          # 查看日志
```

### 基础命令示例

```bash
# 拉取镜像
docker pull nginx:latest
docker pull node:18-alpine

# 查看镜像
docker images

# 运行容器
docker run -d -p 80:80 --name my-nginx nginx

# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 进入容器
docker exec -it my-nginx bash

# 查看容器日志
docker logs my-nginx
docker logs -f my-nginx  # 实时查看

# 停止容器
docker stop my-nginx

# 删除容器
docker rm my-nginx

# 删除镜像
docker rmi nginx:latest
```

## 部署 Nginx

### 方式一：直接运行

```bash
# 运行 Nginx 容器
docker run -d \
  --name nginx \
  -p 80:80 \
  -p 443:443 \
  -v /path/to/html:/usr/share/nginx/html \
  -v /path/to/nginx.conf:/etc/nginx/nginx.conf \
  nginx:latest
```

### 方式二：使用 Dockerfile

```dockerfile
# Dockerfile
FROM nginx:alpine

# 复制配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 复制静态文件
COPY dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 构建镜像
docker build -t my-nginx .

# 运行容器
docker run -d -p 80:80 --name nginx my-nginx
```

### Nginx 配置文件示例

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 前端项目部署

### React/Vue 项目部署

```dockerfile
# Dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 构建镜像
docker build -t my-frontend .

# 运行容器
docker run -d -p 80:80 --name frontend my-frontend
```

### 使用 .dockerignore

```
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env
dist
```

## 后端项目部署

### Node.js 后端部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm install --production

# 复制源代码
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

```bash
# 构建镜像
docker build -t my-backend .

# 运行容器
docker run -d \
  -p 3000:3000 \
  --name backend \
  -e NODE_ENV=production \
  my-backend
```

### Python 后端部署

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制源代码
COPY . .

EXPOSE 8000

CMD ["python", "app.py"]
```

```bash
# 构建镜像
docker build -t my-python-api .

# 运行容器
docker run -d -p 8000:8000 --name api my-python-api
```

## Docker Compose 部署

### 前后端分离项目部署

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 前端服务
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  # 后端服务
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - db
    networks:
      - app-network

  # 数据库服务
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
```

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止所有服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v
```

## 常用部署场景

### 场景一：单容器部署

```bash
# 构建并运行
docker build -t my-app .
docker run -d -p 8080:80 --name app my-app
```

### 场景二：多容器部署（使用网络）

```bash
# 创建网络
docker network create app-network

# 运行后端
docker run -d \
  --name backend \
  --network app-network \
  my-backend

# 运行前端（通过网络访问后端）
docker run -d \
  --name frontend \
  --network app-network \
  -p 80:80 \
  my-frontend
```

### 场景三：数据持久化

```bash
# 使用数据卷
docker run -d \
  --name mysql \
  -v mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  mysql:8.0

# 使用绑定挂载
docker run -d \
  --name nginx \
  -v /host/path:/container/path \
  nginx:alpine
```

## 完整部署示例

### 项目结构

```
project/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── docker-compose.yml
```

### 前端 Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 后端 Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### 一键部署

```bash
# 启动所有服务
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 总结

- **Docker 安装**：支持 Linux、macOS、Windows 多平台
- **常用命令**：镜像管理、容器管理、网络和数据卷管理
- **Nginx 部署**：可直接运行或使用 Dockerfile 构建
- **前端部署**：多阶段构建，减小镜像体积
- **后端部署**：支持 Node.js、Python 等多种语言
- **Docker Compose**：一键部署多个服务，简化运维

Docker 通过容器化技术，实现了应用的快速部署、环境一致性和资源隔离，是现代 DevOps 的重要工具。

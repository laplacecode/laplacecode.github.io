---
title: Docker + Nginx 部署 SpringBoot + MySQL + Vue 前后端分离项目
date: 2025-03-21
updated: 2025-03-21
categories: 运维部署
tags:
  - Docker
  - Nginx
  - SpringBoot
  - MySQL
  - Vue
  - 前后端分离
  - 部署
top: 1
---

## 项目架构

本文介绍如何使用 Docker + Nginx 部署一个前后端分离的项目，包含：
- **后端**: SpringBoot 应用
- **数据库**: MySQL
- **前端**: Vue 项目（打包后的静态文件）
- **反向代理**: Nginx

## 项目结构

```
project/
├── backend/              # SpringBoot 后端
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/            # Vue 前端
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── nginx/               # Nginx 配置
│   └── nginx.conf
└── docker-compose.yml  # Docker Compose 编排文件
```

## 1. SpringBoot 后端 Dockerfile

在 `backend/` 目录下创建 `Dockerfile`：

```dockerfile
# 使用 Maven 构建阶段
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 运行阶段
FROM openjdk:17-jre-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## 2. Vue 前端 Dockerfile

在 `frontend/` 目录下创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段（使用 Nginx 服务静态文件）
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx-frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 3. Nginx 配置文件

在 `nginx/` 目录下创建 `nginx.conf`：

```nginx
upstream backend {
    server springboot:8080;
}

server {
    listen 80;
    server_name localhost;

    # 前端静态文件
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4. Docker Compose 配置

在项目根目录创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  # MySQL 数据库
  mysql:
    image: mysql:8.0
    container_name: mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123456
      MYSQL_DATABASE: myapp
      MYSQL_USER: appuser
      MYSQL_PASSWORD: app123456
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - app-network
    restart: unless-stopped

  # SpringBoot 后端
  springboot:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: springboot
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/myapp?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
      - SPRING_DATASOURCE_USERNAME=appuser
      - SPRING_DATASOURCE_PASSWORD=app123456
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    networks:
      - app-network
    restart: unless-stopped

  # Vue 前端（可选，如果前端单独部署）
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frontend
    ports:
      - "3000:80"
    networks:
      - app-network
    restart: unless-stopped

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./frontend/dist:/usr/share/nginx/html
    depends_on:
      - springboot
      - frontend
    networks:
      - app-network
    restart: unless-stopped

volumes:
  mysql_data:

networks:
  app-network:
    driver: bridge
```

## 5. SpringBoot 数据库配置示例

在 `backend/src/main/resources/application.yml` 中配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/myapp?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: ${SPRING_DATASOURCE_USERNAME:appuser}
    password: ${SPRING_DATASOURCE_PASSWORD:app123456}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

## 6. Vue 前端 API 配置示例

在 `frontend/src/config/api.js` 中配置：

```javascript
// 开发环境
const devBaseURL = 'http://localhost:8080'
// 生产环境（通过 Nginx 代理）
const prodBaseURL = '/api'

export const baseURL = process.env.NODE_ENV === 'production' 
  ? prodBaseURL 
  : devBaseURL
```

在 `frontend/vue.config.js` 中配置代理（开发环境）：

```javascript
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
```

## 7. 部署步骤

### 7.1 构建和启动

```bash
# 进入项目根目录
cd project

# 使用 Docker Compose 构建并启动所有服务
docker-compose up -d --build

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 7.2 常用命令

```bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷（谨慎使用）
docker-compose down -v

# 重启某个服务
docker-compose restart springboot

# 查看某个服务的日志
docker-compose logs -f springboot

# 进入容器
docker exec -it springboot bash
docker exec -it mysql bash
```

### 7.3 验证部署

1. **访问前端**: http://localhost
2. **访问后端 API**: http://localhost/api
3. **直接访问后端**: http://localhost:8080
4. **检查 MySQL**: 
   ```bash
   docker exec -it mysql mysql -uappuser -papp123456 myapp
   ```

## 8. 优化建议

### 8.1 多阶段构建优化

使用多阶段构建可以减少最终镜像大小：

```dockerfile
# SpringBoot Dockerfile 已使用多阶段构建
# Vue Dockerfile 已使用多阶段构建
```

### 8.2 健康检查

在 `docker-compose.yml` 中添加健康检查：

```yaml
springboot:
  # ... 其他配置
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

### 8.3 环境变量文件

创建 `.env` 文件管理环境变量：

```env
MYSQL_ROOT_PASSWORD=root123456
MYSQL_DATABASE=myapp
MYSQL_USER=appuser
MYSQL_PASSWORD=app123456
```

在 `docker-compose.yml` 中使用：

```yaml
mysql:
  environment:
    MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    MYSQL_DATABASE: ${MYSQL_DATABASE}
```

## 9. 常见问题

### 9.1 数据库连接失败

- 检查 MySQL 容器是否正常启动
- 确认网络连接（使用服务名 `mysql` 而非 `localhost`）
- 检查数据库用户名和密码

### 9.2 前端路由 404

在 Nginx 配置中添加 `try_files`：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 9.3 跨域问题

在 SpringBoot 中添加 CORS 配置：

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }
}
```

## 总结

通过 Docker + Nginx 部署前后端分离项目，可以实现：
- ✅ 环境隔离，避免依赖冲突
- ✅ 一键部署，简化运维流程
- ✅ 易于扩展，支持水平扩展
- ✅ 统一管理，使用 Docker Compose 编排

这种方式特别适合生产环境的部署，提高了部署效率和系统稳定性。

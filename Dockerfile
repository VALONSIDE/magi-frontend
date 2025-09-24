# --- 第一阶段: 构建 React 应用 (Builder) ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# 运行构建命令，这会在 /app 目录下生成一个 build (或 dist) 文件夹
RUN npm run build

# --- 第二阶段: 运行最终的应用 (Final Image) ---
# 使用一个非常轻量的 Nginx 服务器作为基础
FROM nginx:stable-alpine

# 将第一阶段构建好的静态文件，从 builder 的 /app/dist 目录，
# 复制到 Nginx 的默认网站根目录 /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html

# 替换 Nginx 的默认配置文件为我们自己的配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 声明 Nginx 的默认端口
EXPOSE 80

# 启动 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]
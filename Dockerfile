# 构建阶段
FROM node:20 AS builder
WORKDIR /app
COPY . .
ENV NODE_ENV=development
RUN npm install
RUN npm install vite @vitejs/plugin-vue --save-dev
RUN npx tsc --version
RUN ls -l node_modules/vite || true
RUN ls -l node_modules/@vitejs/plugin-vue || true
RUN ls -l node_modules/vite/dist || true
RUN ls -l node_modules/@vitejs/plugin-vue/dist || true
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"] 
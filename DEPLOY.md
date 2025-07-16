# 云端 Docker 部署说明

## 1. 构建镜像

```bash
docker build -t 9day-chat .
```

## 2. 运行容器

```bash
docker run -d -p 3000:3000 --name 9day-chat 9day-chat
```

## 3. 访问服务

在浏览器中访问：

```
http://<服务器IP或域名>
```

## 4. 常见问题

- 如需修改端口，请同时修改 Dockerfile 和 nginx.conf。
- 如需自定义环境变量，请在构建前修改 .env 文件。
- 若遇到构建缓存问题，可加 --no-cache 参数重新构建。

## 5. 目录结构说明

- Dockerfile：Docker 构建配置
- .dockerignore：构建忽略文件
- nginx.conf：Nginx 配置文件
- dist/：前端构建产物

---
如有后端服务或 API，请补充相关部署步骤。 
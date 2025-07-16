# Build Stage
FROM node:22-alpine As build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serce ด้วย nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
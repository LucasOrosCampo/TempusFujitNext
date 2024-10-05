FROM nginx:latest

EXPOSE 3000

COPY out/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/

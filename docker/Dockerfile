FROM node:15 as builder
ADD . /src
WORKDIR /src
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install
RUN npm run build

FROM httpd:2.4 as release
COPY --from=builder /src/build /usr/local/apache2/htdocs
COPY docker/entrypoint.sh /entrypoint.sh
COPY docker/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY docker/.htaccess /usr/local/apache2/htdocs/.htaccess
ENTRYPOINT [ "/entrypoint.sh" ]

# Usar imagen base oficial de Apache
FROM httpd:2.4
# Copiar archivos compilados de React al directorio público de Apache
COPY build/ /usr/local/apache2/htdocs/
COPY httpd.conf /usr/local/apache2/conf/httpd.conf
# Exponer el puerto 80
EXPOSE 80
# Apache se inicia automáticamente con la imagen base (no necesitas CMD)
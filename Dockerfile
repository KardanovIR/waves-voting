FROM ubuntu:16.04

ENV POSTGRES_PASSWORD=""

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get -yq install \
        wget \
        curl \
        apache2 \
        apache2-doc \
        apache2-utils \
        software-properties-common

# add php
RUN apt-get update && \
        apt-get -qy upgrade && \
        apt-get install -qy language-pack-en-base && \
        locale-gen en_US.UTF-8 && \
        locale-gen ru_RU.UTF-8

ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8
RUN add-apt-repository -y ppa:ondrej/php
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y --force-yes php7.1

# add nodejs
RUN curl -o node_installer.sh  https://deb.nodesource.com/setup_10.x
RUN sh node_installer.sh
RUN apt-get install -y nodejs
RUN npm install -g forever
#
ADD apache-config.conf /etc/apache2/sites-enabled/000-default.conf
RUN apt-get update
RUN a2enmod rewrite
RUN a2enmod headers
RUN a2enmod env

# install php supportive files
RUN DEBIAN_FRONTEND=noninteractive apt-get -y --force-yes install \
    php7.1-pgsql \
    php-pear \
    php-mbstring \
    php7.1-curl


RUN chown -R www-data:www-data /var/www/html/
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2
ENV APACHE_PID_FILE /var/run/apache2.pid

WORKDIR /
RUN rm /var/www/html/index.html
EXPOSE 80
EXPOSE 443
EXPOSE 8080

WORKDIR /var/www/html
RUN npm run install
RUN npm run build

RUN service apache2 restart
WORKDIR /var/www/html/node
RUN npm install

CMD ["/usr/sbin/apache2", "-D", "FOREGROUND"]
CMD ["node", "index.js"]
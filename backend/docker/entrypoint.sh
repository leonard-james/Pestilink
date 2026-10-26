#!/bin/sh
set -eu

port="${PORT:-10000}"
case "$port" in
    ''|*[!0-9]*)
        echo "PORT must be a numeric TCP port." >&2
        exit 1
        ;;
esac

sed "s/__PORT__/${port}/g" /etc/apache2/ports.conf.template > /etc/apache2/ports.conf
sed "s/__PORT__/${port}/g" /etc/apache2/sites-available/000-default.conf.template \
    > /etc/apache2/sites-available/000-default.conf

exec apache2-foreground
#!/bin/sh
set -e

if [ -n "$API_URL" ]; then
    sed -i "s|http://backend:8000|$API_URL|g" /etc/nginx/conf.d/default.conf
fi

exec nginx -g "daemon off;"

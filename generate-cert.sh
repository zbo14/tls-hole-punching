#!/bin/bash

cd "$(dirname "$0")"

mkdir -p private
cd private

openssl req \
  -x509 \
  -days 3650 \
  -newkey rsa:4096 \
  -nodes \
  -keyout key.pem \
  -out cert.pem \
  -subj "/CN=localhost/"

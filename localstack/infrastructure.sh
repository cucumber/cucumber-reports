#!/bin/bash

# s3
awslocal s3api create-bucket --bucket cucumber-reports-anonymous-envelopes
awslocal s3api put-bucket-cors --bucket cucumber-reports-anonymous-envelopes --cors-configuration file:///etc/localstack/init/ready.d/cors.json

# lambda
zip -j /etc/functions/touch/function.zip /etc/functions/touch/*.mjs
awslocal lambda create-function --region us-east-2 --function-name touch --runtime nodejs22.x --handler index.handler --zip-file fileb:///etc/functions/touch/function.zip --role arn:aws:iam::000000000000:role/lambda-role --environment '{"Variables":{"APP_AWS_ENDPOINT":"http://localhost.localstack.cloud:4566","APP_BUCKET_NAME":"cucumber-reports-anonymous-envelopes","APP_BASE_URL":"http://localhost:3000"}}' --tags '{"_custom_id_":"touch"}'
awslocal lambda create-function-url-config --region us-east-2 --function-name touch --auth-type NONE
zip -j /etc/functions/crud/function.zip /etc/functions/crud/*.mjs
awslocal lambda create-function --region us-east-2 --function-name crud --runtime nodejs22.x --handler index.handler --zip-file fileb:///etc/functions/crud/function.zip --role arn:aws:iam::000000000000:role/lambda-role --environment '{"Variables":{"APP_AWS_ENDPOINT":"http://localhost.localstack.cloud:4566","APP_BUCKET_NAME":"cucumber-reports-anonymous-envelopes"}}' --tags '{"_custom_id_":"crud"}'
awslocal lambda create-function-url-config --region us-east-2 --function-name crud --auth-type NONE
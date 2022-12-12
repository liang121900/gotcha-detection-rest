# Gotcha-Rest: AWS Serverless API demo in Node and Fasitfy on lambda, calling SQS, S3, Dynamo Service

## Summary

A serverless rest api demo that mostly use fastify on lambda, it provides an endpoint to receive images and return a requestId, then it will send the image to S3, send a messge to sqs queue, and store related status to DynamoDB. The message and image will be picked up and pcossed by [Gotcha-Ai-Worker](https://github.com/liang121900/gotcha-ai-worker) which willupload an output image with object detected on S3, and update the status to PROCESSED on dynamoDB. The user can use another endpoint to get the process status by the requestId and get the result image once the status becomes PROCESSED.

# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)
This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the src directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://www.fastify.io/docs/latest/).

# AWS SAM:
## To Build
```sam build --config-file .\samconfig.toml```
## To Deploy
```sam deploy --config-file samconfig.toml --profile default --region us-east-1```
# Contributing

## Setup

There are some prerequisites:

- Node.js
- Docker

To install the dependencies:

```shell
npm install
```

## Running the app

To run the app:

```shell
# Spins up LocalStack for AWS services
docker compose up

# Starts the React app
npm run dev
```

With that done, you should see the landing page at http://localhost:5173.

## Running the tests

Some functions and React components have tests. You can run them via `vitest` with:

```shell
npm run test:unit
```

The scenarios in the `features` directory can be run as acceptance tests via `cucumber-node` with:

```shell
npm run test:acceptance
```

## Testing with Cucumber

You can point Cucumber at your locally running app by setting the `CUCUMBER_PUBLISH_URL` environment variable to `http://touch.lambda-url.us-east-2.localhost.localstack.cloud:4566`.


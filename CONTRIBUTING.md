# Contributing

## Setup

There are some prerequisites:

- Node.js

To install the dependencies:

```shell
npm install
```

## Running the app

To run the app:

```shell
npm run dev
```

That brings up:

- [Vite](https://vite.dev/) for the frontend, with hot reloading
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for the Worker and R2 stuff

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

You can point Cucumber at your locally running app by setting the `CUCUMBER_PUBLISH_URL` environment variable to `http://localhost:5173/api/reports`. You might want to increase the `UPLOAD_TTL` variable which is set artificially low by default. 

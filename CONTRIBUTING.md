# Contributing

## Setup

There are some prerequisites:

- Node.js

To install the dependencies:

```shell
npm install
```

## Running the app

To run the app, you need three terminal sessions:

```shell
# Terminal 1: touch worker (port 8787)
npm run dev:touch

# Terminal 2: crud worker (port 8788)
npm run dev:crud

# Terminal 3: Vite (port 5173)
npm run dev
```

With that done, you should see the landing page at http://localhost:5173.

**Note:** Presigned URLs from the touch worker won't work locally (no R2 HTTP endpoint). For manual testing, use wrangler to upload directly:

```shell
npx wrangler r2 object put cucumber-reports-anonymous-envelopes/{id} --file=./test-data.ndjson --local
```

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

You can point Cucumber at your locally running app by setting the `CUCUMBER_PUBLISH_URL` environment variable to `http://localhost:8787`.

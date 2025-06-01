# Architecture

## Context

When we say you "publish a report" to Cucumber Reports, what we mean is that Cucumber (the thing you run the tests with e.g. cucumber-jvm) generates a stream of [Cucumber Messages](https://github.com/cucumber/messages) (the firehose of events from the test run), and sends those messages to Cucumber Reports (the service), so it can later render them as a human-readable report. In other words, the service is a repository for messages, with a coordination and view layer on top of them.

The main goals of this architecture are to be easy to maintain and cheap to run. We'll tolerate some platform coupling to get this.

## High-level architecture

At a high level, the service has just two parts:

- A [Next.js](https://nextjs.org/) app with server and client components
- An [AWS S3](https://aws.amazon.com/s3/) bucket for storing messages

The user is interacting with this from two places:

- Cucumber, with which they execute a test run — this in turn interacts with the app for coordination, and S3 for uploading messages
- A browser, with which they subsequently view the report — this in turn interacts with the app for coordination plus the view layer, and S3 for retrieving messages

```mermaid
graph TD
    Browser[Browser]:::browser
    Cucumber[Cucumber]:::cucumber
    App[Next.js App]:::app
    S3[(S3 Bucket)]:::s3

    Cucumber -->|uploads data| S3
    Cucumber -->|creates reports| App
    App -->|reads and writes reports| S3
    Browser -->|views reports| App
    Browser -->|fetches data| S3

    classDef browser fill:#f3e5f5,stroke:#6a1b9a
    classDef cucumber fill:#e8f5e9,stroke:#2e7d32
    classDef app fill:#e1f5fe,stroke:#01579b
    classDef s3 fill:#fff3e0,stroke:#e65100
```

## Sequences

### Publishing a report

```mermaid
sequenceDiagram
    Cucumber->>App: 1. Request report creation
    App->>S3: 2. Generate pre-signed upload URL
    S3-->>App: 3. Return pre-signed upload URL
    App-->>Cucumber: 4. Return view URL and pre-signed upload URL
    Cucumber->>S3: 5. Write messages object to bucket with upload URL
    Browser->>App: 6. Navigate to report URL
    App->>S3: 7. Generate pre-signed retrieval URL
    S3-->>App: 8. Return pre-signed retrieval URL
    App-->>Browser: 9. Serve report page with pre-signed retrieval URL
    Browser->>S3: 10. Request messages object with retrieval URL
    S3-->>Browser: 11. Return messages object
    Browser->>Browser: 12. Render report
```

### Deleting a report

```mermaid
sequenceDiagram
    Browser->>App: 1. Request report deletion
    App->>S3: 2. Request object deletion from bucket
    S3-->>App: 3. Return success
    App-->>Browser: 4. Redirect to landing page
```
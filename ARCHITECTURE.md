# Architecture

## Context

When we say you "publish a report" to Cucumber Reports, what we mean is that Cucumber (the thing you run the tests with e.g. cucumber-jvm) generates a stream of [Cucumber Messages](https://github.com/cucumber/messages) (the firehose of events from the test run), and sends those messages to Cucumber Reports (the service), so it can later render them as a human-readable report. In other words, the service is a repository for messages, with a coordination and view layer on top of them.

The main goals of this architecture are to be easy to maintain and cheap to run. We'll tolerate some platform coupling to get this.

## High-level architecture

At a high level, the service has three parts:

- An [AWS S3](https://aws.amazon.com/s3/) bucket for storing messages
- AWS Lambda functions with HTTP entry points for coordinating operations on those messages
- A React single-page application (SPA) built with Vite for rendering reports

The user is interacting with this from two places:

- Cucumber, with which they execute a test run — this in turn interacts with Lambda functions for coordination, and S3 for uploading messages
- A browser, with which they subsequently view the report — this loads the React SPA, which in turn interacts with Lambda functions for coordination, and S3 for retrieving messages

```mermaid
graph TD
    Browser[Browser]:::browser
    Cucumber[Cucumber]:::cucumber
    SPA[React SPA]:::spa
    Lambda[AWS Lambda]:::lambda
    S3[(S3 Bucket)]:::s3

    Cucumber -->|uploads data| S3
    Cucumber -->|creates reports| Lambda
    Lambda -->|reads and writes reports| S3
    Browser -->|loads| SPA
    SPA -->|coordinates via| Lambda
    SPA -->|fetches data| S3

    classDef browser fill:#f3e5f5,stroke:#6a1b9a
    classDef cucumber fill:#e8f5e9,stroke:#2e7d32
    classDef spa fill:#e1f5fe,stroke:#01579b
    classDef lambda fill:#fff9c4,stroke:#f57f17
    classDef s3 fill:#fff3e0,stroke:#e65100
```

## Sequences

### Publishing a report

```mermaid
sequenceDiagram
    Cucumber->>Lambda: 1. Request report creation
    Lambda-->>Cucumber: 2. Return view URL and pre-signed upload URL
    Cucumber->>S3: 3. Write messages object to bucket with upload URL
    Browser->>SPA: 4. Navigate to report URL
    SPA->>Lambda: 5. Request pre-signed retrieval URL
    Lambda-->>SPA: 6. Return pre-signed retrieval URL
    SPA->>S3: 7. Request messages object with retrieval URL
    S3-->>SPA: 8. Return messages object
    SPA->>SPA: 9. Render report
```

### Deleting a report

```mermaid
sequenceDiagram
    SPA->>Lambda: 1. Request report deletion
    Lambda->>S3: 2. Delete object from bucket
    S3-->>Lambda: 3. Return success
    Lambda-->>SPA: 4. Return success
    SPA->>SPA: 5. Navigate to landing page
```
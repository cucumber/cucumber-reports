Feature: Uploads

  Uploading report content is controlled by signed URLs in the response
  from the initial request.

  Scenario: Reports can only be uploaded during the TTL
    Given a Cucumber implementation that exceeds the upload TTL
    When Kian attempts to publish a report
    Then the upload should fail with status 410
    And no report should be published

  Scenario: Reports can only be uploaded with a valid signed URL
    Given a Cucumber implementation that tampers with the upload URL
    When Kian attempts to publish a report
    Then the upload should fail with status 403
    And no report should be published
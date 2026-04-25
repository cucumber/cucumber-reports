Feature: Compression

  Some Cucumber implementations pre-compress the content with gzip.
  We need to handle it correctly when we serve it back up.

  Scenario Outline: Report content can be compressed
    Given a Cucumber implementation that gzips content with type "<content-type>" and encoding "<content-encoding>"
    When Jaqueline publishes a report
    And Jaqueline views the report they just published
    Then Jaqueline should see their test results
    Examples:
      | content-type      | content-encoding |
      | application/jsonl | gzip             |
      |                   | gzip             |
      | application/gzip  |                  |
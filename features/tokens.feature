Feature: Tokens

  A previous incarnation of the service supported private long-lived reports with a private token.
  Since this is no longer available, we reject any attempt to publish a report with a token.

  Scenario: Publishing a report with a private token
    Given Amanda has a private token
    When Amanda publishes a report
    Then Amanda should see the message:
      """
      ┌──────────────────────────────────────────────────┐
      │ Private reports are no longer supported.         │
      │ You can still publish anonymous (public) reports │
      │ by removing the token from your configuration.   │
      │ See https://reports.cucumber.io/faqs             │
      └──────────────────────────────────────────────────┘
      """
    And no report should be published
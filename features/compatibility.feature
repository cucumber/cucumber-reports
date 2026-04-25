Feature: Compatibility

  Some older Cucumber implementations are publishing with older versions of
  the messages schema and thus are omitting some fields which have since been
  made required.

  Scenario: Report still renders with fields omitted from messages
    Given a Cucumber implementation that omits some fields
    When Ira publishes a report
    And Ira views the report they just published
    Then Ira should see their test results
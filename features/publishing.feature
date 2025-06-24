Feature: Publishing

  Scenario: Report is immediately accessible after the run
    When David publishes a report
    And David views the report they just published
    Then David should see their test results

  Scenario: Reports are publicly accessible with the URL
    When Garrett publishes a report
    And Garrett shares their link with Hannah
    When Hannah views the shared report
    Then Hannah should see the test results

  Scenario: Report still renders with fields omitted from messages
    Given a Cucumber implementation that omits some fields
    When Ira publishes a report
    And Ira views the report they just published
    Then Ira should see their test results
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

  Scenario Outline: Content negotiation
    Given a Cucumber implementation that accepts "<type>"
    When Lakshmi publishes a report
    And Lakshmi views the report they just published
    Then Lakshmi should see their test results
    Examples:
      | type             |
      | text/plain       |
      | application/json |
Feature: Deletion

  Reports aren't kept around forever.

  They are automatically deleted after a
  short period, and can also be proactively deleted by the user.

  Scenario: Deletion is scheduled for 24 hours after publication
    When Bruno publishes a report
    And Bruno views the report they just published
    Then Bruno should see that the report is scheduled for deletion

  Scenario: Proactively deleting a report

  One can always wait for the automatic deletion, but if a report has
  accidentally included sensitive information, it can be deleted proactively.

    When Clara publishes a report
    And Clara views the report they just published
    And Clara deletes the report
    Then Clara should see that the report was deleted

  Scenario: Viewing a deleted report

  The link for a report might be saved and opened sometime after deletion.

    Given a report previously published by Esme has been deleted
    When Esme attempts to view their report
    Then Esme should see that no report was found
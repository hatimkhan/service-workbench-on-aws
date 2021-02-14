Feature: OpenData studies

  Open data studies have certain restrictions. These restrictions are:
  - Researchers can not update OpenData studies
  - Admins can update OpenData studies

  Scenario: A researcher can not update open data studies
    Given an open data study with id "1000-genomes"
    And a user of type "researcher"
    When the user updates the study "description"
    Then the system responds with "unauthorized"

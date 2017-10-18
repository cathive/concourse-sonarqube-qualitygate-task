# SonarQube quality gate checks for Concourse CI

This repository contains a task that can be used in conjunction with the [concourse-sonarqube-resource](https://github.com/cathive/concourse-sonarqube-resource) to check if a quality gate has been met by the Sonar Analysis or not.

# Task usage
The task can be used in your CI pipeline to break your build if the goals
of your SonarQube quality gates have not been met.

```yaml
- task: check-sonarqube-quality-gate
  config:
    platform: linux
    image_resource:
      type: docker-image
      source:
        repository: cathive/concourse-sonarqube-qualitygate-task
        tag: latest # Use one of the versioned tags for reproducible builds!
    inputs:
    - name: sonar-result
    run:
      path: /sonarqube-gualitygate-check
      dir: sonar-result
```
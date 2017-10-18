#!/bin/sh

export WORKDIR
export CE_TASK_FILE
export QUALITYGATE_PROJECT_STATUS_FILE

node "/opt/sonarqube-qualitygate-check/sonarqube-qualitygate-check-cli.js"
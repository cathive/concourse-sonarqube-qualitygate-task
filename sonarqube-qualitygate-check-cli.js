#!/usr/bin/node

const {promisify} = require('util');
const fs = require("fs");
const path = require("path");
const fsExists = promisify(fs.exists);

const check = require("./sonarqube-qualitygate-check");

(async () => {
  try {
    const workdir = process.env["WORKDIR"] || process.cwd();
    const ceTaskFile = path.resolve(workdir, process.env["CE_TASK_FILE"] || "ce_task.json");
    const qualitygateProjectStatusFile = path.resolve(workdir, process.env["QUALITYGATE_PROJECT_STATUS_FILE"] || "qualitygate_project_status.json");

    if (! await fsExists(workdir)) {
      process.stderr.write(`error: Work directory (${workdir}) does not exist. Did you set WORKDIR correctly?\n`)
      process.exit(4);
    }

    process.stdout.write(`Work directory has been set to: "${workdir}".\n`);
    
    if (! await fsExists(ceTaskFile)) {
      process.stderr.write(`error: SonarQube Compute Engine result (${ceTaskFile} does not exist. Did you set WORKDIR and CE_TASK_FILE correctly?\n`);
      process.exit(5);
    }
    
    if (! await fsExists(qualitygateProjectStatusFile)) {
      process.stderr.write(`error: SonarQube QualityGate report (${qualitgateProjectStatusFile} does not exist. Did you set WORKDIR and QUALITYGATE_PROJECT_STATUS_FILE correctly?\n`);
      process.exit(21);
    }
    
    try {
      const ceTask = require(ceTaskFile);
      switch (ceTask.task.status) {
        case "PENDING":
          process.stderr.write(`error: CE Task status is still "PENDING". Can't check quality gate status.\n`)
          process.exit(6);
          break;
        case "IN_PROGRESS":
          process.stderr.write(`error: CE Task status is still "IN_PROGRESS". Can't check quality gate status.\n`)
          process.exit(7);
          break
        case "SUCCESS":
          break;
        default:
          process.stderr.write(`error: SonarQube Compute Engine reported unknown status: ${ceTask.task.status}.\n`)
          process.exit(99)
          break;
      }
      const qualityGateProjectStatus = require(qualitygateProjectStatusFile);
      const result = await check(ceTask, qualityGateProjectStatus);
      if (! result.checkSuccessful) {
        process.stderr.write(`error: ${result.message}\n`)
        process.exit(result.code);
      } else {
        process.stdout.write(`==> ${result.message}`);
        process.exit(result.code);
      }
    } catch (e) {
      process.stderr.write(`An unexpected error occured: ${e.toString()}\n`);
      process.exit(199);
    }
  } catch (e) {
    process.stdout.write(`error: An unexpected error occured: ${e.toString()}\n`);
    process.exit(1);
  }
})();


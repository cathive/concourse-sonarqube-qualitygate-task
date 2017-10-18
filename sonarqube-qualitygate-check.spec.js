const assert = require("assert");
const check = require("./sonarqube-qualitygate-check");

describe("sonarqube-qualitygate-check", () => {
  it("should return no errors when being invoced with correct params.", async () => {
    const result = await check(require("./testdata/ce_task.json"), require("./testdata/qualitygate_project_status.json"));
    assert.equal(result.code, 0, "Unexpected code for analysis of analysis that met the desired QualityGate.");
  });
});
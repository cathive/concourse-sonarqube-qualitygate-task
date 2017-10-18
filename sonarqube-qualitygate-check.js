const MESSAGE_SYMBOL = Symbol("message");
const CODE_SYMBOL = Symbol("code");
const CHECK_SUCCESSFUL_SYMBOL = Symbol("checkSuccessful");

class Result extends Object {
  constructor(message, code, checkSuccessful) {
    super();
    this[MESSAGE_SYMBOL] = message;
    this[CODE_SYMBOL] = code;
    this[CHECK_SUCCESSFUL_SYMBOL] = checkSuccessful
  }
  get message() {
    return this[MESSAGE_SYMBOL];
  }
  get code() {
    return this[CODE_SYMBOL];
  }
  get checkSuccessful() {
    return this[CHECK_SUCCESSFUL_SYMBOL];
  }
}

module.exports = async function check(ceTask, qualityGateProjectStatus) {

  const status = qualityGateProjectStatus.projectStatus.status;
  process.stdout.write(`QualityGate project status: ${status}\n`);
  qualityGateProjectStatus.projectStatus.conditions.forEach(condition => {
    process.stdout.write(`* Metric "${condition.metricKey}": ${condition.status}\n`);
  });

  process.stdout.write("\n");
  switch (status) {
    case "ERROR":
      return new Result("Quality Gate Goals missed!", 127, true);
    case "WARN":
      return new Result("Quality Gate Goals met WITH WARNINGS!", 0, true);
    case "OK":
      return new Result("Quality Gate Goals met.", 0, true);
    default:
      return new Result(`Unknown status of quality gate: "${status}".`, 49, false)
  }

}

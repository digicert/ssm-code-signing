import { main } from "@digicert/ssm-client-tools-installer";
import * as core from "@actions/core";

try {
  const result = await main("keypair-signing");
  core.setOutput("Result", result);
} catch (error) {
  core.setFailed(error.message);
}

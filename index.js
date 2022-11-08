import { main } from "@digicert/ssm-client-tools-installer";
import * as core from "@actions/core";

try {
  const result = await main("keypair-signing");

  !result
    ? core.setOutput("Result", "Success")
    : core.setFailed("Installation failed");
} catch (error) {
  core.setFailed(error.message);
}

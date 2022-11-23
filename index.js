import { main } from "@digicert/ssm-client-tools-installer";
import * as core from "@actions/core";

try {
  const result = await main("keypair-signing");
  const message=JSON.parse(result)
  core.setOutput("Result",message)
  
} catch (error) {
  core.setFailed(error.message);
}

import { main } from "@digicert/ssm-client-tools-installer";
import * as core from "@actions/core";

try {
  const result = await main("keypair-signing");
  const message = JSON.parse(result);
  if (message) {
    core.setOutput("extractPath", message.imp_file_paths.extractPath);
    core.setOutput("PKCS11_CONFIG", message.imp_file_paths.PKCS11_CONFIG);
  } else {
    core.setFailed("Installation Failed");
  }
} catch (error) {
  core.setFailed(error.message);
}

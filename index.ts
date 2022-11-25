import { main } from "@digicert/ssm-client-tools-installer";
import * as core from "@actions/core";

try {
  //@ts-ignore
  main("keypair-signing")
    .then((result) => {
      const message = JSON.parse(result);
      if (message) {
        core.setOutput("extractPath", message.imp_file_paths.extractPath);
        core.setOutput("PKCS11_CONFIG", message.imp_file_paths.PKCS11_CONFIG);
      } else {
        core.setFailed("Installation Failed");
      }
    })
    .catch((err) => {
      throw err;
    });
} catch (error: any) {
  core.setFailed(error.message);
}

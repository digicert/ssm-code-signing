import * as core from "@actions/core";
import { cleanup } from "@digicert/ssm-client-tools-installer";

(async () => {
    console.log('Received cleanup signal. Initiating graceful termination...');
    console.log(`Cleaning up initiated at ${new Date().toISOString()}`);
    cleanup(true)
        .then(() => {
            console.log('Cleanup completed successfully.');
        })
        .catch((error) => {
            console.error('Error during cleanup:', error);
            core.setFailed(`Cleanup failed: ${error.message}`);
        });
    console.log('Cleanup completed. Exiting now.');
})();
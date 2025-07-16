import * as core from "@actions/core";

(async () => {
    console.log('Received cleanup signal. Initiating graceful termination...');
    console.log(`Cleaning up initiated at ${new Date().toISOString()}`);
    console.log('Cleanup completed. Exiting now.');
})();
import * as core from "@actions/core";

(async () => {
    console.log('Received cleanup signal. Initiating graceful shutdown...');
    const tempPath = core.getState("tempPath");
    console.log(`Cleaning up temporary path:', ${tempPath}`);
    console.log('Cleanup completed. Exiting now.');
})();
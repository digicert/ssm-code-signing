import { main } from "@digicert/ssm-client-tools-installer";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import path from "path";
import * as io from "@actions/io";
import fs from "fs";
import os from "os";

const osPlat: string = os.platform();
const signtools =
  osPlat == "win32"
    ? [
        "smctl",
        "ssm-scd",
        "signtool",
        "nuget",
        "mage",
        "apksigner",
        "jarsigner",
      ]
    : ["smctl", "ssm-scd", "nuget", "mage", "apksigner"];
const winKitBasePath = "C:\\Program Files (x86)\\Windows Kits\\";
const toolInstaller = async (toolName: string, toolPath: string = "") => {
  let cacheDir;
  switch (toolName) {
    case "smctl":
      cacheDir = await tc.cacheDir(toolPath, toolName, "latest");
      core.addPath(cacheDir);
      core.debug(`tools cache has been updated with the path: ${cacheDir}`);
      break;
    case "signtool":
      const sign =
        "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.17763.0\\x86\\";

      if (fs.existsSync(winKitBasePath)) {
        console.log('The WinKit directory exists.');
        getAllFiles(winKitBasePath);
      } else {
        console.log('The WinKit directory does not exist.');
      }

      cacheDir = await tc.cacheDir(sign, toolName, "latest");
      core.addPath(cacheDir);
      core.debug(`tools cache has been updated with the path: ${cacheDir}`);
      break;
    case "ssm-scd":
      cacheDir = await tc.cacheDir(toolPath, toolName, "latest");
      core.addPath(cacheDir);
      core.debug(`tools cache has been updated with the path: ${cacheDir}`);
      break;
    case "nuget":
      core.debug("Downloading Nuget tool");
      const nugetPath = await tc.downloadTool(
        "https://dist.nuget.org/win-x86-commandline/latest/nuget.exe"
      );
      // Rename the file which is a GUID without extension
      var folder = path.dirname(nugetPath);
      var fullPath = path.join(folder, "nuget.exe");
      fs.renameSync(nugetPath, fullPath);
      cacheDir = await tc.cacheDir(folder, toolName, "latest");
      core.addPath(cacheDir);
      core.debug(`tools cache has been updated with the path: ${cacheDir}`);
      break;
    case "mage":
      const magedownloadUrl =
        osPlat == "win32"
          ? `https://github.com/magefile/mage/releases/download/v1.14.0/mage_1.14.0_Windows-64bit.zip `
          : `https://github.com/magefile/mage/releases/download/v1.14.0/mage_1.14.0_Linux-64bit.tar.gz`;
      let downloadPath = "";

      try {
        downloadPath = await tc.downloadTool(magedownloadUrl);
      } catch (err: any) {
        core.debug(err);

        throw new Error(`failed to download Mage v: ${err.message}`);
      }
      // Extract tar
      const extractPath =
        osPlat == "win32"
          ? await tc.extractZip(downloadPath)
          : await tc.extractTar(downloadPath);
      cacheDir = await tc.cacheDir(extractPath, toolName, "latest");
      core.addPath(cacheDir);
      core.debug(`tools cache has been updated with the path: ${cacheDir}`);
      break;
    case "apksigner":
      const buildToolsVersion = process.env.BUILD_TOOLS_VERSION || "30.0.2";
      const androidHome = process.env.ANDROID_HOME;
      if (!androidHome) {
        core.error("require ANDROID_HOME to be execute");
        throw new Error("ANDROID_HOME is null");
      }
      const buildTools = path.join(
        androidHome,
        `build-tools/${buildToolsVersion}`
      );
      if (!fs.existsSync(buildTools)) {
        core.error(`Couldnt find the Android build tools @ ${buildTools}`);
      }
      // find apksigner path
      const apkSigner = path.join(buildTools, "apksigner");
      core.debug(`Found 'apksigner' @ ${apkSigner}`);
      core.debug("Verifying Signed APK");
      const toolcache = await tc.cacheDir(buildTools, "apksigner", "0.9");
      core.addPath(toolcache);
      break;
    case "jarsigner":
      const jarSignerPath = await io.which("jarsigner", true);
      core.debug(`Found 'jarsigner' @ ${jarSignerPath}`);
      core.addPath(jarSignerPath);
      break;
  }
};

function getAllFiles(dirPath: any) {
  fs.readdirSync(dirPath, {withFileTypes: true}).forEach(files => {
    console.log(files);
  });
}

(async () => {
  try {
    process.env.SHOULD_CHECK_INSTALLED = "false";
    const result = await main("keypair-signing");
    const message = JSON.parse(result);
    if (message) {
      core.setOutput("extractPath", message.imp_file_paths.extractPath);
      core.setOutput("PKCS11_CONFIG", message.imp_file_paths.PKCS11_CONFIG);
      signtools.map(async (sgtool) =>
        (await (sgtool == "smctl" || sgtool == "ssm-scd"))
          ? toolInstaller(sgtool, message.imp_file_paths.extractPath)
          : toolInstaller(sgtool)
      );
    } else {
      core.setFailed("Installation Failed");
    }
  } catch (error: any) {
    core.setFailed(error.message);
  }
})();

import { main } from "@digicert/ssm-client-tools-installer";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import path from "path";
import * as io from "@actions/io";
import fs from "fs";
import os from "os";
import * as con from "./constants.js";
import { SdkVersionUtils } from "./sdk-version-utils.js";

const utils = new SdkVersionUtils();
const osPlat: string = os.platform();
const signtools =
  osPlat == con.OS_PLATFORM_WIN
    ? [con.SIGN_TOOL_SMCTL, con.SIGN_TOOL_SSM_SCD, con.SIGN_TOOL_SIGNTOOL, con.SIGN_TOOL_NUGET, con.SIGN_TOOL_MAGE, con.SIGN_TOOL_APKSIGNER, con.SIGN_TOOL_JARSIGNER]
    : [con.SIGN_TOOL_SMCTL, con.SIGN_TOOL_SSM_SCD, con.SIGN_TOOL_NUGET, con.SIGN_TOOL_MAGE, con.SIGN_TOOL_APKSIGNER];
const toolInstaller = async (toolName: string, toolPath: string = "") => {
  let cacheDir;
  switch (toolName) {
    case con.SIGN_TOOL_SMCTL:
      cacheDir = await tc.cacheDir(toolPath, toolName, "latest");
      core.addPath(cacheDir);
      core.debug(`tools cache has been updated with the path: ${cacheDir}`);
      break;

    case con.SIGN_TOOL_SIGNTOOL:
      var sign = ""; 
      if (fs.existsSync(con.WIN_KIT_BASE_PATH)) {
        console.log(`The WinKit directory exists!`);
        let versions = utils.getAllSdkVersions(con.WIN_KIT_BASE_PATH, new Array());
        console.log(`Available Win SDK versions : `, versions);
        let latestSdkVerIdx = utils.getLatestSdkVersionIndex(
          utils.toNumericVersions(versions));
        console.log(`Latest Win SDK Version is : `, versions[latestSdkVerIdx]);
        console.log(`Using the latest Win SDK version ${versions[latestSdkVerIdx]} for signing!`);
        sign = con.WIN_KIT_BASE_PATH + versions[latestSdkVerIdx] + con.ARCH_TYPE_DIR;
        
        cacheDir = await tc.cacheDir(sign, toolName, "latest");
        core.addPath(cacheDir);
        core.debug(`tools cache has been updated with the path: ${cacheDir}`);
      } else {
        console.log('The WinKit directory does not exist.');
      }
      break;

    case con.SIGN_TOOL_SSM_SCD:
      cacheDir = await tc.cacheDir(toolPath, toolName, "latest");
      core.addPath(cacheDir);
      core.debug(`tools cache has been updated with the path: ${cacheDir}`);
      break;

    case con.SIGN_TOOL_NUGET:
      core.debug("Downloading Nuget tool");
      const nugetPath = await tc.downloadTool(con.NUGET_PATH);
      // Rename the file which is a GUID without extension
      var folder = path.dirname(nugetPath);
      var fullPath = path.join(folder, "nuget.exe");
      fs.renameSync(nugetPath, fullPath);
      cacheDir = await tc.cacheDir(folder, toolName, "latest");
      core.addPath(cacheDir);
      core.debug(`tools cache has been updated with the path: ${cacheDir}`);
      break;

    case con.SIGN_TOOL_MAGE:
      const magedownloadUrl =
        osPlat == con.OS_PLATFORM_WIN ? con.DOWNLOAD_PATH_WIN_MAGE : con.DOWNLOAD_PATH_LINUX_MAGE;
      let downloadPath = "";
      try {
        downloadPath = await tc.downloadTool(magedownloadUrl);
      } catch (err: any) {
        core.debug(err);

        throw new Error(`failed to download Mage v: ${err.message}`);
      }
      // Extract tar
      const extractPath =
        osPlat == con.OS_PLATFORM_WIN
          ? await tc.extractZip(downloadPath)
          : await tc.extractTar(downloadPath);
      cacheDir = await tc.cacheDir(extractPath, toolName, "latest");
      core.addPath(cacheDir);
      core.debug(`tools cache has been updated with the path: ${cacheDir}`);
      break;

    case con.SIGN_TOOL_APKSIGNER:
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

    case con.SIGN_TOOL_JARSIGNER:
      const jarSignerPath = await io.which("jarsigner", true);
      core.debug(`Found 'jarsigner' @ ${jarSignerPath}`);
      core.addPath(jarSignerPath);
      break;
  }
};

(async () => {
  try {
    process.env.SHOULD_CHECK_INSTALLED = "false";
    const result = await main("keypair-signing");
    const message = JSON.parse(result);
    if (message) {
      core.setOutput("extractPath", message.imp_file_paths.extractPath);
      core.setOutput("PKCS11_CONFIG", message.imp_file_paths.PKCS11_CONFIG);
      signtools.map(async (sgtool) =>
        (await (sgtool == con.SIGN_TOOL_SMCTL || sgtool == con.SIGN_TOOL_SSM_SCD))
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

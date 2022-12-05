import { main } from "@digicert/ssm-client-tools-installer";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as tl from "azure-pipelines-task-lib/task";
import path from "path";
import * as semver from "semver";
import * as globber from "@actions/glob";
import fs from 'fs'
import * as exec from "@actions/exec"

const toolInstaller=async (toolPath:string,toolName:any)=>{
  if(toolName!="smctl" || toolName!="signtool"){
    core.debug("Downloading Nuget tool");
    const nugetPath = await tc.downloadTool("https://dist.nuget.org/win-x86-commandline/latest/nuget.exe");

    // Rename the file which is a GUID without extension
    var folder = path.dirname(nugetPath);
    var fullPath = path.join(folder, "nuget.exe");
    fs.renameSync(nugetPath, fullPath);
  }
  const cacheDir=await tc.cacheDir(toolPath,toolName,"latest")
  core.addPath(cacheDir);
  console.log("tools cache has been updated with the path:", cacheDir);
  
}

async function run(){
try {
  const resolvedVersion = "1.31.0";
  const sign =
    "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.17763.0\\x86\\";
  const apk="C:\\Program Files (x86)\\Android\\android-sdk\\build-tools\\30.0.0\\apksigner.bat";  
  process.env.SHOULD_CHECK_INSTALLED = "false";
  const result=await main("keypair-signing")
  const message = JSON.parse(result);
      if (message) {
        core.setOutput("extractPath", message.imp_file_paths.extractPath);
        core.addPath(message.imp_file_paths.extractPath);
        tc.cacheDir(
          message.imp_file_paths.extractPath,
          "smctl",
          resolvedVersion
        ).then((response) => {
          console.log("tools cache has been updated with the path:", response);
        });
        core.addPath(message.imp_file_paths.extractPath);
        tc.cacheDir(sign,"signtool", "1.1.1").then((response) => {
          core.addPath(response);
          console.log("tools cache has been updated with the path:", response);
        });
        exec.exec(apk).then((response) => {
          
          console.log("tools cache has been updated with the path:", response);
        });
        core.setOutput("PKCS11_CONFIG", message.imp_file_paths.PKCS11_CONFIG);
      } else {
        core.setFailed("Installation Failed");
      }       
} catch (error: any) {
  core.setFailed(error.message);
}
}

run();

import { main } from "@digicert/ssm-client-tools-installer";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as tl from "azure-pipelines-task-lib/task";
import path from "path";
import * as semver from "semver";
import * as globber from "@actions/glob";
import fs from 'fs'
import * as child_process from 'child_process'
import * as exec from "@actions/exec"
const signtools=["smctl",'signtool','nuget','mage','apksigner','jarsigner']
const toolInstaller=async (toolPath:string,toolName:any)=>{
   let cacheDir;
  switch(toolName){
  case 'smctl':
                cacheDir=await tc.cacheDir(toolPath,toolName,"latest")
                core.addPath(cacheDir);
                console.log("tools cache has been updated with the path:", cacheDir);
                break;
  case 'signtool':
    const sign =
    "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.17763.0\\x86\\";   
  cacheDir=await tc.cacheDir(sign,toolName,"latest")
    core.addPath(cacheDir);
    console.log("tools cache has been updated with the path:", cacheDir);
    break;                
    case 'nuget':
      core.debug("Downloading Nuget tool");
    const nugetPath = await tc.downloadTool("https://dist.nuget.org/win-x86-commandline/latest/nuget.exe");

    // Rename the file which is a GUID without extension
    var folder = path.dirname(nugetPath);
    var fullPath = path.join(folder, "nuget.exe");
    fs.renameSync(nugetPath, fullPath);
      cacheDir=await tc.cacheDir(folder,toolName,"latest")
     core.addPath(cacheDir);
     core.debug(`Cached Tool Dir ${cacheDir}`);
     break;                
     case 'mage':
      const downloadUrl = `https://github.com/magefile/mage/releases/download/v1.14.0/mage_1.14.0_Linux-64bit.tar.gz`;
      let downloadPath = '';

  try {
    downloadPath = await tc.downloadTool(downloadUrl);
  } catch (err:any) {
    core.debug(err);

    throw new Error(`failed to download Mage v: ${err.message}`);
  }

  // Extract tar
  const extractPath = await tc.extractTar(downloadPath);
      cacheDir=await tc.cacheDir(extractPath,toolName,"latest")
     core.addPath(cacheDir);
     console.log("tools cache has been updated with the path:", cacheDir);
     break;                
     case 'apksigner':
      exec.exec
      cacheDir=await tc.cacheDir(toolPath,toolName,"latest")
     core.addPath(cacheDir);
     console.log("tools cache has been updated with the path:", cacheDir);
     break;                
     case 'jarsigner':
      cacheDir=await tc.cacheDir(toolPath,toolName,"latest")
     core.addPath(cacheDir);
     console.log("tools cache has been updated with the path:", cacheDir);
     break;                
     




  }
  
  if(toolName!="smctl" || toolName!="signtool"){
    
  }
  
}

function findToolInPath(pathForTool: string, tool: string) {
  const patterns = `${pathForTool}\\${tool}.jar`;
  globber
    .create(patterns)
    .then((globber: any) => {
      return globber.glob();
    })
    .then((files: any) => {
      return files && files.length > 0 ? files[0] : undefined;
    })
    .catch((err) => {
      console.error("***", err);
    });
  return undefined;
}

async function run(){
try {
//   const resolvedVersion = "1.31.0";
  
  const apk="C://Program Files (x86)//Android//android-sdk//build-tools//29.0.3//lib//";  
//   process.env.SHOULD_CHECK_INSTALLED = "false";
//   const result=await main("keypair-signing")
//   const message = JSON.parse(result);
//       if (message) {
//         core.setOutput("extractPath", message.imp_file_paths.extractPath);
//         core.addPath(message.imp_file_paths.extractPath);
//         tc.cacheDir(
//           message.imp_file_paths.extractPath,
//           "smctl",
//           resolvedVersion
//         ).then((response) => {
//           console.log("tools cache has been updated with the path:", response);
//         });
//         exec.exec(`${apk}\\apksigner.bat`)
//         exec.exec(`apksigner`)
//         tc.cacheDir(apk,"zipalign", "latest").then((response) => {
//           core.addPath(response);
//           console.log("tools cache has been updated with the path:", response);
//         });
        

// child_process.exec(`${apk}\\apksigner.bat`, function(error, stdout, stderr) {
//     console.log(stdout);
// });
//         tc.cacheDir(apk,"apksigner", "latest").then((response) => {
//           core.addPath(response);
//           console.log("tools cache has been updated with the path:", response);
//         });
//         core.setOutput("PKCS11_CONFIG", message.imp_file_paths.PKCS11_CONFIG);
//       } else {
//         core.setFailed("Installation Failed");
//       }
core.debug("Zipaligning APK file");

// Find zipalign executable
const buildToolsVersion = process.env.BUILD_TOOLS_VERSION || '30.0.2';
const androidHome = process.env.ANDROID_HOME;
if (!androidHome) {
    core.error("require ANDROID_HOME to be execute");
    throw new Error("ANDROID_HOME is null");
}
const buildTools = path.join(androidHome, `build-tools/${buildToolsVersion}`);
if (!fs.existsSync(buildTools)) {
    core.error(`Couldnt find the Android build tools @ ${buildTools}`)
}

const zipAlign = path.join(buildTools, 'zipalign');
core.debug(`Found 'zipalign' @ ${zipAlign}`);
core.debug("Signing APK file");

// find apksigner path
const apkSigner = path.join(buildTools, 'apksigner');
core.debug(`Found 'apksigner' @ ${apkSigner}`); 
  
} catch (error: any) {
  core.setFailed(error.message);
}
}




run();

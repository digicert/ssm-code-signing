import { main } from "@digicert/ssm-client-tools-installer";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache"
import * as tl from "azure-pipelines-task-lib/task";
import path from 'path'
import *as semver from 'semver'
import  * as globber from "@actions/glob"
try {
const resolvedVersion="1.31.0"
 process.env.SHOULD_CHECK_INSTALLED="false"
  main("keypair-signing")
    .then((result:any) => {
      const message = JSON.parse(result);
      if (message) {
        core.setOutput("extractPath", message.imp_file_paths.extractPath);
        core.addPath(message.imp_file_paths.extractPath);
         tc.cacheDir(
          message.imp_file_paths.extractPath,
          'smctl',
          resolvedVersion
        ).then((response)=>{
          console.log("tools cache has been updated with the path:",response)
        });
        core.setOutput("PKCS11_CONFIG", message.imp_file_paths.PKCS11_CONFIG);
      } else {
        core.setFailed("Installation Failed");
      }
    })
    .catch((err:any) => {
     throw err;
    });
   findToolInPath("C:\\Program Files (x86)\\Windows Kits\\10\\bin\\**","signtool")
 
} catch (error:any) {
  core.setFailed(error.message);
}

function findToolInPath(pathForTool: string, tool: string) {
  const patterns = `${pathForTool}\\${tool}.exe`
  globber.create(patterns)
  .then((globber:any)=>{
   return  globber.glob()
  }).then((files:any)=>{
  console.log("***",files)
  }).catch((err)=>{
    console.error("***",err);
  }
  )
}
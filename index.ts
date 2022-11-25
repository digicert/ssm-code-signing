import { main } from "@digicert/ssm-client-tools-installer";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache"
import * as tl from "azure-pipelines-task-lib/task";
import path from 'path'
import *as semver from 'semver'

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
  const signtoolpath=  findToolInPath("C:\\Program Files (x86)\\Microsoft SDKs\\Windows\\","signtool")
 console.log("**",signtoolpath)
} catch (error:any) {
  core.setFailed(error.message);
}

function findToolInPath(pathForTool: string, tool: string) {
  const toolsList = tl.findMatch(
    tl.resolve(pathForTool),
    [`${tool}*`, "!*.jar"],
    undefined,
    { matchBase: true }
  );
  if (!toolsList || toolsList.length === 0) {
    throw new Error(`Could not find ${tool} path`);
  }
  //this is to find the latest SDK as there will be multiple installed versions
  toolsList.sort((a: string, b: string) => {
    const toolBaseDirA = path.basename(path.dirname(a));
    const toolBaseDirB = path.basename(path.dirname(b));
    if (semver.valid(toolBaseDirA) && semver.valid(toolBaseDirB)) {
      return semver.rcompare(toolBaseDirA, toolBaseDirB);
    } else if (semver.valid(toolBaseDirA)) {
      return -1;
    } else {
      return toolBaseDirA.localeCompare(toolBaseDirB);
    }
  });
  return toolsList[0];
}
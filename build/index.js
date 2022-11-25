"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
const ssm_client_tools_installer_1 = require("@digicert/ssm-client-tools-installer");
const core = __importStar(require("@actions/core"));
try {
  //@ts-ignore
  (0, ssm_client_tools_installer_1.main)("gpg-signing").then((result) => {
    const message = JSON.parse(result);
    if (message) {
      core.setOutput("extractPath", message.imp_file_paths.extractPath);
      core.setOutput("PKCS11_CONFIG", message.imp_file_paths.PKCS11_CONFIG);
    } else {
      core.setFailed("Installation Failed");
    }
  });
} catch (error) {
  core.setFailed(error.message);
}

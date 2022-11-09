import  {main} from "@digicert/ssm-client-tools-installer";
import * as core from "@actions/core"

const result=await main("keypair-signing")
core.setOutput("result",result)

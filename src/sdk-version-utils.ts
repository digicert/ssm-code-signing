import fs from "fs";

const EXPRESSION_VERSION_DIR = /\d+\.\d+/;

const EXPRESSION_GROUPED_FLOAT = /[,\.]\d{2}$/;

const EXPRESSION_DIGIT = /(\d{2})$/;

const EXPRESSION_NON_DIGIT = /[^0-9]/g;

export class SdkVersionUtils {

    constructor() {}

    public getLatestSdkVersion(sdkVersions: number[]): number {
        return Math.max(...sdkVersions);
    } 

    public getLatestSdkVersionIndex(sdkVersions: number[]): number {
        return sdkVersions.indexOf(Math.max(...sdkVersions));
    } 

    public isVersionDirectory(str: any) {
        return EXPRESSION_VERSION_DIR.test(str);
    }

    public parseGroupedFloat(stringValue: string) {
        stringValue = stringValue.trim();
        var result = stringValue.replace(EXPRESSION_NON_DIGIT, '');
        if (EXPRESSION_GROUPED_FLOAT.test(stringValue)) {
            result = result.replace(EXPRESSION_DIGIT, '.$1');
        }
        return parseFloat(result);
    }

    public toNumericVersions(numStr: string[]): number[] {
        const numArr = numStr.map(eachStr => this.parseGroupedFloat(eachStr));
        return numArr;
    }

    public getAllSdkVersions(dirPath: any, sdkVersions: any = []): any {
      fs.readdirSync(dirPath, {withFileTypes: true}).forEach(file => {
        if(this.isVersionDirectory(file.name)){
          sdkVersions.push(file.name)
        }
      });
      return sdkVersions;
    }
    
}
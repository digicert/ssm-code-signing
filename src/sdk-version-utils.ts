import fs from "fs";

export class SdkVersionUtils {

    constructor() {}

    public getLatestSdkVersion(sdkVersions: number[]): number {
        return Math.max(...sdkVersions);
    } 

    public getLatestSdkVersionIndex(sdkVersions: number[]): number {
        return sdkVersions.indexOf(Math.max(...sdkVersions));
    } 

    public isVersionDirectory(str: any) {
        return /\d+\.\d+/.test(str);
    }

    public parseGroupedFloat(stringValue: string) {
        stringValue = stringValue.trim();
        var result = stringValue.replace(/[^0-9]/g, '');
        if (/[,\.]\d{2}$/.test(stringValue)) {
            result = result.replace(/(\d{2})$/, '.$1');
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
          //console.debug(file.name);
        }
      });
      return sdkVersions;
    }
    
}
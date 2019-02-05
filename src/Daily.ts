import * as fs from "fs-extra";

export class Daily {
    filePath: string;
    watch: boolean;

    // Cache The Body
    __CACHE__: any;
    
    constructor(filePath: string, watch = false) {
        this.filePath = filePath;

        this.watch = watch;
    }

    async load() {
        const text = await fs.readFile(this.filePath, 'utf-8');

        
    }
}

import { Prefab, resources } from "cc";

export class ResMgr {
    private static _inst: ResMgr;
    public static get inst() {
        if (!this._inst) {
            this._inst = new ResMgr();
        }
        return this._inst;
    }

    /**
     * 加载预制体 Prefab
     * @param path 预制体路径
     * @returns 
     */
    public async loadPrefab(prefabPath: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            resources.load('prefabs/' + prefabPath, Prefab, (err, prefab) => {
                if (!err) {
                    resolve(prefab);
                } else {
                    console.error(err);
                    reject(err);
                }

            });
        })

    }

    public async load(resPath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(resPath, (err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    console.error(err);
                    reject(err);
                }
            })
        })
    }
}
/*
 * @Descripttion: 资源管理器
 * @Author: CYK
 * @Date: 2022-05-12 16:15:52
 */
import { Asset, Prefab, resources } from "cc";
import { JuHuaDlg } from "../../modules/common/JuHuaDlg";

export class ResMgr {
    private static _inst: ResMgr;
    public static get inst() {
        if (!this._inst) {
            this._inst = new ResMgr();
        }
        return this._inst;
    }

    private _juHuaDlg: JuHuaDlg;
    private closeJuHuaDlg() {
        if (this._juHuaDlg) {
            this._juHuaDlg.close();
            this._juHuaDlg = null;
        }
    }

    /**
     * 加载预制体 Prefab
     * @param path 预制体路径
     * @returns 
     */
    public async loadPrefab(prefabPath: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            let cachePrefab = this.get('prefab/' + prefabPath);
            if(cachePrefab){   
                console.log('resName: ' + prefabPath + '加载完毕(缓存已有)');
                return resolve(cachePrefab as Prefab);
            }else{
                resources.load('prefab/' + prefabPath, Prefab, (err, prefab) => {
                    if (!err) {
                        console.log('resName: ' + prefabPath + '加载完毕');
                        resolve(prefab);
                    } else {
                        console.log('resName: ' + prefabPath + '加载失败');
                        reject(err);
                    }
                });
            }
        })
    }

    /**
     * 加载资源
     * @param res 资源列表
     * @param itorCb 单个资源加载完毕回调
     * @param cb 全部下载完成回调
     * @param ctx 
     */
    public loadWithItor(res: string[] | string, itorCb?: Function, cb?: Function, ctx?: any, needJuHua: boolean = true) {
        let resList = typeof res === 'string' ? [res] : res;
        let totLen = resList.length;//待下载总个数
        let hasLoadResCount: number = 0;//已下载个数
        if (needJuHua) {
            let isAllLoaded = true;
            for (let i = 0; i < totLen; i++) {
                let resName = resList[i];
                if (!this.get(resName)) {
                    isAllLoaded = false;
                    break;
                }
            }
            if (!isAllLoaded && !this._juHuaDlg) {
                // this._juHuaDlg = JuHuaDlg.show() as JuHuaDlg;
            }
        }

        let loadSucc = (resName: string, isFromCache?: boolean) => {
            hasLoadResCount++;
            console.log('resName: ' + resName + '加载完毕' + (isFromCache ? '(缓存已有)' : ''));
            if (itorCb) itorCb.call(ctx, resName, hasLoadResCount);
            if (hasLoadResCount == totLen) {
                this.closeJuHuaDlg();
                if (cb) cb.call(ctx);
            }
        }

        for (let i = 0; i < totLen; i++) {
            let resName = resList[i];
            if (this.get(resName)) {//缓存已有
                loadSucc(resName, true);
            } else {
                resources.load(resName, Asset, (err: Error | null, asset: Asset) => {
                    if (!err) {
                        loadSucc(resName);
                    } else {
                        console.error('resName: ' + resName + '加载失败');
                    }
                })
            }
        }
    }

    /**
  * 下载资源
  * @param resList 资源列表
  * @param cb 全部下载完成回调
  * @param ctx 
  */
    public load(resList: string[] | string, cb?: Function, ctx?: any) {
        this.loadWithItor(resList, null, cb, ctx);
    }

    /**
     * 下载资源(无菊花模式)
     * @param resList 资源列表
     * @param cb 全部下载完成回调
     * @param ctx 
     */
    public loadWithoutJuHua(resList: string[] | string, cb?: Function, ctx?: any) {
        this.loadWithItor(resList, null, cb, ctx, false);
    }

    /**获取已加载缓存的资源 */
    public get(resName: string) {
        return resources.get(resName);
    }
    /**
     * 释放资源
     * @param res 
     */
    public releaseRes(res: string | string[]) {
        let resList = typeof res === 'string' ? [res] : res;
        for (let i = 0; i < resList.length; i++) {
            let resName = resList[i];
            resources.release(resName);

        }
    }
}
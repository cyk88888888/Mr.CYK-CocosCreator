/*
 * @Descripttion: 说明
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator, Component, Node, ProgressBar } from 'cc';
import { UILayer } from '../../framework/ui/UILayer';
import { SceneMgr } from '../../framework/mgr/SceneMgr';
import { ResMgr } from '../../framework/mgr/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('LoadingLayer')
export class LoadingLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'loading/LoadingLayer';
    private loadingBar: Node;
    private progressBar: ProgressBar;
    private _isLoadingHome: boolean;

    private _preResList: string[];
    private _toPercent: number;
    private onEnter() {
        let self = this;
        this.progressBar = this.loadingBar.getComponent(ProgressBar);
        self._preResList = ['prefab/home/HomeLayer'];
        let curDownLoadNum: number = 0;//当前已下载个数
        let initPercent = self._toPercent = 0.4;//默认加载到40%
        ResMgr.inst.loadWithItor(self._preResList, () => {
            curDownLoadNum++;
            self._toPercent = initPercent + (curDownLoadNum / self._preResList.length) * 0.6;
        });
    }

    update(dt: number) {
        let self = this;
        if (self.progressBar && self.progressBar.progress < self._toPercent) {
            self.progressBar.progress += 0.005;
            if (!self._isLoadingHome && self.progressBar.progress >= 1) {
                self._isLoadingHome = true;
                SceneMgr.inst.run('HomeScene');
            }
        }
    }
}


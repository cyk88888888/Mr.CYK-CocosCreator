/*
 * @Descripttion: 说明
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator, Component, Node, ProgressBar } from 'cc';
import { UILayer } from '../../framework/ui/UILayer';
import { SceneMgr } from '../../framework/mgr/SceneMgr';
const { ccclass, property } = _decorator;

@ccclass('LoadingLayer')
export class LoadingLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'loading/LoadingLayer';
    private progressBar: ProgressBar;
    private _isChanging: boolean;
    private onEnter() {
        this.progressBar = this.node.getChildByName("ProgressBar").getComponent(ProgressBar);
    }

    update(deltaTime: number) {
        this.progressBar.progress += 0.005;
        if (!this._isChanging && this.progressBar.progress >= 1) {
            this._isChanging = true;
            SceneMgr.inst.push('ListTestScene');
        }
    }
}


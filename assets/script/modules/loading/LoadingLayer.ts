import { _decorator, Component, Node, ProgressBar } from 'cc';
import { UILayer } from '../../framework/lib/UILayer';
import { SceneMgr } from '../../framework/mgr/SceneMgr';
const { ccclass, property } = _decorator;

@ccclass('LoadingLayer')
export class LoadingLayer extends UILayer {
    private progressBar: ProgressBar;
    private _isChanging: boolean;
    private onEnter(){
        this.progressBar = this.node.getChildByName("ProgressBar").getComponent(ProgressBar);
    }

    update(deltaTime: number) {
        this.progressBar.progress += 0.005;
        if(!this._isChanging && this.progressBar.progress >= 1){
            this._isChanging = true;
            SceneMgr.inst.pushScene('ListTestScene');
        }
    }
}


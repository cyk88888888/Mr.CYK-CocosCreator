import { _decorator, Component, Node, instantiate } from 'cc';
import { UIScene } from '../../framework/lib/UIScene';
import { ResMgr } from '../../framework/mgr/ResMgr';
import { SceneMgr } from '../../framework/mgr/SceneMgr';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene')
export class LoadingScene extends UIScene {
    async onLoad() {
        let prefab = await ResMgr.inst.loadPrefab('loading/LoadingLayer');
        const newNode = instantiate(prefab);
        let script = newNode.addComponent('LoadingLayer');
        // script['newNode'] = newNode;
        newNode.setParent(SceneMgr.inst.layer.node);
    }
    start(){
        this;
    }
}


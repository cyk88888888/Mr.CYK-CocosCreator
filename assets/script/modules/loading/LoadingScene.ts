import { _decorator, Component, Node, instantiate, assetManager } from 'cc';
import { UIScene } from '../../framework/lib/UIScene';
import { ResMgr } from '../../framework/mgr/ResMgr';
import { SceneMgr } from '../../framework/mgr/SceneMgr';
import { LoadingLayer } from './LoadingLayer';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene')
export class LoadingScene extends UIScene {
    private ctor() {
        this._mainLayerClass = LoadingLayer;
    }

    private async onEnter() {
        let prefab = await ResMgr.inst.loadPrefab('loading/LoadingLayer');
        const newNode = instantiate(prefab);
        newNode.setParent(SceneMgr.inst.layer.node);
        let script = newNode.addComponent('LoadingLayer');
       // script['newNode'] = newNode;
       assetManager.loadBundle
        
    }
    start() {
        this;
    }
}


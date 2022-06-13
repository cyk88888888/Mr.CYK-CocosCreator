/*
 * @Descripttion: 说明
 * @Author: CYK
 * @Date: 2022-05-12 09:23:41
 */
import { _decorator, Component, Node, instantiate } from 'cc';
import { BaseUT } from '../base/BaseUtil';
import { ResMgr } from '../mgr/ResMgr';
import { SceneMgr } from '../mgr/SceneMgr';
import { UIComp } from './UIComp';
const { ccclass, property } = _decorator;

@ccclass('UILayer')
export class UILayer extends UIComp {

    public static async show(data?: any) {
        let prefab = await ResMgr.inst.loadPrefab(this.prefabUrl);
        const newNode = instantiate(prefab);
        let script = newNode.addComponent(this.name) as UILayer;
        script.setData(data);
        return script;
    }

    protected addToLayer() {
        BaseUT.setFitSize(this.node);
        this.node.setParent(SceneMgr.inst.curScene.layer);
    }
}


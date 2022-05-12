import { _decorator, Component, Node } from 'cc';
import { SceneMgr } from '../mgr/SceneMgr';
import { UIComp } from './UIComp';
const { ccclass, property } = _decorator;

@ccclass('UILayer')
export class UILayer extends UIComp {
    protected addToLayer(){
        this.node.setParent(SceneMgr.inst.layer.node);
    }
}


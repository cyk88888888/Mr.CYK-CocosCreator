import { _decorator, Component, Node } from 'cc';
import { SceneMgr } from '../mgr/SceneMgr';
import { UIComp } from './UIComp';
const { ccclass, property } = _decorator;

@ccclass('UIDlg')
export class UIDlg extends UIComp {
    protected addToLayer(){
        this.node.setParent(SceneMgr.inst.dlg.node);
    }
}


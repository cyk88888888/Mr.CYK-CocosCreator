import { _decorator, Component, Node } from 'cc';
import { LayerMgr } from '../mgr/LayerMgr';
import { Comp } from './Comp';
const { ccclass, property } = _decorator;

@ccclass('Dlg')
export class Dlg extends Comp {
    protected addToLayer(){
        this.node.setParent(LayerMgr.inst.dlg.node);
    }
}


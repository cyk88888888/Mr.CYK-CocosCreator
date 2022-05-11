import { _decorator, Component, Node } from 'cc';
import { LayerMgr } from '../mgr/LayerMgr';
import { Comp } from './Comp';
const { ccclass, property } = _decorator;

@ccclass('Layer')
export class Layer extends Comp {
    protected addToLayer(){
        this.node.setParent(LayerMgr.inst.layer.node);
    }
}


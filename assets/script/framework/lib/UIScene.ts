import { _decorator, Component, Node } from 'cc';
import { UIComp } from './UIComp';
const { ccclass, property } = _decorator;

@ccclass('UIScene')
export class UIScene extends UIComp {
    protected _mainLayerClass: any;
}


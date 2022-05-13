import { _decorator, Component, Node, resources, Prefab } from 'cc';
import { SceneMgr } from './framework/mgr/SceneMgr';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    onLoad() {
        SceneMgr.inst.pushScene('LoadingScene',{name:'红红火火恍恍惚惚'});
    }

}


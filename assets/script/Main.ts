/*
 * @Descripttion: 说明
 * @Author: CYK
 * @Date: 2022-05-13 09:40:14
 */
import { _decorator, Component, Node, resources, Prefab } from 'cc';
import { scaleMode } from './framework/base/ScaleMode';
import { SceneMgr } from './framework/mgr/SceneMgr';
import { SoundMgr } from './framework/mgr/SoundMgr';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    onLoad() {
        SoundMgr.inst.defaultBgMusic = "sound/bg00";//设置默认背景音乐
        SceneMgr.inst.mainScene = 'HomeScene';//设置主场景
        SoundMgr.inst.buttonSound = "sound/click";//设置全局按钮点击音效

        scaleMode.designWidth = 640;
        scaleMode.designHeight = 1280;
        scaleMode.designHeight_min = 1030;
        scaleMode.designHeight_max = 1280;

        SceneMgr.inst.run('LoadingScene', { name: '红红火火恍恍惚惚' });
    }

}


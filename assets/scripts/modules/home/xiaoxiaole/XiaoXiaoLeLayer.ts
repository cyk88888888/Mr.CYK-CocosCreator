/*
 * @Descripttion: 装备界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator, Component, Node, ProgressBar, Button, Label } from 'cc';
import { SoundMgr } from '../../../framework/mgr/SoundMgr';
import { UILayer } from '../../../framework/ui/UILayer';
const { ccclass, property } = _decorator;

@ccclass('XiaoXiaoLeLayer')
export class XiaoXiaoLeLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/XiaoXiaoLeLayer';
    protected onEnter() {
        SoundMgr.inst.playBg('dy/sound/anime_05_loop');
    }

    update(deltaTime: number) {
    }

}


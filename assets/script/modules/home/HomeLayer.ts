/*
 * @Descripttion: 主界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator, Button } from 'cc';
import { SoundMgr } from '../../framework/mgr/SoundMgr';
import { UILayer } from '../../framework/ui/UILayer';
import { JuHuaDlg } from '../common/JuHuaDlg';
const { ccclass, property } = _decorator;

@ccclass('HomeLayer')
export class HomeLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/HomeLayer';
    @property({ tooltip: "哈哈哈", type: Button })
    btn_test: Button;
    protected onEnter() {
        SoundMgr.inst.playMainBg();
    }

    update(deltaTime: number) {
    }

    private _tap_btn_test(evt) {
        console.log('点击测试~~~~~~');
    }
}


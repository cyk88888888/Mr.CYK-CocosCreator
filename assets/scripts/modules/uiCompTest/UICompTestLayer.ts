/*
 * @Descripttion: 商城界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { Button, _decorator} from 'cc';
import { UILayer } from '../../../../extensions/cocos-framework/src/ui/UILayer';
import { SceneMgr } from '../../../../extensions/cocos-framework/src/mgr/SceneMgr';
const { ccclass, property } = _decorator;

@ccclass('UICompTestLayer')
export class UICompTestLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/uiCompTest/UICompTestLayer';
    @property({ type: Button })
    private btn_back: Button;
    protected onEnter() {
    }

    private _tap_btn_back() {
        SceneMgr.inst.pop();
    }
}


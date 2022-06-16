/*
 * @Descripttion: 背包弹窗
 * @Author: CYK
 * @Date: 2022-05-12 09:23:41
 */
import { Button, Node, _decorator } from 'cc';
import { UIDlg } from '../../framework/ui/UIDlg';
const { ccclass, property } = _decorator;

@ccclass('BagDlg')
export class BagDlg extends UIDlg {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/bag/BagDlg';
    @property({ type: Button })
    private btn_close: Button;
    private onEnter() {
    }

    private _tap_btn_close() {
        this.close();
    }
}


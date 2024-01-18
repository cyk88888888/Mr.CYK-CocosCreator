/*
 * @Descripttion: db骨骼动画测试弹窗
 * @Author: CYK
 * @Date: 2022-05-12 09:23:41
 */
import { Button, _decorator } from 'cc';
import { UIDlg } from '../../../../extensions/cocos-framework/src/ui/UIDlg';
const { ccclass, property } = _decorator;

@ccclass('DBTestDlg')
export class DBTestDlg extends UIDlg {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/dbTest/DBTestDlg';
    @property({ type: Button })
    private btn_close: Button;

    protected ctor(): void {
        let self = this;
        self.outSideClosed = true;
    }
}


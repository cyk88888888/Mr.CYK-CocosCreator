/*
 * @Descripttion: db骨骼动画测试弹窗
 * @Author: CYK
 * @Date: 2022-05-12 09:23:41
 */
import { Button, EventTouch, Input, Node, Vec3, _decorator } from 'cc';
import { UIDlg } from '../../../../extensions/cocos-framework/src/ui/UIDlg';
const { ccclass, property } = _decorator;

@ccclass('DBTestDlg')
export class DBTestDlg extends UIDlg {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/dbTest/DBTestDlg';
    @property({ type: Node })
    roleClkArea: Node;
    @property({ type: Node })
    role: Node;
    @property({ type: Button })
    private btn_close: Button;
    private _rot = new Vec3();

    protected ctor(): void {
        let self = this;
        self.outSideClosed = true;
    }

    protected onEnter() {
        let self = this;
        self.roleClkArea.on(Input.EventType.TOUCH_MOVE, self._rotateRole, self);
        self._rot.set(this.role.eulerAngles);
    }

    private _rotateRole(event: EventTouch) {
        const y = event.getDeltaX();
        if (y > 0) {
            this._rot.y += 5;
        } else if (y < 0) {
            this._rot.y -= 5;
        }
        this.role.eulerAngles = this._rot;
        this._rot.set(this.role.eulerAngles);
    }

    protected onExit() {
        let self = this;
        self.roleClkArea.off(Input.EventType.TOUCH_MOVE, self._rotateRole, self);
    }
}


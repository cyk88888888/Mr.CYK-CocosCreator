/*
 * @Descripttion: 转圈等待
 * @Author: CYK
 * @Date: 2022-06-13 14:50:10
 */
import { Node, Quat, Vec3, _decorator } from 'cc';
import { UIMsg } from '../../framework/ui/UIMsg';
const { ccclass, property } = _decorator;

@ccclass('JuHuaDlg')
export class JuHuaDlg extends UIMsg {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/common/JuHuaDlg';
    @property(Node)
    private img_maskBg: Node;

    protected onEnter() {
        let self = this;
        self.img_maskBg.active = false;
        self.setTimeout(() => {
            self.img_maskBg.active = true;
            let img_Wait = self.img_maskBg.getChildByName('img_Wait');
            let quat: Quat = new Quat();
            Quat.fromEuler(quat, 0, 0, 360);
            self.getTween(img_Wait)
                .to(1, {
                    rotation: quat
                }                                 // 旋转缓动
                )
                .start();
        }, 4000);
    }
}


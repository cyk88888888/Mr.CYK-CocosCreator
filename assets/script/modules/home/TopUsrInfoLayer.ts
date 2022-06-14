/*
 * @Descripttion: 主界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator } from 'cc';
import { UIMenu } from '../../framework/ui/UIMenu';
const { ccclass, property } = _decorator;

@ccclass('TopUsrInfoLayer')
export class TopUsrInfoLayer extends UIMenu {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/TopUsrInfoLayer';
    private onEnter() {

    }

    update(deltaTime: number) {
    }
}


/*
 * @Descripttion: 甜品消消乐界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator, Component, Node, ProgressBar, Button, Label, UITransform, Prefab, instantiate, Vec2, Vec3 } from 'cc';
import { SoundMgr } from '../../../framework/mgr/SoundMgr';
import { TickMgr } from '../../../framework/mgr/TickMgr';
import { UILayer } from '../../../framework/ui/UILayer';
const { ccclass, property } = _decorator;

@ccclass('XiaoXiaoLeLayer')
export class XiaoXiaoLeLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/XiaoXiaoLeLayer';
    @property({ type: Node })
    public grp_grid: Node;
    @property({ type: Prefab })
    public gridPrefab: Prefab;
    protected onEnter() {
        SoundMgr.inst.playBg('dy/sound/anime_05_loop');
    }

    protected onFirstEnter() {
        let self = this;
        TickMgr.inst.nextTick(() => {
            self.initGrid();
        }, this)
    }

    private initGrid() {
        let self = this;
        let screenWh = self.screenWh;
        let width = screenWh[0];
        let height = screenWh[1];
        let gridW = 80, gridH = 78;
        let numCols = Math.floor(width / gridW);
        let numRows = Math.floor(height / gridH);
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                let grid = instantiate(self.gridPrefab);
                grid.setParent(self.grp_grid);
                grid.setPosition(new Vec3(-320 + (j+1)*gridW/2 + j * gridW / 2, 394 - (i+1)*gridH/2 - i * gridH / 2));
            }
        }
    }

    private get screenWh() {
        let self = this;
        let transform = self.grp_grid.getComponent(UITransform);
        return [transform.contentSize.width, transform.contentSize.height];
    }

}


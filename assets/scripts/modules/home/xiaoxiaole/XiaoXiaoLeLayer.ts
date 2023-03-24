/*
 * @Descripttion: 甜品消消乐界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator, Component, Node, ProgressBar, Button, Label, UITransform, Prefab, instantiate, Vec2, Vec3, Enum } from 'cc';
import { SoundMgr } from '../../../framework/mgr/SoundMgr';
import { TickMgr } from '../../../framework/mgr/TickMgr';
import { UILayer } from '../../../framework/ui/UILayer';
import { CONST } from '../../base/CONST';
const { ccclass, property } = _decorator;

@ccclass('XiaoXiaoLeLayer')
export class XiaoXiaoLeLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/XiaoXiaoLeLayer';
    @property({ type: Node })
    public grp_grid: Node;
    @property({ type: Prefab })
    public gridPrefab: Prefab;

    @property({type: [Prefab] }) 
    sweetPrefabs: Prefab[]=[];


    private _sweetPrefabMap:{[key: number]: Prefab};
    private _sweets: Prefab[][];
    private _gridPos: {[posKey: string]: Vec3};
    protected onEnter() {
        SoundMgr.inst.playBg('dy/sound/anime_05_loop');
    }

    protected onFirstEnter() {
        let self = this;
        let sweetTypes = [CONST.SweetType.NORMAL];
        self._gridPos = {};
        self._sweetPrefabMap = {};
        self._sweets = [];
        for(let i = 0; i < self.sweetPrefabs.length; i++){
            self._sweetPrefabMap[sweetTypes[i]] = self.sweetPrefabs[i];
        }
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
        let sweetW = 73, sweetH = 76;
        let numCols = Math.floor(width / gridW);
        let numRows = Math.floor(height / gridH);
        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numRows; j++) {
                let grid = instantiate(self.gridPrefab);
                grid.setParent(self.grp_grid);
                grid.setPosition(new Vec3(-width/2 + (i+1)*gridW/2 + i * gridW / 2, height/2 - (j+1)*gridH/2 - j * gridH / 2));
                self._gridPos[i+"_"+j] = grid.position;
            }
        }

        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numRows; j++) {
                let sweet = instantiate(self._sweetPrefabMap[CONST.SweetType.NORMAL]);
                sweet.setParent(self.grp_grid);
                sweet.setPosition(self._gridPos[i+"_"+j]);
                self._sweets[i+"_"+j] = sweet;
            }
        }
    }

    private get screenWh() {
        let self = this;
        let transform = self.grp_grid.getComponent(UITransform);
        return [transform.contentSize.width, transform.contentSize.height];
    }

}


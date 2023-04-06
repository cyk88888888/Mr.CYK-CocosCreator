import { _decorator, Component, EventTouch, instantiate, Node, Prefab, Vec2 } from 'cc';
import { UIComp } from '../../../framework/ui/UIComp';
import { AudioUtils } from '../UT/AudioUtils';
import { CellView } from './CellView';
import { CONST } from '../../base/CONST';
import { UITransform } from 'cc';
import { Vec3 } from 'cc';
import { XiaoXiaoleEffectLayer } from '../XiaoXiaoleEffectLayer';
const { ccclass, property } = _decorator;

@ccclass('GridView')
export class GridView extends UIComp {
    @property({ type: [Prefab] })
    aniPre: Prefab[] = [];
    @property({ type: Node })
    effectLayer: Node;
    @property({ type: AudioUtils })
    audioUtils: AudioUtils;

    isCanMove: boolean;
    isInPlayAni: boolean;
    lastTouchPos: Vec2;
    controller: any;
    cellViews: any[];
    protected onEnter(): void {
        let self = this;
        self.setListener();
        self.lastTouchPos = new Vec2(-1, -1);
        self.isCanMove = true;
        self.isInPlayAni = false; // 是否在播放中
    }

    setController(controller) {
        let self = this;
        self.controller = controller;
    }

    initWithCellModels(cellsModels) {
        let self = this;
        self.cellViews = [];
        for (let i = 1; i <= 9; i++) {
            self.cellViews[i] = [];
            for (let j = 1; j <= 9; j++) {
                let type = cellsModels[i][j].type;
                let aniView = instantiate(self.aniPre[type]);
                aniView.parent = self.node;
                let cellViewScript = aniView.getComponent(CellView);
                cellViewScript.initWithModel(cellsModels[i][j]);
                self.cellViews[i][j] = aniView;
            }
        }
    }

    setListener() {
        let self = this;
        self.node.on(Node.EventType.TOUCH_START, function (eventTouch: EventTouch) {
            if (self.isInPlayAni) {//播放动画中，不允许点击
                return true;
            }
            let touchPos = eventTouch.getLocation();
            let cellPos = self.convertTouchPosToCell(touchPos);
            if (cellPos) {
                let changeModels = self.selectCell(cellPos);
                self.isCanMove = changeModels.length < 3;
            }
            else {
                self.isCanMove = false;
            }
            return true;
        }, self);
        // 滑动操作逻辑
        self.node.on(Node.EventType.TOUCH_MOVE, function (eventTouch: EventTouch) {
            if (self.isCanMove) {
                let startTouchPos = eventTouch.getStartLocation();
                let startCellPos = self.convertTouchPosToCell(startTouchPos);
                let touchPos = eventTouch.getLocation();
                let cellPos = self.convertTouchPosToCell(touchPos);
                if (startCellPos.x != cellPos.x || startCellPos.y != cellPos.y) {
                    self.isCanMove = false;
                    let changeModels = self.selectCell(cellPos);
                }
            }
        }, self);
        self.node.on(Node.EventType.TOUCH_END, function (eventTouch: EventTouch) {
            // console.log("1111");
        }, self);
        self.node.on(Node.EventType.TOUCH_CANCEL, function (eventTouch: EventTouch) {
            // console.log("1111");
        }, self);
    }

    // 根据点击的像素位置，转换成网格中的位置
    convertTouchPosToCell(pos): { x, y } {
        let self = this;
        let nodePos = new Vec3();
        self.node.getComponent(UITransform).convertToNodeSpaceAR(pos, nodePos);
        if (nodePos.x < 0 || nodePos.x >= CONST.GRID_PIXEL_WIDTH || nodePos.y < 0 || nodePos.y >= CONST.GRID_PIXEL_HEIGHT) {
            return null;
        }
        let x = Math.floor(nodePos.x / CONST.CELL_WIDTH) + 1;
        let y = Math.floor(nodePos.y / CONST.CELL_HEIGHT) + 1;
        return { x: x, y: y };
    }

    // 移动格子
    updateView(changeModels) {
        let self = this;
        let newCellViewInfo = [];
        for (let i in changeModels) {
            let model = changeModels[i];
            let viewInfo = self.findViewByModel(model);
            let view = null;
            // 如果原来的cell不存在，则新建
            if (!viewInfo) {
                let type = model.type;
                let aniView = instantiate(self.aniPre[type]);
                aniView.parent = self.node;
                let cellViewScript = aniView.getComponent(CellView);
                cellViewScript.initWithModel(model);
                view = aniView;
            }
            // 如果已经存在
            else {
                view = viewInfo.view;
                self.cellViews[viewInfo.y][viewInfo.x] = null;
            }
            let cellScript = view.getComponent(CellView) as CellView;
            cellScript.updateView();// 执行移动动作
            if (!model.isDeath) {
                newCellViewInfo.push({
                    model: model,
                    view: view
                });
            }
        }
        // 重新标记this.cellviews的信息
        newCellViewInfo.forEach(function (ele) {
            let model = ele.model;
            self.cellViews[model.y][model.x] = ele.view;
        }, self);
    }

    // 显示选中的格子背景
    updateSelect(pos) {
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                if (this.cellViews[i][j]) {
                    let cellScript = this.cellViews[i][j].getComponent(CellView);
                    if (pos.x == j && pos.y == i) {
                        cellScript.setSelect(true);
                    }
                    else {
                        cellScript.setSelect(false);
                    }

                }
            }
        }
    }
    //根据cell的model返回对应的view
    findViewByModel(model) {
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                if (this.cellViews[i][j] && this.cellViews[i][j].getComponent(CellView).model == model) {
                    return { view: this.cellViews[i][j], x: j, y: i };
                }
            }
        }
        return null;
    }

    getPlayAniTime(changeModels) {
        let self = this;
        if (!changeModels) {
            return 0;
        }
        let maxTime = 0;
        changeModels.forEach(function (ele) {
            ele.cmd.forEach(function (cmd) {
                if (maxTime < cmd.playTime + cmd.keepTime) {
                    maxTime = cmd.playTime + cmd.keepTime;
                }
            }, self)
        }, self);
        return maxTime;
    }

    // 获得爆炸次数， 同一个时间算一个
    getStep(effectsQueue) {
        if (!effectsQueue) {
            return 0;
        }
        return effectsQueue.reduce(function (maxValue, efffectCmd) {
            return Math.max(maxValue, efffectCmd.step || 0);
        }, 0);
    }

    //一段时间内禁止操作
    disableTouch(time, step) {
        let self = this;
        if (time <= 0) {
            return;
        }
        self.isInPlayAni = true;
        self.setTimeout(function(){
            this.isInPlayAni = false;
            this.audioUtils.playContinuousMatch(step);
        }, time*1000);
    }

        // 正常击中格子后的操作
        selectCell(cellPos){
            let result = this.controller.selectCell(cellPos); // 直接先丢给model处理数据逻辑
            let changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子
            let effectsQueue = result[1]; //各种特效
            this.playEffect(effectsQueue);
            this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue));
            this.updateView(changeModels);
            this.controller.cleanCmd(); 
            if(changeModels.length >= 2){
                this.updateSelect(new Vec2(-1,-1));
                this.audioUtils.playSwap();
            }
            else{
                this.updateSelect(cellPos);
                this.audioUtils.playClick();
            }
            return changeModels;
        }
        playEffect(effectsQueue){
            this.effectLayer.getComponent(XiaoXiaoleEffectLayer).playEffects(effectsQueue);
        }
}

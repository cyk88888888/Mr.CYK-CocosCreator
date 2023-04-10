import { _decorator, Camera, Component, EventTouch, instantiate, Node, Prefab, Vec2 } from 'cc';
import { UIComp } from '../../../framework/ui/UIComp';
import { AudioUtils } from '../util/AudioUtils';
import { CellView } from './CellView';
import { CONST } from '../../base/CONST';
import { UITransform } from 'cc';
import { Vec3 } from 'cc';
import { XiaoXiaoLeLayer } from '../XiaoXiaoLeLayer';
import { SceneMgr } from '../../../framework/mgr/SceneMgr';
import { XiaoXiaoleEffectCtrl } from '../model/XiaoXiaoleEffectCtrl';
const { ccclass, property } = _decorator;

@ccclass('GridView')
export class GridView extends UIComp {
    @property({ type: [Prefab] })
    aniPre: Prefab[] = [];
    @property({ type: Node })
    effectLayer: Node;
    @property({ type: AudioUtils })
    audioUtils: AudioUtils;

    private isCanMove: boolean;
    private isInPlayAni: boolean;
    private controller: XiaoXiaoLeLayer;
    private cellViews: Node[][];
    protected onEnter(): void {
        let self = this;
        self.setListener();
        self.isCanMove = true;
        self.isInPlayAni = false; // 是否在播放中
    }

    public setController(controller: XiaoXiaoLeLayer) {
        let self = this;
        self.controller = controller;
    }

    public initWithCellModels(cellsModels) {
        let self = this;
        self.cellViews = [];
        for (let i = 1; i <= CONST.GRID_WIDTH; i++) {
            self.cellViews[i] = [];
            for (let j = 1; j <= CONST.GRID_HEIGHT; j++) {
                let type = cellsModels[i][j].type;
                let aniView = instantiate(self.aniPre[type]);
                aniView.parent = self.node;
                let cellViewScript = aniView.getComponent(CellView);
                cellViewScript.initWithModel(cellsModels[i][j]);
                self.cellViews[i][j] = aniView;
            }
        }
    }

    private setListener() {
        let self = this;
        self.node.on(Node.EventType.TOUCH_START, function (eventTouch: EventTouch) {
            if (self.isInPlayAni) {//播放动画中，不允许点击
                return true;
            }
            // 获取触点的位置，屏幕坐标
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
    convertTouchPosToCell(point): { x: number, y: number } {
        let self = this;
        // 屏幕坐标转为世界坐标
        let camera = SceneMgr.inst.getUCamera().getComponent(Camera);
        let world_point = camera.screenToWorld(new Vec3(point.x, point.y));
        // 世界坐标转节点坐标
        // 将一个点转换到节点 (局部) 空间坐标系，这个坐标系以锚点为原点。
        let nodePos = self.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(world_point.x, world_point.y));
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
        for (let i = 1; i <= CONST.GRID_WIDTH; i++) {
            for (let j = 1; j <= CONST.GRID_HEIGHT; j++) {
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
        for (let i = 1; i <= CONST.GRID_WIDTH; i++) {
            for (let j = 1; j <= CONST.GRID_HEIGHT; j++) {
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
    private disableTouch(time, step) {
        let self = this;
        if (time <= 0) {
            return;
        }
        self.isInPlayAni = true;
        self.setTimeout(function () {
            self.isInPlayAni = false;
            self.audioUtils.playContinuousMatch(step);
        }, time * 1000);
    }

    // 正常击中格子后的操作
    private selectCell(cellPos) {
        let self = this;
        let result = self.controller.selectCell(cellPos); // 直接先丢给model处理数据逻辑
        let changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子
        let effectsQueue = result[1]; //各种特效
        self.playEffect(effectsQueue);
        self.disableTouch(self.getPlayAniTime(changeModels), self.getStep(effectsQueue));
        self.updateView(changeModels);
        self.controller.cleanCmd();
        if (changeModels.length >= 2) {
            self.updateSelect(new Vec2(-1, -1));
            self.audioUtils.playSwap();
        }
        else {
            self.updateSelect(cellPos);
            self.audioUtils.playClick();
        }
        return changeModels;
    }

    private playEffect(effectsQueue) {
        this.effectLayer.getComponent(XiaoXiaoleEffectCtrl).playEffects(effectsQueue);
    }
}


import { Vec2 } from "cc";
import { CONST } from "../../base/CONST";

export class CellModel {
    public type: any;//CONST.CELL_TYPE;
    public status: CONST.CELL_STATUS;
    public x: number;
    public y: number;
    public startX: number;
    public startY: number;
    public cmd: any[];
    public isDeath: boolean;

    constructor() {
        this.type = null;
        this.status = CONST.CELL_STATUS.COMMON;
        this.x = 1;
        this.y = 1;
        this.startX = 1;
        this.startY = 1;
        this.cmd = [];
        this.isDeath = false;
    }

    public init(type:CONST.CELL_TYPE) {
        this.type = type;
    }

    public isEmpty() {
        return this.type == CONST.CELL_TYPE.EMPTY;
    }

    public setEmpty() {
        this.type = CONST.CELL_TYPE.EMPTY;
    }

    public setXY(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    public setStartXY(x:number, y:number) {
        this.startX = x;
        this.startY = y;
    }

    public setStatus(status:CONST.CELL_STATUS) {
        this.status = status;
    }

    public moveToAndBack(pos:Vec2) {
        var srcPos = new Vec2(this.x, this.y);
        this.cmd.push({
            action: "moveTo",
            keepTime: CONST.ANITIME.TOUCH_MOVE,
            playTime: 0,
            pos: pos
        });
        this.cmd.push({
            action: "moveTo",
            keepTime: CONST.ANITIME.TOUCH_MOVE,
            playTime: CONST.ANITIME.TOUCH_MOVE,
            pos: srcPos
        });
    }

    public moveTo(pos:Vec2, playTime:number) {
        this.cmd.push({
            action: "moveTo",
            keepTime: CONST.ANITIME.TOUCH_MOVE,
            playTime: playTime,
            pos: pos
        });
        this.x = pos.x;
        this.y = pos.y;
    }

    public toDie(playTime:number) {
        this.cmd.push({
            action: "toDie",
            playTime: playTime,
            keepTime: CONST.ANITIME.DIE
        });
        this.isDeath = true;
    }

    public toShake(playTime:number) {
        this.cmd.push({
            action: "toShake",
            playTime: playTime,
            keepTime: CONST.ANITIME.DIE_SHAKE
        });
    }

    public setVisible(playTime:number, isVisible:boolean) {
        this.cmd.push({
            action: "setVisible",
            playTime: playTime,
            keepTime: 0,
            isVisible: isVisible
        });
    }
}
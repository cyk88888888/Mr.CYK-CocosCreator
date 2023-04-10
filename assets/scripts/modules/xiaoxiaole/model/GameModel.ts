import { Vec2 } from "cc";
import { CONST } from "../../base/CONST";
import { CellModel } from "./CellModel";
import { exclusivePoint, mergePointArray } from "../util/ModelUtils";

export class GameModel {
  private cells: CellModel[][];
  private lastPos: Vec2;
  private cellTypeNum: number;
  private cellCreateType: any[];
  public changeModels: CellModel[];
  public effectsQueue: any[];
  curTime: number;
  constructor() {
    this.cells = null;
    this.lastPos = new Vec2(-1, -1);
    this.cellTypeNum = 5;
    this.cellCreateType = []; // 升成种类只在这个数组里面查找
  }

  public init(cellTypeNum: number) {
    this.cells = [];
    this.setCellTypeNum(cellTypeNum || this.cellTypeNum);
    for (var i = 1; i <= CONST.GRID_WIDTH; i++) {
      this.cells[i] = [];
      for (var j = 1; j <= CONST.GRID_HEIGHT; j++) {
        this.cells[i][j] = new CellModel();
      }
    }

    // this.mock();

    for (var i = 1; i <= CONST.GRID_WIDTH; i++) {
      for (var j = 1; j <= CONST.GRID_HEIGHT; j++) {
        //已经被mock数据生成了
        if (this.cells[i][j].type != null) {
          continue;
        }
        let flag = true;
        while (flag) {
          flag = false;

          this.cells[i][j].init(this.getRandomCellType());
          let result = this.checkPoint(j, i)[0];
          if (result.length > 2) {
            flag = true;
          }
          this.cells[i][j].setXY(j, i);
          this.cells[i][j].setStartXY(j, i);
        }
      }
    }
  }

  private mock() {
    this.mockInit(5, 1, CONST.CELL_TYPE.A);
    this.mockInit(5, 3, CONST.CELL_TYPE.A);
    this.mockInit(4, 2, CONST.CELL_TYPE.A);
    this.mockInit(3, 2, CONST.CELL_TYPE.A);
    this.mockInit(5, 2, CONST.CELL_TYPE.B);
    this.mockInit(6, 2, CONST.CELL_TYPE.B);
    this.mockInit(7, 3, CONST.CELL_TYPE.B);
    this.mockInit(8, 2, CONST.CELL_TYPE.A);
  }

  private mockInit(x:number, y:number, type:CONST.CELL_TYPE) {
    this.cells[x][y].init(type)
    this.cells[x][y].setXY(y, x);
    this.cells[x][y].setStartXY(y, x);
  }

  /**
   *
   * @param x
   * @param y
   * @param recursive 是否递归查找
   * @returns {([]|string|*)[]}
   */
  private checkPoint(x: number, y: number, recursive?: boolean) {
    let rowResult = this.checkWithDirection(x, y, [new Vec2(1, 0), new Vec2(-1, 0)]);
    let colResult = this.checkWithDirection(x, y, [new Vec2(0, -1), new Vec2(0, 1)]);
    let samePoints:Vec2[] = [];
    let newCellStatus = CONST.CELL_STATUS.EMPTY;
    if (rowResult.length >= 5 || colResult.length >= 5) {
      newCellStatus = CONST.CELL_STATUS.BIRD;
    }
    else if (rowResult.length >= 3 && colResult.length >= 3) {
      newCellStatus = CONST.CELL_STATUS.WRAP;
    }
    else if (rowResult.length >= 4) {
      newCellStatus = CONST.CELL_STATUS.LINE;
    }
    else if (colResult.length >= 4) {
      newCellStatus = CONST.CELL_STATUS.COLUMN;
    }
    if (rowResult.length >= 3) {
      samePoints = rowResult;
    }
    if (colResult.length >= 3) {
      samePoints = mergePointArray(samePoints, colResult);
    }
    let result = [samePoints, newCellStatus, this.cells[y][x].type, new Vec2(x, y)];
    // 检查一下消除的其他节点， 能不能生成更大范围的消除
    if (recursive && result.length >= 3) {
      let subCheckPoints = exclusivePoint(samePoints, new Vec2(x, y));
      for (let point of subCheckPoints) {
        let subResult = this.checkPoint(point.x, point.y, false);
        if (subResult[1] > result[1] || (subResult[1] === result[1] && subResult[0].length > result[0].length)) {
          result = subResult;
        }
      }
    }
    return result;
  }

  private checkWithDirection(x: number, y: number, direction: Vec2[]):Vec2[] {
    let queue = [];
    let vis = [];
    vis[x + y * 9] = true;
    queue.push(new Vec2(x, y));
    let front = 0;
    while (front < queue.length) {
      //let direction = [cc.v2(0, -1), cc.v2(0, 1), cc.v2(1, 0), cc.v2(-1, 0)];
      let point = queue[front];
      let cellModel = this.cells[point.y][point.x];
      front++;
      if (!cellModel) {
        continue;
      }
      for (let i = 0; i < direction.length; i++) {
        let tmpX = point.x + direction[i].x;
        let tmpY = point.y + direction[i].y;
        if (tmpX < 1 || tmpX > 9
          || tmpY < 1 || tmpY > 9
          || vis[tmpX + tmpY * 9]
          || !this.cells[tmpY][tmpX]) {
          continue;
        }
        if (cellModel.type === this.cells[tmpY][tmpX].type) {
          vis[tmpX + tmpY * 9] = true;
          queue.push(new Vec2(tmpX, tmpY));
        }
      }
    }
    return queue;
  }

  public getCells() {
    return this.cells;
  }

  // controller调用的主要入口
  // 点击某个格子
  public selectCell(pos: Vec2) {
    this.changeModels = [];// 发生改变的model，将作为返回值，给view播动作
    this.effectsQueue = []; // 动物消失，爆炸等特效
    var lastPos = this.lastPos;
    var delta = Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y);
    if (delta != 1) { //非相邻格子， 直接返回
      this.lastPos = pos;
      return [[], []];
    }
    let curClickCell = this.cells[pos.y][pos.x]; //当前点击的格子
    let lastClickCell = this.cells[lastPos.y][lastPos.x]; // 上一次点击的格式
    this.exchangeCell(lastPos, pos);
    var result1 = this.checkPoint(pos.x, pos.y)[0];
    var result2 = this.checkPoint(lastPos.x, lastPos.y)[0];
    this.curTime = 0; // 动画播放的当前时间
    this.pushToChangeModels(curClickCell);
    this.pushToChangeModels(lastClickCell);
    let isCanBomb = (curClickCell.status != CONST.CELL_STATUS.COMMON && // 判断两个是否是特殊的动物
      lastClickCell.status != CONST.CELL_STATUS.COMMON) ||
      curClickCell.status == CONST.CELL_STATUS.BIRD ||
      lastClickCell.status == CONST.CELL_STATUS.BIRD;
    if (result1.length < 3 && result2.length < 3 && !isCanBomb) {//不会发生消除的情况
      this.exchangeCell(lastPos, pos);
      curClickCell.moveToAndBack(lastPos);
      lastClickCell.moveToAndBack(pos);
      this.lastPos = new Vec2(-1, -1);
      return [this.changeModels];
    }
    else {
      this.lastPos = new Vec2(-1, -1);
      curClickCell.moveTo(lastPos, this.curTime);
      lastClickCell.moveTo(pos, this.curTime);
      var checkPoint = [pos, lastPos];
      this.curTime += CONST.ANITIME.TOUCH_MOVE;
      this.processCrush(checkPoint);
      return [this.changeModels, this.effectsQueue];
    }
  }
  // 消除
  private processCrush(checkPoint:Vec2[]) {
    let cycleCount = 0;
    while (checkPoint.length > 0) {
      let bombModels = [];
      if (cycleCount == 0 && checkPoint.length == 2) { //特殊消除
        let pos1 = checkPoint[0];
        let pos2 = checkPoint[1];
        let model1 = this.cells[pos1.y][pos1.x];
        let model2 = this.cells[pos2.y][pos2.x];
        if (model1.status == CONST.CELL_STATUS.BIRD || model2.status == CONST.CELL_STATUS.BIRD) {
          let bombModel = null;
          if (model1.status == CONST.CELL_STATUS.BIRD) {
            model1.type = model2.type;
            bombModels.push(model1);
          }
          else {
            model2.type = model1.type;
            bombModels.push(model2);
          }

        }
      }
      for (var i in checkPoint) {
        var pos = checkPoint[i];
        if (!this.cells[pos.y][pos.x]) {
          continue;
        }
        let [result, newCellStatus, newCellType, crushPoint] = this.checkPoint(pos.x, pos.y, true);

        if (result.length < 3) {
          continue;
        }
        for (let j in result) {
          var model = this.cells[result[j].y][result[j].x];
          this.crushCell(result[j].x, result[j].y, false, cycleCount);
          if (model.status != CONST.CELL_STATUS.COMMON) {
            bombModels.push(model);
          }
        }
        this.createNewCell(crushPoint, newCellStatus, newCellType);

      }
      this.processBomb(bombModels, cycleCount);
      this.curTime += CONST.ANITIME.DIE;
      checkPoint = this.down();
      cycleCount++;
    }
  }

  //生成新cell
  private createNewCell(pos:Vec2, status: CONST.CELL_STATUS, type: CONST.CELL_TYPE) {
    let self = this;
    if (status == CONST.CELL_STATUS.EMPTY) {
      return;
    }
    if (status == CONST.CELL_STATUS.BIRD) {
      type = CONST.CELL_TYPE.G;
    }
    let model = new CellModel();
    self.cells[pos.y][pos.x] = model
    model.init(type);
    model.setStartXY(pos.x, pos.y);
    model.setXY(pos.x, pos.y);
    model.setStatus(status);
    model.setVisible(0, false);
    model.setVisible(self.curTime, true);
    self.changeModels.push(model);
  }

  // 下落
  private down() {
    let self = this;
    let newCheckPoint = [];
    for (var i = 1; i <= CONST.GRID_WIDTH; i++) {
      for (var j = 1; j <= CONST.GRID_HEIGHT; j++) {
        if (self.cells[i][j] == null) {
          var curRow = i;
          for (var k = curRow; k <= CONST.GRID_HEIGHT; k++) {
            if (self.cells[k][j]) {
              self.pushToChangeModels(self.cells[k][j]);
              newCheckPoint.push(self.cells[k][j]);
              self.cells[curRow][j] = self.cells[k][j];
              self.cells[k][j] = null;
              self.cells[curRow][j].setXY(j, curRow);
              self.cells[curRow][j].moveTo(new Vec2(j, curRow), self.curTime);
              curRow++;
            }
          }
          var count = 1;
          for (var k = curRow; k <= CONST.GRID_HEIGHT; k++) {
            let newCell = new CellModel();
            newCell.init(self.getRandomCellType());
            newCell.setStartXY(j, count + CONST.GRID_HEIGHT);
            newCell.setXY(j, count + CONST.GRID_HEIGHT);
            newCell.moveTo(new Vec2(j, k), self.curTime);
            count++;
            self.changeModels.push(newCell);
            newCheckPoint.push(newCell);
            self.cells[k][j] = newCell;
          }
        }
      }
    }
    this.curTime += CONST.ANITIME.TOUCH_MOVE + 0.3
    return newCheckPoint;
  }

  private pushToChangeModels(model) {
    if (this.changeModels.indexOf(model) != -1) {
      return;
    }
    this.changeModels.push(model);
  }

  public cleanCmd() {
    for (var i = 1; i <= CONST.GRID_WIDTH; i++) {
      for (var j = 1; j <= CONST.GRID_HEIGHT; j++) {
        if (this.cells[i][j]) {
          this.cells[i][j].cmd = [];
        }
      }
    }
  }

  private exchangeCell(pos1: Vec2, pos2: Vec2) {
    var tmpModel = this.cells[pos1.y][pos1.x];
    this.cells[pos1.y][pos1.x] = this.cells[pos2.y][pos2.x];
    this.cells[pos1.y][pos1.x].x = pos1.x;
    this.cells[pos1.y][pos1.x].y = pos1.y;
    this.cells[pos2.y][pos2.x] = tmpModel;
    this.cells[pos2.y][pos2.x].x = pos2.x;
    this.cells[pos2.y][pos2.x].y = pos2.y;
  }

  // 设置种类
  // Todo 改成乱序算法
  private setCellTypeNum(num: number) {
    console.log("num = ", num);
    this.cellTypeNum = num;
    this.cellCreateType = [];
    let createTypeList = this.cellCreateType;
    for (let i = 1; i <= CONST.CELL_BASENUM; i++) {
      createTypeList.push(i);
    }
    for (let i = 0; i < createTypeList.length; i++) {
      let index = Math.floor(Math.random() * (CONST.CELL_BASENUM - i)) + i;
      createTypeList[i], createTypeList[index] = createTypeList[index], createTypeList[i]
    }
  }

  // 随要生成一个类型
  private getRandomCellType() {
    var index = Math.floor(Math.random() * this.cellTypeNum);
    return this.cellCreateType[index];
  }

  // TODO bombModels去重
  private processBomb(bombModels:any[], cycleCount:number) {
    let self = this;
    while (bombModels.length > 0) {
      let newBombModel = [];
      let bombTime = CONST.ANITIME.BOMB_DELAY;
      bombModels.forEach(function (model) {
        if (model.status == CONST.CELL_STATUS.LINE) {
          for (let i = 1; i <= CONST.GRID_WIDTH; i++) {
            if (self.cells[model.y][i]) {
              if (self.cells[model.y][i].status != CONST.CELL_STATUS.COMMON) {
                newBombModel.push(self.cells[model.y][i]);
              }
              self.crushCell(i, model.y, false, cycleCount);
            }
          }
          self.addRowBomb(self.curTime, new Vec2(model.x, model.y));
        }
        else if (model.status == CONST.CELL_STATUS.COLUMN) {
          for (let i = 1; i <= CONST.GRID_HEIGHT; i++) {
            if (self.cells[i][model.x]) {
              if (self.cells[i][model.x].status != CONST.CELL_STATUS.COMMON) {
                newBombModel.push(self.cells[i][model.x]);
              }
              self.crushCell(model.x, i, false, cycleCount);
            }
          }
          self.addColBomb(self.curTime, new Vec2(model.x, model.y));
        }
        else if (model.status == CONST.CELL_STATUS.WRAP) {
          let x = model.x;
          let y = model.y;
          for (let i = 1; i <= CONST.GRID_HEIGHT; i++) {
            for (let j = 1; j <= CONST.GRID_WIDTH; j++) {
              let delta = Math.abs(x - j) + Math.abs(y - i);
              if (self.cells[i][j] && delta <= 2) {
                if (self.cells[i][j].status != CONST.CELL_STATUS.COMMON) {
                  newBombModel.push(self.cells[i][j]);
                }
                self.crushCell(j, i, false, cycleCount);
              }
            }
          }
        }
        else if (model.status == CONST.CELL_STATUS.BIRD) {
          let crushType = model.type
          if (bombTime < CONST.ANITIME.BOMB_BIRD_DELAY) {
            bombTime = CONST.ANITIME.BOMB_BIRD_DELAY;
          }
          if (crushType == CONST.CELL_TYPE.G) {
            crushType = this.getRandomCellType();
          }
          for (let i = 1; i <= CONST.GRID_HEIGHT; i++) {
            for (let j = 1; j <= CONST.GRID_WIDTH; j++) {
              if (this.cells[i][j] && this.cells[i][j].type == crushType) {
                if (this.cells[i][j].status != CONST.CELL_STATUS.COMMON) {
                  newBombModel.push(this.cells[i][j]);
                }
                this.crushCell(j, i, true, cycleCount);
              }
            }
          }
          //this.crushCell(model.x, model.y);
        }
      }, this);
      if (bombModels.length > 0) {
        this.curTime += bombTime;
      }
      bombModels = newBombModel;
    }
  }
  /**
   * 
   * @param {开始播放的时间} playTime 
   * @param {*cell位置} pos 
   * @param {*第几次消除，用于播放音效} step 
   */
  private addCrushEffect(playTime: number, pos: Vec2, step: number) {
    this.effectsQueue.push({
      playTime,
      pos,
      action: "crush",
      step
    });
  }

  private addRowBomb(playTime: number, pos: Vec2) {
    this.effectsQueue.push({
      playTime,
      pos,
      action: "rowBomb"
    });
  }

  private addColBomb(playTime: number, pos: Vec2) {
    this.effectsQueue.push({
      playTime,
      pos,
      action: "colBomb"
    });
  }

  private addWrapBomb(playTime: number, pos: Vec2) {
    // TODO
  }

  // cell消除逻辑
  private crushCell(x: number, y: number, needShake: boolean, step: number) {
    let model = this.cells[y][x];
    this.pushToChangeModels(model);
    if (needShake) {
      model.toShake(this.curTime)
    }

    let shakeTime = needShake ? CONST.ANITIME.DIE_SHAKE : 0;
    model.toDie(this.curTime + shakeTime);
    this.addCrushEffect(this.curTime + shakeTime, new Vec2(model.x, model.y), step);
    this.cells[y][x] = null;
  }
}
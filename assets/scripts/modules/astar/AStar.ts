
import { _decorator } from 'cc';
import { Grid } from './Grid';
import { Nodes } from './Nodes';
const { ccclass, property } = _decorator;


@ccclass('AStar')
export class AStar {

    private _open: Nodes[];//开放列表
    private _closed: Nodes[];//封闭列表
    private _grid: Grid;
    private _endNode: Nodes;//终点
    private _startNode: Nodes;//起点
    private _path: Nodes[];//最终的路径节点
    private _heuristic: Function = this.manhattan;
    // private _heuristic:Function = this.euclidian;
    // private _heuristic: Function = this.diagonal; //估计公式
    private _straightCost: number = 10; //直线代价
    private _diagCost: number = 14;//对角线代价(不用Math.SQRT2，使用整数计算提高计算速度)
    private _startCalculateTime: number;//计算本次寻路的开始时间
    public costTotTime: number;//计算本次寻路的总耗时
    private _size = 0;//角色大小，单位：圈（以指定格子为中心的圈）

    /** 判断节点是否开放列表*/
    private isOpen(node: Nodes): boolean {
        let self = this;
        return self._open.indexOf(node) > -1;
    }

    /**判断节点是否封闭列表*/
    private isClosed(node: Nodes): boolean {
        let self = this;
        return self._closed.indexOf(node) > -1;
    }

    /**
     * 对指定的网络寻找路径
     * @param grid 格子数据
     * @param size 角色大小，单位：圈（以指定格子为中心的圈）
     * @returns 
     */
    public findPath(grid: Grid, size?: number): boolean {
        let self = this;
        self._grid = grid;
        self._open = [];
        self._closed = [];
        self._startNode = self._grid.startNode;
        self._endNode = self._grid.endNode;
        self._startNode.g = 0;
        self._startNode.h = self._heuristic(self._startNode);
        self._startNode.f = self._startNode.g + self._startNode.h;
        self._startCalculateTime = self.getTime();
        self._size = size;
        return self.search();
    }

    /**计算周围节点代价的关键处理函数*/
    public search(): boolean {
        let self = this;
        let _t: number = 1;
        let node: Nodes = self._startNode;
        //如果当前节点不是终点
        while (node != self._endNode) {
            //找出相邻节点的x,y范围
            let startX = Math.max(0, node.x - 1);
            let endX = Math.min(self._grid.numCols - 1, node.x + 1);
            let startY = Math.max(0, node.y - 1);
            let endY = Math.min(self._grid.numRows - 1, node.y + 1);

            //循环处理所有相邻节点
            for (let i = startX; i <= endX; i++) {
                for (let j = startY; j <= endY; j++) {
                    let test: Nodes = self._grid.getNode(i, j);
                    //如果是当前节点，或者是不可通过的，且排除水平和垂直方向都是障碍物节点时的特例情况
                    if (test == node || !test.walkable || !self._grid.getNode(node.x, test.y).walkable || !self._grid.getNode(test.x, node.y).walkable) {
                        continue;
                    }

                    if (!self.isNeighborOffsetAvailable(test)) continue;

                    let cost: number = self._straightCost;
                    //如果是对象线，则使用对角代价
                    if (!((node.x == test.x) || (node.y == test.y))) {
                        cost = self._diagCost;
                    }

                    //计算test节点的总代价
                    let g: number = node.g + cost * test.costMultiplier;
                    let h: number = self._heuristic(test);
                    let f: number = g + h;


                    //如果该点在open或close列表中
                    if (self.isOpen(test) || self.isClosed(test)) {
                        //如果本次计算的代价更小，则以本次计算为准
                        if (f < test.f) {
                            // console.log("\n第", _t, "轮，有节点重新指向，x=", i, "，y=", j, "，g=", g, "，h=", h, "，f=", f, "，test=",test.toString());
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = node;//重新指定该点的父节点为本轮计算中心点
                        }
                    } else//如果还不在open列表中，则除了更新代价以及设置父节点，还要加入open数组
                    {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = node;
                        self._open.push(test);
                    }
                }
            }
            self._closed.push(node);//把处理过的本轮中心节点加入close节点

            //辅助调试，输出open数组中都有哪些节点
            // for (let i = 0; i < self._open.length; i++) {
            //    console.log(self._open[i].toString());
            // }

            if (self._open.length == 0) {
                // Message.show("没找到最佳节点，无路可走!");
                console.log("没找到最佳节点，无路可走!");
                let totTime = self.getTime() - self._startCalculateTime;
                self.costTotTime = totTime;
                console.log("本次寻路计算总耗时: " + totTime + "ms");
                return false;
            }
            self._open.sort((a: Nodes, b: Nodes) => a.f - b.f);//按总代价从小到大排序
            node = self._open.shift() as Nodes;//从open数组中删除代价最小的结节，同时把该节点赋值为node，做为下次的中心点
            // console.log("第", _t, "轮取出的最佳节点为：", node.toString());
            _t++;
        }
        //循环结束后，构建路径
        self.buildPath();
        return true;
    }

    /** 根据父节点指向，从终点反向连接到起点*/
    private buildPath() {
        let self = this;
        self._path = [];
        let node: Nodes = self._endNode;
        self._path.push(node);
        while (node != self._startNode) {
            node = node.parent;
            self._path.unshift(node);
        }
        self._path.shift();//第一个点是当前位置的，先移除
        //第一阶段优化： 对横，竖，正斜进行优化
        //把多个节点连在一起的，横向或者斜向的一连串点，除两边的点保留
        for (var i: number = 1; i < self._path.length - 1; i++) {
            var preNode: Nodes = self._path[i - 1];
            var midNode: Nodes = self._path[i];
            var nextNode: Nodes = self._path[i + 1];

            var bool1: Boolean = midNode.x == preNode.x && midNode.x == nextNode.x;
            var bool2: Boolean = midNode.y == preNode.y && midNode.y == nextNode.y;
            var bool3: Boolean = false;

            //寻路类型是8方向时才考虑正斜角路径优化
            bool3 = ((midNode.x - preNode.x) / (midNode.y - preNode.y)) * ((nextNode.x - midNode.x) / (nextNode.y - midNode.y)) == 1;
            if (bool1 || bool2 || bool3) {
                self._path.splice(i, 1);
                i--;
            }
        }

        // //第二阶段优化：对不在横，竖，正斜的格子进行优化
        // for (var i: number = 0; i < self._path.length - 2; i++) {
        //     var startNode: Nodes = self._path[i];
        //     var optimizeNode: Nodes = null;

        //     //优先从尾部对比，如果能直达就把中间多余的路点删掉
        //     for (var j: number = self._path.length - 1; j > i + 1; j--) {
        //         var targetNode: Nodes = self._path[j];

        //         //在第一阶段优已经优化过横，竖，正斜了，所以再出现是肯定不能优化的，可以忽略
        //         if (startNode.x == targetNode.x || startNode.y == targetNode.y || Math.abs(targetNode.x - startNode.x) == Math.abs(targetNode.y - startNode.y)) {
        //             continue;
        //         }

        //         if (this.isArriveBetweenTwoNodes(startNode, targetNode)) {
        //             optimizeNode = targetNode;
        //             break;
        //         }

        //     }

        //     if (optimizeNode) {
        //         var optimizeLen: number = j - i - 1;
        //         self._path.splice(i + 1, optimizeLen);
        //     }

        // }
        let totTime = self.getTime() - self._startCalculateTime;
        self.costTotTime = totTime;
        console.log("本次寻路计算总耗时: " + totTime + "ms");
    }

    /** 当前节点是否能容纳角色*/
    private isNeighborOffsetAvailable(node: Nodes) {
        let self = this;
        if (!self._size) return true;
        let startX = node.x - self._size;
        let endX = node.x + self._size;
        let startY = node.y - self._size;
        let endY = node.y + self._size;
        if (startX < 0 || endX > self._grid.numCols - self._size || startY < 0 || endY > self._grid.numRows - self._size) {//是否超出地图范围
            return false;
        }
        for (let i = startX; i <= endX; i++) {
            for (let j = startY; j <= endY; j++) {
                let test: Nodes = self._grid.getNode(i, j);
                if (!test.walkable) return false;
            }
        }
        return true;
    }

    /**
     * 两点之间是否可到达
     */
    public isArriveBetweenTwoNodes(startNode: Nodes, targetNode: Nodes): boolean {
        if (startNode == targetNode) {
            return false;
        }

        var disX: number = Math.abs(targetNode.x - startNode.x);
        var disY: number = Math.abs(targetNode.y - startNode.y);

        var dirX = 0;

        if (targetNode.x > startNode.x) {
            dirX = 1;
        } else if (targetNode.x < startNode.x) {
            dirX = -1;
        }

        var dirY = 0;

        if (targetNode.y > startNode.y) {
            dirY = 1;
        } else if (targetNode.y < startNode.y) {
            dirY = -1;
        }

        var rx: number = 0;
        var ry: number = 0;
        var intNum: number = 0;
        var decimal: number = 0;

        if (disX > disY) {
            var rate: number = disY / disX;

            for (var i = 0; i < disX; i++) {
                ry = startNode.y + i * dirY * rate;
                intNum = Math.floor(ry);
                decimal = ry % 1;

                var cx1: number = startNode.x + i * dirX;
                var cy1: number = decimal <= 0.5 ? intNum : intNum + 1;

                ry = startNode.y + (i + 1) * dirY * rate;
                intNum = Math.floor(ry);
                decimal = ry % 1;

                var cx2: number = startNode.x + (i + 1) * dirX;
                var cy2: number = decimal <= 0.5 ? intNum : intNum + 1;

                var node1: Nodes = this._grid.getNode(cx1, cy1);
                var node2: Nodes = this._grid.getNode(cx2, cy2);

                //cc.log(i + "  :: " + node1.cy," yy ",startNode.cy + i * rate,ry % 1);

                if (!this.isCrossAtAdjacentNodes(node1, node2)) {
                    return false;
                }
            }

        } else {
            var rate: number = disX / disY;

            for (var i = 0; i < disY; i++) {
                rx = i * dirX * rate;
                intNum = dirX > 0 ? Math.floor(startNode.x + rx) : Math.ceil(startNode.x + rx);
                decimal = Math.abs(rx % 1);

                var cx1: number = decimal <= 0.5 ? intNum : intNum + 1 * dirX;
                var cy1: number = startNode.y + i * dirY;

                rx = (i + 1) * dirX * rate;
                intNum = dirX > 0 ? Math.floor(startNode.x + rx) : Math.ceil(startNode.x + rx);
                decimal = Math.abs(rx % 1);

                var cx2: number = decimal <= 0.5 ? intNum : intNum + 1 * dirX;
                var cy2: number = startNode.y + (i + 1) * dirY;

                var node1: Nodes = this._grid.getNode(cx1, cy1);
                var node2: Nodes = this._grid.getNode(cx2, cy2);

                if (!this.isCrossAtAdjacentNodes(node1, node2)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
    * 判断两个相邻的点是否可通过
    * @param node1 
    * @param node2 
    */
    private isCrossAtAdjacentNodes(node1: Nodes, node2: Nodes): boolean {
        if (node1 == node2) {
            return false;
        }

        //两个点只要有一个点不能通过就不能通过
        if (!this.isPassNode(node1) || !this.isPassNode(node2)) {
            return false;
        }

        var dirX = node2.x - node1.x;
        var dirY = node2.y - node1.y

        //如果不是相邻的两个点 则不能通过
        if (Math.abs(dirX) > 1 || Math.abs(dirY) > 1) {
            return false;
        }

        //如果相邻的点是在同一行，或者同一列，则判定为可通过
        if ((node1.x == node2.x) || (node1.y == node2.y)) {
            return true;
        }

        //只剩对角情况了
        if (
            this.isPassNode(this._grid.getNode(node1.x, node1.y + dirY)) &&
            this.isPassNode(this._grid.getNode((node1.x + dirX), node1.y))
        ) {
            return true;
        }

        return false;
    }

    /**
     * 是否是可通过的点 
     * @param node 
     */
    public isPassNode(node: Nodes): boolean {
        if (node == null || !node.walkable) {
            return false;
        }

        return true;
    }


    /** 获取当前时间(毫秒)*/
    private getTime() {
        return new Date().getTime();
    }
    /** 曼哈顿估价法*/
    private manhattan(node: Nodes): number {
        let self = this;
        return Math.abs(node.x - self._endNode.x) * self._straightCost + Math.abs(node.y - self._endNode.y) * self._straightCost;
    }

    /** 几何估价法*/
    private euclidian(node: Nodes): number {
        let self = this;
        let dx: number = node.x - self._endNode.x;
        let dy: number = node.y - self._endNode.y;
        return Math.sqrt(dx * dx + dy * dy) * self._straightCost;
    }

    /** 对角线估价法*/
    private diagonal(node: Nodes): number {
        let self = this;
        let dx = Math.abs(node.x - self._endNode.x);
        let dy = Math.abs(node.y - self._endNode.y);
        let diag = Math.min(dx, dy);
        let straight = dx + dy;
        return self._diagCost * diag + self._straightCost * (straight - 2 * diag);
    }

    /** 返回所有被计算过的节点(辅助函数)*/
    public get visited(): Nodes[] {
        let self = this;
        return self._closed.concat(self._open);
    }

    /** 返回open数组*/
    public get openArray(): Nodes[] {
        let self = this;
        return self._open;
    }

    /** 返回close数组*/
    public get closedArray(): Nodes[] {
        let self = this;
        return self._closed;
    }

    public get path(): Nodes[] {
        let self = this;
        return self._path;
    }

}



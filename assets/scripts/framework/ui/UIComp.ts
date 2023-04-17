import { _decorator, Component, Node, Tween, tween, EventTouch, js } from 'cc';
import { emmiter } from '../base/Emmiter';
import { SoundMgr } from '../mgr/SoundMgr';
import List from '../uiComp/List';
const { ccclass, property } = _decorator;

@ccclass('UIComp')
export class UIComp extends Component {
    private _emmitMap: { [event: string]: Function };//已注册的监听事件列表
    private _objTapMap: { [objName: string]: Node };//已添加的显示对象点击事件的记录
    private _tweenTargetList: any[];//已添加缓动的对象列表
    public data: any;
    private isFirstEnter: boolean = true;
    /** 预制体路径 */
    public static prefabUrl: string = '';
    public hasDestory: boolean;//是否已被销毁
    /** 脚本类名**/
    public scriptName: string;
    private _allList: Node[];
    protected needRefreshListOnEnter: boolean = true;

    onLoad() {
        this.scriptName = this.name.match(/<(\S*)>/)[1];
        // console.log('onLoad: ' + this.scriptName);
    }

    onEnable() {
        let self = this;
        self.initView();
    }

    onDisable() {
        let self = this;
        self._dispose();
    }

    onDestroy() {
        // console.log('onDestroy: ' + this.scriptName);
    }

    protected onEnter_b() { }

    protected onEnter() { }

    protected onFirstEnter() { }

    protected onEnter_a() { }

    protected dchg() { }

    protected onExit_b() { }

    protected onExit() { }

    protected onExit_a() { }

    protected onEmitter(event: string, listener: any) {
        let self = this;
        emmiter.on(event, listener, self);
        if (!self._emmitMap) self._emmitMap = {};
        self._emmitMap[event] = listener;
    }

    protected unEmitter(event: string, listener: any) {
        let self = this;
        emmiter.off(event, listener, self);
    }

    protected emit(event: string, data?: any) {
        emmiter.emit(event, data)
    }

    public static get __className(): string {
        return this.name;
    }

    public setData(data: any) {
        this.data = data;
        if (data) this.dchg();
    }

    /**
     * 初始化view
     */
    private initView() {
        let self = this;
        if (self.hasDestory) return;
        self.addListener();
        console.log('进入' + self.scriptName);
        self.onEnter_b();
        self.onEnter();
        if (self.isFirstEnter) {
            self.isFirstEnter = false;
            self.onFirstEnter();
        }
        self.onEnter_a();
        self.refreshAllList();
    }

    /**添加事件监听**/
    private addListener() {
        let self = this;
        self._objTapMap = {};
        for (let objName in self) {
            let obj = self[objName];
            if (!obj) continue;
            let eventFuncName = "_tap_" + objName;
            if (self[eventFuncName] && (obj instanceof Component || obj instanceof Node)) {
                let eventName = Node.EventType.TOUCH_END;
                let node = obj instanceof Component ? obj.node : obj;
                node.on(eventName, self.onNodeClick, self);
                self._objTapMap[eventFuncName + '&' + eventName] = node;
            }
        }
    }

    private onNodeClick(event: EventTouch) {
        let self = this;
        SoundMgr.inst.playClickSound();
        let eventFuncName = "_tap_" + event.currentTarget.name;
        self[eventFuncName](event);
    }

    /**刷新所有列表 */
    private refreshAllList() {
        let self = this;
        if (!self.needRefreshListOnEnter) return;
        //todo...
    }

    /** 刷新指定列表*/
    protected refreshList(id: string) {
        let self = this;
        let listNode:Node = self[id];
        if (!listNode) {
            console.warn(`找不到id为${id}的列表`);
            return;
        }
        let list = listNode.getComponent(List);
        if(!list) return console.warn(`列表${id}没有绑定List脚本`);
        list.renderEvent.target
    }

    /**获取指定对象的缓动Tweener */
    protected getTween(target: Node): Tween<Node> {
        if (!this._tweenTargetList) {
            this._tweenTargetList = [];
        }
        if (this._tweenTargetList.indexOf(target) == -1) this._tweenTargetList.push(target);
        return tween(target);
    }

    /**清除指定对象的缓动Tweener */
    protected rmTween(target: Node) {
        Tween.stopAllByTarget(target);
    }

    /**清除所有对象的缓动 */
    private rmAllTweens() {
        if (this._tweenTargetList) {
            for (let i = 0; i < this._tweenTargetList.length; i++) {
                this.rmTween(this._tweenTargetList[i]);
            }
        }
        this._tweenTargetList = null;
    }

    private timeoutIdArr: number[];
    protected setTimeout(cb: () => void, timeout: number) {
        if (!this.timeoutIdArr) this.timeoutIdArr = [];
        let timeoutId = setTimeout(() => {
            cb.call(this);
        }, timeout);
        this.timeoutIdArr.push(timeoutId);
        return timeoutId;
    }

    private intervalIdArr: number[];
    protected setInterval(cb: () => void, timeout: number) {
        if (!this.intervalIdArr) this.intervalIdArr = [];
        let intervalId = setInterval(() => {
            cb.call(this);
        }, timeout);
        this.intervalIdArr.push(intervalId);
        return intervalId;
    }

    /**
     * 清除所有的setTimeout和setInterval定时器
     */
    protected clearAllTimeoutOrInterval() {
        let self = this;
        if (self.timeoutIdArr) {
            for (let i = 0; i < self.timeoutIdArr.length; i++) {
                clearTimeout(self.timeoutIdArr[i]);
            }
            self.timeoutIdArr = null;
            console.log('清除timeoutIdArr: ' + self.scriptName);
        }

        if (self.intervalIdArr) {
            for (let i = 0; i < self.intervalIdArr.length; i++) {
                clearInterval(self.intervalIdArr[i]);
            }
            self.intervalIdArr = null;
            console.log('清除intervalIdArr: ' + self.scriptName);
        }
    }

    protected destory() {
        let self = this;
        if (self.hasDestory) return;
        self._allList = null;
        this.node.destroy();
        self.hasDestory = true;
    }

    private _dispose() {
        let self = this;
        if (self._emmitMap) {
            for (let event in self._emmitMap) {
                self.unEmitter(event, self._emmitMap[event]);
            }
            self._emmitMap = null;
        }

        if (self._objTapMap) {
            for (let key in self._objTapMap) {
                let splitKey = key.split('&');
                let eventFuncName = splitKey[0];
                let eventName = splitKey[1];
                let obj = self._objTapMap[key];
                obj.off(eventName, self.onNodeClick, self);
            }
            self._objTapMap = null;
        }

        if (self['offBgMaskClick']) self['offBgMaskClick']();//清除背景灰色遮罩点击事件

        self.clearAllTimeoutOrInterval();
        self.rmAllTweens();

        console.log('退出' + self.scriptName);
        self.onExit_b();
        self.onExit();
        self.onExit_a();
    }
}


/*
 * @Descripttion: 背包弹窗
 * @Author: CYK
 * @Date: 2022-05-12 09:23:41
 */
import { Button, instantiate, Label, Node, Prefab, Vec3, _decorator } from 'cc';
import { UIDlg } from '../../framework/ui/UIDlg';
import { ImgLoader } from '../../framework/uiComp/ImgLoader';
import { List } from '../../framework/uiComp/List';
const { ccclass, property } = _decorator;

@ccclass('BagDlg')
export class BagDlg extends UIDlg {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/bag/BagDlg';
    @property({ type: Button })
    private btn_close: Button;
    @property({type: List})
    private list_bag: List;
    @property(Label)
    curPage: Label = null;

    private totalItemNum: number = 90;  //总Item数
    private pagePreNum: number = 12;    //每页Item数量
    protected onEnter() {
        let self = this;
        self._pageChange_list_bag(1);
    }

    private _data_list_bag(){
        let self = this;
        let rst = [];
        let pageTotalNum = Math.ceil(self.totalItemNum / self.pagePreNum);//总页数
        let count = 0;
        for(let i = 0; i < pageTotalNum; i++){
            rst[i] = [];
            for(let j = 0; j < self.pagePreNum; j++){
                count++;
                rst[i].push({ icon: count > self.totalItemNum ? "" : "dy/icon/i" + Math.floor(Math.random() * 10), count: Math.floor(Math.random() * 100) , index: count});
            }
        }
        return rst;
    }

    private _pageChange_list_bag(pageNum: number){
        this.curPage.string = '当前页数：' + (pageNum + 1);
    }

    private _tap_btn_close() {
        this.close();
    }
}


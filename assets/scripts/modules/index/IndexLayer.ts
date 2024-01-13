import { _decorator, Node, ProgressBar } from 'cc';
import { HomeLayer } from '../home/HomeLayer';
import { HomeScene } from '../home/HomeScene';
import { TopUsrInfoLayer } from '../home/TopUsrInfoLayer';
import { BottomTabLayer } from '../home/BottomTabLayer';
import { UILayer } from '../../../../extensions/cocos-framework/src/ui/UILayer';
import { ResMgr } from '../../../../extensions/cocos-framework/src/mgr/ResMgr';
import { SceneMgr } from '../../../../extensions/cocos-framework/src/mgr/SceneMgr';
const { ccclass, property } = _decorator;
/** 
 * @Descripttion 首页
 * @Author CYK
 * @Date 2022-05-16 09:18:45
 */
@ccclass('IndexLayer')
export class IndexLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/index/IndexLayer';
    @property({ type: ProgressBar })
    private progressBar: ProgressBar;
    private _isLoadingHome: boolean;

    private _preResList: string[];
    private _toPercent: number;
    protected onEnter() {
        let self = this;
        self._preResList = ['ui/common', HomeLayer.prefabUrl, TopUsrInfoLayer.prefabUrl, BottomTabLayer.prefabUrl];
        let curDownLoadNum: number = 0;//当前已下载个数
        let initPercent = self._toPercent = 0.5;//默认加载到50%
        ResMgr.inst.loadToWithItor('HomeScene', self._preResList, () => {
            curDownLoadNum++;
            self._toPercent = initPercent + (curDownLoadNum / self._preResList.length) * 0.5;
        });
    }

    update(dt: number) {
        let self = this;
        if (self.progressBar && self.progressBar.progress < self._toPercent) {
            self.progressBar.progress += 0.009;
            if (!self._isLoadingHome && self.progressBar.progress >= 1) {
                self._isLoadingHome = true;
                SceneMgr.inst.run(HomeScene);
            }
        }
    }
}


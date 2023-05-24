/*
 * @Descripttion: 转圈等待
 * @Author: CYK
 * @Date: 2022-06-13 14:50:10
 */
import { Component, Node, Prefab, _decorator, director, instantiate, resources, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JuHuaDlg')
export class JuHuaDlg extends Component {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/common/JuHuaDlg';
    @property(Node)
    private img_maskBg: Node;

    private _tid: number;
    onLoad() {
        let self = this;
        self.img_maskBg.active = false;
        self._tid = setTimeout(() => {
            self.img_maskBg.active = true;
            let img_wait = self.img_maskBg.getChildByName('img_wait');
            tween(img_wait)
                .to(1, {
                    angle: 360,
                })
                .set({ angle: 0 })
                .union()
                .repeatForever()
                .start();
        }, 4000);
    }

    onDestroy() {
        let self = this;
        clearTimeout(self._tid);
    }

    public static async show() {
        let prefabPath = JuHuaDlg.prefabUrl; 
        let prefab = await new Promise<Prefab>((resolve, reject) => {
            let cachePrefab = resources.get(prefabPath);
            if (cachePrefab) {
                console.log('resName: ' + prefabPath + '加载完毕(缓存已有)');
                return resolve(cachePrefab as Prefab);
            } else {
                resources.load(prefabPath, Prefab, (err, prefab) => {
                    if (!err) {
                        console.log('resName: ' + prefabPath + '加载完毕');
                        resolve(prefab);
                    } else {
                        console.log('resName: ' + prefabPath + '加载失败');
                        reject(err);
                    }
                });
            }
        })
        let node = instantiate(prefab);
        let _canvas = director.getScene().getChildByName('Canvas');
        node.setParent(_canvas);
        return node;
    }
}



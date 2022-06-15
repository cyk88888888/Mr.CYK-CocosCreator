/*
 * @Descripttion: 图片Sprite加载组件
 * @Author: CYK
 * @Date: 2022-06-15 17:01:50
 */
import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { ResMgr } from '../mgr/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('ImgLoader')
export class ImgLoader extends Component {
    // @property({type: String, tooltip:'图片url地址'})
    // public url: string = '';

    private _sprite: Sprite;
    private _url: string;
    onLoad(){
        let self = this;
        self._sprite = this.node.getComponent(Sprite);
        if(!self._sprite) self._sprite = this.node.addComponent(Sprite);
    }

    public set url(value: string){
        let self = this;
        if(self._url == value) return;
        self._url = value;
        let spriteFrameUrl = value + '/spriteFrame';
        ResMgr.inst.loadWithoutJuHua(spriteFrameUrl, function(){
            let spriteFrame = <SpriteFrame>ResMgr.inst.get(spriteFrameUrl);
            if(spriteFrame) self._sprite.spriteFrame = spriteFrame;
        }, self)
       
    }
}


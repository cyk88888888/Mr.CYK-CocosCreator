import { _decorator, AudioClip, Component, Node } from 'cc';
import { SoundMgr } from '../../../../../extensions/cocos-framework/src/mgr/SoundMgr';
const { ccclass, property } = _decorator;
/** 
 * @Descripttion 开心消消乐音效管理
 * @Author CYK
 * @Date 2023-04-3 23:45:45
 */
@ccclass('AudioUtils')
export class AudioUtils extends Component {
    @property({ type: AudioClip })
    private swap: AudioClip;

    @property({ type: AudioClip })
    private click: AudioClip;

    @property({ type: [AudioClip] })
    private eliminate: AudioClip[] = [];

    @property({ type: [AudioClip] })
    private continuousMatch: AudioClip[] = [];

    public playClick(){
        SoundMgr.inst.playSoundByAudioClip(this.click);
    }
    public playSwap (){
        SoundMgr.inst.playSoundByAudioClip(this.swap);
    }
    public playEliminate(step){
        step = Math.min(this.eliminate.length - 1, step);
        SoundMgr.inst.playSoundByAudioClip(this.eliminate[step]);
    }

    public playContinuousMatch(step){
        console.log("step = ", step);
        step = Math.min(step, 11);
        if(step < 2){
            return 
        }
        SoundMgr.inst.playSoundByAudioClip(this.continuousMatch[Math.floor(step/2) - 1]);
    }

}


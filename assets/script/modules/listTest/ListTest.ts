import { _decorator, Component, Node } from 'cc';
import List from '../../framework/uiComp/list/List';
const { ccclass, property } = _decorator;

@ccclass('ListTest')
export class ListTest extends Component {
      //垂直列表
      @property(List)
      listV: List = null;
      //数据数组（所有List共用）
      data: number[] = [];
      onLoad() {
          this.data = [];
          for (let n: number = 0; n < 999; n++) {
              this.data.push(n);
          }
          this.listV.numItems = this.data.length;
      }

    update(deltaTime: number) {
        
    }
}


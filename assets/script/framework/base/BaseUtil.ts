/*
 * @Description: 
 * @Author: CYK
 * @Date: 2022-05-19 11:39:05
 */
import { Layers, Node, screen, Size, UIOpacity, UITransform, view } from "cc";
import { scaleMode } from "./ScaleMode";
export namespace BaseUT {
    /** 获取宽度适配下屏幕的视图宽高*/
    export function getWindowSize() {
        let size = screen.windowSize;
        size.width /= view.getScaleX();
        size.height /= view.getScaleY();
        return size;
    }

    export function getLayerScaleSize(){
        let windowSize = BaseUT.getWindowSize();
        let designHeight = windowSize.height < scaleMode.designHeight_max ? windowSize.height : scaleMode.designHeight_max;
        return new Size(windowSize.width, designHeight);
    }
    /**
     * 根据屏幕宽高自适应设置comp大小
     * @param comp 
     * @returns 
     */
    export function setFitSize(node: Node) {
        let scaleSize = BaseUT.getLayerScaleSize();
        let uiTransform = node.getComponent(UITransform);
        uiTransform.setContentSize(scaleSize.width,scaleSize.height);
        return scaleSize;
    }

    export function newUINode(name?: string) {
        let newNode = new Node(name);
        newNode.addComponent(UITransform);
        newNode.addComponent(UIOpacity);
        newNode.layer = Layers.Enum.UI_2D;
        return newNode;
    }
}
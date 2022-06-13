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
    /**
     * 根据屏幕宽高自适应设置comp大小
     * @param comp 
     * @returns 
     */
    export function setFitSize(node: Node): Size {
        let windowSize = this.getWindowSize();
        let designHeight = windowSize.height < scaleMode.designHeight_max ? windowSize.height : scaleMode.designHeight_max;
        let uiTransform = node.getComponent(UITransform);
        uiTransform.setContentSize(scaleMode.designWidth, designHeight);
        return new Size(windowSize.width, designHeight);
    }

    export function newUINode(name?: string) {
        let newNode = new Node(name);
        newNode.addComponent(UITransform);
        newNode.addComponent(UIOpacity);
        newNode.layer = Layers.Enum.UI_2D;
        return newNode;
    }
}
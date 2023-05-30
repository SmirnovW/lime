import { MouseEvent, useContext, useState } from 'react';
import { CanvasContext } from 'context/canvas-context/canvas-context';
import { ActiveLayerContext } from 'context/active-layer-context/active-layer-context';
import { ToolbarContext } from 'context/toolbar-context/toolbar-context';
import { TOOLS } from 'constants/tools';
import { TextEditorContext } from 'context/text-editor-context/text-editor-context';
import { getTransformedPoint } from 'utils/geometry';
import { TYPES } from 'canvas/enums';

export function useCanvasOnMove(isMousePressed: boolean) {
	const { setEditable } = useContext(TextEditorContext);
	const { renderer, renderingManager } = useContext(CanvasContext);
	const { activeLayer } = useContext(ActiveLayerContext);
	const { tool } = useContext(ToolbarContext);
	const [startPosition, setStartPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [timerId, setTimerId] = useState<number>(0);

	return function (event: MouseEvent) {
		if (renderer) {
			if (isMousePressed) {
				clearTimeout(timerId);
				setTimerId(0);
			}

			const currentTransformedPosition = getTransformedPoint(
				event.pageX,
				event.pageY,
				renderer.getTransform()
			);
			let pageX = currentTransformedPosition.x;
			let pageY = currentTransformedPosition.y;

			if (isMousePressed && activeLayer && tool === TOOLS.LINE) {
				let isLineAttached = false;
				let attachedTo = null;
				for (let layer of renderingManager?.getLayers()) {
					if (layer.isPointInside(pageX, pageY)) {
						const meta = layer.getMeta();
						const { commanderId = null } = activeLayer.getMeta();

						if (
							layer.getId() !== commanderId &&
							Boolean(meta?.isReceiver)
						) {
							const rect = layer.getChildByType(TYPES.RECT);
							const [x] = rect?.getXY();
							pageX = x;
							isLineAttached = true;
							attachedTo = layer;
							break;
						} else {
							isLineAttached = false;
							attachedTo = null;
						}
					}
				}

				activeLayer.compositeResize(pageX, pageY);
				activeLayer.addMeta({ isLineAttached, attachedTo });
				renderingManager?.reDraw();
			}

			if (isMousePressed && tool === TOOLS.SELECT) {
				if (activeLayer) {
					setEditable(false);
					const { x, y, w, h } = activeLayer.getOptions();
					activeLayer.move(
						event.movementX,
						event.movementY,
						pageX,
						pageY,
						{
							layerX: x,
							layerY: y,
							layerW: w,
							layerH: h,
						}
					);
					renderingManager?.reDraw();
				}
			}

			if (isMousePressed && tool === TOOLS.HAND) {
				if (startPosition === null) {
					setStartPosition({ x: pageX, y: pageY });
				}

				if (startPosition !== null) {
					renderer
						.getContext()
						.translate(
							pageX - startPosition.x,
							pageY - startPosition.y
						);
					renderingManager?.reDraw();
				}
			}
			if (isMousePressed) {
				const timerId = setTimeout(() => {
					setStartPosition(null);
					document.dispatchEvent(new CustomEvent('moving-stopped'));
				}, 100);
				// @ts-ignore
				setTimerId(timerId);
			}
		}
	};
}

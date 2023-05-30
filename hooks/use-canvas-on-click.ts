import { MouseEvent, useContext } from 'react';
import { TOOLS } from 'constants/tools';
import { useCreateBlockTool } from 'hooks/use-create-block-tool';
import { useSelectTool } from 'hooks/use-select-tool';
import { useHandTool } from 'hooks/use-hand-tool';
import { CanvasContext } from 'context/canvas-context/canvas-context';
import { ToolbarContext } from 'context/toolbar-context/toolbar-context';
import { getTransformedPoint } from 'utils/geometry';
import { CanvasLine } from 'canvas/canvas-line/canvas-line';
import { ActiveLayerContext } from 'context/active-layer-context/active-layer-context';
import { TYPES } from 'canvas/enums';
import { Layer } from 'canvas/layer';
import { SMALL_PADDING } from 'constants/paddings';
import { CanvasRect } from 'canvas/canvas-rect/canvas-rect';

export function useCanvasOnClick() {
	const { tool, setTool } = useContext(ToolbarContext);
	const { renderer, renderingManager } = useContext(CanvasContext);
	const { activeLayer, setActiveLayer } = useContext(ActiveLayerContext);
	const createSticker = useCreateBlockTool();
	const selectTool = useSelectTool();
	const handTool = useHandTool();

	return function (event: MouseEvent) {
		event.preventDefault();
		if (renderer) {
			const currentTransformedPosition = getTransformedPoint(
				event.pageX,
				event.pageY,
				renderer.getTransform()
			);
			const pageX = currentTransformedPosition.x;
			const pageY = currentTransformedPosition.y;
			createSticker({ pageX, pageY });

			if (tool === TOOLS.SELECT) {
				selectTool({ pageX, pageY });
			}

			if (tool === TOOLS.HAND) {
				handTool({ pageX, pageY });
			}

			if (tool === TOOLS.LINE) {
				if (renderingManager) {
					if (activeLayer && activeLayer.getType() === TYPES.LINE) {
					} else {
						const rectStart = new CanvasRect({
							x: pageX,
							y: pageY,
							w: 10,
							h: 10,
							scale: 1,
							color: '#000',
						});

						const rectEnd = new CanvasRect({
							x: pageX,
							y: pageY,
							w: 10,
							h: 10,
							scale: 1,
							color: '#000',
						});
						const line = new CanvasLine({
							color: '#000',
							scale: 1,
							coordinates: [
								{ x: pageX, y: pageY },
								{ x: pageX, y: pageY },
							],
						});

						const layer = new Layer({
							x: pageX,
							y: pageY,
							w: 10,
							h: 10,
							scale: 1,
							padding: SMALL_PADDING,
						});
						layer.addChild(rectStart);
						layer.addChild(line);
						layer.addChild(rectEnd);
						renderingManager.add(layer);
						setActiveLayer(layer);
					}
				}
			}
		}
	};
}

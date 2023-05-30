import { MouseEvent, useContext } from 'react';
import { TOOLS } from 'constants/tools';
import { CanvasContext } from 'context/canvas-context/canvas-context';
import { ToolbarContext } from 'context/toolbar-context/toolbar-context';
import { ActiveLayerContext } from 'context/active-layer-context/active-layer-context';
import { TYPES } from 'canvas/enums';
import { getTransformedPoint } from 'utils/geometry';
import { LayerInterface } from 'canvas/layer';
import { CanvasLine } from 'canvas/canvas-line/canvas-line';

export function useCanvasOnMouseUp() {
	const { tool, setTool } = useContext(ToolbarContext);
	const { renderer, renderingManager } = useContext(CanvasContext);
	const { activeLayer, setActiveLayer } = useContext(ActiveLayerContext);

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

			if (activeLayer && tool === TOOLS.LINE) {
				const meta = activeLayer?.getMeta();
				if (Boolean(meta?.isLineAttached)) {
					if (meta?.attachedTo) {
						(meta?.attachedTo as LayerInterface).attach(
							activeLayer,
							'onmove',
							{ segment: 'end' },
							'segmentedMove'
						);
						activeLayer.setOptions({ movable: false });
					}
				} else {
					renderingManager?.remove(activeLayer);
				}
				setActiveLayer(null);
				setTool(TOOLS.SELECT);
			}
		}
	};
}

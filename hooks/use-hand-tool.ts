import { useContext } from 'react';
import { CanvasContext } from 'context/canvas-context/canvas-context';

export function useHandTool() {
	const { renderingManager } = useContext(CanvasContext);

	return function ({ pageX, pageY }: MouseData) {
		const layer = renderingManager?.findLayerByCoordinates(pageX, pageY);

		if (layer && renderingManager) {
			//const type = layer.getType();
		}
	};
}

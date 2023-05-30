import { useContext } from 'react';
import { ActiveLayerContext } from 'context/active-layer-context/active-layer-context';
import { CanvasContext } from 'context/canvas-context/canvas-context';
import { TextEditorContext } from 'context/text-editor-context/text-editor-context';
import { useSaveText } from 'hooks/use-save-text';
import { DEFAULT_FONT_SIZE } from 'constants/font';
import { TYPES } from 'canvas/enums';

export function useSelectTool() {
	const { activeLayer, setActiveLayer } = useContext(ActiveLayerContext);
	const { renderingManager } = useContext(CanvasContext);
	const {
		setTextAlign,
		setText,
		setEditable,
		setFontSize,
		setBold,
		setItalic,
	} = useContext(TextEditorContext);
	const saveText = useSaveText();

	return function ({ pageX, pageY }: MouseData) {
		if (!activeLayer) {
			const layer = renderingManager?.findLayerByCoordinates(
				pageX,
				pageY
			);

			if (layer) {
				const triangle = layer.getChildByType(TYPES.TRIANGLE);
				layer.setActive(true);
				setActiveLayer(layer);
				renderingManager?.reDraw();
			}
		} else {
			if (!activeLayer.isPointInside(pageX, pageY)) {
				const layer = renderingManager?.findLayerByCoordinates(
					pageX,
					pageY
				);

				if (layer) {
					layer.setActive(true);
					activeLayer.setActive(false);
					setActiveLayer(layer);
				} else {
					activeLayer.setActive(false);
					setActiveLayer(null);
				}
				saveText();
				setText('');
				setFontSize(DEFAULT_FONT_SIZE);
				setBold(false);
				setItalic(false);
				setTextAlign('left');
				setEditable(false);
				renderingManager?.reDraw();
			} else {
				const layers =
					renderingManager?.findMultipleLayersByCoordinates(
						pageX,
						pageY
					);

				if (layers && layers.length > 1) {
					let index = layers.length;
					let activeLayerIndex = 0;
					for (const layer of layers) {
						if (layer.getId() === activeLayer.getId()) {
							activeLayerIndex = index;
						}
						if (layer.getId() !== activeLayer.getId()) {
							if (
								index > activeLayerIndex ||
								index === activeLayerIndex
							) {
								layer.setActive(true);
								activeLayer.setActive(false);
								setActiveLayer(layer);
								renderingManager?.reDraw();
								break;
							}
						}
						index -= 1;
					}
				}
			}
		}
	};
}

import { useContext } from 'react';
import { CanvasContext } from 'context/canvas-context/canvas-context';
import { CanvasRect } from 'canvas/canvas-rect/canvas-rect';
import { CanvasText } from 'canvas/canvas-text';
import { ActiveLayerContext } from 'context/active-layer-context/active-layer-context';
import { TextEditorContext } from 'context/text-editor-context/text-editor-context';
import { COLORS } from 'constants/colors';

export function useCreateTextTool() {
	const { renderer, renderingManager } = useContext(CanvasContext);
	const { activeLayer } = useContext(ActiveLayerContext);
	const { text, fontSize, textAlign, bold, italic } =
		useContext(TextEditorContext);

	return function () {
		if (renderer && renderingManager) {
			const sticker = activeLayer?.getChildByType<CanvasRect>([
				'rect',
				'rounded-rect',
			]);
			if (activeLayer && sticker) {
				const [x, y] = sticker.getXY();
				const scale = sticker.getScale();
				let style = '';
				if (italic) style = `${style} italic`;
				if (bold) style = `${style} bold`;

				const canvasText = new CanvasText({
					x,
					y,
					text,
					scale,
					color: COLORS.FONT,
					fontSize,
					textAlign,
					style,
					canvasScale: window.devicePixelRatio,
					w: 200,
					h: 200,
				});

				activeLayer?.addChild(canvasText);
			}
		}
	};
}

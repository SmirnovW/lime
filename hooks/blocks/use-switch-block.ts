import { CanvasText } from 'canvas/canvas-text';
import { LARGE_PADDING, SMALL_PADDING } from 'constants/paddings';
import { COLORS } from 'constants/colors';
import { CanvasRect } from 'canvas/canvas-rect/canvas-rect';
import { CanvasTriangle } from 'canvas/canvas-triangle/canvas-triangle';
import { Layer } from 'canvas/layer';
import { LinearLayer } from 'canvas/linear-layer';
import { CanvasLine } from 'canvas/canvas-line/canvas-line';
import { TOOLS } from 'constants/tools';
import { useContext } from 'react';
import { CanvasContext } from 'context/canvas-context';
import { ActiveLayerContext } from 'context/active-layer-context/active-layer-context';
import { ToolbarContext } from 'context/toolbar-context/toolbar-context';
import { loadImage } from 'utils/resources';
import { CanvasImage } from 'canvas/canvas-image/canvas-image';
import cat from 'assets/cat-solid-24.png';

export function useSwitchBlock() {
	const { renderer, renderingManager } = useContext(CanvasContext);
	const { setActiveLayer } = useContext(ActiveLayerContext);
	const { setTool } = useContext(ToolbarContext);

	return async function (pageX: number, pageY: number) {
		if (renderer && renderingManager) {
			const imageSource = await loadImage(cat.src);

			const image = new CanvasImage({
				x: pageX + 100 / 2 - cat.width / 4,
				y: pageY + 100 / 2 - cat.height / 4,
				w: cat.width / 2,
				h: cat.height / 2,
				image: imageSource as CanvasImageSource,
				scale: 1,
			});

			const canvasText = new CanvasText({
				x: pageX - LARGE_PADDING - 20,
				y: pageY - LARGE_PADDING - 30,
				text: 'CASE Switch Data',
				scale: 1,
				color: COLORS.FONT,
				fontSize: 16,
				textAlign: 'center',
				style: '',
				canvasScale: window.devicePixelRatio,
				w: 170,
				h: 100,
			});

			const canvasSticker = new CanvasRect({
				x: pageX,
				y: pageY,
				w: 100,
				h: 100,
				color: COLORS.SWITCH_BLOCK,
				scale: 1,
			});

			const triangleRight = new CanvasTriangle({
				x: pageX + 100,
				y: pageY,
				w: 10,
				h: 10,
				color: COLORS.FONT,
				scale: 1,
			});

			const layer = new Layer({
				x: pageX,
				y: pageY,
				w: 100 + 10,
				h: 100 + 10,
				scale: 1,
				padding: SMALL_PADDING,
			});

			layer.addMeta({ isReceiver: true });

			triangleRight.onMove((movementX, movementY, x = 0, y = 0) => {
				if (triangleRight.isPointInside(x, y)) {
					const { center } = triangleRight.getCoordinates();
					const lineLayer = new LinearLayer({
						x: center.x,
						y: center.y,
						w: 10,
						h: 10,
						scale: 1,
						padding: SMALL_PADDING,
					});

					lineLayer.addMeta({ commanderId: layer.getId() });

					const line = new CanvasLine({
						color: '#000',
						scale: 1,
						coordinates: [
							{ x: center.x, y: center.y },
							{ x: center.x, y: center.y },
						],
					});
					const arrowRight = new CanvasTriangle({
						x: center.x,
						y: center.y,
						w: 5,
						h: 5,
						color: COLORS.FONT,
						scale: 1,
					});

					arrowRight.addMeta({ type: 'arrow' });

					layer.attach(
						lineLayer,
						'onmove',
						{ segment: 'start' },
						'segmentedMove'
					);

					lineLayer.addChild(line);
					lineLayer.addChild(arrowRight);
					renderingManager.add(lineLayer);
					layer.setActive(false);
					setActiveLayer(lineLayer);
					setTool(TOOLS.LINE);
				}
			});

			layer.addChild(canvasSticker);
			layer.addChild(triangleRight);
			layer.addChild(image);
			layer.addChild(canvasText);
			renderingManager.add(layer);
			setTool(TOOLS.SELECT);
		}
	};
}

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
import { CanvasImage } from 'canvas/canvas-image/canvas-image';
import dog from 'assets/dog-solid-24.png';
import { loadImage } from 'utils/resources';

export function useGeneratorBlock() {
	const { renderer, renderingManager } = useContext(CanvasContext);
	const { setActiveLayer } = useContext(ActiveLayerContext);
	const { setTool } = useContext(ToolbarContext);

	return async function (pageX: number, pageY: number) {
		if (renderer && renderingManager) {
			const imageSource = await loadImage(dog.src);

			const image = new CanvasImage({
				x: pageX + 100 / 2 - dog.width / 4,
				y: pageY + 100 / 2 - dog.height / 4,
				w: dog.width / 2,
				h: dog.height / 2,
				image: imageSource as CanvasImageSource,
				scale: 1,
			});

			const canvasText = new CanvasText({
				x: pageX - LARGE_PADDING - 10,
				y: pageY - LARGE_PADDING - 30,
				text: 'Data Generator',
				scale: 1,
				color: COLORS.FONT,
				fontSize: 16,
				textAlign: 'center',
				style: '',
				canvasScale: window.devicePixelRatio,
				w: 150,
				h: 100,
			});

			const canvasSticker = new CanvasRect({
				x: pageX,
				y: pageY,
				w: 100,
				h: 100,
				color: COLORS.STICKER_BACKGROUND,
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
			layer.addChild(image);
			layer.addChild(triangleRight);
			layer.addChild(canvasText);
			renderingManager.add(layer);
			setTool(TOOLS.SELECT);
		}
	};
}

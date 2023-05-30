import { Layer } from 'canvas/layer';
import { TYPES } from 'canvas/enums';
import { SMALL_PADDING } from 'constants/paddings';
import { CanvasObjectInterface } from 'canvas/canvas-object';
import { CanvasTriangle } from 'canvas/canvas-triangle/canvas-triangle';
import { CanvasLine } from 'canvas/canvas-line/canvas-line';

export class LinearLayer extends Layer {
	segmentedMove(event: string, data: any) {
		const { x, y, w, h, padding = 0 } = this.options;
		if (data.meta.segment === 'start') {
			const layerX = x + data.movementX;
			const layerY = y + data.movementY;

			this.setXY(layerX, layerY);

			let layerW = w - data.movementX;
			let layerH = h - data.movementY;
			this.setWidthHeight(layerW, layerH);

			this.getChildren().forEach((child) => {
				if (child.getType() !== TYPES.TRIANGLE) {
					child.move(data.movementX, data.movementY, 0, 0, {
						segment: 'start',
					});
				}
			});
		}

		if (data.meta.segment === 'end') {
			const { x, y, w, h } = this.options;

			let layerW = w + data.movementX;
			let layerH = h + data.movementY;

			this.setWidthHeight(layerW, layerH);

			this.moveChildrenAccordingly(data.movementX, data.movementY, 0, 0, {
				segment: 'end',
				layerW,
				layerH,
				layerY: y,
				layerX: x,
			});
			/*
			this.getChildren().forEach((child) => {
				child.move(data.movementX, data.movementY, 0, 0, {
					segment: 'end',
					layerW,
					layerH,
				});
			});
*/
		}
	}
}

import { CanvasObject } from 'canvas/canvas-object';
import { TYPES } from 'canvas/enums';
import { isPointInTriangle } from 'utils/geometry';

export class CanvasTriangle extends CanvasObject<TriangleDrawOptions> {
	resizable: boolean = true;

	constructor(options: TriangleDrawOptions) {
		super(options);
		this.setType(TYPES.TRIANGLE);
		const { x, y, w, h } = options;

		this.resizable = Boolean(options?.resizable);
	}

	compositeResize(pageX: number, pageY: number) {
		if (this.resizable) {
			super.compositeResize(pageX, pageY);
		} else {
			const [x, y] = this.getXY();
			const [w, h] = this.getWidthHeight();

			let nextX = x + (pageX - x) - w;

			let nextY = y + (pageY - y) - h;

			this.setXY(nextX, nextY);
		}
	}

	/*	compositeResize(pageX: number, pageY: number) {
		const [x, y] = this.getXY();
		const [w, h] = this.getWidthHeight();
		this.setCoordinates([
			{ x: pageX + 10, y: pageY },
			{ x: pageX, y: pageY + 10 },
			{ x: pageX, y: pageY - 10 },
		]);
	}*/

	getCoordinates(): TriangleCoordinatesType {
		const [x, y] = this.getXY();
		const [w, h] = this.getWidthHeight();
		return {
			top: { x, y },
			center: { x: x + w, y: y + h },
			bottom: { x, y: y + h * 2 },
		};
	}

	move(
		movementX: number,
		movementY: number,
		pageX: number = 0,
		pageY: number = 0,
		meta = null
	) {
		const localMeta = this.getMeta();
		console.log('meta', localMeta);
		if (meta !== null) {
			const [x, y] = this.getXY();

			const [w, h] = this.getWidthHeight();
			const { center } = this.getCoordinates();

			const offsetY = localMeta?.type === 'arrow' ? movementY : 0;
			const offsetX = localMeta?.type === 'arrow' ? movementX : 0;

			const diffBetweenYAndParentHeight =
				meta.layerY + meta.layerH - center.y - offsetY;

			const diffBetweenXAndParentHeight =
				meta.layerX + meta.layerW - center.x - offsetX;

			if (meta.layerH < 0 && diffBetweenYAndParentHeight > 0) {
				this.setXY(x, y + diffBetweenYAndParentHeight * 2);
			}

			if (meta.layerH > 0 && diffBetweenYAndParentHeight < 0) {
				this.setXY(x, y - diffBetweenYAndParentHeight * -2);
			}

			if (meta.layerW < 0 && diffBetweenXAndParentHeight > 0) {
				this.setXY(x + diffBetweenXAndParentHeight * 2, y);
			}

			if (meta.layerW > 0 && diffBetweenXAndParentHeight < 0) {
				this.setXY(x - diffBetweenXAndParentHeight * -2, y);
			}
			/*


			if (meta.layerH > 0 && diffBetweenYAndParentHeight < 0) {
				this.setXY(x, y - diffBetweenYAndParentHeight * -1);
			}
*/
		}
		super.move(movementX, movementY, pageX, pageY, meta);
	}

	/*	move(movementX: number, movementY: number, x?: number, y?: number) {
		const { top, center, bottom } = this.coordinates;

		top.x = top.x + movementX;
		top.y = top.y + movementY;

		center.x = center.x + movementX;
		center.y = center.y + movementY;

		bottom.x = bottom.x + movementX;
		bottom.y = bottom.y + movementY;

		this.setCoordinates({ top, center, bottom });

		if (this.onMoveHandler !== null) {
			this.onMoveHandler(movementX, movementY, x, y);
		}
	}*/

	isPointInside(
		pointX: number,
		pointY: number,
		padding: number = 0
	): boolean {
		const coordinates = this.getCoordinates();
		return isPointInTriangle(coordinates, { x: pointX, y: pointY });
	}

	update(event: string, data: any) {
		this.move(data.movementX, data.movementY);
	}
}

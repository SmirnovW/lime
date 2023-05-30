import { CanvasObject } from 'canvas/canvas-object';
import { TYPES } from 'canvas/enums';
import { SMALL_PADDING } from 'constants/paddings';

export class CanvasLine extends CanvasObject<LineDrawOptions> {
	constructor(options: LineDrawOptions) {
		super(options);

		this.setType(TYPES.LINE);
	}

	private currentSegment: string = 'both';

	compositeResize(pageX: number, pageY: number) {
		const [start] = this.getCoordinates<LineDrawOptions>();

		this.setCoordinates([start, { x: pageX, y: pageY }]);
	}

	move(
		movementX: number,
		movementY: number,
		x: number = 0,
		y: number = 0,
		meta = null
	) {
		const { coordinates } = this.getOptions<LineDrawOptions>();
		const [start, end] = coordinates;
		let currentSegment = 'both';
		if (meta !== null && meta.segment) {
			currentSegment = meta.segment;
		}

		if (currentSegment === 'both' || currentSegment === 'start') {
			start.x = start.x + movementX;
			start.y = start.y + movementY;
		}

		if (currentSegment === 'both' || currentSegment === 'end') {
			end.x = end.x + movementX;
			end.y = end.y + movementY;
		}

		const diffBetweenLineWAndParentWidth =
			meta.layerX + meta.layerW - end.x;

		if (meta.layerW < 0 && diffBetweenLineWAndParentWidth > 0) {
			end.x += diffBetweenLineWAndParentWidth * 2;
		}

		if (meta.layerW > 0 && diffBetweenLineWAndParentWidth < 0) {
			end.x -= diffBetweenLineWAndParentWidth * -2;
		}

		const diffBetweenLineYAndParentHeight =
			meta.layerY + meta.layerH - end.y;

		if (meta.layerH < 0 && diffBetweenLineYAndParentHeight > 0) {
			end.y += diffBetweenLineYAndParentHeight * 2;
		}

		if (meta.layerH > 0 && diffBetweenLineYAndParentHeight < 0) {
			end.y -= diffBetweenLineYAndParentHeight * -2;
		}

		this.setCoordinates([start, end]);

		if (this.onMoveHandler !== null) {
			this.onMoveHandler(end.x, end.y, x, y);
		}
	}

	getCoordinates() {
		const { coordinates } = this.getOptions<LineDrawOptions>();
		return coordinates;
	}

	setCoordinates(coordinates: Array<{ x: number; y: number }>) {
		this.setOptions<LineDrawOptions>({ coordinates } as LineDrawOptions);
	}

	addCoordinates(x: number, y: number) {
		const { coordinates } = this.getOptions<LineDrawOptions>();
		coordinates.push({ x, y });
		this.setOptions({ coordinates } as LineDrawOptions);
	}

	isPointInside(
		pointX: number,
		pointY: number,
		padding: number = 0
	): boolean {
		const [start, end] = this.getCoordinates();
		return (
			super.isPointInside(start.x, start.y, padding) ||
			super.isPointInside(end.x, end.y, padding)
		);
	}

	update(event: string, data: any) {
		this.addMeta({ segment: data.meta.segment });
		this.move(data.movementX, data.movementY);
		this.addMeta({ segment: 'both' });
		this.currentSegment = 'both';
	}
}

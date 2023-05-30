import { CanvasObject } from 'canvas/canvas-object';
import { TYPES } from 'canvas/enums';

export class Selection extends CanvasObject<StrokeDrawOptions> {
	constructor(options: StrokeDrawOptions) {
		super(options, 160);
		this.setType(TYPES.SELECTION);
	}

	isPointInStroke(pointX: number, pointY: number): string | null {
		const { h } = this.getOptions();
		const {
			topLeftCorner,
			topRightCorner,
			bottomLeftCorner,
			bottomRightCorner,
		} = this.getCorners();

		let stroke = null;

		if (
			Math.abs(
				this.getDistanceBetweenPointAndLine(
					pointX,
					pointY,
					topLeftCorner,
					topRightCorner
				)
			) /
				h <=
			5
		) {
			stroke = 'top';
		}

		if (
			Math.abs(
				this.getDistanceBetweenPointAndLine(
					pointX,
					pointY,
					topLeftCorner,
					bottomLeftCorner
				)
			) <= 5
		) {
			stroke = 'left';
		}

		if (
			Math.abs(
				this.getDistanceBetweenPointAndLine(
					pointX,
					pointY,
					topRightCorner,
					bottomRightCorner
				)
			) <= 5
		) {
			stroke = 'right';
		}

		if (
			Math.abs(
				this.getDistanceBetweenPointAndLine(
					pointX,
					pointY,
					bottomLeftCorner,
					bottomRightCorner
				)
			) /
				h <=
			5
		) {
			stroke = 'bottom';
		}

		if (!this.isPointInside(pointX, pointY, 5)) {
			stroke = null;
		}

		return stroke;
	}

	private getDistanceBetweenPointAndLine(
		pointX: number,
		pointY: number,
		pointOne: { x: number; y: number },
		pointTwo: { x: number; y: number }
	) {
		return (
			(pointTwo.x - pointOne.x) * (pointOne.y - pointY) -
			((pointOne.x - pointX) * (pointTwo.y - pointOne.y)) /
				Math.sqrt(
					Math.pow(pointTwo.x - pointOne.x, 2) +
						Math.pow(pointTwo.y - pointOne.y, 2)
				)
		);
	}

	private getDistanceBetweenPoints(
		pointOne: { x: number; y: number },
		pointTwo: { x: number; y: number }
	) {
		return Math.hypot(pointTwo.x - pointOne.x, pointTwo.y - pointOne.y);
	}

	isPointInCorner(pointX: number, pointY: number): string | null {
		const {
			topLeftCorner,
			topRightCorner,
			bottomLeftCorner,
			bottomRightCorner,
		} = this.getCorners();

		if (
			this.getDistanceBetweenPoints(
				{ x: pointX, y: pointY },
				topLeftCorner
			) <= 10
		) {
			return 'top-left';
		}

		if (
			this.getDistanceBetweenPoints(
				{ x: pointX, y: pointY },
				topRightCorner
			) <= 10
		) {
			return 'top-right';
		}

		if (
			this.getDistanceBetweenPoints(
				{ x: pointX, y: pointY },
				bottomLeftCorner
			) <= 10
		) {
			return 'bottom-left';
		}

		if (
			this.getDistanceBetweenPoints(
				{ x: pointX, y: pointY },
				bottomRightCorner
			) <= 10
		) {
			return 'bottom-right';
		}

		return null;
	}
}

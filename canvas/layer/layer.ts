import { LayerInterface } from './type';
import { CanvasObjectInterface } from 'canvas/canvas-object/type';
import { CanvasObject } from 'canvas/canvas-object/canvas-object';
import { TYPES } from 'canvas/enums';
import { SMALL_PADDING } from 'constants/paddings';
import { CanvasTriangle } from 'canvas/canvas-triangle/canvas-triangle';
import { CanvasLine } from 'canvas/canvas-line/canvas-line';
import { Selection } from 'canvas/selection';
import { COLORS } from 'constants/colors';

export class Layer extends CanvasObject<any> implements LayerInterface {
	private active = false;
	private children: Array<CanvasObjectInterface<any>> = [];
	private id: number | null = null;
	private needToRender = true;
	private minDimension: number;

	constructor(options: BaseDrawOptions) {
		super(options);
		this.setType(TYPES.LAYER);
		this.children.push(
			new Selection({
				...(options as StrokeDrawOptions),
				lineWidth: 2,
				color: COLORS.SELECTION,
				scale: 1,
			})
		);
	}

	setActive(state: boolean) {
		this.active = state;
		const selection = this.getChildren()[0];
		const options = this.getOptions();
		selection.setOptions(options);
	}

	isActive() {
		return this.active;
	}

	setId(id: number) {
		this.id = id;
	}

	getId(): number | null {
		return this.id;
	}

	addChild(child: CanvasObjectInterface<any>) {
		this.children.push(child);

		const [childW, childH] = (
			child as CanvasObjectInterface<any>
		).getWidthHeight();
		const [childX, childY] = (child as CanvasObjectInterface<any>).getXY();
		let [X, Y] = this.getXY();
		let [W, H] = this.getWidthHeight();

		let isChildFullyInside = true;

		if (
			![
				[childX, childY],
				[childX + childW, childY + childH],
			].every((coordinates) => {
				const [x, y] = coordinates;
				return this.isPointInside(x, y);
			})
		) {
			isChildFullyInside = false;
		}

		if (child.getType() === TYPES.TRIANGLE) {
			const triangleCoordinates = (
				child as CanvasTriangle
			).getCoordinates();
			isChildFullyInside = [
				triangleCoordinates.top,
				triangleCoordinates.center,
				triangleCoordinates.bottom,
			].every((coordinates) => {
				const { x, y } = coordinates;
				return this.isPointInside(x, y);
			});
		}

		if (child.getType() === TYPES.LINE) {
			const [start, end] = (child as CanvasLine).getCoordinates();

			isChildFullyInside = [start, end].every((coordinates) => {
				const { x, y } = coordinates;
				return this.isPointInside(x, y);
			});
		}

		if (!isChildFullyInside) {
			const minX = Math.min(X, childX);
			const minY = Math.min(Y, childY);

			const maxX = Math.max(X + W, childX + childW);
			const maxY = Math.max(Y + H, childY + childH);

			const newWidth = maxX - minX;
			const newHeight = maxY - minY;

			const newX = minX;
			const newY = minY;

			this?.setWidthHeight(newWidth, newHeight);
			this?.setXY(newX, newY);

			const selection = this.getChildren()[0];
			selection.setXY(newX, newY);
			selection.setWidthHeight(newWidth, newHeight);
		}
	}

	removeChild(childToRemove: CanvasObjectInterface<any>) {
		this.children = this.children.filter((child) => {
			return false;
		});
	}

	getChildren(): CanvasObjectInterface<any>[] {
		return this.children;
	}

	getChildByType<T extends CanvasObjectInterface<any>>(
		type: TYPES
	): T | undefined {
		return (this.children as T[]).find((child) =>
			(Array.isArray(type) ? type : [type]).includes(child.getType())
		);
	}

	move(movementX: number, movementY: number, x, y, meta = null) {
		const { movable = true } = this.getOptions();
		if (movable) {
			super.move(movementX, movementY, x, y, meta);
			this.moveChildrenAccordingly(movementX, movementY, x, y, meta);
		}
	}

	moveChildrenAccordingly(
		movementX: number,
		movementY: number,
		x: number = 0,
		y: number = 0,
		meta: any = null
	) {
		for (const child of this.children) {
			child.move(movementX, movementY, x, y, meta);
		}
	}

	setShouldBeRendered(shouldRender: boolean) {
		this.needToRender = shouldRender;
	}

	shouldBeRendered(): boolean {
		return this.needToRender;
	}

	getMinDimension() {
		return this.minDimension;
	}

	compositeResize(pageX: number, pageY: number, segment = '') {
		const { padding = 0 } = this.getOptions();
		const [x, y] = this.getXY();
		let w = pageX - x;
		let h = pageY - y;

		if (w >= 0) {
			w += padding;
		} else {
			w -= padding;
		}

		if (h >= 0) {
			h += padding;
		} else {
			h -= padding;
		}

		this.setWidthHeight(w, h);
		this.compositeResizeChildrenAccordingly(pageX, pageY);
	}

	resize(movementX: number, movementY: number, direction = 'right') {
		if (['top-left', 'top', 'left'].includes(direction)) {
			this.resizeTopLeft(movementX, movementY);
		}

		if (direction === 'top-right') {
			this.resizeTopRight(movementX, movementY);
		}

		if (direction === 'bottom-left') {
			this.resizeBottomLeft(movementX, movementY);
		}

		if (['bottom-right', 'right', 'bottom'].includes(direction)) {
			this.resizeBottomRight(movementX, movementY);
		}
	}

	resizeBottomRight(movementX: number, movementY: number) {
		const { w, h } = this.getOptions();
		const delta = movementX + movementY;
		const movement = (Math.abs(movementX) + Math.abs(movementY)) / 2;

		if (delta < 0) {
			this.setWidthHeight(w - movement, h - movement);
			this.resizeChildrenAccordingly(-movement, -movement);
		} else {
			this.setWidthHeight(w + movement, h + movement);
			this.resizeChildrenAccordingly(movement, movement);
		}
	}

	resizeBottomLeft(movementX: number, movementY: number) {
		const { w, h } = this.getOptions();
		const delta = movementX;
		const movement = (Math.abs(movementX) + Math.abs(movementY)) / 2;

		const minDimension = this.getMinDimension();

		if (delta < 0) {
			this.move(-movement, 0, 0, 0);
			this.setWidthHeight(w + movement, h + movement);
			this.resizeChildrenAccordingly(movement, movement);
		} else {
			if (w - movement > minDimension && h - movement > minDimension) {
				this.move(movement, 0, 0, 0);
				this.setWidthHeight(w - movement, h - movement);
				this.resizeChildrenAccordingly(-movement, -movement);
			}
		}
	}

	resizeTopRight(movementX: number, movementY: number) {
		const { w, h } = this.getOptions();
		const delta = movementY;
		const movement = (Math.abs(movementX) + Math.abs(movementY)) / 2;

		const minDimension = this.getMinDimension();

		if (delta < 0) {
			this.move(0, -movement, 0, 0);
			this.setWidthHeight(w + movement, h + movement);
			this.resizeChildrenAccordingly(movement, movement);
		} else {
			if (w - movement > minDimension && h - movement > minDimension) {
				this.move(0, movement, 0, 0);
				this.setWidthHeight(w - movement, h - movement);
				this.resizeChildrenAccordingly(-movement, -movement);
			}
		}
	}

	resizeTopLeft(movementX: number, movementY: number) {
		const { w, h } = this.getOptions();
		const delta = movementX + movementY;
		const movement = (Math.abs(movementX) + Math.abs(movementY)) / 2;

		const minDimension = this.getMinDimension();

		if (delta < 0) {
			this.move(-movement, -movement, 0, 0);
			this.resizeChildrenAccordingly(movement, movement);
			this.setWidthHeight(w + movement, h + movement);
		} else {
			if (w - movement > minDimension && h - movement > minDimension) {
				this.move(movement, movement, 0, 0);
				this.resizeChildrenAccordingly(-movement, -movement);
				this.setWidthHeight(w - movement, h - movement);
			}
		}
	}

	compositeResizeChildrenAccordingly(pageX: number, pageY: number) {
		for (const child of this.children) {
			child.compositeResize(pageX, pageY);
		}
	}

	resizeChildrenAccordingly(movementX: number, movementY: number) {
		for (const child of this.children) {
			//child.resize(movementX, movementY, 0, 0);
		}
	}

	update(event: string, data: any) {
		this.move(data.movementX, data.movementY, data.x, data.y);
	}
}

import { TYPES } from 'canvas/enums';

export interface CanvasObjectInterface<T> {
	getOptions(): T;
	setOptions(options: T): void;

	getXY(): number[];
	setXY(x: number, y: number): void;

	getWidthHeight(): number[];
	setWidthHeight(width: number, height: number): void;

	move(
		movementX: number,
		movementY: number,
		x?: number,
		y?: number,
		meta?: any
	): void;

	compositeResize(pageX: number, pageY: number): void;

	getType(): TYPES;
	setType(type: TYPES): void;

	isPointInside(pointX: number, pointY: number): boolean;

	update(event: string, data: any): void;

	onMove(
		handler: (
			movementX: number,
			movementY: number,
			x: number,
			y: number
		) => void
	): void;

	addMeta(metaInformation: Record<string, any>): void;
	getMeta(): Record<string, any>;

	attach(
		observer: CanvasObjectInterface<any>,
		event: string,
		meta: any
	): void;

	notify(event: string, data: any): void;

	getAllObservers(): FlatArray<
		{ object: CanvasObjectInterface<any>; meta: any; handler: string }[][],
		number
	>[];
}

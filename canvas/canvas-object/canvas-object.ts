import { TYPES } from 'canvas/enums';
import { getCorners } from 'utils/geometry';

import { CanvasObjectInterface } from './type';

type HandlerType = (
	movementX: number,
	movementY: number,
	x?: number,
	y?: number
) => void;

export class CanvasObject<T extends BaseDrawOptions>
	implements CanvasObjectInterface<T>
{
	options: T = {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
		padding: 0,
		movable: true,
	} as T;
	private type = TYPES.RECT;
	private metaInformation: Record<string, any> = {};
	observers: Record<
		string,
		{ object: CanvasObjectInterface<any>; meta: any; handler: string }[]
	> = {};

	onMoveHandler: HandlerType | null = null;

	constructor(options: T) {
		this.options = { ...options };
	}

	getOptions(): T {
		return this.options;
	}

	setOptions(options: T) {
		this.options = { ...this.options, ...options };
	}

	getXY(): number[] {
		return [this.options?.x || 0, this.options?.y || 0];
	}

	setXY(x: number, y: number) {
		this.setOptions({ x, y } as T);
	}

	setWidthHeight(width: number, height: number) {
		this.setOptions({ w: width, h: height } as T);
	}

	getWidthHeight(): number[] {
		return [this.options?.w || 0, this.options.h || 0];
	}

	move(
		movementX: number,
		movementY: number,
		pageX: number = 0,
		pageY: number = 0,
		meta = null
	) {
		const { x, y } = this.options;
		const layerX = x + movementX;
		const layerY = y + movementY;

		this.setXY(layerX, layerY);

		if (this.onMoveHandler !== null) {
			this.onMoveHandler(movementX, movementY, pageX, pageY);
		}

		this.notify('onmove', { movementX, movementY, pageX, pageY });
	}

	compositeResize(pageX: number, pageY: number) {
		const { padding = 0 } = this.getOptions();
		const [x, y] = this.getXY();
		this.setWidthHeight(pageX - x + padding, pageY - y + padding);
	}

	setType(type: TYPES) {
		this.type = type;
	}

	getType(): TYPES {
		return this.type;
	}

	getCorners() {
		const { x = 0, y = 0, w = 0, h = 0 } = this.getOptions();

		return getCorners(x, y, w, h);
	}

	isPointInside(pointX: number, pointY: number) {
		let { x, y, w = 0, h = 0, padding = 0 } = this.getOptions();
		if (w < 0) {
			const revertedX = x - Math.abs(w);
			w = Math.abs(w);
			x = revertedX;
		}

		if (h < 0) {
			const revertedY = y - Math.abs(h);
			h = Math.abs(h);
			y = revertedY;
		}

		return (
			pointX > x - padding &&
			pointX < x + w + padding &&
			pointY > y - padding &&
			pointY < y + h + padding
		);
	}

	update(event: string, data: any) {}

	onMove(onMoveHandler: HandlerType) {
		this.onMoveHandler = onMoveHandler;
	}

	getMeta(): Record<string, any> {
		return this.metaInformation;
	}

	addMeta(metaInformation: Record<string, any>) {
		this.metaInformation = { ...this.metaInformation, ...metaInformation };
	}

	attach(
		observer: CanvasObjectInterface<any>,
		event: string,
		meta: any = null,
		handler: string = ''
	) {
		if (this.observers[event]) {
			this.observers[event].push({ object: observer, meta, handler });
		} else {
			this.observers[event] = [{ object: observer, meta, handler }];
		}
	}

	getAllObservers(): FlatArray<
		{ object: CanvasObjectInterface<any>; meta: any; handler: string }[][],
		number
	>[] {
		return Object.values(this.observers).flat(2);
	}

	notify(event: string, data: any) {
		if (this.observers[event]) {
			this.observers[event].forEach((observer) => {
				if (observer.handler !== '') {
					observer.object[observer.handler](event, {
						...this.getOptions(),
						...data,
						meta: observer.meta,
					});
				} else {
					observer.object.update(event, {
						...this.getOptions(),
						...data,
						meta: observer.meta,
					});
				}
			});
		}
	}
}

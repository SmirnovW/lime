import { CanvasObjectInterface } from 'canvas/canvas-object/type';
import { TYPES } from 'canvas/enums';

export interface LayerInterface extends CanvasObjectInterface<any> {
	isPointInside(pointX: number, pointY: number): boolean;

	setActive(state: boolean): void;

	isActive(): boolean;

	addChild(child: CanvasObjectInterface<any>): void;
	removeChild(child: CanvasObjectInterface<any>): void;

	getChildren(): CanvasObjectInterface<any>[];

	setId(id: number | string): void;

	getId(): number | string | null;

	shouldBeRendered(): boolean;

	getChildByType<T extends CanvasObjectInterface<any>>(
		type: TYPES | string[]
	): T | undefined;

	resize(movementX: number, movementY: number, direction: string): void;
}

import { CanvasObject } from 'canvas/canvas-object';
import { TYPES } from 'canvas/enums';

export class CanvasRect extends CanvasObject<RectDrawOptions> {
	constructor(options: RectDrawOptions) {
		super(options);
		this.setType(TYPES.RECT);
	}
}

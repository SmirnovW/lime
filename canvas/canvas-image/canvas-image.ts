import { CanvasObject } from 'canvas/canvas-object';
import { TYPES } from 'canvas/enums';

export class CanvasImage extends CanvasObject<ImageDrawOptions> {
	constructor(options: ImageDrawOptions) {
		super(options);
		this.setType(TYPES.IMAGE);
	}
}

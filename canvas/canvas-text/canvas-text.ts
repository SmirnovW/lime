import { CanvasObject } from 'canvas/canvas-object';
import { TYPES } from 'canvas/enums';

export class CanvasText extends CanvasObject<TextDrawOptions> {
	private snapshot: null | CanvasImageSource = null;
	private preparedText: string[] = [];

	constructor(options: TextDrawOptions) {
		super(options);
		this.setType(TYPES.TEXT);
		this.prepareText(options.text, options.fontSize);
	}

	setWidthHeight(width: number, height: number) {
		super.setWidthHeight(width, height);
		this.setSnapshot(null);
	}

	setText(
		text: string,
		fontSize: number,
		style: string,
		textAlign: CanvasTextAlign
	) {
		const options = this.getOptions();
		this.prepareText(text, fontSize, style);

		if (
			options.text !== text ||
			fontSize !== options.fontSize ||
			style !== options.style ||
			textAlign !== options.textAlign
		) {
			this.setSnapshot(null);
		}

		this.setOptions({ text, fontSize, style, textAlign });
	}

	prepareText(text: string, fontSize: number, style = '') {
		const preparedText: string[] = [];
		const {
			w: width,
			h: height,
			scale = 1,
			canvasScale,
		} = this.getOptions();
		const fragments = text.split(/[\r\n]/);
		// @ts-ignore
		const offscreenCanvas = new OffscreenCanvas(width, height);
		offscreenCanvas.width = Math.floor(width * canvasScale);
		offscreenCanvas.height = Math.floor(height * canvasScale);
		const context = offscreenCanvas.getContext('2d');
		context.scale(canvasScale, canvasScale);
		context.font = `${style ? style : 400} ${fontSize}px monospace`;

		let textToRender = '';

		for (const fragment of fragments) {
			if (fragment === '') {
				preparedText.push('');
			} else {
				for (const subString of fragment) {
					const textMetrics = context.measureText(
						textToRender + subString
					);

					const rectWidth = width - 10 * scale;

					if (textMetrics.width * scale >= rectWidth) {
						preparedText.push(textToRender);
						textToRender = '';
					}
					textToRender += subString;
				}
				if (textToRender !== '') {
					preparedText.push(textToRender);
					textToRender = '';
				}
			}
		}

		this.preparedText = preparedText;
	}

	public getPreparedText(): string[] {
		return this.preparedText;
	}

	public setSnapshot(snapshot: CanvasImageSource | null) {
		this.snapshot = snapshot;
	}

	public getSnapshot(): CanvasImageSource | null {
		return this.snapshot;
	}
}

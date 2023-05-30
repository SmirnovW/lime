import { calculateControlPoints, getCorners } from 'utils/geometry';
import { COLORS } from 'constants/colors';
import { SMALL_PADDING } from 'constants/paddings';

export class Renderer {
	private renderingContext: CanvasRenderingContext2D;
	private scaleValue: number;
	private event: any = null;
	private initialScale: number;

	constructor(renderingContext: CanvasRenderingContext2D, scale: number) {
		this.renderingContext = renderingContext;
		this.scaleValue = scale;
		this.initialScale = scale;
		this.renderingContext.scale(this.scaleValue, this.scaleValue);
	}

	setEvent(event: any) {
		this.event = event;
	}

	scale(scaleX: number, scaleY: number) {
		this.renderingContext.scale(scaleX, scaleY);
		const { a } = this.renderingContext.getTransform();
		this.scaleValue = a;
	}

	translate(translateX: number, translateY: number) {
		this.renderingContext.translate(translateX, translateY);
	}

	getTransform(): {
		scaleX: number;
		skewY: number;
		skewX: number;
		scaleY: number;
		translationX: number;
		translationY: number;
		initialScale: number;
	} {
		const transform = this.renderingContext.getTransform();

		return {
			scaleX: transform.a,
			skewY: transform.b,
			skewX: transform.c,
			scaleY: transform.d,
			translationX: transform.e,
			translationY: transform.f,
			initialScale: this.initialScale,
		};
	}

	getContext() {
		return this.renderingContext;
	}

	fillLine(options: LineDrawOptions) {
		const [start, end] = options.coordinates;
		this.renderingContext.beginPath();
		this.renderingContext.moveTo(start.x, start.y); // Begin first sub-path
		this.renderingContext.lineTo(end.x, end.y);
		this.renderingContext.stroke();
	}

	fillCurvedLine(options: LineDrawOptions) {
		const [start, end] = options.coordinates;
		const { controlX, controlY } = calculateControlPoints(
			start.x,
			start.y,
			end.x,
			end.y
		);
		this.renderingContext.beginPath();
		this.renderingContext.moveTo(start.x, start.y); // Begin first sub-path
		this.renderingContext.quadraticCurveTo(
			controlX,
			controlY,
			end.x,
			end.y
		);
		this.renderingContext.stroke();
	}

	fillRect(options: RectDrawOptions) {
		this.renderingContext.save();

		if (options.color) {
			this.renderingContext.fillStyle = options.color;
		}
		if (options.shadowColor) {
			this.renderingContext.shadowColor = options.shadowColor;
		}
		if (options.shadowOffsetY) {
			this.renderingContext.shadowOffsetY = options.shadowOffsetY;
		}
		if (options.shadowOffsetX) {
			this.renderingContext.shadowOffsetX = options.shadowOffsetX;
		}
		if (options.shadowBlur) {
			this.renderingContext.shadowBlur = options.shadowBlur;
		}

		this.renderingContext.fillRect(
			options.x,
			options.y,
			options.w,
			options.h
		);
		this.renderingContext.restore();
	}

	fillTriangle(options: TriangleDrawOptions) {
		const { x, y, w, h } = options;
		this.renderingContext.save();

		if (options.color) {
			this.renderingContext.fillStyle = options.color;
		}
		this.renderingContext.beginPath();
		this.renderingContext.moveTo(x, y);
		this.renderingContext.lineTo(x + w, y + h);
		this.renderingContext.lineTo(x, y + h * 2);
		this.renderingContext.fill();
		//this.renderingContext.stroke();
	}

	strokeRect({
		x,
		y,
		h,
		w,
		lineWidth = 1,
		color = 'black',
		padding = 0,
	}: StrokeDrawOptions) {
		this.renderingContext.save();

		this.renderingContext.lineWidth = lineWidth;
		this.renderingContext.strokeStyle = color;
		this.renderingContext.strokeRect(
			x - padding,
			y - padding,
			w + padding,
			h + padding
		);
		this.renderingContext.restore();
	}

	drawImage(options: ImageDrawOptions) {
		if (options.image) {
			this.renderingContext.save();
			this.renderingContext.drawImage(
				options.image,
				options.x,
				options.y,
				options.w,
				options.h
			);
			this.renderingContext.restore();
		}
	}

	fillText({ x, y, fontSize, color = '#000', text, style }: TextDrawOptions) {
		this.renderingContext.save();

		this.renderingContext.font = `${
			style ? style : 400
		} ${fontSize}px monospace`;
		this.renderingContext.fillStyle = color;
		this.renderingContext.fillText(text, x, y);
		this.renderingContext.restore();
	}

	clearRect({ x, y, w, h }: ClearRectOptions, callBack: () => void) {
		window.requestAnimationFrame(() => {
			this.renderingContext.clearRect(x, y, w, h);
			callBack();
		});
	}

	clearRectSync({ x, y, w, h }: ClearRectOptions) {
		this.renderingContext.clearRect(x, y, w, h);
	}

	renderTextSnapshot(
		fragments: string[],
		{
			textAlign,
			style,
			fontSize,
			w: width,
			h: height,
			x,
			y,
			scale = 1,
		}: TextDrawOptions
	) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const offscreenCanvas = new OffscreenCanvas(width, width);
		offscreenCanvas.height = Math.floor(height * this.scaleValue);
		offscreenCanvas.width = Math.floor(width * this.scaleValue);
		const context = offscreenCanvas.getContext('2d');
		//context.scale(this.scale, this.scale);
		context.textAlign = textAlign;
		context.textBaseline = 'alphabetic';
		context.font = `${style ? style : 400} ${fontSize}px monospace`;
		context.scale(scale * this.scaleValue, scale * this.scaleValue);
		const textMetrics = context.measureText('text');

		const lineHeight =
			textMetrics.fontBoundingBoxDescent +
			textMetrics.fontBoundingBoxAscent;

		const transform = context.getTransform();

		let newX = SMALL_PADDING;

		if (textAlign === 'center') {
			newX = offscreenCanvas.width / transform.a / this.initialScale;
		}

		if (textAlign === 'right') {
			newX = offscreenCanvas.width / transform.a - SMALL_PADDING;
		}

		let newY = lineHeight;
		for (const fragment of fragments) {
			if (fragment === '') {
				newY += lineHeight;
			} else {
				context.fillText(fragment, newX, newY);
				newY += lineHeight;
			}
		}

		this.renderingContext.drawImage(offscreenCanvas, x, y, width, height);

		return offscreenCanvas;
	}

	fillRoundedRect(options: RoundedRectDrawOptions) {
		const {
			topLeftCorner,
			topRightCorner,
			bottomLeftCorner,
			bottomRightCorner,
		} = getCorners(options.x, options.y, options.w, options.h);

		this.renderingContext.save();

		if (options.color) {
			this.renderingContext.fillStyle = options.color;
		}
		if (options.shadowColor) {
			this.renderingContext.shadowColor = options.shadowColor;
		}
		if (options.shadowOffsetY) {
			this.renderingContext.shadowOffsetY = options.shadowOffsetY;
		}
		if (options.shadowOffsetX) {
			this.renderingContext.shadowOffsetX = options.shadowOffsetX;
		}
		if (options.shadowBlur) {
			this.renderingContext.shadowBlur = options.shadowBlur;
		}
		this.renderingContext.lineWidth = 4;

		this.renderingContext.beginPath();
		this.renderingContext.moveTo(
			topLeftCorner.x + options.radius,
			topLeftCorner.y
		); // Begin first sub-path
		this.renderingContext.lineTo(
			topRightCorner.x - options.radius,
			topRightCorner.y
		);
		this.renderingContext.quadraticCurveTo(
			topRightCorner.x,
			topRightCorner.y,
			topRightCorner.x,
			topRightCorner.y + options.radius
		);
		this.renderingContext.lineTo(
			bottomRightCorner.x,
			bottomRightCorner.y - options.radius
		);
		this.renderingContext.quadraticCurveTo(
			bottomRightCorner.x,
			bottomRightCorner.y,
			bottomRightCorner.x - options.radius,
			bottomRightCorner.y
		);
		this.renderingContext.lineTo(
			bottomLeftCorner.x + options.radius,
			bottomLeftCorner.y
		);
		this.renderingContext.quadraticCurveTo(
			bottomLeftCorner.x,
			bottomLeftCorner.y,
			bottomLeftCorner.x,
			bottomLeftCorner.y - options.radius
		);
		this.renderingContext.lineTo(
			topLeftCorner.x,
			topLeftCorner.y + options.radius
		);
		this.renderingContext.quadraticCurveTo(
			topLeftCorner.x,
			topLeftCorner.y,
			topLeftCorner.x + options.radius,
			topLeftCorner.y
		);
		this.renderingContext.fill();
		this.renderingContext.closePath();

		this.renderingContext.restore();
	}

	public fillCircle(options: CircleDrawOptions) {
		this.renderingContext.save();
		this.renderingContext.beginPath();
		if (options.color) {
			this.renderingContext.fillStyle = options.color;
		}
		this.renderingContext.arc(
			options.x,
			options.y,
			options.radius,
			0,
			2 * Math.PI
		);
		this.renderingContext.fill();
		this.renderingContext.restore();
	}

	public drawGrid() {
		const width = 10;
		const height = 10;

		const transform = this.renderingContext.getTransform();

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const offscreenCanvas = new OffscreenCanvas(width, height);
		offscreenCanvas.width = Math.floor(width * this.scaleValue);
		offscreenCanvas.height = Math.floor(height * this.scaleValue);
		const context = offscreenCanvas.getContext('2d');
		context.scale(this.scaleValue, this.scaleValue);

		const radius = 0.5;

		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = COLORS.GRID;
		//context.arc(1, 1, radius, 0, 2 * Math.PI);
		//context.moveTo(1,1);
		context.strokeRect(-1, -1, width + 1, height + 1);
		context.fill();

		const pattern: CanvasPattern | null =
			this.renderingContext.createPattern(offscreenCanvas, 'repeat');

		this.renderingContext.save();
		// we need to have correct greed scale
		//this.renderingContext.setTransform(this.initialScale, 0, 0, this.initialScale, 0, 0);
		this.renderingContext.setTransform(
			this.initialScale,
			transform.b,
			transform.c,
			this.initialScale,
			transform.e,
			transform.f
		);
		//this.renderingContext.translate(transform.e / this.initialScale, transform.f / this.initialScale);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.renderingContext.fillStyle = pattern;
		this.renderingContext.fillRect(
			-transform.e / this.initialScale,
			-transform.f / this.initialScale,
			window.innerWidth,
			window.innerHeight
		);
		this.renderingContext.restore();
	}
}

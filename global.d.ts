type MouseData = {
	pageX: number;
	pageY: number;
};

type LineDrawOptions = {
	scale: number;
	color: string;
	coordinates: Array<{ x: number; y: number }>;
};

type CircleDrawOptions = {
	color?: string;
	shadowColor?: string;
	shadowOffsetY?: number;
	shadowOffsetX?: number;
	shadowBlur?: number;
	radius: number;
	scale: number;
	x: number;
	y: number;
};

type RoundedRectDrawOptions = {
	color?: string;
	shadowColor?: string;
	shadowOffsetY?: number;
	shadowOffsetX?: number;
	shadowBlur?: number;
	radius: number;
	scale: number;
	x: number;
	y: number;
	w: number;
	h: number;
};

type RectDrawOptions = {
	scale: number;
	x: number;
	y: number;
	w: number;
	h: number;
	color?: string;
	shadowColor?: string;
	shadowOffsetY?: number;
	shadowOffsetX?: number;
	shadowBlur?: number;
};

type TriangleCoordinatesType = {
	top: { x: number; y: number };
	center: { x: number; y: number };
	bottom: { x: number; y: number };
};

type TriangleDrawOptions = {
	x: number;
	y: number;
	w: number;
	h: number;
	scale: number;
	color?: string;
	resizable?: boolean;
};

type StrokeDrawOptions = {
	scale: number;
	color: string;
	lineWidth: number;
	x: number;
	y: number;
	w: number;
	h: number;
	padding?: number;
};

type BaseDrawOptions = {
	scale: number;
	x?: number;
	y?: number;
	w?: number;
	h?: number;
	padding?: number;
	initialWidth?: number;
	initialHeight?: number;
	resizable?: boolean;
	movable?: boolean;
};

type TextDrawOptions = {
	textAlign: CanvasTextAlign;
	canvasScale: number;
	text: string;
	color: string;
	fontSize: number;
	style: string;
	scale: number;
	x: number;
	y: number;
	w: number;
	h: number;
};

type ImageDrawOptions = {
	scale: number;
	image: CanvasImageSource;
	x: number;
	y: number;
	w: number;
	h: number;
};

type ClearRectOptions = {
	x: number;
	y: number;
	w: number;
	h: number;
};

interface AnimationInterface {
	onAnimationOver(callBack: () => void): void;
	animate(): void;
	getStatus(): string;
}

declare type ColorType = 'transparent' | 'main-dark' | 'main-white';

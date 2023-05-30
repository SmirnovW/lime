import { Renderer } from 'canvas/renderer/renderer';
import { CanvasText } from 'canvas/canvas-text/canvas-text';
import { LayerInterface } from 'canvas/layer';
import { TYPES } from 'canvas/enums';

type RedrawMethodOptions = {
	callBack?: () => void;
	exceptType?: 'text' | 'selection' | 'image' | '';
	exceptLayer?: LayerInterface;
	force?: boolean;
};

export class RenderingManager {
	private layersCounter = 0;
	private layers: Array<LayerInterface> = [];
	private renderer: Renderer;

	constructor(renderer: Renderer) {
		this.renderer = renderer;
	}

	getContext() {
		return this.renderer.getContext();
	}

	getLayers(): Array<LayerInterface> {
		return this.layers;
	}

	add(layer: LayerInterface) {
		this.layersCounter += 1;
		layer.setId(this.layersCounter);
		this.layers.push(layer);
		this.draw(layer);
	}

	remove(layerToRemove: any) {
		this.layers = this.layers.filter((layer) => {
			return layer.getId() !== layerToRemove.getId();
		});
		this.reDraw();
	}

	findLayerByCoordinates(x: number, y: number): LayerInterface | undefined {
		let length = this.layers.length - 1;

		while (length >= 0) {
			const layer = this.layers[length];

			if (layer.isPointInside(x, y)) {
				return layer;
			}
			length -= 1;
		}

		return undefined;
	}

	findMultipleLayersByCoordinates(x: number, y: number): LayerInterface[] {
		let length = this.layers.length - 1;
		const results = [];

		while (length >= 0) {
			const layer = this.layers[length];
			if (layer.isPointInside(x, y)) {
				results.push(layer);
			}
			length -= 1;
		}

		return results;
	}

	draw(
		layer: LayerInterface,
		renderingOptions?: {
			excludeType?: 'text' | 'selection' | 'image' | '';
			force?: boolean;
		}
	) {
		const children = layer.getChildren();

		//this.renderer.strokeRect(<StrokeDrawOptions>layer.getOptions());
		for (const child of children) {
			const options = child.getOptions();
			const type = child.getType();

			if (type === TYPES.RECT) {
				this.renderer.fillRect(options as RectDrawOptions);
			}

			if (type === TYPES.TRIANGLE) {
				this.renderer.fillTriangle(options as TriangleDrawOptions);
			}

			if (type === TYPES.SELECTION && layer.isActive()) {
				//if (type === TYPES.SELECTION) {
				//const { x, y, w, h } = options as BaseDrawOptions;
				/*				const corners: ReturnType<typeof getCorners> = getCorners(
					x,
					y,
					w,
					h
				);

				let corner: keyof typeof corners;

				for (corner in corners) {
					if (corners[corner]) {
						const { x, y } = corners[corner];
						this.renderer.fillCircle({
							x,
							y,
							radius: 5,
							scale: (options as CircleDrawOptions).scale,
							color: COLORS.SELECTION,
						});
					}
				}*/

				this.renderer.strokeRect(options as StrokeDrawOptions);
			}

			if (type === TYPES.IMAGE) {
				this.renderer.drawImage(options as ImageDrawOptions);
			}

			if (type === TYPES.TEXT && type !== renderingOptions?.excludeType) {
				const currentSnapshot = (child as CanvasText).getSnapshot();
				if (currentSnapshot && !renderingOptions?.force) {
					this.renderer.drawImage({
						...(options as ImageDrawOptions),
						image: currentSnapshot,
					});
				} else {
					const preparedText = (
						child as CanvasText
					).getPreparedText();
					const snapshot = this.renderer.renderTextSnapshot(
						preparedText,
						options as TextDrawOptions
					);
					(child as CanvasText).setSnapshot(snapshot);
				}
			}

			if (type === TYPES.LINE) {
				const { coordinates } = options as LineDrawOptions;
				const [start, end] = coordinates;
				const layerOptions = layer.getOptions() as StrokeDrawOptions;
				//this.renderer.strokeRect(layerOptions);
				/*
				this.renderer.fillCircle({
					...options,
					x: start.x,
					y: start.y,
					radius: 5,
					color: 'red',
				});
*/

				/*
				this.renderer.fillCircle({
					...options,
					x: end.x,
					y: end.y,
					radius: 5,
					color: 'blue',
				});
*/

				this.renderer.fillCurvedLine(options as LineDrawOptions);
			}
		}
	}

	reDrawSync(options?: RedrawMethodOptions) {
		const transform = this.renderer.getContext().getTransform();
		const inverseScale = 2 / transform.a < 2 ? 2 : 2 / transform.a;

		this.renderer.clearRectSync({
			x: transform.e > 0 ? -transform.e * inverseScale : 0,
			y: transform.f > 0 ? -transform.f * inverseScale : 0,
			w:
				window.innerWidth * inverseScale +
				Math.abs(transform.e) * inverseScale,
			h:
				window.innerHeight * inverseScale +
				Math.abs(transform.f) * inverseScale,
		});

		this.renderer.drawGrid();

		for (const layer of this.layers) {
			if (layer.shouldBeRendered()) {
				if (options?.exceptLayer) {
					if (layer.getId() !== options?.exceptLayer.getId()) {
						this.draw(layer, {
							excludeType: options?.exceptType || '',
							force: Boolean(options?.force),
						});
					}
				} else {
					this.draw(layer, {
						excludeType: options?.exceptType || '',
						force: Boolean(options?.force),
					});
				}
			}
		}

		if (options?.callBack) {
			options.callBack();
		}
	}

	reDraw(options?: RedrawMethodOptions) {
		const transform = this.renderer.getContext().getTransform();
		const inverseScale = 2 / transform.a < 2 ? 2 : 2 / transform.a;

		this.renderer.clearRect(
			{
				x: transform.e > 0 ? -transform.e * inverseScale : 0,
				y: transform.f > 0 ? -transform.f * inverseScale : 0,
				w:
					window.innerWidth * inverseScale +
					Math.abs(transform.e) * inverseScale,
				h:
					window.innerHeight * inverseScale +
					Math.abs(transform.f) * inverseScale,
			},
			() => {
				this.renderer.drawGrid();
				for (const layer of this.layers) {
					if (layer.shouldBeRendered()) {
						if (options?.exceptLayer) {
							if (
								layer.getId() !== options?.exceptLayer.getId()
							) {
								this.draw(layer, {
									excludeType: options?.exceptType || '',
									force: Boolean(options?.force),
								});
							}
						} else {
							this.draw(layer, {
								excludeType: options?.exceptType || '',
								force: Boolean(options?.force),
							});
						}
					}
				}
				if (options?.callBack) {
					options?.callBack();
				}
			}
		);
	}
}

import { useContext, useState, WheelEvent } from 'react';
import { CanvasContext } from 'context/canvas-context/canvas-context';
import { getTransformedPoint } from 'utils/geometry';
import { TextEditorContext } from 'context/text-editor-context/text-editor-context';
import { canvasScaleToPercentage, zoomPercentageToScale } from 'utils/base';
import { ToolbarContext } from 'context/toolbar-context/toolbar-context';

export function useCanvasOnWheel() {
	const { setZoomPercentage } = useContext(ToolbarContext);
	const { editable } = useContext(TextEditorContext);
	const { renderingManager, renderer } = useContext(CanvasContext);
	const [currentPosition, setCurrentPosition] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });
	const [startPosition, setStartPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [timerId, setTimerId] = useState<number>(0);

	return (event: WheelEvent) => {
		if (renderer && !editable) {
			if (startPosition === null) {
				setStartPosition(
					getTransformedPoint(
						event.pageX,
						event.pageY,
						renderer.getTransform()
					)
				);
				setCurrentPosition({ x: event.pageX, y: event.pageY });
			}
			if (!event.ctrlKey) {
				clearTimeout(timerId);
				setTimerId(0);

				setCurrentPosition((state) => {
					return {
						x: state.x + event.deltaX * -1,
						y: state.y + event.deltaY * -1,
					};
				});

				if (startPosition !== null) {
					const currentTransformedPosition = getTransformedPoint(
						currentPosition.x,
						currentPosition.y,
						renderer.getTransform()
					);
					renderer
						.getContext()
						.translate(
							currentTransformedPosition.x - startPosition.x,
							currentTransformedPosition.y - startPosition.y
						);
					renderingManager?.reDraw();
				}
			} else {
				clearTimeout(timerId);
				setTimerId(0);

				setCurrentPosition((state) => {
					return {
						x: state.x + event.deltaX * -1,
						y: state.y + event.deltaY * -1,
					};
				});
				const currentTransformedPosition = getTransformedPoint(
					event.clientX,
					event.clientY,
					renderer.getTransform()
				);

				const transform = renderer.getTransform();
				const zoom = event.deltaY < 0 ? 1.1 : 0.9;

				const nextZoomPercentage = canvasScaleToPercentage(
					transform.scaleX * zoom
				);
				const scale =
					zoomPercentageToScale(nextZoomPercentage) /
					transform.scaleX;

				if (nextZoomPercentage <= 200 && nextZoomPercentage >= 10) {
					renderer.translate(
						currentTransformedPosition.x,
						currentTransformedPosition.y
					);
					renderer.scale(scale, scale);
					renderer.translate(
						-currentTransformedPosition.x,
						-currentTransformedPosition.y
					);

					setZoomPercentage(nextZoomPercentage);

					renderingManager?.reDrawSync();
				}
			}
			setTimerId(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				setTimeout(() => {
					setStartPosition(null);
					document.dispatchEvent(new CustomEvent('zooming-stopped'));
				}, 250)
			);
		}
	};
}

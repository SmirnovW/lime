import React, { MouseEvent, useContext, useState } from 'react';
import { useCanvasOnClick } from 'hooks/use-canvas-on-click';
import { useCanvasOnMove } from 'hooks/use-canvas-on-move';
import { ToolbarContext } from 'context/toolbar-context/toolbar-context';
import { useCanvasOnMouseUp } from 'hooks/use-canvason-mouse-up';
import { useKeyboard } from 'hooks/use-keyboard';

type Props = {
	setCanvasRef: (element: HTMLCanvasElement) => void;
};

/**
 * Canvas Component
 */
export const Canvas: React.FC<Props> = ({ setCanvasRef }) => {
	const [isMousePressed, setMousePressed] = useState<boolean>(false);

	const { cursor } = useContext(ToolbarContext);

	useKeyboard();

	const onClick = useCanvasOnClick();
	const onMouseUp = useCanvasOnMouseUp();

	const onMove = useCanvasOnMove(isMousePressed);

	const onMouseDown = (event: MouseEvent) => {
		setMousePressed(true);

		onClick(event);
	};

	const mouseUp = (event: MouseEvent) => {
		setMousePressed(false);

		onMouseUp(event);
	};

	return (
		<canvas
			ref={setCanvasRef}
			id="canvas"
			onMouseDown={onMouseDown}
			onMouseUp={mouseUp}
			onMouseMove={onMove}
			style={{
				cursor,
			}}
		/>
	);
};

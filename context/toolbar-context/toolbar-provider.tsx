import React, { useState } from 'react';

import {
	DEFAULT_CURSOR,
	DEFAULT_RESIZE_DIRECTION,
	DEFAULT_TOOL,
	ToolbarContext,
} from 'context/toolbar-context/toolbar-context';

type Props = {
	children: React.ReactNode;
};

/**
 * ToolbarProvider Component
 */
export const ToolbarProvider: React.FunctionComponent<Props> = ({
	children,
}) => {
	const [tool, setTool] = useState<string>(DEFAULT_TOOL);
	const [cursor, setCursor] = useState<string>(DEFAULT_CURSOR);
	const [resizeDirection, setResizeDirection] = useState<string>(
		DEFAULT_RESIZE_DIRECTION
	);
	const [zoomPercentage, setZoomPercentage] = useState<number>(40);

	return (
		<ToolbarContext.Provider
			value={{
				cursor,
				setCursor,
				tool,
				setTool,
				resizeDirection,
				setResizeDirection,
				zoomPercentage,
				setZoomPercentage,
			}}
		>
			{children}
		</ToolbarContext.Provider>
	);
};

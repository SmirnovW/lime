import { createContext, Dispatch, SetStateAction } from 'react';
import { TOOLS } from 'constants/tools';

interface ToolbarContextInterface {
	cursor: string;
	setCursor: Dispatch<SetStateAction<string>>;
	tool: string;
	setTool: Dispatch<SetStateAction<string>>;
	resizeDirection: string;
	setResizeDirection: Dispatch<SetStateAction<string>>;
	zoomPercentage: number;
	setZoomPercentage: Dispatch<SetStateAction<number>>;
}

export const DEFAULT_TOOL = TOOLS.STICKER;
export const DEFAULT_CURSOR = 'default';
export const DEFAULT_RESIZE_DIRECTION = 'right';

export const ToolbarContext = createContext<ToolbarContextInterface>({
	cursor: DEFAULT_CURSOR,
	setCursor: () => {},
	tool: DEFAULT_TOOL,
	setTool: () => {},
	resizeDirection: DEFAULT_RESIZE_DIRECTION,
	setResizeDirection: () => {},
	zoomPercentage: 40,
	setZoomPercentage: () => {},
});

import { useContext } from 'react';
import { CanvasContext } from 'context/canvas-context/canvas-context';
import { CanvasRect } from 'canvas/canvas-rect/canvas-rect';
import { Layer } from 'canvas/layer';
import { LARGE_PADDING, SMALL_PADDING } from 'constants/paddings';
import {
	DEFAULT_CURSOR,
	ToolbarContext,
} from 'context/toolbar-context/toolbar-context';
import { TOOLS } from 'constants/tools';
import { COLORS } from 'constants/colors';
import { CanvasText } from 'canvas/canvas-text';
import { CanvasTriangle } from 'canvas/canvas-triangle/canvas-triangle';
import { CanvasLine } from 'canvas/canvas-line/canvas-line';
import { ActiveLayerContext } from 'context/active-layer-context/active-layer-context';
import { LinearLayer } from 'canvas/linear-layer';
import { useGeneratorBlock } from 'hooks/blocks/use-generator-block';
import { useSwitchBlock } from 'hooks/blocks/use-switch-block';

export function useCreateBlockTool() {
	const { renderer, renderingManager } = useContext(CanvasContext);
	const { setActiveLayer } = useContext(ActiveLayerContext);
	const { setTool, tool, setCursor } = useContext(ToolbarContext);
	const createGeneratorBlock = useGeneratorBlock();
	const createSwitchBlock = useSwitchBlock();

	return function ({ pageX, pageY }: MouseData) {
		if (renderer && renderingManager) {
			if (tool === TOOLS.GENERATOR) {
				createGeneratorBlock(pageX, pageY);
			}

			if (tool === TOOLS.SWITCH) {
				createSwitchBlock(pageX, pageY);
			}
		}
		setCursor(DEFAULT_CURSOR);
	};
}

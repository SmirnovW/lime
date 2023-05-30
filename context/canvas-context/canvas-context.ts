import { createContext } from 'react';
import { RenderingManager } from 'canvas/rendering-manager';
import { Renderer } from 'canvas/renderer/renderer';

interface CanvasContextInterface {
	renderingManager: RenderingManager | null;
	renderer: Renderer | null;
}

export const CanvasContext = createContext<CanvasContextInterface>({
	renderingManager: null,
	renderer: null,
});

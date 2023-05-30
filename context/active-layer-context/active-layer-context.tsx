import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { RenderingManager } from 'canvas/rendering-manager';
import { LayerInterface } from 'canvas/layer';

interface ActiveLayerContextInterface {
	activeLayer: LayerInterface | null;
	setActiveLayer: Dispatch<SetStateAction<LayerInterface | null>>;
}

export const ActiveLayerContext = createContext<ActiveLayerContextInterface>({
	activeLayer: null,
	setActiveLayer: () => {},
});

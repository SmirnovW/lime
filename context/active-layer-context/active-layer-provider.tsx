import React, { useState } from 'react';

import { ActiveLayerContext } from 'context/active-layer-context/active-layer-context';
import { LayerInterface } from 'canvas/layer';

type Props = {
	children: React.ReactNode;
};

/**
 * ToolbarProvider Component
 */
export const ActiveLayerProvider: React.FunctionComponent<Props> = ({
	children,
}) => {
	const [activeLayer, setActiveLayer] = useState<LayerInterface | null>(null);

	return (
		<ActiveLayerContext.Provider
			value={{
				activeLayer,
				setActiveLayer,
			}}
		>
			{children}
		</ActiveLayerContext.Provider>
	);
};

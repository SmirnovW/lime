import { useCallback, useContext, useEffect, useState } from 'react';
import { ActiveLayerContext } from 'context/active-layer-context/active-layer-context';
import { TextEditorContext } from 'context/text-editor-context/text-editor-context';
import { CanvasContext } from 'context/canvas-context/canvas-context';

export function useKeyboard() {
	const { renderingManager } = useContext(CanvasContext);
	const { activeLayer, setActiveLayer } = useContext(ActiveLayerContext);
	const { setEditable } = useContext(TextEditorContext);
	const { editable } = useContext(TextEditorContext);
	const [commandPressed, setCommandPressed] = useState<boolean>(false);

	const removeLayer = useCallback(() => {
		if (activeLayer && !editable) {
			const observers = activeLayer.getAllObservers();
			observers.forEach((observer) => {
				if (observer?.object) {
					renderingManager?.remove(observer.object);
				}
			});
			renderingManager?.remove(activeLayer);
			setActiveLayer(null);
		}
	}, [activeLayer, editable, renderingManager, setActiveLayer]);

	const handleKeyUp = useCallback(() => {
		setCommandPressed(false);
	}, []);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setEditable(false);
			}

			if (event.key === 'Meta') {
				setCommandPressed(true);
			}

			if (event.key === 'Backspace') {
				removeLayer();
			}
		},
		[
			setEditable,
			activeLayer,
			removeLayer,
			commandPressed,
			renderingManager,
			setActiveLayer,
		]
	);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, [activeLayer, editable, commandPressed, handleKeyDown, handleKeyUp]);
}

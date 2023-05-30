import { useContext } from 'react';
import { TextEditorContext } from 'context/text-editor-context/text-editor-context';
import { ActiveLayerContext } from 'context/active-layer-context/active-layer-context';
import { useCreateTextTool } from 'hooks/use-create-text-tool';
import { CanvasText } from 'canvas/canvas-text';
import { TYPES } from 'canvas/enums';

export const useSaveText = () => {
	const { editable, text, fontSize, bold, italic, textAlign } =
		useContext(TextEditorContext);
	const { activeLayer } = useContext(ActiveLayerContext);
	const createText = useCreateTextTool();

	return function () {
		let style = '';
		if (italic) style = `${style} italic`;
		if (bold) style = `${style} bold`;

		if (activeLayer) {
			const textChild = activeLayer.getChildByType(TYPES.TEXT);
			const options = textChild?.getOptions();

			if (editable && text !== '' && !textChild) {
				createText();
			} else if (
				editable &&
				(text !== '' || text !== options?.text) &&
				textChild
			) {
				(textChild as CanvasText).setText(
					text,
					fontSize,
					style,
					textAlign
				);
			}
		}
	};
};

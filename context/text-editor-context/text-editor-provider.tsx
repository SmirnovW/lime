import React, { useState } from 'react';
import { TextEditorContext } from 'context/text-editor-context/text-editor-context';
import { DEFAULT_FONT_SIZE } from 'constants/font';
import { COLORS } from 'constants/colors';

type Props = {
	children: React.ReactNode;
};

/**
 * TextEditorProvider Component
 */
export const TextEditorProvider: React.FunctionComponent<Props> = ({
	children,
}) => {
	const [editable, setEditable] = useState<boolean>(false);
	const [text, setText] = useState<string>('');
	const [fontSize, setFontSize] = useState<number>(DEFAULT_FONT_SIZE);
	const [textScale, setTextScale] = useState<number>(1);
	const [textAlign, setTextAlign] = useState<CanvasTextAlign>('left');

	const [bold, setBold] = useState<boolean>(false);
	const [italic, setItalic] = useState<boolean>(false);

	return (
		<TextEditorContext.Provider
			value={{
				editable,
				setEditable,
				text,
				setText,
				fontSize,
				setFontSize,
				textScale,
				setTextScale,
				bold,
				setBold,
				italic,
				setItalic,
				textAlign,
				setTextAlign,
			}}
		>
			{children}
		</TextEditorContext.Provider>
	);
};

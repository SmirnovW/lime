import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { DEFAULT_FONT_SIZE } from 'constants/font';
import { COLORS } from 'constants/colors';

interface TextEditorContextInterface {
	textAlign: CanvasTextAlign;
	setTextAlign: Dispatch<SetStateAction<CanvasTextAlign>>;
	bold: boolean;
	setBold: Dispatch<SetStateAction<boolean>>;
	italic: boolean;
	setItalic: Dispatch<SetStateAction<boolean>>;
	editable: boolean;
	setEditable: Dispatch<SetStateAction<boolean>>;
	text: string;
	setText: Dispatch<SetStateAction<string>>;
	fontSize: number;
	setFontSize: Dispatch<SetStateAction<number>>;
	textScale: number;
	setTextScale: Dispatch<SetStateAction<number>>;
}

export const TextEditorContext = createContext<TextEditorContextInterface>({
	editable: false,
	text: '',
	fontSize: DEFAULT_FONT_SIZE,
	setEditable: () => {},
	setText: () => {},
	setFontSize: () => {},
	textScale: 1,
	setTextScale: () => {},
	bold: false,
	setBold: () => {},
	italic: false,
	setItalic: () => {},
	textAlign: 'left',
	setTextAlign: () => {},
});

'use client';

import React, { useCallback, useState } from 'react';
//import Image from 'next/image'
//import styles from './page.module.css'

import { RenderingManager } from 'canvas/rendering-manager';
import { Renderer } from 'canvas/renderer/renderer';
import { Canvas } from 'components/canvas';
import { CanvasContext } from 'context/canvas-context';
import { ActiveLayerProvider } from 'context/active-layer-context/active-layer-provider';
import { ToolbarProvider } from 'context/toolbar-context/toolbar-provider';
import { Toolbar } from 'components/toolbar/toolbar';
import { Search } from 'components/search/search';

let renderingManager: RenderingManager | null = null;
let renderer: Renderer | null = null;

export default function Home() {
	const [, setCanvas] = useState<HTMLCanvasElement | null>(null);

	const setCanvasRef = useCallback((element: HTMLCanvasElement) => {
		setCanvas(element);
		const context = element.getContext('2d');
		if (context !== null) {
			element.style.width = `${window.innerWidth}px`;
			element.style.height = `${window.innerHeight}px`;

			const scale = window.devicePixelRatio;
			element.width = Math.floor(window.innerWidth * scale);
			element.height = Math.floor(window.innerHeight * scale);
			renderer = new Renderer(context, scale);
			renderingManager = new RenderingManager(renderer);
			/*
      animationsManager = new AnimationsManager();
      */
			renderer.drawGrid();
		}
	}, []);

	return (
		<>
			<ToolbarProvider>
				<CanvasContext.Provider value={{ renderingManager, renderer }}>
					<ActiveLayerProvider>
						<Search />
						<Canvas setCanvasRef={setCanvasRef} />
					</ActiveLayerProvider>
				</CanvasContext.Provider>
			</ToolbarProvider>
		</>
		/*
          <TextEditorProvider>
            <div className="App">
              <TextEditor />
            </div>
          </TextEditorProvider>
*/
	);
}

import React, { useState, useContext, useRef } from 'react';

import styles from './search.module.css';
import { fetchNodes } from 'services/nodes';
import { ToolbarContext } from 'context/toolbar-context/toolbar-context';
import { useClickOutside } from 'hooks/use-click-outside';
import { Icon } from 'components/icon/icon';
import { NodeItemResponse } from 'services/types';

/**
 * Search Component
 */

export const Search = () => {
	const { setTool, setCursor } = useContext(ToolbarContext);
	const [searchText, setSearchText] = useState('');
	const [suggestions, setSuggestions] = useState<NodeItemResponse[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);

	const containerRef = useRef();

	useClickOutside(containerRef, () => {
		setShowSuggestions(false);
	});

	const handleInputChange = (event) => {
		setSearchText(event.target.value);

		fetchNodes().then((data) => {
			if (data?.nodes) {
				setSuggestions(data?.nodes);
				setShowSuggestions(true);
			}
		});
	};

	const handleInputClick = () => {
		if (suggestions.length) {
			setShowSuggestions(true);
		}
	};

	const handleSuggestionClick = (suggestion) => {
		setTool(suggestion);
		setCursor('copy');
		setShowSuggestions(false);
	};

	return (
		<div className={styles.container} ref={containerRef}>
			<input
				type="text"
				value={searchText}
				onChange={handleInputChange}
				onClick={handleInputClick}
				placeholder="Search..."
				className={styles.input}
			/>
			<div className={styles.icon}>
				<Icon name="Search" />
			</div>
			{showSuggestions && suggestions.length && (
				<div className={styles.suggestions}>
					<ul className={styles.suggestionsList}>
						{suggestions.map(
							(suggestion: NodeItemResponse, index) => (
								<li
									key={index}
									onClick={() =>
										handleSuggestionClick(suggestion.key)
									}
									className={styles.suggestion}
								>
									<Icon
										className={styles.suggestionsIcon}
										name={suggestion.icon}
									/>
									<span>{suggestion.label}</span>
								</li>
							)
						)}
					</ul>
				</div>
			)}
		</div>
	);
};

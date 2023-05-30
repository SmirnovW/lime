import React from 'react';
import classNames from 'classnames';

import { Icon } from 'components/icon/icon';

import styles from './icon-button.module.css';

type Props = {
	value?: string | number;
	fill?: boolean;
	className?: string;
	icon: string;
	color?: ColorType;
	size?: 'responsive' | 'xsmall' | 'small' | 'medium' | 'large';
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

/**
 * IconButton Component
 */
export const IconButton: React.FC<Props> = ({
	value,
	onClick,
	color = 'main-dark',
	size = 'small',
	icon,
	className = '',
	fill = false,
}) => {
	return (
		<button
			className={classNames(
				className,
				color,
				styles.button,
				styles[size],
				{
					[styles.fill]: fill,
				}
			)}
			value={value}
			type="button"
			onClick={onClick}
		>
			<Icon name={icon} size={size} />
		</button>
	);
};

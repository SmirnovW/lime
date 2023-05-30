import { MutableRefObject, useEffect } from 'react';

export function useClickOutside(
	targets:
		| MutableRefObject<HTMLElement | undefined | null>
		| MutableRefObject<HTMLElement | undefined | null>[],
	callback: () => void
) {
	useEffect(() => {
		const listener = (event: Event) => {
			const isClickInside = Array.isArray(targets)
				? targets.some((target) =>
						target?.current?.contains(event.target as Node)
				  )
				: targets?.current?.contains(event.target as Node);

			if (!isClickInside) {
				callback();
			}
		};
		document.addEventListener('click', listener);

		return () => {
			document.removeEventListener('click', listener);
		};
	}, []);
}

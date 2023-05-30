export function canvasScaleToPercentage(scale: number) {
	return Math.max(10, Math.min(Math.ceil((scale * 200) / 10), 200));
}

export function zoomPercentageToScale(percentage: number) {
	return (percentage * 10) / 200;
}

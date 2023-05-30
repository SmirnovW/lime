export function getCorners(
	x: number,
	y: number,
	w: number,
	h: number
): {
	topLeftCorner: { x: number; y: number };
	topRightCorner: { x: number; y: number };
	bottomLeftCorner: { x: number; y: number };
	bottomRightCorner: { x: number; y: number };
} {
	return {
		topLeftCorner: { x, y },
		topRightCorner: { x: x + w, y },
		bottomLeftCorner: { x, y: y + h },
		bottomRightCorner: { x: x + w, y: y + h },
	};
}

/*
 * https://roblouie.com/article/617/transforming-mouse-coordinates-to-canvas-coordinates/
 * This method has been modified. The original method doesn't take in account current scale.
 * https://math.hws.edu/graphicsbook/c6/s5.html#webgl.5.1
 * */

export function getTransformedPoint(
	x: number,
	y: number,
	transform: {
		scaleX: number;
		skewY: number;
		skewX: number;
		scaleY: number;
		translationX: number;
		translationY: number;
		initialScale: number;
	}
) {
	const inverseZoom = 1 / (transform.scaleX / transform.initialScale);

	const transformedX =
		inverseZoom * x -
		inverseZoom * (transform.translationX / transform.initialScale);
	const transformedY =
		inverseZoom * y -
		inverseZoom * (transform.translationY / transform.initialScale);
	return { x: transformedX, y: transformedY };
}

export function isPointInTriangle(
	coordinates: TriangleCoordinatesType,
	point: { x: number; y: number }
) {
	const { top, center, bottom } = coordinates;

	const barycentric = calculateBarycentricCoordinates(
		top,
		center,
		bottom,
		point
	);

	const u = barycentric.u;
	const v = barycentric.v;
	const w = barycentric.w;

	return u >= 0 && v >= 0 && w >= 0 && u + v + w <= 1;
}

function calculateBarycentricCoordinates(
	A: { x: number; y: number },
	B: { x: number; y: number },
	C: { x: number; y: number },
	P: { x: number; y: number }
) {
	const v0 = [C.x - A.x, C.y - A.y];
	const v1 = [B.x - A.x, B.y - A.y];
	const v2 = [P.x - A.x, P.y - A.y];

	const dot00 = dotProduct(v0, v0);
	const dot01 = dotProduct(v0, v1);
	const dot02 = dotProduct(v0, v2);
	const dot11 = dotProduct(v1, v1);
	const dot12 = dotProduct(v1, v2);

	const denom = dot00 * dot11 - dot01 * dot01;

	const v = (dot11 * dot02 - dot01 * dot12) / denom;
	const w = (dot00 * dot12 - dot01 * dot02) / denom;
	const u = 1 - v - w;

	return { u, v, w };
}

function dotProduct(v1, v2) {
	return v1[0] * v2[0] + v1[1] * v2[1];
}

export function calculateControlPoints(startX, startY, endX, endY) {
	const controlX = startX + (endX - startX) / 2;
	const controlY = endY;

	return { controlX, controlY };
}

export function isRectangleOutside(containerRect, innerRect) {
	if (
		innerRect.x + innerRect.width < containerRect.x || // Right edge of B is to the left of A
		innerRect.y + innerRect.height < containerRect.y || // Bottom edge of B is above A
		innerRect.x > containerRect.x + containerRect.width || // Left edge of B is to the right of A
		innerRect.y > containerRect.y + containerRect.height // Top edge of B is below A
	) {
		// B is entirely outside of A
		return true;
	}

	// B is either inside A or partially outside
	return false;
}

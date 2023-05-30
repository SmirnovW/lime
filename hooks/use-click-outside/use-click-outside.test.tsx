import React, { useRef } from 'react';
import { render, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { useClickOutside } from './use-click-outside';

const callbackMock = jest.fn();

const Dummy = () => {
	const refTarget = useRef();

	useClickOutside(refTarget, callbackMock);

	return (
		<div>
			<div data-testid="target" ref={refTarget}>
				Target Element
				<div data-testid="child">
					<span data-testid="inside">Inside Element</span>
				</div>
			</div>
			<div data-testid="outside">Outside Element</div>
		</div>
	);
};

function renderComponent() {
	return render(<Dummy />);
}

afterEach(() => {
	callbackMock.mockReset();
});

describe('useClickOutside', () => {
	const user = userEvent.setup();

	it('should call callback when clicking outside the target', async () => {
		renderComponent();
		const targetElement = screen.getByTestId('target');
		const outsideElement = screen.getByTestId('outside');

		await act(async () => await user.click(outsideElement));

		expect(callbackMock).toHaveBeenCalled();

		await act(async () => await user.click(targetElement));
		expect(callbackMock).toHaveBeenCalledTimes(1);
	});

	it('should not call callback when clicking inside the target', async () => {
		renderComponent();
		const insideElement = screen.getByTestId('inside');

		await act(async () => await user.click(insideElement));

		expect(callbackMock).not.toHaveBeenCalled();
	});
});

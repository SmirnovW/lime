import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	return NextResponse.json({
		nodes: [
			{
				label: 'Generator',
				key: 'generator',
				icon: 'Dog',
			},
			{
				label: 'Switch',
				key: 'switch',
				icon: 'Cat',
			},
		],
	});
}

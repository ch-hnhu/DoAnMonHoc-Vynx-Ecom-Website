import { useEffect } from "react";

export default function WorldMapCard() {
	useEffect(() => {
		// jsVectorMap - World map
		if (window.jsVectorMap) {
			const mapEl = document.querySelector("#world-map");
			if (mapEl && !mapEl.dataset.rendered) {
				new window.jsVectorMap({
					selector: "#world-map",
					map: "world",
				});
				mapEl.dataset.rendered = "1";
			}
		}

		// Sparkline charts
		if (window.ApexCharts) {
			const sparklines = [
				{
					selector: "#sparkline-1",
					data: [1000, 1200, 920, 927, 931, 1027, 819, 930, 1021],
				},
				{
					selector: "#sparkline-2",
					data: [515, 519, 520, 522, 652, 810, 370, 627, 319, 630, 921],
				},
				{
					selector: "#sparkline-3",
					data: [15, 19, 20, 22, 33, 27, 31, 27, 19, 30, 21],
				},
			];

			sparklines.forEach((config) => {
				const el = document.querySelector(config.selector);
				if (el && !el.dataset.rendered) {
					const options = {
						series: [{ data: config.data }],
						chart: {
							type: "area",
							height: 50,
							sparkline: {
								enabled: true,
							},
						},
						stroke: {
							curve: "straight",
						},
						fill: {
							opacity: 0.3,
						},
						yaxis: {
							min: 0,
						},
						colors: ["#DCE6EC"],
					};

					const chart = new window.ApexCharts(el, options);
					chart.render();
					el.dataset.rendered = "1";
				}
			});
		}
	}, []);

	return (
		<div className='card text-white bg-primary bg-gradient border-primary mb-4'>
			<div className='card-header border-0'>
				<h3 className='card-title'>Sales Value</h3>
				<div className='card-tools'>
					<button
						type='button'
						className='btn btn-primary btn-sm'
						data-lte-toggle='card-collapse'>
						<i data-lte-icon='expand' className='bi bi-plus-lg'></i>
						<i data-lte-icon='collapse' className='bi bi-dash-lg'></i>
					</button>
				</div>
			</div>
			<div className='card-body'>
				<div id='world-map' style={{ height: "220px" }}></div>
			</div>
			<div className='card-footer border-0'>
				<div className='row'>
					<div className='col-4 text-center'>
						<div id='sparkline-1' className='text-dark'></div>
						<div className='text-white'>Visitors</div>
					</div>
					<div className='col-4 text-center'>
						<div id='sparkline-2' className='text-dark'></div>
						<div className='text-white'>Online</div>
					</div>
					<div className='col-4 text-center'>
						<div id='sparkline-3' className='text-dark'></div>
						<div className='text-white'>Sales</div>
					</div>
				</div>
			</div>
		</div>
	);
}
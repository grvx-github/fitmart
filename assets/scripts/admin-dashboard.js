document.addEventListener("DOMContentLoaded", () => {
	const miniCharts = [
		{ id: "salesChartMini", color: "#4caf50" },
		{ id: "ordersChartMini", color: "#fbc02d" },
		{ id: "usersChartMini", color: "#2196f3" },
		{ id: "reviewsChartMini", color: "#9c27b0" }
	];

	miniCharts.forEach(({ id, color }) => {
		const ctx = document.getElementById(id);
		if (!ctx) return;
		new Chart(ctx, {
			type: "line",
			data: {
				labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				datasets: [{
					data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
					borderColor: color,
					backgroundColor: `${color}33`,
					fill: true,
					tension: 0.4
				}]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { display: false },
					tooltip: { enabled: true } // tooltips show on hover
				},
				scales: {
					x: { display: false },
					y: { display: false }
				},
				elements: {
					point: { radius: 0 }
				},
				interaction: {
					mode: 'index',
					intersect: false
				}
			}
		});

	});

	// Recent Orders Graph
	const recentCtx = document.getElementById("recentOrdersChart");
	new Chart(recentCtx, {
		type: "line",
		data: {
			labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
			datasets: [{
				label: "Orders",
				data: [50, 70, 60, 90],
				borderColor: "#fbc02d",
				backgroundColor: "#fbc02d33",
				fill: true,
				tension: 0.4,
				pointRadius: 5,
				pointHoverRadius: 7
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false, // keeps chart height/width reasonable
			plugins: {
				legend: { display: true },
				tooltip: { enabled: true, mode: 'index', intersect: false }
			},
			interaction: { mode: 'index', intersect: false },
			scales: {
				x: {
					display: true,
					title: { display: true, text: 'Weeks' },
					ticks: {
						maxRotation: 0, // prevents labels from rotating too much
						autoSkip: false, // optionally set to true if many labels
						padding: 10
					},
					grid: { display: false }
				},
				y: {
					beginAtZero: true,
					title: { display: true, text: 'Orders' },
					grid: { drawBorder: false }
				}
			}
		}
	});



	// Earnings & Profit Chart
	const earningsCtx = document.getElementById("earningsChart");
	new Chart(earningsCtx, {
		type: "bar",
		data: {
			labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
			datasets: [
				{
					label: "Revenue",
					data: [42000, 48000, 50000, 47000, 53000, 60000],
					backgroundColor: "#2196f3cc", // light blue
					borderRadius: 6,
					barThickness: 20, // narrower bars
				},
				{
					label: "Profit",
					data: [12000, 15000, 17000, 14000, 18000, 21000],
					backgroundColor: "#1565c0cc", // darker blue
					borderRadius: 6,
					barThickness: 20,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: true,
					labels: { color: "#333", font: { size: 12 } },
				},
				tooltip: { enabled: true },
			},
			scales: {
				x: {
					ticks: { color: "#555", font: { size: 11 } },
					grid: { display: false },
				},
				y: {
					beginAtZero: true,
					ticks: { color: "#555", font: { size: 11 } },
					grid: { color: "#eee" },
				},
			},
		},
	});

});

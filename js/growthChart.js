const chartGrowth = document.getElementById("chartGrowth");
const filterMonthly = document.getElementById("filter_monthly");
const filterGrowth = document.getElementById("filter_growth");
let chartGrowthCanvas = null;

// Array of month labels
const monthLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Function to get filtered data while keeping original positions
const getFilteredData = (data, monthly_filter) => {
    if (monthly_filter === null) {
        return data;
    } else {
        const index = parseInt(monthly_filter) - 1;
        const filteredData = new Array(monthLabels.length).fill(null);
        filteredData[index] = data[index];
        return filteredData;
    }
};

// Update chart
const updateChartGrowth = (labels, quantityData, revenueData, monthly_filter = null) => {
    const filter_quantityData = getFilteredData(quantityData, monthly_filter);
    const filter_revenueData = getFilteredData(revenueData, monthly_filter);

    if (chartGrowthCanvas) {
        chartGrowthCanvas.destroy();
    }

    let datasets = [];
    if (filterGrowth.value === "0" || filterGrowth.value === "1") {
        datasets.push({
            label: 'Quantity Growth',
            data: filter_quantityData,
            borderColor: "rgb(255, 1, 1)",
            backgroundColor: "rgb(255, 1, 1)",
            fill: false,
        });
    }
    if (filterGrowth.value === "0" || filterGrowth.value === "2") {
        datasets.push({
            label: 'Revenue Growth',
            data: filter_revenueData,
            borderColor: "rgb(255, 224, 47)",
            backgroundColor: "rgb(255, 224, 47)",
            fill: false,
        });
    }

    chartGrowthCanvas = new Chart(chartGrowth, {
        type: "line",
        data: {
            labels: labels,
            datasets: datasets
        },
    });
};

// Render chart with optional monthly filter
const renderChartGrowth = (monthly_filter = null) => {
    fetch('./json/revenue&quantitygrowth.json')
        .then(response => response.json())
        .then(response => {
            const quantityData = response.datasets.find(dataset => dataset.labels === "Quantity Growth").data;
            const revenueData = response.datasets.find(dataset => dataset.labels === "Revenue Growth").data;

            updateChartGrowth(monthLabels, quantityData, revenueData, monthly_filter);
        })
        .catch(err => {
            console.log(err);
        });
};

renderChartGrowth();

// Update chart based on monthly filter
filterMonthly.addEventListener("input", function () {
    let month = filterMonthly.value ? filterMonthly.value : null;
    renderChartGrowth(month);
});

// Update chart based on growth filter
filterGrowth.addEventListener("input", function () {
    let month = filterMonthly.value ? filterMonthly.value : null;
    renderChartGrowth(month);
});

const chartGrowth = document.getElementById("chartGrowth");
const filterMonthly = document.getElementById("filter_monthly"); 
const filterGrowth = document.getElementById("filter_growth");
let chartGrowthCanvas = null;

// update chart
const updateChartGrowth = (labels, data, monthly_filter = null) => {
    let filter_labels = labels;
    let filter_data = data;

    if (monthly_filter !== null) {
        let index = parseInt(monthly_filter) - 1;
        filter_labels = [labels[index]];
        filter_data = [data[index]];
    } else {
        filter_labels = labels;
        filter_data = data;
    }

    if (chartGrowthCanvas) {
        chartGrowthCanvas.destroy();
    }

    chartGrowthCanvas = new Chart(chartGrowth, {
        type: "line",
        data: {
            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            datasets: [
                {
                    label: 'Quantity and Revenue Growth',
                    data: filter_data,
                    borderWidth: 2
                }
            ],
        },
    });
}

// menampilkan data chart
const renderChartGrowth = (monthly_filter = null) => {
    fetch('./json/revenue&quantitygrowth.json')
        .then(response => response.json())
        .then(response => {
            let datasets = response.datasets[0];
            updateChartGrowth(datasets.labels, datasets.data, monthly_filter);
        })
        .catch(err => {
            console.log(err);
        });
};

renderChartGrowth();

// update chart berdasarkan filter bulanan
filterMonthly.addEventListener("input", function () {
    let month = filterMonthly.value ? filterMonthly.value : null;
    renderChartGrowth(month);
});

// update chart berdasarkan kategori (Revenue/Quantity)
filterGrowth.addEventListener("input", function () {
    fetch('./json/revenue&quantitygrowth.json')
        .then(response => response.json())
        .then(response => {
            let selectedCategory = filterGrowth.value;
            let datasets = response.datasets[selectedCategory ? selectedCategory - 1 : 0];
            let month = filterMonthly.value ? filterMonthly.value : null;
            updateChartGrowth(datasets.labels, datasets.data, month);
        })
        .catch(err => {
            console.log(err);
        });
});

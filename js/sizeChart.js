const chartSize = document.getElementById("chartSize");
const filterSize = document.getElementById("filter_size");
let chartSizeCanvas = null;

// update chart
const updateChartSize = (labels, data, monthly_filter = null) => {
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

    if (chartSizeCanvas) {
        chartSizeCanvas.destroy();
    }

    chartSizeCanvas = new Chart(chartSize, {
        type: "bar",
        data: {
            labels: filter_labels,
            datasets: [
                {
                    label: 'Pizza Sales based on Size',
                    data: filter_data,
                    borderWidth: 2
                }
            ],
        },
    });
}

// menampilkan data chart
const renderChartSize = (monthly_filter = null) => {
    fetch('./json/salesPizzabySize.json')
        .then(response => response.json())
        .then(response => {
            let datasets = response.datasets[0];
            updateChartSize(datasets.labels, datasets.data, monthly_filter);
        })
        .catch(err => {
            console.log(err);
        });
};

renderChartSize();

// update chart berdasarkan filter bulanan
filterMonthly.addEventListener("input", function () {
    let month = filterMonthly.value ? filterMonthly.value : null;
    renderChartSize(month);
});

// update chart berdasarkan kategori 
filterSize.addEventListener("input", function () {
    fetch('./json/salesPizzabySize.json')
        .then(response => response.json())
        .then(response => {
            let selectedSize = filterSize.value;
            let datasets = response.datasets[selectedSize ? selectedSize - 1 : 0];
            let month = filterMonthly.value ? filterMonthly.value : null;
            updateChartSize(datasets.labels, datasets.data, month);
        })
        .catch(err => {
            console.log(err);
        });
});

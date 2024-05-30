const chartCategory = document.getElementById("chartCategory");
const filterMonthly = document.getElementById("filter_monthly");
const filterCategory = document.getElementById("filter_category");
let chartCategoryCanvas = null;

// update chart
const updateChartCategory = (labels, data, monthly_filter = null) => {
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

    if (chartCategoryCanvas) {
        chartCategoryCanvas.destroy();
    }

    chartCategoryCanvas = new Chart(chartCategory, {
        type: "line",
        data: {
            labels: filter_labels,
            datasets: [
                {
                    label: 'Pizza Sales based on Category',
                    data: filter_data,
                    borderWidth: 1
                }
            ],
        },
    });
}

// menampilkan data chart
const renderChartCategory = (monthly_filter = null) => {
    fetch('./json/salesPizzabyCategory.json')
        .then(response => response.json())
        .then(response => {
            let datasets = response.datasets[0];
            updateChartCategory(datasets.labels, datasets.data, monthly_filter);
        })
        .catch(err => {
            console.log(err);
        });
};

renderChartCategory();

// update chart berdasarkan filter bulanan
filterMonthly.addEventListener("input", function () {
    let month = filterMonthly.value ? filterMonthly.value : null;
    renderChartCategory(month);
});

// update chart berdasarkan kategori 
filterCategory.addEventListener("input", function () {
    fetch('./json/salesPizzabyCategory.json')
        .then(response => response.json())
        .then(response => {
            let selectedCategory = filterCategory.value;
            let datasets = response.datasets[selectedCategory ? selectedCategory - 1 : 0];
            let month = filterMonthly.value ? filterMonthly.value : null;
            updateChartCategory(datasets.labels, datasets.data, month);
        })
        .catch(err => {
            console.log(err);
        });
});

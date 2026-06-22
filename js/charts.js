let metricChart = null;
let categoryChart = null;
let trendChart = null;

function updateCharts(data){

    updateMetricChart(data);

    buildCategoryChart(data);

    buildTrendChart(data);

}

function updateMetricChart(data){

    const metric =
    document.getElementById(
        "metricSelector"
    ).value;

    const brands =
    [...new Set(
        data.map(
            x => String(x.brand).trim()
        )
    )].sort();

    const brandTotals = {};

    brands.forEach(brand=>{

        brandTotals[brand] = {
            gmv:0,
            unit:0,
            payout:0
        };

    });

    data.forEach(row=>{

        const brand =
        String(row.brand).trim();

        brandTotals[brand].gmv +=
        Number(row.gmv) || 0;

        brandTotals[brand].unit +=
        Number(row.unit) || 0;

        brandTotals[brand].payout +=
        Number(row.payout) || 0;

    });

    const labels = [];
    const values = [];

    let totalGMV = 0;
    let totalUnit = 0;
    let totalPayout = 0;

    Object.values(brandTotals)
    .forEach(x=>{

        totalGMV += x.gmv;
        totalUnit += x.unit;
        totalPayout += x.payout;

    });

    brands.forEach(brand=>{

        labels.push(brand);

        const item =
        brandTotals[brand];

        if(metric==="gmv"){

            values.push(item.gmv);

        }

        else if(metric==="unit"){

            values.push(item.unit);

        }

        else if(metric==="payout"){

            values.push(item.payout);

        }

        else if(metric==="asp"){

            values.push(
                item.unit > 0
                ? item.gmv/item.unit
                : 0
            );

        }

        else if(metric==="gmvContribution"){

            values.push(
                totalGMV > 0
                ? (item.gmv/totalGMV)*100
                : 0
            );

        }

        else if(metric==="unitContribution"){

            values.push(
                totalUnit > 0
                ? (item.unit/totalUnit)*100
                : 0
            );

        }

        else if(metric==="payoutContribution"){

            values.push(
                totalPayout > 0
                ? (item.payout/totalPayout)*100
                : 0
            );

        }

    });

    if(metricChart){

        metricChart.destroy();

    }

    metricChart =
    new Chart(

        document.getElementById(
            "metricChart"
        ),

        {

            type:"bar",

            data:{

                labels:labels,

                datasets:[{

                    label:metric,

                    data:values

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

    document.getElementById(
        "metricChartTitle"
    ).innerText =
    metric.toUpperCase() +
    " By Brand";

}

function buildCategoryChart(data){

    const categoryMap = {};

    data.forEach(row=>{

        const category =
        row.category || "NA";

        categoryMap[category] =
        (categoryMap[category] || 0)
        +
        (Number(row.gmv) || 0);

    });

    if(categoryChart){

        categoryChart.destroy();

    }

    categoryChart =
    new Chart(

        document.getElementById(
            "categoryChart"
        ),

        {

            type:"pie",

            data:{

                labels:
                Object.keys(
                    categoryMap
                ),

                datasets:[{

                    data:
                    Object.values(
                        categoryMap
                    )

                }]

            },

            options:{

                responsive:true

            }

        }

    );

}

function buildTrendChart(data){

    const trendMap = {};

    data.forEach(row=>{

        const label =
        `${String(row.day).padStart(2,"0")}-${monthNames[row.month]}`;

        trendMap[label] =
        (trendMap[label] || 0)
        +
        (Number(row.gmv) || 0);

    });

    if(trendChart){

        trendChart.destroy();

    }

    trendChart =
    new Chart(

        document.getElementById(
            "trendChart"
        ),

        {

            type:"line",

            data:{

                labels:
                Object.keys(
                    trendMap
                ),

                datasets:[{

                    label:"GMV",

                    data:
                    Object.values(
                        trendMap
                    )

                }]

            },

            options:{

                responsive:true

            }

        }

    );

}
let metricChart = null;
let brandChart = null;
let categoryChart = null;
let trendChart = null;

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
    const totalData = {
        gmv:0,
        unit:0,
        payout:0
    };

    brands.forEach(
        brand =>
        brandTotals[brand] = 0
    );

    data.forEach(row=>{

        totalData.gmv += Number(row.gmv) || 0;
        totalData.unit += Number(row.unit) || 0;
        totalData.payout += Number(row.payout) || 0;

        if(metric==="gmv"){

            brandTotals[row.brand] +=
            Number(row.gmv) || 0;

        }

        else if(metric==="unit"){

            brandTotals[row.brand] +=
            Number(row.unit) || 0;

        }

        else if(metric==="payout"){

            brandTotals[row.brand] +=
            Number(row.payout) || 0;

        }

        else if(metric==="asp"){

            if(!brandTotals[row.brand+"_gmv"]){

                brandTotals[row.brand+"_gmv"] = 0;
                brandTotals[row.brand+"_unit"] = 0;

            }

            brandTotals[row.brand+"_gmv"] +=
            Number(row.gmv) || 0;

            brandTotals[row.brand+"_unit"] +=
            Number(row.unit) || 0;

        }

        else if(metric==="gmvContribution"){

            brandTotals[row.brand] +=
            Number(row.gmv) || 0;

        }

        else if(metric==="unitContribution"){

            brandTotals[row.brand] +=
            Number(row.unit) || 0;

        }

        else if(metric==="payoutContribution"){

            brandTotals[row.brand] +=
            Number(row.payout) || 0;

        }

    });

    const labels = [];
    const values = [];

    brands.forEach(brand=>{

        labels.push(brand);

        if(metric==="asp"){

            const gmv =
            brandTotals[brand+"_gmv"] || 0;

            const unit =
            brandTotals[brand+"_unit"] || 0;

            values.push(
                unit > 0
                ? gmv / unit
                : 0
            );

        }

        else if(metric==="gmvContribution"){

            values.push(
                totalData.gmv > 0
                ?
                (brandTotals[brand] / totalData.gmv) * 100
                :
                0
            );

        }

        else if(metric==="unitContribution"){

            values.push(
                totalData.unit > 0
                ?
                (brandTotals[brand] / totalData.unit) * 100
                :
                0
            );

        }

        else if(metric==="payoutContribution"){

            values.push(
                totalData.payout > 0
                ?
                (brandTotals[brand] / totalData.payout) * 100
                :
                0
            );

        }

        else{

            values.push(
                brandTotals[brand]
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
                datasets:[
                    {
                        label:metric,
                        data:values
                    }
                ]
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

function updateCharts(data){

    buildBrandChart(data);
    buildCategoryChart(data);
    buildTrendChart(data);

}

function buildBrandChart(data){

    const brandMap = {};

    data.forEach(row=>{

        const brand =
        row.brand || "NA";

        brandMap[brand] =
        (brandMap[brand] || 0)
        +
        (Number(row.gmv) || 0);

    });

    const topBrands =
    Object.entries(brandMap)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,10);

    if(brandChart){
        brandChart.destroy();
    }

    brandChart =
    new Chart(
        document.getElementById(
            "brandChart"
        ),
        {
            type:"bar",

            data:{
                labels:
                topBrands.map(x=>x[0]),

                datasets:[
                    {
                        label:"GMV",
                        data:
                        topBrands.map(x=>x[1])
                    }
                ]
            },

            options:{
                responsive:true
            }
        }
    );

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
                Object.keys(categoryMap),

                datasets:[
                    {
                        data:
                        Object.values(categoryMap)
                    }
                ]
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

        const dateLabel =
        `${String(row.day).padStart(2,"0")}-${monthNames[row.month]}`;

        trendMap[dateLabel] =
        (trendMap[dateLabel] || 0)
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
                Object.keys(trendMap),

                datasets:[
                    {
                        label:"Daily GMV",
                        data:
                        Object.values(trendMap)
                    }
                ]
            },

            options:{
                responsive:true
            }
        }
    );

}
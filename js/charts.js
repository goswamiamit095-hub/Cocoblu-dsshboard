let brandChart = null;
let categoryChart = null;
let trendChart = null;

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

    const labels =
    topBrands.map(x=>x[0]);

    const values =
    topBrands.map(x=>x[1]);

    if(brandChart){
        brandChart.destroy();
    }

    brandChart =
    new Chart(
        document.getElementById("brandChart"),
        {
            type:"bar",
            data:{
                labels:labels,
                datasets:[{
                    label:"GMV",
                    data:values
                }]
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
        document.getElementById("categoryChart"),
        {
            type:"pie",
            data:{
                labels:Object.keys(categoryMap),
                datasets:[{
                    data:Object.values(categoryMap)
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
        `${row.month}-${row.year}`;

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
        document.getElementById("trendChart"),
        {
            type:"line",
            data:{
                labels:Object.keys(trendMap),
                datasets:[{
                    label:"GMV",
                    data:Object.values(trendMap)
                }]
            },
            options:{
                responsive:true
            }
        }
    );

}

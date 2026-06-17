function buildMetricTable(data){

    const metric =
    document.getElementById(
        "metricSelector"
    ).value;

    const brands = [
        ...new Set(
            data.map(
                x => String(x.brand).trim()
            )
        )
    ].sort();

    const dateMap = {};

    data.forEach(row=>{

        const dateKey =
        `${String(row.day).padStart(2,"0")}-${monthNames[row.month]}-${row.year}`;

        if(!dateMap[dateKey]){

            dateMap[dateKey] = {};

            brands.forEach(
                brand =>
                dateMap[dateKey][brand] = 0
            );

            dateMap[dateKey].total = 0;
        }

        let value = 0;

        if(metric==="gmv"){
            value = Number(row.gmv)||0;
        }

        if(metric==="unit"){
            value = Number(row.unit)||0;
        }

        if(metric==="payout"){
            value = Number(row.payout)||0;
        }

        dateMap[dateKey][row.brand] += value;
        dateMap[dateKey].total += value;

    });

    let headHTML =
    "<tr><th>Date</th>";

    brands.forEach(
        brand =>
        headHTML += `<th>${brand}</th>`
    );

    headHTML +=
    "<th>Total</th></tr>";

    document.querySelector(
        "#metricTable thead"
    ).innerHTML = headHTML;

    let bodyHTML = "";

    const grandTotal = {};

    brands.forEach(
        brand =>
        grandTotal[brand] = 0
    );

    let overallTotal = 0;

    Object.entries(dateMap)

    .forEach(([date,row])=>{

        bodyHTML += `<tr><td>${date}</td>`;

        brands.forEach(brand=>{

            grandTotal[brand] += row[brand];

            bodyHTML +=
            `<td>${Math.round(row[brand]).toLocaleString("en-IN")}</td>`;

        });

        overallTotal += row.total;

        bodyHTML +=
        `<td>${Math.round(row.total).toLocaleString("en-IN")}</td></tr>`;

    });

    bodyHTML +=
    `<tr style="font-weight:bold;background:#f2f2f2;"><td>TOTAL</td>`;

    brands.forEach(brand=>{

        bodyHTML +=
        `<td>${Math.round(grandTotal[brand]).toLocaleString("en-IN")}</td>`;

    });

    bodyHTML +=
    `<td>${Math.round(overallTotal).toLocaleString("en-IN")}</td></tr>`;

    document.querySelector(
        "#metricTable tbody"
    ).innerHTML = bodyHTML;

}

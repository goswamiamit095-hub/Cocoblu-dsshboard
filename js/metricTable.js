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
const dateTotals = {};

data.forEach(row=>{

    const dateKey =
    `${String(row.day).padStart(2,"0")}-${monthNames[row.month]}-${row.year}`;

    if(!dateTotals[dateKey]){

        dateTotals[dateKey] = {
            gmv:0,
            unit:0,
            payout:0
        };
    }

    dateTotals[dateKey].gmv += Number(row.gmv)||0;
    dateTotals[dateKey].unit += Number(row.unit)||0;
    dateTotals[dateKey].payout += Number(row.payout)||0;

});
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

else if(metric==="unit"){
    value = Number(row.unit)||0;
}

else if(metric==="payout"){
    value = Number(row.payout)||0;
}

else if(metric==="asp"){

    value =
    (Number(row.unit)||0) > 0
    ?
    (Number(row.gmv)||0) /
    (Number(row.unit)||0)
    :
    0;
}
        else if(metric==="gmvContribution"){

    const total =
    dateTotals[dateKey].gmv;

    value =
    total > 0
    ?
    ((Number(row.gmv)||0) / total) * 100
    :
    0;
}

else if(metric==="unitContribution"){

    const total =
    dateTotals[dateKey].unit;

    value =
    total > 0
    ?
    ((Number(row.unit)||0) / total) * 100
    :
    0;
}

else if(metric==="payoutContribution"){

    const total =
    dateTotals[dateKey].payout;

    value =
    total > 0
    ?
    ((Number(row.payout)||0) / total) * 100
    :
    0;
}
        if(metric==="asp"){

    if(!dateMap[dateKey][row.brand + "_gmv"]){
        dateMap[dateKey][row.brand + "_gmv"] = 0;
        dateMap[dateKey][row.brand + "_unit"] = 0;
    }

    dateMap[dateKey][row.brand + "_gmv"] += Number(row.gmv) || 0;
    dateMap[dateKey][row.brand + "_unit"] += Number(row.unit) || 0;

}
else{

    if(metric==="asp"){

    if(!dateMap[dateKey][row.brand+"_gmv"]){
        dateMap[dateKey][row.brand+"_gmv"] = 0;
        dateMap[dateKey][row.brand+"_unit"] = 0;
    }

    dateMap[dateKey][row.brand+"_gmv"] += Number(row.gmv) || 0;
    dateMap[dateKey][row.brand+"_unit"] += Number(row.unit) || 0;
}
else{

    dateMap[dateKey][row.brand] += value;
    dateMap[dateKey].total += value;

}

}

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

    if(metric==="asp"){

        const gmv =
        row[brand+"_gmv"] || 0;

        const unit =
        row[brand+"_unit"] || 0;

        const asp =
        unit > 0
        ? gmv / unit
        : 0;

        bodyHTML +=
        `<td>${asp.toFixed(2)}</td>`;

    }

    else{

        grandTotal[brand] += row[brand];

        bodyHTML +=
        `<td>${
            metric.includes("Contribution")
            ? row[brand].toFixed(2) + "%"
            : Math.round(row[brand]).toLocaleString("en-IN")
        }</td>`;

    }

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

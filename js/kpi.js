function calculateKPIs(data){

    let totalGMV = 0;
    let totalUnits = 0;
    let totalPayout = 0;

    const asinSet =
    new Set();

    data.forEach(row=>{

        totalGMV +=
        Number(row.gmv) || 0;

        totalUnits +=
        Number(row.unit) || 0;

        totalPayout +=
        Number(row.payout) || 0;

        if(row.asin){
            asinSet.add(
                row.asin
            );
        }

    });

    const totalASP =

    totalUnits > 0

    ?

    totalGMV / totalUnits

    :

    0;

    document.getElementById(
        "totalGMV"
    ).innerText =
    Math.round(totalGMV)
    .toLocaleString("en-IN");

    document.getElementById(
        "totalUnits"
    ).innerText =
    Math.round(totalUnits)
    .toLocaleString("en-IN");

    document.getElementById(
        "totalASP"
    ).innerText =
    totalASP.toFixed(2);

    document.getElementById(
        "totalPayout"
    ).innerText =
    Math.round(totalPayout)
    .toLocaleString("en-IN");

    document.getElementById(
        "totalASIN"
    ).innerText =
    asinSet.size
    .toLocaleString("en-IN");
}

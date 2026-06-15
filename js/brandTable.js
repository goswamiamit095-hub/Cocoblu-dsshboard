function buildBrandTable(data){

    const brandMap = {};

    data.forEach(row=>{

        const brand =
        String(
            row.brand || ""
        ).trim();

        if(!brand) return;

        if(!brandMap[brand]){

            brandMap[brand] = {

                gmv:0,
                unit:0,
                payout:0,
                aov:0,
                rows:0

            };

        }

        brandMap[brand].gmv +=
        Number(row.gmv) || 0;

        brandMap[brand].unit +=
        Number(row.unit) || 0;

        brandMap[brand].payout +=
        Number(row.payout) || 0;

        brandMap[brand].aov +=
        Number(row.aov) || 0;

        brandMap[brand].rows++;

    });

    let html = "";

    Object.entries(brandMap)

    .sort(
        (a,b)=>
        b[1].gmv -
        a[1].gmv
    )

    .forEach(([brand,item])=>{

        const asp =

        item.unit > 0

        ?

        item.gmv / item.unit

        :

        0;

        const avgAOV =

        item.rows > 0

        ?

        item.aov / item.rows

        :

        0;

        html += `
        <tr>
            <td>${brand}</td>
            <td>${Math.round(item.gmv).toLocaleString("en-IN")}</td>
            <td>${Math.round(item.unit).toLocaleString("en-IN")}</td>
            <td>${asp.toFixed(2)}</td>
            <td>${Math.round(item.payout).toLocaleString("en-IN")}</td>
            <td>${avgAOV.toFixed(2)}</td>
        </tr>
        `;

    });

    document.querySelector(
        "#brandTable tbody"
    ).innerHTML = html;

}

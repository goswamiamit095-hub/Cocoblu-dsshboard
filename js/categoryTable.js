function buildCategoryTable(data){

    const categoryMap = {};

    data.forEach(row=>{

        const category =
        String(
            row.category || ""
        ).trim();

        if(!category) return;

        if(!categoryMap[category]){

            categoryMap[category] = {

                gmv:0,
                unit:0,
                payout:0,
                asin:new Set()

            };

        }

        categoryMap[category].gmv +=
        Number(row.gmv) || 0;

        categoryMap[category].unit +=
        Number(row.unit) || 0;

        categoryMap[category].payout +=
        Number(row.payout) || 0;

        if(row.asin){

            categoryMap[category]
            .asin
            .add(row.asin);

        }

    });

    let html = "";

    Object.entries(categoryMap)

    .sort(
        (a,b)=>
        b[1].gmv -
        a[1].gmv
    )

    .forEach(([category,item])=>{

        const asp =

        item.unit > 0

        ?

        item.gmv / item.unit

        :

        0;

        html += `
        <tr>
            <td>${category}</td>
            <td>${Math.round(item.gmv).toLocaleString("en-IN")}</td>
            <td>${Math.round(item.unit).toLocaleString("en-IN")}</td>
            <td>${asp.toFixed(2)}</td>
            <td>${Math.round(item.payout).toLocaleString("en-IN")}</td>
            <td>${item.asin.size}</td>
        </tr>
        `;

    });

    document.querySelector(
        "#categoryTable tbody"
    ).innerHTML = html;

}

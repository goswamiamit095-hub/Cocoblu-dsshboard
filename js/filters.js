function populateFilters(){

    fillFilter("brandFilter","brand");
    fillFilter("categoryFilter","category");
    fillFilter("statusFilter","status");
    fillFilter("yearFilter","year");
    fillFilter("monthFilter","month");

    document
    .querySelectorAll(".filter-section select")
    .forEach(el=>{
        el.addEventListener(
            "change",
            applyFilters
        );
    });

    document
    .getElementById("searchBox")
    .addEventListener(
        "input",
        applyFilters
    );

    document
    .getElementById("fromDate")
    .addEventListener(
        "change",
        applyFilters
    );

    document
    .getElementById("toDate")
    .addEventListener(
        "change",
        applyFilters
    );

    document
    .getElementById("quickDateFilter")
    .addEventListener(
        "change",
        applyQuickDateFilter
    );
}

function fillFilter(id,field){

    const select =
    document.getElementById(id);

    let values =
    [...new Set(
        masterData.map(
            x => String(
                x[field]
            ).trim()
        )
    )]
    .filter(v=>v!=='');

    if(field==="month"){

        values
        .sort((a,b)=>a-b)
        .forEach(value=>{

            const option =
            document.createElement(
                "option"
            );

            option.value=value;

            option.textContent=
            monthNames[value];

            select.appendChild(option);
        });

        return;
    }

    if(field==="year"){
        values.sort((a,b)=>b-a);
    }
    else{
        values.sort();
    }

    values.forEach(value=>{

        const option =
        document.createElement(
            "option"
        );

        option.value=value;
        option.textContent=value;

        select.appendChild(option);

    });
}

function applyFilters(){

    const search =
    document
    .getElementById("searchBox")
    .value
    .toLowerCase()
    .trim();

    const brand =
    document
    .getElementById("brandFilter")
    .value;

    const category =
    document
    .getElementById("categoryFilter")
    .value;

    const status =
    document
    .getElementById("statusFilter")
    .value;

    const year =
    document
    .getElementById("yearFilter")
    .value;

    const month =
    document
    .getElementById("monthFilter")
    .value;

    const fromDate =
    document
    .getElementById("fromDate")
    .value;

    const toDate =
    document
    .getElementById("toDate")
    .value;

    const useDateRange =
    fromDate !== "" ||
    toDate !== "";

    let startDate = null;
    let endDate = null;

    if(fromDate){

        startDate =
        new Date(fromDate);

        startDate.setHours(
            0,0,0,0
        );
    }

    if(toDate){

        endDate =
        new Date(toDate);

        endDate.setHours(
            23,59,59,999
        );
    }

    filteredData =
    masterData.filter(row=>{

        const searchMatch =

        !search ||

        String(row.brand || "")
        .toLowerCase()
        .includes(search)

        ||

        String(row.asin || "")
        .toLowerCase()
        .includes(search)

        ||

        String(row.vendor_sku || "")
        .toLowerCase()
        .includes(search)

        ||

        String(row.erp || "")
        .toLowerCase()
        .includes(search);

        let dateMatch = true;

        if(useDateRange){

            const rowDate =
            new Date(
                Number(row.year),
                Number(row.month)-1,
                Number(row.day)
            );

            if(startDate){
                dateMatch =
                dateMatch &&
                rowDate >= startDate;
            }

            if(endDate){
                dateMatch =
                dateMatch &&
                rowDate <= endDate;
            }
        }

        return (

            (brand==="All" ||
            String(row.brand)
            .trim()===brand)

            &&

            (category==="All" ||
            String(row.category)
            .trim()===category)

            &&

            (status==="All" ||
            String(row.status)
            .trim()===status)

            &&

            (
                useDateRange

                ? true

                :

                (
                    (year==="All" ||
                    String(row.year)
                    .trim()===year)

                    &&

                    (month==="All" ||
                    String(row.month)
                    .trim()===month)
                )
            )

            &&

            searchMatch

            &&

            dateMatch
        );

    });

    calculateKPIs(filteredData);

    buildBrandTable(filteredData);

    buildCategoryTable(filteredData);

    buildStatusTable(filteredData);

    updateCharts(filteredData);
}

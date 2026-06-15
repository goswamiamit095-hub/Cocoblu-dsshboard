function applyQuickDateFilter(){

    const value =
    document.getElementById(
        "quickDateFilter"
    ).value;

    if(!value) return;

    const today =
    new Date();

    let start =
    new Date();

    let end =
    new Date();

    switch(value){

        case "today":

            break;

        case "yesterday":

            start.setDate(
                today.getDate()-1
            );

            end =
            new Date(start);

            break;

        case "7":

            start.setDate(
                today.getDate()-6
            );

            break;

        case "15":

            start.setDate(
                today.getDate()-14
            );

            break;

        case "30":

            start.setDate(
                today.getDate()-29
            );

            break;

        case "45":

            start.setDate(
                today.getDate()-44
            );

            break;

        case "60":

            start.setDate(
                today.getDate()-59
            );

            break;

        case "90":

            start.setDate(
                today.getDate()-89
            );

            break;

        case "mtd":

            start =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );

            break;

        case "ytd":

            start =
            new Date(
                today.getFullYear(),
                0,
                1
            );

            break;
    }

    document.getElementById(
        "fromDate"
    ).value =
    start.toISOString()
    .split("T")[0];

    document.getElementById(
        "toDate"
    ).value =
    end.toISOString()
    .split("T")[0];

    document.getElementById(
        "yearFilter"
    ).value =
    "All";

    document.getElementById(
        "monthFilter"
    ).value =
    "All";

    applyFilters();
}

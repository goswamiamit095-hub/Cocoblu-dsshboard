const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGYH1VtzaKrnyltAklSj0CK0kpchnfXCRYtEV1FXdtv-1t27tpu3F4_nU3mYMvKz6h7rqSgeUduGT7/pub?gid=2033889217&single=true&output=csv";

async function loadDashboard() {

  Papa.parse(csvURL, {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function(results) {

      const rawData = results.data;

      const grouped = {};

      rawData.forEach(row => {

        const brand = row.Brand || row.brand || 'Unknown';

        const sales = parseFloat(row.Sales || row.sales || 0);
        const gmv = parseFloat(ow.GMV || row.gmv || 0);
        const payout = parseFloat(row.Payout || row.payout || 0);
        const asp = parseFloat(row.ASP || row.asp || 0);
        const aov = parseFloat(row.AOV || row.aov || 0);

        if (!grouped[brand]) {
          grouped[brand] = {
            brand,
            sales: 0,
            gmv: 0,
            payout: 0,
            aspTotal: 0,
            aovTotal: 0,
            count: 0
          };
        }

        grouped[brand].sales += sales;
        grouped[brand].gmv += gmv;
        grouped[brand].payout += payout;
        grouped[brand].aspTotal += asp;
        grouped[brand].aovTotal += aov;
        grouped[brand].count += 1;

      });

      const finalData = Object.values(grouped).map(item => ({
        brand: item.brand,
        sales: item.sales.toFixed(2),
        gmv: item.gmv.toFixed(2),
        payout: item.payout.toFixed(2),
        asp: (item.aspTotal / item.count).toFixed(2),
        aov: (item.aovTotal / item.count).toFixed(2)
      }));

      createTable(finalData);
      updateCards(finalData);

    }
  });
}


function createTable(data) {

  const table = new Tabulator("#brand-table", {
    data: data,
    layout: "fitColumns",
    pagination: true,
    paginationSize: 10,
    movableColumns: true,
    responsiveLayout: "collapse",

    columns: [
      {
        title: "Brand",
        field: "brand",
        headerFilter: true
      },
      {
        title: "Sales",
        field: "sales",
        sorter: "number"
      },
      {
        title: "GMV",
        field: "gmv",
        sorter: "number"
      },
      {
        title: "Payout",
        field: "payout",
        sorter: "number"
      },
      {
        title: "ASP",
        field: "asp",
        sorter: "number"
      },
      {
        title: "AOV",
        field: "aov",
        sorter: "number"
      }
    ]
  });


  document.getElementById("search-input")
  .addEventListener("keyup", function() {

    const value = this.value.toLowerCase();

    table.setFilter([
      {
        field: "brand",
        type: "like",
        value: value
      }
    ]);

  });
}


function updateCards(data) {

  let totalSales = 0;
  let totalGMV = 0;
  let totalPayout = 0;
  let totalASP = 0;
  let totalAOV = 0;

  data.forEach(item => {

    totalSales += Number(item.sales);
    totalGMV += Number(item.gmv);
    totalPayout += Number(item.payout);
    totalASP += Number(item.asp);
    totalAOV += Number(item.aov);

  });

  document.getElementById('total-sales').innerText = totalSales.toFixed(2);
  document.getElementById('total-gmv').innerText = totalGMV.toFixed(2);
  document.getElementById('total-payout').innerText = totalPayout.toFixed(2);
  document.getElementById('avg-asp').innerText = (totalASP / data.length).toFixed(2);
  document.getElementById('avg-aov').innerText = (totalAOV / data.length).toFixed(2);
}


loadDashboard();

const urlEstatGDP = 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/3.0/data/dataflow/ESTAT/tec00114/1.0/*.*.*.*?c[freq]=A&c[indic_ppp]=VI_PPS_EU27_2020_HAB&c[ppp_cat18]=GDP&c[geo]=BE,BG,CZ,DK,DE,EE,IE,EL,ES,FR,HR,IT,CY,LV,LT,LU,HU,MT,NL,AT,PL,PT,RO,SI,SK,FI,SE&c[TIME_PERIOD]=2025&compress=false&format=json&lang=en';

fetch(urlEstatGDP)
.then((response) => response.json())
.then((data) => printGDPChart(data));

function printGDPChart(GDPdata) {
    console.log(GDPdata);



    // Landkoder
    const geoCategories =
        GDPdata.dimension.geo.category.index;

    // Landnamn
    const geoLabels =
        GDPdata.dimension.geo.category.label;

    // GDP-värden
    const values = GDPdata.value;

    // Bygg korrekt array
    const combinedData = [];

    for (const countryCode in geoCategories) {

        const index = geoCategories[countryCode];

        combinedData.push({
            country: geoLabels[countryCode],
            value: values[index]
        });
    }

    // Sortera lägst -> högst
    combinedData.sort((a, b) => a.value - b.value);

    // Arrays till Chart.js
    const labels =
        combinedData.map(item => item.country);

    const dataValues =
        combinedData.map(item => item.value);

    const barColors = labels.map(label => {

    if (label === "Sweden") {
        return 'rgba(123, 178, 255, 1)';
    }

    return 'rgba(246, 132, 66, 1)';
    });

    new Chart(document.getElementById('chartBar'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'GDP per capita',
                data: dataValues,
                backgroundColor: barColors
            }]

        },

            options: {
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
            }
        },

        scales: {
            x: {
                ticks: {
                    color: 'white'
                }
            },
            y: {
                ticks: {
                    color: 'white'
                }
            }
        }
    }
    
    });
};

const urlTransport = 'https://ourworldindata.org/grapher/co2-emissions-transport.csv?v=1&country=~OWID_WRL'

fetch(urlTransport)
.then(response => response.text())
.then(csv => printTransChart(csv));

function printTransChart(csv) {

    const rows = csv.trim().split("\n").slice(1);

    const map = new Map();

    rows.forEach(row => {
        const cols = row.split(",");

        const entity = cols[0];
        const year = Number(cols[2]);
        const value = Number(cols[3]);

        // 👇 VIKTIGT: bara världen
        if (entity === "World" && !isNaN(year) && !isNaN(value)) {

            // en unik punkt per år
            map.set(year, value);
        }
    });

    // gör till array
    const data = Array.from(map, ([year, value]) => ({
        year,
        value
    }));

    // sortera år
    data.sort((a, b) => a.year - b.year);

    const labels = data.map(d => d.year);
    const values = data.map(d => d.value);

    new Chart(document.getElementById('chartLine'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'CO₂ utläpp från transport i världen (ton)',
                data: values,
                borderColor: 'rgba(246, 132, 66, 1)',
                backgroundColor: 'rgba(246, 132, 66, 1)',
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: {

            interaction: {
                intersect: false,
                mode: 'index'
            },

            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

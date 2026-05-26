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

    const filteredData = combinedData.filter(item =>
    item.country !== "Luxembourg" &&
    item.country !== "Malta" &&
    item.country !== "Ireland"
    );

    // Sortera lägst -> högst
    filteredData.sort((a, b) => a.value - b.value);

    // Arrays till Chart.js
    const labels =
        filteredData.map(item => item.country);

    const dataValues =
        filteredData.map(item => item.value);

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

const mapURL =
'https://ec.europa.eu/eurostat/api/dissemination/sdmx/3.0/data/dataflow/ESTAT/isoc_ec_ib20/1.0/*.*.*.*.*?c[freq]=A&c[ind_type]=IND_TOTAL&c[indic_is]=I_BLT12&c[unit]=PC_IND&c[geo]=BE,BG,CZ,DK,DE,EE,IE,EL,ES,FR,HR,IT,CY,LV,LT,LU,HU,MT,NL,AT,PL,PT,RO,SI,SK,FI,SE,IS,NO,CH,UK,BA,ME,MK,AL,RS,TR,XK&c[TIME_PERIOD]=2025&compress=false&format=json&lang=en';

fetch(mapURL)
.then(response => response.json())
.then(data => printMapChart(data));

function printMapChart(mapData) {

    console.log(mapData);

    // ISO2 -> ISO3
    const isoMap = {
        SE: 'SWE',
        DE: 'DEU',
        FR: 'FRA',
        DK: 'DNK',
        NO: 'NOR',
        FI: 'FIN',
        IT: 'ITA',
        ES: 'ESP',
        PT: 'PRT',
        NL: 'NLD',
        BE: 'BEL',
        PL: 'POL',
        CZ: 'CZE',
        AT: 'AUT',
        CH: 'CHE',
        IE: 'IRL',
        EL: 'GRC',
        RO: 'ROU',
        BG: 'BGR',
        HR: 'HRV',
        SI: 'SVN',
        SK: 'SVK',
        HU: 'HUN',
        LT: 'LTU',
        LV: 'LVA',
        EE: 'EST',
        LU: 'LUX',
        CY: 'CYP',
        MT: 'MLT',
        IS: 'ISL',
        UK: 'GBR',
        BA: 'BIH',
        ME: 'MNE',
        MK: 'MKD',
        AL: 'ALB',
        RS: 'SRB',
        TR: 'TUR',
        XK: 'XKX'
    };

    // Eurostat geo labels
    const geoLabels =
        mapData.dimension.geo.category.label;

    // Eurostat values
    const values =
        Object.values(mapData.value);

    const locations = [];
    const zValues = [];
    const text = [];

    // Viktigt:
    // labels + values måste matchas via samma index
    Object.keys(geoLabels).forEach((code, i) => {

        const value = values[i];

        locations.push(isoMap[code]);

        zValues.push(value);

        text.push(
            geoLabels[code] + ': ' + value + '%'
        );
    });

    Plotly.newPlot('chartMap', [

        {
            type: 'choropleth',

            locationmode: 'ISO-3',

            locations: locations,

            z: zValues,

            text: text,

            hovertemplate:
                '%{text}<extra></extra>',

            colorscale: 'YlOrBr',

            colorbar: {
                title:
                'Internet purchases (%)'
            }
        }

    ], {

        geo: {
            scope: 'europe',

            showframe: false,

            showcoastlines: false,

            bgcolor: 'rgba(255, 249, 241, 1)'
        },

        paper_bgcolor: 'rgba(255, 249, 241, 1)',

        plot_bgcolor: 'rgba(255, 249, 241, 1)',

        font: {
            color: '#101726'
        }
    });
}

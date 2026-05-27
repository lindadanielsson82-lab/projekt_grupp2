const urlEstatGDP =
  "https://ec.europa.eu/eurostat/api/dissemination/sdmx/3.0/data/dataflow/ESTAT/tec00114/1.0/*.*.*.*?c[freq]=A&c[indic_ppp]=VI_PPS_EU27_2020_HAB&c[ppp_cat18]=GDP&c[geo]=BE,BG,CZ,DK,DE,EE,IE,EL,ES,FR,HR,IT,CY,LV,LT,LU,HU,MT,NL,AT,PL,PT,RO,SI,SK,FI,SE&c[TIME_PERIOD]=2025&compress=false&format=json&lang=en";

fetch(urlEstatGDP)
  .then((response) => response.json())
  .then((data) => printGDPChart(data));

function printGDPChart(GDPdata) {
  console.log(GDPdata);


  const geoCategories = GDPdata.dimension.geo.category.index;


  const geoLabels = GDPdata.dimension.geo.category.label;


  const values = GDPdata.value;

  const combinedData = [];

  for (const countryCode in geoCategories) {
    const index = geoCategories[countryCode];

    combinedData.push({
      country: geoLabels[countryCode],
      value: values[index],
    });
  }

  const filteredData = combinedData.filter(
    (item) =>
      item.country !== "Luxembourg" &&
      item.country !== "Malta" &&
      item.country !== "Ireland",
  );


  filteredData.sort((a, b) => a.value - b.value);

  const labels = filteredData.map((item) => item.country);

  const dataValues = filteredData.map((item) => item.value);

  const barColors = labels.map((label) => {
    if (label === "Sweden") {
      return "rgba(123, 178, 255, 1)";
    }

    return "rgba(246, 132, 66, 1)";
  });

  new Chart(document.getElementById("chartBar"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "GDP per capita",
          data: dataValues,
          backgroundColor: barColors,
        },
      ],
    },

    options: {
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },

      scales: {
        x: {
          ticks: {
            color: "white",
          },
        },
        y: {
          ticks: {
            color: "white",
          },
        },
      },
    },
  });
}

const urlTransport =
  "https://ourworldindata.org/grapher/co2-emissions-transport.csv?v=1&country=~OWID_WRL";

fetch(urlTransport)
  .then((response) => response.text())
  .then((csv) => printTransChart(csv));

function printTransChart(csv) {
  const rows = csv.trim().split("\n").slice(1);

  const map = new Map();

  rows.forEach((row) => {
    const cols = row.split(",");

    const entity = cols[0];
    const year = Number(cols[2]);
    const value = Number(cols[3]);

   
    if (entity === "World" && !isNaN(year) && !isNaN(value)) {

      map.set(year, value);
    }
  });


  const data = Array.from(map, ([year, value]) => ({
    year,
    value,
  }));


  data.sort((a, b) => a.year - b.year);

  const labels = data.map((d) => d.year);
  const values = data.map((d) => d.value);

  new Chart(document.getElementById("chartLine"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "CO₂ utläpp från transport i världen (ton)",
          data: values,
          borderColor: "rgba(246, 132, 66, 1)",
          backgroundColor: "rgba(246, 132, 66, 1)",
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    },
    options: {
      interaction: {
        intersect: false,
        mode: "index",
      },

      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },

      scales: {
        x: {
          ticks: {
            color: "white",
          },
        },
        y: {
          ticks: {
            color: "white",
          },
        },
      },
    },
  });
}

const mapURL =
  "https://ec.europa.eu/eurostat/api/dissemination/sdmx/3.0/data/dataflow/ESTAT/isoc_ec_ib20/1.0/*.*.*.*.*?c[freq]=A&c[ind_type]=IND_TOTAL&c[indic_is]=I_BLT12&c[unit]=PC_IND&c[geo]=BE,BG,CZ,DK,DE,EE,IE,EL,ES,FR,HR,IT,CY,LV,LT,LU,HU,MT,NL,AT,PL,PT,RO,SI,SK,FI,SE,IS,NO,CH,UK,BA,ME,MK,AL,RS,TR,XK&c[TIME_PERIOD]=2025&compress=false&format=json&lang=en";

fetch(mapURL)
  .then((response) => response.json())
  .then((data) => printMapChart(data));

function printMapChart(mapData) {
  console.log(mapData);


  const isoMap = {
    SE: "SWE",
    DE: "DEU",
    FR: "FRA",
    DK: "DNK",
    NO: "NOR",
    FI: "FIN",
    IT: "ITA",
    ES: "ESP",
    PT: "PRT",
    NL: "NLD",
    BE: "BEL",
    PL: "POL",
    CZ: "CZE",
    AT: "AUT",
    CH: "CHE",
    IE: "IRL",
    EL: "GRC",
    RO: "ROU",
    BG: "BGR",
    HR: "HRV",
    SI: "SVN",
    SK: "SVK",
    HU: "HUN",
    LT: "LTU",
    LV: "LVA",
    EE: "EST",
    LU: "LUX",
    CY: "CYP",
    MT: "MLT",
    IS: "ISL",
    UK: "GBR",
    BA: "BIH",
    ME: "MNE",
    MK: "MKD",
    AL: "ALB",
    RS: "SRB",
    TR: "TUR",
    XK: "XKX",
  };


  const geoLabels = mapData.dimension.geo.category.label;

 
  const values = Object.values(mapData.value);

  const locations = [];
  const zValues = [];
  const text = [];


  Object.keys(geoLabels).forEach((code, i) => {
    const value = values[i];

    locations.push(isoMap[code]);

    zValues.push(value);

    text.push(geoLabels[code] + ": " + value + "%");
  });


  Plotly.newPlot(
    "chartMap",
    [
      {
        type: "choropleth",

        locationmode: "ISO-3",

        locations: locations,

        z: zValues,

        text: text,

        hovertemplate: "%{text}<extra></extra>",

        colorscale: "YlOrBr",

        colorbar: {
          title: "Internet purchases (%)",
        },
      },
    ],
    {
      geo: {
        scope: "europe",

        showframe: false,

        showcoastlines: false,

        bgcolor: "#101726",
      },

      paper_bgcolor: "#101726",

      plot_bgcolor: "#101726",

      font: {
        color: "white",
      },
    },
    {
      responsive: true
    }
  );
}

// 1. Samla all data (bilder och tillhörande texter) i en lista (array)
const testSteps = [
  {
    image: "images/självtest_bild1.jpeg",
    title: "Hinder",
    text: "<strong>Vad du ser:</strong> En ruta som blockerar skärmen och erbjuder 20% rabatt.<br><strong>Dold fälla:</strong> Obstruction (Hinder). Hemsidan låser skärmen och tvingar dig att interagera för att kunna surfa vidare. Genom att göra “Ja”-knappen stor och färgglad och gömma “Nej”-knappen i en liten textlänk, manipuleras du till att ge bort din e-postadress.",
  },
  {
    image: "images/självtest_bild2.jpeg",
    title: "Dolda kostnader",
    text: "<strong>Vad du ser:</strong> En stor knapp där det står 2 848 kr, men en slutnota som plötsligt blir högre. <br><strong>Dold fälla:</strong> Hidden Costs (Dolda kostnader). Företaget gömmer extra expeditionsavgifter i den finstilta texten ända fram till betalsteget. De hoppas att du ska vara för trött för att avbryta köpet efter att du redan lag ttid på att välja dina varor.",
  },
  {
    image: "images/självtest_bild3.jpeg",
    title: "Falsk tidspress",
    text: "<strong>Vad du ser:</strong> En tickande klocka som säger att dina varor håller på att ta slut.<br><strong>Dold fälla:</strong> Urgency (Falsk tidspress). Sajten stressar dig med en fiktiv tidspress för att trigga 'FOMO' (rädsla att missa något). När du blir stressad handlar du på autopilot, vilket leder till onödiga impulsköp som skadar både din plånbok och miljön.",
  },
  {
    image: "images/självtest_bild4.jpeg",
    title: "Förikryssade val",
    text: "<strong>Vad du ser:</strong> Förslag på tillbehör under din vara i kundvagnen.<br><strong>Dold fälla:</strong> Sneak into basket (Förikryssade val). Butiken har redan kryssat i rutan och lagt till extraprodukter i din totala summa i smyg. Genom att tvinga dig aktivt klicka ur rutan utnyttjar de din ouppmärksamhet för att sälja mer.",
  },
  {
    image: "images/självtest_bild5.jpeg",
    title: "Vilseledning",
    text: "<strong>Vad du ser:</strong> En stor, färgglad knapp som uppmanar dig att skydda din resa med en försäkring.<br><strong>Dold fälla:</strong> Misdirection (Vilseledning). Designen styr medvetet din uppmärksamhet mot den dyra knappen för att dölja att det faktiskt finns ett gratisalternativ. Genom att göra avböjningsknappen extremt liten, grå och ömd i botten utnyttjar de din visuella vana för att lura dig att betala extra.",
  },
  {
    image: "images/självtest_bild6.jpeg",
    title: "Tvingad fortsättning",
    text: "<strong>Vad du ser:</strong> Ett generöst erbjudande om att prova en exklusiv klubb gratis i 30 dagar.<br><strong>Dold fälla:</strong> Forced Continuity (Tvingad fortsättning). Sajten lockar in dig med den 'gratis', men gömmer det faktum att abonnemanget förnyas automatiskt. Texten om att det kommer kosta 300 kr i månaden är medvetet förminskad inuti knappen för att du ska missa den, och när provperioden är slut dras pengarna tyst utan förvarning.",
  },
];

// 2. Håll koll på nuvarande position
let currentStep = 0;
let isExplanationShowing = false;

// 3. Hämta HTML-elementen som ska ändras
const clickZone = document.getElementById("test-click-zone");
const testImage = document.getElementById("test-image");
const testText = document.getElementById("test-text");

// 4. Lyssna efter klick på hela boxen
clickZone.addEventListener("click", function () {
  if (!isExplanationShowing) {
    // STEG A: Visa förklarande text under nuvarande bild
    testText.innerHTML = `<h3>${testSteps[currentStep].title}</h3><p>${testSteps[currentStep].text}</p>`;
    testText.classList.remove("hidden"); // Visa texten
    isExplanationShowing = true;
  } else {
    // STEG B: Dölj texten och hoppa till nästa bild (eller loopa om)
    testText.classList.add("hidden"); // Dölj texten igen

    // Öka index med 1. Om vi når slutet på listan, starta om på 0 (loop)
    currentStep = (currentStep + 1) % testSteps.length;

    // Uppdatera bilden till nästa i kön
    testImage.src = testSteps[currentStep].image;
    isExplanationShowing = false;
  }
});

const period30Days  = '30days';
const period60Days  = '60days';
const period180Days = '180days';
const period1Year   = '1year';
const period2Year   = '2year';
const periodAllTime = 'all';

let url = `https://api.blockchain.info/charts/market-price?format=csv&timespan=${periodAllTime}&cors=true`;
let request = new Request(url);

// Fetch Data from API
const fetchDataRequest = (request) => {
    fetch(request)
        .then(function (response) {
            if (response.status !== 200) {
                throw new Error("Bad Server Response");
            }
            return response.text();
        })
        .then(function (text) {
            let series = csvToSeries(text);
            renderChart(series);
        })
        .catch(function (error) {
            console.log(error);
        });
};

fetchDataRequest(request);

// Change timespan param
const urlParam = (param) => {
    url = `https://api.blockchain.info/charts/market-price?format=csv&timespan=${param}&cors=true`;
    request = new Request(url);
    fetchDataRequest(request);
}

const bindEvents = () => {
    const p30Days  = document.getElementsByClassName('period30Days');
    const p60Days  = document.getElementsByClassName('period60Days');
    const p180Days = document.getElementsByClassName('period180days');
    const p1Year   = document.getElementsByClassName('period1Year');
    const p2Year   = document.getElementsByClassName('period2Year');
    const pAllTime = document.getElementsByClassName('periodAllTime');

    p30Days[0].addEventListener('click', function(e) {
        urlParam(period30Days);
        openChart(e, 'period30Days');
    })

    p60Days[0].addEventListener('click', function(e) {
        urlParam(period60Days);
        openChart(e, 'period60Days');
    })

    p180Days[0].addEventListener('click', function(e) {
        urlParam(period180Days);
        openChart(e, 'period180days');
    })

    p1Year[0].addEventListener('click', function(e) {
        urlParam(period1Year);
        openChart(e, 'period1Year');
    })

    p2Year[0].addEventListener('click', function(e) {
        urlParam(period2Year);
        openChart(e, 'period2Year');
    })

    pAllTime[0].addEventListener('click', function(e) {
        urlParam(periodAllTime);
        openChart(e, 'periodAllTime');
    })
};

bindEvents();

const disable = el => {
    el.className = el.className.replace(' active', '');
};

const enable = el => {
    el.className += ' active';
};

const openChart = (e, chart) => {
    let i, btn;

    btn = document.getElementsByClassName('btn');

    for (i = 0; i < btn.length; i++) {
        disable(btn[i]);
    }

    enable(document.getElementsByClassName(chart));
    enable(e.currentTarget);
}

const csvToSeries = (text) => {
    let dataAsJson = JSC.csv2Json(text, { columns: ["date", "price"] });
    let price = [];

    dataAsJson.forEach(function (row) {
        price.push({ x: new Date(row.date), y: row.price });
    });

    return [
        { name: '', points: price }
    ];
};

const renderChart = (series) => {
    JSC.Chart('chart', {
        xAxis_crosshair_enabled: true,
        yAxis: [
            {
                defaultTick_label: { text: '{%value:g}' },
                label_text: 'USD',
            }
        ],
        legend_visible: false,
        defaultPoint_tooltip: '%seriesName <b>%yValue</b> USD',
        series: series
    });
};

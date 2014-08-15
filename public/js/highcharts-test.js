$(document).ready(function() {
    $('form#query').submit(function(e){
        e.preventDefault();
        var query = $('input[name="query"]').val();
        var startDate = $('input[name="date"]').val();
        getData(query, startDate);
    });
});

function graphData(data, query, startDate) {
    console.log(data);
    var dataArray = generateDataArray(data.results);
    graph(dataArray);
}

function parseDate(str) {
    var year = str.substr(0,4),
        month = str.substr(4,2) - 1,
        day = str.substr(6,2);
    var date = Date.UTC(year,month,day);
    return date;
}

function dateArray(resultObj) {
    return _.map(resultObj, function(item) {
        return parseDate(item.time);
    });
}

function valueArray(resultObj) {
    return _.map(resultObj, function(item) {
        return item.count;
    });
}

function generateDataArray(resultObj) {
    var dates = dateArray(resultObj);
    var counts = valueArray(resultObj);
    return _.zip(dates, counts);
}

function getData(query, startDate) {
    var queryRoot = 'https://api.fda.gov/food/enforcement.json?api_key=ZObiWB8cMRYRRfPNnf41BGCLvXViUbNfTw6zHODr&search=reason_for_recall:';
    var queryType = '&count=report_date';
    console.log(queryRoot + '"' + query + '"' + queryType);
    $.getJSON(
        queryRoot + '"' + query + '"' + queryType
    ).done(function(data, query, startDate){
        console.log(data);
        console.log(query);
        console.log(startDate);
        graphData(data, query, startDate);
    });
}


function graph(dataArray, query, startDate) {
    $(function () {
        $('#container').highcharts({
            chart: {
            //     type: 'column',
                zoomType: 'x'
            },
            // plotOptions: {
            //     column: {
            //         pointPadding: 0,
            //         borderWidth: 0,
            //         groupPadding: 0,
            //         shadow: false
            //     }
            // },
            xAxis: {
                type: 'datetime',
                minRange: 30 * 24 * 3600000,

                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Count'
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%e %b %y}: {point.y:.2f}'
            },

            series: [
            {
                name: query,
                // Define the data points. All series have a dummy year
                // of 1970/71 in order to be compared on the same x axis. Note
                // that in JavaScript, months start at 0 for January, 1 for February etc.
                data: dataArray
            },
            {
                name: "Ice Cream",
                data: generateDataArray(minidata.results)
            }
            ]
        });
    });
}


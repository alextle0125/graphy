function graphData(data, query, startDate) {
    var result = $.parseJSON(data.file_data);
    var dataArray = generateDataArray(result.results);
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

function graph(dataArray, query, startDate) {
    $(function () {
        $('#container').highcharts({
            chart: {
            //     type: 'column',
                zoomType: 'x'
            },
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


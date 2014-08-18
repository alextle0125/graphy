function parseData(data) {
    var result = $.parseJSON(data.file_data);
    return generateDataArray(result.results);
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

function addSeries(dataArray, query, visibility) {
    var chart = $('#container').highcharts();

    chart.addSeries({
        name: query,
        data: dataArray,
        visible: visibility
    });

    if (visibility) {
        if (chart.title) {
            chart.setTitle({text: chart.title.textStr + " vs. " + query});
        } else {
            chart.setTitle({text: "FDA Recalls: " + query});
        }
    }
}

function clearGraph() {
    var chart = $('#container').highcharts();
    while( chart.series.length > 0 ) {
        chart.series[0].remove( false );
    }
    chart.setTitle({text: ''});
    chart.redraw();
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function leastSquaresRegression(dataArray) {
    var yValues = _.map(dataArray, function(item) { return item[1] } );
    var xValues =  _.map(dataArray, function(item) { return item[0] } );
    var length = yValues.length;
    var xIndices = _.range(1, length+1);

    var sumX = _.reduce(xIndices, function(sum, num){ return sum + num; }, 0);
    var sumY = _.reduce(yValues, function(sum, num){ return sum + num; }, 0);
    var sumXY = _.reduce([xIndices, yValues], function(sum, pair){ return sum + (pair[0]*pair[1]); }, 0);
    var sumX2 = _.reduce(xIndices, function(sum, num){ return sum + (num*num); }, 0);

    // y = mx + b
    var slope = ((length * sumXY) - (sumX * sumY)) / ((length * sumX2) - (sumX * sumX));
    var intercept = (sumY / length) - ((slope * sumX) / length);

    var initialY = (slope*_.first(xIndices)) + intercept;
    var finalY = (slope*_.last(xIndices)) + intercept;

    return [[_.first(xValues), finalY], [_.last(xValues), initialY]];
}


function graph(dataArray, query, startDate) {
    $(function () {
        $('#container').highcharts({
            chart: {
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
                    text: 'Number of Recalls'
                },
                min: 0
            },
            title: {
                text: "FDA Recalls: " + query
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%e %b %y}: {point.y:.2f}'
            },
            plotOptions: {
                series: {
                    marker: {
                        radius: 3
                    }
                }
            },
            series: [{
                name: query,
                data: dataArray
            }]
        });
    });
}


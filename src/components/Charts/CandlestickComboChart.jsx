import React from 'react';
import Chart from 'react-apexcharts';

const CandlestickComboChart = () => {
    const series = [{
        name: 'Candle',
        data: [{
            x: new Date('2022-06-01').getTime(),
            y: [8301.5, 8481.1, 8201.3, 8420.4]
        }, {
            x: new Date('2022-06-02').getTime(),
            y: [8420.7, 8600.4, 8372.4, 8597.3]
        },
        {
            x: new Date('2022-06-03').getTime(),
            y: [8420.7, 8600.4, 8372.4, 8597.3]
        },
        {
            x: new Date('2022-06-04').getTime(),
            y: [8420.7, 8600.4, 8372.4, 8597.3]
        },
        {
            x: new Date('2022-06-05').getTime(),
            y: [8301.5, 8481.1, 8201.3, 8420.4]
        }, {
            x: new Date('2022-06-06').getTime(),
            y: [8420.7, 8600.4, 8372.4, 8597.3]
        },
        {
            x: new Date('2022-06-07').getTime(),
            y: [8420.7, 8600.4, 8372.4, 8597.3]
        },
        {
            x: new Date('2022-06-08').getTime(),
            y: [8420.7, 8600.4, 8372.4, 8597.3]
        }]
    }, {
        name: 'Volume',
        type: 'column',
        data: [{
            x: new Date('2022-06-01').getTime(),
            y: 25110
        }, {
            x: new Date('2022-06-02').getTime(),
            y: 20150
        },
        {
            x: new Date('2022-06-03').getTime(),
            y: 25110
        }, {
            x: new Date('2022-06-04').getTime(),
            y: 20150
        },
        {
            x: new Date('2022-06-05').getTime(),
            y: 25110
        }, {
            x: new Date('2022-06-06').getTime(),
            y: 20150
        },
        {
            x: new Date('2022-06-07').getTime(),
            y: 25110
        }, {
            x: new Date('2022-06-08').getTime(),
            y: 20150
        }]
    }];

    const options = {
        series: series,
        chart: {
            height: 350,
            type: 'line',
            background: '#231930', // Set background color here
        },
        title: {
            text: 'Candlestick Chart with Column Chart (Volume)',
            style: {
                color: '#fff' // Optional: set title color to contrast with background
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#fff' // Optional: set x-axis label color
                }
            }
        },
        yaxis: [{
            tooltip: {
                enabled: true,
                formatter: function (val) {
                    return val.toFixed(2);
                }
            },
            labels: {
                style: {
                    colors: '#fff' // Optional: set y-axis label color for candle chart
                }
            }
        }, {
            seriesName: 'Volume',
            opposite: true,
            tooltip: {
                enabled: true,
                formatter: function (val) {
                    return val.toFixed(0);
                }
            },
            labels: {
                style: {
                    colors: '#fff' // Optional: set y-axis label color for volume chart
                }
            }
        }]
    };

    return (
        <div className="app w-full">
            <div className="row">
                <div className="mixed-chart">
                    <Chart
                        options={options}
                        series={series}
                        type="line"
                        height={450}
                        width="100%"
                    />
                </div>
            </div>
        </div>
    );
};

export default CandlestickComboChart;

// const io = require('socket.io-client');
// const d3 = require('d3');
// import io from '/socket.io/socket.io.js';
// import * as d3 from 'd3';
// /socket.io/socket.io.js
// import d3 from 'd3';

let data1 = [];
const socket = io('http://localhost:4000');

let payload = {
    costRange: [
        {
            min: 0,
            max: 100,
        },
        {
            min: 101,
            max: 200,
        },
        {
            min: 201,
            max: 300,
        },
        {
            min: 301,
            max: 500,
        },
        {
            min: 501,
            max: 1000,
        },
    ],
};

socket.emit('range', payload);

socket.on('range', (payload) => {
    data1 = payload;
    console.log('client', data1);
});
console.log('data1', data1);
// const xScale = d3
//     .scaleBand()
//     .domain(DUMMY_DATA.map((dataPoint) => dataPoint.range))
//     .rangeRound([0, 250])
//     .padding(0.1);
// const yScale = d3.scaleLinear().domain([0, 15]).range([200, 0]);

// const container = d3.select('svg').classed('container', true);

// const bars = container
//     .selectAll('.bar')
//     .data(DUMMY_DATA)
//     .enter()
//     .append('rect')
//     .classed('bar', true)
//     .attr('width', xScale.bandwidth())
//     .attr('height', (data) => 200 - yScale(data.numberOfBooks))
//     .attr('x', data => xScale(data.range))
//     .attr('y', data => yScale(data.numberOfBooks));
const data = [
    { range: '0-100', numberOfBooks: 3 },
    { range: '101-200', numberOfBooks: 3 },
    { range: '201-300', numberOfBooks: 6 },
    { range: '301-500', numberOfBooks: 9 },
    { range: '501-1000', numberOfBooks: 14 },
];

const width = 900;
const height = 450;
const margin = { top: 50, bottom: 50, left: 50, right: 50 };

const svg = d3.select('#d3-container')
    .append('svg')
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom)
    .attr('viewBox', [0, 0, width, height]);

const x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1)

const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top])

svg
    .append('g')
    .attr('fill', 'royalblue')
    .selectAll('rect')
    .data(data.sort((a, b) => d3.descending(a.numberOfBooks, b.numberOfBooks)))
    .join('rect')
    .attr('x', (d, i) => x(i))
    .attr('y', d => y(d.numberOfBooks))
    .attr('title', (d) => d.numberOfBooks)
    .attr('class', 'rect')
    .attr('height', d => y(0) - y(d.numberOfBooks))
    .attr('width', x.bandwidth());

function yAxis(g) {
    g.attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, data.format))
        .attr('font-size', '20px')
}

function xAxis(g) {
    g.attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => data[i].range))
        .attr('font-size', '20px')
}

svg.append('g').call(xAxis);
svg.append('g').call(yAxis);
svg.node();
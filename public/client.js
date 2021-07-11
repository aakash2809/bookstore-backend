/**
* @file          client.js
* @description   This file is linked with html file 'index.html' for visualization of
*                bar graph
* @author        Aakash Rajak <aakashrajak2809@gmail.com>
*--------------------------------------------------------------------------------------*/

const socket = io('http://localhost:2000');
let data = [];

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

/**
  * @description this function emit event 'range' with payload to the server
  * @param {*} payload contains the books cost ranges
  */
socket.emit('range', payload);

/**
  * @description this function on event 'range' with payload to the server
  * @param {*} result contains number of books, corrousponding ranges
  */
socket.on('range', (result) => {
    data = result.data;
    createGraph();
});

/**
  * @description this function creates the bar graph for
  * number of books, corrousponding ranges
  */
let createGraph = () => {
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
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);

    svg
        .append('g')
        .attr('fill', 'royalblue')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (d, i) => x(i))
        .attr('y', d => y(d.numberOfBooks))
        .attr('title', (d) => d.numberOfBooks)
        .attr('class', 'rect')
        .attr('height', d => y(0) - y(d.numberOfBooks))
        .attr('width', x.bandwidth());

    /**
     * @description create scale for y axis
     */
    let yAxis = (g) => {
        g.attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).ticks(null, data.format))
            .attr('font-size', '20px');
    };

    /**
     * @description create scale for x axis
     */
    let xAxis = (g) => {
        g.attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(i => data[i].range))
            .attr('font-size', '20px');
    };

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);
};

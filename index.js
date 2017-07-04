//import {style} from '../common/css/d3.css'

var d3 = require('d3');
//var $ = require('jquery');

var FreeMind = new Object();

FreeMind.createVerticalMap = function(data, myel, width2) {
	// Standard tree from mindmap
	var div = d3.select(myel);
	div.html("<svg  width='"+width2+"' height='1000'/>");
	var svg = div.select("svg");

	var width = +svg.attr("width");
	var height = +svg.attr("height");
	var g = svg.append("g").attr("transform", "translate(100,0)"); 

	var children = function(node) {
		return node.node;
	}

	var tree = d3.tree()
	.size([height,width-500])
	.separation(function(a, b) { 
		return ((a.children ? a.children.length : 1) + (b.children ? b.children.length : 1))/2 });

	var hier = d3.hierarchy(data.map.node[0],children);

	var root = tree(hier);

	var link = g.selectAll(".link")
	.data(root.links())
	.enter().append("path")
	.attr("class", "link")
	.attr("d", d3.linkHorizontal()
			.x(function(d) { return d.y; })
			.y(function(d) { return d.x; }));

	var node = g.selectAll(".node")
	.data(root.descendants())
	.enter().append("g")
	.attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
	.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	node.append("circle")
	.attr("r", 2.5);

	node.append("text")
	.attr("dy", "0.31em")
	.attr("x", function(d) { return d.children ? -8 : 8; })
	.style("text-anchor", function(d) { return d.children ? "end" : "start"; })
	.text(function(d) {return d.data.$.TEXT; });

}

//Radial tree
FreeMind.createRadialMap = function(data, myel, width2) {

    var div = d3.select(myel);
    div.html("<svg  width='"+width2+"' height='1000'/>");
    var svg = div.select("svg");

	var width = +svg.attr("width");
	var height = +svg.attr("height");
	var g = svg.append("g") 
	.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

	var children = function(node) {
		return node.node;
	}

	var tree = d3.cluster()
	.size([2 * Math.PI, 400])
	.separation(function(a, b) { 
		return (a.parent == b.parent ? 1 : 2) / a.depth; });

	var hier = d3.hierarchy(data.map.node[0],children);
	var root = tree(hier);

	var link = g.selectAll(".link")
	.data(root.links())
	.enter().append("path")
	.attr("class", "link")
	.attr("d", d3.linkRadial()
			.angle(function(d) { return d.x; })
			.radius(function(d) { return d.y; }));

	var node = g.selectAll(".node")
	.data(root.descendants())
	.enter().append("g")
	.attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
	.attr("transform", function(d) { return "translate(" + radialPoint(d.x, d.y) + ")"; });

	node.append("circle")
	.attr("r", 2.5);

	var text = node.append("text").text(function(d) {return d.data.$.TEXT; });

//	if (text.children) {
//	t
//	.attr("x", "0")
//	.attr("text-anchor", "middle" );
//	} else {
	text
	.attr("x", function(d) { return d.x < Math.PI === !d.children ? 6 : -6; })
	.attr("dy", "0.31em")
	.attr("text-anchor", function(d) { return d.x < Math.PI === !d.children ? "start" : "end"; })
	.attr("transform", function(d) { return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")"; })
//	}
}

function radialPoint(x, y) {
	return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

module.exports = FreeMind;
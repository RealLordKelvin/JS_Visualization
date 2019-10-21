////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////

var screenWidth = 800;

var margin = {left: 50, top: 10, right: 50, bottom: 10},
	width = Math.min(screenWidth, 900) - margin.left - margin.right,
	height = Math.min(screenWidth, 900)*5/6 - margin.top - margin.bottom;
			
var svg = d3.select("#chart").append("svg")
			.attr("width", (width + margin.left + margin.right))
			.attr("height", (height + margin.top + margin.bottom));
			
var wrapper = svg.append("g").attr("class", "chordWrapper")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");;
			
var outerRadius = Math.min(width, height) / 2  - 100,
	innerRadius = outerRadius * 0.95,
	opacityDefault = 0.75; //default opacity of chords
	
////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////

var Names = ["Germany","France","China","United States","United kingdom"];

var   matrix = [
    [0, 118773384.51, 97773609.03, 126359982.51, 94818745.54],
    [72966189.72, 0, 21292095.77, 50036407, 35050753],
    [115179029, 55401050, 0, 526022307, 56713517],
    [71072339.05, 34219954.34,  129893514.89, 0, 56243524.09],
    [41366451.01, 31123289, 22328955, 53950438.18, 0]
  ];

var chord = d3.layout.chord()
	.padding(.02)
	.sortSubgroups(d3.descending) //sort the chords inside an arc from high to low
	.sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
	.matrix(matrix);

var arc = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius);

var path = d3.svg.chord()
	.radius(innerRadius);
	
var fill = d3.scale.ordinal()
    .domain(d3.range(Names.length))
    .range(["#171635","#00225D","#CA7508","#763262","#E9A621"]);

////////////////////////////////////////////////////////////
//////////////////// Draw outer Arcs ///////////////////////
////////////////////////////////////////////////////////////

var g = wrapper.selectAll("g.group")
	.data(chord.groups)
	.enter().append("g")
	.attr("class", "group");;

g.append("path")
	.style("stroke", function(d) { return fill(d.index); })
    .style("fill", function(d) { return fill(d.index); })
    .attr("id", function(d, i) { return "group" + d.index; })
    .attr("d", arc)
    .on("mouseover", fade(.1))
    .on("mouseout", fade(1));

/*g.append("text")
    .attr("x", 5)
   .attr("dy", 9)
 .append("textPath")
   .attr("xlink:href", function(d) { return "#group" + d.index; })
   .text(function(chords, i){return Names[i];})
   .style("fill", "white");*/

////////////////////////////////////////////////////////////
////////////////////// Append Names ////////////////////////
////////////////////////////////////////////////////////////



g.append("text")
	.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2);})
	.attr("dy", ".35em")
	.attr("class", "titles")
	.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	.attr("transform", function(d,i) { 
		var c = arc.centroid(d);
		return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + (innerRadius + 55) + ")"
		+ (d.angle > Math.PI ? "rotate(180)" : "")
	})
	.text(function(d,i) { return Names[i]; });

//+ "translate(" + (innerRadius + 55) + ")"*/

////////////////////////////////////////////////////////////
////////////////// Append Ticks ////////////////////////////
////////////////////////////////////////////////////////////

/*var ticks = svg.append("svg:g").selectAll("g.ticks")
    .data(chord.groups)
	.enter().append("svg:g").selectAll("g.ticks")
	.attr("class", "ticks")
    .data(groupTicks)
	.enter().append("svg:g")
    .attr("transform", function(d) {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
          + "translate(" + outerRadius+40 + ",0)";
    });

ticks.append("svg:line")
    .attr("x1", 1)
    .attr("y1", 0)
    .attr("x2", 5)
    .attr("y2", 0)
    .style("stroke", "#000");

ticks.append("svg:text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .text(function(d) { return d.label; });
    */

////////////////////////////////////////////////////////////
//////////////////// Draw inner chords /////////////////////
////////////////////////////////////////////////////////////
 
var colors = ["#CAF270","#73D487","#30B096","#288993","#40607A"];
var chords = wrapper.selectAll("path.chord")
	.data(chord.chords)
	.enter().append("path")
	.attr("class", "chord")
	.style("stroke", "none")
	.style("fill", function(d) { return fill(d.target.index); })
	.style("opacity", opacityDefault)
    .attr("d", path)


////////////////////////////////////////////////////////////
///////////////////////// Tooltip //////////////////////////
////////////////////////////////////////////////////////////

//Arcs
g.append("title")	
	.text(function(d, i) {return[Names[i] + " Exports a total of " + Math.round(d.value) + " Billions USD in goods"]});
	
//Chords
chords.append("title")
	.text(function(d) {
		return [Math.round(d.source.value), " Billions of Goods Imports ", Names[d.target.index], " from ", Names[d.source.index]].join(""); 
    });
    
/** Returns an event handler for fading a given chord group. */

    
function fade(opacity) {
    return function(g, i) {
        svg.selectAll("path.chord")
            .filter(function(d) {
            return d.source.index != i && d.target.index != i;
            })
            .transition()
            .style("opacity", opacity);
       };
     }

/*function groupTicks(d) {
    var k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, 1).map(function(v, i) {
        return {
        angle: v * k + d.startAngle,
        label: i % 5 ? null : v + "%"
        };
    });
    }//groupTicks
    */
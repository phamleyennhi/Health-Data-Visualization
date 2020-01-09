var parseYear = d3.timeParse("%Y");

d3.json("data2.json").get(function(error, data){
	
	//wrap function
	function wrap(text, width) {
	  text.each(function() {
	    var text = d3.select(this),
	        words = text.text().split(/\s+/).reverse(),
	        word,
	        line = [],
	        lineNumber = 0,
	        lineHeight = 1.1, // ems
	        y = text.attr("y"),
	        dy = parseFloat(text.attr("dy")),
	        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
	    while (word = words.pop()) {
	      line.push(word);
	      tspan.text(line.join(" "));
	      if (tspan.node().getComputedTextLength() > width) {
	        line.pop();
	        tspan.text(line.join(" "));
	        line = [word];
	        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	      }
	    }
	  });
	}

	var height = window.innerHeight/2;
	var width = window.innerWidth/2;
	var margin = {left: 100, right: 50, top: 40, bottom: 0};

	var infoData = [];
	for (var i = 1000; i <= 1061; i++){
		infoData.push({year: parseYear(data["data"][i][8]), gender: data["data"][i][10], age: Number(data["data"][i][11])});
	}
	console.log(infoData);

	var max = d3.max(infoData, function(d){ return d.age; });
	var minYear = d3.min(infoData, function(d){ return d.year; });
	var maxYear = d3.max(infoData, function(d){ return d.year; });
	console.log(maxYear);


	var y = d3.scaleLinear()
			.domain([0, max])
			.range([height, 0]);

	var x = d3.scaleTime()
				.domain([minYear, maxYear])
				.range([0, width]);


	var yAxis = d3.axisLeft(y).ticks(10).tickPadding(5).tickSize(10);
	var xAxis = d3.axisBottom(x);

	var svg = d3.select("body").append("svg")
					.attr("height", "100%").attr("width", "100%");

	var chartGroup = svg.append("g")
						.attr("transform", "translate("+margin.left+", "+margin.top+")");

	var line = d3.line()
				.x(function(d){ return x(d.year); })
				.y(function(d){ return y(d.age); });

	//zoom function
	chartGroup.call(d3.zoom().scaleExtent([0.8, 2]).on("zoom", function(){
	    chartGroup.attr("transform", d3.event.transform);
	}));

	chartGroup.append("path").attr("d", line(infoData));

    chartGroup.append("text")  
		  .attr("class", "axisTitle")           
	      .attr("transform",
	            "translate(" + (width/2) + " ," + 
	                           (height + margin.top + 60) + ")")
	      .style("text-anchor", "middle")
	      .text("Year");

    chartGroup.append("text")
    		  .attr("class", "axisTitle") 
		      .attr("transform", "rotate(-90)")
		      .attr("y", 0 - margin.left)
		      .attr("x",0 - (height / 2))
		      .attr("dy", "1em")
		      .style("text-anchor", "middle")
		      .text("Age");      

	chartGroup.append("text")
      .attr("class", "title")
      .attr("y", -15)
      .text("Life expectancy in the United States during 1955-2017");

	chartGroup.append("g").attr("class", "x axis").attr("transform", "translate(0, "+height+")").call(xAxis);
	chartGroup.append("g").attr("class", "y axis").call(yAxis);
});
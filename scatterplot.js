var parseYear = d3.timeParse("%Y");

d3.json("data2.json").get(function(error, data){
	var height = window.innerHeight/2;
	var width = window.innerWidth/2;
	var margin = {left: 100, right: 50, top: 40, bottom: 0};


	var infoData = [];
	for (var i = 0; i < data["data"].length; i++){
		infoData.push({year: parseYear(data["data"][i][8]), gender: data["data"][i][10], age: Number(data["data"][i][11])});
	}


	var max = d3.max(infoData, function(d){ return d.age; });
	var minYear = d3.min(infoData, function(d){ return d.year; });
	var maxYear = d3.max(infoData, function(d){ return d.year; });

	var y = d3.scaleLinear()
			.domain([0, max])
			.range([height, 0]);

	var x = d3.scaleTime()
				.domain([minYear, maxYear])
				.range([0, width]);

	var color = d3.scaleOrdinal(d3.schemeCategory10);

	var yAxis = d3.axisLeft(y).ticks(10).tickPadding(5).tickSize(10);
	var xAxis = d3.axisBottom(x);

	var svg = d3.select("body").append("svg")
					.attr("height", "100%").attr("width", "100%");

	var chartGroup = svg.append("g")
						.attr("transform", "translate("+margin.left+", "+margin.top+")");


	 chartGroup.selectAll(".dot").data(infoData)
    			.enter().append("circle")
      			.attr("class", "dot")
      			.attr("cx", function(d) { return x(d.year); })
      			.attr("cy", function(d) { return y(d.age); })
      			.attr("r", 3.5)
      			.style("fill", function(d) { return color(d.gender); });


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


    var gender = svg.selectAll(".gender")
      				.data(color.domain())
    				.enter().append("g")
      				.attr("class", "gender")
      				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    gender.append("rect")
      .attr("x", width + 50)
      .attr("y", height - 40)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  	gender.append("text")
      .attr("x", width + 40)
      .attr("y", height - 33)
      .attr("dy", ".35em")
      .attr("font-size", "20px")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

	chartGroup.append("g").attr("class", "x axis").attr("transform", "translate(0, "+height+")").call(xAxis);
	chartGroup.append("g").attr("class", "y axis").call(yAxis);
})
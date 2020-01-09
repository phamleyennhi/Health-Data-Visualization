
d3.json("data3.json").get(function(error, data){

	var height = window.innerHeight/2;
	var width = window.innerWidth;
	var margin = {left: 100, right: 50, top: 40, bottom: 0};

	var countries = [];
	for (var i = 0; i < data.length; i++){
		countries.push({region: data[i].region, population: Number(data[i].population), income: Number(data[i].income), age: Number(data[i].lifeExpectancy)});
	}

	var max = d3.max(countries, function(d){ return d.age; });
	var minIncome = d3.min(countries, function(d){ return d.income; });
	var maxIncome = d3.max(countries, function(d){ return d.income; });

	console.log(maxIncome)
	var y = d3.scaleLinear()
				.domain([0, max])
				.range([height, 0]);

	var x = d3.scaleLinear()
				.domain([minIncome, maxIncome])
				.range([0, width]);

	var size = d3.scaleLinear().domain(d3.extent(countries, function(d){ return d.population; }))
				    .range([5, 60]);

	var regions = d3.set(countries.map(d => d.region));
	var color = d3.scaleOrdinal(d3.schemeCategory10)
					.domain(regions.values());


	var yAxis = d3.axisLeft(y);
	var xAxis = d3.axisBottom(x).ticks(30);

	var svg = d3.select("body").append("svg")
					.attr("height", "100%").attr("width", "100%");

	var chartGroup = svg.append("g")
						.attr("transform", "translate("+margin.left+", "+margin.top+")");


	chartGroup.selectAll("circle").data(countries)
    			.enter().append("circle")
      			.attr("class", "bubble")
      			.attr("cx", function(d) { return x(d.income); })
      			.attr("cy", function(d) { return y(d.age); })
      			.attr("r", function(d) { return size(d.population)})
      			.style("fill", function(d) { return color(d.region); });


    chartGroup.append("text")  
		  .attr("class", "axisTitle")           
	      .attr("transform",
	            "translate(" + (width/2) + " ," + 
	                           (height + margin.top + 60) + ")")
	      .style("text-anchor", "middle")
	      .text("Income ($)");

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
      .text("World Health and Wealth of Countries");

    var region = svg.selectAll(".region")
      				.data(color.domain())
    				.enter().append("g")
      				.attr("class", "region")
      				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    region.append("rect")
      .attr("x", width - 90)
      .attr("y", height - 110)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  	region.append("text")
      .attr("x", width - 100)
      .attr("y", height - 100)
      .attr("dy", ".35em")
      .attr("font-size", "20px")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

    chartGroup.append("g").attr("class", "x axis").attr("transform", "translate(0, "+height+")").call(xAxis);
	chartGroup.append("g").attr("class", "y axis").call(yAxis);

});

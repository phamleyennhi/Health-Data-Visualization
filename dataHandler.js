d3.json("data.json").get(function(error, data){

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

	//collect relevant data in json file
	var healthData = data["meta"]["view"]["columns"]["9"]["cachedContents"]["top"];
	var healthCount = []
	var healthCauses = []
	for (var i = 0; i < healthData.length; i++){
		healthCauses.push(healthData[i]["item"]);
		healthCount.push(Number(healthData[i]["count"]));
	}

	//declare width, height, and margin based on the data
	var height = d3.max(healthCount, function(d){ return d; });
	var width = 1000;
	var margin = {left: 50, right: 50, top: 40, bottom: 0};

	//create x axis and y axis
    var x = d3.scaleBand()
    			.domain(healthCauses)
    			.range([0, width])
    			.paddingInner(0.3);

    var y = d3.scaleLinear()
 						.domain([0, height])
 						.range([height, 0]);

	var xAxis = d3.axisBottom(x);
	var yAxis = d3.axisLeft(y);

	//create the chart
	var svg = d3.select("body").append("svg")
									.attr("height", "100%")
									.attr("width", "100%");
	
	var chartGroup = svg.append("g")
						.attr("transform", "translate("+margin.left+", "+margin.top+")");
	
	//zoom function
	chartGroup.call(d3.zoom().scaleExtent([0.8, 2]).on("zoom", function(){
	    chartGroup.attr("transform", d3.event.transform);
	}));

	chartGroup.selectAll("rect")
				.data(healthCount)
				.enter().append("rect")
				.attr("class", "bar")
				.attr("height", function(d, i){ return d; })
				.attr("width", x.bandwidth())
				.attr("fill", "blue")
				.attr("x", function(d, i){ return x(healthCauses[i]); })
				.attr("y", function(d, i){ return y(d);});
    
    chartGroup.append("text")  
    		  .attr("class", "axisTitle")           
		      .attr("transform",
		            "translate(" + (width/2) + " ," + 
		                           (height + margin.top + 60) + ")")
		      .style("text-anchor", "middle")
		      .text("Causes");

    chartGroup.append("text")
    		  .attr("class", "axisTitle") 
		      .attr("transform", "rotate(-90)")
		      .attr("y", 0 - margin.left)
		      .attr("x",0 - (height / 2))
		      .attr("dy", "1em")
		      .style("text-anchor", "middle")
		      .text("Number of cases");      

	chartGroup.append("text")
      .attr("class", "title")
      .attr("y", -15)
      .text("Health causes in the United States")

 	chartGroup.append("g").attr("class", "y axis").call(yAxis);
 	chartGroup.append("g").attr("class", "x axis")
							.attr("transform", "translate(0, "+height+")")
							.call(xAxis).selectAll(".tick text")
      						.call(wrap, x.bandwidth());;

});
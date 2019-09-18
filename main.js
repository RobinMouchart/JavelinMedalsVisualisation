const width = d3.select('svg').attr('width');
const height = d3.select('svg').attr('height');
const svg = d3.select('svg');
const slider = document.getElementById('slider');

const pas = 30;
var year = 2019;
var csv;
var data = [];
var dataset = [];
var COUNTRIES;
var xScaleData = [];

slider.addEventListener('input', e => handleChange(e));


d3.csv("./javelot.csv").then(function (d) {
    d.pop();
    csv = d;
    COUNTRIES = new Set();
    csv.map(e => {
        COUNTRIES.add(e["Gold"]);
        COUNTRIES.add(e["Silver"]);
        COUNTRIES.add(e["Bronze"]);
    })
    COUNTRIES.forEach(country => dataset.push({"country":country, "medals":[0,0,0]})); 
    data = csv.filter( e => parseInt(e["Year"]) <= year );
    data.map( games => {
        //add gold medal
        dataset.map(o => { o["country"] == games["Gold"] ? o["medals"][0] += 1 : null});
        //add silver medal
        dataset.map(o => { o["country"] == games["Silver"] ? o["medals"][1] += 1 : null});
        //add bronze medal
        dataset.map(o => { o["country"] == games["Bronze"] ? o["medals"][2] += 1 : null});
    });
    dataset.sort( (b,a) => {
        var goldA = a["medals"][0]
        var silverA = a["medals"][1]
        var bronzeA = a["medals"][2]
        var goldB = b["medals"][0]
        var silverB = b["medals"][1]
        var bronzeB = b["medals"][2]
        if ((goldA-goldB) + (silverA-silverB) + (bronzeA-bronzeB) != 0 ){
            return (goldA-goldB) + (    silverA-silverB) + (bronzeA-bronzeB)
        }
        else {
            return 3*(goldA-goldB) + 2*(silverA-silverB) + (bronzeA-bronzeB)
        }
    });
    xScaleData = dataset;
    renderGraph();
});

function renderGraph() {
        const margin = {"top": 20, "bottom": 30, "left": 120, "right": 20}
        const innerHeight = height - margin.top - margin.bottom;
        const innerWidth = width - margin.left - margin.right;
        
        // const xScale = d3.scaleLinear()
        //     .domain([0,d3.max(xScaleData, d => d.medals.reduce((x,y)=>x+y))])
        //     .range(0,innerWidth);
        
        // const axisGroup = svg.select('axisg')
        //     .data([null])
        //     .enter()
        //     .append('axisg')
        //     .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        // axisGroup.call(d3.axisBottom(xScale));
        
        var groups = svg.selectAll('g')
                            .data(dataset, d=>d.country);

        const groupsEnter = groups.enter().append('g');
        groupsEnter.attr('transform', `translate(${margin.left}, ${margin.top})`);
        groups.exit().remove();

        // Draw gold                           
        var gold = groups.select(".gold");
        groupsEnter
        .append('rect')
            .attr('class','gold')
            .attr('x',0)
            // .on('mouseover', function (d,i) {d3.select(this).attr('y',i*pas-5);console.log(this,i)})
            // .on('mouseleave', function (d,i) {d3.select(this).attr('y',i*pas);console.log(this,i)})
        .merge(gold).transition().duration(400)
            .attr('width', d => d.medals[0]*pas)
            .attr('y', (d,i) => i*pas)
            .attr('height', pas);
        
        gold.exit()
        .transition().duration(400)
        .remove();
        
        
        // Draw Silver    
        var silver = groups.select(".silver");     
        groupsEnter
            .append('rect')
                .attr('class','silver')
            .merge(silver).transition().duration(400)
                .attr('x',d => d.medals[0]*pas)
                .attr('width', d => d.medals[1]*pas)
                .attr('y', (d,i) => i*pas)
                .attr('height', pas);
            
            silver.exit()
            .transition().duration(400)
            .remove();        
            
            // Draw Bronze    
            var bronze = groups.select(".bronze");     
            groupsEnter
            .append('rect')
                .attr('class','bronze')
            .merge(bronze).transition().duration(400)
                .attr('x',d => (d.medals[0] + d.medals[1])*pas)
                .attr('width', d => d.medals[2]*pas)
                .attr('y', (d,i) => i*pas)
                .attr('height', pas);
            
            bronze.exit()
            .transition().duration(400)
            .remove();        

            //Draw text
            var text = groups.select('text');
            groupsEnter
                .append('text')
                .merge(text).transition().duration(400)
                    .text(d => d.medals[0] + d.medals[1] + d.medals[2] > 0 ? d.country : null)
                    .attr('x', d=> 5 + (d.medals[0] + d.medals[1] + d.medals[2])*pas)
                    .attr('y',(d,i)=> (i+0.5)*pas+5);
        }

function handleMouseOver(d,i) {
    alert('mouse over');
    d3.select(this)
        .attr('y', i*pas -10 );
}

function handleChange(e) {
    year = e.target.value;
    data = csv.filter( e => parseInt(e["Year"]) <= year );
    dataset = []
    COUNTRIES.forEach(country => dataset.push({"country":country, "medals":[0,0,0]}));
    data.map( games => {
        //add gold medal
        dataset.map(o => { o["country"] == games["Gold"] ? o["medals"][0] += 1 : null});
        //add silver medal
        dataset.map(o => { o["country"] == games["Silver"] ? o["medals"][1] += 1 : null});
        //add bronze medal
        dataset.map(o => { o["country"] == games["Bronze"] ? o["medals"][2] += 1 : null});
    });
    dataset.sort( (b,a) => {
        var goldA = a["medals"][0]
        var silverA = a["medals"][1]
        var bronzeA = a["medals"][2]
        var goldB = b["medals"][0]
        var silverB = b["medals"][1]
        var bronzeB = b["medals"][2]
        if ((goldA-goldB) + (silverA-silverB) + (bronzeA-bronzeB) != 0 ){
            return (goldA-goldB) + (    silverA-silverB) + (bronzeA-bronzeB)
        }
        else {
            return 3*(goldA-goldB) + 2*(silverA-silverB) + (bronzeA-bronzeB)
        }
    });
    
    // document.getElementById('canvas').innerHTML = ""
    document.getElementById('year').innerHTML = `Year: ${year}`
    renderGraph();
};

document.getElementById('animate').addEventListener('click', animate)
function animate(e) {
    
    console.log(csv);
    var i = 0
    handleChange({'target':{'value':1908}});
    anim = setInterval(() => {
        console.log(csv[i])
        console.log(year);
        year = parseInt(csv[i].Year)
        handleChange({'target':{'value':year}});
        if (year == 2016) {
            clearTimeout(anim);
        }
        i += 1;
    }, 500);
}

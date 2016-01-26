var plot = require('plotter').plot

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function WattsStrogatz(n, K, beta) {
    var graph = []
    K = K>>1; // divide by two
    for (var i = 0; i < n; i++) {
        // create a latice ring structure
        for (var j = 1; j <= K; j++) {
            if(graph[i] === undefined) {
                graph[i] = []
            }
            graph[i][(i+j)%n] = 1
            if(graph[(i+j)%n] === undefined) {
                graph[(i+j)%n] = []
            }
            graph[(i+j)%n][i] = 1
        }
    }
    // rewiring of edges
    for (var i = 0; i < n; i++) {
        for (var j = 1; j <= K; j++) { // for every pair of nodes
            if (Math.random() <= beta) {
                var node
                do {
                    node = getRandomInt(0, 100)
                } while(graph[i][node] === 1)
                delete graph[i][(i+j)%n]
                delete graph[(i+j)%n][i]
                graph[i][node] = 1
                graph[node][i] = 1
            }
        }
    }
    return graph;
}

function calcL(graph) {
    var dist = []
    for(var i=0;i<graph.length;i++) {
        dist[i] = []
        for(var j=0;j<graph.length;j++) {
            if(i===j) {
                dist[i][j] = 0
            } else if(graph[i][j] === 1) {
                dist[i][j] = 1
            } else {
                dist[i][j] = Infinity
            }
        }
    }

    for(var k=0;k<graph.length;k++) {
        for(var i=0;i<graph.length;i++) {
            for(var j=0;j<graph.length;j++) {
                if(dist[i][j] > dist[i][k] + dist[k][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j]
                }
            }
        }
    }

    var sum = 0
    for(var i=0;i<graph.length;i++) {
        for(var j=0;j<graph.length;j++) {
            sum += dist[i][j]
        }
    }

    var L = sum/(graph.length * (graph.length - 1) )
    return L
}

function calcC(graph) {
    var sum = 0
    for(var i=0;i<graph.length;i++) {
        var val = 0

        for(var j=0;j<graph[i].length;j++) {
            for(var k=0;k<graph[j].length;k++) {
                if(graph[i][k] === graph[j][k] && graph[i][k] === 1) {
                    val += 1
                }
            }
        }

        sum += val
    }

    var C = sum / (2*graph.length)
    return C
}

var probabilities = [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.1, 0.4, 0.8, 1]

var Ls = []
var Cs = []
for (var i = 0; i<probabilities.length; i++) {
    var graph = WattsStrogatz(100, 10, probabilities[i])
    if(i===0) {
        Ls[i] = calcL(graph)
        Cs[i] = calcC(graph)
    } else {
        Ls[i] = calcL(graph)/Ls[0]
        Cs[i] = calcC(graph)/Cs[0]
    }
}

plot({
    data:       { Ls : Ls, Cs: Cs },
    filename:   'output.png'
})

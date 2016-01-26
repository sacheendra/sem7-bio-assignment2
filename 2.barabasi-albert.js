var plot = require('plotter').plot

function BarabasiAlbertDegrees(N, m0, M) {
    var graph = { nodes: [], edges: [] },
        edge_lut = {},
        degrees = [],
        i, j, edge, sum, s, m, r, p;
    // creating m0 nodes
    for (i = 0; i < m0; i++) {
        graph.nodes.push({ label: 'node '+i });
        degrees[i] = 0;
    }
    // Linking every node with each other (no self-loops)
    for (i = 0; i < m0; i++) {
        for (j = i+1; j < m0; j++) {
            edge = { source: i, target: j };
            edge_lut[edge.source+'-'+edge.target] = edge;
            graph.edges.push(edge);
            degrees[i]++;
            degrees[j]++;
        }
    }
    // Adding N - m0 nodes, each with M edges
    for (i = m0; i < N; i++) {
        graph.nodes.push({ label: 'node '+i });
        degrees[i] = 0;
        sum = 0;  // sum of all nodes degrees
        for (j = 0; j < i; j++) sum += degrees[j];
        s = 0;
        for (m = 0; m < M; m++) {
            r = Math.random();
            p = 0;
            for (j = 0; j < i; j++) {
                if (edge_lut[i+'-'+j] || edge_lut[j+'-'+i]) continue;
                if (i == 1) p = 1;
                else p += degrees[j] / sum + s / (i - m);

                if (r <= p) {
                    s += degrees[j] / sum;
                    edge = { source: i, target: j };
                    edge_lut[edge.source+'-'+edge.target] = edge;
                    graph.edges.push(edge);
                    degrees[i]++;
                    degrees[j]++;
                    break;
                }
            }
        }
    }
    return degrees;
}

var degrees = BarabasiAlbertDegrees(1000, 100, 45)

var numberOfNodesWithDegree = {}

for(var i=0;i<degrees.length;i++) {
    if(numberOfNodesWithDegree[degrees[i]]) {
        numberOfNodesWithDegree[degrees[i]]++
    } else {
        numberOfNodesWithDegree[degrees[i]] = 1
    }
}

plot({
    data:       { degree : numberOfNodesWithDegree },
    filename:   'output.png'
})
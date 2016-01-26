from random import randint,sample
nodes_number=int(input("Number of nodes: "))
adj_matrix=[[] for x in xrange(nodes_number)]

for i in range(nodes_number):
	for j in range(nodes_number):
		key=randint(0,1)
		adj_matrix[i].append(key)

changed_edges=[]
for k in range(nodes_number):
	keys=sample(range(0,nodes_number-1), 4)
	if(adj_matrix[keys[0]][keys[1]] == 1 & adj_matrix[keys[2]][keys[3]] == 1):
		#rewire the edges
		if(adj_matrix[keys[0]][keys[3]]== 0):
			changed_edges.append([keys[0],keys[3]])
		elif(adj_matrix[keys[1]][keys[2]]== 0):
			changed_edges.append([keys[1],keys[2]])

		adj_matrix[keys[0]][keys[3]]=1
		adj_matrix[keys[1]][keys[2]]=1
		#delete the existing edges
		adj_matrix[keys[0]][keys[1]]=0
		adj_matrix[keys[2]][keys[3]]=0

print changed_edges
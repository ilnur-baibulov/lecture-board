Board.figure('slider',{init:{value:0},controls:[{key:'value',type:'range',min:0,max:10}],draw(g,s){g.dot(100+50*s.value,200,8)}});

class Public{
	constructor(count, color) {
	    this.count = count;//用来记录悔棋次数，只能悔棋一次,初始为0
	    this.color = color;//true为黑子先下，false为白子先下
	  }

	/**
	*创建一个二维数组，来记录各个点的信息\
	*因为棋盘为15X15,初始都为0
	*/
	creatArray() {
		let twoArray = [];
		for (let i=0; i<15; i++) {
		    twoArray[i] = [] ;
		    for (let j=0; j<15; j++) {
		        twoArray[i][j] = 0;
		    }
		}
		return twoArray;
	}
	/*
	将true与1转换，将false与2转换，即区分黑白子
	*/
	boolToNum(flag){
		let bool = null;
		switch(flag)
			{
			case true:
			  bool = 1;
			  break;
			case false:
			  bool = 2;
			  break;
			default:
			  break;
			}
		return bool;	
	}
	
	/**
	*获胜的算法可以分为，
	*横线5个 —— 纵坐标连着的5个都为i，且棋子标识都一样 如[1,0],[2,0]，[3,0]，[4,0]，[5,0]
	*竖线5个 |  ...
	*左斜线5个 / 为坐标递增1，标识一样
	*右斜线5个 \
	*/
	successWay(i,j,color,dataArray){
		
		//黑旗将标识为1，白棋为2
		let flag = 0;
		if(color){
			flag = 1
		} else {
			flag = 2
		}
		//四种方式都验证是否成功		
		if(this.oneWay(i,j,flag,dataArray) ||this.twoWay(i,j,flag,dataArray) ||this.threeWay(i,j,flag,dataArray) ||this.fourWay(i,j,flag,dataArray))
		{
			alert(flag==1?'黑棋胜':'白棋胜')
		}
	}
	/**
	*横向判断
	**/
	oneWay(i,j,flag,dataArray){
		let left = true;
		let right = true;
		for(let k=1; k<5; k++){
			if((i-k < 0) || dataArray[i-k][j] !== flag){
				left = false;
				break;
			}
		}
		for(let s=1; s<5; s++){
			if((i+s > 15) || dataArray[i+s][j] !== flag){
				right = false;
				break;
			}
		}
		let oks = {
			'left': left,
			'right' : right
		}
		return oks;
	}
	/**
	*纵向判断
	**/
	twoWay(i,j,flag,dataArray){
		let top = true;
		let bottom = true;
		for(let k=1; k<5; k++){
			if((j-k < 0) || dataArray[i][j-k] !== flag){
				top = false;
				break;
			}
		}
		for(let s=1; s<5; s++){
			if((j+s > 15) || dataArray[i][j+s] !== flag){
				bottom = false;
				break;
			}
		}
		return (top||bottom);
	}
	/**
	*撇向判断
	**/
	threeWay(i,j,flag,dataArray){
		let top = true;
		let bottom = true;
		for(let k=1; k<5; k++){
			if((i+k > 15) || dataArray[i+k][j-k] !== flag){
				top = false;
				break;
			}
		}
		for(let s=1; s<5; s++){
			if((i-s < 0) || dataArray[i-s][j+s] !== flag){
				bottom = false;
				break;
			}
		}
		return (top||bottom);
	}
	/**
	*捺向判断
	**/
	fourWay(i,j,flag,dataArray){
		let top = true;
		let bottom = true;
		for(let k=1; k<5; k++){
			if((i-k < 0) || dataArray[i-k][j-k] !== flag){
				top = false;
				break;
			}
		}
		for(let s=1; s<5; s++){
			if((i+s > 15) || dataArray[i+s][j+s] !== flag){
				bottom = false;
				break;
			}
		}
		return (top||bottom);
	}
}

class CanvasBang {
	constructor(context,historyXY, historyStep,cacheStep,color,count) {
		this.context = context;
    	this.historyXY = historyXY;
    	this.historyStep = historyStep;
    	this.cacheStep = cacheStep;
    	this.color = color;
    	this.count  = count;
  }

  			/*
	初始化
	*/
	initCanvas(img){
		this.context.drawImage(img,0,0,450,450);	
	    	this.drawAllLine();
	    	for(var i =0;i<this.historyXY.length;i++){
				for (var j = 0; j < this.historyXY[i].length; j++) {
					//画棋子
					var ff = this.historyXY[i][j];			
					if(ff != 0){
						var isColor = this.numToBool(ff);
						this.oneStep(i,j,isColor);
					}			
				}
			}
		/*img.onload = function(){
			console.log(this.context.drawImage)
	    	this.context.drawImage(img,0,0,450,450);	
	    	this.drawAllLine();
	    	for(var i =0;i<this.historyXY.length;i++){
				for (var j = 0; j < this.historyXY[i].length; j++) {
					//画棋子
					var ff = this.historyXY[i][j];			
					if(ff != 0){
						var isColor = this.numToBool(ff);
						this.oneStep(i,j,isColor);
					}			
				}
			}
		}*/
	}
	/*
	将1与true转换，将2与false转换，即区分黑白子
	*/
	numToBool(flag){
		let bool = null;
		switch(flag)
			{
			case 1:
			  bool = true;
			  break;
			case 2:
			  bool = false;
			  break;
			default:
			  break;
			}
		return bool;	
	}
  	/**
	*	画棋盘
	*
	**/
	drawAllLine(){
		this.context.beginPath();
		for (var i=0; i<15; i++) {
		    this.context.moveTo(15,15+i*30);
		    this.context.lineTo(435,15+i*30);
		    this.context.stroke();
		    this.context.moveTo(15+i*30,15);
		    this.context.lineTo(15+i*30,435);
		    this.context.stroke(); 
		}
	}
	/**
	*画棋子
	*i 横坐标的值
	*j 纵坐标的值
	*color 黑子还是白子 true为黑
	**/
	oneStep(i, j, color){
    	this.context.beginPath();
    	this.context.arc(15+i*30, 15+j*30, 13, 0, 2*Math.PI);
    	this.context.closePath() ;
    	//设置渐变
    	var gradient = this.context.createRadialGradient(15+i*30+2, 15+j*30-2, 15, 15+i*30, 15+j*30, 0);
    	if(color){
       		gradient.addColorStop(0, "#0a0a0a");
        	gradient.addColorStop(1, "#636766");
    	}else{
        	gradient.addColorStop(0, "#D1D1D1");
        	gradient.addColorStop(1, "#F9F9F9");
    	}
    	this.context.fillStyle = gradient ;
    	this.context.fill();
    	//下完之后判断是否成功
    	this.successWay(i,j,color,this.historyXY);
	}
	/*
	 * 落子事件方法
	 */
	eventMeth(e){
		//获取点击鼠标的坐标
		var x = e.offsetX ;
	    var y = e.offsetY ;
	    //计算横坐标和纵坐标。每个单元格是30px;
	    var i = Math.floor(x/30) ;
	    var j = Math.floor(y/30) ;

	    if(this.historyXY[i][j] == 0){
	    	//每当这个坐标下了棋之后，如果是黑旗将标识改为1，否则为2
	    	if(this.color){
	    		this.historyXY[i][j] = 1;
	    	} else {
	    		this.historyXY[i][j] = 2;	
	    	}
	    	//将当前点击的点，推入堆栈
	    	this.historyStep.push([i,j]);
	    	//画出棋子
	    	this.oneStep(i,j,this.color);
	    	//这里是为了改变黑白子的下棋顺序
	    	this.color = !this.color ;
	    	//重置悔棋统计
	    	this.count = 0;
	    	
	    }
	}
	/**
	 * 悔棋
	 */
	back(img){
		if(this.count > 0){
			//说明已经悔棋了，不能再悔棋了
			alert("只能悔棋一次哦");
			return false;
		}
		//从历史堆栈中取出最近的一步坐标
		var lastStep = this.historyStep.pop();//[i,j]
		//将棋盘数据中的对应坐标的标记置为0
		this.historyXY[lastStep[0]][lastStep[1]] = 0;
		//将悔棋坐标放入悔棋堆栈中，让撤销悔棋使用
		this.cacheStep.push(lastStep);
		//保留原先的角色
		this.color = !this.color;
		this.count++ 
		//初始化棋盘
		this.initCanvas(img);
	}
	/*
	 * 撤销悔棋
	 */
	justback(){
		if(this.count == 0){
			alert('无法继续撤销');
			return false;
		}
		//取出最近一次悔棋的坐标
		var rePrint = this.cacheStep.pop();
		//重新画
		this.oneStep(rePrint[0],rePrint[1],this.color);
		//撤销悔棋时也需要将悔棋状态重置
		this.count = 0;
		//并且要将最近一次悔棋的坐标放入历史堆栈中，不然下次悔棋的起点不一样
		this.historyStep.push(rePrint);
		//改变棋盘的数据
		this.historyXY[rePrint[0]][rePrint[1]] = this.boolToNum(this.color);
		//保留原先的角色
		this.color = !this.color;
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
		return (left||right);
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
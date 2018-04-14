class DomBang {
	constructor(id,historyDomXY, historyDomStep,cacheDomStep,color,count) {
		this.id = id;
	    this.historyDomXY = historyDomXY;
	    this.historyDomStep = historyDomStep;
	    this.cacheDomStep = cacheDomStep;
	    this.count = count;
	    this.color = color;
 }
	/**
	 * 重新开始
	 */
	initDom(){
		var dom = document.getElementById(this.id);
		var bis = document.getElementsByClassName('blackQi');
		var wis = document.getElementsByClassName('whiteQi');
		for(let i = bis.length-1;i>=0;i--){
			dom.removeChild(bis[i]);
						
		};
		for(let i = wis.length-1;i>=0;i--){			
			dom.removeChild(wis[i]);						
		};
	}
  	/**
	*画出dom版棋子
	*/
	oneDomStep(i,j,colorDom){
		var className = '';
		if(colorDom){
			className = 'blackQi'
		} else {
			className = 'whiteQi'
		}
		var top = j*31+3;
		var left = i*30+3;

		var domHtml = '<div class="'+ className +'" style="top:'+ top +'px;left:'+ left +'px"></div>';
		let divHt = document.createElement('div');
		divHt.classList.add(className);
		divHt.style.top = top + 'px';
		divHt.style.left = left + 'px';
		divHt.setAttribute("id",i+'_'+j)
		var dom = document.getElementById(this.id);
		dom.appendChild(divHt);

		//下完之后校验
		this.successWay(i,j,this.color,this.historyDomXY);
	}
	/**
	 * 落子事件
	 */
	eventDown(e){
		
		var x = e.layerX ;
	    var y = e.layerY ;
	    var i = Math.floor(x/30) ;
	    var j = Math.floor(y/30) ;
	    console.log(this.historyDomXY[i][j]);
	    if(this.historyDomXY[i][j] == 0){
	    	//每当这个坐标下了棋之后，如果是黑旗将标识改为1，否则为2
	    	if(this.color){
	    		this.historyDomXY[i][j] = 1;
	    	} else {
	    		this.historyDomXY[i][j] = 2;	
	    	}
	    	//将当前点击的点，推入堆栈
	    	this.historyDomStep.push([i,j]);
	    	//画出棋子
	    	this.oneDomStep(i,j,this.color);
	    	//这里是为了改变黑白子的下棋顺序
	    	this.color = !this.color ;
	    	//重置悔棋统计
	    	this.count = 0;
	    }
	}
	/**
	 * 悔棋事件
	 */
	backDom(){
		if(this.count > 0){
			//说明已经悔棋了，不能再悔棋了
			alert("只能悔棋一次哦");
			return false;
		}
		//从历史堆栈中取出最近的一步坐标
		var lastStep = this.historyDomStep.pop();//[i,j]
		//将棋盘数据中的对应坐标的标记置为0
		this.historyDomXY[lastStep[0]][lastStep[1]] = 0;
		//将悔棋坐标放入悔棋堆栈中，让撤销悔棋使用
		this.cacheDomStep.push(lastStep);
		//保留原先的角色
		this.color = !this.color;
		this.count++ 
		//删除指定节点
		var father = document.getElementById(this.id);
		var removeDom = document.getElementById(lastStep[0]+'_'+lastStep[1]);
		father.removeChild(removeDom);
	}
	/**
	 * 撤销悔棋事件
	 */
	justBackDom(){
		if(this.count == 0){
			alert('无法继续撤销');
			return false;
		}
		//取出最近一次悔棋的坐标
		var rePrint = this.cacheDomStep.pop();
		//重新画
		this.oneDomStep(rePrint[0],rePrint[1],this.color);
		//撤销悔棋时也需要将悔棋状态重置
		this.count = 0;
		//并且要将最近一次悔棋的坐标放入历史堆栈中，不然下次悔棋的起点不一样
		this.historyDomStep.push(rePrint);
		//改变棋盘的数据
		this.historyDomXY[rePrint[0]][rePrint[1]] = this.boolToNum(this.color);
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
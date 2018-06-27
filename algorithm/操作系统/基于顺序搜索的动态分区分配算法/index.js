var freeTable1 = new Array();
var freeTable2 = new Array();//首次适应
var freeTable3 = new Array();//
var freeTable4 = new Array();//

var size = 10//size为最小不可再分阈值

var MAX = 1024//内存大小为1024K
var flag = 0;//标记

// function leftMemory()
// {
// 	var length =  freeTable[0].length;
// 	var free  = MAX;
//  	for (var i = 0; i < freeTable1.length; i++){
// 		free = free - freeTable1[i][2];
// 	}
//  	return free;
// }


freeTable1[0] = new Array(3,0,100,1);
freeTable1[1] = new Array(1,100,2,1);
freeTable1[2] = new Array(9,200,100,0);
freeTable1[3] = new Array(4,300,30,1);
freeTable1[4] = new Array(7,400,56,1);
freeTable1[5] = new Array('free',500,524,0);



function netxFit()//循环首次
{
	var value = document.getElementById("input").value;
	var num = value.split(',')[0],request = value.split(',')[1];
	for(var i = flag; i < freeTable1.length ; i++ )
		{
			if(request <freeTable1[i][2]&& !freeTable1[i][3])
				{
					if(freeTable1[i][2] - request > size)//从i分区画出request大小的空间
					{
					 	flag = i;
						freeTable1[i][2] = freeTable1[i][2]- request ;//修改分区大小
						newrow = new Array(num,freeTable1[i][1]+freeTable1[i][2],request,1);
						freeTable1.splice(i+1,0,newrow);
						show();
						return true;
					}
					else
						{
						 	flag = i;
							alert(freeTable1[i][0]);
							freeTable1[i][0] = num;//修改分区号
							freeTable1[i][3] = 1;//修改状态为已分配
							show();
							return true;
						}
				}
		}
 	flag = 0;
	alert("内存空间不足，无法分配!");
	return false;

}


function bestFit()//差值最小
{
	var value = document.getElementById("input").value;
	var num = value.split(',')[0],request = value.split(',')[1];
	var Min = 1024;//记录差值最小
	var j = -1;//记录差值最小的分区位置
	for(var i = 0; i < freeTable1.length ; i++ )
	{
		if( !freeTable1[i][3] && freeTable1[i][2] > request)//空闲且空间足够大
			{
				if(freeTable1[i][2] - request < Min)
					{
						Min = freeTable1[i][2] - request;
						j = i;//更新j
					}
			}
	}


	if(freeTable1[j][2] - request > size)//从j分区画出request大小的空间
		{
			freeTable1[j][2] = freeTable1[j][2]- request ;//修改分区大小
			newrow = new Array(num,freeTable1[j][1]+freeTable1[j][2],request,1);
			freeTable1.splice(j+1,0,newrow);
			show();
			return true;
		}
		else
			{
				alert(freeTable1[j][0]);
				freeTable1[j][0] = num;//修改分区号
				freeTable1[j][3] = 1;//修改状态为已分配
				show();
				return true;
			}
	
	alert("内存空间不足，无法分配!");
	return false;

}


function worstFit()//最坏匹配
{
	var value = document.getElementById("input").value;
	var num = value.split(',')[0],request = value.split(',')[1];
	var Max = 0;//记录差值最大
	var j = -1;
	//选择法找出最大的分区号
	for(var i = 0; i < freeTable1.length ; i++ )
		{
			if( !freeTable1[i][3] && freeTable1[i][2] > request)//空闲且空间足够大
				{
					if(freeTable1[i][2] - request > Max)
						{
							Max = freeTable1[i][2] - request;
							j = i;//更新j
						}
				}
		}


	if(freeTable1[j][2] - request > size)//从i分区画出request大小的空间
	{
		freeTable1[j][2] = freeTable1[j][2]- request ;//修改分区大小
		newrow = new Array(num,freeTable1[j][1]+freeTable1[j][2],request,1);
		freeTable1.splice(j+1,0,newrow);
		show();
		return true;
	}
	else
		{
			alert(freeTable1[j][0]);
			freeTable1[j][0] = num;//修改分区号
			freeTable1[j][3] = 1;//修改状态为已分配
			show();
			return true;
		}


	alert("内存空间不足，无法分配!");
	return false;
}







function firstFit()//首次适应
{
	
	var value = document.getElementById("text").value;
	if(value=='')//捕捉异常，不输入数据时点击分配按钮给出提示
	{
		alert('请输入数据!');
		return false;
	}
	var num = value.split(',')[0],request = value.split(',')[1];
	for(var i = 0; i < freeTable1.length ; i++ )
		{
			if(request <freeTable1[i][2]&& !freeTable1[i][3])
				{
					if(freeTable1[i][2] - request > size)//从i分区画出request大小的空间
					{
						freeTable1[i][2] = freeTable1[i][2]- request ;//修改分区大小
						newrow = new Array(num,freeTable1[i][1]+freeTable1[i][2],request,1);
						freeTable1.splice(i+1,0,newrow);
						show();
						return true;
					}
					else
						{
							alert(freeTable1[i][0]);
							freeTable1[i][0] = num;//修改分区号
							freeTable1[i][3] = 1;//修改状态为已分配
							show();
							return true;
						}
				}
		}
		alert("内存空间不足，无法分配!");
		return false;

}


function recycle()
{
	var num = document.getElementById("input").value;//要回收的分区号
	
	for(var i = 0;i< freeTable1.length;i++)
	{//0分区号 1起始地址 2大小 3状态

		if (freeTable1[i][0] == num )
		{
			if(!freeTable1[i-1][3] && !freeTable1[i+1][3])//前后均空闲，记录数减一
			{
				freeTable1[i-1][2] = freeTable1[i-1][2]+ freeTable1[i][2]+freeTable1[i+1][2];
				alert(freeTable1[i-1][0]);
				freeTable1.splice(i,1);
				freeTable1.splice(i+1,1);
				break;
			}
		    else if (!freeTable1[i-1][3]){//前空闲，合并
				freeTable1[i-1][2] +=  freeTable1[i][2];
				freeTable1.splice(i,1);
				alert(freeTable1[i][0]);
				break;
			}
			else if (!freeTable1[i+1][3]) {//后空闲,合并
				freeTable1[i][2] +=  freeTable1[i+1][2];
				freeTable1[i][3] = 0;
				alert(freeTable1[i][0]);
				freeTable1.splice(i+1,1); 
				break;
			}
			else{//前后均占用, 加一条记录

				alert(freeTable1[i][0]);
				freeTable1[i][3] = 0;
				break;
			}
		}
	}
}


function content()
{
	var head ="";
	head += "<table  border='1px'><tr><td>\
		分区号</td><td>分区始址</td><td>大小</td><td>状态</td></tr>";
	var body="";
	for(var i in freeTable1){
			body +="<tr>";
			for(var j = 0;j<freeTable1[i].length-1;j++){
					body +="<td>"+freeTable1[i][j];	
				}
			body +="K</td><td>"+(freeTable1[i][j]==1?"占用":"空闲")+"</td></tr>";
		}
	body +="</table>";
	return head+body;
}


function show()
{
	//alert(freeTable1[0]);
    var head ="";
    var body='';
    var height = 400;
    head+="<table id='Table' style='border:2px solid;height:"+height+'px;\'>';
    for(var i in freeTable1){
    	body+="<tr>";
	    if(!freeTable1[i][3])//表示空闲
	            body+="<td id='Table' style='height:"+freeTable1[i][2]/1024*height+"px;\'>"+freeTable1[i][2]+"K</td></tr>";
        else
            body+="<td  id='Table' class='busy' style='height:"+freeTable1[i][2]/1024*height+"px;\'>"+freeTable1[i][2]+"K</td></tr>";
    }
    var oUl = document.getElementById("ul1");
    oUl.removeChild(document.getElementsByTagName("li")[0]);
    //alert(content());
   
    var OLi = document.createElement("li");
   	OLi.innerHTML = content();
	
   	oUl.appendChild(OLi);

   	var oUl2 = document.getElementById("ul2");
    oUl2.removeChild(document.getElementsByTagName("li")[1]);
    var OLi1 = document.createElement("li");
   	OLi1.innerHTML = head+body;
   	oUl2.appendChild(OLi1);
}
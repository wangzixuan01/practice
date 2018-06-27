/**
 * Created by 10989 on 2017/10/20.
 */
var num_process; //记录进程数
var num_resource;//记录资源数
var max = new Array();//最大资源数
var need = new Array();//资源需求数
var work = new Array();//资源可用数
var work2 = new Array();//用于记录每次进程调用的Work数
var available = new Array();//可利用资源数
var allocation = new Array();//已分配资源
var request = new Array();//请求资源数
var finish = new Array();//是否已完成
var safe = new Array();//安全序列
var fg = false;    //更新Available标志
var o = 0;

//创建安全表格
function chickSafeTable(){
    var tabletext = "";
    tabletext = "<table border=1 cellspacing=1 width=80% style='text-align:center;border-collapse:collapse;border-width:thin;border-style:solid;margin:0;'><tr><td>资源</td><td colspan="+num_resource+">Work</td><td colspan="+num_resource+">Need</td colspan="+num_resource+"><td colspan="+num_resource+">Allocation</td colspan="+num_resource+"><td colspan="+num_resource+">Work+Allocation</td colspan="+num_resource+"><td>Finish</td></tr>";
    tabletext += "<tr>"+"<td>进程</td>";
    for(i=0;i<4;i++)
    {
        for(j=0;j<num_resource;j++)
        {
            tabletext += "<td>"+String.fromCharCode((65+j))+"</td>";
        }
    }
    tabletext += "</tr>";
    for(i=0;i<num_process;i++)
    {
        tabletext += "<tr><td>P"+safe[i]+"</td>";
        for(j=0;j<5;j++)
        {
            for(x=0;x<num_resource;x++)
            {
                if(j==4&&x==0)
                {
                    tabletext += "<td id=t"+i+j+x+" class='outtable'></td>";
                    break;
                }
                else
                {
                    tabletext += "<td id=t"+i+j+x+" class='outtable'></td>";
                }
            }
        }
        tabletext += "</tr>";
    }
    tabletext += "</table>";
    document.getElementById("output2").innerHTML += tabletext;
    updataOfSafeList();
}

//更新安全表格（第二个表格）
function updataOfSafeList(){
    //Work
    for(i=0;i<num_process;i++)
    {
        for(j=0;j<num_resource;j++)
        {
            document.getElementById("t"+i+"0"+j).innerHTML = work2[i][j];
        }
    }
    //Need
    for(i=0;i<num_process;i++)
    {
        for(j=0;j<num_resource;j++)
        {
            document.getElementById("t"+i+"1"+j).innerHTML = need[parseInt(safe[i])][j];
        }
    }
    //Allocation
    for(i=0;i<num_process;i++)
    {
        for(j=0;j<num_resource;j++)
        {
            document.getElementById("t"+i+"2"+j).innerHTML = allocation[parseInt(safe[i])][j];
        }
    }
    //Work+Allocation
    for(i=0;i<num_process;i++)
    {
        for(j=0;j<num_resource;j++)
        {
            document.getElementById("t"+i+"3"+j).innerHTML = work2[i][j]+allocation[safe[i]][j];
        }
    }
    //Finish
    for(i=0;i<num_process;i++)
    {
        document.getElementById("t"+i+"4"+"0").innerHTML = finish[safe[i]];
    }
}

//点击第一个按钮
function onClickOK(){
    document.getElementById("input").style.display = "none";
    num_process = parseInt(document.getElementById("t_process").value);
    num_resource = parseInt(document.getElementById("t_resource").value);
    ChickNull(num_process,"请输入进程数:");
    ChickNull(num_resource,"请输入资源数:");
    if(isNaN(num_process&&num_resource))
    {
        alert("请输入数字！");
        return;
    }
    alert(num_process+"个进程"+num_resource+"个资源");
    for(i=0;i<num_resource;i++)
    {
        available[i] = window.prompt("第"+(i+1)+"个资源总数：");
        ChickNull(available[i],"请输入资源总数:");
        if(isNaN(available[i]))
        {
            alert("请输入数字！");
            return;
        }
    }
    CreateTable();
    document.getElementById("d_display").style.display = "";
}
//动态创建表格（第一个表格）


function CreateTable(){
    var tabletext = "";
    tabletext = "</br>系统资源的总数依次是：";
    for(i=0;i<num_resource;i++)
    {
        tabletext += " " + available[i] + "    ";
    }
    tabletext += "<p><p/><hr/>";
    tabletext += "请输入各个进程的最大需求数(Max)和已分配数(Allocation)</br>";
    tabletext += "<table border=1 cellspacing=1 width=80% style='text-align:center;border-collapse:collapse;border-width:thin;border-style:solid;margin:0;'><tr><td>资源</td><td colspan="+num_resource+">Max</td><td colspan="+num_resource+">Allocation</td colspan="+num_resource+"><td colspan="+num_resource+">Need</td colspan="+num_resource+"><td colspan="+num_resource+">Available</td></tr>";
    tabletext += "<tr>"+"<td>进程</td>";
    for(i=0;i<4;i++)
    {
        for(j=0;j<num_resource;j++)
        {
            tabletext += "<td>"+String.fromCharCode((65+j))+"</td>"; //65是A
        }
    }
    tabletext += "</tr>";
    for(i=0;i<num_process;i++)
    {
        tabletext += "<tr><td>P"+i+"</td>";
        for(j=0;j<4;j++)
        {
            for(x=0;x<num_resource;x++)
            {
                tabletext += "<td class='numtd'><input type=text id=e"+i+j+x+" class= 'numtext'";
                if(j==2||j==3)
                {
                    tabletext += " readonly=\"readonly\" "
                }
                tabletext += "></td>";
            }
        }
        tabletext += "</tr>";
    }
    tabletext += "</table>";
    document.getElementById("d_table").innerHTML += tabletext;
}
//点击第二个按钮

function onClickOK2()
{
    GetInfo();
    ChickSequence();
    PrintSequence("outputlist");
}

//获得填充数据
function GetInfo()
{
    //获取最大资源数
    for(i=0;i<num_process;i++)
    {
        max[i]=new Array();
        for(j=0;j<num_resource;j++)
        {
            max[i][j]=parseInt(document.getElementById("e"+i+"0"+j).value);
            ChickNull(max[i][j],"请输入最大资源数:");
            if(isNaN(max[i][j]))
            {
                alert("请输入数字！");
                return;
            }
        }
    }

    //获取已分配资源数
    for(i=0;i<num_process;i++)
    {
        allocation[i]=new Array();
        for(j=0;j<num_resource;j++)
        {
            allocation[i][j]=parseInt(document.getElementById("e"+i+"1"+j).value);
            ChickNull(allocation[i][j],"请输入已分配资源数:");
            if(isNaN(allocation[i][j]))
            {
                alert("请输入数字！");
                return;
            }
        }
    }
}

//得到并填充Need
function GetNeed()
{
    //计算各进程对个资源的需求量
    for(i = 0; i < num_process; i ++)
    {
        need[i]=new Array();
        for(j = 0; j < num_resource; j ++)
        {
            need[i][j] = max[i][j] - allocation[i][j];
        }
    }
    //填充Need
    for(i=0;i<num_process;i++)
    {
        for(j=0;j<num_resource;j++)
        {
            document.getElementById("e"+i+"2"+j).value = need[i][j];
        }
    }
}

//得到Work
function GetWork()
{
    for(j=0;j<num_resource;j++)
    {
        work[j]=available[j];
    }
}

//得到并填充Available
function GetAvailable(fg)
{
    //计算Available
    if(!fg)
    {
        for(i=0;i<num_resource;i++)
        {
            for(j=0;j<num_process;j++)
            {
                available[i] -= allocation[j][i];
                if(available[i]<0)
                {
                    alert("请求失败！无可利用资源");
                    return false;
                }
            }
        }
    }
    else
    {
        if(available[i]<0)
        {
            alert("请求失败！无可利用资源");
            return false;
        }
        else
        {}
    }
    //填充Available
    for(i=0;i<num_resource;i++)
    {
        document.getElementById("e"+0+"3"+i).value = available[i];
    }
    return true;
}

//新请求资源
function Banker()
{
    fg = true;
    var v1 = parseInt(window.prompt("请输入第几个进程请求资源"));
    for(i=0;i<num_process;i++)
    {
        request[i] = new Array();
    }
    for(j=0;j<num_resource;j++)
    {
        request[v1-1][j] = window.prompt("进程P"+(v1-1)+"请求资源"+String.fromCharCode((65+j))+"数量：");
        ChickNull(request[v1-1][j],"请输入进程所请求资源数:");
        if(isNaN(request[v1-1][j]))
        {
            alert("请输入数字！");
            return;
        }
    }
    for(j=0;j<num_resource;j++)
    {
        if(request[v1-1][j]>need[v1-1][j])
        {
            alert("请求资源数大于所需最大值，失败！");
            return;
        }

        else if(request[v1-1][j]>available[j])
        {
            alert("请求资源数大于可利用资源量，请等待！");
            return;
        }
        else
        {
            available[j] -= request[v1-1][j];
            var v2 = parseInt(allocation[v1-1][j]);
            var v3 = parseInt(request[v1-1][j]);
            allocation[v1-1][j] = v2+v3;
            need[v1-1][j] -= request[v1-1][j];
        }
    }
    ChickSequence();
    PrintSequence("output2");
}

//获得安全序列
function ChickSequence()
{
    GetNeed();
    GetAvailable(fg);
    GetWork();
    //初始化work2
    for(i=0;i<(num_process+1);i++)
    {
        work2[i] = new Array();
    }
    for(i=0;i<num_resource;i++)
    {
        work2[0][i] = work[i];
    }
    //初始化finish
    for(i=0;i<num_process;i++)
    {
        finish[i] = false;
    }
    o = 0;
    //算法核心！！！
    while(o < num_process)
    {
        flag = false;
        for(i = 0; i < num_process; i ++)
        {
            if(finish[i])
                continue;
            for( j = 0; j < num_resource; j ++)
            {
                if(need[i][j] > work[j])
                    break;
            }
            if(j == num_resource)
            {
                flag = true;
                safe[o] = i;
                o++;
                finish[i] = true;
                for(k = 0; k < num_resource; k ++)
                {
                    work[k] += allocation[i][k];
                    work2[o][k] = work[k];
                }
            }
        }
        if(!flag)
            break;
    }
}

//输出安全序列
function PrintSequence(id)
{
    if(o == num_process)
    {
        html="<hr/>该资源是安全的;安全序列为:";
        for(i=0;i<o;i ++)
        {
            html+="P"+safe[i];
            if(i<o-1)
                html+="->";
        }
    }
    else
    {
        html="<hr/>对不起，该资源状态不安全！";
        document.getElementById(id).innerHTML = html;
        return;
    }
    document.getElementById(id).innerHTML = html;
    chickSafeTable();
}

//判断输入是否为空
function ChickNull(text,warning)
{
    if(text.length==0)
    {
        alert(warning);
        return false;
    }
    else if (/\s/.test(text))
    {
        alert("输入不能为空格!");
        return false;
    }
    return true;
}
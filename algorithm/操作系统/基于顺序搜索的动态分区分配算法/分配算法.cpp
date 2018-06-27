#include <iostream>
#include <fstream>
#include <iomanip>
#include <string>
#define SIZE 1024            // 内存初始大小
enum STATE { Free, Busy };   //定义枚举类型

using namespace std;


int taskId;
int size;
int choice;
int chooseAlgorithm = 5;


struct Node
{
	int addr;               // 起始地址
	int size;               // 分区大小
	int taskId;             // 作业号
	STATE state;            // 分区状态
	Node *prev;             // 分区前向指针
	Node *next;             // 分区后向指针
} Head;
Node *Position;


void readData();
void initial();
void show();
int firstFit();
int free(int taskId);
void selectAlgorithm(int chooseAlgorithm);
void selectFunction(int choice);
int bestFit();
int worstFit();
int NextFit();



int main()
{
	initial();

	while (chooseAlgorithm)
	{
		cout << "\n";
		cout << "请选择实现的算法：" << endl;
		cout << "*************************************************\n";
		cout << "***   1: 首次适应算法     2: 循环首次适应算法 ***\n";
		cout << "***   3: 最佳适应算法     4: 最坏适应算法     ***\n";
		cout << "***   0: 结束                                 ***\n";
		cout << "*************************************************\n";
		cout << "选择算法：";
		cin >> chooseAlgorithm;
		selectAlgorithm(chooseAlgorithm);
	}
	system("pause");
	return 0;
}



void initial()
{
	// 分配初始分区内存
	Node *fir = (Node *)malloc(sizeof(Node));
	// 给首个分区赋值
	fir->addr = 0;
	fir->size = SIZE;
	fir->state = Free;
	fir->taskId = -1;
	fir->prev = &Head;
	fir->next = NULL;
	// 初始化分区头部信息
	Head.prev = NULL;
	Head.next = fir;
	Position = Head.next;
}



// 首次适应算法
int firstFit()
{
	readData();
	Node *p = Head.next;

	while (p != NULL)
	{
		if (p->state == Free && p->size >= size)
		{
			// 找到要分配的空闲分区
			if (p->size - size == 0)
			{
				// 整块分配
				p->state = Busy;
				p->taskId = taskId;
			}
			else
			{
				// 分配大小为size的区间
				Node *node = (Node *)malloc(sizeof(Node));
				node->addr = p->addr + size;
				node->size = p->size - size;
				node->state = Free;
				node->taskId = -1;
				// 修改分区链节点指针
				node->prev = p;
				node->next = p->next;
				if (p->next != NULL)
				{
					p->next->prev = node;
				}
				p->next = node;
				// 分配空闲区间
				p->size = size;
				p->state = Busy;
				p->taskId = taskId;
			}
			cout << "内存分配成功！\n";
			show();
			selectFunction(choice);
			show();
			return 1;
		}
		p = p->next;
	}
	cout << "找不到合适的内存分区，分配失败...\n";
	return 0;
}
int NextFit()
{
	readData();
	int flag = 0;
	Node *p = Position;
	while (p != NULL)
	{
		if (p->state == Free && p->size >= size)
		{
			// 找到要分配的空闲分区
			if (p->size - size ==0)
			{
				// 整块分配
				p->state = Busy;
				p->taskId = taskId;
			}
			else
			{
				// 分配大小为size的区间
				Node *node = (Node *)malloc(sizeof(Node));
				node->addr = p->addr + size;
				node->size = p->size - size;
				node->state = Free;
				node->taskId = -1;
				// 修改分区链节点指针
				node->prev = p;
				node->next = p->next;
				if (p->next != NULL)
				{
					p->next->prev = node;
				}
				p->next = node;
				// 分配空闲区间
				p->size = size;
				p->state = Busy;
				p->taskId = taskId;

			}
			p = Position;
			cout << "内存分配成功！\n";
			show();
			selectFunction(choice);
			show();
			return 1;
		}
		p = p->next;
	}
	if (flag = 0)
	{
		p = Head.next;
		while (p != NULL)
		{
			if (p->state == Free && p->size >= size)
			{
				// 找到要分配的空闲分区
				if (p->size - size == 0)
				{
					// 整块分配
					p->state = Busy;
					p->taskId = taskId;
				}
				else
				{
					// 分配大小为size的区间
					Node *node = (Node *)malloc(sizeof(Node));
					node->addr = p->addr + size;
					node->size = p->size - size;
					node->state = Free;
					node->taskId = -1;
					// 修改分区链节点指针
					node->prev = p;
					node->next = p->next;
					if (p->next != NULL)
					{
						p->next->prev = node;
					}
					p->next = node;
					// 分配空闲区间
					p->size = size;
					p->state = Busy;
					p->taskId = taskId;

				}
				p = Position;
				cout << "内存分配成功！\n";
				show();
				selectFunction(choice);
				show();
				return 1;
			}
			p = p->next;
		}
	}
	cout << "找不到合适的内存分区，分配失败...\n";
	return 0;
}



void selectAlgorithm(int chooseAlgorithm)
{
	switch (chooseAlgorithm)
	{
	case 0:break;
	case 1:firstFit(); break;
	case 2:NextFit(); break;
	case 3:bestFit(); break;
	case 4:worstFit(); break;
	default:cout << "请输入正确的序号：" << endl;
	}
}




void readData()
{
	cout << "请输入作业号： ";
	cin >> taskId;
	cout << "请输入需要分配的内存大小(KB)： ";
	cin >> size;
	if (size <= 0)
	{
		cout << "错误：分配内存大小必须为正值\n";
	}
}




void show()
{
	cout << "\n";
	cout << "************************************************\n";
	cout << "***           当前的内存分配情况如下：       ***\n";
	cout << "************************************************\n";
	cout << "***  起始地址 | 空间大小 | 工作状态 | 作业号 ***\n";
	Node *p = Head.next;
	while (p != NULL)
	{
		cout << "***------------------------------------------***\n";
		cout << "***";
		cout << "     |" << p->addr;
		cout << "     |" << p->size;
		string sta = p->state == Free ? "Free" : "Busy";
		cout << "     |" << sta;
		if (p->taskId > 0)
		{
			cout << "           " << p->taskId;
		}
		else
		{
			cout << "           ";
		}
		cout << "     ***\n";
		p = p->next;
	}
	cout << "\n";
	cout << "*************************************************\n";
	cout << "***               1 : 继续分配                ***\n";
	cout << "***               2 : 回收内存                ***\n";
	cout << "***               3 : 选择算法                ***\n";
	cout << "                  请选择操作： ";
	cin >> choice;
	cout << "*************************************************\n";
}




void selectFunction(int choice)
{
	switch (choice)
	{
	case 1:firstFit(); break;
	case 2:free(taskId); break;
	case 3:main(); break;
	default:cout << "请输入正确的序号：" << endl;
	}
}




int free(int taskId)
{
	cout << "请输入需要回收的作业号";
	cin >> taskId;
	int flag = 0;
	Node *p = Head.next, *pp;
	while (p != NULL)
	{
		if (p->state == Busy && p->taskId == taskId)
		{
			flag = 1;
			if ((p->prev != &Head && p->prev->state == Free)
				&& (p->next != NULL && p->next->state == Free))
			{
				// 情况1：合并上下两个分区
				// 先合并上区间
				pp = p;
				p = p->prev;
				p->size += pp->size;
				p->next = pp->next;
				pp->next->prev = p;
				free(pp);
				// 后合并下区间
				pp = p->next;
				p->size += pp->size;
				p->next = pp->next;
				if (pp->next != NULL)
				{
					pp->next->prev = p;
				}
				free(pp);
			}
			else if ((p->prev == &Head || p->prev->state == Busy)
				&& (p->next != NULL && p->next->state == Free))
			{
				// 情况2：只合并下面的分区
				pp = p->next;
				p->size += pp->size;
				p->state = Free;
				p->taskId = -1;
				p->next = pp->next;
				if (pp->next != NULL)
				{
					pp->next->prev = p;
				}
				free(pp);
			}
			else if ((p->prev != &Head && p->prev->state == Free)
				&& (p->next == NULL || p->next->state == Busy))
			{
				// 情况3：只合并上面的分区
				pp = p;
				p = p->prev;
				p->size += pp->size;
				p->next = pp->next;
				if (pp->next != NULL)
				{
					pp->next->prev = p;
				}
				free(pp);
			}
			else
			{
				// 情况4：上下分区均不用合并
				p->state = Free;
				p->taskId = -1;
			}
		}
		p = p->next;
	}
	if (flag == 1)
	{
		// 回收成功
		cout << "内存分区回收成功...\n";
		show();
		selectFunction(choice);
		return 1;
	}
	else
	{
		// 找不到目标作业，回收失败
		cout << "找不到目标作业，内存分区回收失败...\n";
		return 0;
	}
}





// 最佳适应算法
int bestFit()
{
	readData();
	Node *tar = NULL;
	int tarSize = SIZE + 1;
	Node *p = Head.next;
	while (p != NULL)
	{
		// 寻找最佳空闲区间
		if (p->state == Free && p->size >= size && p->size <tarSize)
		{
			tar = p;
			tarSize = p->size;
		}
		p = p->next;
	}
	if (tar != NULL)
	{
		// 找到要分配的空闲分区
		if (tar->size - size ==0)
		{
			// 整块分配
			tar->state = Busy;
			tar->taskId = taskId;
		}
		else
		{
			// 分配大小为size的区间
			Node *node = (Node *)malloc(sizeof(Node));
			node->addr = tar->addr + size;
			node->size = tar->size - size;
			node->state = Free;
			node->taskId = -1;
			// 修改分区链节点指针
			node->prev = tar;
			node->next = tar->next;
			if (tar->next != NULL)
			{
				tar->next->prev = node;
			}
			tar->next = node;
			// 分配空闲区间
			tar->size = size;
			tar->state = Busy;
			tar->taskId = taskId;
		}
		cout << "内存分配成功！\n";
		show();
		selectFunction(choice);
		show();
		return 1;
	}
	else
	{
		// 找不到合适的空闲分区
		cout << "找不到合适的内存分区，分配失败...\n";
		return 0;
	}
}




// 最差适应算法
int worstFit()
{
	readData();
	Node *tar = NULL;
	int tarSize = 0;
	Node *p = Head.next;
	while (p != NULL)
	{
		// 寻找最佳空闲区间
		if (p->state == Free && p->size > tarSize)
		{
			tar = p;
			tarSize = p->size;
		}
		p = p->next;
	}
	if (tar != NULL)
	{
		// 找到要分配的空闲分区
		if (tar->size - size ==0)
		{
			// 整块分配
			tar->state = Busy;
			tar->taskId = taskId;
		}
		else
		{
			// 分配大小为size的区间
			Node *node = (Node *)malloc(sizeof(Node));
			node->addr = tar->addr + size;
			node->size = tar->size - size;
			node->state = Free;
			node->taskId = -1;
			// 修改分区链节点指针
			node->prev = tar;
			node->next = tar->next;
			if (tar->next != NULL)
			{
				tar->next->prev = node;
			}
			tar->next = node;
			// 分配空闲区间
			tar->size = size;
			tar->state = Busy;
			tar->taskId = taskId;
		}
		cout << "内存分配成功！\n";
		show();
		selectFunction(choice);
		show();
		return 1;
	}
	else
	{
		// 找不到合适的空闲分区
		cout << "找不到合适的内存分区，分配失败...\n";
		return 0;
	}
}


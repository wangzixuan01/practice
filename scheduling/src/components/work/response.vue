/* 响应比高者优先HRN算法 */
<template>
  <div>
    <h3>
      响应比高者优先HRN算法
    </h3>
    <p>【说明】：选择作业数，最大设置为8。为了便于展示，作业提交时间依次设置为0、1、2、3 · · ·。此外，作业的所需的运行时间随机生成。
    </p>
    <p>【过程】：对已提交的作业进行排序，响应比高者优先，其中响应比为等待时间 / 要求服务时间 + 1
    </p>
    <div>
      <el-form ref="form" :model="form">
        <el-row :gutter="5">
          <el-col :span="3">
            <el-form-item label="选择作业数">
              <el-select v-model="form.sum" placeholder="请选择作业数量">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
                <el-option label="4" value="4"></el-option>
                <el-option label="5" value="5"></el-option>
                <el-option label="6" value="6"></el-option>
                <el-option label="7" value="7"></el-option>
                <el-option label="8" value="8"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-button type="primary" @click="onSubmit" :disabled="flagRepete || flagControlCreatBtn ? 'disabled' : false">随机生成作业</el-button>
          <el-button type="primary" v-if="flagControlAction" @click="actionOperate">执行算法</el-button>
          </el-col>
        </el-row>
      </el-form>
      <p v-if="!flagControlCreate" class="tipText">请先输入相关内容后再执行作业</p>
      <transition-group name="list-complete" tag="p" v-if="flagControlCreate">
        <div class="box list-complete-item" v-for="obj in originArray" :key="obj.index" :class="obj.color ? 'blue': ''">
          <p class="text">{{obj.state}}</p>
          <p class="text">作业{{obj.index}}</p>
          <p class="text">提交时间{{obj.pushTime}}</p>
          <p class="text">所需运行时间：{{obj.time}}</p>
          <p class="text">...</p>
        </div>
      </transition-group>
      <p v-if="flagControlCreate" class="progress-show">
        <span>【过程显示】：</span>
        {{tipText}}
      </p>
      <el-table :data="recordTable" style="width: 80%" v-if="flagControlCreate" :border="true" :row-class-name="'animated fadeIn'">
        <el-table-column prop="name" label="作业名称">
        </el-table-column>
        <el-table-column prop="pushTime" label="提交时刻">
        </el-table-column>
        <el-table-column prop="startTime" label="开始运行时刻">
        </el-table-column>
        <el-table-column prop="runTime" label="服务时间">
        </el-table-column>
        <el-table-column prop="finishTime" label="完成时刻">
        </el-table-column>
        <el-table-column prop="cyclingTime" label="周转时间">
        </el-table-column>
        <el-table-column prop="_cyclingTime" label="带权周转时间">
        </el-table-column>
      </el-table>
    </div>
    <hr>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        form: {
          sum: ''
        },
        // 防止重复点击生成按钮
        flagRepete: false,
        // 控制执行时不能点击生成按钮
        flagControlCreatBtn: false,
        // 控制模拟线程的生成
        flagControlCreate: false,
        // 控制执行按钮
        flagControlAction: false,
        tipText: '',
        originArray: [],
        recordTable: [],
        // 记录运行时刻
        progressTime: 0,
        // 是否对整个数组进行全排列
        sortFlag: false
      };
    },
    methods: {
      onSubmit() {
        if (!this.form.sum) {
          this.msg({ message: '必须填完信息才可以生成作业', type: 'warning' });
          return;
        }
        this.msg({ message: '生成成功', type: 'success' });
        this.tipText = '生成作业';
        this.createProgress(this.form);
        this.flagRepete = true;
        setTimeout(() => {
          this.$message.closeAll();
          this.flagRepete = false;
        }, 1000);
      },
      // 生成模拟作业
      createProgress({ sum }) {
        this.originArray = [];
        this.recordTable = [];
        this.arrayOriginLen = sum;
        for (var i = 0; i < sum; i++) {
          var time = Math.floor(Math.random() * 10 + 1);
          this.originArray.unshift({
            index: i + 1,
            state: 'W等待',
            time: time,
            color: false,
            pushTime: i
          });
        }
        this.flagControlCreate = true;
        this.flagControlAction = true;
      },
      // 排序
      sort(startIndex, length) {
        for (var i = startIndex; i < length - 1; i++) {
          for (var j = i; j < length; j++) {
            if (this.progressTime / this.originArray[i].time > this.progressTime / this.originArray[j].time) {
              var tmp = this.originArray[j];
              this.originArray[j] = this.originArray[i];
              this.originArray[i] = tmp;
            }
          }
        }
      },
      // 获取最大值
      getMin() {
        var len = this.originArray.length;
        var subLen = this.arrayOriginLen - len; // 已经被删除的作业数目
        var takeNum = this.progressTime - subLen + 1; // 要取出来排序的作业数目
        var takeIndex = len - takeNum; // 开始拿出来排序的位置
        if (takeIndex < 0) {
          return 0;
        }
        // 排序取最大值
        this.sort(takeIndex, len);
      },
      // 该表状态
      changeState() {
        // 0时刻队头作业执行
        this.recordTable = [];
        this.originArray[this.originArray.length - 1].state = 'R运行';
        this.originArray[this.originArray.length - 1].color = true;
        this.progressTime = this.originArray[this.originArray.length - 1].time;
        this.tipText = '运行作业1';
        // 然后在下一轮出队

        var timer = setTimeout(function fn() {
          // 先判断数组是否为空
          // 对上一个作业进行出队操作
          var del = this.originArray.pop();
          if (this.recordTable.length === 0) {
            this.recordTable.push({
              name: `作业${del.index}`,
              pushTime: 0, // 提交时刻
              startTime: 0, // 开始运行时刻
              runTime: del.time, // 服务时间
              finishTime: del.time, // 完成时刻
              cyclingTime: del.time, // 周转时间
              _cyclingTime: '1.00' // 带权周转时间
            });
          } else {
            var tmp = this.recordTable[this.recordTable.length - 1];
            this.recordTable.push({
              name: `作业${del.index}`,
              pushTime: del.index - 1, // 提交时刻
              startTime: tmp.finishTime, // 开始运行时刻
              runTime: Number(del.time), // 服务时间
              finishTime: tmp.finishTime + del.time, // 完成时刻
              cyclingTime:
              tmp.finishTime + del.time - (del.index - 1), // 周转时间：完成时刻 - 提交时刻
              _cyclingTime: ((tmp.finishTime +
                  del.time -
                  (del.index - 1)) /
                del.time
              ).toFixed(2) // 带权周转时间（取两位小数）：周转时间 / 服务时间
            });
          }
          // 如果删除之后数组长度为0，那么直接结束
          if (this.originArray.length === 0) {
            let a = 0;
            let b = 0;
            for (let i = 0; i < this.recordTable.length; i++) {
              a += this.recordTable[i].cyclingTime;
              b += Number(this.recordTable[i]._cyclingTime);
            }
            a = (a / this.recordTable.length).toFixed(2);
            b = (b / this.recordTable.length).toFixed(2);
            this.tipText = `结束，这组作业的平均周转时间为${a}、带权平均周转时间为${b}。`;
            this.flagControlCreatBtn = false;
            clearTimeout(timer);
            this.sortFlag = false;
            return 0;
          }
          // 如果删除之后数组长度为1，那么直接执行状态改变，在下一轮中删除
          if (this.originArray.length === 1) {
            this.originArray[this.originArray.length - 1].state = 'R运行';
            this.originArray[this.originArray.length - 1].color = true;
            this.tipText = `运行作业${this.originArray[this.originArray.length - 1].index}`;
            this.progressTime += this.originArray[this.originArray.length - 1].time; // 更新时刻时间
            setTimeout(fn.bind(this), 1500);
            return 0;
          }
          // 接下来进行时刻的判断
          if (this.progressTime >= this.arrayOriginLen - 1) { // 如果时刻超出最后一个作业提交的时刻，直接排序，执行队头作业
            // 如果没有全排列过，需要先排列一遍，如果已经排列好了不需要再排列
            if (this.sortFlag === false) {
              this.sort(0, this.originArray.length);
              this.sortFlag = true;
            }
            // 取队头作业改变状态，更新时刻时间，在下一轮中被删除
            this.originArray[this.originArray.length - 1].state = 'R运行';
            this.originArray[this.originArray.length - 1].color = true;
            this.tipText = `运行作业${this.originArray[this.originArray.length - 1].index}`;
            this.progressTime += this.originArray[this.originArray.length - 1].time; // 更新时刻时间
            setTimeout(fn.bind(this), 1500);
          } else if (this.progressTime < this.arrayOriginLen - 1) { // 如果时刻没有超过最后一个作业提交的时刻，抽取已提
            this.getMin();                               // 交的作业，选取最大值排序
            this.originArray[this.originArray.length - 1].state = 'R运行';
            this.originArray[this.originArray.length - 1].color = true;
            this.tipText = `运行作业${this.originArray[this.originArray.length - 1].index}`;
            this.progressTime += this.originArray[this.originArray.length - 1].time; // 更新时刻时间
            setTimeout(fn.bind(this), 1500);
            // 然后在下一轮出队
          }
        }.bind(this), 1500);
      },
      // 执行整个过程
      actionOperate() {
        this.flagControlAction = false;
        this.flagControlCreatBtn = true;
        this.msg({ message: '执行成功', type: 'success' });
        // 改变状态，由于动画效果时间执行一秒，所以需要等待一秒
        this.tipText = '执行作业';
        this.changeState();
      },
      msg(m) {
        this.$message(m);
      }
    }
  };
</script>
<style lang="scss" scoped>
  h3 {
    margin-bottom: 10px;
  }
  .box {
    display: inline-block;
    width: 150px;
    height: 150px;
    padding: 5px;
    margin: 10px;
    margin-left: 0;
    border: 2px #6f6f6f dashed;
    border-radius: 3px;
    vertical-align: top;
    background-color: #fff;
    .text {
      margin: 0;
      padding: 5px 0;
    }
  }
  .tipText {
    margin: 10px 0;
  }
  .progress-show {
    margin: 10px 0;
  }
  .blue {
    border-color: #66b1ff;
    border-style: solid;
  }
  .el-table {
    margin-bottom: 10px;
    transition: all 1.5s;
  }
  /* .el-table__body-wrapper {
                      overflow: hidden;
                  } */
  .list-complete-item {
    transition: all 1.5s;
  }
  .list-complete-enter,
  .list-complete-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  .list-complete-leave-active {
    position: absolute;
  }
</style>

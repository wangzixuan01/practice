/* 比较 */
<template>
  <div>
    <h3>
      对同一个作业流执行不同的算法来进行比较
    </h3>
    <p>【说明】：选择作业数，最大设置为8。为了便于展示，作业提交时间依次设置为0、1、2、3 · · ·。此外，作业的所需的运行时间随机生成。
    </p>
    <p>【过程】：根据不同的算法得到各自的平均周转时间和带权平均周转时间，依次进行比较。
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
          <el-button type="primary" v-if="flagControlAction" @click="actionClick">执行算法</el-button>
        </el-row>
      </el-form>
      <p v-if="!flagControlCreate" class="tipText">请先输入相关内容后再执行作业</p>
      <transition-group name="list-complete" tag="p" v-if="flagControlCreate">
        <div class="box list-complete-item" v-for="obj in originArray" :key="obj.index" :class="obj.color ? 'blue': ''">
          <p class="text">{{obj.state}}</p>
          <p class="text">作业{{obj.index}}</p>
          <p class="text">提交时间：{{obj.pushiTime}}</p>
          <p class="text">所需运行时间：{{obj.time}}</p>
          <p class="text">...</p>
        </div>
      </transition-group>
      <p v-if="flagControlCreate" class="tipText">【先来先服务FCFS算法】</p>
      <p v-if="tipTextA" class="progress-show">
        <span>【计算结果】：</span>
        {{tipTextA}}
      </p>
      <p v-if="flagControlCreate" class="tipText">【最短作业优先SJF算法】</p>
      <p v-if="tipTextB" class="progress-show">
        <span>【计算结果】：</span>
        {{tipTextB}}
      </p>
      <p v-if="flagControlCreate" class="tipText">【响应比高者优先HRN算法】</p>
      <p v-if="tipTextC" class="progress-show">
        <span>【计算结果】：</span>
        {{tipTextC}}
      </p>
      <div class="progress-show" v-if="showTable">
        <p class="progress-show">【先来先服务FCFS算法】</p>
        <el-table :data="recordTableA" style="width: 80%" :border="true" :row-class-name="'animated fadeIn'">
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
        <p class="progress-show">【最短作业优先SJF算法】</p>
        <el-table :data="recordTableB" style="width: 80%" :border="true" :row-class-name="'animated fadeIn'">
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
        <p class="progress-show">【响应比高者优先HRN算法】</p>
        <el-table :data="recordTableC" style="width: 80%" :border="true" :row-class-name="'animated fadeIn'">
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
    </div>
    <hr>
  </div>
</template>
<script>
  import { queue, short, response } from '@/lib/e2Class.js';
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
        showTable: false,
        tipTextA: '',
        tipTextB: '',
        tipTextC: '',
        originArray: [],
        arrayA: [],
        arrayB: [],
        arrayC: [],
        sortFlagA: false,
        sortFlagB: false,
        recordTableA: [],
        recordTableB: [],
        recordTableC: [],
        progressTimeA: 0,
        progressTimeB: 0,
        progressTimeC: 0
      };
    },
    methods: {
      onSubmit() {
        if (!this.form.sum) {
          console.log('必须填完信息才可以生成作业');
          this.msg({ message: '必须填完信息才可以生成作业', type: 'warning' });
          return;
        }
        this.msg({ message: '生成成功', type: 'success' });
        this.createProgress(this.form);
        this.flagRepete = true;
        setTimeout(() => {
          this.$message.closeAll();
          this.flagRepete = false;
        }, 1000);
      },
      actionClick() {
        this.flagControlAction = false;
        this.showTable = true;
        this.tipTextA = queue(this.arrayA, this.recordTableA, this.tipTextA);
        this.tipTextB = short.call(this, this.arrayB, this.recordTableB, this.tipTextB, this.progressTimeB, this.sortFlagA);
        this.tipTextC = response.call(this, this.arrayC, this.recordTableC, this.tipTextC, this.progressTimeC, this.sortFlagB);
      },
      // 生成模拟作业
      createProgress({ sum }) {
        this.tipTextA = this.tipTextB = this.tipTextC = '';
        this.progressTimeA = this.progressTimeB = this.progressTimeC = 0;
        this.originArray = [];
        this.arrayA = this.arrayB = this.arrayC = [];
        for (var i = 0; i < sum; i++) {
          var time = Math.floor(Math.random() * 10);
          this.originArray.unshift({
            index: i + 1,
            state: 'W等待',
            time: time || 1,
            color: false,
            pushTime: i
          });
        }
        var str = JSON.stringify(this.originArray);
        this.arrayA = JSON.parse(str);
        this.arrayB = JSON.parse(str);
        this.arrayC = JSON.parse(str);
        this.recordTableA = [];
        this.recordTableB = [];
        this.recordTableC = [];
        this.flagControlCreate = true;
        this.flagControlAction = true;
        this.showTable = false;
      },
      sort(startIndex, length, _array, _progressTime, content) {
        for (var i = startIndex; i < length - 1; i++) {
          for (var j = i; j < length; j++) {
            if (content === 'response') {
              if (_progressTime / _array[i].time > _progressTime / _array[j].time) {
                let tmp = _array[j];
                _array[j] = _array[i];
                _array[i] = tmp;
              }
            } else {
              if (_array[i].time > _array[j].time) {
                let tmp = _array[j];
                _array[j] = _array[i];
                _array[i] = tmp;
              }
            }
          }
        }
      },
      // 获取最大值
      getMin(_array, originLen, _progressTime, content) {
        var len = _array.length;
        var subLen = originLen - len; // 已经被删除的作业数目
        var takeNum = _progressTime - subLen + 1; // 要取出来排序的作业数目
        var takeIndex = len - takeNum; // 开始拿出来排序的位置
        if (takeIndex < 0) {
          return 0;
        }
        // 排序取最大值
        this.sort(takeIndex, len, _array, _progressTime, content);
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

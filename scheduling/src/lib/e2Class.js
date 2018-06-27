/**
 * @export
 * @param {any} _array
 * @param {any} _recordTable
 * @param {any} _tipText
 */
export function queue(_array, _recordTable, _tipText) {
  _array[_array.length - 1].color = true;
  _array[_array.length - 1].state = 'R运行';
  var fn = function () {
    var len = _array.length;
    if (len !== 0) {
      if (len - 2 >= 0) {
        _array[len - 2].color = true;
        _array[len - 2].state = 'R运行';
      }
      var del = _array.pop();
      if (_recordTable.length === 0) {
        _recordTable.push({
          name: `作业${del.index}`,
          pushTime: 0, // 提交时刻
          startTime: 0, // 开始运行时刻
          runTime: del.time, // 服务时间
          finishTime: del.time, // 完成时刻
          cyclingTime: del.time, // 周转时间
          _cyclingTime: '1.00' // 带权周转时间
        });
      } else {
        var tmp = _recordTable[_recordTable.length - 1];
        _recordTable.push({
          name: `作业${del.index}`,
          pushTime: del.index - 1, // 提交时刻
          startTime: tmp.finishTime, // 开始运行时刻
          runTime: Number(del.time), // 服务时间
          finishTime: tmp.finishTime + del.time, // 完成时刻
          cyclingTime: tmp.finishTime + del.time - (del.index - 1), // 周转时间：完成时刻 - 提交时刻
          _cyclingTime: (
            (tmp.finishTime + del.time - (del.index - 1)) /
            del.time
          ).toFixed(2) // 带权周转时间（取两位小数）：周转时间 / 服务时间
        });
      }
      fn();
    } else {
      var a = 0;
      var b = 0;
      for (let i = 0; i < _recordTable.length; i++) {
        a += _recordTable[i].cyclingTime;
        b += Number(_recordTable[i]._cyclingTime);
      }
      a = (a / _recordTable.length).toFixed(2);
      b = (b / _recordTable.length).toFixed(2);
      _tipText = `结束，这组作业的平均周转时间为${a}、带权平均周转时间为${
        b
        }。`;
      return 0;
    }
  };
  fn();
  return _tipText;
}
/**
 *
 *
 * @export
 * @param {any} _array
 * @param {any} _recordTable
 * @param {any} _tipText
 * @param {any} _progressTime
 * @param {any} _sortFlag
 */
export function short(
  _array,
  _recordTable,
  _tipText,
  _progressTime,
  _sortFlag
) {
  // 0时刻队头作业执行
  var originLen = _array.length;
  _array[_array.length - 1].state = 'R运行';
  _array[_array.length - 1].color = true;
  _progressTime = _array[_array.length - 1].time;
  // 先判断数组是否为空
  // 对上一个作业进行出队操作
  var fn = function () {
    var del = _array.pop();
    if (_recordTable.length === 0) {
      _recordTable.push({
        name: `作业${del.index}`,
        pushTime: 0, // 提交时刻
        startTime: 0, // 开始运行时刻
        runTime: del.time, // 服务时间
        finishTime: del.time, // 完成时刻
        cyclingTime: del.time, // 周转时间
        _cyclingTime: '1.00' // 带权周转时间
      });
    } else {
      var tmp = _recordTable[_recordTable.length - 1];
      _recordTable.push({
        name: `作业${del.index}`,
        pushTime: del.index - 1, // 提交时刻
        startTime: tmp.finishTime, // 开始运行时刻
        runTime: Number(del.time), // 服务时间
        finishTime: tmp.finishTime + del.time, // 完成时刻
        cyclingTime: tmp.finishTime + del.time - (del.index - 1), // 周转时间：完成时刻 - 提交时刻
        _cyclingTime: (
          (tmp.finishTime + del.time - (del.index - 1)) /
          del.time
        ).toFixed(2) // 带权周转时间（取两位小数）：周转时间 / 服务时间
      });
    }
    // 如果删除之后数组长度为0，那么直接结束
    if (_array.length === 0) {
      let a = 0;
      let b = 0;
      for (let i = 0; i < _recordTable.length; i++) {
        a += _recordTable[i].cyclingTime;
        b += Number(_recordTable[i]._cyclingTime);
      }
      a = (a / _recordTable.length).toFixed(2);
      b = (b / _recordTable.length).toFixed(2);
      _tipText = `结束，这组作业的平均周转时间为${a}、带权平均周转时间为${
        b
        }。`;
      _sortFlag = false;
      return 0;
    }
    // 如果删除之后数组长度为1，那么直接执行状态改变，在下一轮中删除
    if (_array.length === 1) {
      _array[_array.length - 1].state = 'R运行';
      _array[_array.length - 1].color = true;
      _progressTime += _array[_array.length - 1].time; // 更新时刻时间
      fn.call(this);
      return 0;
    }
    // 接下来进行时刻的判断
    if (_progressTime >= originLen - 1) {
      // 如果时刻超出最后一个作业提交的时刻，直接排序，执行队头作业
      /* console.log('超过啦'); */
      // 如果没有全排列过，需要先排列一遍，如果已经排列好了不需要再排列
      if (_sortFlag === false) {
        /* console.log('快点排序'); */
        this.sort(0, _array.length, _array, _progressTime);
        _array.reverse();
        _sortFlag = true;
      }
      // 取队头作业改变状态，更新时刻时间，在下一轮中被删除
      _array[_array.length - 1].state = 'R运行';
      _array[_array.length - 1].color = true;
      _progressTime += _array[_array.length - 1].time; // 更新时刻时间
      fn.call(this);
    } else if (_progressTime < originLen - 1) {
      // 如果时刻没有超过最后一个作业提交的时刻，抽取已提
      // 交的作业，选取最大值排序
      this.getMin(_array, originLen, _progressTime);
      /* console.log('还没超过呢'); */
      _array[_array.length - 1].state = 'R运行';
      _array[_array.length - 1].color = true;
      _progressTime += _array[_array.length - 1].time; // 更新时刻时间
      fn.call(this);
    }
  }.bind(this);
  fn();
  return _tipText;
}

export function response(
  _array,
  _recordTable,
  _tipText,
  _progressTime,
  _sortFlag
) {
  // 0时刻队头作业执行
  var originLen = _array.length;
  _array[_array.length - 1].state = 'R运行';
  _array[_array.length - 1].color = true;
  _progressTime = _array[_array.length - 1].time;
  // 然后在下一轮出队

  (function fn() {
    /* console.log(_progressTime); */
    // 先判断数组是否为空
    // 对上一个作业进行出队操作
    var del = _array.pop();
    if (_recordTable.length === 0) {
      _recordTable.push({
        name: `作业${del.index}`,
        pushTime: 0, // 提交时刻
        startTime: 0, // 开始运行时刻
        runTime: del.time, // 服务时间
        finishTime: del.time, // 完成时刻
        cyclingTime: del.time, // 周转时间
        _cyclingTime: '1.00' // 带权周转时间
      });
    } else {
      var tmp = _recordTable[_recordTable.length - 1];
      _recordTable.push({
        name: `作业${del.index}`,
        pushTime: del.index - 1, // 提交时刻
        startTime: tmp.finishTime, // 开始运行时刻
        runTime: Number(del.time), // 服务时间
        finishTime: tmp.finishTime + del.time, // 完成时刻
        cyclingTime: tmp.finishTime + del.time - (del.index - 1), // 周转时间：完成时刻 - 提交时刻
        _cyclingTime: (
          (tmp.finishTime + del.time - (del.index - 1)) /
          del.time
        ).toFixed(2) // 带权周转时间（取两位小数）：周转时间 / 服务时间
      });
    }
    // 如果删除之后数组长度为0，那么直接结束
    if (_array.length === 0) {
      let a = 0;
      let b = 0;
      for (let i = 0; i < _recordTable.length; i++) {
        a += _recordTable[i].cyclingTime;
        b += Number(_recordTable[i]._cyclingTime);
      }
      a = (a / _recordTable.length).toFixed(2);
      b = (b / _recordTable.length).toFixed(2);
      _tipText = `结束，这组作业的平均周转时间为${a}、带权平均周转时间为${
        b
        }。`;
      _sortFlag = false;
      return 0;
    }
    // 如果删除之后数组长度为1，那么直接执行状态改变，在下一轮中删除
    if (_array.length === 1) {
      _array[_array.length - 1].state = 'R运行';
      _array[_array.length - 1].color = true;
      _progressTime += _array[_array.length - 1].time; // 更新时刻时间
      fn.call(this);
      return 0;
    }
    // 接下来进行时刻的判断
    if (_progressTime >= originLen - 1) {
      // 如果时刻超出最后一个作业提交的时刻，直接排序，执行队头作业
      /* console.log('超过啦'); */
      // 如果没有全排列过，需要先排列一遍，如果已经排列好了不需要再排列
      if (_sortFlag === false) {
        /* console.log('快点排序'); */
        this.sort(0, _array.length, _array, _progressTime, 'response');
        _sortFlag = true;
      }
      // 取队头作业改变状态，更新时刻时间，在下一轮中被删除
      _array[_array.length - 1].state = 'R运行';
      _array[_array.length - 1].color = true;
      _progressTime += _array[_array.length - 1].time; // 更新时刻时间
      fn.call(this);
    } else if (_progressTime < originLen - 1) {
      // 如果时刻没有超过最后一个作业提交的时刻，抽取已提交的作业，选取最大值排序
      this.getMin(_array, originLen, _progressTime, 'response');
      /* console.log('还没超过呢'); */
      _array[_array.length - 1].state = 'R运行';
      _array[_array.length - 1].color = true;
      _progressTime += _array[_array.length - 1].time; // 更新时刻时间
      fn.call(this);
      // 然后在下一轮出队
    }
  }.bind(this))();
  return _tipText;
}

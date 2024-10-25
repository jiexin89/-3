const ioHook = require('iohook');
const robot = require('robotjs');

// 存储活动窗口列表
let activeWindows = new Set();

// 中文输入法状态
let isChineseInput = false;

// 键盘事件处理
ioHook.on('keydown', (event) => {
  // 检测中文输入法切换 (通常是 Shift 键)
  if (event.keycode === 42) { // Left Shift
    isChineseInput = !isChineseInput;
    console.log(`输入法状态: ${isChineseInput ? '中文' : '英文'}`);
  }

  // 同步按键到所有活动窗口
  if (isChineseInput) {
    syncInputToWindows(event);
  }
});

// 鼠标事件处理
ioHook.on('mousedown', (event) => {
  syncMouseToWindows(event);
});

// 同步输入到所有窗口
function syncInputToWindows(event) {
  activeWindows.forEach(windowId => {
    if (windowId !== getCurrentWindowId()) {
      // 模拟按键事件
      robot.keyTap(String.fromCharCode(event.rawcode));
    }
  });
}

// 同步鼠标事件到所有窗口
function syncMouseToWindows(event) {
  activeWindows.forEach(windowId => {
    if (windowId !== getCurrentWindowId()) {
      robot.moveMouse(event.x, event.y);
      robot.mouseClick();
    }
  });
}

// 获取当前窗口ID (示例实现)
function getCurrentWindowId() {
  return process.pid; // 实际使用时需要根据具体平台实现
}

// 启动监听
ioHook.start();

console.log('输入同步已启动...');
console.log('按 Shift 键切换中英文输入法状态');
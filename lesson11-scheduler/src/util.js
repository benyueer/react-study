import Scheduler from "scheduler";

console.log(Scheduler);

// 初始化优先级对应按钮
export const initPriorityBtnList = (target) => {
  Object.keys(Scheduler)
    .filter(
      (key) => key.endsWith("Priority") && !key.includes("runWithPriority")
    )
    .forEach((name) => {
      const btn = document.createElement("button");
      const priority = name.replace("unstable_", "");
      const PRIORITY = Scheduler[name];
      target.appendChild(btn);
      btn.innerText = priority;

      const onclickCB = () => {
        Scheduler.unstable_scheduleCallback(PRIORITY, () => {
          leftLen += 3;
          insertList(target, priority);
        });
        const cb = Scheduler.unstable_getFirstCallbackNode();
        console.log(cb);
        if (leftLen) {
        }
      };

      btn.onclick = onclickCB;
    });
};

const createElement = (type, content) => {
  const ele = document.createElement(type);
  ele.innerText = content;
  return ele;
};

let curLen = 0;
let leftLen = 0;

const insertList = (target, suffix = "") => {
  while (leftLen-- && !Scheduler.unstable_shouldYield()) {
    const li = createElement("li", `${curLen++} ${suffix}`);
    doSomeBuzyWork(99999999);
    target.appendChild(li);
  }
};

const doSomeBuzyWork = (len) => {
  let result = 0;
  while (len--) {
    result += len;
  }
};

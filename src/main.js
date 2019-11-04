const $siteList = $(".siteList");
const $lastLi = $siteList.find("li.last");
const x = localStorage.getItem("x");
const xObject = JSON.parse(x);

const hashMap = xObject || [
  { logo: "A", url: "https://www.acfun.cn" },
  {
    logo: "B",
    url: "https://www.bilibili.com"
  }
];

const simplifyUrl = url => {
  return url
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .replace(/\/.*/, ""); //正则表达式，匹配到/号以及/号后边所有内容，变为空字符串
};

const render = () => {
  $siteList.find("li:not(.last)").remove();
  hashMap.forEach((node, index) => {
    console.log(index); //打印出遍历的当前元素的下标
    //用到jquery库：创建这些li元素并插入到现有页面中最后一个li标签的前边：
    const $li = $(`<li>
      <div class="site">
          <div class="logo">${node.logo}</div>
          <div class="link">${simplifyUrl(node.url)}</div>
          <div class="close">
            <svg class="icon">
              <use xlink:href="#icon-close"></use>
            </svg>
          </div>
      </div>
    </li>`).insertBefore($lastLi);
    //监听li元素的点击事件，点击时跳转到该li元素的url网址;为什么不在创建li元素时直接加一个a标签呢？问得好，因为这样的话就会导致点击icon-close也会跳转到新链接。
    $li.on("click", () => {
      window.open(node.url);
    });
    //监听li元素里的icon图标的点击事件：
    $li.on("click", ".close", e => {
      console.log("监听成功");
      e.stopPropagation(); //阻止冒泡
      console.log(hashMap); //打印出当前的hashMap
      hashMap.splice(index, 1); //splice的两个参数分别表示：从第几个开始删，删掉几个
      render(); //删除元素后重新渲染页面
    });
  });
};

render();

$(".addButton").on("click", () => {
  let url = window.prompt("请问你要添加的网址是啥？");
  if (url.indexOf("http") !== 0) {
    url = "https://" + url;
  }
  console.log(url);
  hashMap.push({
    // toUpperCase()把字母变为大写
    logo: simplifyUrl(url)[0].toUpperCase(),
    //上边的一行代码等价于下边四行代码
    // logo: url
    //   .replace("https://", "")
    //   .replace("http://", "")
    //   .replace("www.", "")[0].toUpperCase(),
    url: url
  });

  render();
});

//浏览器本地存储，每次刷新前存储上次数据
window.onbeforeunload = () => {
  const string = JSON.stringify(hashMap);
  localStorage.setItem("x", string);
};

$(document).on("keypress", e => {
  // 等价于const key = e.key;表示按下的是键盘上哪个键？把这个键赋值给key
  const { key } = e;
  console.log(key);
  // 遍历hashMap数组
  for (let i = 0; i < hashMap.length; i++) {
    // 如果hashMap数组的第一个对象的logo属性的小写字母就是key：
    if (hashMap[i].logo.toLowerCase() === key) {
      // 那么证明匹配按键成功，就打开按键对应的这个对象的url链接：
      window.open(hashMap[i].url);
    }
  }
});

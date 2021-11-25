const core = require("@actions/core");
const { Octokit } = require("octokit"); // https://github.com/octokit/octokit.js
const dayjs = require("dayjs");
const mock = [
  '别玩游戏了，别人都超过你了！',
  '❤️ 让大家在正确的路上携手越走越远吧！',
  '瞄准排行榜的第一名！http://123.56.222.177/',
  '今天你打卡了吗！',
  '你已经多少次当天没打卡啦！赶紧加油呀，🏃‍♀️赶上大部队！',
  '冲啊！！！！！！！！！！！！！！！！！',
  '没有对比就没有伤害。。来，面对现实吧：http://123.56.222.177/',
  '擦干眼泪，继续加油！！！冲冲冲~~~',
  '今天和大佬交流了下刷题，想问问大佬有没有诀窍，他就回了一句话：“就刷呀，刷呀。量变引起质变。”加油吧，xdm！',
  '加油吧，xdm！',
  '不掉队！',
  '今天没有头哥的鸡汤~',
  ':exclamation: 昨天请假的，记得补上昨天的题！不要遗留，遗留容易放弃！！！！',
  `非宁静无以致远 💪💪💪
  我们已经一起坚持这么多天啦 ✊
  继续加油，顶峰相见。🌝`,
  '继续加油，顶峰相见。🌝',
  '今日打卡继续，大家加油！跑起来，顶峰相见！',
  '好的开始，大家一起跑起来，让我们顶峰相见。'
]
const len = mock.length

try {
  const token = core.getInput("token");
  const octokit = new Octokit({
    auth: token,
  });

  // https://github.com/octokit/octokit.js#rest-api
  octokit.rest.issues.create({
    owner: "xingorg1",
    repo: "leetcode-daily-practice-action",
    title: `【每日打卡】${getDate()}`,
    body: getBody(),
  }).then((res) => {
    console.log("issue创建成功啦！！", JSON.stringify(res));
  }).catch((err) => {
    console.log('issue创建失败', err);
  })

  function getBody() {
    return `${mock[Math.floor(Math.random() * len)]}
## 评论格式 - 示例：
\`\`\`txt
小石头：https://leetcode-cn.com/u/xingorg1/
练习内容：队列实现
累计总数：100
今日增加：1
\`\`\`
`;
  }

  function getDate() {
    // 运行环境是 UTC 时区
    // 需要转换成 中国时区
    // 中国时区 = UTC时区 + 8小时
    return dayjs().add("8", "hour").format("YYYY-MM-DD");
  }

} catch (err) {
  console.log('end-error', err);
}

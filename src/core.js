// https://github.com/octokit/octokit.js
const core = require("@actions/core");
const getBody = require('./body')
const { getDate, getDayDiff } = require('./date')
// console.log(getBody);return false

const {
  Octokit
} = require("octokit");

module.exports = async function createIssueAction({ owner, repo }) {
  try {
    const token = core.getInput("token");
    const octokit = new Octokit({
      auth: token,
    });

    // 迭代所有issue https://github.com/octokit/octokit.js#pagination
    const iteratorData = octokit.paginate.iterator(octokit.rest.issues.listForRepo, {
      owner,
      repo,
      per_page: 1,
    });

    // iterate through each response
    for await (const { data: issuesData } of iteratorData) {
      for (const issueItem of issuesData) {
        console.log("IssueItem #%d: %s", issueItem.number, issueItem.title, issueItem.labels);
        // console.log("【每条issue详细信息】", JSON.stringify(issueItem));
        let labelsData = issueItem.labels.map((label) => {
          return label.name
        })
        console.log(labelsData);
      }
    }

    // 获取最近的几条issue https://github.com/octokit/octokit.js#graphql-api-queries
    octokit.graphql(
      `
        query lastIssues($owner: String!, $repo: String!, $num: Int = 1) {
          repository(owner: $owner, name: $repo) {
            issues(last: $num) {
              edges {
                node {
                  title,
                  labels,
                  number,
                  milestone {
                    title
                  },
                  comments
                }
              }
            }
          }
        }
      `,
      {
        owner,
        repo,
      }
    ).then((res) => {
      console.log("lastIssues！！", JSON.stringify(res));
    }).catch((err) => {
      console.log('lastIssues获取失败', err);
    })
    // 获取所有labels https://github.com/xingorg1/leetcode-daily-practice-action/labels
    console.log(octokit.rest.issues);

    /* // 创建issue https://github.com/octokit/octokit.js#rest-api
    octokit.rest.issues.create({
      owner,
      repo,
      title: `【每日打卡】${getDate()} 第${getDayDiff()}天`,
      body: getBody(),
    }).then((res) => {
      console.log("issue创建成功啦！！", JSON.stringify(res));
    }).catch((err) => {
      console.log('issue创建失败', err);
    }) */
  } catch (err) {
    console.log('end-error', err);
  }
}
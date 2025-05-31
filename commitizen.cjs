const { execSync } = require("child_process");

function getGitBranch() {
  const res = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" });
  return res.trim();
}

module.exports = {
  types: [
    {
      value: "feat",
      name: "feat: Adding new functionality",
    },
    {
      value: "refactor",
      name: "refactor: Code changes without fixing bugs or adding new features",
    },
    {
      value: "fix",
      name: "fix: Bug fixes",
    },
    {
      value: "build",
      name: "build: Project build or external dependency changes",
    },
    {
      value: "docs",
      name: "docs: Documentation updates",
    },
    {
      value: "docs",
      name: "docs: Project documentation or individual parts of project documentation changes",
    },
    {
      value: "test",
      name: "test: Adding tests",
    },
  ],
  scopes: [
    {
      name: getGitBranch(),
    },
  ],

  allowCustomScopes: true,

  allowBreakingChanges: false,

  subjectLimit: 172,
};

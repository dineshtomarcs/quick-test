export enum appRoutes {
  SIGNIN_PAGE = "/signin",
  SIGNUP_PAGE = "/signup",
  FORGOT_PASSWORD = "/forgot-password",
  PROJECTS = "/projects",
  DASHBOARD = "/dashboard",
  VERIFY = "/verify",
  CREATE_PROJECT = "/create-project",
  PROFILE_CHANGE_PASSWORD = "/profile/change-password",
  PROFILE_UPDATE = "/profile/update-profile",
  SETTINGS = "/settings",
  USERS = "/users",
  SUCCESS = "/success",
  CANCEL = "/cancel",
  NOT_SUBSCRIBED = "/not-subscribe",
  ARCHIVED = "/archived",
}

export enum projectRoutes {
  OVERVIEW = "overview",
  TESTCASES = "testcases",
  TODO = "todo",
  MILESTONES = "milestones",
  TESTRUNS = "testruns",
  CREATE_TESTCASE = "create-testcase",
  CREATE_TESTRUN = "create-testrun",
  CREATE_MILESTONE = "create-milestone",
  EDIT_MULTIPLE_TESTCASES = "edit-multiple-testcases",
  EDIT_PROJECT = "edit-project",
  PROJECT_MEMBERS= "members"
}

export enum milestoneRoutes {
  EDIT_MILESTONE = "edit-milestone",
  MILESTONE = "milestone",
}

export enum testCaseRoutes {
  EDIT_TESTCASE = "edit-testcase",
  TESTCASE = "testcase",
}

export enum testRunRoutes {
  EDIT_TESTRUN = "edit-testrun",
  TEST_RESULTS = "test-results",
}

export enum settingsRoutes {
  USERS = "users",
  INTEGRATIONS = "integrations",
  PAYMENTS = "payments",
  BILLING = "billing",
}

export enum usersRoutes {
  ADD = "add",
  ADD_MULTIPLE = "add-multiple",
  EDIT = "edit",
}

export enum archivedRoutes {
  PROJECTS = "projects",
  USERS = "users",
}



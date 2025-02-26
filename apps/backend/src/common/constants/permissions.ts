export enum Permission {
  /* ===================================
    =              Defect                 =
    =================================== */

  ADD_DEFECT_REF = "add:defect-ref",
  UPDATE_DEFECT_REF = "update:defect-ref",
  GET_DEFECT_DETAILS = "get:defect-details",

  /* ===================================
    =              Milestone             =
    =================================== */

  UPDATE_MILESTONE = "update:milestone",
  UPDATE_MILESTONE_STATUS = "update:milestone-status",
  DELETE_MILESTONE = "delete:milestone",
  GET_MILESTONE_DETAILS = "get:milestone-details",

  /* ===================================
    =              Organization          =
    =================================== */

  UPDATE_SUBSCRIPTION_STATUS = "update:subscription-status",
  GET_ORG = "get:org",
  ADD_MEMBER = "add:member",
  GET_MEMBERS = "get:members",
  GET_ORG_MEMBERS = "get:org-members",
  UPDATE_MEMBER = "update:member",
  RESET_PASSWORD_LINK = "reset-password-link",
  ADD_MEMBERS = "add:members",
  GET_PROJECTS_ORG = "get:projects-org",
  GET_MOST_ACTIVE_PROJECTS = "get:most-active-projects",
  GET_SEARCH_RESULTS = "get:search-results",

  /* ===================================
    =              Payment                =
    =================================== */

  CREATE_CHECKOUT_SESSION = "create:checkout-session",
  CREATE_PORTAL_SESSION = "create:portal-session",
  GET_PRODUCT = "get:product",

  /* ===================================
    =              Plugin                 =
    =================================== */

  ADD_PLUGIN = "add:plugin",
  GET_PLUGIN = "get:plugin",
  UPDATE_PLUGIN = "update:plugin",
  LIST_PROJECT_IN_PLUGIN = "list:project-in-plugin",
  LIST_ISSUES_PLUGIN = "list:issues-plugin",
  GET_ISSUE_TYPE_PLUGIN = "get:issues-type-plugin",
  GET_USERS_IN_PLUGIN_PROJECT = "get:users-in-plugin-project",
  GET_SPRINTS_IN_PLUGIN_PROJECT = "get:sprints-in-plugin-project",

  /* ===================================
    =           Project-Activity          =
    =================================== */

  GET_ACTIVITY_TESTSUITES = "get:activity-testsuites",
  GET_ACTIVITY_MILESTONES = "get:activity-milestones",
  GET_PROJECT_ACTIVITIES = "get:project-activities",
  GET_TESTCASE_RESULT_ACTIVITIES = "get:testcase-result-activities",
  GET_TESTCASE_CHANGES_ACTIVITIES = "get:testcase-changes-activities",

  /* ===================================
    =           Project-Milestone         =
    =================================== */

  CREATE_MILESTONE = "create:milestone",
  GET_OPEN_MILESTONES = "get:open-milestones",
  GET_ALL_MILESTONES = "get:all-milestones",

  /* ===================================
    =           Project-Section          =
    =================================== */

  CREATE_SECTION = "create:section",
  UPDATE_SECTION = "update:section",
  GET_ALL_SECTION = "get:all-section",
  DELETE_SECTION = "delete:section",
  REORDER_TESTCASES_SECTION = "reorder:section",

  /* ===================================
    =           Project-Testcase          =
    =================================== */

  CREATE_PROJECT_TESTCASE = "create:project-testcase",
  ADD_TESTCASE_PDF = "add:testcase-pdf",
  GET_PROJECT_TESTCASE = "get:project-testcase",
  EDIT_TESTCASE = "edit:testcase",
  EDIT_MULTIPLE_TESTCASES = "edit:multiple-testcases",
  LISTING_PROJECT_TESTCASES = "listing:project-testcases",
  GET_TESTCASE_DETAILS = "get:testcase-details",
  DELETE_TESTCASE = "delete:testcase",
  DELETE_TESTCASES = "delete:testcases",
  EDIT_TESTCASE_RESULT = "edit:testcase-result",

  /* ===================================
    =           Project-Testsuite         =
    =================================== */

  ADD_TESTSUITE_PDF = "add:testsuite-pdf",
  ADD_TESTSUITE_RESULT_PDF = "add:testsuite-result-pdf",
  CREATE_PROJECT_TESTSUITES = "create:project-testsuites",
  CREATE_FILTERED_TESTSUITES = "create:filtered-testsuites",
  EDIT_TESTSUITES = "edit:testsuites",
  GET_TESTSUITE = "get:testsuite",
  GET_TESTSUITES = "get:testsuites",
  DELETE_TESTSUITES = "delete:testsuites",

  /* ===================================
    =                Project            =
    =================================== */

  CREATE_PROJECT = "create:project",
  EDIT_PROJECT = "edit:project",
  ARCHIVE_PROJECT = "archive:project",
  RESTORE_PROJECT = "restore:project",
  LIST_ARCHIVE_PROJECT = "list:archive-project",
  GET_PROJECT_DETAILS = "get:project-details",
  DELETE_PROJECT = "delete:project",
  GET_PROJECT_LISTING = "get:project-listing",
  UPLOAD_IMAGE_PROJECT = "upload:image-project",
  GET_PROJECT_TODO = "get:project-todo",
  GET_TESTCASE_ACTIVITY_USER = "get:testcase-activity-user",
  GET_FAVORITE_PROJECTS = "get:favorite-projects",
  ADD_FAVORITE_PROJECT = "add:favorite-project",
  DELETE_FAVORITE_PROJECT = "delete:favorite-project",

  /* ===================================
    =                User                 =
    =================================== */

  ARCHIVE_USER = "archive:user",
  REACTIVATE_USER = "reactivate:user",
  DELETE_USER = "delete:user",
  GET_ARCHIVED_USERS = "get:archived-user",
  GET_USERS = "get:user",
  GET_USER = "get:user",
  GET_DASHBOARD_INFO = "get:dashboard-info",
  CHANGE_PASSWORD = "change:password",
  UPDATE_USER = "update:user",
  UPDATE_USER_STATUS = "update:user-status",
  UPLOAD_USER_PROFILE_PICTURE = "upload:user-profile-picture",

  /* ===================================
    =                Contact-form                 =
    =================================== */

  ADD_CONTACT_FORM = "add:contact-form",

  /* ===================================
    =                Project Members                 =
    =================================== */

  GET_PROJECT_MEMBER = "get:project-member",
  ADD_PROJECT_MEMBER = "add:project-member",
  DELETE_PROJECT_MEMBER = "delete:project-member",
}

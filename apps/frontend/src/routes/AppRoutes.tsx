import Loader from "../components/Loader/Loader";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./RouteSettings";
import {
  ArchivePermissions,
  MilestonePermissions,
  ProjectPermissions,
  UserManagementPermissions,
} from "../components/Utils/constants/roles-permission";
// import StripeCheckout from "../components/Payment/StripeCheckout";

const Project = lazy(() => import("../components/Project/Projects"));
const Success = lazy(() => import("../components/Payment/Success"));
const Cancel = lazy(() => import("../components/Payment/Cancel"));
const CancelPage = lazy(
  () => import("../components/Payment/components/CancelPage")
);
const ManageSuccess = lazy(() => import("../components/Payment/ManageSuccess"));

const ResetPassword = lazy(() => import("../pages/reset-password"));
const SignIn = lazy(() => import("../pages/signin"));
const SignUp = lazy(() => import("../pages/signup"));
const ForgotPassword = lazy(() => import("../pages/forgot-password"));
const VerifyAccount = lazy(() => import("../pages/verify"));
const Dashboard = lazy(() => import("../pages/dashboard"));

const CreateProject = lazy(() => import("../pages/create-project"));
const ProjectDetails = lazy(() => import("../pages/projects/[pid]/[subURL]"));
const EditProject = lazy(() => import("../pages/edit-project/[pid]"));
//          Milestones
const ViewMilestone = lazy(
  () => import("../pages/projects/[pid]/milestones/ViewMilestone")
);
const CreateMilestone = lazy(
  () => import("../pages/projects/[pid]/milestones/add-milestone")
);
const UpdateMilestone = lazy(
  () => import("../pages/projects/[pid]/milestones/UpdateMilestone")
);

//        Test Case
const CreateTest = lazy(
  () =>
    import("../pages/projects/[pid]/testcases/edit-testcase/[id]/CreateTest")
);
const EditTest = lazy(
  () =>
    import("../pages/projects/[pid]/testcases/edit-testcase/[id]/EditTestCase")
);
const ViewTest = lazy(
  () =>
    import("../pages/projects/[pid]/testcases/edit-testcase/[id]/ViewTestCase")
);
const EditMultipleTest = lazy(
  () =>
    import(
      "../pages/projects/[pid]/testcases/edit-testcase/[id]/EditMultipleTest"
    )
);

//         Test Runs
const ViewTestResult = lazy(
  () => import("../pages/projects/[pid]/testruns/ViewTestRun")
);
const CreateTestRun = lazy(
  () => import("../pages/projects/[pid]/testruns/create-testrun")
);
const EditTestRun = lazy(
  () => import("../pages/projects/[pid]/testruns/EditTestRun")
);

//          Profile
const ShowProfile = lazy(() => import("../pages/profile/[subURL]"));
//          Users
const Users = lazy(() => import("../pages/settings/[subUrl]"));
const UserAdd = lazy(() => import("../pages/users/add"));
const UserAddMultiple = lazy(() => import("../pages/users/add-multiple"));
const UserEdit = lazy(() => import("../pages/users/edit/[id]"));

// Archived
const Archived = lazy(() => import("../pages/archived/[subURL]"));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="pb-20 pt-40 flex justify-center items-center h-screen">
          <Loader />
        </div>
      }
    >
      <Routes>
        {/* Unauthenticated routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Navigate replace to="signin" />
            </PublicRoute>
          }
        />
        <Route
          path="signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="verify"
          element={
            <PublicRoute>
              <VerifyAccount />
            </PublicRoute>
          }
        />
        <Route
          path="reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="*"
          element={
            <PublicRoute>
              <Navigate replace to="signin" />
            </PublicRoute>
          }
        />

        {/* Authenticated routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navigate replace to="/dashboard" />
            </PrivateRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Project />
            </PrivateRoute>
          }
        />
        <Route
          path="archived/:subURL"
          element={
            <PrivateRoute
              permission={
                ArchivePermissions.GET_ARCHIVED_USER &&
                ArchivePermissions.LIST_ARCHIVE_PROJECT
              }
            >
              <Archived />
            </PrivateRoute>
          }
        />
        <Route
          path="profile/:subURL"
          element={
            <PrivateRoute>
              <ShowProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="settings/:subURL"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="settings/users/add"
          element={
            <PrivateRoute permission={UserManagementPermissions.ADD_MEMBERS}>
              <UserAdd />
            </PrivateRoute>
          }
        />
        <Route
          path="settings/users/add-multiple"
          element={
            <PrivateRoute permission={UserManagementPermissions.ADD_MEMBERS}>
              <UserAddMultiple />
            </PrivateRoute>
          }
        />
        <Route
          path="settings/users/:id/edit"
          element={
            <PrivateRoute permission={UserManagementPermissions.UPDATE_MEMBER}>
              <UserEdit />
            </PrivateRoute>
          }
        />

        <Route
          path="/not-subscribe"
          element={
            <PrivateRoute>
              <CancelPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/success"
          element={
            <PrivateRoute>
              <Success />
            </PrivateRoute>
          }
        />

        <Route
          path="/manage-success"
          element={
            <PrivateRoute>
              <ManageSuccess />
            </PrivateRoute>
          }
        />

        <Route
          path="/cancel"
          element={
            <PrivateRoute>
              <Cancel />
            </PrivateRoute>
          }
        />

        <Route
          path="create-project"
          element={
            <PrivateRoute permission={ProjectPermissions.CREATE_PROJECT}>
              <CreateProject />
            </PrivateRoute>
          }
        />
        <Route
          path="projects/:pid/edit-project"
          element={
            <PrivateRoute>
              <EditProject />
            </PrivateRoute>
          }
        />
        <Route
          path="projects/:pid/:subURL"
          element={
            <PrivateRoute>
              <ProjectDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="projects/:pid/create-milestone"
          element={
            <PrivateRoute permission={MilestonePermissions.CREATE_MILESTONE}>
              <CreateMilestone />
            </PrivateRoute>
          }
        />
        <Route
          path="projects/:pid/milestones/:id/edit-milestone"
          element={
            <PrivateRoute permission={MilestonePermissions.UPDATE_MILESTONE}>
              <UpdateMilestone />
            </PrivateRoute>
          }
        />
        <Route
          path="projects/:pid/milestones/:id/milestone"
          element={
            <PrivateRoute>
              <ViewMilestone />
            </PrivateRoute>
          }
        />

        <Route
          path="projects/:pid/create-testcase"
          element={
            <PrivateRoute>
              <CreateTest />
            </PrivateRoute>
          }
        />
        <Route
          path="projects/:pid/testcases/:id/edit-testcase"
          element={
            <PrivateRoute>
              <EditTest />
            </PrivateRoute>
          }
        />
        <Route
          path="projects/:pid/testcases/:id/testcase"
          element={
            <PrivateRoute>
              <ViewTest />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:pid/edit-multiple-testcases"
          element={
            <PrivateRoute>
              <EditMultipleTest />
            </PrivateRoute>
          }
        />

        <Route
          path="projects/:pid/testruns/:id/:subURL"
          element={
            <PrivateRoute>
              <ViewTestResult />
            </PrivateRoute>
          }
        />
        <Route
          path="projects/:pid/create-testrun"
          element={
            <PrivateRoute>
              <CreateTestRun />
            </PrivateRoute>
          }
        />
        <Route
          path="projects/:pid/testruns/:id/edit-testrun"
          element={
            <PrivateRoute>
              <EditTestRun />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="projects/:pid/members"
          element={
            <PrivateRoute>
              <ProjectMembers />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="*"
          element={
            <PrivateRoute>
              <Navigate replace to="dashboard" />
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

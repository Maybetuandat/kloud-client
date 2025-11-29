import { FC } from "react";
import { Route, Routes } from "react-router-dom";

import { Home } from "lucide-react";
import CourseDetailPage from "./src/app/course/course-detail/Page";
import CoursesListPage from "./src/app/course/course-list-page/course-page";
import Lab from "./src/app/lab/Lab";
import StaticLabResultPage from "./src/app/lab/Page";
import StartLab from "./src/app/lab/StartLab";
import NoMatch from "./src/app/page-not-found/not-found-page";
import { Layout } from "./src/components/ui/layout/Layout";

const App: FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<CoursesListPage />} />
          <Route path="courses/:courseId" element={<CourseDetailPage />} />

          <Route path="*" element={<NoMatch />} />
        </Route>

        <Route
          path="courses/:courseId/labs/:labId/start"
          element={<StartLab />}
        />
        <Route path="/labs/:labId/:sessionId" element={<Lab />} />
        <Route path="/result" element={<StaticLabResultPage />} />
      </Routes>
    </>
  );
};

export default App;

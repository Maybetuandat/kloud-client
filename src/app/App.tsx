import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/app/Layout";
import {
  Home,
  NoMatch,
  CoursesListPage,
  CourseDetailPage,
  StaticLabResultPage,
} from "@/pages";
import { Lab, StartLab } from "@/pages/Lab";

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

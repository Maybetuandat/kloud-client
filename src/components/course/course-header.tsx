import React from "react";

interface CoursesHeaderProps {
  title?: string;
  subtitle?: string;
}

export const CoursesHeader: React.FC<CoursesHeaderProps> = ({
  title = "Khám phá các khóa học",
  subtitle = "Tìm kiếm và học tập những khóa học chất lượng cao",
}) => {
  return (
    <div className="to-background bg-gradient-to-b from-primary/5 p-5">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg leading-relaxed text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

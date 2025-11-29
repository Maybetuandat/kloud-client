import type { Course } from "@/types/course";
import React from "react";
import { Link } from "react-router-dom";

const Button: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <button className={`rounded px-4 py-2 ${className}`}>{children}</button>;

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span className={`rounded p-1 px-2 text-xs ${className}`}>{children}</span>
);

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="bg-card group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-lg"
    >
      <div className="relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="h-48 w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.viblo.asia/e60190b9-574c-4144-9eb0-8d3a54d3cd6a.png";
          }}
        />
        <Badge className="absolute right-3 top-3 bg-blue-500 text-white">
          {course.category}
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="text-foreground mb-2 text-xl font-bold">
          {course.title}
        </h3>
        <p className="text-black-500 mb-4 line-clamp-2 text-sm">
          {course.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold text-blue-600">
              {course.price}
            </span>
            <span className="text-xs text-gray-400">{course.level}</span>
          </div>
          <Button className="bg-blue-500 text-white group-hover:bg-blue-600">
            Xem chi tiết
          </Button>
        </div>
      </div>
    </Link>
  );
};

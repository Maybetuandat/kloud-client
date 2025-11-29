import { FC } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react"; 

const Home: FC = () => {
  return (
    <>
      <section>
        <div className="hero min-h-[calc(100vh-64px)] bg-base-200">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <img
              src="https://images.viblo.asia/e60190b9-574c-4144-9eb0-8d3a54d3cd6a.png"
              className="max-w-sm lg:max-w-md"
              alt="DevOps Automation Pipeline"
            />
            
            <div className="max-w-xl">
              <h1 className="text-5xl font-bold text-primary">
                Master the DevOps & Cloud-Native Workflow
              </h1>

              <p className="py-6 leading-relaxed">
                Go beyond theory. Dive into our interactive, hands-on labs designed for real-world scenarios.
                Learn to build, deploy, and manage scalable applications with confidence using cutting-edge technologies like
                <strong className="text-secondary-focus"> Docker, Kubernetes, Terraform, and CI/CD pipelines.</strong>
              </p>
              
              <Link to="/courses" className="btn btn-primary btn-lg">
                Explore Courses
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
import { ReactNode } from "react";
import Breadcrumb from "./Breadcrumb";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  backgroundImage?: string;
}

const PageLayout = ({
  children,
  title,
  description,
  backgroundImage,
}: PageLayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      <div
        className="relative mb-8 text-center bg-cover bg-no-repeat py-20 px-4 opacity-90"
        style={
          backgroundImage
            ? { backgroundImage: `url('${backgroundImage}')` }
            : { background: "#1b90d3" }
        }
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            {title}
          </h1>
          {description && (
            <p className="text-base md:text-lg text-gray-200 animate-fade-in delay-100">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="animate-fade-in delay-200">{children}</div>
    </div>
  );
};

export default PageLayout;

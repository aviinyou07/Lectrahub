
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CardItem {
  id: string;
  title: string;
  description: string;
  link: string;
  image?: string;
  icon:string;
  badge?: string;
  stats?: { label: string; value: string }[];
}


interface CardGridProps {
  items: CardItem[];
  columns?: number;
}

const CardGrid = ({ items, columns = 3 }: CardGridProps) => {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6`}>
      {items.map((item, index) => (
        <Link
          key={item.id}
          to={item.link}
          className="group block transform transition-all duration-300 hover:scale-105"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 rounded bg-white border"
                    />
                  ) : (
                    item.icon
                  )}

                  <div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </CardTitle>
                  </div>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-gray-600 leading-relaxed">
                {item.description}
              </CardDescription>
            </CardHeader>
            {item.stats && (
              <CardContent className="pt-0">
                <div className="flex justify-between text-sm text-gray-500">
                  {item.stats.map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="font-semibold text-gray-900">{stat.value}</div>
                      <div>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CardGrid;

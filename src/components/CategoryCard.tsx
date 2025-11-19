import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryInfo } from '@/types/product';
import { 
  Laptop, 
  Smartphone, 
  Tablet, 
  Tv, 
  Headphones, 
  Package,
  LucideIcon 
} from 'lucide-react';

interface CategoryCardProps {
  category: CategoryInfo;
}

const iconMap: Record<string, LucideIcon> = {
  Laptop,
  Smartphone,
  Tablet,
  Tv,
  Headphones,
  Package,
};

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const Icon = iconMap[category.icon] || Package;

  return (
    <Link to={`/categories?category=${category.id}`}>
      <Card className="group hover-lift cursor-pointer overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
              <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

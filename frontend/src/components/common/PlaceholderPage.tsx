import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface PlaceholderPageProps {
  section: string;
  tab: string;
}

const PlaceholderPage = ({ section, tab }: PlaceholderPageProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold capitalize">{section}</h1>
        <p className="text-muted-foreground">{tab} - Diese Seite ist in Entwicklung</p>
      </div>
      {/* Mock Content */}
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlaceholderPage;

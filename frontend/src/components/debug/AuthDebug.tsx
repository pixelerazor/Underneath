/**
 * Debug component to show authentication status
 * Only for development - remove in production
 */

import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AuthDebug() {
  const { user, isAuthenticated, accessToken } = useAuthStore();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="mb-4 border-orange-500">
      <CardHeader>
        <CardTitle className="text-orange-600">🔧 Auth Debug (Development Only)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
        <div><strong>User ID:</strong> {user?.id || 'None'}</div>
        <div><strong>Email:</strong> {user?.email || 'None'}</div>
        <div><strong>Role:</strong> {user?.role || 'None'}</div>
        <div><strong>Profile Completed:</strong> {user?.profileCompleted ? '✅ Yes' : '❌ No'}</div>
        <div><strong>Token Present:</strong> {accessToken ? '✅ Yes' : '❌ No'}</div>
        <div><strong>Token Preview:</strong> {accessToken ? `${accessToken.substring(0, 20)}...` : 'None'}</div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            console.log('Auth State:', { user, isAuthenticated, tokenLength: accessToken?.length });
          }}
        >
          Log Full State
        </Button>
      </CardContent>
    </Card>
  );
}
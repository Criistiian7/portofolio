import { useAuth } from "@/hooks/useAuth";
import { useActivityQuery } from "@/hooks/queries/useActivityQuery";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { LiveActivityFeed } from "@/components/system/LiveActivityFeed";
import { PRODUCT_NAME } from "@/brand/constants";

export default function NotificationsPage() {
  const { user } = useAuth();
  const activity = useActivityQuery(user?.uid);

  return (
    <div className="space-y-6">
      <DocumentTitle title={`Notifications — ${PRODUCT_NAME}`} />
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Inbox-style feed blending synthetic events with your workspace activity log.
        </p>
      </div>
      <LiveActivityFeed items={activity.data} max={12} />
    </div>
  );
}

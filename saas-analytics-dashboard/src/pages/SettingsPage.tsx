import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfileQuery, useUpdateProfileMutation } from "@/hooks/queries/useProfileQuery";
import { useThemeStore, type Theme } from "@/store/themeStore";
import { useUiStore } from "@/store/uiStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const profileSchema = z.object({ displayName: z.string().min(2) });

export default function SettingsPage() {
  const { user } = useAuth();
  const profile = useProfileQuery(user?.uid, user?.email ?? undefined);
  const update = useUpdateProfileMutation(user?.uid);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const tableDensity = useUiStore((s) => s.tableDensity);
  const setTableDensity = useUiStore((s) => s.setTableDensity);

  const form = useForm<{ displayName: string }>({
    resolver: zodResolver(profileSchema),
    values: { displayName: profile.data?.displayName ?? "" },
  });

  const prefs = profile.data?.preferences;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Profile and workspace preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Updates write to `users/{uid}`.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async (v) => {
              await update.mutateAsync({ displayName: v.displayName });
              toast.success("Profile saved");
            })}
          >
            <div className="grid gap-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input id="displayName" {...form.register("displayName")} />
              {form.formState.errors.displayName && (
                <p className="text-sm text-destructive">{form.formState.errors.displayName.message}</p>
              )}
            </div>
            <Button type="submit" disabled={update.isPending}>
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Stored on the user profile document.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Weekly digest</p>
              <p className="text-xs text-muted-foreground">Summary of product and billing changes.</p>
            </div>
            <Switch
              checked={Boolean(prefs?.emailDigest)}
              onCheckedChange={(checked) => {
                const base = prefs ?? {
                  emailDigest: true,
                  marketing: false,
                  tableDensity: "comfortable" as const,
                };
                void update.mutateAsync({ preferences: { ...base, emailDigest: checked } });
              }}
              disabled={!profile.data}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Product updates</p>
              <p className="text-xs text-muted-foreground">Occasional tips and roadmap notes.</p>
            </div>
            <Switch
              checked={Boolean(prefs?.marketing)}
              onCheckedChange={(checked) => {
                const base = prefs ?? {
                  emailDigest: true,
                  marketing: false,
                  tableDensity: "comfortable" as const,
                };
                void update.mutateAsync({ preferences: { ...base, marketing: checked } });
              }}
              disabled={!profile.data}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Theme is persisted locally and mirrored to Tailwind `dark`.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label>Theme</Label>
          <Select value={theme} onValueChange={(v) => setTheme(v as Theme)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data tables</CardTitle>
          <CardDescription>Density preference for TanStack Table layouts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label>Density</Label>
          <Select value={tableDensity} onValueChange={(v) => setTableDensity(v as "comfortable" | "compact")}>
            <SelectTrigger className="mt-2 max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comfortable">Comfortable</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}

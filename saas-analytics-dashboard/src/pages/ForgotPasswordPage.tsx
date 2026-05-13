import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { sendReset } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";
import { paths } from "@/lib/paths";
import { PRODUCT_NAME } from "@/brand/constants";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FullPageSkeleton } from "@/components/system/FullPageSkeleton";

const schema = z.object({ email: z.string().email() });
type Form = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { user, loading } = useAuth();
  const form = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  if (loading) {
    return <FullPageSkeleton />;
  }
  if (user) {
    return <Navigate to={paths.overview} replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await sendReset(values.email);
      toast.success("If an account exists, a reset email is on the way.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Request failed");
    }
  });

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
      <DocumentTitle title={`Reset password — ${PRODUCT_NAME}`} />
      <Card className="border-0 bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Reset your {PRODUCT_NAME} password</CardTitle>
        <CardDescription>We will email you a reset link when Firebase is configured.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Send reset link
          </Button>
          <Link className="text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground" to={paths.login}>
            Back to sign in
          </Link>
        </CardFooter>
      </form>
    </Card>
    </motion.div>
  );
}

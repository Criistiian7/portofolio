import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { signInEmail } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";
import { paths } from "@/lib/paths";
import { PRODUCT_NAME } from "@/brand/constants";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { FullPageSkeleton } from "@/components/system/FullPageSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type Form = z.infer<typeof schema>;

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const from = location.state?.from ?? paths.overview;

  const form = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  if (loading) {
    return <FullPageSkeleton />;
  }
  if (user) {
    return <Navigate to={paths.overview} replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signInEmail(values.email, values.password);
      toast.success("Signed in");
      navigate(from, { replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sign-in failed");
    }
  });

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
      <DocumentTitle title={`Sign in — ${PRODUCT_NAME}`} />
      <Card className="border-0 bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Welcome to {PRODUCT_NAME}</CardTitle>
        <CardDescription>Sign in to your workspace—mock mode works without Firebase keys.</CardDescription>
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
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Continue
          </Button>
          <div className="flex justify-between text-sm text-muted-foreground">
            <Link className="underline underline-offset-4 hover:text-foreground" to={paths.register}>
              Create account
            </Link>
            <Link className="underline underline-offset-4 hover:text-foreground" to={paths.forgotPassword}>
              Forgot password
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
    </motion.div>
  );
}

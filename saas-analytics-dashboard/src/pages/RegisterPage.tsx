import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { registerEmail } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";
import { paths } from "@/lib/paths";
import { PRODUCT_NAME } from "@/brand/constants";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FullPageSkeleton } from "@/components/system/FullPageSkeleton";

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords must match" });

type Form = z.infer<typeof schema>;

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", confirm: "" },
  });

  if (loading) {
    return <FullPageSkeleton />;
  }
  if (user) {
    return <Navigate to={paths.overview} replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await registerEmail(values.email, values.password);
      toast.success("Account created");
      navigate(paths.overview, { replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Registration failed");
    }
  });

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
      <DocumentTitle title={`Create account — ${PRODUCT_NAME}`} />
      <Card className="border-0 bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Join {PRODUCT_NAME}</CardTitle>
        <CardDescription>Start with email and a strong password—Firebase or mock.</CardDescription>
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
            <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" autoComplete="new-password" {...form.register("confirm")} />
            {form.formState.errors.confirm && (
              <p className="text-sm text-destructive">{form.formState.errors.confirm.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Create account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="underline underline-offset-4 hover:text-foreground" to={paths.login}>
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
    </motion.div>
  );
}

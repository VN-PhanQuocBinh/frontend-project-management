import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/schemas/login.schema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log(data);
    toast.success("Đăng nhập thành công!", {
      description: `Chào mừng ${data.email}!`,
      duration: 4000,
    });
  };

  return (
    <>
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input placeholder="Email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <input type="password" placeholder="Password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <Button disabled={isSubmitting}>Đăng nhập</Button>
      </form>
    </>
  );
}

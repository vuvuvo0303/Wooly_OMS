import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import wooly_logo from "@/assets/images/wooly_logo.png";

// import { Checkbox } from "@/components/ui/checkbox";
// import { useState } from "react";
import loginbg from "@/assets/images/loginbg.png";
import { login } from "@/lib/api/auth-api";
import { toast } from "react-toastify";

import RotatingText from "@/components/RotatingText";
const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(3, "Mật khẩu phải chứa ít nhất 3 ký tự"),
});
const LoginPage = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const loginResult = await login(values.email, values.password);
    if (loginResult.error) {
      form.setError("email", { message: loginResult.error });
      toast.error(loginResult.error.message);
      return;
    } else {
      localStorage.setItem("accessToken", loginResult.data.accessToken);
      toast.success("Đăng nhập thành công");
    }
    navigate("/");
  };
  return (
    <div className="grid grid-cols-12" style={{ backgroundImage: `url(${loginbg})`, backgroundSize: "cover" }}>
      <div className="col-span-6 h-screen overflow-auto rounded-e shadow-md bg-white">
        <div className="bg-white min-h-screen py-16 px-24">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <img src={wooly_logo} alt="" width={70} />
              <h2 className="text-4xl font-bold mt-5">Đăng Nhập</h2>
              <p className="py-2">Wooly Order Management System</p>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ email" type="email" className="py-6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-5">
                    <FormLabel className="font-bold">
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Nhập mật khẩu" className="py-6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between mt-5">
                {/* <div className="items-top flex space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(value) => {
                      setRememberMe(value == true);
                    }}
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Ghi nhớ tài khoản này
                  </label>
                </div> */}
                <Link to="/recover-password" className="text-sm text-orange-500">
                  Quên mật khẩu?
                </Link>
              </div>
              <Button
                className="mt-5 bg-blue-500 hover:bg-orange-600 text-white font-bold p-6 focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Đăng Nhập
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="flex flex-col col-span-6 justify-center items-center">
        <div className="flex  items-center gap-4">
          <span className="font-bold text-6xl mb-3 text-white ">Made</span>
          <RotatingText
            texts={["Cozy ", "Soft ", "Warm ", "Unique !"]}
            mainClassName="px-5 sm:px-5 md:px-5 text-5xl bg-gradient-to-r from-blue-300 to-green-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

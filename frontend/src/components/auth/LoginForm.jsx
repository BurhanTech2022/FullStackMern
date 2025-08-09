import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api/apiClient";

import { extractErrorMessages } from "../util/errorUtils";
import useAuthStore from "../../store/authStore";

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { setAuth } = useAuthStore();

  // State for form values
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post("/auth/login", credentials);

      return response.data;
    },
    onSuccess: (data) => {
      try {
        // Temporarily comment this out
        setAuth(data.user, data.token);
        setIsLoading(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } catch (err) {
        console.error("🔥 Error during onSuccess:", err);
      }
    },
    onError: (err) => {
      console.log("err", err);
      setError(extractErrorMessages(err));
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formValues.email || !formValues.password) {
      setError("All fields are required");
      return;
    }

    loginMutation.mutate({
      email: formValues.email,
      password: formValues.password,
    });
  };

  return (
    <>
      {isLoading? (
        <div className="flex flex-col items-center justify-center py-20">
          <LoaderCircle className="animate-spin w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Logging in... please wait
          </p>
        </div>
      ) : (
        <Card className="w-full border-border">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Signin</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-0">
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-sm font-medium text-left">Email</div>
                  <Input
                    name="email"
                    placeholder="email@email.com"
                    required
                    value={formValues.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-left">Password</div>
                  <Input
                    name="password"
                    type="password"
                    placeholder="*****"
                    required
                    value={formValues.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="py-4">
                  <Button type="submit" className="w-full cursor-pointer">
                    Login Account
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="flex justify-center pt-0">
                <div className="text-center text-sm">
                  Don't have an account?
                  <a
                    onClick={() => navigate("/register")}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    Sign up
                  </a>
                </div>
              </CardFooter>
            </form>
          </CardHeader>
        </Card>
      )}
    </>
  );
};

export default LoginForm;

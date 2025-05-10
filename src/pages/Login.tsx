
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Login = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [defaultSignInValues, setDefaultSignInValues] = useState({ email: "", password: "" });

  const handleSuccessfulSignUp = (email: string, password: string) => {
    setDefaultSignInValues({ email, password });
    setActiveTab("signin");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to VirtualHR</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in or create an account to start practicing interviews
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6 w-full">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <SignInForm 
                  defaultEmail={defaultSignInValues.email} 
                  defaultPassword={defaultSignInValues.password} 
                />
              </TabsContent>

              <TabsContent value="signup">
                <SignUpForm onSuccessfulSignUp={handleSuccessfulSignUp} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;

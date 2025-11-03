import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-50">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-purple-800 text-white p-12 flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome</h2>
          <p className="mb-8 max-w-xs">
            Join Our Unique Platform, Explore a New Experience
          </p>
          <Button
            variant="outline"
            className="bg-transparent border-white text-white rounded-md
                       hover:bg-white hover:text-purple-800 transition-colors cursor-pointer"
          >
            REGISTER
          </Button>
        </div>

        <div className="p-12">
          <h2 className="text-3xl font-bold mb-8 text-purple-800">Sign In</h2>
          <form className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </Label>
              <Input id="email" type="email" className="mt-1" />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </Label>
              <Input id="password" type="password" className="mt-1" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm text-gray-600 font-normal"
                >
                  Remember me
                </Label>
              </div>
              <Button
                variant="link"
                className="text-sm text-purple-800 p-0 h-auto hover:text-purple-600 hover:no-underline cursor-pointer"
              >
                Forgot password?
              </Button>
            </div>

            <Button className="w-full bg-purple-800 hover:bg-purple-900 text-white rounded-md cursor-pointer">
              LOGIN
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-50">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-purple-800 text-white p-12 flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="mb-8 max-w-xs">
            Already have an account? Sign in to access your platform.
          </p>
          <Button
            variant="outline"
            className="bg-transparent border-white text-white rounded-md
                       hover:bg-white hover:text-purple-800 transition-colors cursor-pointer"
          >
            SIGN IN
          </Button>
        </div>

        <div className="p-12">
          <h2 className="text-3xl font-bold mb-8 text-purple-800">
            Create Account
          </h2>
          <form className="space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600"
              >
                Name
              </Label>
              <Input id="name" type="text" className="mt-1" />
            </div>

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

            <div>
              <Label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-600"
              >
                Confirm Password
              </Label>
              <Input id="confirm-password" type="password" className="mt-1" />
            </div>

            <Button className="w-full bg-purple-800 hover:bg-purple-900 text-white rounded-md mt-4 cursor-pointer">
              REGISTER
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

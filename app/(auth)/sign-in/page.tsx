import { GoogleSignInButton } from "@/components/features/auth/google-sign-in-button";
import { SignInForm } from "@/components/features/auth/sign-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Connexion | ComboTrack",
};

export default function SignInPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte ComboTrack
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                Ou
              </span>
            </div>
          </div>

          <GoogleSignInButton />
        </CardContent>
      </Card>
    </div>
  );
}

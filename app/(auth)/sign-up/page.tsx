import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpForm } from "@/components/features/auth/sign-up-form";
import { GoogleSignInButton } from "@/components/features/auth/google-sign-in-button";

export const metadata = {
  title: "Créer un compte | ComboTrack",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>
            Rejoignez ComboTrack pour suivre vos combos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
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

import { LoaderCircle } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoaderCircle className="animate-spin" size={48} />
    </div>
  );
}

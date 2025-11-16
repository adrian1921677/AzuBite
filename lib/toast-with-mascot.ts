import toast from "react-hot-toast";
import { Mascot } from "@/components/ui/mascot";

// Custom Toast mit Maskottchen für Erfolgsmeldungen
export function successToast(message: string) {
  toast.success(message, {
    icon: (
      <div className="flex items-center">
        <Mascot size="sm" variant="success" animated />
      </div>
    ),
    duration: 4000,
  });
}


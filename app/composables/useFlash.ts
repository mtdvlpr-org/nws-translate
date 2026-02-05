import type { Toast } from "@nuxt/ui/runtime/composables/useToast.js";

type Options = Partial<Toast> & { id: string };

export default function () {
  const toast = useToast();

  const show = async (options: Options) => {
    // Prevent duplicate toasts with the same ID
    if (toast.toasts.value.some((toast) => toast.id === options.id)) {
      toast.remove(options.id);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    toast.add(options);
  };

  const showError = (options: Options) => {
    show({
      color: "error",
      icon: "i-lucide:circle-alert",
      title: "Er is iets fout gegaan",
      ...options,
    });
  };

  const showInfo = (options: Options) => {
    show({
      color: "info",
      icon: "i-lucide:info",
      title: "Info",
      ...options,
    });
  };

  const showWarning = (options: Options) => {
    show({
      color: "warning",
      icon: "i-lucide:triangle-alert",
      title: "Waarschuwing",
      ...options,
    });
  };

  const showSuccess = (options: Partial<Toast> & { id: string }) => {
    show({
      color: "success",
      icon: "i-lucide:circle-check",
      title: "Succes",
      ...options,
    });
  };

  return {
    show,
    showError,
    showInfo,
    showSuccess,
    showWarning,
  };
}

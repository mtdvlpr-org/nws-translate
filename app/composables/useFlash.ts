import type { Toast } from "@nuxt/ui/runtime/composables/useToast.js";

export default function () {
  const toast = useToast();

  const show = (options: Partial<Toast>) => {
    // Prevent duplicate toasts with the same ID
    if (
      options.id &&
      toast.toasts.value.some((toast) => toast.id === options.id)
    )
      return;
    toast.add(options);
  };

  const showError = (options: Partial<Toast>) => {
    show({
      color: "error",
      icon: "i-lucide:circle-alert",
      title: "Er is iets fout gegaan",
      ...options,
    });
  };

  const showInfo = (options: Partial<Toast>) => {
    show({
      color: "info",
      icon: "i-lucide:info",
      title: "Info",
      ...options,
    });
  };

  const showWarning = (options: Partial<Toast>) => {
    show({
      color: "warning",
      icon: "i-lucide:triangle-alert",
      title: "Waarschuwing",
      ...options,
    });
  };

  const showSuccess = (options: Partial<Toast>) => {
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

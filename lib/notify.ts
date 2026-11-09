import { toast } from "sonner"

/**
 * Runs an RTK Query mutation (pass `() => trigger(arg).unwrap()`) and
 * reports the outcome via toast. Resolves to `true` on success.
 */
export async function runWithToast(
  action: () => Promise<unknown>,
  successMessage: string
): Promise<boolean> {
  try {
    await action()
    toast.success(successMessage)
    return true
  } catch (e) {
    const message =
      typeof e === "object" && e !== null && "message" in e
        ? String((e as { message: unknown }).message)
        : "Something went wrong"
    toast.error(message)
    return false
  }
}

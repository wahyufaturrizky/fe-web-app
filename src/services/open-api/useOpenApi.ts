import { useMutation } from "@tanstack/react-query";
import { clientFormData } from "../client";

function useCreateOpenApi({ options }: { options?: any }) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      clientFormData("/matcher", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

export { useCreateOpenApi };

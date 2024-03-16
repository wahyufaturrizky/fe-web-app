import { useMutation } from "@tanstack/react-query";
import { clientOpenApi } from "../client";

function useCreateOpenApi({ options }: { options?: any }) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      clientOpenApi("/chat/completions", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

export { useCreateOpenApi };
